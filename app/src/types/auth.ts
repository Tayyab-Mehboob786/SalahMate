export interface User {
  id: string;
  email: string;
  fullName: string;
  avatar?: string;
  theme?: string;
  country?: string;
  city?: string;
  timezone?: string;
  isEmailVerified: boolean;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user?: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}
