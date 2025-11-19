export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  googleId: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface AuthRequest extends Express.Request {
  user?: User;
}

