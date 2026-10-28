import React from 'react';
import { Sparkles, MessageCircle } from 'lucide-react';
import { handleImageError } from '../utils/imageFallbacks';

interface LuizaFloatingWidgetProps {
  onOpen: () => void;
}

export const LuizaFloatingWidget: React.FC<LuizaFloatingWidgetProps> = ({ onOpen }) => {
  return (
    <aside 
      aria-label="Atendimento com Luiza Souza" 
      className="fixed bottom-5 right-5 z-40 no-print"
    >
      <button
        onClick={onOpen}
        className="flex items-center gap-3 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white pl-2.5 pr-4 py-2.5 rounded-full shadow-2xl hover:shadow-3xl hover:scale-[1.04] active:scale-95 transition-all border-2 border-amber-400 group cursor-pointer focus:outline-hidden"
        title="Falar com Luiza Souza (Atendente Oficial & Gestora IA - Matrícula FUNC-LUIZA-001)"
      >
        {/* Avatar Oficial com Indicador Online */}
        <div className="relative w-10 h-10 rounded-full border-2 border-amber-400 overflow-hidden shrink-0 bg-slate-800 shadow-md">
          <img 
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80" 
            alt="Luiza Souza - Atendente Oficial Grupo Eloizio" 
            className="w-full h-full object-cover"
            onError={(e) => handleImageError(e, 'luiza')}
          />
          <span 
            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full animate-pulse" 
            title="Online agora" 
          />
        </div>

        {/* Textos de Identificação Funcional e Atendimento */}
        <div className="text-left hidden xs:block sm:block pr-1">
          <div className="text-xs font-black leading-none text-white flex items-center gap-1.5">
            <span>Luiza Souza</span>
            <span className="text-[8px] bg-amber-400 text-slate-950 px-1 py-0.2 rounded font-black font-mono">
              FUNC-001
            </span>
          </div>
          <div className="text-[10px] text-blue-200 leading-none mt-1 font-medium flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-amber-300" />
            <span>Atendente &amp; Gestora IA</span>
          </div>
        </div>

        {/* Badge de Ação */}
        <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1 group-hover:bg-amber-300 transition-colors">
          <MessageCircle className="w-3 h-3 text-slate-950" />
          <span>Atendimento</span>
        </span>
      </button>
    </aside>
  );
};
