import React, { useState } from 'react';
import { Page, Product, QuoteRequest, AdminView, SiteConfig, AnalyticsStats, VisitorLog } from '../types';
import {
  User, LayoutDashboard, FileText, ShoppingBag, Settings, Activity, Clock,
  BarChart3, Plus, Trash2, Upload, Search, CheckCircle, PenTool
} from 'lucide-react';

interface AdminPanelProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  quotes: QuoteRequest[];
  setQuotes: React.Dispatch<React.SetStateAction<QuoteRequest[]>>;
  siteConfig: SiteConfig;
  setSiteConfig: React.Dispatch<React.SetStateAction<SiteConfig>>;
  analytics: AnalyticsStats;
  visitorLogs: VisitorLog[];
  navigate: (page: Page) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({
  products, setProducts, quotes, setQuotes, siteConfig, setSiteConfig,
  analytics, visitorLogs, navigate, isAuthenticated, setIsAuthenticated
}) => {
  const [currentAdminView, setCurrentAdminView] = useState<AdminView>(AdminView.DASHBOARD);
  const [adminPassword, setAdminPassword] = useState('');
  const [newProduct, setNewProduct] = useState<Partial<Product>>({ category: 'TV', condition: 'refurbished' });

  // --- ADMIN ACTIONS ---
  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price) return;
    const productToAdd: Product = {
      id: Date.now().toString(),
      name: newProduct.name,
      description: newProduct.description || '',
      price: Number(newProduct.price),
      category: newProduct.category as any,
      condition: newProduct.condition as any || 'refurbished',
      imageUrl: newProduct.imageUrl || `https://picsum.photos/seed/${Date.now()}/800/600`
    };
    setProducts([...products, productToAdd]);
    setNewProduct({ category: 'TV', condition: 'refurbished', name: '', description: '', price: 0, imageUrl: '' });
    alert("Producto agregado correctamente.");
  };

  const handleDeleteProduct = (id: string) => setProducts(products.filter(p => p.id !== id));

  const handleQuoteStatus = (id: string, status: QuoteRequest['status']) => {
    setQuotes(quotes.map(q => q.id === id ? { ...q, status } : q));
  };

  const handleDeleteQuote = (id: string) => setQuotes(quotes.filter(q => q.id !== id));

  const handleUpdateConfig = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Configuración del sitio actualizada correctamente.");
  };

  // --- VIEWS ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({ ...newProduct, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const renderDashboardView = () => (
    <div className="space-y-6 animate-fade-in pb-10">
      <h3 className="text-2xl font-bold text-white mb-6">Panel de Control</h3>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 bg-blue-500/10 w-24 h-24 rounded-full group-hover:scale-110 transition-transform"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="bg-blue-500/20 p-3 rounded-xl text-blue-400"><Activity size={24} /></div>
            <span className="text-xs font-bold bg-green-500/20 text-green-400 px-2 py-1 rounded-full flex items-center gap-1">+12%</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1 relative z-10">{analytics.totalVisits}</div>
          <div className="text-gray-400 text-sm relative z-10">Visitas Totales</div>
        </div>

        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 bg-yellow-500/10 w-24 h-24 rounded-full group-hover:scale-110 transition-transform"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="bg-yellow-500/20 p-3 rounded-xl text-yellow-400"><FileText size={24} /></div>
          </div>
          <div className="text-3xl font-bold text-white mb-1 relative z-10">{analytics.quoteRequests}</div>
          <div className="text-gray-400 text-sm relative z-10">Solicitudes Pendientes</div>
        </div>

        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 bg-purple-500/10 w-24 h-24 rounded-full group-hover:scale-110 transition-transform"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="bg-purple-500/20 p-3 rounded-xl text-purple-400"><ShoppingBag size={24} /></div>
          </div>
          <div className="text-3xl font-bold text-white mb-1 relative z-10">{products.length}</div>
          <div className="text-gray-400 text-sm relative z-10">Productos en Stock</div>
        </div>

        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 bg-gray-500/10 w-24 h-24 rounded-full group-hover:scale-110 transition-transform"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="bg-gray-500/20 p-3 rounded-xl text-gray-400"><Clock size={24} /></div>
          </div>
          <div className="text-lg font-bold text-white mb-1 relative z-10 truncate">{new Date(analytics.lastVisit).toLocaleTimeString()}</div>
          <div className="text-gray-400 text-sm relative z-10">Última Actividad</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Visitor Logs Table */}
        <div className="lg:col-span-2 bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-lg">
          <div className="p-6 border-b border-slate-700 flex justify-between items-center">
            <h4 className="text-lg font-bold text-white">Actividad Reciente</h4>
            <button className="text-blue-400 text-sm hover:underline">Ver todo</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-900/50 text-gray-400 text-xs uppercase">
                <tr>
                  <th className="px-6 py-3">Usuario</th>
                  <th className="px-6 py-3">Acción</th>
                  <th className="px-6 py-3">Detalle</th>
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
                    <td className="px-6 py-4 text-white font-medium">{log.action}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{log.details}</td>
                    <td className="px-6 py-4 text-gray-500 text-sm">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mini Chart Placeholder */}
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg flex flex-col">
          <h4 className="text-lg font-bold text-white mb-4">Tendencia de Visitas</h4>
          <div className="flex-1 border-2 border-dashed border-slate-600 rounded-xl flex items-center justify-center text-slate-500 bg-slate-900/30">
            <div className="text-center">
              <BarChart3 className="mx-auto mb-2 opacity-50" size={40} />
              <p className="text-sm">Gráfico Semanal</p>
            </div>
          </div>
          <div className="mt-4 flex justify-between text-sm text-gray-400">
            <span>Lun</span><span>Mie</span><span>Vie</span><span>Dom</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProductsView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in pb-10">
      <div className="lg:col-span-4 bg-slate-800 p-6 rounded-2xl border border-slate-700 h-fit sticky top-24">
        <h3 className="text-xl font-bold text-blue-400 mb-6 flex items-center gap-2"><Plus size={20} /> Agregar Producto</h3>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 uppercase font-bold mb-1 block">Tipo de Producto</label>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <button
                onClick={() => setNewProduct({ ...newProduct, condition: 'new' })}
                className={`py-2 rounded-lg text-sm font-bold border transition-colors ${newProduct.condition === 'new' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-slate-900 border-slate-600 text-gray-400 hover:text-white'}`}
              >
                Nuevo
              </button>
              <button
                onClick={() => setNewProduct({ ...newProduct, condition: 'refurbished' })}
                className={`py-2 rounded-lg text-sm font-bold border transition-colors ${newProduct.condition === 'refurbished' ? 'bg-green-600 border-green-600 text-white' : 'bg-slate-900 border-slate-600 text-gray-400 hover:text-white'}`}
              >
                Restaurado
              </button>
            </div>
          </div>

          <input type="text" placeholder="Nombre del Producto" className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:border-blue-500 outline-none transition-colors" value={newProduct.name || ''} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
          <textarea placeholder="Descripción detallada..." className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:border-blue-500 outline-none transition-colors h-24" value={newProduct.description || ''} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <input type="number" placeholder="Precio ($)" className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:border-blue-500 outline-none transition-colors" value={newProduct.price || ''} onChange={e => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })} />
            <select className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:border-blue-500 outline-none transition-colors" value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value as any })}>
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

          <div className="space-y-2">
            <label className="text-xs text-gray-400 uppercase font-bold block">Imagen del Producto</label>
            <div className="flex flex-col gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2 text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
              />
              {newProduct.imageUrl && (
                <div className="mt-2 p-2 bg-slate-900 rounded-lg border border-slate-700 inline-block">
                  <p className="text-xs text-gray-500 mb-1">Vista Previa:</p>
                  <img src={newProduct.imageUrl} alt="Preview" className="h-20 w-auto rounded object-cover" />
                </div>
              )}
            </div>
          </div>
          <button onClick={handleAddProduct} className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-green-500/20 transition-all transform active:scale-95"><Upload size={18} /> Publicar</button>
        </div>
      </div>

      <div className="lg:col-span-8 bg-slate-800 p-6 rounded-2xl border border-slate-700 min-h-[600px]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Inventario Actual <span className="text-gray-500 text-sm ml-2">({products.length} ítems)</span></h3>
          <div className="bg-slate-900 p-2 rounded-lg flex items-center border border-slate-700">
            <Search size={16} className="text-gray-500 mr-2" />
            <input type="text" placeholder="Buscar..." className="bg-transparent text-sm text-white outline-none w-32 md:w-48" />
          </div>
        </div>
        <div className="space-y-3">
          {products.map(p => (
            <div key={p.id} className="bg-slate-900 p-4 rounded-xl flex justify-between items-center border border-slate-700 hover:border-blue-500/30 transition-colors group">
              <div className="flex gap-4 items-center">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0 relative">
                  <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                  <div className={`absolute bottom-0 left-0 right-0 h-1 ${p.condition === 'new' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <div className="text-white font-bold text-base">{p.name}</div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold border ${p.condition === 'new' ? 'border-blue-500 text-blue-400' : 'border-green-500 text-green-400'}`}>
                      {p.condition === 'new' ? 'Nuevo' : 'Restaurado'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs bg-slate-800 border border-slate-600 px-2 py-0.5 rounded text-gray-300">{p.category}</span>
                    <span className="text-green-400 font-bold text-sm">${p.price}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => handleDeleteProduct(p.id)} className="text-gray-500 hover:text-red-500 p-3 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={20} /></button>
            </div>
          ))}
          {products.length === 0 && <div className="text-center text-gray-500 py-10">No hay productos.</div>}
        </div>
      </div>
    </div>
  );

  const renderQuotesView = () => (
    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 animate-fade-in overflow-hidden min-h-[500px]">
      <h3 className="text-xl font-bold text-white mb-6">Solicitudes de Clientes</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-gray-300">
          <thead className="text-xs uppercase bg-slate-900/50 text-gray-400">
            <tr>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Equipo</th>
              <th className="px-4 py-3">Problema</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {quotes.map(q => (
              <tr key={q.id} className="hover:bg-slate-700/30 transition-colors">
                <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-400">{q.date}</td>
                <td className="px-4 py-4">
                  <div className="text-sm font-bold text-white">{q.customerName}</div>
                  <div className="text-xs font-normal text-blue-400">{q.contact}</div>
                </td>
                <td className="px-4 py-4 text-sm text-white">{q.deviceType}</td>
                <td className="px-4 py-4 text-sm max-w-xs truncate text-gray-400" title={q.issueDescription}>{q.issueDescription}</td>
                <td className="px-4 py-4">
                  <select
                    value={q.status}
                    onChange={(e) => handleQuoteStatus(q.id, e.target.value as any)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-full border bg-opacity-10 border-opacity-20 outline-none cursor-pointer transition-colors ${q.status === 'Pendiente' ? 'bg-yellow-500 text-yellow-400 border-yellow-500' :
                        q.status === 'Contactado' ? 'bg-blue-500 text-blue-400 border-blue-500' :
                          'bg-green-500 text-green-400 border-green-500'
                      }`}
                  >
                    <option className="bg-slate-800 text-gray-300" value="Pendiente">Pendiente</option>
                    <option className="bg-slate-800 text-gray-300" value="Contactado">Contactado</option>
                    <option className="bg-slate-800 text-gray-300" value="Cerrado">Cerrado</option>
                  </select>
                </td>
                <td className="px-4 py-4 text-right"><button onClick={() => handleDeleteQuote(q.id)} className="text-gray-500 hover:text-red-400 transition-colors"><Trash2 size={18} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {quotes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <FileText size={48} className="mb-4 opacity-20" />
            <p>No hay solicitudes de presupuesto pendientes.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderContentView = () => (
    <div className="max-w-4xl animate-fade-in pb-10">
      <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-lg">
        <div className="flex items-center gap-3 mb-8 border-b border-slate-700 pb-4">
          <div className="p-3 bg-blue-500/20 rounded-lg"><PenTool className="text-blue-400" size={24} /></div>
          <div>
            <h3 className="text-xl font-bold text-white">Configuración del Sitio</h3>
            <p className="text-gray-400 text-sm">Personaliza la información visible en la página principal.</p>
          </div>
        </div>

        <form onSubmit={handleUpdateConfig} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h4 className="text-sm uppercase tracking-wide text-gray-500 font-bold">Sección Hero</h4>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Título Principal</label>
                <input type="text" className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:border-blue-500 outline-none" value={siteConfig.heroTitle} onChange={e => setSiteConfig({ ...siteConfig, heroTitle: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Subtítulo</label>
                <textarea className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:border-blue-500 outline-none h-32 resize-none" value={siteConfig.heroSubtitle} onChange={e => setSiteConfig({ ...siteConfig, heroSubtitle: e.target.value })} />
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-sm uppercase tracking-wide text-gray-500 font-bold">Información de Contacto</h4>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input type="text" className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:border-blue-500 outline-none" value={siteConfig.contactEmail} onChange={e => setSiteConfig({ ...siteConfig, contactEmail: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Teléfono</label>
                <input type="text" className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:border-blue-500 outline-none" value={siteConfig.contactPhone} onChange={e => setSiteConfig({ ...siteConfig, contactPhone: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Dirección</label>
                <input type="text" className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:border-blue-500 outline-none" value={siteConfig.address} onChange={e => setSiteConfig({ ...siteConfig, address: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Horarios</label>
                <input type="text" className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:border-blue-500 outline-none" value={siteConfig.openingHours} onChange={e => setSiteConfig({ ...siteConfig, openingHours: e.target.value })} />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-700 flex justify-end">
            <button type="submit" className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold shadow-lg transition-all flex items-center gap-2">
              <CheckCircle size={18} /> Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // --- AUTH CHECK ---
  if (!isAuthenticated) {
    return (
      <div className="pt-32 px-4 min-h-screen flex flex-col items-center justify-center bg-slate-900">
        <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700 animate-slide-up">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center rotate-3 shadow-lg">
              <User className="text-white" size={32} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 text-center">Acceso Administrativo</h2>
          <p className="text-gray-400 text-center mb-8 text-sm">Ingresa tus credenciales para gestionar L & G.</p>
          <div className="space-y-4">
            <input
              type="password"
              placeholder="Contraseña"
              className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (adminPassword === 'admin' ? setIsAuthenticated(true) : alert('Contraseña incorrecta'))}
            />
            <p className="text-xs text-gray-500 mt-2 text-center">Contraseña de prueba: <strong className="text-blue-400">admin</strong></p>
            <button
              onClick={() => {
                if (adminPassword === 'admin') setIsAuthenticated(true);
                else alert('Contraseña incorrecta');
              }}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20"
            >
              Iniciar Sesión
            </button>
          </div>
          <p className="text-center text-gray-600 text-xs mt-6">Sistema seguro v1.0</p>
        </div>
      </div>
    );
  }

  // --- MAIN LAYOUT ---
  return (
    <div className="flex flex-col lg:flex-row min-h-screen pt-20 bg-slate-900">
      {/* Sidebar */}
      <div className="w-full lg:w-64 bg-slate-800 border-r border-slate-700 lg:fixed lg:h-full lg:pt-4 z-20 shadow-xl lg:shadow-none">
        <div className="px-4 py-4 lg:py-0 h-full flex flex-col">
          <div className="text-xs uppercase text-gray-500 font-bold mb-4 px-2 hidden lg:block tracking-wider">Menú Principal</div>
          <nav className="space-y-1 flex lg:block overflow-x-auto lg:overflow-visible gap-2 pb-2 lg:pb-0 hide-scrollbar">
            <button onClick={() => setCurrentAdminView(AdminView.DASHBOARD)} className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg w-full transition-all whitespace-nowrap ${currentAdminView === AdminView.DASHBOARD ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-400 hover:bg-slate-700 hover:text-white'}`}>
              <LayoutDashboard size={18} /> Dashboard
            </button>
            <button onClick={() => setCurrentAdminView(AdminView.QUOTES)} className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg w-full transition-all whitespace-nowrap ${currentAdminView === AdminView.QUOTES ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-400 hover:bg-slate-700 hover:text-white'}`}>
              <FileText size={18} /> Presupuestos
              {quotes.filter(q => q.status === 'Pendiente').length > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{quotes.filter(q => q.status === 'Pendiente').length}</span>
              )}
            </button>
            <button onClick={() => setCurrentAdminView(AdminView.PRODUCTS)} className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg w-full transition-all whitespace-nowrap ${currentAdminView === AdminView.PRODUCTS ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-400 hover:bg-slate-700 hover:text-white'}`}>
              <ShoppingBag size={18} /> Inventario
            </button>
            <button onClick={() => setCurrentAdminView(AdminView.CONTENT)} className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg w-full transition-all whitespace-nowrap ${currentAdminView === AdminView.CONTENT ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-400 hover:bg-slate-700 hover:text-white'}`}>
              <Settings size={18} /> Configuración
            </button>
          </nav>

          <div className="mt-auto px-2 hidden lg:block pb-8 border-t border-slate-700 pt-4">
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">A</div>
              <div>
                <div className="text-sm text-white font-bold">Administrador</div>
                <div className="text-xs text-green-400">En línea</div>
              </div>
            </div>
            <button onClick={() => setIsAuthenticated(false)} className="text-red-400 hover:text-red-300 text-sm flex items-center gap-2 w-full px-2 py-2 hover:bg-red-500/10 rounded-lg transition-colors">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 lg:ml-64 p-4 lg:p-8 bg-slate-900 pb-24 min-h-screen">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-white capitalize">
              {currentAdminView === AdminView.DASHBOARD && 'Panel de Control'}
              {currentAdminView === AdminView.PRODUCTS && 'Gestión de Inventario'}
              {currentAdminView === AdminView.QUOTES && 'Solicitudes de Clientes'}
              {currentAdminView === AdminView.CONTENT && 'Configuración del Sitio'}
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              {currentAdminView === AdminView.DASHBOARD && 'Resumen de actividad y métricas clave.'}
              {currentAdminView === AdminView.PRODUCTS && 'Administra el stock de productos restaurados y nuevos.'}
              {currentAdminView === AdminView.QUOTES && 'Gestiona y responde a las consultas de reparación.'}
              {currentAdminView === AdminView.CONTENT && 'Edita los textos y datos de contacto de la web.'}
            </p>
          </div>
          <button onClick={() => setIsAuthenticated(false)} className="lg:hidden text-red-400 border border-slate-700 p-2 rounded-lg bg-slate-800">
            <span className="sr-only">Salir</span>
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
          </button>
        </div>

        <div className="bg-slate-900 rounded-3xl">
          {currentAdminView === AdminView.DASHBOARD && renderDashboardView()}
          {currentAdminView === AdminView.PRODUCTS && renderProductsView()}
          {currentAdminView === AdminView.QUOTES && renderQuotesView()}
          {currentAdminView === AdminView.CONTENT && renderContentView()}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;