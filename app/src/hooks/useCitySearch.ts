import { useState, useEffect } from 'react';
import { LocationData } from '@/context/LocationContext';

export const useCitySearch = (query: string) => {
  const [results, setResults] = useState<LocationData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    const fetchCities = async () => {
      setIsLoading(true);
      try {
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=10&language=en&format=json`;
        const response = await fetch(url);
        const data = await response.json();
        
        console.log(`[CitySearch] City source: Open-Meteo API`);
        console.log(`[CitySearch] Search text: "${query}"`);

        if (data && data.results) {
          const cities: LocationData[] = data.results.map((item: any) => ({
            city: item.name,
            country: item.country || item.admin1 || 'Unknown Country',
            latitude: item.latitude,
            longitude: item.longitude,
          }));

          // Deduplicate by city + country
          const uniqueCities = cities.filter(
            (city, index, self) =>
              index === self.findIndex((t) => t.city === city.city && t.country === city.country)
          );

          console.log(`[CitySearch] Number of cities loaded: ${uniqueCities.length}`);
          console.log(`[CitySearch] First 5 cities:`, uniqueCities.slice(0, 5).map(c => `${c.city}, ${c.country}`));
          
          setResults(uniqueCities);
        } else {
          console.log(`[CitySearch] Number of cities loaded: 0`);
          setResults([]);
        }
      } catch (error) {
        console.error('[CitySearch] Error fetching cities:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchCities();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  return { results, isLoading };
};
