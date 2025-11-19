export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface  User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  googleId: string;
}

