
export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface InfoItem {
  id: string;
  categoryId: string;
  title: string;
  type?: string;
  address: string;
  established?: string;
  phone: string;
  mapLink?: string;
  specialty?: string;
  timing?: string;
  route?: string;
  details?: string;
}

export type ViewType = 'home' | 'dashboard' | 'category-detail' | 'about' | 'contact';

// Added GitHubConfig interface for sync settings
export interface GitHubConfig {
  token: string;
  owner: string;
  repo: string;
  path: string;
}

// Added Content interface for dynamic dashboard data
export interface Content {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt?: string;
}
