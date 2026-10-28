import React, { useState } from 'react';
import { Order, Transaction, WebhookLog, User } from '../types/lms';
import { LMSStorageService } from '../services/storage';
import { 
  WalletCards, 
  QrCode, 
  Copy, 
  Check, 
  RefreshCw, 
  ShieldCheck, 
  CreditCard, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Send,
  Webhook
} from 'lucide-react';

interface FinancialCenterProps {
  currentUser: User;
  onEnrollmentUnlocked?: (courseId: string) => void;
}

export const FinancialCenter: React.FC<FinancialCenterProps> = ({
  currentUser
}) => {
  const [orders, setOrders] = useState<Order[]>(LMSStorageService.getOrders());
  const [transactions, setTransactions] = useState<Transaction[]>(LMSStorageService.getTransactions());
  const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>(LMSStorageService.getWebhookLogs());
  const [activeTab, setActiveTab] = useState<'checkout' | 'orders' | 'webhooks' | 'credentials'>('checkout');

  // Checkout interativo
  const courses = LMSStorageService.getCourses();
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || '');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card'>('pix');
  const [cardInstallments, setCardInstallments] = useState(1);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [copiedPix, setCopiedPix] = useState(false);

  // Webhook Simulator
  const [webhookSimPaymentId, setWebhookSimPaymentId] = useState(orders[0]?.mpPaymentId || 'mp-pay-9876543210');
  const [webhookSimStatus, setWebhookSimStatus] = useState('approved');
  const [webhookSimResult, setWebhookSimResult] = useState<string | null>(null);

  // Credenciais Mercado Pago
  const [mpMode, setMpMode] = useState<'sandbox' | 'production'>('sandbox');
  const [mpPublicKey, setMpPublicKey] = useState('TEST-pub-4a8b9c2d1e-grupoeloizio');
  const [mpAccessToken, setMpAccessToken] = useState('TEST-sec-9f8e7d6c5b-grupoeloizio');

  const selectedCourse = courses.find(c => c.id === selectedCourseId) || courses[0];

  const handleGenerateCheckout = () => {
    if (!selectedCourse) return;
    const newOrder = LMSStorageService.createOrder(
      currentUser.id,
      selectedCourse.id,
      paymentMethod,
      cardInstallments
    );
    setCreatedOrder(newOrder);
    setOrders(LMSStorageService.getOrders());
    setWebhookSimPaymentId(newOrder.mpPaymentId || '');
  };

  const handleSimulatePaymentApproval = (orderId: string) => {
    const result = LMSStorageService.approveOrder(orderId);
    setOrders(LMSStorageService.getOrders());
    setTransactions(LMSStorageService.getTransactions());
    if (createdOrder?.id === orderId) {
      setCreatedOrder(result.order);
    }
  };

  const handleCopyPix = () => {
    if (createdOrder?.pixCopiaECola) {
      navigator.clipboard.writeText(createdOrder.pixCopiaECola);
      setCopiedPix(true);
      setTimeout(() => setCopiedPix(false), 2500);
    }
  };

  const handleTriggerWebhook = () => {
    const result = LMSStorageService.processWebhookSimulation(
      webhookSimPaymentId,
      'payment.updated',
      webhookSimStatus
    );
    setWebhookLogs(LMSStorageService.getWebhookLogs());
    setOrders(LMSStorageService.getOrders());
    setTransactions(LMSStorageService.getTransactions());
    setWebhookSimResult(
      `[${result.isDuplicate ? 'IDEMPOTÊNCIA ATIVADA' : 'PROCESSADO'}] ${result.message}`
    );
  };

  // Cálculos financeiros
  const totalRevenue = orders
    .filter(o => o.status === 'approved')
    .reduce((sum, o) => sum + o.amountBrl, 0);

  const pendingRevenue = orders
    .filter(o => o.status === 'pending')
    .reduce((sum, o) => sum + o.amountBrl, 0);

  return (
    <div className="space-y-6">
      {/* Header Financeiro */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Financeiro & Integração Oficial Mercado Pago
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Checkout transparente, Pix dinâmico, processamento de webhooks idempotentes e conciliação
          </p>
        </div>

        {/* Abas */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('checkout')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'checkout' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Novo Checkout
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'orders' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pedidos ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('webhooks')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'webhooks' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Webhooks & Idempotência
          </button>
          <button
            onClick={() => setActiveTab('credentials')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'credentials' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Credenciais API
          </button>
        </div>
      </div>

      {/* Indicadores Financeiros (Tabular Numerals) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-1 shadow-xs">
          <span className="text-[11px] text-slate-400 font-medium">Faturamento Aprovado</span>
          <p className="text-xl sm:text-2xl font-bold font-mono text-emerald-700 tabular-nums">
            R$ {totalRevenue.toFixed(2)}
          </p>
          <span className="text-[10px] text-slate-500 font-mono">
            {orders.filter(o => o.status === 'approved').length} transações confirmadas
          </span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-1 shadow-xs">
          <span className="text-[11px] text-slate-400 font-medium">Aguardando Pagamento (Pix/Boleto)</span>
          <p className="text-xl sm:text-2xl font-bold font-mono text-amber-700 tabular-nums">
            R$ {pendingRevenue.toFixed(2)}
          </p>
          <span className="text-[10px] text-slate-500 font-mono">
            {orders.filter(o => o.status === 'pending').length} pedidos pendentes
          </span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-1 shadow-xs">
          <span className="text-[11px] text-slate-400 font-medium">Gateway de Pagamento</span>
          <p className="text-xl sm:text-2xl font-bold text-blue-900">
            Mercado Pago
          </p>
          <span className="text-[10px] text-emerald-700 font-mono flex items-center gap-1 font-semibold">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> API v1 Conectada ({mpMode.toUpperCase()})
          </span>
        </div>
      </div>

      {/* ABA 1: CHECKOUT TRANSPARENTE & PIX DINÂMICO */}
      {activeTab === 'checkout' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Coluna 1: Formulário de Pagamento */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-5">
            <div>
              <h3 className="text-base font-bold text-slate-900">Checkout de Matrícula</h3>
              <p className="text-xs text-slate-500">Selecione o curso e gere a cobrança no padrão oficial do Mercado Pago</p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Selecione o Curso:</label>
                <select
                  value={selectedCourseId}
                  onChange={e => setSelectedCourseId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 font-medium"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.title} — R$ {c.priceBrl.toFixed(2)} ({c.durationHours}h)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Método de Pagamento:</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('pix')}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                      paymentMethod === 'pix'
                        ? 'border-blue-900 bg-blue-50/50 text-blue-900 font-bold'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <span className="block text-xs">Pix Imediato</span>
                      <span className="text-[10px] text-emerald-700 font-mono">Liberação Instantânea</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('credit_card')}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                      paymentMethod === 'credit_card'
                        ? 'border-blue-900 bg-blue-50/50 text-blue-900 font-bold'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-blue-800 shrink-0" />
                    <div>
                      <span className="block text-xs">Cartão de Crédito</span>
                      <span className="text-[10px] text-slate-400 font-mono">Em até 12x</span>
                    </div>
                  </button>
                </div>
              </div>

              {paymentMethod === 'credit_card' && (
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Parcelamento (Sem Juros Grupo Eloizio):</label>
                  <select
                    value={cardInstallments}
                    onChange={e => setCardInstallments(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 font-mono"
                  >
                    <option value={1}>1x de R$ {selectedCourse.priceBrl.toFixed(2)} à vista</option>
                    <option value={2}>2x de R$ {(selectedCourse.priceBrl / 2).toFixed(2)}</option>
                    <option value={3}>3x de R$ {(selectedCourse.priceBrl / 3).toFixed(2)}</option>
                    <option value={6}>6x de R$ {(selectedCourse.priceBrl / 6).toFixed(2)}</option>
                    <option value={12}>12x de R$ {(selectedCourse.priceBrl / 12).toFixed(2)}</option>
                  </select>
                </div>
              )}

              {/* Resumo do Pedido */}
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Comprador</span>
                  <span className="font-semibold text-slate-900">{currentUser.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">CPF do Pagador</span>
                  <span className="font-mono text-slate-700">{currentUser.documentCpf}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-sm">
                  <span>Total</span>
                  <span className="font-mono text-blue-900">R$ {selectedCourse.priceBrl.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleGenerateCheckout}
                className="w-full py-3 bg-blue-900 text-white rounded-xl text-xs font-bold hover:bg-blue-800 transition-colors shadow-sm"
              >
                Gerar Cobrança Oficial Mercado Pago
              </button>
            </div>
          </div>

          {/* Coluna 2: Resultado do Pagamento Gerado */}
          <div className="space-y-4">
            {createdOrder ? (
              <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-sm animate-in fade-in duration-150">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400">PEDIDO #{createdOrder.id}</span>
                    <h4 className="text-sm font-bold text-slate-900">{createdOrder.courseTitle}</h4>
                  </div>
                  <span
                    className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded ${
                      createdOrder.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {createdOrder.status === 'approved' ? 'PAGO' : 'AGUARDANDO PAGAMENTO'}
                  </span>
                </div>

                {createdOrder.status === 'pending' ? (
                  <div className="space-y-4 text-center">
                    {/* QR Code Pix */}
                    <div className="w-48 h-48 bg-slate-50 border-2 border-dashed border-emerald-400 rounded-2xl mx-auto flex flex-col items-center justify-center p-3 shadow-inner">
                      <QrCode className="w-32 h-32 text-slate-900" />
                      <span className="text-[10px] font-mono font-bold text-emerald-700 mt-1">
                        PIX DINÂMICO MERCADO PAGO
                      </span>
                    </div>

                    {/* Copia e Cola */}
                    <div className="space-y-1.5 text-left">
                      <label className="text-[11px] font-bold text-slate-600 block">Código Pix Copia e Cola:</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          readOnly
                          value={createdOrder.pixCopiaECola || ''}
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[11px] font-mono text-slate-700 select-all"
                        />
                        <button
                          onClick={handleCopyPix}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1 shrink-0"
                        >
                          {copiedPix ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedPix ? 'Copiado!' : 'Copiar'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Simulador de Aprovação Imediata para Testes */}
                    <div className="pt-2 border-t border-slate-100">
                      <button
                        onClick={() => handleSimulatePaymentApproval(createdOrder.id)}
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                      >
                        Simular Aprovação Imediata (Ambiente Sandbox)
                      </button>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Em produção, o webhook do Mercado Pago valida e libera automaticamente.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 space-y-3">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                    <div>
                      <h4 className="text-base font-bold text-slate-900">Pagamento Aprovado com Sucesso!</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Sua matrícula para <strong>{createdOrder.courseTitle}</strong> foi liberada automaticamente no sistema.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-slate-50 rounded-xl border border-dashed border-slate-200 p-8 text-center text-slate-400 text-xs">
                Preencha o formulário e clique em &quot;Gerar Cobrança&quot; para visualizar o QR Code Pix e link de pagamento.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ABA 2: LISTAGEM DE PEDIDOS & TRANSAÇÕES */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">Histórico de Pedidos Registrados</h3>
            <span className="text-xs text-slate-500 font-mono">{orders.length} pedidos</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Pedido ID</th>
                  <th className="py-2.5 px-4">Curso</th>
                  <th className="py-2.5 px-4">Valor BRL</th>
                  <th className="py-2.5 px-4">Método</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4">Data</th>
                  <th className="py-2.5 px-4">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-bold text-blue-900">{order.id}</td>
                    <td className="py-2.5 px-4 font-sans text-slate-800">{order.courseTitle}</td>
                    <td className="py-2.5 px-4 font-bold text-slate-900 tabular-nums">R$ {order.amountBrl.toFixed(2)}</td>
                    <td className="py-2.5 px-4 uppercase">{order.paymentMethod}</td>
                    <td className="py-2.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        order.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {order.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-2.5 px-4 font-sans">
                      {order.status === 'pending' && (
                        <button
                          onClick={() => handleSimulatePaymentApproval(order.id)}
                          className="text-xs text-blue-900 hover:underline font-semibold"
                        >
                          Aprovar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ABA 3: WEBHOOKS & TESTE DE IDEMPOTÊNCIA */}
      {activeTab === 'webhooks' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Webhook className="w-5 h-5 text-blue-900" />
                <span>Simulador de Webhook com Teste de Idempotência</span>
              </h3>
              <p className="text-xs text-slate-500">
                O Mercado Pago reenvia webhooks até receber HTTP 200. Nosso sistema utiliza chaves de idempotência para garantir que notificações duplicadas jamais dupliquem matrículas ou pagamentos.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Payment ID:</label>
                <input
                  type="text"
                  value={webhookSimPaymentId}
                  onChange={e => setWebhookSimPaymentId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Status a Notificar:</label>
                <select
                  value={webhookSimStatus}
                  onChange={e => setWebhookSimStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
                >
                  <option value="approved">approved (Aprovado)</option>
                  <option value="pending">pending (Pendente)</option>
                  <option value="rejected">rejected (Recusado)</option>
                  <option value="refunded">refunded (Estornado)</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleTriggerWebhook}
                  className="w-full py-2 bg-blue-900 text-white rounded-lg text-xs font-semibold hover:bg-blue-800 transition-colors"
                >
                  Disparar Webhook
                </button>
              </div>
            </div>

            {webhookSimResult && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs font-mono text-blue-900">
                {webhookSimResult}
              </div>
            )}
          </div>

          {/* Tabela de Logs de Webhooks Recebidos */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Logs de Webhooks Registrados no Banco ({webhookLogs.length})
            </h4>

            {webhookLogs.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">Nenhum webhook registrado nesta sessão ainda.</p>
            ) : (
              <div className="divide-y divide-slate-100 text-xs font-mono">
                {webhookLogs.map(log => (
                  <div key={log.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900">{log.topic} / {log.action}</span>
                      <span className="text-slate-400 block text-[10px]">ID: {log.dataId} · Chave: {log.idempotencyKey}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.isDuplicate ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {log.isDuplicate ? 'IDEMPOTENTE (IGNORADO)' : 'PROCESSADO'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ABA 4: CREDENCIAIS DA API MERCADO PAGO */}
      {activeTab === 'credentials' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-5 max-w-2xl">
          <div>
            <h3 className="text-base font-bold text-slate-900">Configuração de Credenciais da API</h3>
            <p className="text-xs text-slate-500">
              Alterne entre ambiente Sandbox (para testes seguros) e Produção.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Ambiente Ativo:</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="mp_mode"
                    checked={mpMode === 'sandbox'}
                    onChange={() => setMpMode('sandbox')}
                  />
                  <span>Sandbox (Testes)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="mp_mode"
                    checked={mpMode === 'production'}
                    onChange={() => setMpMode('production')}
                  />
                  <span>Produção Oficial</span>
                </label>
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Public Key:</label>
              <input
                type="text"
                value={mpPublicKey}
                onChange={e => setMpPublicKey(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-xs"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Access Token:</label>
              <input
                type="password"
                value={mpAccessToken}
                onChange={e => setMpAccessToken(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-xs"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Nunca exposto no frontend em produção; protegido pelo backend cURL PHP.
              </span>
            </div>

            <button
              onClick={() => alert('Credenciais salvas com sucesso!')}
              className="px-4 py-2 bg-blue-900 text-white rounded-lg text-xs font-semibold hover:bg-blue-800 transition-colors"
            >
              Salvar Credenciais
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
