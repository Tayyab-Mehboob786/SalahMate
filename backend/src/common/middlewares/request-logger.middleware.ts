import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';
    const startAt = process.hrtime();

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');
      const diff = process.hrtime(startAt);
      const responseTime = Math.round(diff[0] * 1e3 + diff[1] * 1e-6);

      this.logger.log(
        `[${method}] ${originalUrl} ${statusCode} ${responseTime}ms - ${contentLength} - ${userAgent} ${ip}`,
      );
    });

    next();
  }
}
