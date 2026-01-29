import React from 'react';
import { Product } from '../types';
import { ShoppingBag, RefreshCw, Star } from 'lucide-react';

interface ShopPageProps {
  products: Product[];
}

const ShopPage: React.FC<ShopPageProps> = ({ products }) => {
  const newProducts = products.filter(p => p.condition === 'new');
  const refurbishedProducts = products.filter(p => p.condition === 'refurbished');

  const ProductCard = ({ product }: { product: Product }) => (
    <div className="bg-slate-800 rounded-2xl overflow-hidden shadow-xl border border-slate-700 hover:border-blue-500/50 transition-all group animate-slide-up h-full flex flex-col">
      <div className="h-64 overflow-hidden relative">
        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className={`absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full uppercase shadow-lg ${product.condition === 'new' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'}`}>
          {product.category}
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-grow">{product.description}</p>
        <div className="flex justify-between items-center mt-auto">
          <span className="text-2xl font-bold text-blue-400">${product.price}</span>
          <button className="flex items-center gap-2 bg-slate-700 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium">
            <ShoppingBag size={16} /> Comprar
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="pt-24 pb-20 px-4 max-w-7xl mx-auto min-h-screen">
      <div className="text-center mb-16 animate-fade-in">
        <h2 className="text-4xl font-bold text-white mb-4">Tienda Online</h2>
        <p className="text-gray-400">Encuentra accesorios nuevos y equipos restaurados con garantía.</p>
      </div>

      {/* New Products Section */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-8">
           <div className="p-2 bg-blue-600 rounded-lg"><Star className="text-white" size={24} /></div>
           <h3 className="text-2xl font-bold text-white">Productos Nuevos</h3>
        </div>
        
        {newProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-gray-500 italic bg-slate-800/30 p-8 rounded-xl border border-dashed border-slate-700">
            Próximamente stock de productos nuevos.
          </div>
        )}
      </div>

      {/* Refurbished Products Section */}
      <div>
        <div className="flex items-center gap-3 mb-8">
           <div className="p-2 bg-green-600 rounded-lg"><RefreshCw className="text-white" size={24} /></div>
           <div>
             <h3 className="text-2xl font-bold text-white">Oportunidades Restauradas</h3>
             <p className="text-sm text-green-400">Stock recuperado - Probado y garantizado</p>
           </div>
        </div>

        {refurbishedProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {refurbishedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-gray-500 italic bg-slate-800/30 p-8 rounded-xl border border-dashed border-slate-700">
            No hay equipos restaurados disponibles en este momento.
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;