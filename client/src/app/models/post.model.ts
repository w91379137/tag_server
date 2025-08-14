export interface Tag {
  id: number;
  name: string;
  color: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  excerpt?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  tags: Tag[];
}