import React, { useState, useEffect } from 'react';
import { Course, CourseTestimonial } from '../types/lms';
import { LMSStorageService } from '../services/storage';
import { handleImageError } from '../utils/imageFallbacks';
import { 
  Sparkles, 
  ShieldCheck, 
  Award, 
  Clock, 
  Star, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight, 
  Zap, 
  Check, 
  X,
  Play,
  Calculator,
  TrendingUp,
  Wrench,
  Cpu,
  Layers,
  DollarSign,
  CheckCircle2,
  ThumbsUp
} from 'lucide-react';

interface HighConversionShowcaseProps {
  onSelectCourse: (courseId: string) => void;
  onOpenPlayer: (courseId: string) => void;
  onOpenSimulator?: () => void;
}

export const HighConversionShowcase: React.FC<HighConversionShowcaseProps> = ({
  onSelectCourse,
  onOpenPlayer,
  onOpenSimulator
}) => {
  const courses = LMSStorageService.getCourses();
  const mainCourse = courses.find(c => c.id === 'course-mec-01') || courses[0];
  const testimonials = LMSStorageService.getTestimonials();

  // Contagem regressiva de lote promocional
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 35, seconds: 48 });
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Calculadora Neurofinanceira de Renda
  const [machinesPerWeek, setMachinesPerWeek] = useState<number>(4);
  const [averagePricePerService, setAveragePricePerService] = useState<number>(180);

  // Cálculos do ROI
  const weeklyRevenue = machinesPerWeek * averagePricePerService;
  const monthlyRevenue = weeklyRevenue * 4;
  const coursePrice = mainCourse.priceBrl || 297;
  const servicesToPayback = Math.ceil(coursePrice / averagePricePerService);

  // Demonstração em Vídeo
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);
  const [activeVideoTopic, setActiveVideoTopic] = useState<'lancadeira' | 'overlock' | 'motor'>('lancadeira');

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const faqs = [
    {
      q: 'Preciso ter conhecimento prévio de mecânica para começar?',
      a: 'Não! O método do Grupo Eloizio foi concebido exatamente do absoluto zero. Você aprende desde a empunhadura correta das chaves de fenda até o sincronismo micrométrico da lançadeira e loopers.'
    },
    {
      q: 'O certificado é reconhecido e tem validade em todo o Brasil?',
      a: 'Sim! Nossos certificados são emitidos com fundamento na Lei de Diretrizes e Bases da Educação Nacional (Lei 9.394/96), possuem código de validação único e QR Code para comprovação em empresas, indústrias de confecção e ateliês.'
    },
    {
      q: 'Como funciona a liberação automática do curso?',
      a: 'Pagando via Pix pelo Mercado Pago, o nosso sistema detecta a aprovação em menos de 10 segundos e desbloqueia sua matrícula e sala de aula na mesma hora!'
    },
    {
      q: 'E se eu tiver dúvidas durante as aulas práticas?',
      a: 'Você conta com suporte direto no WhatsApp do próprio Eloizio e dos instrutores, além do atendimento pedagógico do SOE e da nossa atendente inteligente Luiza Souza.'
    },
    {
      q: 'E se eu não me adaptar ao curso?',
      a: 'Você possui Garantia Incondicional de 7 Dias. Se por qualquer motivo você não gostar, basta solicitar o reembolso que devolvemos 100% do seu investimento pelo Mercado Pago, sem letras miúdas.'
    }
  ];

  return (
    <div className="space-y-12 max-w-6xl mx-auto py-2">
      {/* 1. HERO DE ALTA CONVERSÃO PADRÃO OURO */}
      <div className="bg-gradient-to-b from-blue-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-12 shadow-2xl relative overflow-hidden border border-white/10 text-center space-y-6">
        {/* Faixa de Urgência Ética */}
        <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/40 text-amber-300 px-4 py-1.5 rounded-full text-xs font-mono font-semibold">
          <Clock className="w-3.5 h-3.5" />
          <span>Turma de Formação Oficial com Mentoria · Lote Encerra em:</span>
          <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-bold">
            {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight max-w-3xl mx-auto leading-tight">
          Domine a <span className="text-blue-400 underline decoration-amber-400 underline-offset-8">Mecânica de Máquinas de Costura</span> e Seja Disputado no Mercado Têxtil
        </h1>

        <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          O único método passo a passo com neuroaprendizagem visual que ensina o segredo da regulagem perfeita da lançadeira, facas, loopers e motores Direct Drive para você atender confecções e faturar de <strong>R$ 3.000 a R$ 8.000 por mês</strong>.
        </p>

        {/* 3 Selos de Confiança Instantânea */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto pt-2 text-xs">
          <div className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-xl p-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="font-semibold text-slate-200">Garantia Incondicional 7 Dias</span>
          </div>
          <div className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-xl p-3">
            <Award className="w-5 h-5 text-amber-400 shrink-0" />
            <span className="font-semibold text-slate-200">Certificado Oficial com QR Code</span>
          </div>
          <div className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-xl p-3">
            <Zap className="w-5 h-5 text-blue-400 shrink-0" />
            <span className="font-semibold text-slate-200">Acesso Imediato via Pix</span>
          </div>
        </div>

        {/* CTA Principal de Conversão & Botão de Simulador */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onSelectCourse(mainCourse.id)}
            className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-xl transition-all transform hover:-translate-y-0.5 inline-flex items-center justify-center gap-3 active:scale-98"
          >
            <span>QUERO GARANTIR MINHA VAGA COM DESCONTO</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          {onOpenSimulator && (
            <button
              onClick={onOpenSimulator}
              className="w-full sm:w-auto px-6 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/30 font-bold text-sm rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              <Cpu className="w-4 h-4 text-amber-400" />
              <span>Testar Simulador de Bancada</span>
            </button>
          )}
        </div>
        <p className="text-[11px] text-slate-400 font-mono">
          Pagamento 100% Seguro processado pela API Oficial do Mercado Pago
        </p>
      </div>

      {/* 2. DEMONSTRAÇÃO VISUAL EM VÍDEO DA OFICINA & DUAL-CODING */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-blue-800 bg-blue-50 px-3 py-1 rounded-full">
            <Play className="w-3.5 h-3.5" />
            <span>Demonstração Prática de Bancada</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Veja Como Nossas Aulas Ensinam na Prática da Oficina
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            Sem teoria enrolada. Você enxerga exatamente o ponto de contato do bico da lançadeira com a canaleta da agulha.
          </p>
        </div>

        {/* Tópicos de Visualização Rápida */}
        <div className="flex items-center justify-center gap-2 flex-wrap text-xs">
          <button
            onClick={() => setActiveVideoTopic('lancadeira')}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${
              activeVideoTopic === 'lancadeira'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            1. Ponto de Sincronismo (0,05mm)
          </button>
          <button
            onClick={() => setActiveVideoTopic('overlock')}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${
              activeVideoTopic === 'overlock'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            2. Cruzamento de Loopers da Overlock
          </button>
          <button
            onClick={() => setActiveVideoTopic('motor')}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${
              activeVideoTopic === 'motor'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            3. Ajuste de Parada de Agulha Direct Drive
          </button>
        </div>

        {/* Player de Vídeo Visual Estilizado com Imagem e Overlay */}
        <div className="relative rounded-2xl overflow-hidden aspect-video max-w-4xl mx-auto bg-slate-950 border border-slate-800 shadow-xl group">
          <img
            src={
              activeVideoTopic === 'lancadeira'
                ? 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1200&q=80'
                : activeVideoTopic === 'overlock'
                ? 'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?auto=format&fit=crop&w=1200&q=80'
                : 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80'
            }
            alt="Oficina Mecânica Grupo Eloizio"
            className="w-full h-full object-cover opacity-85 group-hover:scale-102 transition-transform duration-500"
            onError={(e) => handleImageError(e, 'machine')}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-between p-6">
            <div className="flex items-center justify-between">
              <span className="bg-amber-400 text-slate-950 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                Gravação em Alta Definição 4K
              </span>
              <span className="text-white text-xs font-mono font-semibold bg-black/60 px-2 py-0.5 rounded">
                Bancada de São Gonçalo - RJ
              </span>
            </div>

            <div className="text-center space-y-3">
              <button
                onClick={() => onOpenPlayer(mainCourse.id)}
                className="w-16 h-16 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center justify-center shadow-2xl mx-auto transform hover:scale-110 active:scale-95 transition-all"
                title="Assistir Aula Demonstrativa Completa"
              >
                <Play className="w-8 h-8 fill-slate-950 ml-1" />
              </button>
              <p className="text-white font-bold text-sm sm:text-base drop-shadow-md">
                {activeVideoTopic === 'lancadeira' && 'Aula 04: Ajuste Micrométrico da Lançadeira Rotativa (Passo a Passo)'}
                {activeVideoTopic === 'overlock' && 'Aula 07: Sincronismo dos Loopers e Pressão da Faca Superior'}
                {activeVideoTopic === 'motor' && 'Aula 11: Programação do Painel Digital e Sensor de Posição de Agulha'}
              </p>
              <p className="text-xs text-slate-300">
                Clique para abrir o player com o ambiente neurodidático completo
              </p>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-300 font-mono">
              <span>Instrutor: Eloizio & Equipe Técnica</span>
              <span>Carga Horária Total: 80 Horas</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. CALCULADORA NEUROFINANCEIRA DE ROI (GATILHO DE ANCORAGEM DE VALOR) */}
      <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-3xl p-6 sm:p-10 border border-blue-800/40 shadow-xl space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-400/30 px-3 py-1 rounded-full">
            <Calculator className="w-3.5 h-3.5" />
            <span>Simulador de Retorno do Investimento (ROI)</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight">
            Quanto Você Pode Faturar por Mês com Sua Oficina?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Descubra como consertar poucas máquinas por semana gera uma renda transformadora:
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
          {/* Sliders Interativos */}
          <div className="lg:col-span-7 space-y-6 bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="font-semibold text-slate-200 flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-amber-400" />
                  Máquinas atendidas por semana:
                </span>
                <span className="font-mono text-base font-bold text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded border border-amber-400/30">
                  {machinesPerWeek} {machinesPerWeek === 1 ? 'máquina' : 'máquinas'}/sem
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="15"
                step="1"
                value={machinesPerWeek}
                onChange={e => setMachinesPerWeek(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>1 máq/sem (Renda Extra)</span>
                <span>5 máq/sem (Meio Período)</span>
                <span>15 máq/sem (Oficina Cheia)</span>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="font-semibold text-slate-200 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  Valor médio cobrado por conserto/revisão:
                </span>
                <span className="font-mono text-base font-bold text-emerald-400 bg-emerald-400/10 px-2.5 py-0.5 rounded border border-emerald-400/30">
                  R$ {averagePricePerService.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="120"
                max="350"
                step="10"
                value={averagePricePerService}
                onChange={e => setAveragePricePerService(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>R$ 120 (Doméstica básica)</span>
                <span>R$ 180 (Industrial padrão)</span>
                <span>R$ 350 (Eletrônica / Revisão Geral)</span>
              </div>
            </div>
          </div>

          {/* Resultado Financeiro e Ancoragem */}
          <div className="lg:col-span-5 bg-gradient-to-b from-blue-900 to-indigo-950 border border-blue-600/50 rounded-2xl p-6 text-center space-y-4 shadow-xl">
            <span className="text-[11px] font-mono text-blue-200 uppercase tracking-wider block">
              Faturamento Mensal Estimado
            </span>
            <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono">
              R$ {monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-blue-200">
              Equivalente a <strong className="text-white font-bold">R$ {weeklyRevenue.toFixed(2)}</strong> por semana de trabalho.
            </p>

            {/* Payback Ancorado */}
            <div className="bg-white/10 rounded-xl p-3 text-xs text-left space-y-1.5 border border-white/10">
              <div className="flex items-center gap-2 text-amber-300 font-bold">
                <TrendingUp className="w-4 h-4" />
                <span>Retorno do Investimento (Payback):</span>
              </div>
              <p className="text-[11px] text-slate-200 leading-relaxed">
                Com apenas <strong className="text-amber-400">{servicesToPayback} {servicesToPayback === 1 ? 'conserto' : 'consertos'}</strong> você paga 100% do curso e todo o resto dos meses seguintes é <strong>lucro líquido para o seu bolso</strong>.
              </p>
            </div>

            <button
              onClick={() => onSelectCourse(mainCourse.id)}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95"
            >
              COMEÇAR MINHA FORMAÇÃO AGORA
            </button>
          </div>
        </div>
      </div>

      {/* 4. GALERIA VISUAL ANTES E DEPOIS (DUAL-CODING & CONTRASTE COGNITIVO) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full">
            <Layers className="w-3.5 h-3.5" />
            <span>Evidência Visual Prática</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            O Padrão Ouro de Regulagem na Oficina
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Veja como uma regulagem técnica correta transforma uma máquina desregulada em uma máquina produtiva
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card Antes */}
          <div className="bg-rose-50/50 border border-rose-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-800 uppercase font-mono tracking-wider flex items-center gap-1.5">
                <X className="w-4 h-4 text-rose-600" />
                Máquina Sem Manutenção Correta:
              </span>
              <span className="text-[10px] bg-rose-200 text-rose-900 font-bold px-2 py-0.5 rounded">
                Prejuízo na Fábrica
              </span>
            </div>
            <div className="aspect-video rounded-xl overflow-hidden bg-slate-900 border border-rose-200 relative">
              <img
                src="https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=800&q=80"
                alt="Máquina Desregulada"
                className="w-full h-full object-cover filter contrast-125 brightness-90 grayscale-[40%]"
                onError={(e) => handleImageError(e, 'machine')}
              />
              <div className="absolute inset-0 bg-rose-950/40 p-3 flex items-end">
                <span className="text-white text-xs font-semibold drop-shadow-md">
                  Ponto embolando, agulhas partindo e cliente insatisfeito
                </span>
              </div>
            </div>
            <ul className="text-xs text-rose-950 space-y-1.5 font-medium">
              <li>• Lançadeira fora do sincronismo de 2,0mm da subida.</li>
              <li>• Rebarbas na ponta cortando a linha a cada 5 metros.</li>
              <li>• Costureira parada e perda de produtividade na confecção.</li>
            </ul>
          </div>

          {/* Card Depois */}
          <div className="bg-emerald-50/60 border-2 border-emerald-500 rounded-2xl p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900 uppercase font-mono tracking-wider flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                Regulada com o Método Eloizio:
              </span>
              <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded">
                Padrão Industrial ISO
              </span>
            </div>
            <div className="aspect-video rounded-xl overflow-hidden bg-slate-900 border border-emerald-300 relative">
              <img
                src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80"
                alt="Máquina Regulada com Perfeição"
                className="w-full h-full object-cover"
                onError={(e) => handleImageError(e, 'machine')}
              />
              <div className="absolute inset-0 bg-emerald-950/30 p-3 flex items-end">
                <span className="text-white text-xs font-semibold drop-shadow-md">
                  Ponto alinhado milimetricamente em até 5.000 RPM
                </span>
              </div>
            </div>
            <ul className="text-xs text-emerald-950 space-y-1.5 font-semibold">
              <li>• Folga exata de 0,08mm ajustada com lâmina calibrada.</li>
              <li>• Ponta polida com lixa 1200 sem desbaste de material.</li>
              <li>• Costura suave, silenciosa e cliente fiel que indica outros serviços.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 5. DEPOIMENTOS REAIS E PROVA SOCIAL */}
      <div className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Quem Fez o Curso, Recomenda e Já Está Faturando
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">Histórias reais de alunos formados no Grupo Eloizio</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map(t => (
            <div
              key={t.id}
              className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between space-y-4 shadow-xs"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <p className="text-xs text-slate-700 leading-relaxed italic">
                  &quot;{t.quote}&quot;
                </p>

                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded block w-fit">
                    Resultado: {t.outcome}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <div className="w-10 h-10 rounded-full bg-blue-900 text-white font-bold flex items-center justify-center text-xs shrink-0">
                  {t.avatarInitials}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{t.studentName}</h4>
                  <p className="text-[11px] text-slate-500">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. PERGUNTAS FREQUENTES (FAQ EXPANSÍVEL) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Perguntas Frequentes (FAQ)
          </h2>
          <p className="text-xs text-slate-500">Tire todas as suas dúvidas antes de se matricular</p>
        </div>

        <div className="divide-y divide-slate-100 max-w-3xl mx-auto">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div key={index} className="py-3.5">
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full text-left flex items-center justify-between text-xs sm:text-sm font-bold text-slate-900 hover:text-blue-900 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed animate-in fade-in duration-150">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 7. BANNER FINAL COM CHECKOUT INSTANTÂNEO */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-lg sm:text-xl font-bold">
            Comece Hoje Mesmo Sua Formação Técnica
          </h3>
          <p className="text-xs text-blue-200">
            Acesso vitalício, material de apoio, simulador virtual de bancada e certificado oficial inclusos.
          </p>
        </div>
        <button
          onClick={() => onSelectCourse(mainCourse.id)}
          className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shrink-0 flex items-center gap-2"
        >
          <span>MATRICULAR POR APENAS R$ {mainCourse.priceBrl.toFixed(2)}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
