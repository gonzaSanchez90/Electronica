import React from 'react';
import { Page, SiteConfig } from '../types';

interface HeroSectionProps {
  config: SiteConfig;
  navigate: (page: Page) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ config, navigate }) => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[20s] hover:scale-105"
        style={{ backgroundImage: `url('https://picsum.photos/id/201/1920/1080')` }}
      >
        <div className="absolute inset-0 bg-slate-900/70"></div>
      </div>
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4 max-w-5xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight animate-slide-up uppercase drop-shadow-lg">
          {config.heroTitle}
        </h1>
        <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl animate-fade-in delay-150 font-light">
          {config.heroSubtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 animate-slide-up delay-300">
          <button onClick={() => navigate(Page.QUOTE)} className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-blue-500/50 transform hover:-translate-y-1">
            Solicitar Presupuesto
          </button>
          <button onClick={() => navigate(Page.SHOP)} className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white hover:bg-white hover:text-slate-900 text-white rounded-full font-bold text-lg transition-all transform hover:-translate-y-1">
            Ver Stock Restaurado
          </button>
        </div>
      </div>
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-white/50">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;