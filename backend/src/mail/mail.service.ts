import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;
  private readonly mailUser: string;

  constructor(private readonly configService: ConfigService) {
    this.mailUser = this.configService.get<string>('MAIL_USER')!;
    const mailPassword = this.configService.get<string>('MAIL_PASSWORD')!;

    if (!this.mailUser || !mailPassword) {
      this.logger.error('Missing MAIL_USER or MAIL_PASSWORD in configuration.');
    }

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.mailUser,
        pass: mailPassword,
      },
    });
  }

  async sendTestEmail(to: string): Promise<any> {
    this.logger.log(`Test email requested for: ${to}`);

    try {
      const info = await this.transporter.sendMail({
        from: `"SalahMate" <${this.mailUser}>`,
        to: to,
        subject: 'SalahMate Email Service Test',
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #4CAF50;">Congratulations!</h2>
            <p>Your SalahMate backend is successfully connected to Nodemailer with Gmail SMTP.</p>
            <p>This is a professional HTML email test to ensure the MailService is fully operational.</p>
            <br />
            <p>Regards,<br />The SalahMate Team</p>
          </div>
        `,
      });

      this.logger.log(
        `Test email sent successfully to ${to} with message ID: ${info.messageId}`,
      );
      return {
        success: true,
        message: 'Test email sent successfully',
        id: info.messageId,
      };
    } catch (error: any) {
      this.logger.error(`Test email failed: ${error.message}`, error.stack);
      throw new InternalServerErrorException(
        'An error occurred while sending the test email',
      );
    }
  }

  async sendOTP(email: string, otp: string): Promise<any> {
    this.logger.log(`OTP email requested for: ${email}`);

    try {
      const info = await this.transporter.sendMail({
        from: `"SalahMate Security" <${this.mailUser}>`,
        to: email,
        subject: 'Your SalahMate Verification Code',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h1 style="color: #1a73e8; margin: 0;">SalahMate</h1>
            </div>
            <div style="color: #333; line-height: 1.6;">
              <p>Assalamu Alaikum,</p>
              <p>You recently requested to verify your email address. Please use the verification code below to complete the process:</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <span style="display: inline-block; padding: 15px 30px; background-color: #f4f6f8; color: #1a73e8; font-size: 32px; font-weight: bold; letter-spacing: 4px; border-radius: 8px;">
                  ${otp}
                </span>
              </div>
              
              <p style="color: #666; font-size: 14px; text-align: center;">
                This code will expire in 15 minutes. If you didn't request this, you can safely ignore this email.
              </p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
              <p style="font-size: 12px; color: #999; text-align: center;">
                Regards,<br>
                SalahMate Team<br><br>
                Designed & Developed by<br>
                Tayyab Mehboob<br><br>
                &copy; 2026 SalahMate<br>
                This is an automated message, please do not reply.
              </p>
            </div>
          </div>
        `,
      });

      this.logger.log(
        `OTP email sent successfully to ${email} with message ID: ${info.messageId}`,
      );
      return {
        success: true,
        message: 'OTP email sent successfully',
        id: info.messageId,
      };
    } catch (error: any) {
      this.logger.error(`OTP email failed: ${error.message}`, error.stack);
      throw new InternalServerErrorException(
        'An error occurred while sending the OTP email',
      );
    }
  }

  async sendVerificationOtp(
    email: string,
    fullName: string,
    otp: string,
  ): Promise<any> {
    this.logger.log(`Verification OTP email requested for: ${email}`);

    try {
      const info = await this.transporter.sendMail({
        from: `"SalahMate Security" <${this.mailUser}>`,
        to: email,
        subject: 'Verify your SalahMate account',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h1 style="color: #1a73e8; margin: 0;">SalahMate</h1>
            </div>
            <div style="color: #333; line-height: 1.6;">
              <p>Assalamu Alaikum ${fullName},</p>
              <p>Thank you for registering with SalahMate. To verify your account, please use the 6-digit verification code below:</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <span style="display: inline-block; padding: 15px 30px; background-color: #f4f6f8; color: #1a73e8; font-size: 32px; font-weight: bold; letter-spacing: 4px; border-radius: 8px;">
                  ${otp}
                </span>
              </div>
              
              <p style="color: #666; font-size: 14px; text-align: center;">
                This code will expire in 10 minutes. If you didn't create an account, you can safely ignore this message.
              </p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
              <p style="font-size: 12px; color: #999; text-align: center;">
                Regards,<br>
                SalahMate Team<br><br>
                Designed & Developed by<br>
                Tayyab Mehboob<br><br>
                &copy; 2026 SalahMate<br>
                This is an automated message, please do not reply.
              </p>
            </div>
          </div>
        `,
      });

      this.logger.log(
        `Verification OTP email sent successfully to ${email} with message ID: ${info.messageId}`,
      );
      return {
        success: true,
        message: 'Verification OTP email sent successfully',
        id: info.messageId,
      };
    } catch (error: any) {
      this.logger.error(
        `Verification OTP email failed: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'An error occurred while sending the Verification OTP email',
      );
    }
  }

  async sendPasswordResetOtp(
    email: string,
    fullName: string,
    otp: string,
  ): Promise<any> {
    this.logger.log(`Password reset OTP email requested for: ${email}`);

    try {
      const info = await this.transporter.sendMail({
        from: `"SalahMate Security" <${this.mailUser}>`,
        to: email,
        subject: 'Reset your SalahMate password',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h1 style="color: #1a73e8; margin: 0;">SalahMate</h1>
            </div>
            <div style="color: #333; line-height: 1.6;">
              <p>Assalamu Alaikum ${fullName},</p>
              <p>We received a request to reset your password for your SalahMate account. Please use the 6-digit verification code below to proceed:</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <span style="display: inline-block; padding: 15px 30px; background-color: #f4f6f8; color: #1a73e8; font-size: 32px; font-weight: bold; letter-spacing: 4px; border-radius: 8px;">
                  ${otp}
                </span>
              </div>
              
              <p style="color: #666; font-size: 14px; text-align: center;">
                This code will expire in 10 minutes. If you didn't request a password reset, you can safely ignore this message. Your password will remain unchanged.
              </p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
              <p style="font-size: 12px; color: #999; text-align: center;">
                Regards,<br>
                SalahMate Team<br><br>
                Designed & Developed by<br>
                Tayyab Mehboob<br><br>
                &copy; 2026 SalahMate<br>
                This is an automated message, please do not reply.
              </p>
            </div>
          </div>
        `,
      });

      this.logger.log(
        `Password reset OTP email sent successfully to ${email} with message ID: ${info.messageId}`,
      );
      return {
        success: true,
        message: 'Password reset OTP email sent successfully',
        id: info.messageId,
      };
    } catch (error: any) {
      this.logger.error(
        `Password reset OTP email failed: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'An error occurred while sending the password reset OTP email',
      );
    }
  }
}
