export interface UserInfo {
  firstName?: string;
  lastName?: string;
  date?: Date;
  email?: string;
  user?: string;
  country?: string;
  medium?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  bio?: string;
}

export interface User {
  id: number;
  firstName?: string;
  lastName?: string;
  date?: Date;
  email?: string;
  user?: string;
  country?: string;
  medium?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  stackernews?: string;
  bio?: string;
  avatar?: string;
  postCount?: number;
  role?: string;
  token?: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  imageUrlBase64: string | null;
  createdAt: string;
  description: string | object;
  author?: Author;
  category?: { name: string };
  tags: { name: string }[];
  comments: Comment[];
  favorites: number;
}

export interface Author {
  id: number;
  user: string;
  firstName: string;
  lastName: string;
  bio: string;
  twitter?: string;
  linkedin?: string;
  facebook?: string;
  avatar?: string;
}

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  author: { id: number; firstName: string; lastName: string; user: string };
  favorites: number;
}

export interface Tag {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface EditPostDto {
  title: string;
  content: string;
  description: string;
  imageUrl: string | null | File;
  imagePreviewUrl?: string | null;
}
