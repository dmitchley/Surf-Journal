export interface User {
  id?: number;
  username: string;
  email: string;
  password: string;
  role?: 'admin' | 'user';
}


declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}