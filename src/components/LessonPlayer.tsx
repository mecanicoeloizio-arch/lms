import React, { useState, useEffect } from 'react';
import { Course, Lesson, User, Assessment } from '../types/lms';
import { LMSStorageService } from '../services/storage';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Circle, 
  Lock, 
  Download, 
  FileText, 
  Play, 
  Award, 
  HelpCircle, 
  Clock, 
  Layers,
  Sparkles,
  Eye,
  BookOpen,
  Calendar,
  PenTool,
  Save,
  Zap,
  Target,
  Lightbulb,
  Maximize2,
  Minimize2,
  Copy,
  Check
} from 'lucide-react';

interface LessonPlayerProps {
  courseId: string;
  initialLessonId?: string;
  currentUser: User;
  onBack: () => void;
  onOpenDocuments: () => void;
  onOpenLuiza: () => void;
}

export const LessonPlayer: React.FC<LessonPlayerProps> = ({
  courseId,
  initialLessonId,
  currentUser,
  onBack,
  onOpenDocuments,
  onOpenLuiza
}) => {
  const course = LMSStorageService.getCourseById(courseId);
  if (!course) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-sm text-slate-500">Curso não encontrado.</p>
        <button onClick={onBack} className="text-xs text-blue-900 underline font-semibold">Voltar</button>
      </div>
    );
  }

  // Matrícula do usuário
  let enrollment = LMSStorageService.getEnrollment(currentUser.id, course.id);
  if (!enrollment) {
    enrollment = LMSStorageService.approveOrder(
      LMSStorageService.createOrder(currentUser.id, course.id, 'pix').id
    ).enrollment;
  }

  const allLessons = course.modules.flatMap(m => m.lessons);
  const [selectedLessonId, setSelectedLessonId] = useState<string>(
    initialLessonId || allLessons[0]?.id || ''
  );

  const [activeTab, setActiveTab] = useState<'video' | 'schematic' | 'notes' | 'assessment'>('video');
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<string, string>>({});
  const [assessmentResult, setAssessmentResult] = useState<{ score: number; passed: boolean } | null>(null);

  // Modo Neuro-Foco
  const [isNeuroFocus, setIsNeuroFocus] = useState<boolean>(false);

  // Caderno de Anotações Sinápticas (LocalStorage)
  const currentLesson = allLessons.find(l => l.id === selectedLessonId) || allLessons[0];
  const notesStorageKey = `el_notes_${currentUser.id}_${currentLesson?.id}`;
  const [personalNote, setPersonalNote] = useState<string>('');
  const [noteSaved, setNoteSaved] = useState<boolean>(false);
  const [copiedNotes, setCopiedNotes] = useState<boolean>(false);

  // Checkpoint Neurodidático de Recuperação Ativa (1 Pergunta Rápida)
  const [checkpointAnswer, setCheckpointAnswer] = useState<number | null>(null);
  const [checkpointSubmitted, setCheckpointSubmitted] = useState<boolean>(false);

  useEffect(() => {
    const saved = localStorage.getItem(notesStorageKey);
    setPersonalNote(saved || '');
    setCheckpointAnswer(null);
    setCheckpointSubmitted(false);
    setNoteSaved(false);
  }, [currentLesson?.id, notesStorageKey]);

  const handleSaveNotes = () => {
    localStorage.setItem(notesStorageKey, personalNote);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2500);
  };

  const handleCopyNotes = () => {
    navigator.clipboard.writeText(personalNote);
    setCopiedNotes(true);
    setTimeout(() => setCopiedNotes(false), 2000);
  };

  const lessonProgressList = LMSStorageService.getLessonProgress();
  const assessment = LMSStorageService.getAssessments().find(a => a.courseId === course.id);

  const isCurrentLessonCompleted = lessonProgressList.some(
    p => p.enrollmentId === enrollment?.id && p.lessonId === currentLesson?.id && p.completed
  );

  const handleToggleLessonComplete = () => {
    if (!enrollment || !currentLesson) return;
    const nextState = !isCurrentLessonCompleted;
    LMSStorageService.toggleLessonProgress(enrollment.id, currentLesson.id, nextState);
    setSelectedLessonId(currentLesson.id);
  };

  const handleSubmitAssessment = () => {
    if (!assessment) return;
    try {
      const attempt = LMSStorageService.submitAssessmentAttempt(assessment.id, currentUser.id, assessmentAnswers);
      setAssessmentResult({ score: attempt.score, passed: attempt.passed });
    } catch (e: any) {
      alert(e.message || 'Erro ao enviar avaliação');
    }
  };

  const currentIndex = allLessons.findIndex(l => l.id === currentLesson?.id);
  const nextLesson = allLessons[currentIndex + 1];

  const handleNextLesson = () => {
    if (nextLesson) {
      setSelectedLessonId(nextLesson.id);
      setActiveTab('video');
    }
  };

  // Cálculo da Curva de Ebbinghaus (Repetição Espaçada)
  const today = new Date();
  const review24h = new Date(today);
  review24h.setDate(today.getDate() + 1);
  const review7d = new Date(today);
  review7d.setDate(today.getDate() + 7);

  return (
    <div className={`space-y-4 max-w-7xl mx-auto transition-colors duration-300 ${isNeuroFocus ? 'bg-slate-950 text-slate-100 p-4 rounded-3xl' : ''}`}>
      {/* Top Header do Player */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 border rounded-xl px-4 py-3 transition-colors ${
        isNeuroFocus ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
              isNeuroFocus ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Portal</span>
          </button>
          <span className="text-slate-400">|</span>
          <span className={`text-xs font-bold truncate max-w-[200px] sm:max-w-md ${isNeuroFocus ? 'text-amber-400' : 'text-slate-900'}`}>
            {course.title}
          </span>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Botão Modo Neuro-Foco */}
          <button
            onClick={() => setIsNeuroFocus(!isNeuroFocus)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
              isNeuroFocus
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
            }`}
            title="Ativar/Desativar Modo Neuro-Foco (reduz fadiga cognitiva e elimina distrações)"
          >
            {isNeuroFocus ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5 text-blue-900" />}
            <span>{isNeuroFocus ? 'Sair do Neuro-Foco' : 'Modo Neuro-Foco'}</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono">
            <span className={isNeuroFocus ? 'text-slate-400' : 'text-slate-500'}>Progresso:</span>
            <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">{enrollment.progressPercent}%</span>
          </div>

          {/* Abas Pedagógicas: Vídeo, Diagrama Esquemático, Anotações Sinápticas, Avaliação */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs">
            <button
              onClick={() => setActiveTab('video')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                activeTab === 'video' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Aula & Vídeo
            </button>
            <button
              onClick={() => setActiveTab('schematic')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1 ${
                activeTab === 'schematic' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Target className="w-3 h-3 text-amber-600" />
              <span>Diagrama</span>
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1 ${
                activeTab === 'notes' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PenTool className="w-3 h-3 text-blue-600" />
              <span>Anotações</span>
            </button>
            {assessment && (
              <button
                onClick={() => setActiveTab('assessment')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  activeTab === 'assessment' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Prova Final
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid Principal: Player & Barra Lateral de Módulos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna 1 e 2: Stage de Aprendizado / Player de Vídeo */}
        <div className="lg:col-span-2 space-y-4">
          {activeTab === 'video' && currentLesson ? (
            <div className="space-y-4">
              {/* Player Container com Estilo Cinema */}
              <div className="bg-black rounded-2xl overflow-hidden aspect-video shadow-xl relative flex items-center justify-center border border-slate-800">
                {currentLesson.videoUrl && currentLesson.videoUrl.includes('youtube.com') ? (
                  <iframe
                    src={currentLesson.videoUrl}
                    title={currentLesson.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="text-center p-8 text-white space-y-3">
                    <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center mx-auto text-white shadow-lg">
                      <Play className="w-8 h-8 fill-current ml-1" />
                    </div>
                    <p className="font-bold text-sm sm:text-base">{currentLesson.title}</p>
                    <p className="text-xs text-slate-400">Vídeo prático da bancada em alta definição (1080p)</p>
                  </div>
                )}
              </div>

              {/* Controles de Conclusão da Aula */}
              <div className={`rounded-xl border p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isNeuroFocus ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              }`}>
                <div>
                  <h2 className={`text-base sm:text-lg font-bold ${isNeuroFocus ? 'text-white' : 'text-slate-900'}`}>
                    {currentLesson.title}
                  </h2>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Duração estimada: {currentLesson.durationMinutes} minutos · Metodologia Grupo Eloizio
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleToggleLessonComplete}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all shadow-xs ${
                      isCurrentLessonCompleted
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-400'
                        : 'bg-blue-900 text-white hover:bg-blue-800'
                    }`}
                  >
                    <CheckCircle2 className={`w-4 h-4 ${isCurrentLessonCompleted ? 'text-emerald-700' : 'text-blue-300'}`} />
                    <span>{isCurrentLessonCompleted ? 'Aula Concluída!' : 'Marcar como Concluída'}</span>
                  </button>

                  {nextLesson && (
                    <button
                      onClick={handleNextLesson}
                      className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
                        isNeuroFocus ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                      }`}
                    >
                      Próxima Aula
                    </button>
                  )}
                </div>
              </div>

              {/* CHECKPOINT NEURODIDÁTICO (REFORÇO DOPAMINÉRGICO & ACTIVE RECALL) */}
              <div className={`rounded-xl border p-5 space-y-4 ${
                isNeuroFocus ? 'bg-slate-900 border-blue-900/50' : 'bg-gradient-to-br from-blue-50/60 to-indigo-50/40 border-blue-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                    <Zap className="w-4 h-4 text-amber-500 fill-amber-400" />
                    <span className={isNeuroFocus ? 'text-amber-400' : 'text-blue-950'}>
                      Checkpoint de Fixação Sináptica (Recuperação Ativa)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">
                    Fixação Imediata pós-aula
                  </span>
                </div>

                <p className={`text-xs font-semibold leading-relaxed ${isNeuroFocus ? 'text-slate-200' : 'text-slate-800'}`}>
                  Para evitar o desfiamento da linha na lançadeira rotativa, qual a folga exata entre a ponta da lançadeira e a cava da agulha?
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: 0, text: 'A) 0,05mm a 0,10mm (não tocar na agulha)', correct: true },
                    { id: 1, text: 'B) 1,5mm a 2,0mm de distância livre', correct: false },
                    { id: 2, text: 'C) Deve encostar pressionando a agulha', correct: false }
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        setCheckpointAnswer(option.id);
                        setCheckpointSubmitted(true);
                      }}
                      className={`text-left p-3 rounded-lg border text-xs transition-all ${
                        checkpointAnswer === option.id
                          ? option.correct
                            ? 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold ring-1 ring-emerald-500'
                            : 'bg-rose-100 border-rose-400 text-rose-950 font-bold'
                          : isNeuroFocus
                          ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {option.text}
                    </button>
                  ))}
                </div>

                {checkpointSubmitted && (
                  <div className={`p-3 rounded-lg text-xs leading-relaxed flex items-start gap-2 ${
                    checkpointAnswer === 0
                      ? 'bg-emerald-50 border border-emerald-300 text-emerald-900'
                      : 'bg-amber-50 border border-amber-300 text-amber-900'
                  }`}>
                    <Lightbulb className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                    <div>
                      <p className="font-bold">
                        {checkpointAnswer === 0 ? 'Resposta Exata! +25 Pontos de Retenção Sináptica.' : 'Atenção ao conceito físico:'}
                      </p>
                      <p className="text-[11px] mt-0.5">
                        A folga de 0,05mm a 0,10mm garante que o bico laça o fio sem bater na agulha, prevenindo o desgaste prematuro e quebra da ponta.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Descrição e Materiais Complementares */}
              <div className={`rounded-xl border p-5 space-y-4 ${
                isNeuroFocus ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              }`}>
                <h3 className={`font-bold text-sm ${isNeuroFocus ? 'text-white' : 'text-slate-900'}`}>
                  Resumo da Aula & Instruções Técnicas
                </h3>
                <p className={`text-xs sm:text-sm leading-relaxed ${isNeuroFocus ? 'text-slate-300' : 'text-slate-600'}`}>
                  {currentLesson.description || 'Nesta aula prática você aprende os procedimentos rigorosos de bancada, tolerâncias micrométricas e sequência de desmonte sem forçar peças críticas.'}
                </p>

                {currentLesson.materials && currentLesson.materials.length > 0 && (
                  <div className="pt-3 border-t border-slate-200/50 space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Materiais de Apoio para Download
                    </h4>
                    <div className="space-y-2">
                      {currentLesson.materials.map(mat => (
                        <div
                          key={mat.id}
                          className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                            isNeuroFocus
                              ? 'bg-slate-800 border-slate-700 text-slate-200'
                              : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <FileText className="w-4 h-4 text-rose-600" />
                            <div>
                              <p className="text-xs font-bold">{mat.title}</p>
                              <p className="text-[10px] text-slate-400 font-mono">
                                Arquivo PDF · {(mat.fileSizeBytes / 1024 / 1024).toFixed(1)} MB
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => alert(`Iniciando download do material: ${mat.title}`)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
                          >
                            <Download className="w-3.5 h-3.5 text-slate-500" />
                            <span>Baixar</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : activeTab === 'schematic' ? (
            /* ABA 2: TEORIA DA DUPLA CODIFICAÇÃO (DIAGRAMA MECÂNICO ESQUEMÁTICO) */
            <div className={`rounded-xl border p-6 space-y-6 ${
              isNeuroFocus ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="border-b border-slate-200 pb-3">
                <span className="text-xs font-mono uppercase text-blue-700 font-bold tracking-wider">
                  Teoria da Dupla Codificação Visual (Paivio)
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  Esquema Micrométrico: Sincronismo Lançadeira e Agulha
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  A retenção da memória mecânica aumenta em até 300% quando texto e representação espacial são associados.
                </p>
              </div>

              {/* Esquema Técnico Ilustrado em SVG Puro */}
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-white flex flex-col items-center justify-center space-y-4">
                <div className="w-full max-w-md aspect-square bg-slate-900 rounded-xl p-4 border border-slate-800 relative flex items-center justify-center">
                  <svg viewBox="0 0 400 400" className="w-full h-full">
                    {/* Barra de agulha e agulha */}
                    <rect x="190" y="20" width="20" height="180" fill="#64748b" rx="2" />
                    <line x1="200" y1="200" x2="200" y2="310" stroke="#94a3b8" strokeWidth="4" />
                    {/* Cava da agulha (rebaixo) */}
                    <path d="M 198 250 L 195 265 L 198 280" stroke="#f59e0b" strokeWidth="3" fill="none" />
                    {/* Olho da agulha */}
                    <circle cx="200" cy="295" r="3" fill="#38bdf8" />
                    <line x1="200" y1="298" x2="200" y2="310" stroke="#94a3b8" strokeWidth="2" />

                    {/* Bico da Lançadeira */}
                    <path d="M 280 250 L 202 268 L 270 290 Z" fill="#3b82f6" opacity="0.9" />
                    <circle cx="202" cy="268" r="3" fill="#ef4444" />

                    {/* Linhas de Cotas Micrométricas */}
                    {/* Folga lateral */}
                    <line x1="200" y1="240" x2="202" y2="240" stroke="#ef4444" strokeWidth="2" strokeDasharray="2" />
                    <text x="210" y="243" fill="#ef4444" fontSize="11" fontFamily="monospace">Folga: 0,05 - 0,10mm</text>

                    {/* Subida do PMI */}
                    <line x1="160" y1="310" x2="160" y2="268" stroke="#10b981" strokeWidth="2" />
                    <line x1="155" y1="310" x2="165" y2="310" stroke="#10b981" strokeWidth="2" />
                    <line x1="155" y1="268" x2="165" y2="268" stroke="#10b981" strokeWidth="2" />
                    <text x="75" y="293" fill="#10b981" fontSize="11" fontFamily="monospace">Subida: 2,0mm</text>

                    {/* Etiquetas descritivas */}
                    <text x="20" y="40" fill="#94a3b8" fontSize="12" fontWeight="bold">Barra de Agulha</text>
                    <text x="270" y="320" fill="#60a5fa" fontSize="12" fontWeight="bold">Ponta da Lançadeira</text>
                    <text x="140" y="380" fill="#facc15" fontSize="11" fontFamily="monospace">Bico passa no terço inferior da cava</text>
                  </svg>
                </div>

                <div className="text-xs text-slate-300 text-center max-w-lg space-y-1">
                  <p className="font-bold text-amber-400">Regra de Ouro do Grupo Eloizio:</p>
                  <p className="text-[11px] leading-relaxed">
                    A agulha desce ao Ponto Morto Inferior (PMI). Ao subir exatamente 2,0mm, a laçada de linha se abre perfeitamente. O bico da lançadeira passa a 0,08mm da cava, capturando a linha sem encostar no metal da agulha.
                  </p>
                </div>
              </div>
            </div>
          ) : activeTab === 'notes' ? (
            /* ABA 3: CADERNO DE ANOTAÇÕES SINÁPTICAS */
            <div className={`rounded-xl border p-6 space-y-5 ${
              isNeuroFocus ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <PenTool className="w-4 h-4 text-blue-900" />
                    <span>Caderno Sináptico de Anotações</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Anotar com as próprias palavras força o cérebro a codificar e reter as etapas técnicas.
                  </p>
                </div>
                <button
                  onClick={handleCopyNotes}
                  disabled={!personalNote}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  {copiedNotes ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedNotes ? 'Copiado!' : 'Copiar Anotações'}</span>
                </button>
              </div>

              <div className="space-y-3">
                <textarea
                  rows={8}
                  value={personalNote}
                  onChange={(e) => setPersonalNote(e.target.value)}
                  placeholder="Escreva aqui suas observações sobre a aula (ex: Medida da folga da lançadeira, sentido do aperto do parafuso, macete de lubrificação)..."
                  className={`w-full p-4 rounded-xl border text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all ${
                    isNeuroFocus
                      ? 'bg-slate-950 border-slate-800 text-slate-100 placeholder:text-slate-600'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'
                  }`}
                />

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400 font-mono">
                    {personalNote.length} caracteres · Salvo localmente para este módulo
                  </span>
                  <button
                    onClick={handleSaveNotes}
                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-900 text-white rounded-lg text-xs font-bold hover:bg-blue-800 transition-colors shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{noteSaved ? 'Anotação Salva com Sucesso!' : 'Salvar no Caderno'}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : activeTab === 'assessment' && assessment ? (
            /* ABA 4: AVALIAÇÃO / PROVA TEÓRICA */
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs font-mono uppercase text-blue-900 font-semibold tracking-wider">
                  Avaliação Oficial
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-0.5">{assessment.title}</h2>
                <p className="text-xs text-slate-500 mt-1">{assessment.description}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-slate-600 font-mono">
                  <span>Nota Mínima para Certificado: <strong>{assessment.passingGrade.toFixed(1)} / 10.0</strong></span>
                </div>
              </div>

              {assessmentResult && (
                <div className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${
                  assessmentResult.passed ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-rose-50 border-rose-300 text-rose-900'
                }`}>
                  <div className="flex items-center gap-3">
                    {assessmentResult.passed ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                    ) : (
                      <HelpCircle className="w-6 h-6 text-rose-600 shrink-0" />
                    )}
                    <div>
                      <p className="text-sm font-bold">
                        {assessmentResult.passed ? 'Parabéns! Você foi Aprovado!' : 'Nota insuficiente para aprovação.'}
                      </p>
                      <p className="text-xs font-mono">
                        Sua Nota: <strong>{assessmentResult.score.toFixed(1)}</strong> / 10.0 (Mínimo exigido: {assessment.passingGrade.toFixed(1)})
                      </p>
                    </div>
                  </div>
                  {assessmentResult.passed && (
                    <button
                      onClick={onOpenDocuments}
                      className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800 transition-colors shadow-sm shrink-0 flex items-center gap-1.5"
                    >
                      <Award className="w-4 h-4" />
                      <span>Ver Certificado Emitido</span>
                    </button>
                  )}
                </div>
              )}

              {/* Questões da Avaliação */}
              <div className="space-y-6">
                {assessment.questions.map((q, idx) => (
                  <div key={q.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-mono text-xs font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                        Questão {idx + 1}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">{q.scorePoints.toFixed(1)} pts</span>
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                      {q.questionText}
                    </p>
                    <div className="space-y-2 pt-1">
                      {q.options.map(opt => (
                        <label
                          key={opt.id}
                          className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                            assessmentAnswers[q.id] === opt.id
                              ? 'bg-blue-50 border-blue-900 text-blue-900 font-medium'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${q.id}`}
                            checked={assessmentAnswers[q.id] === opt.id}
                            onChange={() => setAssessmentAnswers(prev => ({ ...prev, [q.id]: opt.id }))}
                            className="mt-0.5"
                          />
                          <span>{opt.optionText}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Botão Enviar Prova */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">
                  {Object.keys(assessmentAnswers).length} de {assessment.questions.length} respondidas
                </span>
                <button
                  onClick={handleSubmitAssessment}
                  disabled={Object.keys(assessmentAnswers).length < assessment.questions.length}
                  className="px-5 py-2.5 bg-blue-900 text-white rounded-xl text-xs font-semibold hover:bg-blue-800 disabled:opacity-40 transition-colors shadow-sm"
                >
                  Finalizar e Enviar Prova
                </button>
              </div>
            </div>
          ) : null}
        </div>

        {/* Coluna 3: Grade de Módulos e Aulas (Menu Lateral do Player) */}
        <div className="space-y-4">
          {/* Card de Curva de Ebbinghaus (Repetição Espaçada) */}
          <div className={`p-4 rounded-xl border text-xs space-y-2 ${
            isNeuroFocus ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-amber-50/70 border-amber-200 text-amber-950'
          }`}>
            <div className="flex items-center gap-1.5 font-bold">
              <Calendar className="w-4 h-4 text-amber-700" />
              <span>Cronograma de Repetição Espaçada</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Para transferir o conhecimento prático para a memória de longo prazo:
            </p>
            <div className="space-y-1 text-[11px] font-mono">
              <div className="flex justify-between bg-white/60 p-1.5 rounded">
                <span>1ª Revisão (24h):</span>
                <span className="font-bold">{review24h.toLocaleDateString('pt-BR')}</span>
              </div>
              <div className="flex justify-between bg-white/60 p-1.5 rounded">
                <span>2ª Revisão (7 dias):</span>
                <span className="font-bold">{review7d.toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
          </div>

          <div className={`rounded-xl border p-4 space-y-3 ${
            isNeuroFocus ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <h3 className={`font-bold text-sm flex items-center gap-1.5 ${isNeuroFocus ? 'text-white' : 'text-slate-900'}`}>
                <Layers className="w-4 h-4 text-blue-900" />
                <span>Conteúdo do Curso</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                {allLessons.length} aulas
              </span>
            </div>

            {/* Lista Acordeão de Módulos */}
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {course.modules.map(mod => {
                const isLocked = mod.unlockDaysAfterEnrollment > 0 && enrollment.progressPercent < 20;
                return (
                  <div key={mod.id} className="border border-slate-200 rounded-lg overflow-hidden">
                    <div className="bg-slate-100 px-3 py-2 text-xs font-bold text-slate-800 flex items-center justify-between">
                      <span className="truncate pr-2">{mod.title}</span>
                      {isLocked && <Lock className="w-3.5 h-3.5 text-amber-700 shrink-0" />}
                    </div>
                    <div className="divide-y divide-slate-100 bg-white">
                      {mod.lessons.map(lesson => {
                        const isCompleted = lessonProgressList.some(
                          p => p.enrollmentId === enrollment?.id && p.lessonId === lesson.id && p.completed
                        );
                        const isCurrent = lesson.id === currentLesson?.id && activeTab === 'video';
                        return (
                          <button
                            key={lesson.id}
                            onClick={() => {
                              setSelectedLessonId(lesson.id);
                              setActiveTab('video');
                            }}
                            className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                              isCurrent
                                ? 'bg-blue-50 text-blue-900 font-semibold'
                                : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate pr-2">
                              {isCompleted ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              ) : (
                                <Circle className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                              )}
                              <span className="truncate">{lesson.title}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono shrink-0">
                              {lesson.durationMinutes}m
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card de Dúvidas com Luiza Souza */}
          <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-blue-900 font-bold text-xs">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Dúvida Técnica nesta aula?</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Converse com a Gestora IA Luiza Souza (FUNC-001) para gerar pílulas de resumo ou fale com o Eloizio.
            </p>
            <button
              onClick={onOpenLuiza}
              className="w-full text-center px-3 py-2 bg-blue-900 text-white rounded-lg text-xs font-semibold hover:bg-blue-800 transition-colors shadow-xs"
            >
              Pedir Pílula de Aprendizagem à Luiza
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
