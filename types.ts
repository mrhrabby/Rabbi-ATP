
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

export type AppMode = 'public' | 'admin_dashboard';
export type AdminSection = 'overview' | 'manage_info' | 'manage_cats' | 'backups';
export type ViewType = 'dashboard' | 'category-detail' | 'about';
