import { Request, Response, NextFunction } from 'express';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = process.env.API_SECRET_TOKEN;

  if (!token) {
    return res.status(500).json({ 
      success: false, 
      error: 'API_SECRET_TOKEN not configured' 
    });
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      success: false, 
      error: 'Missing or invalid authorization header' 
    });
  }

  const providedToken = authHeader.substring(7);

  if (providedToken !== token) {
    return res.status(401).json({ 
      success: false, 
      error: 'Invalid token' 
    });
  }

  next();
}
