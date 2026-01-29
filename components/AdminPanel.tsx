import React, { useState } from 'react';
import { Page, Product, QuoteRequest, AdminView, SiteConfig, AnalyticsStats, VisitorLog, Invoice } from '../types';
import {
  User, LayoutDashboard, FileText, ShoppingBag, Settings, Activity as ActivityIcon, Clock,
  BarChart3, Plus, Trash2, Upload, Search, CheckCircle, PenTool, Camera,
  FileSpreadsheet, Receipt, Sparkles, Loader2, Calendar, Pencil
} from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { sendMessageToGemini } from '../services/geminiService';

// --- STABLE SUB-COMPONENTS ---
// These are defined outside to ensure they have a stable identity across AdminPanel re-renders,
// which is critical to prevent focus loss in input fields.

const DashboardSection: React.FC<{ analytics: AnalyticsStats; visitorLogs: VisitorLog[]; productsCount: number }> = ({
  analytics, visitorLogs, productsCount
}) => (
  <div className="space-y-6 pb-10">
    <h3 className="text-2xl font-bold text-white mb-6">Panel de Control</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg relative overflow-hidden group">
        <div className="flex justify-between items-start mb-4 relative z-10">
          <div className="bg-blue-500/20 p-3 rounded-xl text-blue-400"><ActivityIcon size={24} /></div>
        </div>
        <div className="text-3xl font-bold text-white mb-1 relative z-10">{analytics.totalVisits}</div>
        <div className="text-gray-400 text-sm relative z-10">Visitas Totales</div>
      </div>
      <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg relative overflow-hidden group">
        <div className="flex justify-between items-start mb-4 relative z-10">
          <div className="bg-yellow-500/20 p-3 rounded-xl text-yellow-400"><FileText size={24} /></div>
        </div>
        <div className="text-3xl font-bold text-white mb-1 relative z-10">{analytics.quoteRequests}</div>
        <div className="text-gray-400 text-sm relative z-10">Solicitudes Pendientes</div>
      </div>
      <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg relative overflow-hidden group">
        <div className="flex justify-between items-start mb-4 relative z-10">
          <div className="bg-purple-500/20 p-3 rounded-xl text-purple-400"><ShoppingBag size={24} /></div>
        </div>
        <div className="text-3xl font-bold text-white mb-1 relative z-10">{productsCount}</div>
        <div className="text-gray-400 text-sm relative z-10">Stock</div>
      </div>
      <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg relative overflow-hidden group">
        <div className="flex justify-between items-start mb-4 relative z-10">
          <div className="bg-gray-500/20 p-3 rounded-xl text-gray-400"><Clock size={24} /></div>
        </div>
        <div className="text-lg font-bold text-white mb-1 relative z-10 truncate">{new Date(analytics.lastVisit).toLocaleTimeString()}</div>
        <div className="text-gray-400 text-sm relative z-10">Visto Última vez</div>
      </div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
      <div className="lg:col-span-2 bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-lg">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
          <h4 className="text-lg font-bold text-white">Actividad Reciente</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-900/50 text-gray-400 text-xs uppercase">
              <tr>
                <th className="px-6 py-3">Usuario</th>
                <th className="px-6 py-3">Acción</th>
                <th className="px-6 py-3">Hora</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {visitorLogs.map((log, index) => (
                <tr key={index} className="hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${log.userType === 'Nuevo' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                      {log.userType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-white font-medium">{log.action} ({log.details})</td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{new Date(log.timestamp).toLocaleTimeString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg flex flex-col">
        <h4 className="text-lg font-bold text-white mb-4">Métricas</h4>
        <div className="flex-1 border-2 border-dashed border-slate-600 rounded-xl flex items-center justify-center text-slate-500 bg-slate-900/30">
          <BarChart3 className="mb-2 opacity-50" size={40} />
        </div>
      </div>
    </div>
  </div>
);

const InventorySection: React.FC<{
  products: Product[];
  newProduct: Partial<Product>;
  setNewProduct: (val: Partial<Product>) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddProduct: () => void;
  handleDeleteProduct: (id: string) => void;
}> = ({ products, newProduct, setNewProduct, handleImageUpload, handleAddProduct, handleDeleteProduct }) => (
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10">
    <div className="lg:col-span-4 bg-slate-800 p-6 rounded-2xl border border-slate-700 h-fit sticky top-24">
      <h3 className="text-xl font-bold text-blue-400 mb-6 flex items-center gap-2"><Plus size={20} /> Agregar Producto</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setNewProduct({ ...newProduct, condition: 'new' })} className={`py-2 rounded-lg text-sm font-bold border transition-colors ${newProduct.condition === 'new' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-slate-900 border-slate-600 text-gray-400 hover:text-white'}`}>Nuevo</button>
          <button onClick={() => setNewProduct({ ...newProduct, condition: 'refurbished' })} className={`py-2 rounded-lg text-sm font-bold border transition-colors ${newProduct.condition === 'refurbished' ? 'bg-green-600 border-green-600 text-white' : 'bg-slate-900 border-slate-600 text-gray-400 hover:text-white'}`}>Restaurado</button>
        </div>
        <input type="text" placeholder="Nombre" className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:border-blue-500 outline-none" value={newProduct.name || ''} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
        <textarea placeholder="Descripción" className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:border-blue-500 outline-none h-24 resize-none" value={newProduct.description || ''} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} />
        <div className="grid grid-cols-2 gap-4">
          <input type="number" placeholder="Precio ($)" className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:border-blue-500 outline-none" value={newProduct.price || ''} onChange={e => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })} />
          <select className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:border-blue-500 outline-none" value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value as any })}>
            <option value="TV">TV</option>
            <option value="Audio">Audio</option>
            <option value="Computación">Computación</option>
            <option value="Móvil">Móvil</option>
            <option value="Consolas">Consolas</option>
            <option value="Cocina">Cocina</option>
            <option value="Hogar">Hogar</option>
            <option value="Otros">Otros</option>
          </select>
        </div>
        <div className="space-y-4 p-3 bg-slate-900 rounded-xl border border-slate-700">
          <label className="text-xs text-gray-400 uppercase font-bold block">Imagen del Producto</label>

          {newProduct.imageUrl && (
            <div className="relative h-40 rounded-lg overflow-hidden border border-slate-700">
              <img src={newProduct.imageUrl} alt="Preview" className="w-full h-full object-cover" />
              <button
                onClick={() => setNewProduct({ ...newProduct, imageUrl: '' })}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
              >
                <Plus size={16} className="rotate-45" />
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="relative h-20 bg-slate-800 rounded-lg border-2 border-dashed border-slate-600 flex flex-col items-center justify-center hover:border-blue-500 transition-colors cursor-pointer group">
              <Upload className="mb-1 text-gray-500 group-hover:text-blue-400" size={20} />
              <span className="text-[10px] text-gray-400 uppercase font-bold">Galería</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>

            <div className="relative h-20 bg-slate-800 rounded-lg border-2 border-dashed border-slate-600 flex flex-col items-center justify-center hover:border-blue-500 transition-colors cursor-pointer group">
              <Camera className="mb-1 text-gray-500 group-hover:text-blue-400" size={20} />
              <span className="text-[10px] text-gray-400 uppercase font-bold">Cámara</span>
              <input type="file" accept="image/*" capture="environment" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
          </div>
        </div>
        <button onClick={handleAddProduct} className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95"><Plus size={18} /> Publicar</button>
      </div>
    </div>
    <div className="lg:col-span-8 bg-slate-800 p-6 rounded-2xl border border-slate-700">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">Inventario Actual ({products.length})</h3>
      </div>
      <div className="space-y-3">
        {products.map(p => (
          <div key={p.id} className="bg-slate-900 p-4 rounded-xl flex justify-between items-center border border-slate-700">
            <div className="flex gap-4 items-center">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0">
                <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="text-white font-bold">{p.name}</div>
                <div className="text-xs text-green-400">${p.price} - {p.category}</div>
              </div>
            </div>
            <button onClick={() => handleDeleteProduct(p.id)} className="text-gray-500 hover:text-red-500 p-2"><Trash2 size={20} /></button>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const QuotesSection: React.FC<{
  quotes: QuoteRequest[];
  handleQuoteStatus: (id: string, status: QuoteRequest['status']) => void;
  handleDeleteQuote: (id: string) => void;
}> = ({ quotes, handleQuoteStatus, handleDeleteQuote }) => (
  <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 overflow-hidden">
    <h3 className="text-xl font-bold text-white mb-6">Solicitudes de Clientes</h3>
    <div className="overflow-x-auto">
      <table className="w-full text-left text-gray-300">
        <thead className="text-xs uppercase bg-slate-900/50 text-gray-400">
          <tr>
            <th className="px-4 py-3">Cliente</th>
            <th className="px-4 py-3">Equipo / Problema</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3 text-right">Acción</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700">
          {quotes.map(q => (
            <tr key={q.id} className="hover:bg-slate-700/30 transition-colors">
              <td className="px-4 py-4">
                <div className="font-bold text-white">{q.customerName}</div>
                <div className="text-xs text-blue-400">{q.contact}</div>
              </td>
              <td className="px-4 py-4">
                <div className="text-sm text-white">{q.deviceType}</div>
                <div className="text-xs text-gray-400 truncate max-w-xs">{q.issueDescription}</div>
              </td>
              <td className="px-4 py-4">
                <select value={q.status} onChange={(e) => handleQuoteStatus(q.id, e.target.value as any)} className="bg-slate-900 text-xs font-bold px-2 py-1 rounded-lg border border-slate-600 outline-none">
                  <option value="Pendiente">Pendiente</option>
                  <option value="Contactado">Contactado</option>
                  <option value="Cerrado">Cerrado</option>
                </select>
              </td>
              <td className="px-4 py-4 text-right"><button onClick={() => handleDeleteQuote(q.id)} className="text-gray-500 hover:text-red-400"><Trash2 size={18} /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
      {quotes.length === 0 && <div className="text-center py-20 text-gray-500">No hay solicitudes.</div>}
    </div>
  </div>
);

const SettingsSection: React.FC<{
  siteConfig: SiteConfig;
  setSiteConfig: (val: SiteConfig) => void;
  handleUpdateConfig: (e: React.FormEvent) => void;
}> = ({ siteConfig, setSiteConfig, handleUpdateConfig }) => (
  <div className="max-w-4xl pb-10">
    <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-lg">
      <div className="flex items-center gap-3 mb-8 border-b border-slate-700 pb-4">
        <div className="p-3 bg-blue-500/20 rounded-lg"><PenTool className="text-blue-400" size={24} /></div>
        <h3 className="text-xl font-bold text-white">Configuración del Sitio</h3>
      </div>
      <form onSubmit={handleUpdateConfig} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="text-sm uppercase font-bold text-blue-400">Información del Sitio</h4>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Nombre de la Empresa</label>
                <input type="text" placeholder="Ej: Electrónica L & G" className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:border-blue-500 outline-none" value={siteConfig.heroTitle} onChange={e => setSiteConfig({ ...siteConfig, heroTitle: e.target.value })} />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Pequeña Descripción</label>
                <textarea placeholder="Ej: Expertos en reparaciones y ventas..." className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:border-blue-500 outline-none h-32 resize-none" value={siteConfig.heroSubtitle} onChange={e => setSiteConfig({ ...siteConfig, heroSubtitle: e.target.value })} />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm uppercase font-bold text-blue-400">Contacto y Ubicación</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Email</label>
                  <input type="email" className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:border-blue-500 outline-none" placeholder="correo@ejemplo.com" value={siteConfig.contactEmail} onChange={e => setSiteConfig({ ...siteConfig, contactEmail: e.target.value })} />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Teléfono</label>
                  <input type="text" className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:border-blue-500 outline-none" placeholder="+34 916 344 875" value={siteConfig.contactPhone} onChange={e => setSiteConfig({ ...siteConfig, contactPhone: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Dirección de la Empresa</label>
                <input type="text" className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:border-blue-500 outline-none" placeholder="Ej: Ciudad Futura, Calle 123" value={siteConfig.address} onChange={e => setSiteConfig({ ...siteConfig, address: e.target.value })} />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Horario de Trabajo</label>
                <input type="text" className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:border-blue-500 outline-none" placeholder="Ej: Lun-Vie 9:00 - 18:00" value={siteConfig.openingHours} onChange={e => setSiteConfig({ ...siteConfig, openingHours: e.target.value })} />
              </div>
            </div>
          </div>
        </div>
        <button type="submit" className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-all"><CheckCircle size={18} className="inline mr-2" /> Guardar Cambios</button>
      </form>
    </div>
  </div>
);

const BillingSection: React.FC<{
  invoices: Invoice[];
  handleInvoiceUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDeleteInvoice: (id: string) => void;
  handleEditInvoice: (id: string, newAmount: number) => void;
  isAnalyzing: boolean;
}> = ({ invoices, handleInvoiceUpload, handleDeleteInvoice, handleEditInvoice, isAnalyzing }) => {
  const currentMonth = new Date().toLocaleString('es-ES', { month: 'long' });
  const monthlyTotal = invoices.reduce((sum, inv) => sum + inv.amount, 0);

  const promptNewAmount = (id: string, current: number) => {
    const val = window.prompt("Ingresa el importe correcto:", current.toString());
    if (val !== null) {
      const parsed = parseFloat(val.replace(',', '.'));
      if (!isNaN(parsed)) {
        handleEditInvoice(id, parsed);
      }
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><Calendar size={20} /></div>
            <span className="text-gray-400 text-sm font-bold uppercase">Mes Actual</span>
          </div>
          <div className="text-2xl font-bold text-white capitalize">{currentMonth}</div>
        </div>
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-500/20 rounded-lg text-green-400"><Receipt size={20} /></div>
            <span className="text-gray-400 text-sm font-bold uppercase">Total Facturado</span>
          </div>
          <div className="text-2xl font-bold text-white">${monthlyTotal.toLocaleString()}</div>
        </div>
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg flex flex-col justify-center">
          <div className="relative group cursor-pointer overflow-hidden rounded-xl border-2 border-dashed border-slate-600 hover:border-blue-500 transition-all">
            <input type="file" accept="image/*,application/pdf" onChange={handleInvoiceUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" disabled={isAnalyzing} />
            <div className="py-4 flex items-center justify-center gap-3">
              {isAnalyzing ? (
                <>
                  <Loader2 className="animate-spin text-blue-400" size={20} />
                  <span className="text-sm font-bold text-blue-400">Analizando...</span>
                </>
              ) : (
                <>
                  <Upload className="text-gray-500 group-hover:text-blue-400" size={20} />
                  <span className="text-sm font-bold text-gray-400 group-hover:text-white">Subir Factura</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <FileSpreadsheet className="text-blue-400" size={24} /> Historial de Gastos
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-gray-300">
            <thead className="text-xs uppercase bg-slate-900/50 text-gray-400">
              <tr>
                <th className="px-4 py-3">Archivo</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Importe</th>
                <th className="px-4 py-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {invoices.map(inv => {
                // Generamos un link que fuerce la descarga correctamente
                // Si es PDF usamos fl_attachment, pero asegurándonos de que esté bien puesto
                const isPdf = inv.fileType?.includes('pdf');
                const downloadUrl = inv.url.replace('/upload/', '/upload/fl_attachment,dn_auto/');

                return (
                  <tr key={inv.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-900 rounded text-gray-400"> {inv.fileType?.includes('pdf') ? 'PDF' : 'IMG'} </div>
                        <div>
                          <div className="font-bold text-white text-sm">{inv.name}</div>
                          <div className="flex gap-2">
                            <a href={inv.url} target="_blank" rel="noreferrer" className="text-[10px] text-blue-400 hover:underline">Ver</a>
                            <a href={downloadUrl} className="text-[10px] text-gray-500 hover:underline">Descargar</a>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm">{inv.date}</td>
                    <td className="px-4 py-4 font-bold text-green-400">
                      <div className="flex items-center gap-2">
                        ${inv.amount.toLocaleString()}
                        <button onClick={() => promptNewAmount(inv.id, inv.amount)} className="text-gray-600 hover:text-blue-400 transition-colors">
                          <Pencil size={12} />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button onClick={() => handleDeleteInvoice(inv.id)} className="text-gray-500 hover:text-red-400"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {invoices.length === 0 && (
            <div className="text-center py-20">
              <Sparkles className="mx-auto text-slate-700 mb-4" size={48} />
              <p className="text-gray-500">Sube una factura y deja que la IA la analice por ti.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---

interface AdminPanelProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  quotes: QuoteRequest[];
  setQuotes: React.Dispatch<React.SetStateAction<QuoteRequest[]>>;
  siteConfig: SiteConfig;
  setSiteConfig: React.Dispatch<React.SetStateAction<SiteConfig>>;
  invoices: Invoice[];
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
  analytics: AnalyticsStats;
  visitorLogs: VisitorLog[];
  navigate: (page: Page) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({
  products, setProducts, quotes, setQuotes, siteConfig, setSiteConfig,
  invoices, setInvoices, analytics, visitorLogs, navigate, isAuthenticated, setIsAuthenticated
}) => {
  const [currentAdminView, setCurrentAdminView] = useState<AdminView>(AdminView.DASHBOARD);
  const [adminPassword, setAdminPassword] = useState('');
  const [newProduct, setNewProduct] = useState<Partial<Product>>({ category: 'TV', condition: 'refurbished' });
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price) return;

    // Save to Supabase
    const { data, error } = await supabase.from('products').insert([{
      name: newProduct.name,
      description: newProduct.description || '',
      price: Number(newProduct.price),
      category: newProduct.category,
      condition: newProduct.condition || 'refurbished',
      image_url: newProduct.imageUrl
    }]).select();

    if (error) {
      console.error("Error detallado de Supabase:", error);
      alert(`Error al guardar en la base de datos: ${error.message}. ¿Ejecutaste el script SQL de las tablas?`);
      return;
    }

    const savedProduct = data[0];
    const productToAdd: Product = {
      id: savedProduct.id,
      name: savedProduct.name,
      description: savedProduct.description,
      price: savedProduct.price,
      category: savedProduct.category,
      condition: savedProduct.condition,
      imageUrl: savedProduct.image_url
    };

    setProducts([...products, productToAdd]);
    setNewProduct({ category: 'TV', condition: 'refurbished', name: '', description: '', price: 0, imageUrl: '' });
    alert("Producto agregado correctamente.");
  };

  const handleDeleteProduct = async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) {
      setProducts(products.filter(p => p.id !== id));
    } else {
      alert("Error al eliminar producto.");
    }
  };

  const handleQuoteStatus = async (id: string, status: QuoteRequest['status']) => {
    const { error } = await supabase.from('quotes').update({ status }).eq('id', id);
    if (!error) {
      setQuotes(quotes.map(q => q.id === id ? { ...q, status } : q));
    } else {
      alert("Error al actualizar estado.");
    }
  };

  const handleDeleteQuote = async (id: string) => {
    const { error } = await supabase.from('quotes').delete().eq('id', id);
    if (!error) {
      setQuotes(quotes.filter(q => q.id !== id));
    } else {
      alert("Error al eliminar solicitud.");
    }
  };
  const handleUpdateConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase
      .from('site_config')
      .upsert({
        id: 1, // We keep a single row for configuration
        hero_title: siteConfig.heroTitle,
        hero_subtitle: siteConfig.heroSubtitle,
        contact_email: siteConfig.contactEmail,
        contact_phone: siteConfig.contactPhone,
        address: siteConfig.address,
        opening_hours: siteConfig.openingHours
      });

    if (error) {
      console.error("Error actualizando configuración:", error);
      alert(`Error al guardar configuración: ${error.message}`);
    } else {
      alert("Configuración guardada correctamente en la nube.");
    }
  };

  const handleInvoiceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    try {
      // 1. Upload to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
      // Usamos public_id para forzar la carpeta ya que el preset puede ignorar 'folder'
      const customPublicId = `invoices/${Date.now()}_${file.name.replace(/\.[^/.]+$/, "")}`;
      formData.append('public_id', customPublicId);

      const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/auto/upload`, {
        method: 'POST',
        body: formData,
      });
      const cloudData = await cloudRes.json();

      if (!cloudData.secure_url) {
        console.error("Cloudinary Error:", cloudData);
        throw new Error("Cloudinary upload failed");
      }

      // 2. Analyze with Gemini IA
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.readAsDataURL(file);
      });
      const base64Data = await base64Promise;

      const prompt = `Extrae el TOTAL de esta factura. 
      Responde SOLO con un número decimal (usa punto para decimales). 
      Si no lo encuentras, responde "0". 
      Busca cerca de "Total", "Importe Total" o al final del documento.`;

      const aiResponseRaw = await sendMessageToGemini([], prompt, {
        base64: base64Data,
        mimeType: file.type
      });

      console.log("Raw AI Response:", aiResponseRaw);

      // Limpiar respuesta para obtener solo el número
      const amountMatch = aiResponseRaw.replace(/[^0-9,.]/g, '').replace(',', '.');
      const finalAmount = parseFloat(amountMatch) || 0;

      // 3. Save to Supabase
      const { data: newInv, error } = await supabase.from('invoices').insert([{
        name: file.name,
        url: cloudData.secure_url,
        amount: finalAmount,
        file_type: file.type,
      }]).select();

      if (error) throw error;

      if (newInv) {
        setInvoices([{
          id: newInv[0].id,
          name: newInv[0].name,
          url: newInv[0].url,
          amount: newInv[0].amount,
          date: new Date(newInv[0].created_at).toLocaleDateString(),
          fileType: newInv[0].file_type
        }, ...invoices]);

        if (finalAmount === 0) {
          alert(`Factura subida, pero no pudimos detectar el importe automáticamente. Por favor, corrígelo con el icono del lápiz.`);
        } else {
          alert(`Factura procesada: $${finalAmount}`);
        }
      }
    } catch (error) {
      console.error("Error procesando factura:", error);
      alert("Error al procesar la factura. Verifica tu conexión y el archivo.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDeleteInvoice = async (id: string) => {
    if (!window.confirm("¿Estás seguro de eliminar esta factura?")) return;
    const { error } = await supabase.from('invoices').delete().eq('id', id);
    if (!error) {
      setInvoices(invoices.filter(i => i.id !== id));
    } else {
      alert("Error al eliminar factura.");
    }
  };

  const handleEditInvoice = async (id: string, newAmount: number) => {
    const { error } = await supabase.from('invoices').update({ amount: newAmount }).eq('id', id);
    if (!error) {
      setInvoices(invoices.map(inv => inv.id === id ? { ...inv, amount: newAmount } : inv));
    } else {
      alert("Error al actualizar factura.");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Indicamos que está cargando (opcional, podrías añadir un estado local isLoading)
    const reader = new FileReader();
    reader.onloadend = async () => {
      // Mientras tanto mostramos la previsualización local
      setNewProduct({ ...newProduct, imageUrl: reader.result as string });
    };
    reader.readAsDataURL(file);

    // Subida REAL a Cloudinary
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    // Organizar en carpetas forzando el public_id
    const categoryFolder = newProduct.condition === 'new' ? 'shop/new' : 'shop/repaired';
    const customId = `${categoryFolder}/${Date.now()}_${file.name.replace(/\.[^/.]+$/, "")}`;
    formData.append('public_id', customId);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );
      const data = await response.json();
      if (data.secure_url) {
        setNewProduct(prev => ({ ...prev, imageUrl: data.secure_url }));
      } else {
        console.error("Error en Cloudinary:", data);
        alert("Error al subir imagen. Verifica el 'Upload Preset'.");
      }
    } catch (error) {
      console.error("Error de red:", error);
      alert("Error de conexión al subir la imagen.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="pt-32 px-4 min-h-screen flex flex-col items-center justify-center bg-slate-900">
        <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700 animate-slide-up text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center rotate-3 mx-auto mb-6 shadow-lg"><User className="text-white" size={32} /></div>
          <h2 className="text-2xl font-bold text-white mb-8">Acceso Administrativo</h2>
          <input type="password" placeholder="Contraseña" className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-white mb-4 focus:border-blue-500 outline-none" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (adminPassword === 'admin' ? setIsAuthenticated(true) : alert('Incorrecta'))} />
          <button onClick={() => adminPassword === 'admin' ? setIsAuthenticated(true) : alert('Incorrecta')} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-500 transition-colors">Iniciar Sesión</button>
          <p className="text-xs text-gray-500 mt-4">Contraseña: admin</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen pt-20 bg-slate-900">
      <div className="w-full lg:w-64 bg-slate-800 border-r border-slate-700 lg:fixed lg:h-full z-20">
        <div className="px-4 py-6 h-full flex flex-col">
          <nav className="space-y-1">
            <button onClick={() => setCurrentAdminView(AdminView.DASHBOARD)} className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg w-full transition-all ${currentAdminView === AdminView.DASHBOARD ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-400 hover:bg-slate-700 hover:text-white'}`}><LayoutDashboard size={18} /> Dashboard</button>
            <button onClick={() => setCurrentAdminView(AdminView.QUOTES)} className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg w-full transition-all ${currentAdminView === AdminView.QUOTES ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-400 hover:bg-slate-700 hover:text-white'}`}><FileText size={18} /> Presupuestos</button>
            <button onClick={() => setCurrentAdminView(AdminView.PRODUCTS)} className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg w-full transition-all ${currentAdminView === AdminView.PRODUCTS ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-400 hover:bg-slate-700 hover:text-white'}`}><ShoppingBag size={18} /> Inventario</button>
            <button onClick={() => setCurrentAdminView(AdminView.BILLING)} className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg w-full transition-all ${currentAdminView === AdminView.BILLING ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-400 hover:bg-slate-700 hover:text-white'}`}><FileSpreadsheet size={18} /> Facturación</button>
            <button onClick={() => setCurrentAdminView(AdminView.CONTENT)} className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg w-full transition-all ${currentAdminView === AdminView.CONTENT ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-400 hover:bg-slate-700 hover:text-white'}`}><Settings size={18} /> Configuración</button>
          </nav>
          <button onClick={() => setIsAuthenticated(false)} className="mt-auto text-red-400 hover:text-red-300 text-sm flex items-center gap-2 p-2 hover:bg-red-500/10 rounded-lg transition-colors">Cerrar Sesión</button>
        </div>
      </div>

      <div className="flex-1 lg:ml-64 p-4 lg:p-8 bg-slate-900 pb-24 min-h-screen">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white capitalize">
            {currentAdminView === AdminView.DASHBOARD && 'Dashboard'}
            {currentAdminView === AdminView.PRODUCTS && 'Inventario'}
            {currentAdminView === AdminView.QUOTES && 'Presupuestos'}
            {currentAdminView === AdminView.BILLING && 'Facturación y Gastos'}
            {currentAdminView === AdminView.CONTENT && 'Configuración'}
          </h2>
        </div>

        <div className="bg-slate-900 rounded-3xl">
          {currentAdminView === AdminView.DASHBOARD && <DashboardSection analytics={analytics} visitorLogs={visitorLogs} productsCount={products.length} />}
          {currentAdminView === AdminView.PRODUCTS && <InventorySection products={products} newProduct={newProduct} setNewProduct={setNewProduct} handleImageUpload={handleImageUpload} handleAddProduct={handleAddProduct} handleDeleteProduct={handleDeleteProduct} />}
          {currentAdminView === AdminView.QUOTES && <QuotesSection quotes={quotes} handleQuoteStatus={handleQuoteStatus} handleDeleteQuote={handleDeleteQuote} />}
          {currentAdminView === AdminView.BILLING && <BillingSection invoices={invoices} handleInvoiceUpload={handleInvoiceUpload} handleDeleteInvoice={handleDeleteInvoice} handleEditInvoice={handleEditInvoice} isAnalyzing={isAnalyzing} />}
          {currentAdminView === AdminView.CONTENT && <SettingsSection siteConfig={siteConfig} setSiteConfig={setSiteConfig} handleUpdateConfig={handleUpdateConfig} />}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;