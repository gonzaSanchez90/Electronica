export type ProductCategory = 'TV' | 'Audio' | 'Computación' | 'Móvil' | 'Consolas' | 'Cocina' | 'Hogar' | 'Otros';

export type ProductCondition = 'new' | 'refurbished';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  condition: ProductCondition;
  imageUrl: string;
}

export interface QuoteRequest {
  id: string;
  customerName: string;
  contact: string;
  deviceType: string;
  customDeviceType?: string; // For 'Other' selection
  issueDescription: string;
  date: string;
  status: 'Pendiente' | 'Contactado' | 'Cerrado';
}

export interface Invoice {
  id: string;
  name: string;
  url: string;
  amount: number;
  date: string;
  fileType: string;
}

export enum Page {
  HOME = 'home',
  QUOTE = 'quote',
  SHOP = 'shop',
  ADMIN = 'admin',
  LOGIN = 'login'
}

export enum AdminView {
  DASHBOARD = 'dashboard',
  PRODUCTS = 'products',
  QUOTES = 'quotes',
  CONTENT = 'content',
  BILLING = 'billing'
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}

export interface SiteConfig {
  heroTitle: string;
  heroSubtitle: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  openingHours: string;
}

export interface AnalyticsStats {
  totalVisits: number;
  quoteRequests: number;
  chatbotInteractions: number;
  lastVisit: string;
}

export interface VisitorLog {
  id: string;
  action: string;
  timestamp: string;
  userType: 'Nuevo' | 'Recurrente';
  details: string;
}