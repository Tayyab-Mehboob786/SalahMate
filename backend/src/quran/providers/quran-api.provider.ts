import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { QuranProviderInterface } from '../interfaces/quran-provider.interface';
import { Surah, Ayah, Page, Juz, Translation } from '../models/quran.models';
import { firstValueFrom } from 'rxjs';

interface CacheEntry<T> {
  data: T;
  expiry: number;
}

@Injectable()
export class QuranApiProvider implements QuranProviderInterface {
  private readonly logger = new Logger(QuranApiProvider.name);
  
  // OAuth Token State
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;
  
  // Data Caches
  private surahCache: CacheEntry<Surah[]> | null = null;
  private juzCache: Map<number, CacheEntry<Juz>> = new Map();
  private translationsCache: CacheEntry<Translation[]> | null = null;

  // Config Cache
  private readonly authUrl: string;
  private readonly apiUrl: string;
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly environment: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.clientId = this.configService.get<string>('QF_CLIENT_ID', '');
    this.clientSecret = this.configService.get<string>('QF_CLIENT_SECRET', '');
    this.environment = this.configService.get<string>('QF_ENV', 'prelive');

    if (this.environment === 'production') {
      this.authUrl = 'https://oauth2.quran.foundation';
      this.apiUrl = 'https://apis.quran.foundation';
    } else {
      this.authUrl = 'https://prelive-oauth2.quran.foundation';
      this.apiUrl = 'https://apis-prelive.quran.foundation';
    }
  }

  /**
   * Retrieves a valid OAuth2 Access Token using Basic Auth.
   */
  private async getAccessToken(): Promise<string> {
    const now = Date.now();
    
    // Check if we have a valid token (with 60-second buffer)
    if (this.accessToken && this.tokenExpiry > now + 60000) {
      return this.accessToken;
    }

    this.logger.log(`Requesting new OAuth2 Client Credentials from ${this.authUrl}...`);
    
    try {
      const basicAuth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
      
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.authUrl}/oauth2/token`,
          'grant_type=client_credentials&scope=content',
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Authorization: `Basic ${basicAuth}`,
            },
            timeout: 10000,
          }
        )
      );

      this.accessToken = response.data.access_token;
      // expires_in is in seconds
      this.tokenExpiry = now + (response.data.expires_in * 1000);
      
      this.logger.log('Successfully acquired new OAuth2 access token');
      return this.accessToken!;
    } catch (error: any) {
      this.logger.error(`OAuth Authentication Failed: [${error.response?.status}] ${error.response?.data?.error_description || error.message}`);
      throw new HttpException('Quran Provider Authentication Failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Wrapper for making authenticated HTTP requests to the Content API.
   * Includes exactly-once retry logic for 401 Unauthorized errors.
   */
  private async makeRequest<T>(endpoint: string, params: any = {}, retryCount = 0): Promise<T> {
    try {
      const token = await this.getAccessToken();
      
      const response = await firstValueFrom(
        this.httpService.get<T>(`${this.apiUrl}${endpoint}`, {
          headers: {
            'x-auth-token': token,
            'x-client-id': this.clientId,
            Accept: 'application/json',
          },
          params,
          timeout: 10000,
        })
      );
      
      return response.data;
    } catch (error: any) {
      const status = error.response?.status;
      
      if (status === 401) {
        if (retryCount === 0) {
          this.logger.warn('Content API returned 401 Unauthorized. Clearing token and retrying exactly once.');
          this.accessToken = null;
          this.tokenExpiry = 0;
          return this.makeRequest<T>(endpoint, params, 1);
        } else {
          this.logger.error('Content API returned 401 Unauthorized again after retry.');
        }
      }

      if (status === 429) {
        throw new HttpException('Rate limit exceeded', HttpStatus.TOO_MANY_REQUESTS);
      }
      if (status === 404) {
        throw new HttpException('The requested resource could not be found', HttpStatus.NOT_FOUND);
      }

      const errorMsg = error.response?.data?.message || error.message;
      this.logger.error(`Content API Request Failed: [${endpoint}] Status: ${status} - ${errorMsg}`);
      
      throw new HttpException(
        'Quran Provider Unavailable',
        status >= 500 && status < 600 ? HttpStatus.SERVICE_UNAVAILABLE : (status || HttpStatus.INTERNAL_SERVER_ERROR)
      );
    }
  }

  // --- Implementation of QuranProviderInterface ---

  async getSurahs(): Promise<Surah[]> {
    const now = Date.now();
    if (this.surahCache && this.surahCache.expiry > now) {
      return this.surahCache.data;
    }

    // Use correct Content API path
    const data = await this.makeRequest<any>('/content/api/v4/chapters');
    const chapters = data.chapters || [];
    
    const mapped: Surah[] = chapters.map((c: any) => ({
      id: c.id,
      nameSimple: c.name_simple,
      nameArabic: c.name_arabic,
      nameTranslated: c.translated_name?.name || '',
      versesCount: c.verses_count,
      revelationPlace: c.revelation_place,
    }));

    // Cache for 24 hours (static metadata)
    this.surahCache = { data: mapped, expiry: now + 86400000 };
    return mapped;
  }

  async getSurah(id: number): Promise<Surah | null> {
    if (this.surahCache && this.surahCache.expiry > Date.now()) {
      return this.surahCache.data.find(s => s.id === id) || null;
    }

    try {
      const data = await this.makeRequest<any>(`/content/api/v4/chapters/${id}`);
      const c = data.chapter;
      if (!c) return null;
      return {
        id: c.id,
        nameSimple: c.name_simple,
        nameArabic: c.name_arabic,
        nameTranslated: c.translated_name?.name || '',
        versesCount: c.verses_count,
        revelationPlace: c.revelation_place,
      };
    } catch {
      return null;
    }
  }

  async getPage(pageNumber: number): Promise<Page> {
    const data = await this.makeRequest<any>(`/content/api/v4/verses/by_page/${pageNumber}`, {
      words: false,
      fields: 'text_uthmani',
    });

    const verses = data.verses || [];
    const mappedAyahs: Ayah[] = verses.map((v: any) => ({
      id: v.id,
      surahId: parseInt(v.verse_key.split(':')[0], 10),
      verseNumber: v.verse_number,
      verseKey: v.verse_key,
      textUthmani: v.text_uthmani,
      pageNumber: v.page_number,
      juzNumber: v.juz_number,
      hizbNumber: v.hizb_number,
    }));

    return {
      pageNumber,
      ayahs: mappedAyahs,
    };
  }

  async getJuz(juzNumber: number): Promise<Juz> {
    const now = Date.now();
    const cached = this.juzCache.get(juzNumber);
    if (cached && cached.expiry > now) {
      return cached.data;
    }

    const data = await this.makeRequest<any>(`/content/api/v4/verses/by_juz/${juzNumber}`, {
      fields: 'text_uthmani',
      per_page: 500,
    });

    const verses = data.verses || [];
    const mappedAyahs: Ayah[] = verses.map((v: any) => ({
      id: v.id,
      surahId: parseInt(v.verse_key.split(':')[0], 10),
      verseNumber: v.verse_number,
      verseKey: v.verse_key,
      textUthmani: v.text_uthmani,
      pageNumber: v.page_number,
      juzNumber: v.juz_number,
      hizbNumber: v.hizb_number,
    }));

    const result: Juz = { juzNumber, ayahs: mappedAyahs };
    this.juzCache.set(juzNumber, { data: result, expiry: now + 86400000 });
    return result;
  }

  async getAyahs(surahId: number, from?: number, to?: number): Promise<Ayah[]> {
    return [];
  }

  async search(query: string): Promise<Ayah[]> {
    const data = await this.makeRequest<any>('/content/api/v4/search', { q: query });
    const results = data.search?.results || [];
    
    return results.map((r: any) => ({
      id: r.verse_id,
      surahId: r.chapter_id,
      verseNumber: parseInt(r.verse_key.split(':')[1], 10),
      verseKey: r.verse_key,
      textUthmani: r.text,
      pageNumber: 1,
      juzNumber: 1,
      hizbNumber: 1,
    }));
  }

  async getTranslations(): Promise<Translation[]> {
    const now = Date.now();
    if (this.translationsCache && this.translationsCache.expiry > now) {
      return this.translationsCache.data;
    }

    const data = await this.makeRequest<any>('/content/api/v4/resources/translations');
    const trans = data.translations || [];
    
    const mapped: Translation[] = trans.map((t: any) => ({
      id: t.id,
      name: t.name,
      authorName: t.author_name,
      languageName: t.language_name,
    }));

    this.translationsCache = { data: mapped, expiry: now + 86400000 };
    return mapped;
  }

  async getAudio(): Promise<any[]> {
    const data = await this.makeRequest<any>('/content/api/v4/resources/recitations');
    return data.recitations || [];
  }
}
