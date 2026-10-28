import React, { useState } from 'react';
import { Certificate, StudentCard, Badge, User } from '../types/lms';
import { LMSStorageService } from '../services/storage';
import { 
  Award, 
  CreditCard, 
  Printer, 
  ShieldCheck, 
  ShieldAlert, 
  RotateCcw, 
  Search,
  CheckCircle2,
  QrCode,
  FileText
} from 'lucide-react';

interface DocumentCenterProps {
  currentUser: User;
  onOpenValidator: (code: string) => void;
}

export const DocumentCenter: React.FC<DocumentCenterProps> = ({
  currentUser,
  onOpenValidator
}) => {
  const [activeTab, setActiveTab] = useState<'certificates' | 'cards' | 'badges' | 'history'>('certificates');
  const [certificates, setCertificates] = useState<Certificate[]>(LMSStorageService.getCertificates());
  const [studentCards] = useState<StudentCard[]>(LMSStorageService.getStudentCards());
  const [badges] = useState<Badge[]>(LMSStorageService.getBadges());
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(certificates[0] || null);

  // Estado para cancelamento / revogação
  const [revocationReason, setRevocationReason] = useState('');
  const [showRevokeModal, setShowRevokeModal] = useState(false);

  const canManage = ['superadmin', 'institution_admin', 'secretary'].includes(currentUser.role);
  const institution = LMSStorageService.getInstitution();
  const enrollments = LMSStorageService.getEnrollments();
  const courses = LMSStorageService.getCourses();

  const handleRevoke = () => {
    if (!selectedCert || !revocationReason.trim()) return;
    const updated = LMSStorageService.revokeCertificate(selectedCert.id, revocationReason.trim());
    if (updated) {
      setCertificates(LMSStorageService.getCertificates());
      setSelectedCert(updated);
      setShowRevokeModal(false);
      setRevocationReason('');
    }
  };

  const handleRestore = (certId: string) => {
    if (window.confirm('Deseja revalidar este certificado oficialmente?')) {
      const updated = LMSStorageService.revalidateCertificate(certId);
      if (updated) {
        setCertificates(LMSStorageService.getCertificates());
        setSelectedCert(updated);
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header e Navegação por Abas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4 no-print">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Central de Documentos & Certificação Oficial
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Emissão com QR Code, carteirinhas de estudante, crachás e validação pública auditável
          </p>
        </div>

        {/* Segmented Control */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('certificates')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'certificates' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Certificados
          </button>
          <button
            onClick={() => setActiveTab('cards')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'cards' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Carteirinhas
          </button>
          <button
            onClick={() => setActiveTab('badges')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'badges' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Crachás
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'history' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Histórico Escolar
          </button>
        </div>
      </div>

      {/* ABA 1: CERTIFICADOS OFICIAIS */}
      {activeTab === 'certificates' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna 1: Lista de Certificados Emitidos */}
          <div className="lg:col-span-1 space-y-3 no-print">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Documentos Registrados ({certificates.length})
            </h3>

            <div className="space-y-2">
              {certificates.map(cert => (
                <div
                  key={cert.id}
                  onClick={() => setSelectedCert(cert)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    selectedCert?.id === cert.id
                      ? 'border-blue-900 bg-blue-50/50 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-blue-900">{cert.validationCode}</span>
                    {cert.revoked ? (
                      <span className="text-[10px] bg-rose-100 text-rose-800 font-semibold px-2 py-0.5 rounded">
                        Revogado
                      </span>
                    ) : (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Válido
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mt-1">{cert.studentName}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{cert.courseTitle}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-1">Concluído em: {cert.conclusionDate}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Coluna 2 e 3: Visualizador do Certificado em Alta Resolução (Impressão / PDF) */}
          <div className="lg:col-span-2 space-y-4">
            {selectedCert ? (
              <div className="space-y-4">
                {/* Ações do Certificado */}
                <div className="flex items-center justify-between no-print bg-white p-3 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrint}
                      className="flex items-center gap-1.5 px-4 py-2 bg-blue-900 text-white rounded-lg text-xs font-semibold hover:bg-blue-800 transition-colors shadow-sm"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Imprimir / Salvar em PDF</span>
                    </button>
                    <button
                      onClick={() => onOpenValidator(selectedCert.validationCode)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 text-slate-800 hover:bg-slate-200 rounded-lg text-xs font-semibold transition-colors"
                    >
                      <QrCode className="w-4 h-4 text-blue-900" />
                      <span>Testar Validação Pública</span>
                    </button>
                  </div>

                  {canManage && (
                    <div>
                      {selectedCert.revoked ? (
                        <button
                          onClick={() => handleRestore(selectedCert.id)}
                          className="flex items-center gap-1 px-3 py-2 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-semibold hover:bg-emerald-100"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Revalidar Documento</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => setShowRevokeModal(true)}
                          className="flex items-center gap-1 px-3 py-2 text-rose-700 bg-rose-50 border border-rose-200 rounded-lg text-xs font-semibold hover:bg-rose-100"
                        >
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>Revogar Certificado</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* ALERTA DE REVOGAÇÃO (se aplicável) */}
                {selectedCert.revoked && (
                  <div className="p-4 bg-rose-50 border border-rose-300 rounded-xl text-xs text-rose-900 no-print flex items-center gap-3">
                    <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
                    <div>
                      <p className="font-bold">DOCUMENTO OFICIALMENTE REVOGADO</p>
                      <p className="text-[11px] text-rose-700">Motivo registrado: {selectedCert.revocationReason}</p>
                    </div>
                  </div>
                )}

                {/* TEMPLATE VISUAL DO CERTIFICADO OFICIAL */}
                <div className="bg-white border-8 border-double border-blue-900 p-8 sm:p-12 rounded-xl shadow-lg relative overflow-hidden text-center space-y-6">
                  {/* Marca d'água discreta de autenticidade */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                    <Award className="w-96 h-96 text-blue-900" />
                  </div>

                  {/* Cabeçalho Institucional */}
                  <div className="space-y-1">
                    <span className="text-xs font-mono font-bold tracking-widest uppercase text-blue-900 block">
                      REPÚBLICA FEDERATIVA DO BRASIL · CURSOS LIVRES & TREINAMENTOS PROFISSIONAIS
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      {selectedCert.institutionName}
                    </h2>
                    <p className="text-xs text-slate-500 font-mono">
                      CNPJ: {selectedCert.institutionCnpj} · Registro Acadêmico Oficial
                    </p>
                  </div>

                  <div className="py-2">
                    <span className="text-base sm:text-lg font-serif italic text-slate-700">
                      Certificamos com louvor que
                    </span>
                    <h1 className="text-2xl sm:text-4xl font-extrabold text-blue-950 my-2 tracking-tight">
                      {selectedCert.studentName}
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
                      concluiu com êxito todas as etapas curriculares do curso de capacitação técnica profissional em:
                    </p>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-2 text-blue-900">
                      {selectedCert.courseTitle}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono mt-2">
                      Carga Horária Total: <strong>{selectedCert.durationHours} horas</strong> · Conclusão em: <strong>{selectedCert.conclusionDate}</strong>
                    </p>
                  </div>

                  {/* Assinaturas Digitais e QR Code */}
                  <div className="pt-8 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end">
                    {/* Assinatura Direção */}
                    <div className="text-center">
                      <div className="w-36 h-0.5 bg-slate-400 mx-auto mb-1.5" />
                      <p className="text-xs font-bold text-slate-800">{selectedCert.signerName}</p>
                      <p className="text-[10px] text-slate-500">{selectedCert.signerRole}</p>
                      <p className="text-[9px] text-slate-400 font-mono">Assinado digitalmente</p>
                    </div>

                    {/* QR Code de Autenticidade e Código Único */}
                    <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-50 border border-slate-200">
                      {/* Simulação de QR Code SVG Autêntico */}
                      <div className="w-20 h-20 bg-white p-1 rounded border border-slate-300 flex items-center justify-center">
                        <QrCode className="w-16 h-16 text-slate-900" />
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 mt-1">Autenticação Oficial</span>
                      <span className="text-xs font-mono font-bold text-blue-900">{selectedCert.validationCode}</span>
                    </div>

                    {/* Selo da Instituição */}
                    <div className="text-center">
                      <div className="w-36 h-0.5 bg-slate-400 mx-auto mb-1.5" />
                      <p className="text-xs font-bold text-slate-800">Coordenação Pedagógica</p>
                      <p className="text-[10px] text-slate-500">Grupo Eloizio Treinamentos</p>
                      <p className="text-[9px] text-slate-400 font-mono">Portaria MEC/LDB 9.394/96</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-12">Selecione um certificado para exibir.</p>
            )}
          </div>
        </div>
      )}

      {/* ABA 2: CARTEIRINHAS ESTUDANTIS DIGITAIS */}
      {activeTab === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studentCards.map(card => (
            <div
              key={card.id}
              className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-white/10 space-y-5 relative overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-bold tracking-wider uppercase text-blue-200">
                  {card.institutionName}
                </span>
                <span className="text-[10px] font-mono bg-blue-500/30 text-blue-200 px-2 py-0.5 rounded">
                  ESTUDANTE
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-slate-800 border-2 border-white/20 flex items-center justify-center font-bold text-xl text-blue-200 shrink-0">
                  {card.studentName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white leading-tight">{card.studentName}</h4>
                  <p className="text-xs text-blue-300 mt-0.5">{card.courseTitle}</p>
                  <p className="text-[11px] text-slate-400 font-mono mt-1">Matrícula: {card.registrationNumber}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 block">Validade</span>
                  <span className="text-white font-bold">{card.validUntil}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Autenticação</span>
                  <span className="text-blue-300 font-bold">{card.validationCode}</span>
                </div>
              </div>

              <div className="pt-1">
                <button
                  onClick={handlePrint}
                  className="w-full py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir Carteirinha Frente/Verso</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ABA 3: CRACHÁS INSTITUCIONAIS */}
      {activeTab === 'badges' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {badges.map(badge => (
            <div
              key={badge.id}
              className="bg-white rounded-2xl border-2 border-slate-300 p-6 shadow-md space-y-4 text-center max-w-sm mx-auto"
            >
              <div className="w-12 h-2 bg-slate-300 rounded-full mx-auto" title="Furo do cordão" />
              <div className="border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-blue-900 uppercase tracking-wider block">
                  {badge.institutionName}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">CRACHÁ DE IDENTIFICAÇÃO</span>
              </div>

              <div className="w-20 h-20 rounded-full bg-blue-900 text-white font-bold text-2xl flex items-center justify-center mx-auto shadow-sm">
                {badge.name.charAt(0)}
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900">{badge.name}</h4>
                <p className="text-xs text-blue-800 font-semibold">{badge.role}</p>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">{badge.department}</p>
                <p className="text-[10px] text-slate-400 font-mono">ID: {badge.registrationNumber}</p>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={handlePrint}
                  className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir Crachá</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ABA 4: HISTÓRICO ESCOLAR AUDITÁVEL */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Histórico Escolar Oficial</h3>
              <p className="text-xs text-slate-500">Registro auditável de cursos, carga horária, notas e frequência</p>
            </div>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir Histórico</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Curso Realizado</th>
                  <th className="py-2.5 px-3">Carga</th>
                  <th className="py-2.5 px-3">Situação</th>
                  <th className="py-2.5 px-3">Nota Final</th>
                  <th className="py-2.5 px-3">Frequência</th>
                  <th className="py-2.5 px-3">Data Conclusão</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {enrollments.map(enr => {
                  const course = courses.find(c => c.id === enr.courseId);
                  return (
                    <tr key={enr.id} className="hover:bg-slate-50 font-mono">
                      <td className="py-2.5 px-3 font-sans font-medium text-slate-900">{course?.title || 'Curso'}</td>
                      <td className="py-2.5 px-3 text-slate-600">{course?.durationHours}h</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          enr.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {enr.status === 'completed' ? 'Aprovado' : 'Cursando'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{enr.finalGrade ? enr.finalGrade.toFixed(1) : '-'}</td>
                      <td className="py-2.5 px-3 text-slate-600">{enr.attendancePercent || 100}%</td>
                      <td className="py-2.5 px-3 text-slate-500">{enr.completedAt ? new Date(enr.completedAt).toLocaleDateString('pt-BR') : '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL DE REVOGAÇÃO DE CERTIFICADO (SUPERADMIN / SECRETARIA) */}
      {showRevokeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 no-print">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md p-5 space-y-4">
            <h3 className="text-base font-bold text-rose-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              <span>Revogar Certificado Oficial</span>
            </h3>
            <p className="text-xs text-slate-600">
              Esta ação registra o cancelamento do documento de forma auditável no banco de dados. O histórico não é apagado.
            </p>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Motivo Legal / Administrativo da Revogação:
              </label>
              <textarea
                rows={3}
                placeholder="Ex: Cancelamento de matrícula por duplicidade ou inconsistência documental..."
                value={revocationReason}
                onChange={e => setRevocationReason(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowRevokeModal(false)}
                className="px-3.5 py-1.5 text-slate-600 hover:text-slate-900 text-xs font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleRevoke}
                disabled={!revocationReason.trim()}
                className="px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-700 disabled:opacity-40 transition-colors"
              >
                Confirmar Revogação
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
