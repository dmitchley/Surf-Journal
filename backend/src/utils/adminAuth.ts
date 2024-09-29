import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db';

interface JwtPayload {
  id: number;
}

export const protectAdmin = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

      const result = await db.query('SELECT id, username, email, role FROM users WHERE id = $1', [
        decoded.id,
      ]);

      req.user = result.rows[0];

      if (req.user && req.user.role === 'admin') {
        next();
      } else {
        res.status(403).json({ message: 'Access denied: Admins only' });
      }
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized' });
    }
  } else {
    res.status(401).json({ message: 'Access denied: Admins only' });
  }
};
