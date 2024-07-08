export interface User {
  id?: number;
  username: string;
  name?: string;
  email: string;
  password: string;
}

export const mockUser: User = {
  id: 1,
  username: 'testuser',
  name: 'Test User',
  email: 'test@example.com',
  password: 'testpassword',
};
