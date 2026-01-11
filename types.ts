
export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Content {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: number;
}

export interface GitHubConfig {
  token: string;
  owner: string;
  repo: string;
  path: string;
}

export type View = 'home' | 'admin' | 'category-detail';
