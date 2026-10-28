import React, { useState } from 'react';
import { StudyPlanDay, User } from '../types/lms';
import { LMSStorageService } from '../services/storage';
import { 
  Compass, 
  CheckCircle2, 
  Circle, 
  Calendar, 
  Clock, 
  Sparkles, 
  MessageCircle, 
  Target, 
  Lightbulb,
  Award
} from 'lucide-react';

interface SoeOrientationProps {
  currentUser: User;
  onOpenLuiza: () => void;
}

export const SoeOrientation: React.FC<SoeOrientationProps> = ({
  currentUser,
  onOpenLuiza
}) => {
  const [studyDays, setStudyDays] = useState<StudyPlanDay[]>(LMSStorageService.getStudyPlanDays());
  const [dailyMinutes, setDailyMinutes] = useState<number>(30);
  const [scheduledSuccess, setScheduledSuccess] = useState<boolean>(false);

  const completedDaysCount = studyDays.filter(d => d.completed).length;
  const progressPercent = Math.round((completedDaysCount / studyDays.length) * 100);

  const handleToggleDay = (dayNumber: number) => {
    const updated = LMSStorageService.toggleStudyPlanDay(dayNumber);
    setStudyDays([...updated]);
  };

  // Cálculo de Previsão de Formatura baseado no ritmo diário do aluno
  // Curso de Mecânica tem 120 horas = 7.200 minutos
  const totalCourseMinutes = 120 * 60;
  const daysNeeded = Math.ceil(totalCourseMinutes / (dailyMinutes || 30));
  const estimatedGraduationDate = new Date();
  estimatedGraduationDate.setDate(estimatedGraduationDate.getDate() + daysNeeded);

  const handleScheduleMentorship = (e: React.FormEvent) => {
    e.preventDefault();
    setScheduledSuccess(true);
    setTimeout(() => setScheduledSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header do SOE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Compass className="w-6 h-6 text-blue-900" />
            <span>SOE · Serviço de Orientação Educacional & Pedagógica</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Acompanhamento individualizado, cronograma adaptativo e mentoria de aprendizagem com a Profª Renata Alencar
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenLuiza}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-900 rounded-lg text-xs font-semibold hover:bg-blue-100 transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>Falar com Luiza Souza (Orientadora IA)</span>
          </button>
        </div>
      </div>

      {/* Grid Principal: Plano Adaptativo & Calculadora de Formatura */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna 1 e 2: Roteiro Prático de Estudos em 7 Dias */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Roteiro de Aceleração Prática · Primeiros 7 Dias
                </h3>
                <p className="text-xs text-slate-500">
                  Conclua 1 etapa por dia para dominar o alinhamento de bancada sem sobrecarga
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-slate-400">Progresso do Roteiro:</span>
                <span className="font-bold text-blue-900 tabular-nums">{progressPercent}%</span>
              </div>
            </div>

            {/* Barra de Progresso */}
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-900 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Lista Interativa de Dias do Roteiro */}
            <div className="space-y-3 pt-2">
              {studyDays.map(day => (
                <div
                  key={day.dayNumber}
                  onClick={() => handleToggleDay(day.dayNumber)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                    day.completed
                      ? 'bg-slate-50 border-slate-200 text-slate-500'
                      : 'bg-white border-slate-200 hover:border-blue-900/40 shadow-xs'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {day.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300" />
                    )}
                  </div>

                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-xs sm:text-sm font-bold ${day.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                        {day.title}
                      </h4>
                      <span className="text-[11px] font-mono text-slate-400 shrink-0">
                        {day.durationMinutes} min
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      <strong>Dica Pedagógica do SOE:</strong> {day.tips}
                    </p>

                    <div className="flex items-center gap-2 text-[10px] text-blue-800 font-medium pt-0.5">
                      <span>Aula Vinculada:</span>
                      <span className="underline">{day.lessonReference}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Coluna 3: Calculadora de Ritmo & Mentoria */}
        <div className="space-y-4">
          {/* Calculadora de Formatura */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-xs">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-900" />
              <span>Simulador de Ritmo de Estudos</span>
            </h3>

            <p className="text-xs text-slate-500 leading-relaxed">
              Defina quantos minutos você pode dedicar por dia e nosso algoritmo pedagógico estima sua data de conclusão.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Seu tempo diário disponível:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[20, 30, 45, 60, 90, 120].map(min => (
                    <button
                      key={min}
                      type="button"
                      onClick={() => setDailyMinutes(min)}
                      className={`py-2 rounded-lg text-xs font-mono font-semibold transition-colors ${
                        dailyMinutes === min
                          ? 'bg-blue-900 text-white'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {min} min/dia
                    </button>
                  ))}
                </div>
              </div>

              {/* Resultado da Simulação */}
              <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3.5 space-y-2">
                <span className="text-[10px] font-mono uppercase text-blue-900 font-bold block">
                  Previsão Oficial de Formatura
                </span>
                <p className="text-lg font-extrabold text-blue-950 font-mono">
                  {estimatedGraduationDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                </p>
                <p className="text-[11px] text-slate-600">
                  Total de <strong>{daysNeeded} dias de estudo</strong> para completar as 120 horas e emitir seu Certificado oficial.
                </p>
              </div>
            </div>
          </div>

          {/* Dicas de Aprendizagem Rápida */}
          <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4 space-y-2.5">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              <span>Regra de Ouro do Mecânico:</span>
            </div>
            <p className="text-xs text-amber-950 leading-relaxed">
              &quot;Nunca aperte um parafuso de regulagem até o final antes de girar a polia manualmente 3 voltas. O movimento manual evita quebras e protege a lançadeira.&quot;
            </p>
            <span className="text-[10px] text-amber-700 font-mono block">— Conselho Prático do Eloizio</span>
          </div>
        </div>
      </div>
    </div>
  );
};
