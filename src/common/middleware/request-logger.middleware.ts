import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const requestId = uuidv4();
    const tenantId = req.headers['x-tenant-id'] as string || 'unknown';
    const start = Date.now();

    res.on('finish', () => {
      const latency = Date.now() - start;
      this.logger.log(
        JSON.stringify({
          requestId,
          tenantId,
          method: req.method,
          path: req.path,
          statusCode: res.statusCode,
          latencyMs: latency,
          outcome: res.statusCode < 400 ? 'success' : 'error',
          timestamp: new Date().toISOString(),
        }),
      );
    });

    (req as any).requestId = requestId;
    next();
  }
}
