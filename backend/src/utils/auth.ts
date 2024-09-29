import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db';

interface JwtPayload {
  id: number;
}

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      if (!token) {
        res.status(401).json({ message: 'Not authorized, token missing' });
        return; // Ensure the function exits after responding
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

      const result = await db.query('SELECT id, username, email, role FROM users WHERE id = $1', [
        decoded.id,
      ]);

      req.user = result.rows[0];

      if (!req.user) {
        res.status(401).json({ message: 'Not authorized, user not found' });
        return; // Ensure the function exits after responding
      }

      next();
    } catch (error) {
      console.error('Error in protect middleware:', error);
      res.status(401).json({ message: 'Not authorized, token invalid' });
      return; // Ensure the function exits after responding
    }
  } else {
    res.status(401).json({ message: 'Not authorized, token missing' });
    return; // Ensure the function exits after responding
  }
};
