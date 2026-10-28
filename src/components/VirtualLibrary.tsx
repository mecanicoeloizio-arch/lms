import React, { useState } from 'react';
import { LibraryResource } from '../types/lms';
import { LMSStorageService } from '../services/storage';
import { 
  BookOpen, 
  Search, 
  Download, 
  FileText, 
  Wrench, 
  Zap, 
  Layers, 
  CheckCircle2,
  ExternalLink,
  Sparkles
} from 'lucide-react';

export const VirtualLibrary: React.FC = () => {
  const [resources, setResources] = useState<LibraryResource[]>(LMSStorageService.getLibraryResources());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [downloadSuccessId, setDownloadSuccessId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'Todo o Acervo' },
    { id: 'manual_servico', label: 'Manuais de Serviço' },
    { id: 'esquema_eletrico', label: 'Esquemas Elétricos' },
    { id: 'catalogo_pecas', label: 'Catálogo de Peças' },
    { id: 'guia_fiscal', label: 'Guias Fiscais MEI' }
  ];

  const filteredResources = resources.filter(res => {
    const matchesCategory = selectedCategory === 'all' || res.category === selectedCategory;
    const matchesSearch = res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (res.machineBrand && res.machineBrand.toLowerCase().includes(searchTerm.toLowerCase())) ||
      res.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDownload = (id: string, title: string) => {
    LMSStorageService.downloadLibraryResource(id);
    setResources(LMSStorageService.getLibraryResources());
    setDownloadSuccessId(id);
    setTimeout(() => setDownloadSuccessId(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header da Biblioteca */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-900" />
            <span>Biblioteca Virtual & Acervo Técnico de Bancada</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Apostilas oficiais, vistas explodidas, manuais de serviço e tabelas de regulagem para alunos do Grupo Eloizio
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg shrink-0">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>{resources.length} Manuais Técnicos Disponíveis</span>
        </div>
      </div>

      {/* Barra de Busca e Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por modelo de máquina (Siruba, Singer, Jack, Brother...), peça ou termo técnico..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 shadow-xs"
          />
        </div>

        {/* Categorias (Segmented buttons) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar shrink-0">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-2 text-xs rounded-xl whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-blue-900 text-white font-semibold shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Manuais e Materiais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map(res => {
          const isDownloaded = downloadSuccessId === res.id;

          return (
            <div
              key={res.id}
              className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all shadow-xs"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-blue-900 uppercase tracking-wide">
                    {res.machineBrand || 'Material Técnico'}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {res.pagesCount} páginas
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm leading-snug">
                  {res.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {res.description}
                </p>

                <div className="flex items-center gap-3 text-xs text-slate-400 font-mono pt-1">
                  <span>{(res.fileSizeBytes / 1024 / 1024).toFixed(1)} MB</span>
                  <span>·</span>
                  <span>PDF de Alta Resolução</span>
                  <span>·</span>
                  <span>{res.downloadsCount} downloads</span>
                </div>
              </div>

              {/* Ação de Download */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => handleDownload(res.id, res.title)}
                  className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                    isDownloaded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-blue-900 text-white hover:bg-blue-800 shadow-xs'
                  }`}
                >
                  {isDownloaded ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-white" />
                      <span>Download Concluído!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Baixar Manual Técnico (PDF)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredResources.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-2">
          <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="text-sm font-bold text-slate-800">Nenhum documento encontrado para sua busca</p>
          <p className="text-xs text-slate-400">Tente buscar por termos mais genéricos como "Siruba", "Lançadeira" ou "MEI".</p>
        </div>
      )}
    </div>
  );
};
