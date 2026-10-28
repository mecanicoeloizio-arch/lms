import React from 'react';
import { User } from '../types/lms';
import { LMSStorageService } from '../services/storage';
import { handleImageError } from '../utils/imageFallbacks';
import { 
  Users, 
  BookOpen, 
  Award, 
  WalletCards, 
  Play, 
  TrendingUp, 
  Shield, 
  ShieldCheck,
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Server,
  FileCode,
  Wrench,
  Sparkles,
  MapPin,
  Phone,
  Coffee,
  Check,
  ExternalLink,
  Cpu,
  Layers
} from 'lucide-react';

interface DashboardOverviewProps {
  currentUser: User;
  onNavigate: (section: string) => void;
  onOpenPlayer: (courseId: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  currentUser,
  onNavigate,
  onOpenPlayer
}) => {
  const courses = LMSStorageService.getCourses();
  const enrollments = LMSStorageService.getEnrollments();
  const users = LMSStorageService.getUsers();
  const certificates = LMSStorageService.getCertificates();
  const orders = LMSStorageService.getOrders();

  const totalRevenue = orders
    .filter(o => o.status === 'approved')
    .reduce((sum, o) => sum + o.amountBrl, 0);

  const activeStudentsCount = users.filter(u => u.role === 'student' && u.active).length;
  const isStudent = currentUser.role === 'student';

  // Fotos com alta relevância visual e neuromarketing (URLs verificadas com status 200)
  const courseImages: Record<string, string> = {
    'course-mec-01': 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80',
    'course-cont-02': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80'
  };

  const defaultCourseImg = 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="space-y-8">
      {/* Mensagem Humanizada e Acolhedora da Luiza Souza (Atendente Oficial & Gestora IA) */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md border border-amber-400/40">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-400 shadow-sm shrink-0 bg-slate-800">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80" 
                alt="Luiza Souza - Atendente Oficial & Gestora IA Grupo Eloizio" 
                className="w-full h-full object-cover"
                onError={(e) => handleImageError(e, 'luiza')}
              />
            </div>
            <span className="absolute -bottom-1 -right-1 bg-emerald-400 w-3.5 h-3.5 rounded-full border-2 border-slate-900" title="Online agora" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Luiza Souza informa:
              </span>
              <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded font-mono">
                FUNC-001
              </span>
              <span className="text-[10px] bg-blue-900/60 text-blue-200 font-semibold px-2 py-0.5 rounded-full border border-blue-400/30">
                São Gonçalo - RJ
              </span>
            </div>
            <p className="text-xs text-blue-100 mt-1 leading-snug max-w-2xl">
              "Central do Grupo Eloizio 100% ativa! Sou sua atendente oficial e gestora do ecossistema. Seja para consertar sua máquina de costura em São Gonçalo, matricular-se nos cursos técnicos online ou emitir notas e MEI, estou à disposição!"
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <a
            href="https://wa.me/5521996134073?text=Olá%20Luiza%20Souza,%20vim%20pelo%20site%20do%20Grupo%20Eloizio%20e%20preciso%20de%20atendimento!"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Falar com Luiza no WhatsApp (21) 99613-4073</span>
          </a>
        </div>
      </div>

      {/* Hero Banner Visual com Fotografia de Alta Definição */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-800 text-white">
        {/* Imagem de Fundo com Gradiente de Contraste Dual-Coding */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?auto=format&fit=crop&w=1600&q=80" 
            alt="Mecânica de Máquinas de Costura em São Gonçalo - Grupo Eloizio" 
            className="w-full h-full object-cover object-center filter brightness-[0.32] contrast-125"
            onError={(e) => handleImageError(e, 'machine')}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/95 via-blue-950/80 to-transparent" />
        </div>

        <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs bg-amber-400 text-slate-950 px-3 py-1 rounded-full font-bold tracking-wide uppercase shadow-xs flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Líder em São Gonçalo & RJ
            </span>
            <span className="text-xs bg-white/20 text-blue-100 backdrop-blur-md px-3 py-1 rounded-full font-mono">
              Site: grupoeloizio.com.br
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-sm">
            Máquinas de Costura, Cursos Livres & Assessoria Contábil
          </h1>

          <p className="text-sm sm:text-base text-blue-100 leading-relaxed max-w-2xl font-normal">
            Oficina especializada em reforma, compra, venda e calibração de máquinas industriais e domésticas em São Gonçalo-RJ. Plataforma de cursos técnicos 100% online com certificado registrado e assessoria digital.
          </p>

          {/* Badges de Confiança Neuro-Visuais */}
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-blue-200">
            <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Oficina Física: São Gonçalo - RJ</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Checkout Oficial Mercado Pago</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10">
              <Award className="w-4 h-4 text-yellow-400 shrink-0" />
              <span>Certificados com QR Code e Lei 9.394/96</span>
            </div>
          </div>

          {/* CTAs de Ação Rápida */}
          <div className="pt-4 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('showcase')}
              className="flex items-center gap-2 px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-sm font-black transition-all shadow-md hover:scale-[1.02]"
            >
              <span>Ver Vitrine de Cursos Padrão Ouro</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('simulator')}
              className="flex items-center gap-2 px-4 py-3 bg-white/15 hover:bg-white/25 text-white backdrop-blur-md rounded-xl text-sm font-semibold transition-all border border-white/25"
            >
              <Cpu className="w-4 h-4 text-amber-300" />
              <span>Simulador de Bancada Virtual</span>
            </button>
            <button
              onClick={() => onNavigate('courses')}
              className="flex items-center gap-2 px-4 py-3 bg-blue-900/80 hover:bg-blue-800 text-white rounded-xl text-sm font-semibold transition-all border border-blue-500/30"
            >
              <BookOpen className="w-4 h-4 text-blue-300" />
              <span>Catálogo Acadêmico</span>
            </button>
          </div>
        </div>
      </div>

      {/* OS TRÊS PILARES DO GRUPO ELOIZIO - CARDS VISUAIS DE ALTA CONVERSÃO */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Layers className="w-6 h-6 text-blue-900" />
              <span>Pilares de Atuação do Grupo Eloizio</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Excelência prática com atendimento direto no Rio de Janeiro e alcance nacional 100% online
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pilar 1: Máquinas de Costura & Mecânica */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col">
            <div className="relative h-48 w-full overflow-hidden group bg-slate-900">
              <img 
                src="https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80" 
                alt="Oficina de Máquinas de Costura em São Gonçalo" 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => handleImageError(e, 'machine')}
              />
              <div className="absolute top-3 left-3 bg-blue-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                São Gonçalo - RJ
              </div>
              <div className="absolute bottom-2 right-2 bg-slate-950/80 backdrop-blur-xs text-white text-[11px] font-mono px-2 py-0.5 rounded">
                Retas · Overlocks · Galoneiras
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                  1. Máquinas de Costura & Mecânica Especializada
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Compra, venda, conserto, reforma completa e venda de peças originais. Atendimento a facções, estilistas, ateliês e suporte técnico a profissionais de toda a região metropolitana do RJ.
                </p>
                <div className="pt-1 flex flex-wrap gap-1.5">
                  <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">Manutenção Preventiva</span>
                  <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">Direct Drive</span>
                  <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">Lançadeiras</span>
                </div>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <a
                  href="https://wa.me/5521987648727?text=Olá%20Eloizio,%20preciso%20de%20orçamento%20para%20minha%20máquina%20de%20costura!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-900 hover:text-blue-700"
                >
                  <Wrench className="w-3.5 h-3.5 text-blue-700" />
                  <span>Falar com Mecânico Chefe</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Pilar 2: Cursos Livres 100% Online */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col">
            <div className="relative h-48 w-full overflow-hidden group bg-slate-900">
              <img 
                src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80" 
                alt="Treinamento Técnico Prático de Mecânica Online" 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => handleImageError(e, 'course')}
              />
              <div className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
                100% Online
              </div>
              <div className="absolute bottom-2 right-2 bg-slate-950/80 backdrop-blur-xs text-white text-[11px] font-mono px-2 py-0.5 rounded">
                Certificado com QR Code
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                  2. Cursos Livres & Capacitação Técnica Prática
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Metodologia neurodidática direta ao ponto que ensina você a consertar e regular qualquer máquina com confiança. Alavanque sua renda mensal faturando de R$ 150 a R$ 350 por atendimento.
                </p>
                <div className="pt-1 flex flex-wrap gap-1.5">
                  <span className="text-[10px] bg-amber-50 text-amber-900 px-2 py-0.5 rounded font-medium">Do Zero ao Avançado</span>
                  <span className="text-[10px] bg-amber-50 text-amber-900 px-2 py-0.5 rounded font-medium">Bancada Virtual</span>
                  <span className="text-[10px] bg-amber-50 text-amber-900 px-2 py-0.5 rounded font-medium">Acesso Imediato</span>
                </div>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => onNavigate('showcase')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800"
                >
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                  <span>Matricule-se e Estude Hoje</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Pilar 3: Contabilidade & Assessoria Digital */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col">
            <div className="relative h-48 w-full overflow-hidden group bg-slate-900">
              <img 
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80" 
                alt="Assessoria Contábil Digital e Gestão MEI" 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => handleImageError(e, 'course')}
              />
              <div className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                100% Digital
              </div>
              <div className="absolute bottom-2 right-2 bg-slate-950/80 backdrop-blur-xs text-white text-[11px] font-mono px-2 py-0.5 rounded">
                Sem Burocracia
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                  3. Contabilidade & Assessoria 100% Online
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Serviços ágeis e digitais focados em praticidade (que não exigem CRC direto para execução). Emissão de notas, regularização de CNPJ MEI, controle financeiro e suporte fiscal para seu negócio crescer.
                </p>
                <div className="pt-1 flex flex-wrap gap-1.5">
                  <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-medium">Emissão de NFS-e</span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-medium">Declaração MEI</span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-medium">Gestão de Caixa</span>
                </div>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => onNavigate('courses')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-700"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Conhecer Curso Fiscal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEÇÃO VISUAL: ANTES VS. DEPOIS DA REFORMA TÉCNICA (NEUROMARKETING E CONTRASTE) */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 rounded-2xl p-6 sm:p-8 text-white space-y-6">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Padrão Ouro de Qualidade Mecânica</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Transformação Técnica: Veja a Diferença na Bancada
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            O cérebro humano processa contraste em menos de 100ms. Veja o que acontece quando uma máquina passa pelo diagnóstico e afinação do Grupo Eloizio:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cartão ANTES */}
          <div className="bg-slate-950/60 border border-rose-900/40 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-rose-900/30 pb-3">
              <span className="text-xs font-bold bg-rose-500/20 text-rose-300 px-3 py-1 rounded-full uppercase tracking-wider">
                Antes do Ajuste (Prejuízo)
              </span>
              <span className="text-xs text-rose-400 font-mono">Problemas Frequentes</span>
            </div>
            <div className="relative h-44 rounded-lg overflow-hidden border border-rose-900/30 bg-slate-900">
              <img 
                src="https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=600&q=80" 
                alt="Máquina com defeito mecânico e descalibrada" 
                className="w-full h-full object-cover filter grayscale contrast-125"
                onError={(e) => handleImageError(e, 'machine')}
              />
              <div className="absolute inset-0 bg-rose-950/40" />
              <div className="absolute bottom-2 left-2 bg-black/75 px-2 py-1 rounded text-[11px] text-rose-200 font-mono">
                Desalinhamento & Atrito
              </div>
            </div>
            <ul className="text-xs space-y-2 text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">✕</span>
                <span>Ponto pulando e linha superior quebrando a cada 30 segundos de costura.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">✕</span>
                <span>Bico da lançadeira gasto, arranhando a agulha e travando o tecido.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">✕</span>
                <span>Ruído de batida metálica e falta de lubrificação no cárter.</span>
              </li>
            </ul>
          </div>

          {/* Cartão DEPOIS */}
          <div className="bg-slate-950/60 border border-emerald-900/40 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-900/30 pb-3">
              <span className="text-xs font-bold bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full uppercase tracking-wider">
                Depois da Calibração Eloizio
              </span>
              <span className="text-xs text-emerald-400 font-mono">Ponto Impecável</span>
            </div>
            <div className="relative h-44 rounded-lg overflow-hidden border border-emerald-900/30 bg-slate-900">
              <img 
                src="https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80" 
                alt="Máquina regulada com precisão industrial" 
                className="w-full h-full object-cover"
                onError={(e) => handleImageError(e, 'machine')}
              />
              <div className="absolute inset-0 bg-emerald-950/20" />
              <div className="absolute bottom-2 left-2 bg-emerald-950/85 px-2 py-1 rounded text-[11px] text-emerald-200 font-mono font-bold">
                5.000 PPM Suaves & Silenciosos
              </div>
            </div>
            <ul className="text-xs space-y-2 text-slate-200">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Sincronismo micrométrico (0,05mm) entre bico da lançadeira e cava da agulha.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Ponto uniforme em seda fina, malha elástica e jeans pesado de 14 onças.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Fluxo de óleo verificado no visor do cabeçote com garantia de durabilidade.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* GALERIA FOTOGRÁFICA DA OFICINA & BANCADAS EM SÃO GONÇALO */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-blue-900" />
              <span>Nossa Oficina & Bancadas de Calibração em São Gonçalo</span>
            </h3>
            <p className="text-xs text-slate-500">
              Ambiente profissional equipado com ferramental imantado, calibradores de folga e instrumentos de precisão
            </p>
          </div>
          <span className="text-xs bg-slate-100 text-slate-700 font-mono px-2.5 py-1 rounded-md self-start sm:self-auto">
            São Gonçalo - RJ
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="h-32 rounded-xl overflow-hidden border border-slate-200 group bg-slate-900">
              <img 
                src="https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=500&q=80" 
                alt="Ajuste do cabeçote e dentes impelentes" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => handleImageError(e, 'machine')}
              />
            </div>
            <p className="text-[11px] font-bold text-slate-800 line-clamp-1">Cabeçote & Dentes Impelentes</p>
            <p className="text-[10px] text-slate-500 leading-tight">Regulagem milimétrica de altura e avanço do dente</p>
          </div>

          <div className="space-y-2">
            <div className="h-32 rounded-xl overflow-hidden border border-slate-200 group bg-slate-900">
              <img 
                src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=500&q=80" 
                alt="Diagnóstico de motores eletrônicos direct drive" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => handleImageError(e, 'machine')}
              />
            </div>
            <p className="text-[11px] font-bold text-slate-800 line-clamp-1">Motores Direct Drive & Painéis</p>
            <p className="text-[10px] text-slate-500 leading-tight">Configuração de parâmetros e códigos de erro</p>
          </div>

          <div className="space-y-2">
            <div className="h-32 rounded-xl overflow-hidden border border-slate-200 group bg-slate-900">
              <img 
                src="https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=500&q=80" 
                alt="Costura de teste com fios de alta tenacidade" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => handleImageError(e, 'machine')}
              />
            </div>
            <p className="text-[11px] font-bold text-slate-800 line-clamp-1">Costura de Teste em Alta Velocidade</p>
            <p className="text-[10px] text-slate-500 leading-tight">Validação de tração de linha e laçada inferior</p>
          </div>

          <div className="space-y-2">
            <div className="h-32 rounded-xl overflow-hidden border border-slate-200 group bg-slate-900">
              <img 
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=500&q=80" 
                alt="Plataforma de ensino e simulador digital" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => handleImageError(e, 'course')}
              />
            </div>
            <p className="text-[11px] font-bold text-slate-800 line-clamp-1">Bancada Virtual & EAD</p>
            <p className="text-[10px] text-slate-500 leading-tight">Simulações de falhas e diagnósticos interativos</p>
          </div>
        </div>
      </div>

      {/* Grid de Métricas do LMS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Alunos Ativos</span>
            <Users className="w-4 h-4 text-blue-900" />
          </div>
          <p className="text-xl sm:text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {activeStudentsCount}
          </p>
          <span className="text-[10px] text-slate-500 font-mono">Matrículas no sistema</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Cursos Publicados</span>
            <BookOpen className="w-4 h-4 text-blue-900" />
          </div>
          <p className="text-xl sm:text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {courses.length}
          </p>
          <span className="text-[10px] text-slate-500 font-mono">Módulos modulares</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Certificados Emitidos</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl sm:text-2xl font-bold font-mono text-emerald-700 tabular-nums">
            {certificates.length}
          </p>
          <span className="text-[10px] text-emerald-600 font-mono">100% com QR Code</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Faturamento BRL</span>
            <WalletCards className="w-4 h-4 text-blue-900" />
          </div>
          <p className="text-xl sm:text-2xl font-bold font-mono text-blue-900 tabular-nums">
            R$ {totalRevenue.toFixed(2)}
          </p>
          <span className="text-[10px] text-slate-500 font-mono">Via Mercado Pago</span>
        </div>
      </div>

      {/* Grid Secundário: Cursos Destaque & Credenciais Oficiais Grupo Eloizio */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna 1 e 2: Cursos em Destaque com Imagens Temáticas */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900">Catálogo de Cursos & Formações em Andamento</h3>
            <button
              onClick={() => onNavigate('courses')}
              className="text-xs text-blue-900 hover:underline font-semibold flex items-center gap-1"
            >
              <span>Ver todos ({courses.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {courses.slice(0, 4).map(course => (
              <div
                key={course.id}
                className="border border-slate-200 rounded-xl overflow-hidden flex flex-col justify-between hover:border-slate-300 transition-colors shadow-xs"
              >
                {/* Imagem do Curso */}
                <div className="relative h-32 w-full overflow-hidden bg-slate-900">
                  <img 
                    src={courseImages[course.id] || defaultCourseImg} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                    onError={(e) => handleImageError(e, 'course')}
                  />
                  <div className="absolute top-2 left-2 bg-blue-950/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                    {course.category}
                  </div>
                  <div className="absolute bottom-2 right-2 bg-slate-900/90 text-amber-400 font-mono text-[11px] font-bold px-2 py-0.5 rounded">
                    R$ {course.priceBrl.toFixed(2)}
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2">
                      {course.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                      {course.shortDescription}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-500 font-medium">
                      Carga: {course.durationHours}h
                    </span>
                    <button
                      onClick={() => onOpenPlayer(course.id)}
                      className="flex items-center gap-1 text-xs font-bold text-blue-900 hover:text-blue-800"
                    >
                      <span>Abrir Sala de Aula</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coluna 3: Credenciais de Confiança & Suporte Grupo Eloizio */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>Credenciais & Garantia</span>
              </h3>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Oficial</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-semibold">Oficina Física em São Gonçalo - RJ</strong>
                  <span className="text-slate-500 text-[11px]">Bancadas de teste e calibração de máquinas industriais e domésticas.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-semibold">Pagamentos via Mercado Pago</strong>
                  <span className="text-slate-500 text-[11px]">Processamento com Pix imediato e cartão parcelado com proteção total.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <Award className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-semibold">Certificados Válidos (Lei 9.394/96)</strong>
                  <span className="text-slate-500 text-[11px]">Emissão instantânea com QR Code rastreável para comprovação curricular.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-semibold">Atendimento Direto & Humanizado</strong>
                  <span className="text-slate-500 text-[11px]">Eloizio e Camilla Faria disponíveis no WhatsApp (21) 99613-4073.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-mono">grupoeloizio.com.br</span>
            <button
              onClick={() => onNavigate('showcase')}
              className="text-xs font-bold text-blue-900 hover:text-blue-800 flex items-center gap-1"
            >
              <span>Ver Vitrine</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
