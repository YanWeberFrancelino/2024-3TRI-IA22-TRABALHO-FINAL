import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';

export const corsOptions = cors({
  origin: ['http://127.0.0.1:4060', 'http://localhost:4060'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
});

const isStaticAsset = (url: string) =>
    url.startsWith('/assets') || url.endsWith('.css') || url.endsWith('.js') || url.endsWith('.png') || url.endsWith('.jpg') || url.endsWith('.ico');


export const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, 
    max: 100, 
    handler: (req: Request, res: Response, next: NextFunction) => {
      if (isStaticAsset(req.url)) {
        next(); 
      } else {
        res.status(429).sendFile(path.join(__dirname, '../../public/ratelimit.html'));
      }
    },
  });

export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'", 
        "'unsafe-eval'",   
        'https://cdn.jsdelivr.net',
        'https://unpkg.com',
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'", 
        'https://fonts.googleapis.com',
      ],
      imgSrc: ["'self'", 'data:'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      connectSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false,
});

export const hidePoweredBy = (req: Request, res: Response, next: NextFunction) => {
  res.removeHeader('X-Powered-By');
  next();
};
