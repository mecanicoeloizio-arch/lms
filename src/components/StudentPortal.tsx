import React from 'react';
import { User } from '../types/lms';
import { LMSStorageService } from '../services/storage';
import { 
  Play, 
  Award, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Calendar,
  User as UserIcon,
  CreditCard,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface StudentPortalProps {
  currentUser: User;
  onOpenPlayer: (courseId: string, lessonId?: string) => void;
  onOpenDocuments: () => void;
  onOpenFinancial: () => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  currentUser,
  onOpenPlayer,
  onOpenDocuments,
  onOpenFinancial
}) => {
  const enrollments = LMSStorageService.getUserEnrollments(currentUser.id);
  const courses = LMSStorageService.getCourses();
  const certificates = LMSStorageService.getCertificates().filter(c => c.userId === currentUser.id);
  const studentCards = LMSStorageService.getStudentCards().filter(sc => sc.userId === currentUser.id);
  const orders = LMSStorageService.getOrders().filter(o => o.userId === currentUser.id);
  const pendingOrders = orders.filter(o => o.status === 'pending');

  const enrolledCourses = enrollments.map(enr => {
    const course = courses.find(c => c.id === enr.courseId);
    return { enrollment: enr, course };
  }).filter(item => item.course !== undefined);

  // Média de progresso geral
  const averageProgress = enrolledCourses.length > 0
    ? Math.round(enrolledCourses.reduce((acc, item) => acc + item.enrollment.progressPercent, 0) / enrolledCourses.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Banner de Boas-vindas do Aluno */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center font-bold text-2xl text-blue-200 shrink-0">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-blue-500/30 text-blue-200 px-2.5 py-0.5 rounded-full font-medium">
                Matrícula: {currentUser.registrationNumber}
              </span>
              <span className="text-xs text-slate-300">· CPF: {currentUser.documentCpf}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold mt-1 tracking-tight">
              Bem-vindo, {currentUser.name}!
            </h1>
            <p className="text-xs sm:text-sm text-blue-200 mt-0.5">
              Portal do Aluno · Acompanhe suas aulas, avaliações, notas e certificados
            </p>
          </div>
        </div>

        {/* Indicadores Resumidos (Tabular Figures) */}
        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm p-3.5 rounded-xl border border-white/10 shrink-0">
          <div className="text-center px-2">
            <span className="text-xl sm:text-2xl font-bold font-mono tabular-nums block">
              {enrolledCourses.length}
            </span>
            <span className="text-[11px] text-blue-200">Cursos</span>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="text-center px-2">
            <span className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-emerald-300 block">
              {averageProgress}%
            </span>
            <span className="text-[11px] text-blue-200">Progresso Médio</span>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="text-center px-2">
            <span className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-amber-300 block">
              {certificates.length}
            </span>
            <span className="text-[11px] text-blue-200">Certificados</span>
          </div>
        </div>
      </div>

      {/* Alerta de Pendência Financeira (se houver) */}
      {pendingOrders.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="text-xs sm:text-sm font-bold text-amber-900">
                Você possui {pendingOrders.length} pedido(s) pendente(s) de pagamento via Pix/Cartão
              </p>
              <p className="text-xs text-amber-700">
                Pague agora para liberar acesso imediato ao conteúdo completo do curso.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenFinancial}
            className="px-3.5 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-semibold hover:bg-amber-700 transition-colors whitespace-nowrap shrink-0"
          >
            Ver Faturas
          </button>
        </div>
      )}

      {/* Seção Principal: Meus Cursos em Andamento */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Meus Cursos Matriculados
          </h2>
          <span className="text-xs text-slate-500 font-mono">
            {enrolledCourses.length} curso(s) ativo(s)
          </span>
        </div>

        {enrolledCourses.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-3">
            <p className="text-sm text-slate-600 font-medium">Você ainda não está matriculado em nenhum curso.</p>
            <p className="text-xs text-slate-400">Explore nosso catálogo e inicie sua capacitação técnica hoje mesmo.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {enrolledCourses.map(({ enrollment, course }) => {
              if (!course) return null;
              const isCompleted = enrollment.progressPercent >= 100;

              return (
                <div
                  key={enrollment.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all shadow-sm"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-blue-900 uppercase tracking-wide">
                        {course.category}
                      </span>
                      {isCompleted ? (
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Concluído
                        </span>
                      ) : (
                        <span className="text-slate-500 font-mono">Em Andamento</span>
                      )}
                    </div>

                    <h3 className="font-bold text-slate-900 text-base leading-snug">
                      {course.title}
                    </h3>

                    {/* Barra de Progresso Real */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-500">Progresso do Conteúdo</span>
                        <span className="font-bold text-slate-900 tabular-nums">
                          {enrollment.progressPercent}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isCompleted ? 'bg-emerald-600' : 'bg-blue-900'
                          }`}
                          style={{ width: `${enrollment.progressPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Notas e Frequência */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                      <div>
                        <span className="text-[11px] text-slate-400 block">Nota Final</span>
                        <span className="font-bold font-mono text-slate-800">
                          {enrollment.finalGrade !== undefined ? enrollment.finalGrade.toFixed(1) : 'Pendente Prova'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-400 block">Frequência</span>
                        <span className="font-bold font-mono text-slate-800">
                          {enrollment.attendancePercent !== undefined ? `${enrollment.attendancePercent}%` : '100%'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Ação: Retomar Aula ou Ver Certificado */}
                  <div className="pt-2 flex items-center justify-between">
                    <button
                      onClick={() => onOpenPlayer(course.id)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-blue-900 text-white rounded-lg text-xs font-semibold hover:bg-blue-800 transition-colors shadow-sm"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isCompleted ? 'Rever Aulas' : 'Continuar de Onde Parei'}</span>
                    </button>

                    {isCompleted && (
                      <button
                        onClick={onOpenDocuments}
                        className="flex items-center gap-1 text-xs text-emerald-700 hover:text-emerald-800 font-semibold"
                      >
                        <Award className="w-4 h-4" />
                        <span>Ver Certificado</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Grid Secundário: Carteirinha Estudantil & Documentos Oficiais */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        {/* Cartão Estudantil */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-blue-900" />
              <span>Carteirinha Estudantil</span>
            </h3>
            <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono">
              Válida 2026
            </span>
          </div>

          {studentCards[0] ? (
            <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-xl p-4 space-y-3 shadow-md relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-[10px] tracking-wider uppercase font-semibold text-blue-200">
                  Grupo Eloizio Academy
                </span>
                <span className="text-[9px] font-mono text-slate-400">ESTUDANTE</span>
              </div>
              <div>
                <p className="text-xs font-bold leading-tight">{studentCards[0].studentName}</p>
                <p className="text-[10px] text-blue-200 font-mono mt-0.5">Matrícula: {studentCards[0].registrationNumber}</p>
                <p className="text-[10px] text-slate-400 font-mono">CPF: {studentCards[0].documentCpf}</p>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[10px] font-mono text-slate-300">
                <span>Validade: {studentCards[0].validUntil}</span>
                <span className="text-blue-300">{studentCards[0].validationCode}</span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400">Nenhuma carteirinha emitida para esta matrícula.</p>
          )}

          <button
            onClick={onOpenDocuments}
            className="w-full text-center text-xs text-blue-900 hover:underline font-semibold"
          >
            Acessar Central de Documentos & Impressão
          </button>
        </div>

        {/* Certificados Emitidos */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-900" />
              <span>Certificados Oficiais Emitidos</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">{certificates.length} documento(s)</span>
          </div>

          {certificates.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-slate-200 rounded-xl space-y-1">
              <p className="text-xs text-slate-500">Nenhum certificado emitido até o momento.</p>
              <p className="text-[11px] text-slate-400">Complete 100% das aulas e atinja média 7.0 na avaliação teórica.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {certificates.map(cert => (
                <div
                  key={cert.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors gap-3"
                >
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">{cert.courseTitle}</h4>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 font-mono">
                      <span>Carga: {cert.durationHours}h</span>
                      <span>·</span>
                      <span>Conclusão: {cert.conclusionDate}</span>
                      <span>·</span>
                      <span className="text-blue-800 font-bold">{cert.validationCode}</span>
                    </div>
                  </div>
                  <button
                    onClick={onOpenDocuments}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors shrink-0"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Visualizar & Imprimir</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
