import React, { useState } from 'react';
import { LMSExportService, ExportFile } from '../services/exportService';
import { 
  FileCode, 
  Copy, 
  Check, 
  Download, 
  Database, 
  Server, 
  Terminal, 
  BookOpen, 
  FolderGit2, 
  Eye, 
  Layers, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const PhpServerExporter: React.FC = () => {
  const schemaSql = LMSExportService.getPostgreSqlSchema();
  const phpFiles = LMSExportService.getPhpFiles();

  const allFiles: ExportFile[] = [
    {
      path: 'database/schema.sql',
      filename: 'schema.sql',
      language: 'sql',
      description: 'Estrutura DDL PostgreSQL completa com tabelas, chaves estrangeiras, índices e constraints',
      content: schemaSql
    },
    ...phpFiles
  ];

  const [selectedFile, setSelectedFile] = useState<ExportFile>(allFiles[0]);
  const [activeTab, setActiveTab] = useState<'files' | 'preview' | 'guide'>('files');
  const [previewPage, setPreviewPage] = useState<'index' | 'player' | 'secretaria' | 'checkout'>('index');
  const [copied, setCopied] = useState(false);
  const [downloadAllStatus, setDownloadAllStatus] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([selectedFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = selectedFile.filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadAllBundle = () => {
    // Gerar script bash automatizado que cria todas as pastas e arquivos no servidor em 1 clique
    let bashScript = `#!/bin/bash\n# Script de Implantação Rápida - LMS Grupo Eloizio (PHP + PostgreSQL)\n\necho "Iniciando criação da estrutura no servidor..."\nmkdir -p config api public/js public/css database views controllers\n\n`;

    allFiles.forEach(file => {
      bashScript += `cat << 'EOF' > ${file.path}\n${file.content}\nEOF\n\n`;
    });

    bashScript += `echo "Estrutura completa implantada com sucesso! Configure seu banco em config/database.php"\n`;

    const blob = new Blob([bashScript], { type: 'text/x-shellscript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'instalar_lms_servidor.sh';
    link.click();
    URL.revokeObjectURL(url);

    setDownloadAllStatus(true);
    setTimeout(() => setDownloadAllStatus(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Server className="w-6 h-6 text-blue-900" />
            <span>Central de Exportação para o Servidor</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Pacote completo &quot;cópia e cola&quot;: PHP 8+, cURL nativo, jQuery, HTML5, Bootstrap 5 e PostgreSQL
          </p>
        </div>

        {/* Abas Superiores */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg shrink-0">
          <button
            onClick={() => setActiveTab('files')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'files' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Código Fonte ({allFiles.length})
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'preview' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5 inline mr-1 text-blue-900" />
            Preview Bootstrap 5
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'guide' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Guia de Instalação
          </button>
        </div>
      </div>

      {/* ABA 1: NAVEGADOR DE ARQUIVOS (CÓDIGO FONTE) */}
      {activeTab === 'files' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-blue-50/70 border border-blue-200 rounded-xl p-3.5 text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-900 shrink-0" />
              <span className="text-slate-700">
                Todos os arquivos foram estruturados em <strong>PHP nativo com PDO e cURL</strong>, sem dependências pesadas de composer para implantação imediata em qualquer hospedagem Apache ou Nginx.
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-900 text-white rounded-lg text-xs font-semibold hover:bg-blue-800 transition-colors shadow-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado!' : 'Copiar Arquivo Atual'}</span>
              </button>

              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-800 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                <span>Baixar</span>
              </button>

              <button
                onClick={handleDownloadAllBundle}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{downloadAllStatus ? 'Script Baixado!' : 'Baixar Pacote Completo (Todos os Arquivos)'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Lista de Arquivos */}
            <div className="lg:col-span-1 space-y-1.5 max-h-[620px] overflow-y-auto pr-1">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FolderGit2 className="w-4 h-4 text-blue-900" />
                <span>Arquivos do Projeto ({allFiles.length})</span>
              </h3>

              {allFiles.map(file => (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex flex-col ${
                    selectedFile.path === file.path
                      ? 'border-blue-900 bg-blue-50/70 text-blue-950 font-bold shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs truncate max-w-[170px]">{file.filename}</span>
                    <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 shrink-0">
                      {file.language}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-normal truncate mt-0.5">
                    {file.path}
                  </span>
                </button>
              ))}
            </div>

            {/* Visualizador de Código */}
            <div className="lg:col-span-3">
              <div className="bg-slate-900 rounded-xl overflow-hidden shadow-lg border border-slate-800">
                <div className="bg-slate-950 px-4 py-2.5 flex items-center justify-between border-b border-slate-800 text-xs">
                  <div className="flex items-center gap-2 text-slate-300 font-mono">
                    <FileCode className="w-4 h-4 text-blue-400" />
                    <span>{selectedFile.path}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 hidden sm:inline">{selectedFile.description}</span>
                </div>

                <div className="p-4 max-h-[580px] overflow-auto">
                  <pre className="font-mono text-xs leading-relaxed text-slate-200 select-all">
                    <code>{selectedFile.content}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ABA 2: PREVIEW VISUAL DO LAYOUT PHP & BOOTSTRAP 5 */}
      {activeTab === 'preview' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl p-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700">Simulador de Telas PHP/Bootstrap 5:</span>
              <div className="flex gap-1">
                {[
                  { id: 'index', label: 'index.php (Vitrine)' },
                  { id: 'player', label: 'player.php (Sala de Aula)' },
                  { id: 'secretaria', label: 'secretaria.php (Declaração)' },
                  { id: 'checkout', label: 'checkout.php (Pix Mercado Pago)' }
                ].map(p => (
                  <button
                    key={p.id}
                    onClick={() => setPreviewPage(p.id as any)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                      previewPage === p.id
                        ? 'bg-blue-900 text-white font-bold'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <span className="text-[11px] text-slate-400 font-mono">
              Renderizado com Bootstrap 5.3 + Fontes e Ícones Oficiais
            </span>
          </div>

          {/* Emulador do Navegador Web */}
          <div className="border border-slate-300 rounded-2xl overflow-hidden shadow-lg bg-white">
            {/* Barra do Navegador */}
            <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center justify-between text-xs font-mono text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
              </div>
              <div className="bg-white border border-slate-200 rounded-md px-4 py-0.5 text-slate-700 truncate max-w-sm text-center">
                https://seusite.com.br/{previewPage}.php
              </div>
              <span className="text-[10px] text-emerald-600 font-bold">● PHP 8.2 + PDO</span>
            </div>

            {/* Conteúdo Renderizado da Tela Selecionada */}
            <div className="p-4 sm:p-6 bg-slate-50 min-h-[460px]">
              {previewPage === 'index' && (
                <div className="space-y-4">
                  <div className="bg-dark text-white p-6 rounded-3xl text-center space-y-3" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)' }}>
                    <span className="badge bg-warning text-dark px-3 py-1.5 rounded-pill font-mono">
                      TURMA OFICIAL COM MENTORIA
                    </span>
                    <h2 className="display-6 fw-bold text-white">Domine a Mecânica de Máquinas de Costura</h2>
                    <p className="text-light small max-w-lg mx-auto">
                      Método prático passo a passo do zero ao profissional em PHP e Bootstrap 5.
                    </p>
                    <button className="btn btn-success fw-bold px-4 py-2">QUERO ME MATRICULAR</button>
                  </div>

                  <div className="row g-3 text-center">
                    <div className="col-md-4">
                      <div className="card p-3 border-0 shadow-sm">
                        <h6 className="fw-bold">Garantia 7 Dias</h6>
                        <small className="text-muted">Reembolso direto pelo Mercado Pago.</small>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="card p-3 border-0 shadow-sm">
                        <h6 className="fw-bold">Certificado QR Code</h6>
                        <small className="text-muted">Válido nacionalmente (Lei 9.394/96).</small>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="card p-3 border-0 shadow-sm">
                        <h6 className="fw-bold">Pix Instantâneo</h6>
                        <small className="text-muted">Liberação em 10 segundos.</small>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {previewPage === 'player' && (
                <div className="space-y-3">
                  <div className="bg-black text-white p-8 rounded-2xl text-center aspect-video flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mb-2">
                      ▶
                    </div>
                    <h6 className="fw-bold">Aula 1.1: Anatomia da Máquina Reta Industrial e Regulagens</h6>
                    <small className="text-secondary">Vídeo em Alta Resolução 1080p</small>
                  </div>
                  <div className="card p-3 border-0 shadow-sm flex-row justify-content-between align-items-center">
                    <div>
                      <h6 className="fw-bold mb-0">Progresso Sincronizado no PostgreSQL</h6>
                      <small className="text-muted">Atualização assíncrona via AJAX jQuery</small>
                    </div>
                    <button className="btn btn-success btn-sm fw-bold">✓ Aula Concluída</button>
                  </div>
                </div>
              )}

              {previewPage === 'secretaria' && (
                <div className="card p-5 border-2 shadow-sm bg-white mx-auto text-center space-y-3" style={{ maxWidth: '650px' }}>
                  <div className="border-bottom pb-2">
                    <h5 className="fw-bold text-primary mb-0">GRUPO ELOIZIO TREINAMENTOS</h5>
                    <small className="text-muted">CNPJ: 38.412.985/0001-44 · São Gonçalo - RJ</small>
                  </div>
                  <h6 className="fw-bold text-uppercase text-decoration-underline">Declaração de Matrícula Ativa</h6>
                  <p className="text-muted small text-justify lh-base">
                    Declaramos que Lucas Mendes de Oliveira, CPF 556.778.990-12, encontra-se regularmente matriculado no curso de Mecânica e Manutenção de Máquinas de Costura (120h).
                  </p>
                  <div className="d-flex justify-content-between align-items-end pt-3 border-top text-start">
                    <small className="text-muted font-monospace">Código: DEC-ELO-2026-0982</small>
                    <small className="fw-bold text-center">Juliana Santos<br /><span className="text-muted fw-normal">Secretária Geral</span></small>
                  </div>
                </div>
              )}

              {previewPage === 'checkout' && (
                <div className="card p-4 border-0 shadow-sm bg-white mx-auto" style={{ maxWidth: '480px' }}>
                  <h5 className="fw-bold mb-2">Checkout Pix Mercado Pago</h5>
                  <div className="p-3 bg-light rounded mb-3">
                    <span className="small text-muted d-block">Curso Selecionado:</span>
                    <strong>Mecânica e Manutenção de Máquinas de Costura</strong>
                    <h4 className="fw-bold text-primary mt-1">R$ 497,00</h4>
                  </div>
                  <div className="input-group mb-2">
                    <input type="text" className="form-control font-monospace small" readOnly value="00020126580014br.gov.bcb.pix013638412985000144..." />
                    <button className="btn btn-outline-secondary btn-sm">Copiar</button>
                  </div>
                  <button className="btn btn-primary w-100 fw-bold">Confirmar Pagamento</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ABA 3: GUIA DE INSTALAÇÃO NO SERVIDOR */}
      {activeTab === 'guide' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6 max-w-3xl">
          <div>
            <h3 className="text-base font-bold text-slate-900">Guia de Implantação no Servidor Web (LAMP / LEMP)</h3>
            <p className="text-xs text-slate-500">
              Instruções simples para colocar o sistema no ar em qualquer VPS, servidor dedicado ou hospedagem cPanel
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <span className="font-bold text-slate-900 block">1. Criar o Banco PostgreSQL:</span>
              <pre className="bg-slate-900 text-slate-200 p-3 rounded-lg font-mono text-[11px] overflow-x-auto">
{`createdb -U postgres -E UTF8 lms_eloizio
psql -U postgres -d lms_eloizio -f schema.sql`}
              </pre>
            </div>

            <div className="space-y-1">
              <span className="font-bold text-slate-900 block">2. Configurar a Conexão em <code>config/database.php</code>:</span>
              <pre className="bg-slate-900 text-slate-200 p-3 rounded-lg font-mono text-[11px] overflow-x-auto">
{`$host = '127.0.0.1';
$dbname = 'lms_eloizio';
$user = 'seu_usuario_postgres';
$password = 'sua_senha_segura';`}
              </pre>
            </div>

            <div className="space-y-1">
              <span className="font-bold text-slate-900 block">3. Configurar Credenciais Mercado Pago em <code>config/mercadopago.php</code>:</span>
              <pre className="bg-slate-900 text-slate-200 p-3 rounded-lg font-mono text-[11px] overflow-x-auto">
{`$accessToken = 'APP_USR-SEU-ACCESS-TOKEN-MERCADO-PAGO';`}
              </pre>
            </div>

            <div className="space-y-1">
              <span className="font-bold text-slate-900 block">4. Configurar Webhook no Mercado Pago:</span>
              <p className="text-slate-600">
                Cadastre a URL <code>https://seusite.com.br/api/mercadopago_webhook.php</code> marcando o evento <strong>Pagamentos (payment)</strong>.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
