import React, { useState } from 'react';
import { Page, QuoteRequest } from '../types';
import { CheckCircle } from 'lucide-react';
import { APPLIANCE_TYPES } from '../data/constants';

interface QuotePageProps {
  onQuoteSubmit: (quote: QuoteRequest) => void;
  navigate: (page: Page) => void;
}

const QuotePage: React.FC<QuotePageProps> = ({ onQuoteSubmit, navigate }) => {
  const [quoteForm, setQuoteForm] = useState({ 
    name: '', contact: '', description: '', deviceType: '', customDeviceType: '' 
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteForm.deviceType) {
      alert("Por favor selecciona un tipo de dispositivo.");
      return;
    }
    
    // Logic: If 'other' is selected, use the custom text field. Otherwise use the label.
    let finalDeviceType = "";
    if (quoteForm.deviceType === 'other') {
       if (!quoteForm.customDeviceType.trim()) {
         alert("Por favor especifica qué equipo quieres reparar.");
         return;
       }
       finalDeviceType = quoteForm.customDeviceType;
    } else {
       finalDeviceType = APPLIANCE_TYPES.find(t => t.id === quoteForm.deviceType)?.label || quoteForm.deviceType;
    }

    const newQuote: QuoteRequest = {
      id: Date.now().toString(),
      customerName: quoteForm.name,
      contact: quoteForm.contact,
      deviceType: finalDeviceType,
      issueDescription: quoteForm.description,
      date: new Date().toLocaleDateString(),
      status: 'Pendiente'
    };

    onQuoteSubmit(newQuote);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="pt-32 px-4 max-w-2xl mx-auto min-h-screen text-center flex flex-col items-center">
        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle className="text-green-500 w-12 h-12" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">¡Solicitud Enviada!</h2>
        <p className="text-gray-300 mb-8 max-w-md mx-auto">
          Gracias <span className="text-blue-400 font-bold">{quoteForm.name}</span>. Hemos recibido tu consulta. 
          Nuestros técnicos analizarán el problema de tu <span className="text-white font-bold">{quoteForm.customDeviceType || APPLIANCE_TYPES.find(t => t.id === quoteForm.deviceType)?.label}</span> y te contactarán en <span className="text-blue-400 font-bold">{quoteForm.contact}</span>.
        </p>
        <button 
          onClick={() => {
            setSubmitted(false);
            setQuoteForm({ name: '', contact: '', description: '', deviceType: '', customDeviceType: '' });
            navigate(Page.HOME);
          }}
          className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20"
        >
          Volver al Inicio
        </button>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 px-4 max-w-5xl mx-auto min-h-screen">
      <div className="text-center mb-12 animate-fade-in">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Solicitar Presupuesto</h2>
        <p className="text-gray-400">Diagnóstico rápido y profesional para electrónica y hogar.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-800/50 backdrop-blur-sm p-6 md:p-8 rounded-3xl border border-slate-700 shadow-2xl animate-slide-up">
        <div className="mb-8">
          <label className="block text-white text-sm font-bold mb-4 uppercase tracking-wider text-blue-400">1. ¿Qué deseas reparar?</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {APPLIANCE_TYPES.map((type) => (
              <div 
                key={type.id}
                onClick={() => setQuoteForm({...quoteForm, deviceType: type.id, customDeviceType: ''})}
                className={`cursor-pointer rounded-xl p-3 border-2 transition-all flex flex-col items-center gap-2 text-center group relative overflow-hidden ${
                  quoteForm.deviceType === type.id 
                    ? 'border-blue-500 bg-blue-600/10 scale-105 shadow-xl shadow-blue-500/10' 
                    : 'border-slate-700 bg-slate-800 hover:border-slate-500 hover:bg-slate-750'
                }`}
              >
                <div className={`p-3 rounded-full transition-colors z-10 ${quoteForm.deviceType === type.id ? 'bg-blue-500 text-white' : 'bg-slate-700 text-gray-400 group-hover:text-white group-hover:bg-slate-600'}`}>
                  {type.icon}
                </div>
                <span className={`text-sm font-medium z-10 ${quoteForm.deviceType === type.id ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                  {type.label}
                </span>
                {quoteForm.deviceType === type.id && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                )}
              </div>
            ))}
          </div>

          {/* Conditional Input for "Other" or specific categories that might need clarification, 
              but specifically requested for "Otros" to allow free text input */}
          {quoteForm.deviceType === 'other' && (
            <div className="mt-6 animate-fade-in bg-slate-700/30 p-5 rounded-xl border border-slate-600 border-dashed">
              <label className="block text-blue-300 text-sm font-bold mb-2">Escribe el nombre del dispositivo:</label>
              <input 
                autoFocus
                type="text" 
                placeholder="Ej: Amplificador de guitarra, Máquina de coser, etc..."
                className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                value={quoteForm.customDeviceType}
                onChange={(e) => setQuoteForm({...quoteForm, customDeviceType: e.target.value})}
              />
              <p className="text-xs text-gray-500 mt-2">Nuestros técnicos evaluarán si es posible realizar la reparación.</p>
            </div>
          )}
          
          {/* Helpful context for specific categories */}
          {quoteForm.deviceType === 'kitchen' && (
            <div className="mt-4 text-sm text-gray-400 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
              <span className="text-blue-400 font-bold">Incluye:</span> Microondas, hornos eléctricos, batidoras, licuadoras, cafeteras, tostadoras, etc.
            </div>
          )}
           {quoteForm.deviceType === 'home' && (
            <div className="mt-4 text-sm text-gray-400 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
              <span className="text-blue-400 font-bold">Incluye:</span> Planchas, aspiradoras, ventiladores (de pie/techo), caloventores, estufas eléctricas, etc.
            </div>
          )}
        </div>

        <div className="mb-8">
          <label className="block text-white text-sm font-bold mb-4 uppercase tracking-wider text-blue-400">2. Tus Datos</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-400 text-xs font-bold mb-2">NOMBRE COMPLETO</label>
              <input 
                required
                type="text" 
                value={quoteForm.name}
                onChange={e => setQuoteForm({...quoteForm, name: e.target.value})}
                className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors placeholder-slate-600"
                placeholder="Ej: Juan Pérez"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-xs font-bold mb-2">TELÉFONO O EMAIL</label>
              <input 
                required
                type="text" 
                value={quoteForm.contact}
                onChange={e => setQuoteForm({...quoteForm, contact: e.target.value})}
                className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors placeholder-slate-600"
                placeholder="Ej: 600 123 456"
              />
            </div>
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-white text-sm font-bold mb-4 uppercase tracking-wider text-blue-400">3. El Problema</label>
          <textarea 
            required
            value={quoteForm.description}
            onChange={e => setQuoteForm({...quoteForm, description: e.target.value})}
            className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-white h-32 focus:outline-none focus:border-blue-500 resize-none transition-colors placeholder-slate-600"
            placeholder="Describe la marca, el modelo y qué falla presenta (ej: No enciende, hace ruido extraño, se cayó...)"
          ></textarea>
        </div>

        <button 
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
        >
          <CheckCircle size={20} /> Solicitar Presupuesto
        </button>
      </form>
    </div>
  );
};

export default QuotePage;