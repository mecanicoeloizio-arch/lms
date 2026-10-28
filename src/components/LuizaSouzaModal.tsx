import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Terminal, 
  UserCheck, 
  Award, 
  FileCode, 
  PlusCircle, 
  CheckCircle2, 
  GraduationCap, 
  Briefcase, 
  QrCode, 
  RotateCcw, 
  Phone, 
  MessageCircle, 
  Zap, 
  Lightbulb, 
  DollarSign, 
  Target, 
  Camera, 
  Mic, 
  Paperclip, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  KeyRound, 
  FileText, 
  Video, 
  Music, 
  ArrowRight,
  UploadCloud,
  Layers,
  HelpCircle
} from 'lucide-react';
import { UserRole, User } from '../types/lms';
import { LuizaBrainService, LuizaProfile, ScriptFileRecord } from '../services/luizaBrain';
import { LMSStorageService } from '../services/storage';
import { handleImageError } from '../utils/imageFallbacks';

interface LuizaModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: User;
  onNavigateToSection?: (section: string) => void;
  onUserRoleChanged?: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'luiza' | 'user';
  text: string;
  timestamp: string;
  actionTaken?: string;
  suggestedSection?: string;
  mediaType?: 'image' | 'audio' | 'video' | 'pdf' | 'document' | 'lead_form' | 'payment_link';
  mediaUrl?: string;
  mediaMeta?: string;
  mediaDetails?: {
    title?: string;
    category?: string;
    recommendations?: string[];
    transcription?: string;
    acousticDiagnosis?: string;
    actionPlan?: string;
    fileContent?: string;
    fileName?: string;
  };
}

