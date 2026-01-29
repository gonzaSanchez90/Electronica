import React, { useState, useEffect } from 'react';
import { Page, Product, QuoteRequest, SiteConfig, AnalyticsStats, VisitorLog, Invoice } from './types';
import Chatbot from './components/Chatbot';
import HeroSection from './components/HeroSection';
import ShopPage from './components/ShopPage';
import QuotePage from './components/QuotePage';
import AdminPanel from './components/AdminPanel';
import { Menu, X, Wrench, User } from 'lucide-react';
import { supabase } from './services/supabaseClient';
import { INITIAL_PRODUCTS, INITIAL_CONFIG, INITIAL_ANALYTICS, INITIAL_LOGS } from './data/constants';

const App: React.FC = () => {
  // Navigation State
  const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Data State
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(INITIAL_CONFIG);
  const [analytics, setAnalytics] = useState<AnalyticsStats>(INITIAL_ANALYTICS);
  const [visitorLogs, setVisitorLogs] = useState<VisitorLog[]>(INITIAL_LOGS);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  // Auth State - Set to FALSE for production so login is required
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Fake Analytics Tracker
  useEffect(() => {
    // Increment total visits
    setAnalytics(prev => ({
      ...prev,
      totalVisits: prev.totalVisits + 1,
      lastVisit: new Date().toISOString()
    }));

    // Add log entry
    const newLog: VisitorLog = {
      id: Date.now().toString(),
      action: 'Visita',
      timestamp: new Date().toISOString(),
      userType: Math.random() > 0.7 ? 'Recurrente' : 'Nuevo',
      details: `Navegación a ${currentPage}`
    };
    setVisitorLogs(prev => [newLog, ...prev].slice(0, 50)); // Keep last 50 logs
  }, [currentPage]);

  // --- PERSISTENCE: FETCH FROM SUPABASE ---
  useEffect(() => {
    const fetchPersistentData = async () => {
      // Fetch Products
      const { data: pData } = await supabase.from('products').select('*');
      if (pData) {
        setProducts(pData.map(p => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: p.price,
          category: p.category,
          condition: p.condition,
          imageUrl: p.image_url
        })));
      }

      // Fetch Config
      const { data: configData } = await supabase.from('site_config').select('*').single();
      if (configData) {
        setSiteConfig({
          heroTitle: configData.hero_title,
          heroSubtitle: configData.hero_subtitle,
          contactEmail: configData.contact_email,
          contactPhone: configData.contact_phone,
          address: configData.address,
          openingHours: configData.opening_hours
        });
      }

      // Fetch Quotes
      const { data: qData } = await supabase.from('quotes').select('*');
      if (qData) {
        setQuotes(qData.map(q => ({
          id: q.id,
          customerName: q.customer_name,
          contact: q.contact,
          deviceType: q.device_type,
          issueDescription: q.issue_description,
          status: q.status,
          date: new Date(q.created_at).toLocaleDateString()
        })));
      }

      // Fetch Invoices
      const { data: iData } = await supabase.from('invoices').select('*');
      if (iData) {
        setInvoices(iData.map(i => ({
          id: i.id,
          name: i.name,
          url: i.url,
          amount: i.amount,
          date: new Date(i.date).toLocaleDateString(),
          fileType: i.file_type
        })));
      }
    };
    fetchPersistentData();
  }, []);

  const navigate = (page: Page) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const handleQuoteSubmit = (newQuote: QuoteRequest) => {
    setQuotes(prev => [...prev, newQuote]);
    setAnalytics(prev => ({ ...prev, quoteRequests: prev.quoteRequests + 1 }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100 font-sans selection:bg-blue-500 selection:text-white">
      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-40 transition-all duration-300 ${isMobileMenuOpen ? 'bg-slate-900' : 'bg-slate-900/90 backdrop-blur-md'} border-b border-slate-800`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex-shrink-0 cursor-pointer flex items-center gap-2" onClick={() => navigate(Page.HOME)}>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl flex items-center justify-center transform rotate-3 shadow-lg shadow-blue-500/20">
                <Wrench className="text-white" size={24} />
              </div>
              <span className="text-2xl font-bold tracking-tighter text-white">L & G</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <button onClick={() => navigate(Page.HOME)} className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentPage === Page.HOME ? 'text-blue-400' : 'text-gray-300 hover:text-white'}`}>Inicio</button>
                <button onClick={() => navigate(Page.QUOTE)} className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentPage === Page.QUOTE ? 'text-blue-400' : 'text-gray-300 hover:text-white'}`}>Presupuestos</button>
                <button onClick={() => navigate(Page.SHOP)} className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentPage === Page.SHOP ? 'text-blue-400' : 'text-gray-300 hover:text-white'}`}>Tienda</button>
                <button onClick={() => navigate(Page.ADMIN)} className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium border transition-all ${currentPage === Page.ADMIN ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-800 border-slate-700 text-gray-300 hover:bg-slate-700'}`}><User size={14} /> Admin</button>
              </div>
            </div>
            <div className="-mr-2 flex md:hidden">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="bg-slate-800 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-slate-700 focus:outline-none transition-colors">
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
        {isMobileMenuOpen && (
          <div className="md:hidden bg-slate-900 border-b border-slate-800 animate-slide-up">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <button onClick={() => navigate(Page.HOME)} className="block w-full text-left px-3 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-slate-800 rounded-lg">Inicio</button>
              <button onClick={() => navigate(Page.QUOTE)} className="block w-full text-left px-3 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-slate-800 rounded-lg">Presupuestos</button>
              <button onClick={() => navigate(Page.SHOP)} className="block w-full text-left px-3 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-slate-800 rounded-lg">Tienda</button>
              <button onClick={() => navigate(Page.ADMIN)} className="block w-full text-left px-3 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-slate-800 rounded-lg">Admin</button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow relative">
        {currentPage === Page.HOME && <HeroSection config={siteConfig} navigate={navigate} />}
        {currentPage === Page.SHOP && <ShopPage products={products} />}
        {currentPage === Page.QUOTE && <QuotePage onQuoteSubmit={handleQuoteSubmit} navigate={navigate} />}
        {currentPage === Page.ADMIN && (
          <AdminPanel
            products={products}
            setProducts={setProducts}
            quotes={quotes}
            setQuotes={setQuotes}
            siteConfig={siteConfig}
            setSiteConfig={setSiteConfig}
            invoices={invoices}
            setInvoices={setInvoices}
            analytics={analytics}
            visitorLogs={visitorLogs}
            navigate={navigate}
            isAuthenticated={isAuthenticated}
            setIsAuthenticated={setIsAuthenticated}
          />
        )}
      </main>

      {/* Footer */}
      {currentPage !== Page.ADMIN && (
        <footer className="bg-slate-950 border-t border-slate-900 py-12 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
              <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center justify-center md:justify-start gap-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center transform rotate-3">
                    <Wrench className="text-white" size={16} />
                  </div>
                  L & G Reparaciones
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Comprometidos con la excelencia técnica. Recuperamos la funcionalidad de tus dispositivos más preciados con garantía y profesionalismo.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-xs text-blue-400">Contacto</h4>
                <p className="text-gray-400 text-sm mb-2">{siteConfig.address}</p>
                <p className="text-gray-400 text-sm mb-2 hover:text-white transition-colors cursor-pointer">{siteConfig.contactEmail}</p>
                <p className="text-gray-400 text-sm hover:text-white transition-colors cursor-pointer">{siteConfig.contactPhone}</p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-xs text-blue-400">Horarios</h4>
                <p className="text-gray-400 text-sm mb-2">{siteConfig.openingHours}</p>
                <p className="text-gray-400 text-sm mb-2">Sáb: 10:00 - 14:00</p>
                <p className="text-gray-500 text-sm">Dom: Cerrado</p>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-slate-900 text-center text-gray-600 text-xs flex flex-col md:flex-row justify-between items-center">
              <span>&copy; {new Date().getFullYear()} L & G Reparaciones. Todos los derechos reservados.</span>
              <div className="flex gap-4 mt-4 md:mt-0">
                <span className="hover:text-gray-400 cursor-pointer">Privacidad</span>
                <span className="hover:text-gray-400 cursor-pointer">Términos</span>
              </div>
            </div>
          </div>
        </footer>
      )}

      {/* Widgets */}
      <Chatbot />
    </div>
  );
};

export default App;