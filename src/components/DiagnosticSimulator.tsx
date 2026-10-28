import React, { useState } from 'react';
import { 
  Wrench, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  HelpCircle, 
  RotateCcw, 
  Play, 
  Lightbulb, 
  Cpu, 
  ArrowRight,
  ShieldCheck,
  Compass,
  Zap,
  Target
} from 'lucide-react';
import { handleImageError } from '../utils/imageFallbacks';

interface DiagnosticCase {
  id: string;
  title: string;
  machineType: string;
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
  symptom: string;
  customerComplaint: string;
  imageUrl: string;
  componentArea: string;
  schematicDetail: string;
  options: {
    id: string;
    text: string;
    toolUsed: string;
    isCorrect: boolean;
    explanation: string;
    neuroPrinciple: string;
  }[];
}

const DIAGNOSTIC_CASES: DiagnosticCase[] = [
  {
    id: 'case-1',
    title: 'Linha Superior Partindo em Alta Rotação',
    machineType: 'Reta Industrial Direct Drive (Jack / Yamata / Sun Special)',
    difficulty: 'Iniciante',
    symptom: 'A linha da agulha desfia e quebra sempre que a costureira acelera acima de 3.500 RPM.',
    customerComplaint: '"Eloizio, já troquei a marca da linha três vezes, já frouxei o tensor e a máquina continua partindo a linha no tecido tricoline!"',
    imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
    componentArea: 'Conjunto Lançadeira Rotativa & Chapa de Agulha',
    schematicDetail: 'Folga micrométrica agulha-lançadeira: Tolerância padrão de 0,05mm a 0,10mm. Subida da barra de 2,0mm.',
    options: [
      {
        id: 'opt-1a',
        text: 'Apertar totalmente o parafuso do tensor da linha superior para forçar a passagem.',
        toolUsed: 'Chave de Fenda Plana 1/4"',
        isCorrect: false,
        explanation: 'Aumentar a tensão só piora a quebra, gerando aquecimento por atrito na canaleta e arrebentando a linha com facilidade.',
        neuroPrinciple: 'Viés de Ação: Tentar consertar apertando mais gera falsa sensação de controle, mas agrava o atrito mecânico.'
      },
      {
        id: 'opt-1b',
        text: 'Verificar a ponta da lançadeira com lupa/unha: lixar micro-rebarba com lixa 1200 e ajustar folga para 0,08mm.',
        toolUsed: 'Lixa d\'água 1200 + Calibrador de Folga + Chave 1/8"',
        isCorrect: true,
        explanation: 'Exato! Em alta rotação, qualquer minúscula rebarba causada por choque com agulha anterior corta o filamento da linha como navalha.',
        neuroPrinciple: 'Dupla Codificação: Compreender o atrito cinético na ponta da lançadeira fixa o diagnóstico sináptico definitivo.'
      },
      {
        id: 'opt-1c',
        text: 'Trocar o motor Direct Drive por acreditar que a frequência do inversor está descalibrada.',
        toolUsed: 'Chave Philips e Multímetro',
        isCorrect: false,
        explanation: 'O motor está apenas girando o eixo. A quebra de linha por atrito é problema 100% mecânico no curso da laçada.',
        neuroPrinciple: 'Navalha de Ockham: A explicação mais simples e física na ponta da agulha quase sempre é a verdadeira.'
      }
    ]
  },
  {
    id: 'case-2',
    title: 'Ponto Falso (Pulando Ponto) no Ziguezague Doméstico',
    machineType: 'Doméstica Singer / Brother / Elgin',
    difficulty: 'Intermediário',
    symptom: 'A máquina costura bem na costura reta, mas quando aciona o ziguezague para o lado direito, falha 3 a cada 5 pontos.',
    customerComplaint: '"Minha máquina pula ponto direto quando vou fazer caseado ou acabamento na beirada da malha!"',
    imageUrl: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=800&q=80',
    componentArea: 'Sincronismo Transversal da Lançadeira Oscilante',
    schematicDetail: 'No ponto morto inferior do ziguezague à direita, o bico da lançadeira precisa estar a 1mm acima do olho da agulha.',
    options: [
      {
        id: 'opt-2a',
        text: 'Ajustar o sincronismo do anel oscilante no lado direito: regular altura da barra e avanço do bico da lançadeira.',
        toolUsed: 'Calibrador de Barra de Agulha + Chave Allen 2mm',
        isCorrect: true,
        explanation: 'Perfeito! No ziguezague à direita, a laçada se forma mais baixa. Se o bico passar atrasado, perde a laçada e gera ponto falso.',
        neuroPrinciple: 'Raciocínio Espacial Tridimensional: A laçada depende da rotação do tempo mecânico sincronizado.'
      },
      {
        id: 'opt-2b',
        text: 'Colocar óleo mineral pesado direto sobre a correia dentada do motor.',
        toolUsed: 'Almotolia de Lubrificação',
        isCorrect: false,
        explanation: 'Nunca passe óleo em correias! O óleo degrada a borracha de cloropreno e fará a correia patinar e quebrar.',
        neuroPrinciple: 'Fixação de Segurança: Procedimentos destrutivos devem ser bloqueados pela memória de trabalho.'
      },
      {
        id: 'opt-2c',
        text: 'Recomendar à cliente costurar apenas em tecido grosso de algodão cru.',
        toolUsed: 'Nenhuma',
        isCorrect: false,
        explanation: 'A máquina deve estar calibrada para qualquer tecido especificado pelo manual do fabricante.',
        neuroPrinciple: 'Postura Profissional: O mecânico padrão ouro resolve a causa-raiz em vez de limitar o cliente.'
      }
    ]
  },
  {
    id: 'case-3',
    title: 'Ponto Frouxo e Tecido Mastigado na Faca da Overlock',
    machineType: 'Overlock Industrial 3 Fios (Siruba / Jack E4)',
    difficulty: 'Avançado',
    symptom: 'A orla do tecido fica com fiapos irregulares e o looper superior não fecha a laçada perfeitamente na borda.',
    customerComplaint: '"A faca está amassando o brim em vez de cortar limpo, e a costura fica embolando na ponta da correntinha."',
    imageUrl: 'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?auto=format&fit=crop&w=800&q=80',
    componentArea: 'Par de Facas (Superior Móvel / Inferior Fixa de Vídea) e Loopers',
    schematicDetail: 'Cruzamento das lâminas de 1,0mm a 1,5mm no ponto mais baixo; mola de pressão com encosto de 90°.',
    options: [
      {
        id: 'opt-3a',
        text: 'Regular a altura da faca inferior faceando com a chapa de ponto e ajustar a mola de pressão lateral da faca superior.',
        toolUsed: 'Chave de Fenda Estreita + Gabarito de Altura',
        isCorrect: true,
        explanation: 'Excelente! A faca superior precisa ter pressão elástica contra a faca fixa para fazer o efeito guilhotina perfeito.',
        neuroPrinciple: 'Análise de Vetores de Força: O corte perfeito depende de cisalhamento sem folga axial.'
      },
      {
        id: 'opt-3b',
        text: 'Desativar a faca e puxar o tecido manualmente com a mão esquerda durante a costura.',
        toolUsed: 'Alicate Universal',
        isCorrect: false,
        explanation: 'Puxar tecido desvia a agulha contra os loopers, quebrando agulha e desregulando a máquina.',
        neuroPrinciple: 'Prevenção de Acidentes: A ergonomia operacional protege o maquinário e o operador.'
      }
    ]
  }
];

