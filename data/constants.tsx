import React from 'react';
import { Product, SiteConfig, AnalyticsStats, VisitorLog } from '../types';
import { Tv, Speaker, Monitor, Smartphone, Gamepad2, Utensils, Zap, Wrench } from 'lucide-react';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Smart TV Samsung 55" 4K',
    description: 'Restaurado a nuevo. Panel LED reemplazado. Garantía de 6 meses.',
    price: 350,
    category: 'TV',
    condition: 'refurbished',
    imageUrl: 'https://picsum.photos/id/400/800/600'
  },
  {
    id: '2',
    name: 'Auriculares Inalámbricos Sony',
    description: 'Producto Nuevo en caja cerrada. Cancelación de ruido.',
    price: 120,
    category: 'Audio',
    condition: 'new',
    imageUrl: 'https://picsum.photos/id/145/800/600'
  },
  {
    id: '3',
    name: 'Monitor LG Ultrawide 29"',
    description: 'Perfecto estado. Ideal para productividad. Incluye cables originales.',
    price: 180,
    category: 'Computación',
    condition: 'refurbished',
    imageUrl: 'https://picsum.photos/id/3/800/600'
  },
  {
    id: '4',
    name: 'Cargador Rápido USB-C',
    description: 'Accesorio original nuevo. 25W.',
    price: 25,
    category: 'Móvil',
    condition: 'new',
    imageUrl: 'https://picsum.photos/id/21/800/600'
  }
];

export const INITIAL_CONFIG: SiteConfig = {
  heroTitle: 'Electrónica L & G',
  heroSubtitle: 'Soluciones integrales para tu hogar. Venta de accesorios nuevos y reparación experta de dispositivos.',
  contactEmail: 'hola@electronicalyg.com',
  contactPhone: '+34 600 123 456',
  address: 'Calle Tecnológica 123, Ciudad Futura',
  openingHours: 'Lun - Vie: 9:00 - 20:00'
};

export const INITIAL_ANALYTICS: AnalyticsStats = {
  totalVisits: 1240,
  quoteRequests: 15,
  chatbotInteractions: 42,
  lastVisit: new Date().toISOString()
};

export const INITIAL_LOGS: VisitorLog[] = [
  { id: '1', action: 'Visita', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), userType: 'Nuevo', details: 'Landing Page' },
  { id: '2', action: 'Interacción', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), userType: 'Recurrente', details: 'Chatbot: Pregunta horario' },
  { id: '3', action: 'Presupuesto', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), userType: 'Nuevo', details: 'Solicitud enviada: TV' },
  { id: '4', action: 'Visita', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), userType: 'Nuevo', details: 'Sección Tienda' },
];

export const APPLIANCE_TYPES = [
  { id: 'tv', label: 'TV & Video', icon: <Tv size={28} />, img: 'https://picsum.photos/id/400/200/200' },
  { id: 'audio', label: 'Audio/HIFI', icon: <Speaker size={28} />, img: 'https://picsum.photos/id/145/200/200' },
  { id: 'pc', label: 'Computación', icon: <Monitor size={28} />, img: 'https://picsum.photos/id/0/200/200' },
  { id: 'mobile', label: 'Móvil/Tablet', icon: <Smartphone size={28} />, img: 'https://picsum.photos/id/160/200/200' },
  { id: 'console', label: 'Consola', icon: <Gamepad2 size={28} />, img: 'https://picsum.photos/id/96/200/200' },
  { id: 'kitchen', label: 'Peq. Electro (Cocina)', icon: <Utensils size={28} />, img: 'https://picsum.photos/id/292/200/200' },
  { id: 'home', label: 'Hogar & Climatización', icon: <Zap size={28} />, img: 'https://picsum.photos/id/250/200/200' },
  { id: 'other', label: 'Otros / Varios', icon: <Wrench size={28} />, img: 'https://picsum.photos/id/175/200/200' },
];