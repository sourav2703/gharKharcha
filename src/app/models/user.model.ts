export interface User {
  id: number;
  name: string;
  username: string;
  password: string;
  role: 'admin' | 'user';
  homeId?: number;
}