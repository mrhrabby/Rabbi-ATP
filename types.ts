
export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  image?: string; // Base64 or URL for category image
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
  image?: string; // Base64 or URL for institution image
}

export type AppMode = 'public' | 'admin_dashboard';
export type AdminSection = 'overview' | 'manage_info' | 'manage_cats' | 'backups';
export type ViewType = 'dashboard' | 'category-detail' | 'about';
