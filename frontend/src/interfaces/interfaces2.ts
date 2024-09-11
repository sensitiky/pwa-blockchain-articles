export interface User {
  firstName?: string;
  lastName?: string;
  date?: Date | null;
  email?: string;
  user?: string;
  country?: string;
  medium?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  bio?: string;
  avatar?: string;
  postCount?: number;
  role?: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  description: string;
  imageUrl: { type: string; data: number[] } | null;
  imageUrlBase64?: string;
  category: { name: string };
  comments: { id: number; content: string }[];
  favorites: { id: number }[];
  createdAt: string;
  tags: { id: number; name: string }[];
}
