export type Category = {
  id: number;
  name: string;
};

export interface Post {
  id: number;
  title: string;
  content: string;
  imageUrlBase64: string | null;
  createdAt: string;
  description: string;
  author?: { id: number; user: string; avatar?: string; role: string };
  category?: Category;
  comments: Comment[];
  favorites: number;
  tags: Tag[];
  commentscount: number;
  favoritescount: number;
}

export interface Tag {
  id: number;
  name: string;
}
