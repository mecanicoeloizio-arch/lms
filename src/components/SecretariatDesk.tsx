import React, { useState } from 'react';
import { SecretariatRequest, User } from '../types/lms';
import { LMSStorageService } from '../services/storage';
import { 
  Building2, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Printer, 
  Plus, 
  Download, 
  ShieldCheck,
  UserCheck
} from 'lucide-react';

interface SecretariatDeskProps {
  currentUser: User;
}

export const SecretariatDesk: React.FC<SecretariatDeskProps> = ({
  currentUser
}) => {
  const [requests, setRequests] = useState<SecretariatRequest[]>(LMSStorageService.getSecretariatRequests());
  const [selectedDocType, setSelectedDocType] = useState<SecretariatRequest['type']>('declaracao_matricula');
  const [selectedCourseTitle, setSelectedCourseTitle] = useState<string>('Mecânica e Manutenção de Máquinas de Costura Industriais e Domésticas');
  const [generatedDoc, setGeneratedDoc] = useState<SecretariatRequest | null>(requests[0] || null);

  const institution = LMSStorageService.getInstitution();
  const courses = LMSStorageService.getCourses();

  const handleRequestDocument = (e: React.FormEvent) => {
    e.preventDefault();
    const newDoc = LMSStorageService.requestDocument(
      currentUser.id,
      currentUser.name,
      currentUser.documentCpf,
      selectedDocType,
      selectedCourseTitle
    );
    setRequests(LMSStorageService.getSecretariatRequests());
    setGeneratedDoc(newDoc);
  };

  const handlePrint = () => {
    window.print();
  };

  const DOC_TYPE_LABELS: Record<SecretariatRequest['type'], string> = {
    declaracao_matricula: 'Declaração Oficial de Matrícula Ativa',
    atestado_frequencia: 'Atestado de Carga Horária e Frequência',
    historico_completo: 'Histórico Escolar Integral',
    segunda_via_certificado: '2ª Via de Certificado Profissional'
  };

  return (
    <div className="space-y-6">
      {/* Header da Secretaria */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4 no-print">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-900" />
            <span>Secretaria Acadêmica Online & Emissão Oficial</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Atendimento sob responsabilidade de Juliana Santos · Emissão instantânea de declarações com autenticidade digital
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Assinatura Digital ICP-Brasil Homologada</span>
        </div>
      </div>

      {/* Grid: Formulário de Emissão & Visualizador Timbrado */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna 1: Solicitação Instantânea */}
        <div className="lg:col-span-1 space-y-4 no-print">
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-xs">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Solicitar Documento Acadêmico</h3>
              <p className="text-xs text-slate-500">Emissão 100% automatizada e válida para empresas e sindicatos</p>
            </div>

            <form onSubmit={handleRequestDocument} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tipo de Documento:</label>
                <select
                  value={selectedDocType}
                  onChange={e => setSelectedDocType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 font-medium"
                >
                  <option value="declaracao_matricula">Declaração de Matrícula Ativa</option>
                  <option value="atestado_frequencia">Atestado de Frequência e Horas</option>
                  <option value="historico_completo">Histórico Escolar Completo</option>
                  <option value="segunda_via_certificado">2ª Via de Certificado</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Curso Vinculado:</label>
                <select
                  value={selectedCourseTitle}
                  onChange={e => setSelectedCourseTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 font-medium"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.title}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 space-y-1 text-[11px] text-slate-600">
                <p><strong>Titular:</strong> {currentUser.name}</p>
                <p><strong>CPF:</strong> {currentUser.documentCpf}</p>
                <p><strong>Matrícula:</strong> {currentUser.registrationNumber}</p>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-900 text-white rounded-xl text-xs font-bold hover:bg-blue-800 transition-colors shadow-xs flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Emitir Documento Imediatamente</span>
              </button>
            </form>
          </div>

          {/* Histórico de Solicitações do Aluno */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3 shadow-xs">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Documentos Expedidos ({requests.length})
            </h4>

            <div className="space-y-2">
              {requests.map(req => (
                <div
                  key={req.id}
                  onClick={() => setGeneratedDoc(req)}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition-colors ${
                    generatedDoc?.id === req.id
                      ? 'border-blue-900 bg-blue-50/60 font-semibold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-blue-900 text-[11px]">{req.validationCode}</span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-mono font-bold">
                      PRONTO
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-1">{DOC_TYPE_LABELS[req.type]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Coluna 2 e 3: Visualizador Timbrado Oficial para Impressão */}
        <div className="lg:col-span-2 space-y-4">
          {generatedDoc ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between no-print bg-white p-3 border border-slate-200 rounded-xl">
                <span className="text-xs font-mono text-slate-500">
                  Documento Autenticado: <strong>{generatedDoc.validationCode}</strong>
                </span>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-900 text-white rounded-lg text-xs font-semibold hover:bg-blue-800 transition-colors shadow-xs"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir / Salvar em PDF</span>
                </button>
              </div>

              {/* MODELO TIMBRADO OFICIAL DE DECLARAÇÃO */}
              <div className="bg-white border-2 border-slate-300 p-8 sm:p-12 rounded-xl shadow-md space-y-6 text-slate-800 relative">
                {/* Cabeçalho Timbrado */}
                <div className="border-b-2 border-blue-900 pb-4 text-center space-y-1">
                  <h2 className="text-lg sm:text-xl font-extrabold text-blue-950 uppercase tracking-tight">
                    {institution.name}
                  </h2>
                  <p className="text-xs text-slate-600 font-mono">
                    CNPJ: {institution.documentCnpj} · São Gonçalo - RJ · Telefone: {institution.phone}
                  </p>
                  <p className="text-[10px] font-mono uppercase text-slate-400">
                    SECRETARIA GERAL DE REGISTRO E CONTROLE ACADÊMICO
                  </p>
                </div>

                {/* Título do Documento */}
                <div className="text-center py-2">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 uppercase underline decoration-blue-900 underline-offset-4">
                    {DOC_TYPE_LABELS[generatedDoc.type]}
                  </h3>
                  <span className="text-xs font-mono text-slate-500 mt-1 block">
                    Nº de Registro Oficial: {generatedDoc.validationCode}
                  </span>
                </div>

                {/* Texto Formal da Declaração */}
                <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-justify">
                  <p>
                    A Secretaria Geral do <strong>{institution.name}</strong>, sediada no município de São Gonçalo, Estado do Rio de Janeiro, no uso de suas atribuições legais e estatutárias, <strong>DECLARA</strong> para os devidos fins de comprovação junto a empresas, entidades de classe ou instituições públicas e privadas, que:
                  </p>

                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 font-mono text-xs space-y-1 my-3">
                    <p><strong>Nome do Estudante:</strong> {generatedDoc.studentName}</p>
                    <p><strong>Documento de Identificação (CPF):</strong> {generatedDoc.documentCpf}</p>
                    <p><strong>Curso Vinculado:</strong> {generatedDoc.courseTitle}</p>
                    <p><strong>Situação Acadêmica:</strong> Regularmente Matriculado(a) com Acesso Ativo</p>
                    <p><strong>Data de Emissão:</strong> {new Date(generatedDoc.requestedAt).toLocaleDateString('pt-BR')}</p>
                  </div>

                  <p>
                    O referido curso enquadra-se na modalidade de Educação Profissional e Cursos Livres, fundamentado na Lei Federal de Diretrizes e Bases da Educação Nacional nº 9.394/1996 e no Decreto Presidencial nº 5.154/2004.
                  </p>

                  <p>
                    Por ser a expressão da verdade, firmamos o presente documento com assinatura e autenticação digital verificável.
                  </p>
                </div>

                {/* Data e Assinatura */}
                <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6 text-center">
                  <div className="text-left text-[11px] font-mono text-slate-500">
                    <p>São Gonçalo - RJ, {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}.</p>
                    <p className="text-[10px] text-blue-900 font-bold mt-1">Validação pública via QR Code / Portal</p>
                  </div>

                  <div className="text-center">
                    <div className="w-48 h-0.5 bg-slate-400 mx-auto mb-1.5" />
                    <p className="text-xs font-bold text-slate-900">{generatedDoc.digitalSignature}</p>
                    <p className="text-[10px] text-slate-500 font-mono">Secretaria Acadêmica Grupo Eloizio</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
              Selecione ou solicite um documento ao lado para visualização.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