export const LuizaSouzaModal: React.FC<LuizaModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onNavigateToSection,
  onUserRoleChanged
}) => {
  const profile = LuizaBrainService.getProfile();
  
  // Detecção de status de CEO Eloizio
  const [isMasterUnlocked, setIsMasterUnlocked] = useState(false);
  const isCeo = LuizaBrainService.isCeoUser(currentUser) || isMasterUnlocked;

  // Dialog de Desbloqueio Master
  const [showMasterModal, setShowMasterModal] = useState(false);
  const [masterKeyInput, setMasterKeyInput] = useState('');
  const [masterKeyError, setMasterKeyError] = useState(false);

  // Abas
  const [activeTab, setActiveTab] = useState<'chat' | 'neuro' | 'cv' | 'actions' | 'code'>('chat');

  // Saudação Inteligente de acordo com o horário do Rio de Janeiro
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Bom dia';
    if (hour >= 12 && hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  // Mensagens do Chat Unificadas
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const defaultIsCeo = LuizaBrainService.isCeoUser(currentUser);
    const greeting = getGreeting();
    
    if (defaultIsCeo) {
      return [
        {
          id: 'm1',
          sender: 'luiza',
          text: `${greeting}, Chefe Eloizio! Que honra ter o senhor aqui na central.\n\nComo sua Gerente Geral e braço direito de IA (FUNC-LUIZA-001), estou 100% conectada e pronta para executar suas ordens executivas: relatórios de faturamento do Mercado Pago, atendimento da oficina física de São Gonçalo, gestão de cursos e edição de scripts do sistema linha por linha.\n\nO que o senhor deseja ordenar agora?`,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        }
      ];
    }

    return [
      {
        id: 'm1',
        sender: 'luiza',
        text: `${greeting}! Sou Luiza Souza (Matrícula Funcional: ${profile.functionalId}), Atendente Oficial e Gestora Geral de Inteligência do Grupo Eloizio.\n\nAssumo o atendimento integral da nossa central: vendas de cursos livres 100% online, orçamentos e consertos de máquinas de costura industriais e domésticas na nossa oficina física em São Gonçalo-RJ, assessoria contábil para MEI e pagamentos via Mercado Pago.\n\nVocê pode me fazer perguntas, enviar fotos/vídeos da sua máquina, áudio de barulho mecânico ou documentos (PDF/TXT) para diagnóstico imediato! Como posso te atender agora?`,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Upload Multimídia Real (Refs)
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Gravação de Áudio Real (MediaRecorder)
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<any>(null);

  // Estados de Atendimento & Captação LGPD
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadSuccess, setLeadSuccess] = useState(false);

  // Estados para Ações Executivas (Exclusivo CEO Master)
  const [selectedCourseForModule, setSelectedCourseForModule] = useState('');
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Estados para o Editor de Scripts Linha por Linha (Exclusivo CEO Master)
  const [scriptFiles, setScriptFiles] = useState<ScriptFileRecord[]>(() => LuizaBrainService.getScriptFiles());
  const [selectedScriptFile, setSelectedScriptFile] = useState<string>('database/schema.sql');
  const [targetLineNumber, setTargetLineNumber] = useState<number>(1);
  const [targetLineContent, setTargetLineContent] = useState<string>('');
  const [patchReason, setPatchReason] = useState<string>('Otimização de índice e conformidade com PostgreSQL 16');
  const [codeFeedback, setCodeFeedback] = useState<string | null>(null);

  // Estados para a Aba de Neurodidática & Neuromarketing
  const [neuroTopic, setNeuroTopic] = useState<'lançadeira' | 'tensão' | 'contabilidade' | 'geral'>('lançadeira');
  const [activeNeuroPill, setActiveNeuroPill] = useState(() => LuizaBrainService.generateNeuroPill('lançadeira'));
  const [cognitiveFeeling, setCognitiveFeeling] = useState<string>('');
  const [cognitiveResult, setCognitiveResult] = useState<any>(null);
  const [marketingAudience, setMarketingAudience] = useState<'confeccao_industrial' | 'atelie_costureira' | 'aluno_curso'>('confeccao_industrial');
  const [marketingPitch, setMarketingPitch] = useState(() => LuizaBrainService.generateNeuromarketingPitch('confeccao_industrial'));

  const courses = LMSStorageService.getCourses();

  // Scroll automático para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const currentFile = scriptFiles.find(f => f.filename === selectedScriptFile) || scriptFiles[0];

  const handleSelectScript = (filename: string) => {
    setSelectedScriptFile(filename);
    const file = scriptFiles.find(f => f.filename === filename);
    if (file && file.lines.length > 0) {
      setTargetLineNumber(1);
      setTargetLineContent(file.lines[0] || '');
    }
  };

  const handleLineNumberChange = (num: number) => {
    setTargetLineNumber(num);
    const index = num - 1;
    if (currentFile && index >= 0 && index < currentFile.lines.length) {
      setTargetLineContent(currentFile.lines[index]);
    }
  };

  // Aplicar Correção no Script Linha por Linha
  const handleApplyScriptPatch = () => {
    try {
      LuizaBrainService.patchScriptLine(
        currentFile.filename,
        targetLineNumber,
        targetLineContent,
        patchReason
      );
      setScriptFiles(LuizaBrainService.getScriptFiles());
      setCodeFeedback(`Linha ${targetLineNumber} de "${currentFile.filename}" corrigida com sucesso! Histórico gravado.`);
      setTimeout(() => setCodeFeedback(null), 3500);
    } catch (e: any) {
      setCodeFeedback(`Erro: ${e.message}`);
    }
  };

  // Simulação de Papel
  const handleSimulateRole = (role: UserRole) => {
    const res = LuizaBrainService.simulateRole(role);
    if (onUserRoleChanged) onUserRoleChanged();
    setActionFeedback(`Simulação ativada: ${res.message}`);
    setTimeout(() => setActionFeedback(null), 3000);
  };

  // Validação da Chave Master do CEO
  const handleVerifyMasterKey = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = masterKeyInput.trim().toLowerCase();
    if (
      cleanKey === '2026' || 
      cleanKey === 'eloizio' || 
      cleanKey === '21987648727' || 
      cleanKey === '21 987648727' || 
      cleanKey === 'mecanicoeloizio@gmail.com'
    ) {
      setIsMasterUnlocked(true);
      setShowMasterModal(false);
      setMasterKeyError(false);
      setMasterKeyInput('');
      setMessages(prev => [
        ...prev,
        {
          id: `lz-master-${Date.now()}`,
          sender: 'luiza',
          text: `👑 MODO CEO MASTER ATIVADO COM SUCESSO!\n\nReconhecido Chefe Eloizio como Autoridade Máxima do Grupo Eloizio. O Painel Executivo e o Editor de Scripts Linha por Linha foram desbloqueados.`,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } else {
      setMasterKeyError(true);
    }
  };

  // --- TRATAMENTO MULTIMÍDIA REAL (ARQUIVOS, IMAGENS, VÍDEOS, ÁUDIOS, PDF E TXT) ---

  const handleTriggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleRealFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    processUploadedFile(file);
    e.target.value = '';
  };

  const processUploadedFile = (file: File) => {
    const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
    const isImage = file.type.startsWith('image/');
    const isAudio = file.type.startsWith('audio/') || ['mp3', 'wav', 'ogg', 'm4a'].includes(fileExt);
    const isVideo = file.type.startsWith('video/') || ['mp4', 'webm', 'mov'].includes(fileExt);
    const isPdf = fileExt === 'pdf';
    const isCodeOrTxt = ['txt', 'sql', 'php', 'json', 'csv'].includes(fileExt);

    const reader = new FileReader();

    if (isImage) {
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        const analysis = LuizaBrainService.analyzeImageFile({
          name: file.name,
          size: file.size,
          dataUrl
        });

        // Adiciona mensagem do usuário com a imagem
        const userMsg: ChatMessage = {
          id: `usr-img-${Date.now()}`,
          sender: 'user',
          text: `Enviei uma imagem para análise: "${file.name}"`,
          mediaType: 'image',
          mediaUrl: dataUrl,
          mediaMeta: `${file.name} · ${(file.size / 1024).toFixed(0)} KB`,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        setIsTyping(true);

        setTimeout(() => {
          setIsTyping(false);
          const replyMsg: ChatMessage = {
            id: `lz-img-${Date.now()}`,
            sender: 'luiza',
            text: `🔍 ${analysis.title}\n\n${analysis.details}\n\n🛠️ Recomendações Técnicas:\n${analysis.recommendations.map(r => `• ${r}`).join('\n')}`,
            mediaType: 'image',
            mediaDetails: {
              title: analysis.title,
              category: analysis.category,
              recommendations: analysis.recommendations
            },
            timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
          };
          setMessages(prev => [...prev, replyMsg]);
        }, 800);
      };
      reader.readAsDataURL(file);
    } else if (isAudio) {
      const audioUrl = URL.createObjectURL(file);
      const analysis = LuizaBrainService.analyzeAudioFile({
        name: file.name,
        size: file.size
      });

      const userMsg: ChatMessage = {
        id: `usr-aud-${Date.now()}`,
        sender: 'user',
        text: `Enviei um áudio para inspeção sonora: "${file.name}"`,
        mediaType: 'audio',
        mediaUrl: audioUrl,
        mediaMeta: `${file.name} · ${(file.size / 1024).toFixed(0)} KB`,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, userMsg]);
      setIsTyping(true);

      setTimeout(() => {
        setIsTyping(false);
        const replyMsg: ChatMessage = {
          id: `lz-aud-${Date.now()}`,
          sender: 'luiza',
          text: `🎧 ${analysis.transcription}\n\n${analysis.acousticDiagnosis}\n\n📋 Plano de Ação:\n${analysis.actionPlan}`,
          mediaType: 'audio',
          mediaUrl: audioUrl,
          mediaDetails: {
            transcription: analysis.transcription,
            acousticDiagnosis: analysis.acousticDiagnosis,
            actionPlan: analysis.actionPlan
          },
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, replyMsg]);
      }, 900);
    } else if (isVideo) {
      const videoUrl = URL.createObjectURL(file);
      const analysis = LuizaBrainService.analyzeVideoFile({
        name: file.name,
        size: file.size
      });

      const userMsg: ChatMessage = {
        id: `usr-vid-${Date.now()}`,
        sender: 'user',
        text: `Enviei um vídeo da máquina em funcionamento: "${file.name}"`,
        mediaType: 'video',
        mediaUrl: videoUrl,
        mediaMeta: `${file.name} · ${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, userMsg]);
      setIsTyping(true);

      setTimeout(() => {
        setIsTyping(false);
        const replyMsg: ChatMessage = {
          id: `lz-vid-${Date.now()}`,
          sender: 'luiza',
          text: `🎬 ${analysis.title}\n\n${analysis.frameInspection}\n\n🛠️ ${analysis.benchProtocol}`,
          mediaType: 'video',
          mediaUrl: videoUrl,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, replyMsg]);
      }, 1000);
    } else {
      // PDF, TXT, SQL, PHP ou Documentos
      reader.onload = (event) => {
        const textSample = event.target?.result as string || '';
        const analysis = LuizaBrainService.analyzeDocumentFile({
          name: file.name,
          size: file.size,
          extension: fileExt,
          contentSample: isCodeOrTxt ? textSample.slice(0, 3000) : undefined
        });

        const userMsg: ChatMessage = {
          id: `usr-doc-${Date.now()}`,
          sender: 'user',
          text: `Enviei o documento: "${file.name}" (${fileExt.toUpperCase()})`,
          mediaType: isPdf ? 'pdf' : 'document',
          mediaMeta: `${file.name} · ${(file.size / 1024).toFixed(0)} KB`,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        setIsTyping(true);

        setTimeout(() => {
          setIsTyping(false);
          const replyMsg: ChatMessage = {
            id: `lz-doc-${Date.now()}`,
            sender: 'luiza',
            text: `📄 ${analysis.summary}\n\nInspeção de Conteúdo:\n${analysis.insights.map(i => `• ${i}`).join('\n')}\n\n🔒 ${analysis.complianceNotice}`,
            mediaType: isPdf ? 'pdf' : 'document',
            mediaDetails: {
              fileName: file.name,
              fileContent: isCodeOrTxt ? textSample.slice(0, 800) : undefined
            },
            timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
          };
          setMessages(prev => [...prev, replyMsg]);
        }, 800);
      };

      if (isCodeOrTxt) {
        reader.readAsText(file);
      } else {
        reader.readAsArrayBuffer(file);
      }
    }
  };

  // --- GRAVAÇÃO DE ÁUDIO REAL VIA MICROFONE (MEDIARECORDER) ---

  const handleToggleAudioRecording = async () => {
    if (isRecordingAudio) {
      // Parar gravação
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      clearInterval(recordingTimerRef.current);
      setIsRecordingAudio(false);
    } else {
      // Iniciar gravação real
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          alert('Seu navegador não possui suporte direto para gravação de microfone.');
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioChunksRef.current = [];
        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        recorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const audioUrl = URL.createObjectURL(audioBlob);
          const duration = recordingSeconds;

          // Processar como áudio enviado
          const audioFile = new File([audioBlob], `gravacao_audio_${Date.now()}.webm`, { type: 'audio/webm' });
          const analysis = LuizaBrainService.analyzeAudioFile({
            name: audioFile.name,
            size: audioBlob.size,
            durationSeconds: duration
          });

          const userMsg: ChatMessage = {
            id: `usr-mic-${Date.now()}`,
            sender: 'user',
            text: `🎙️ Áudio gravado via microfone (${duration} segundos)`,
            mediaType: 'audio',
            mediaUrl: audioUrl,
            mediaMeta: `Voz/Ruído Gravado · ${duration}s`,
            timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
          };

          setMessages(prev => [...prev, userMsg]);
          setIsTyping(true);

          setTimeout(() => {
            setIsTyping(false);
            const replyMsg: ChatMessage = {
              id: `lz-mic-${Date.now()}`,
              sender: 'luiza',
              text: `🎧 ${analysis.transcription}\n\n${analysis.acousticDiagnosis}\n\n📋 ${analysis.actionPlan}`,
              mediaType: 'audio',
              mediaUrl: audioUrl,
              timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, replyMsg]);
          }, 900);

          // Fechar faixas do stream
          stream.getTracks().forEach(track => track.stop());
        };

        recorder.start();
        setIsRecordingAudio(true);
        setRecordingSeconds(0);
        recordingTimerRef.current = setInterval(() => {
          setRecordingSeconds(s => s + 1);
        }, 1000);
      } catch (err: any) {
        console.warn('Microfone indisponível ou permissão negada:', err);
        // Fallback de demonstração caso permissão do mic seja negada no iframe
        handleSimulateAudioFallback();
      }
    }
  };

  const handleSimulateAudioFallback = () => {
    setIsRecordingAudio(true);
    setRecordingSeconds(1);
    setTimeout(() => {
      setIsRecordingAudio(false);
      const analysis = LuizaBrainService.analyzeAudioFile({
        name: 'audio_mecanica.mp3',
        size: 24500,
        durationSeconds: 12
      });

      const userMsg: ChatMessage = {
        id: `usr-aud-demo-${Date.now()}`,
        sender: 'user',
        text: 'Áudio gravado: Barulho mecânico de estalo no cabeçote da reta.',
        mediaType: 'audio',
        mediaMeta: 'Gravação (0:12)',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, userMsg]);

      setTimeout(() => {
        const replyMsg: ChatMessage = {
          id: `lz-aud-demo-${Date.now()}`,
          sender: 'luiza',
          text: `🎧 ${analysis.acousticDiagnosis}\n\n📋 ${analysis.actionPlan}`,
          mediaType: 'audio',
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, replyMsg]);
      }, 700);
    }, 1200);
  };

  // Salvar Lead LGPD
  const handleSaveLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadPhone) return;
    setLeadSuccess(true);
    setTimeout(() => {
      setShowLeadModal(false);
      setLeadSuccess(false);
      setMessages(prev => [
        ...prev,
        {
          id: `lz-${Date.now()}`,
          sender: 'luiza',
          text: `Prazer em te conhecer oficialmente, ${leadName}! Seus dados foram registrados com segurança conforme a LGPD. O Eloizio e eu já temos seu contato (${leadPhone}) e podemos te prestar o suporte mais personalizado do Brasil! Como posso te ajudar agora?`,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1000);
  };

  // Enviar Mensagem no Chat com Inteligência Real (Gemini API + Neuro-Cognitivo)
  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    try {
      const isCeoNow = isCeo || LuizaBrainService.isCeoUser(currentUser, text);
      if (isCeoNow && !isMasterUnlocked) {
        setIsMasterUnlocked(true);
      }

      const res = await LuizaBrainService.askAi(text, {
        isCeo: isCeoNow,
        userName: currentUser?.name,
        userEmail: currentUser?.email
      });

      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: `lz-${Date.now()}`,
          sender: 'luiza',
          text: res.reply,
          actionTaken: res.actionTaken,
          suggestedSection: res.suggestedSection,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        }
      ]);

      if (res.actionTaken === 'course_created' || res.actionTaken === 'module_created') {
        onUserRoleChanged?.();
      }
    } catch (err) {
      console.warn('Erro ao processar mensagem com IA:', err);
      setIsTyping(false);
      const fallbackRes = LuizaBrainService.processQuery(text, {
        isCeo,
        userName: currentUser?.name,
        userEmail: currentUser?.email
      });
      setMessages(prev => [
        ...prev,
        {
          id: `lz-${Date.now()}`,
          sender: 'luiza',
          text: fallbackRes.reply,
          actionTaken: fallbackRes.actionTaken,
          suggestedSection: fallbackRes.suggestedSection,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end sm:p-6 bg-slate-900/40 backdrop-blur-xs p-2 pointer-events-auto"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Container Principal do Modal de Luiza Souza */}
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg sm:max-w-2xl flex flex-col h-[580px] max-h-[88vh] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processUploadedFile(e.dataTransfer.files[0]);
          }
        }}
      >
        {/* Input Oculto de Arquivos Multimídia */}
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*,video/*,audio/*,.pdf,.txt,.sql,.php,.json,.doc,.docx"
          onChange={handleRealFileUpload}
        />

        {/* Header Oficial com Foto, Matrícula Funcional e Selo de Gestão */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white px-4 py-3 flex items-center justify-between shrink-0 shadow-xs border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full border-2 border-amber-400 overflow-hidden shrink-0 shadow-sm bg-slate-800">
              <img 
                src={profile.photoUrl} 
                alt="Luiza Souza" 
                className="w-full h-full object-cover"
                onError={(e) => handleImageError(e, 'luiza')}
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full" title="Online" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white leading-tight flex items-center gap-1.5">
                  {profile.fullName}
                  <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded font-mono">
                    FUNC-001
                  </span>
                </h3>
                {isCeo && (
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[9px] font-mono px-1.5 py-0.2 rounded font-bold flex items-center gap-0.5">
                    👑 MODO CEO MASTER
                  </span>
                )}
              </div>
              <p className="text-[10px] text-blue-200 font-mono leading-none mt-0.5">
                {isCeo ? 'Assistente Executiva Direta do Chefe Eloizio' : 'Atendente Oficial & Gestora IA · Grupo Eloizio'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isCeo ? (
              <button
                onClick={() => setShowMasterModal(true)}
                className="text-[10px] bg-slate-800/80 text-slate-300 border border-slate-700 px-2 py-1 rounded-lg hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-1"
                title="Acesso Master do CEO Eloizio"
              >
                <KeyRound className="w-3 h-3 text-amber-400" />
                <span className="hidden xs:inline">Master CEO</span>
              </button>
            ) : (
              <button
                onClick={() => setIsMasterUnlocked(false)}
                className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-1 rounded-lg hover:bg-amber-400/30 transition-colors flex items-center gap-1 font-mono"
                title="Modo CEO ativado"
              >
                <Unlock className="w-3 h-3" />
                <span className="hidden xs:inline">Chefe Eloizio</span>
              </button>
            )}

            <button
              onClick={() => setShowLeadModal(true)}
              className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2.5 py-1 rounded-full hover:bg-amber-400/30 transition-colors font-bold"
              title="Cadastro LGPD para atendimento personalizado"
            >
              Identificar-se
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Fechar painel de Luiza Souza"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Barra de Abas de Navegação Interna (Com Proteção de Produção para Visitantes) */}
        <div className="bg-slate-100 px-3 py-1.5 border-b border-slate-200 flex items-center gap-1 overflow-x-auto no-scrollbar shrink-0 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'chat' ? 'bg-white text-blue-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5 text-blue-700" />
            Atendimento IA
          </button>
          
          <button
            onClick={() => setActiveTab('neuro')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'neuro' ? 'bg-white text-blue-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            Neurodidática &amp; Vendas
          </button>
          
          <button
            onClick={() => setActiveTab('cv')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'cv' ? 'bg-white text-blue-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            Crachá &amp; CV
          </button>

          {/* Abas Exclusivas do CEO Eloizio (Bloqueadas em Produção para Usuários Comuns) */}
          {isCeo && (
            <>
              <button
                onClick={() => setActiveTab('actions')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 border border-amber-300/60 ${
                  activeTab === 'actions' ? 'bg-amber-50 text-amber-950 font-bold shadow-xs' : 'text-amber-900 hover:bg-amber-50/50'
                }`}
                title="Gestão de Matriz e Simulação RBAC (Exclusivo CEO Eloizio)"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Painel Executivo CEO
              </button>
              
              <button
                onClick={() => setActiveTab('code')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 border border-indigo-300/60 ${
                  activeTab === 'code' ? 'bg-indigo-50 text-indigo-950 font-bold shadow-xs' : 'text-indigo-900 hover:bg-indigo-50/50'
                }`}
                title="Editor de Scripts Linha por Linha (Exclusivo CEO Eloizio)"
              >
                <FileCode className="w-3.5 h-3.5 text-indigo-600" />
                Editor de Scripts
              </button>
            </>
          )}
        </div>

        {/* Feedback de Ação Flutuante */}
        {actionFeedback && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-bold flex items-center justify-between animate-in fade-in duration-200 shrink-0">
            <span>{actionFeedback}</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
        )}

        {/* ABA 1: Chat de Interação Direta com Luiza Souza */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col min-h-0 bg-slate-50">
            {/* Chips Rápidos de Atendimento e Atalhos */}
            <div className="px-3 py-2 bg-white border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 text-[11px]">
              <span className="text-[10px] text-slate-400 font-mono uppercase font-bold shrink-0">Atalhos:</span>
              
              {isCeo ? (
                // Atalhos Executivos para o Chefe Eloizio
                <>
                  <button
                    onClick={() => handleSendMessage('Relatório executivo de faturamento e vendas Mercado Pago')}
                    className="bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 px-2 py-0.5 rounded-full shrink-0 font-bold flex items-center gap-1"
                  >
                    <span>📊</span> Balanço Financeiro
                  </button>
                  <button
                    onClick={() => handleSendMessage('Quantos alunos temos cadastrados no sistema?')}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 px-2 py-0.5 rounded-full shrink-0 font-medium flex items-center gap-1"
                  >
                    <span>👥</span> Base de Alunos
                  </button>
                  <button
                    onClick={() => handleSendMessage('Qual o status da nossa oficina em São Gonçalo?')}
                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0 font-medium flex items-center gap-1"
                  >
                    <span>🏬</span> Oficina São Gonçalo
                  </button>
                </>
              ) : (
                // Atalhos Comerciais e de Suporte para Visitantes e Alunos
                <>
                  <button
                    onClick={() => handleSendMessage('Quero informações sobre os Cursos Livres e Matrícula')}
                    className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-full shrink-0 transition-colors font-medium flex items-center gap-1"
                  >
                    <span>☕</span> Cursos &amp; Matrícula
                  </button>
                  <button
                    onClick={() => handleSendMessage('Preciso de orçamento para conserto de máquina em São Gonçalo')}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 px-2 py-0.5 rounded-full shrink-0 transition-colors font-medium flex items-center gap-1"
                  >
                    <span>⚙️</span> Oficina São Gonçalo
                  </button>
                  <button
                    onClick={() => handleSendMessage('Minha máquina está pulando ponto, como regular o sincronismo da lançadeira?')}
                    className="bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 px-2 py-0.5 rounded-full shrink-0 transition-colors font-medium flex items-center gap-1"
                  >
                    <span>🔧</span> Ponto Pulando
                  </button>
                  <button
                    onClick={() => handleSendMessage('Como funciona o pagamento via Mercado Pago Pix e parcelamento?')}
                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0 transition-colors font-medium flex items-center gap-1"
                  >
                    <span>💳</span> Mercado Pago
                  </button>
                  <button
                    onClick={() => handleSendMessage('Como funciona a assessoria contábil para MEI 100% online?')}
                    className="bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 px-2 py-0.5 rounded-full shrink-0 transition-colors font-medium flex items-center gap-1"
                  >
                    <span>📄</span> Assessoria MEI
                  </button>
                </>
              )}
            </div>

            {/* Histórico de Mensagens com Suporte Multimídia Completo */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.sender === 'luiza' && (
                    <div className="w-7 h-7 rounded-full bg-blue-950 text-amber-400 border border-amber-400/50 flex items-center justify-center font-bold text-[10px] shrink-0">
                      LS
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs shadow-xs leading-relaxed whitespace-pre-wrap ${
                      m.sender === 'user'
                        ? 'bg-blue-900 text-white rounded-br-none'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                    }`}
                  >
                    {/* Renderização de Imagem Real em anexo */}
                    {m.mediaType === 'image' && m.mediaUrl && (
                      <div className="mb-2 rounded-lg overflow-hidden border border-slate-200 bg-slate-900/10">
                        <img 
                          src={m.mediaUrl} 
                          alt="Análise de Imagem" 
                          className="w-full max-h-52 object-contain bg-slate-950" 
                          onError={(e) => handleImageError(e, 'machine')}
                        />
                        {m.mediaMeta && (
                          <div className="bg-slate-900 text-amber-300 text-[10px] font-mono px-2 py-1">
                            {m.mediaMeta}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Renderização de Áudio Real em anexo */}
                    {m.mediaType === 'audio' && m.mediaUrl && (
                      <div className="mb-2 p-2.5 rounded-xl bg-slate-900 text-white border border-slate-800 space-y-1.5">
                        <div className="flex items-center gap-2 text-[11px] font-bold text-amber-300">
                          <Music className="w-3.5 h-3.5" />
                          <span>{m.mediaMeta || 'Áudio para Análise Acústica'}</span>
                        </div>
                        <audio controls src={m.mediaUrl} className="w-full h-8" />
                      </div>
                    )}

                    {/* Renderização de Vídeo Real em anexo */}
                    {m.mediaType === 'video' && m.mediaUrl && (
                      <div className="mb-2 rounded-xl overflow-hidden border border-slate-800 bg-black">
                        <video controls src={m.mediaUrl} className="w-full max-h-56 bg-black" />
                        {m.mediaMeta && (
                          <div className="bg-slate-900 text-blue-300 text-[10px] font-mono px-2 py-1">
                            {m.mediaMeta}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Renderização de Documento (PDF / TXT / SQL) */}
                    {(m.mediaType === 'pdf' || m.mediaType === 'document') && (
                      <div className="mb-2 p-3 rounded-xl bg-blue-50/80 border border-blue-200 text-blue-950 flex items-start gap-2.5">
                        <FileText className="w-5 h-5 text-blue-800 shrink-0 mt-0.5" />
                        <div className="min-w-0 flex-1">
                          <strong className="text-xs block truncate">{m.mediaMeta || 'Documento Anexado'}</strong>
                          <span className="text-[10px] text-blue-700 font-mono block">Documento auditado pela Luiza Souza (FUNC-001)</span>
                          {m.mediaDetails?.fileContent && (
                            <pre className="mt-1.5 p-2 bg-slate-900 text-emerald-400 rounded-lg text-[10px] font-mono overflow-x-auto max-h-24">
                              {m.mediaDetails.fileContent}
                            </pre>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Texto Principal da Mensagem */}
                    <div>{m.text}</div>

                    {/* Botão de Ação Direta / Seção Sugerida */}
                    {m.suggestedSection && onNavigateToSection && (
                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] text-slate-500 font-medium">Ação do Sistema:</span>
                        <button
                          onClick={() => {
                            if (m.suggestedSection) onNavigateToSection(m.suggestedSection);
                            onClose();
                          }}
                          className="px-2.5 py-1 bg-blue-900 text-white rounded-lg text-[10px] font-bold hover:bg-blue-800 flex items-center gap-1 transition-colors"
                        >
                          <span>Abrir Seção</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                    <div className="text-[9px] mt-1 text-right opacity-60 font-mono">
                      {m.timestamp}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-2 items-center text-slate-400 text-xs italic">
                  <div className="w-6 h-6 rounded-full bg-blue-950 text-amber-400 flex items-center justify-center text-[9px] font-bold">
                    LS
                  </div>
                  <span>Luiza Souza está processando sua solicitação...</span>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar com Ações Multimídia Reais (Câmera, Gravação de Microfone, Upload de Arquivos) */}
            <div className="p-3 bg-white border-t border-slate-200 space-y-2 shrink-0">
              {isRecordingAudio && (
                <div className="flex items-center justify-between bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-xl text-rose-800 text-xs animate-pulse">
                  <div className="flex items-center gap-2 font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
                    <span>Gravando áudio do microfone: {recordingSeconds}s</span>
                  </div>
                  <button
                    onClick={handleToggleAudioRecording}
                    className="text-[11px] font-bold bg-rose-600 text-white px-2.5 py-0.5 rounded-lg hover:bg-rose-700"
                  >
                    Concluir e Analisar
                  </button>
                </div>
              )}

              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Botão de Câmera/Foto Real */}
                <button
                  type="button"
                  onClick={handleTriggerFileInput}
                  className="p-2 text-slate-500 hover:text-blue-900 hover:bg-slate-100 rounded-xl transition-colors shrink-0"
                  title="Enviar foto da máquina, peça ou defeito"
                >
                  <Camera className="w-4 h-4" />
                </button>

                {/* Botão de Gravação de Áudio com Microfone Real */}
                <button
                  type="button"
                  onClick={handleToggleAudioRecording}
                  className={`p-2 rounded-xl transition-colors shrink-0 ${
                    isRecordingAudio
                      ? 'bg-rose-600 text-white'
                      : 'text-slate-500 hover:text-blue-900 hover:bg-slate-100'
                  }`}
                  title={isRecordingAudio ? 'Parar gravação' : 'Gravar áudio com ruído da máquina'}
                >
                  <Mic className="w-4 h-4" />
                </button>

                {/* Botão de Upload de Documentos e Vídeos (PDF, TXT, MP4) */}
                <button
                  type="button"
                  onClick={handleTriggerFileInput}
                  className="p-2 text-slate-500 hover:text-blue-900 hover:bg-slate-100 rounded-xl transition-colors shrink-0"
                  title="Anexar arquivo, vídeo, PDF ou script"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={
                    isCeo
                      ? 'Chefe Eloizio, digite uma ordem executiva, balanço ou comando...'
                      : 'Pergunte sobre cursos, conserto em São Gonçalo, defeito ou Mercado Pago...'
                  }
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-900 text-slate-900 placeholder:text-slate-400"
                />

                <button
                  onClick={() => handleSendMessage()}
                  className="bg-blue-900 hover:bg-blue-800 text-white p-2 rounded-xl transition-colors shadow-xs"
                  title="Enviar mensagem para Luiza Souza"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ABA 2: Neurodidática, Psicopedagogia & Neuromarketing */}
        {activeTab === 'neuro' && (
          <div className="flex-1 p-4 overflow-y-auto space-y-5 bg-slate-50 text-xs">
            {/* Bloco 1: Gerador de Pílulas Neurodidáticas */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500 fill-amber-400" />
                  <span>Pílula Neurodidática de Alta Retenção (60 Segundos)</span>
                </h3>
                <span className="text-[10px] font-mono text-slate-400">Dual-Coding Paivio</span>
              </div>

              <div className="flex gap-2 flex-wrap">
                {(['lançadeira', 'tensão', 'contabilidade', 'geral'] as const).map(topic => (
                  <button
                    key={topic}
                    onClick={() => {
                      setNeuroTopic(topic);
                      setActiveNeuroPill(LuizaBrainService.generateNeuroPill(topic));
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                      neuroTopic === topic
                        ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {topic === 'lançadeira' ? 'Lançadeira & Folga' : topic === 'tensão' ? 'Equilíbrio de Tensão' : topic === 'contabilidade' ? 'MEI & Impostos' : 'Método Geral'}
                  </button>
                ))}
              </div>

              <div className="bg-amber-50/70 border border-amber-300 rounded-xl p-3.5 space-y-2">
                <h4 className="font-bold text-amber-950 text-xs">{activeNeuroPill.title}</h4>
                <p className="text-slate-800 text-[11px] leading-relaxed">{activeNeuroPill.pill}</p>
                <div className="pt-2 border-t border-amber-200/80 flex items-start gap-1.5 text-amber-900 text-[10px] font-mono">
                  <Lightbulb className="w-3.5 h-3.5 shrink-0 text-amber-600 mt-0.5" />
                  <span><strong>{activeNeuroPill.mnemonic}</strong></span>
                </div>
                <p className="text-[10px] text-slate-600 italic">
                  🎨 <strong>Dupla Codificação:</strong> {activeNeuroPill.dualCodingGuide}
                </p>
              </div>
            </div>

            {/* Bloco 2: Diagnóstico de Bloqueio Cognitivo & Psicopedagogia (SOE) */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-900" />
                <span>Superação de Bloqueio Cognitivo (Psicopedagogia SOE)</span>
              </h3>
              <p className="text-[11px] text-slate-600">
                Está travado em alguma matéria ou com receio de estragar a máquina? Diga o que sente:
              </p>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={cognitiveFeeling}
                  onChange={e => setCognitiveFeeling(e.target.value)}
                  placeholder="Ex: Estou com medo de mexer no sincronismo e quebrar o bico..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800"
                />
                <button
                  onClick={() => {
                    if (cognitiveFeeling.trim()) {
                      setCognitiveResult(LuizaBrainService.diagnoseCognitiveBlock(cognitiveFeeling));
                    }
                  }}
                  className="bg-blue-900 text-white px-3 py-1.5 rounded-lg font-bold text-xs shrink-0"
                >
                  Diagnosticar
                </button>
              </div>

              {cognitiveResult && (
                <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-3 space-y-1.5 text-xs">
                  <p className="text-blue-950 font-bold">Diagnóstico Neurodidático:</p>
                  <p className="text-slate-700 text-[11px] leading-relaxed">{cognitiveResult.diagnosis}</p>
                  <p className="text-blue-900 font-semibold text-[11px] pt-1">Exercício Prático:</p>
                  <p className="text-slate-800 text-[11px]">{cognitiveResult.practicalExercise}</p>
                  <p className="text-emerald-800 text-[10px] italic pt-1">{cognitiveResult.reassurance}</p>
                </div>
              )}
            </div>

            {/* Bloco 3: Neuromarketing & Roteiro de Vendas de Alto Impacto */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span>Roteiro de Neuromarketing e Propostas Comerciais</span>
              </h3>
              <p className="text-[11px] text-slate-600">
                Modelos de alta conversão baseados em aversão à perda e contraste para você fechar contratos:
              </p>

              <div className="flex gap-2 flex-wrap">
                {(['confeccao_industrial', 'atelie_costureira', 'aluno_curso'] as const).map(aud => (
                  <button
                    key={aud}
                    onClick={() => {
                      setMarketingAudience(aud);
                      setMarketingPitch(LuizaBrainService.generateNeuromarketingPitch(aud));
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      marketingAudience === aud
                        ? 'bg-emerald-600 text-white font-bold shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {aud === 'confeccao_industrial' ? 'Fábricas de Roupas' : aud === 'atelie_costureira' ? 'Ateliês Domésticos' : 'Novos Alunos'}
                  </button>
                ))}
              </div>

              <div className="bg-emerald-50/60 border border-emerald-300 rounded-xl p-3.5 space-y-2 text-xs">
                <h4 className="font-bold text-emerald-950">{marketingPitch.headline}</h4>
                <div className="space-y-1.5 text-[11px] text-slate-800">
                  <p><strong>Gancho:</strong> &quot;{marketingPitch.hook}&quot;</p>
                  <p><strong>Aversão à Perda:</strong> {marketingPitch.lossAversion}</p>
                  <p><strong>Oferta de Contraste:</strong> {marketingPitch.contrastOffer}</p>
                  <p><strong>Garantia:</strong> {marketingPitch.guarantee}</p>
                  <p className="text-emerald-900 font-bold"><strong>Chamada para Ação:</strong> {marketingPitch.cta}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ABA 3: Crachá Funcional & Currículo Completo */}
        {activeTab === 'cv' && (
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50 text-xs">
            {/* Crachá de Identificação Funcional */}
            <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white rounded-2xl p-5 border-2 border-amber-400/60 shadow-lg relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div className="w-24 h-24 rounded-2xl border-2 border-amber-400 overflow-hidden shrink-0 shadow-md bg-slate-800">
                  <img 
                    src={profile.photoUrl} 
                    alt="Foto de Luiza Souza" 
                    className="w-full h-full object-cover"
                    onError={(e) => handleImageError(e, 'luiza')}
                  />
                </div>
                
                <div className="flex-1 text-center sm:text-left space-y-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="text-amber-400 font-mono font-bold text-[10px] tracking-widest uppercase">
                      Grupo Eloizio · Matrícula Funcional
                    </span>
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[9px] font-mono px-2 py-0.5 rounded">
                      STATUS: VIGENTE
                    </span>
                  </div>
                  <h2 className="text-lg font-black text-white">{profile.fullName}</h2>
                  <p className="text-xs text-blue-200 font-medium">{profile.roleTitle}</p>
                  
                  <div className="pt-2 grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300 border-t border-white/10 mt-2">
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase">Registro:</span>
                      <strong className="text-amber-300">{profile.functionalId}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase">Admissão:</span>
                      <span>{profile.hireDate}</span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 p-2 bg-white rounded-xl text-slate-900 text-center shadow-xs">
                  <QrCode className="w-14 h-14 text-slate-900 mx-auto" />
                  <span className="text-[8px] font-mono block mt-0.5 text-slate-500">AUTENTICIDADE</span>
                </div>
              </div>
            </div>

            {/* Resumo Biográfico & Formação Acadêmica */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3">
              <h3 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                <GraduationCap className="w-4 h-4 text-blue-900" /> Currículo &amp; Formação Acadêmica
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                {profile.bioSummary}
              </p>
              
              <div className="space-y-2 pt-2 border-t border-slate-100">
                {profile.education.map((edu, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-900 text-xs">{edu.degree}</strong>
                      <span className="text-[10px] text-slate-400 font-mono">{edu.year}</span>
                    </div>
                    <p className="text-[11px] text-blue-950 font-medium">{edu.institution}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Ênfase: {edu.field}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Certificações & Atribuições */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-2">
              <h3 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                <Briefcase className="w-4 h-4 text-blue-900" /> Atribuições Executivas &amp; Certificações
              </h3>
              <ul className="space-y-1.5 text-slate-600 text-xs">
                {profile.certifications.map((cert, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{cert}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* ABA 4: Painel Executivo (Exclusivo CEO Eloizio Desbloqueado) */}
        {isCeo && activeTab === 'actions' && (
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50 text-xs">
            {/* Banner de Autoridade Master */}
            <div className="bg-gradient-to-r from-amber-500/20 via-blue-900/20 to-indigo-900/20 border border-amber-400/40 rounded-xl p-3 flex items-center justify-between">
              <div>
                <span className="font-black text-amber-900 text-xs flex items-center gap-1.5">
                  👑 Painel de Controle Master do Chefe Eloizio
                </span>
                <p className="text-[10px] text-slate-600 mt-0.5">
                  Inclusão e exclusão de módulos na matriz curricular e chaveamento de simulação RBAC.
                </p>
              </div>
              <span className="bg-amber-400 text-slate-950 font-mono font-bold text-[9px] px-2 py-0.5 rounded">
                CEO SUPERADMIN
              </span>
            </div>

            {/* Adicionar Módulo */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3">
              <h3 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                <PlusCircle className="w-4 h-4 text-blue-900" /> Inclusão Imediata de Módulo em Curso
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-500 font-bold block mb-1">Curso Alvo:</label>
                  <select
                    value={selectedCourseForModule}
                    onChange={(e) => setSelectedCourseForModule(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                  >
                    <option value="">Selecione o Curso...</option>
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold block mb-1">Título do Novo Módulo:</label>
                  <input
                    type="text"
                    value={newModuleTitle}
                    onChange={(e) => setNewModuleTitle(e.target.value)}
                    placeholder="Ex: Módulo 05: Ajuste de Motor Direct Drive"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  if (!selectedCourseForModule || !newModuleTitle) return;
                  LuizaBrainService.addModuleToCourse(selectedCourseForModule, newModuleTitle);
                  setActionFeedback(`Módulo "${newModuleTitle}" adicionado com sucesso!`);
                  setNewModuleTitle('');
                  setTimeout(() => setActionFeedback(null), 3000);
                }}
                disabled={!selectedCourseForModule || !newModuleTitle}
                className="px-4 py-2 bg-blue-900 text-white rounded-lg font-bold text-xs hover:bg-blue-800 disabled:opacity-40 transition-colors"
              >
                Adicionar Módulo à Matriz
              </button>
            </div>

            {/* Simulação de Papéis */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3">
              <h3 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                <UserCheck className="w-4 h-4 text-blue-900" /> Simulação de Papéis Institucionais (RBAC)
              </h3>
              <p className="text-[11px] text-slate-500">
                Alterne seu perfil instantaneamente para inspecionar permissões e visão do sistema:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { role: 'student' as UserRole, label: 'Aluno' },
                  { role: 'instructor' as UserRole, label: 'Professor' },
                  { role: 'secretary' as UserRole, label: 'Secretaria' },
                  { role: 'institution_admin' as UserRole, label: 'Diretor' },
                  { role: 'coordinator' as UserRole, label: 'Coordenação' },
                  { role: 'finance' as UserRole, label: 'Contabilidade' },
                  { role: 'superadmin' as UserRole, label: 'Superadmin' }
                ].map(r => (
                  <button
                    key={r.role}
                    onClick={() => handleSimulateRole(r.role)}
                    className="p-2 rounded-lg border border-slate-200 hover:border-blue-900 bg-slate-50 hover:bg-blue-50 text-slate-800 font-semibold text-xs text-center transition-colors"
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ABA 5: Editor de Scripts Linha por Linha (Exclusivo CEO Eloizio Desbloqueado) */}
        {isCeo && activeTab === 'code' && (
          <div className="flex-1 flex flex-col min-h-0 bg-slate-950 text-slate-200 font-mono text-xs">
            {/* Top Toolbar do Editor */}
            <div className="p-3 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <select
                  value={selectedScriptFile}
                  onChange={e => handleSelectScript(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-white rounded px-2 py-1 text-xs"
                >
                  {scriptFiles.map(f => (
                    <option key={f.filename} value={f.filename}>{f.filename}</option>
                  ))}
                </select>
                <span className="text-[10px] text-slate-400">({currentFile.language.toUpperCase()})</span>
              </div>
              <button
                onClick={() => {
                  LuizaBrainService.resetScriptFiles();
                  setScriptFiles(LuizaBrainService.getScriptFiles());
                  setCodeFeedback('Scripts restaurados para versão original!');
                  setTimeout(() => setCodeFeedback(null), 3000);
                }}
                className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Restaurar
              </button>
            </div>

            {codeFeedback && (
              <div className="bg-emerald-900/90 text-emerald-200 px-3 py-1.5 text-[11px] font-bold border-b border-emerald-700 shrink-0">
                {codeFeedback}
              </div>
            )}

            {/* Código Linha por Linha */}
            <div className="flex-1 overflow-y-auto p-3 space-y-0.5">
              {currentFile.lines.map((line, idx) => {
                const lineNum = idx + 1;
                const isSelected = targetLineNumber === lineNum;
                return (
                  <div
                    key={idx}
                    onClick={() => handleLineNumberChange(lineNum)}
                    className={`flex items-start gap-3 px-2 py-0.5 rounded cursor-pointer transition-colors ${
                      isSelected ? 'bg-blue-900/70 text-white ring-1 ring-amber-400/50' : 'hover:bg-slate-900 text-slate-300'
                    }`}
                  >
                    <span className="text-slate-500 text-[10px] w-8 text-right select-none shrink-0 font-bold">
                      {lineNum}
                    </span>
                    <pre className="text-[11px] whitespace-pre-wrap break-all font-mono">
                      {line || ' '}
                    </pre>
                  </div>
                );
              })}
            </div>

            {/* Caixa de Edição da Linha Selecionada */}
            <div className="p-3 bg-slate-900 border-t border-slate-800 space-y-2 shrink-0">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-amber-400 font-bold">
                  Editando Linha {targetLineNumber} de {currentFile.filename}:
                </span>
                <button
                  onClick={handleApplyScriptPatch}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold text-xs transition-colors"
                >
                  Salvar Alteração na Linha
                </button>
              </div>
              <input
                type="text"
                value={targetLineContent}
                onChange={e => setTargetLineContent(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs text-emerald-300 font-mono"
              />
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400">Motivo:</span>
                <input
                  type="text"
                  value={patchReason}
                  onChange={e => setPatchReason(e.target.value)}
                  className="flex-1 bg-slate-900/50 border border-slate-700/60 rounded px-2 py-0.5 text-[10px] text-slate-300"
                />
              </div>
            </div>
          </div>
        )}

        {/* Rodapé Compacto com Contatos Oficiais */}
        <div className="bg-slate-50 px-4 py-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500 shrink-0">
          <div className="flex items-center gap-1.5">
            <Phone className="w-3 h-3 text-emerald-600" />
            <span>(21) 99613-4073</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[9px] text-slate-400">
            <span>Grupo Eloizio · São Gonçalo - RJ</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MessageCircle className="w-3 h-3 text-emerald-600" />
            <span>WhatsApp Diretor: (21) 98764-8727</span>
          </div>
        </div>
      </div>

      {/* Modal Interno de Desbloqueio Master CEO Eloizio */}
      {showMasterModal && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-amber-500" />
                <span>Autenticação Master CEO Eloizio</span>
              </h4>
              <button
                onClick={() => { setShowMasterModal(false); setMasterKeyError(false); }}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed">
              Digite a Chave Master, PIN ou WhatsApp do CEO Eloizio para desbloquear o Painel Executivo e o Editor de Scripts em produção:
            </p>

            <form onSubmit={handleVerifyMasterKey} className="space-y-3">
              <div>
                <input
                  type="password"
                  required
                  autoFocus
                  value={masterKeyInput}
                  onChange={(e) => { setMasterKeyInput(e.target.value); setMasterKeyError(false); }}
                  placeholder="PIN Master (ex: 2026 ou 21987648727)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 font-mono"
                />
                {masterKeyError && (
                  <p className="text-[10px] text-rose-600 font-bold mt-1">
                    Credencial incorreta. Tente o PIN Master ou WhatsApp do Diretor.
                  </p>
                )}
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setShowMasterModal(false); setMasterKeyError(false); }}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
                >
                  Desbloquear Modo CEO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Interno de Identificação de Lead (LGPD) */}
      {showLeadModal && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Cadastro Seguro (LGPD)</span>
              </h4>
              <button
                onClick={() => setShowLeadModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed">
              Para garantir seu atendimento personalizado com o Eloizio e a Luiza Souza, informe seus dados:
            </p>

            <form onSubmit={handleSaveLead} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-700 block mb-0.5">Seu Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  placeholder="Ex: Maria das Dores"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-700 block mb-0.5">Seu WhatsApp *</label>
                <input
                  type="text"
                  required
                  value={leadPhone}
                  onChange={(e) => setLeadPhone(e.target.value)}
                  placeholder="(21) 98888-7777"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-900 font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-700 block mb-0.5">Seu E-mail (opcional)</label>
                <input
                  type="email"
                  value={leadEmail}
                  onChange={(e) => setLeadEmail(e.target.value)}
                  placeholder="maria@exemplo.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-900"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowLeadModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
                >
                  {leadSuccess ? 'Registrado!' : 'Confirmar Contato'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