export const DiagnosticSimulator: React.FC<{ onOpenCourse?: (courseId: string) => void }> = ({ onOpenCourse }) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(DIAGNOSTIC_CASES[0].id);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [userScore, setUserScore] = useState<number>(0);
  const [completedCases, setCompletedCases] = useState<Record<string, boolean>>({});

  const currentCase = DIAGNOSTIC_CASES.find(c => c.id === selectedCaseId) || DIAGNOSTIC_CASES[0];
  const selectedOption = currentCase.options.find(o => o.id === selectedOptionId);

  const handleSelectOption = (optId: string) => {
    if (hasSubmitted) return;
    setSelectedOptionId(optId);
  };

  const handleVerifyDiagnosis = () => {
    if (!selectedOption) return;
    setHasSubmitted(true);
    if (selectedOption.isCorrect && !completedCases[currentCase.id]) {
      setUserScore(prev => prev + 100);
      setCompletedCases(prev => ({ ...prev, [currentCase.id]: true }));
    }
  };

  const handleNextCase = () => {
    const currentIndex = DIAGNOSTIC_CASES.findIndex(c => c.id === currentCase.id);
    const nextCase = DIAGNOSTIC_CASES[(currentIndex + 1) % DIAGNOSTIC_CASES.length];
    setSelectedCaseId(nextCase.id);
    setSelectedOptionId(null);
    setHasSubmitted(false);
  };

  const handleResetSimulator = () => {
    setSelectedOptionId(null);
    setHasSubmitted(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2">
      {/* Header do Simulador */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-blue-800/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-mono font-semibold">
            <Cpu className="w-3.5 h-3.5" />
            <span>Simulador Neurodidático de Bancada Têxtil</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight">
            Laboratório Virtual de Diagnóstico Mecânico
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Treine seu raciocínio de mecânico profissional do Grupo Eloizio antes de tocar na máquina física. Baseado em neurociência cognitiva e repetição de causa-efeito.
          </p>
        </div>

        {/* Placar de Pontos e Dopamina */}
        <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-xl p-4 text-center shrink-0 min-w-[180px]">
          <span className="text-slate-300 text-[11px] block uppercase font-mono tracking-wider font-semibold">
            Pontuação de Bancada
          </span>
          <div className="text-3xl font-black text-amber-400 mt-1 flex items-center justify-center gap-1">
            <Zap className="w-6 h-6 fill-amber-400" />
            <span>{userScore} pts</span>
          </div>
          <span className="text-[10px] text-emerald-300 block mt-1 font-mono">
            {Object.keys(completedCases).length} de {DIAGNOSTIC_CASES.length} Casos Resolvidos
          </span>
        </div>
      </div>

      {/* Seletor de Casos */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {DIAGNOSTIC_CASES.map((c, idx) => {
          const isResolved = completedCases[c.id];
          const isCurrent = c.id === currentCase.id;
          return (
            <button
              key={c.id}
              onClick={() => {
                setSelectedCaseId(c.id);
                setSelectedOptionId(null);
                setHasSubmitted(false);
              }}
              className={`text-left p-4 rounded-xl border transition-all relative ${
                isCurrent
                  ? 'bg-blue-900/10 border-blue-900 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-mono text-slate-500 font-bold">Caso 0{idx + 1}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  c.difficulty === 'Iniciante' ? 'bg-emerald-100 text-emerald-800' :
                  c.difficulty === 'Intermediário' ? 'bg-amber-100 text-amber-800' :
                  'bg-rose-100 text-rose-800'
                }`}>
                  {c.difficulty}
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{c.title}</h4>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">{c.machineType}</p>
              {isResolved && (
                <div className="absolute top-2 right-2 text-emerald-600" title="Resolvido com sucesso!">
                  <CheckCircle2 className="w-4 h-4 fill-emerald-100" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Área Principal de Diagnóstico do Caso */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Painel Esquerdo: Sintoma, Imagem e Esquema */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-blue-700 font-bold uppercase tracking-wider">
                {currentCase.machineType}
              </span>
              <h3 className="text-base font-bold text-slate-900">{currentCase.title}</h3>
            </div>

            {/* Imagem do Mecanismo com Overlay */}
            <div className="relative rounded-xl overflow-hidden aspect-video border border-slate-200 bg-slate-100">
              <img 
                src={currentCase.imageUrl} 
                alt={currentCase.title}
                className="w-full h-full object-cover" 
                onError={(e) => handleImageError(e, 'machine')}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3">
                <div className="text-white text-xs">
                  <p className="font-bold flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-amber-400" />
                    <span>Foco de Análise: {currentCase.componentArea}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Queixa Real da Costureira / Cliente */}
            <div className="bg-amber-50/70 border-l-4 border-amber-400 p-3 rounded-r-lg space-y-1">
              <span className="text-[10px] font-bold text-amber-900 uppercase font-mono tracking-wider">
                Relato da Costureira na Oficina:
              </span>
              <p className="text-xs text-amber-950 italic leading-relaxed">
                {currentCase.customerComplaint}
              </p>
            </div>

            {/* Esquema Técnico da Tolerância */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <Compass className="w-4 h-4 text-blue-700" />
                <span>Especificação Técnica Grupo Eloizio:</span>
              </div>
              <p className="text-[11px] text-slate-600 font-mono leading-relaxed">
                {currentCase.schematicDetail}
              </p>
            </div>
          </div>
        </div>

        {/* Painel Direito: Tomada de Decisão e Feedback */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-xs">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-blue-900" />
                <span>Qual intervenção mecânica você executa agora?</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Selecione a ação correta com base na física e mecânica de precisão:
              </p>
            </div>

            {/* Opções de Resolução */}
            <div className="space-y-3">
              {currentCase.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                let cardStyle = 'border-slate-200 hover:border-slate-300 bg-white';

                if (isSelected && !hasSubmitted) {
                  cardStyle = 'border-blue-900 bg-blue-50/50 shadow-xs ring-1 ring-blue-900';
                } else if (hasSubmitted) {
                  if (opt.isCorrect) {
                    cardStyle = 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20';
                  } else if (isSelected && !opt.isCorrect) {
                    cardStyle = 'border-rose-400 bg-rose-50/60 ring-2 ring-rose-400/20';
                  } else {
                    cardStyle = 'border-slate-200 opacity-50 bg-slate-50';
                  }
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    disabled={hasSubmitted}
                    className={`w-full text-left p-4 rounded-xl border transition-all text-xs space-y-2 block ${cardStyle}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="font-semibold text-slate-900 leading-snug">
                        {opt.text}
                      </span>
                      {hasSubmitted && opt.isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      )}
                      {hasSubmitted && isSelected && !opt.isCorrect && (
                        <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
                        Ferramenta: {opt.toolUsed}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Botão de Validação de Diagnóstico */}
            {!hasSubmitted ? (
              <div className="pt-2">
                <button
                  onClick={handleVerifyDiagnosis}
                  disabled={!selectedOptionId}
                  className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    selectedOptionId
                      ? 'bg-blue-900 hover:bg-blue-800 text-white shadow-md active:scale-98'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>EXECUTAR REGULAGEM NA BANCADA</span>
                </button>
              </div>
            ) : (
              /* Feedback Neurocognitivo Imediato */
              <div className="space-y-4 pt-2 animate-in fade-in duration-200">
                {selectedOption?.isCorrect ? (
                  <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span>Diagnóstico Exato! +100 Pontos de Competência</span>
                    </div>
                    <p className="text-xs text-emerald-950 leading-relaxed">
                      {selectedOption.explanation}
                    </p>
                    <div className="pt-2 border-t border-emerald-200 text-[11px] text-emerald-800 flex items-start gap-1.5 font-mono">
                      <Lightbulb className="w-4 h-4 shrink-0 text-amber-600" />
                      <span><strong>Neurociência da Aprendizagem:</strong> {selectedOption.neuroPrinciple}</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-rose-50 border border-rose-300 rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                      <span>Atenção: A máquina continuaria quebrando a linha!</span>
                    </div>
                    <p className="text-xs text-rose-950 leading-relaxed">
                      {selectedOption?.explanation}
                    </p>
                    <div className="pt-2 border-t border-rose-200 text-[11px] text-rose-800 flex items-start gap-1.5 font-mono">
                      <HelpCircle className="w-4 h-4 shrink-0 text-rose-600" />
                      <span><strong>Princípio Neurocognitivo:</strong> {selectedOption?.neuroPrinciple}</span>
                    </div>
                  </div>
                )}

                {/* Ações pós-teste */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={handleResetSimulator}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Tentar Novamente</span>
                  </button>

                  <button
                    onClick={handleNextCase}
                    className="w-full sm:flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>PRÓXIMO CASO CLÍNICO DA OFICINA</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Chamada para o Curso Completo com Ancoragem */}
          {onOpenCourse && (
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-xl p-4 flex items-center justify-between gap-4 shadow-sm">
              <div className="space-y-0.5 text-xs">
                <p className="font-bold">Gostou deste diagnóstico interativo?</p>
                <p className="text-emerald-100 text-[11px]">
                  No curso completo do Grupo Eloizio você aprende +45 regulagens com tolerâncias micrométricas e vídeo aulas reais.
                </p>
              </div>
              <button
                onClick={() => onOpenCourse('course-mec-01')}
                className="bg-white text-emerald-950 hover:bg-emerald-50 px-4 py-2 rounded-lg font-bold text-xs shrink-0 shadow-xs"
              >
                Acessar Curso
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
