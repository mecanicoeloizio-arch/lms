import React, { useState } from 'react';
import { LMSStorageService } from '../services/storage';
import { Certificate, StudentCard } from '../types/lms';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Search, 
  Award, 
  CheckCircle2, 
  ArrowLeft,
  Building2,
  Calendar,
  Clock,
  QrCode
} from 'lucide-react';

interface PublicValidatorProps {
  initialCode?: string;
  onBack: () => void;
}

export const PublicValidator: React.FC<PublicValidatorProps> = ({
  initialCode = '',
  onBack
}) => {
  const [searchCode, setSearchCode] = useState(initialCode);
  const [searched, setSearched] = useState(Boolean(initialCode));
  const [certificateResult, setCertificateResult] = useState<Certificate | null>(() => {
    if (!initialCode) return null;
    return LMSStorageService.getCertificates().find(c => c.validationCode.toUpperCase() === initialCode.trim().toUpperCase()) || null;
  });
  const [cardResult, setCardResult] = useState<StudentCard | null>(() => {
    if (!initialCode) return null;
    return LMSStorageService.getStudentCards().find(sc => sc.validationCode.toUpperCase() === initialCode.trim().toUpperCase()) || null;
  });

  const handleValidate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchCode.trim()) return;

    const code = searchCode.trim().toUpperCase();
    const cert = LMSStorageService.getCertificates().find(c => c.validationCode.toUpperCase() === code);
    const card = LMSStorageService.getStudentCards().find(sc => sc.validationCode.toUpperCase() === code);

    setCertificateResult(cert || null);
    setCardResult(card || null);
    setSearched(true);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-6 px-4">
      {/* Botão Voltar */}
      <div>
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Sistema</span>
        </button>
      </div>

      {/* Header Público */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-blue-900 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
          <ShieldCheck className="w-6 h-6 text-blue-200" />
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Portal Oficial de Autenticação de Documentos
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          Consulte e comprove em tempo real a validade legal e acadêmica de certificados e carteirinhas emitidos pelo Grupo Eloizio.
        </p>
      </div>

      {/* Formulário de Busca */}
      <form onSubmit={handleValidate} className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-3">
        <label className="text-xs font-bold text-slate-700 block">
          Digite o Código de Autenticação (Alfanumérico) ou Chave QR Code:
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Ex: ELO-2026-MC892 ou CARTEIRA-ELO-089"
              value={searchCode}
              onChange={e => setSearchCode(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm font-mono text-slate-900 uppercase placeholder:normal-case focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-900 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-blue-800 transition-colors shadow-sm shrink-0"
          >
            Verificar
          </button>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <span>Códigos de teste rápido:</span>
          <button
            type="button"
            onClick={() => {
              setSearchCode('ELO-2026-MC892');
              setTimeout(handleValidate, 50);
            }}
            className="text-blue-900 underline font-mono"
          >
            ELO-2026-MC892
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={() => {
              setSearchCode('CARTEIRA-ELO-089');
              setTimeout(handleValidate, 50);
            }}
            className="text-blue-900 underline font-mono"
          >
            CARTEIRA-ELO-089
          </button>
        </div>
      </form>

      {/* Resultado da Validação */}
      {searched && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {certificateResult ? (
            <div
              className={`rounded-2xl border p-6 shadow-sm space-y-4 ${
                certificateResult.revoked
                  ? 'bg-rose-50/70 border-rose-300'
                  : 'bg-white border-emerald-300'
              }`}
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  {certificateResult.revoked ? (
                    <ShieldAlert className="w-6 h-6 text-rose-600" />
                  ) : (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  )}
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                      {certificateResult.revoked
                        ? 'CERTIFICADO REVOGADO OU CANCELADO'
                        : 'CERTIFICADO AUTÊNTICO E VÁLIDO'}
                    </h3>
                    <p className="text-xs font-mono text-slate-500">
                      Código Registrado: <strong>{certificateResult.validationCode}</strong>
                    </p>
                  </div>
                </div>

                <span
                  className={`text-xs font-mono font-bold px-3 py-1 rounded-full ${
                    certificateResult.revoked
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {certificateResult.revoked ? 'REVOGADO' : 'REGULAR'}
                </span>
              </div>

              {certificateResult.revoked && (
                <div className="p-3 bg-rose-100/60 rounded-xl text-xs text-rose-900 font-medium">
                  <strong>Motivo do Cancelamento:</strong> {certificateResult.revocationReason || 'Cancelamento administrativo.'}
                </div>
              )}

              {/* Dados Públicos Autorizados (Conforme LGPD - Não expõe CPF ou dados sensíveis) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Nome do Titular</span>
                  <span className="font-bold text-slate-900 text-sm sm:text-base">
                    {certificateResult.studentName}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Curso Realizado</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {certificateResult.courseTitle}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Carga Horária</span>
                  <span className="font-bold font-mono text-slate-800">
                    {certificateResult.durationHours} horas
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Data de Conclusão</span>
                  <span className="font-bold font-mono text-slate-800">
                    {certificateResult.conclusionDate}
                  </span>
                </div>
                <div className="sm:col-span-2 pt-2 border-t border-slate-100">
                  <span className="text-slate-400 block font-medium">Instituição Emissora</span>
                  <span className="font-semibold text-slate-900">
                    {certificateResult.institutionName} (CNPJ: {certificateResult.institutionCnpj})
                  </span>
                </div>
              </div>
            </div>
          ) : cardResult ? (
            <div className="bg-white rounded-2xl border border-emerald-300 p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                <div>
                  <h3 className="text-base font-bold text-slate-900">CARTEIRINHA ESTUDANTIL AUTÊNTICA</h3>
                  <p className="text-xs font-mono text-slate-500">Matrícula: {cardResult.registrationNumber}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block">Estudante</span>
                  <span className="font-bold text-slate-900">{cardResult.studentName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Validade</span>
                  <span className="font-bold font-mono text-slate-900">{cardResult.validUntil}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
              <ShieldAlert className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-slate-900">Documento Não Localizado</p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Não encontramos nenhum registro com o código informado. Verifique se o código foi digitado corretamente.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
