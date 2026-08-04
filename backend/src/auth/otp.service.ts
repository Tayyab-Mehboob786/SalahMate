import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { SALT_ROUNDS } from './auth.constants';

@Injectable()
export class OtpService {
  /**
   * Generates a secure 6-digit numeric OTP
   */
  generateOtp(): string {
    // Generate a secure random integer between 100000 and 999999
    const otp = crypto.randomInt(100000, 1000000);
    return otp.toString();
  }

  /**
   * Hashes the plain OTP for secure storage
   */
  async hashOtp(otp: string): Promise<string> {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return bcrypt.hash(otp, salt);
  }
}
