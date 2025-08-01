export interface JwtPayload {
  sub: number; // user ID
  email: string;
  username: string;
  role?: string;
  iat?: number;
  exp?: number;
}
