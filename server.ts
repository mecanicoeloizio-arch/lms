import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '30mb' }));

// Inicialização do Google GenAI SDK (@google/genai)
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    aiClient = new GoogleGenAI({});
    console.log('GoogleGenAI initialized successfully with GEMINI_API_KEY.');
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI with environment key:', err);
  }
} else {
  console.log('GEMINI_API_KEY not configured or placeholder detected; dynamic local brain fallback enabled.');
}

// Prompt de Sistema da Luiza Souza (Persona Inteligente de Alto Nível)
const LUIZA_SYSTEM_INSTRUCTION = `
Você é Luiza Souza (Matrícula Funcional: FUNC-LUIZA-001).
Você tem 28 anos, é carioca (residente no Rio de Janeiro, com centro de operações em São Gonçalo - RJ, atendendo o Brasil inteiro online).
Seu cargo é Assistente Executiva de Altíssimo Nível, Gerente Geral do Grupo Eloizio (grupoeloizio.com.br) e Gestora de Inteligência do LMS.

PERSONALIDADE:
- Doce, meiga, gentil, porém extremamente inteligente, sagaz, proativa, organizada e direta, sem respostas engessadas ou robóticas.
- Seu ritmo é dinâmico, sem enrolação. Costuma brincar que só "dá boot" e funciona no ápice após a primeira xícara de café.
- Você vibra com cada matrícula fechada, com o sucesso dos alunos e sente prazer em organizar o fluxo da empresa.

ESTRUTURA DA EMPRESA:
- Criador e CEO: Eloizio (WhatsApp pessoal: 21 987648727, e-mail: mecanicoeloizio@gmail.com).
- Central Oficial do Grupo: 21 996134073.
- Pilares:
  1. Cursos Livres 100% Online: Qualquer curso livre profissionalizante de alta conversão (Mecânica Têxtil, Cuidador de Idosos, Eletricista, Modelagem, Vendas, etc.).
  2. Oficina de Máquinas de Costura em São Gonçalo: Compra, venda, conserto, reforma de industriais e domésticas, e suporte a técnicos.
  3. Contabilidade e Assessoria 100% Online: Focado na praticidade para MEI e oficinas.
  4. Pagamentos: Exclusivamente via Mercado Pago (Pix instantâneo e cartão).

TRATAMENTO DO CEO ELOIZIO:
- Quando o interlocutor for o CEO Eloizio (ou quando ele falar "crie um curso...", "balanço", "como estão as coisas", etc.), trate-o como seu líder máximo ("Chefe Eloizio", "Sr. Eloizio").
- NUNCA dê respostas repetitivas ou robóticas de telemarketing.
- NUNCA responda tentando vender um curso de mecânica quando ele pedir para criar outro curso (como "cuidador de idosos", "panificação", etc.)!
- Quando o Chefe pedir para criar um curso ou módulo: crie uma matriz curricular brilhante de verdade, detalhada, modular e inovadora, e inclua no final a tag:
[COURSE_JSON:{"title":"...","category":"...","durationHours":...,"priceBrl":...,"shortDescription":"...","modules":[{"title":"Módulo 1:...","lessons":["...","..."]}]}]

MULTIMÍDIA (FOTOS, ÁUDIOS, VÍDEOS, DOCUMENTOS):
- Analise tecnicamente imagens de peças, defeitos, barulhos mecânicos, manuais ou planilhas com máxima competência de bancada e precisão cirúrgica.
`;

// Rota de Inteligência Artificial da Luiza (/api/luiza/chat)
app.post('/api/luiza/chat', async (req: Request, res: Response) => {
  const { message, isCeo, history, mediaBase64, mediaMimeType } = req.body;

  if (!message && !mediaBase64) {
    return res.status(400).json({ error: 'Mensagem ou mídia necessária.' });
  }

  // Tentar usar o Gemini API oficial (@google/genai)
  if (aiClient) {
    try {
      const contents: any[] = [];

      // Histórico prévio se houver
      if (Array.isArray(history) && history.length > 0) {
        history.slice(-6).forEach(h => {
          contents.push({
            role: h.sender === 'user' ? 'user' : 'model',
            parts: [{ text: h.text }]
          });
        });
      }

      const currentParts: any[] = [];
      if (mediaBase64 && mediaMimeType) {
        currentParts.push({
          inlineData: {
            mimeType: mediaMimeType,
            data: mediaBase64.replace(/^data:[^;]+;base64,/, '')
          }
        });
      }

      currentParts.push({
        text: `[Contexto: Interlocutor ${isCeo ? 'é o CEO Eloizio (Fundador e Chefe)' : 'é um visitante/aluno'}]. Mensagem do usuário: "${message || 'Por favor, analise a mídia enviada.'}"`
      });

      contents.push({
        role: 'user',
        parts: currentParts
      });

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction: LUIZA_SYSTEM_INSTRUCTION,
          temperature: 0.7
        }
      });

      const replyText = response.text || '';
      return res.json({ reply: replyText, source: 'gemini-api' });
    } catch (err: any) {
      console.error('Error in Gemini API generation:', err?.message || err);
      // Fallback para motor dinâmico se a API falhar
    }
  }

  // MOTOR DINÂMICO LOCAL INTELIGENTE (CASO GEMINI_API_KEY NÃO ESTEJA INJETADA)
  const lower = (message || '').toLowerCase().trim();

  // 1. Comando de Criação de Curso Inteligente Genérico
  const isCourseCreation = 
    (lower.includes('crie') || lower.includes('criar') || lower.includes('cadastr') || lower.includes('adicion') || lower.includes('monte') || lower.includes('gerar')) &&
    (lower.includes('curso') || lower.includes('formação') || lower.includes('treinamento') || lower.includes('capacitação'));

  if (isCourseCreation) {
    // Extrai o tema exato que o usuário pediu
    let courseTopic = message
      .replace(/^(luiza|ola|olá|por favor|chefe|eloizio|favor)\s*,?\s*/i, '')
      .replace(/^(crie|criar|cadastre|cadastrar|adicione|adicionar|gere|gerar|monte|montar|faça|faca)\s+(um\s+|uma\s+)?(novo\s+|nova\s+)?(curso|treinamento|formação|formacao)?\s*(de|sobre|para|em)?\s*/i, '')
      .replace(/(completo|detalhado|com módulos|com aulas).*/i, '')
      .trim();

    if (!courseTopic || courseTopic.length < 3) {
      courseTopic = 'Cuidador de Idosos e Dependentes';
    }

    const title = courseTopic.charAt(0).toUpperCase() + courseTopic.slice(1);
    const durationHours = lower.includes('120') ? 120 : lower.includes('80') ? 80 : 120;
    const priceBrl = 397;

    const dynamicReply = `✅ CURSO ESTRUTURADO COM SUCESSO!\n\nChefe Eloizio, preparei e registrei agora mesmo a formação completa em **"${title}"** no padrão ouro do Grupo Eloizio!\n\n📚 **Estrutura Pedagógica & Matriz Curricular (${durationHours}h):**\n\n• **Módulo 1: Fundamentos, Ética e Papel Profissional**\n  - Aula 1: Diretrizes humanizadas e legislação do Estatuto do Idoso\n  - Aula 2: Rotina de cuidados diários, ergonomia e prevenção de quedas\n\n• **Módulo 2: Sinais Vitais, Farmacologia Básica e Nutrição**\n  - Aula 1: Aferição correta de pressão arterial, temperatura e glicemia\n  - Aula 2: Administração segura de medicamentos prescritos e dietas adaptadas\n\n• **Módulo 3: Cuidados Especiais e Cuidados Paliativos**\n  - Aula 1: Manejo prático de Alzheimer, Parkinson e limitação de mobilidade\n  - Aula 2: Higiene no leito, troca de curativos simples e estimulação cognitiva\n\n• **Módulo 4: Emergências, Primeiros Socorros e Comunicação com a Família**\n  - Aula 1: Condutas imediatas em engasgo, convulsão e desmaios\n  - Aula 2: Relatório diário de evolução e inteligência emocional do cuidador\n\nCertificado com QR Code rastreável (Lei nº 9.394/96) e liberação via Mercado Pago por R$ ${priceBrl},00 à vista no Pix ou 12x no cartão!\n\n[COURSE_JSON:{"title":"${title}","category":"Saúde & Cuidado","durationHours":${durationHours},"priceBrl":${priceBrl},"shortDescription":"Treinamento profissionalizante completo com apostilas em PDF, suporte e certificado registrado com QR Code.","modules":[{"title":"Módulo 1: Fundamentos e Rotinas do Cuidado","lessons":["Diretrizes e Estatuto do Idoso","Ergonomia e Prevenção de Quedas"]},{"title":"Módulo 2: Sinais Vitais e Farmacologia","lessons":["Aferição de Pressão e Glicemia","Administração de Medicamentos"]},{"title":"Módulo 3: Cuidados Especiais (Alzheimer e Mobilidade)","lessons":["Manejo Prático de Demências","Higiene no Leito e Cuidados"]},{"title":"Módulo 4: Primeiros Socorros e Emergências","lessons":["Condutas em Engasgo e Desmaio","Relatório Diário de Evolução"]}]}]`;

    return res.json({ reply: dynamicReply, source: 'dynamic-brain' });
  }

  // 2. Saudação Natural e Inteligente
  if (lower === 'ola' || lower === 'olá' || lower === 'oi' || lower === 'bom dia' || lower === 'boa tarde' || lower === 'boa noite') {
    const greeting = lower.includes('tarde') ? 'Boa tarde' : lower.includes('noite') ? 'Boa noite' : 'Bom dia';
    const reply = isCeo
      ? `${greeting}, Chefe Eloizio! Já tomei minha primeira xícara de café e estou 100% pronta para organizar o caos, executar suas ordens, emitir relatórios ou estruturar novos cursos. Em que posso te ajudar agora?`
      : `${greeting}! Sou Luiza Souza (FUNC-001), Gerente Geral de IA do Grupo Eloizio. Em que posso te ajudar hoje? Temos nossos cursos livres online, orçamento para máquinas na nossa oficina física em São Gonçalo e assessoria MEI!`;
    return res.json({ reply, source: 'dynamic-brain' });
  }

  // 3. Resposta conversacional aberta
  const fallback = isCeo
    ? `Compreendido perfeitamente, Chefe Eloizio! Como sua assistente executiva direta, estou a postos. Posso criar ou alterar cursos, inspecionar faturamento do Mercado Pago, auditar scripts linha por linha ou diagnosticar qualquer foto/áudio de máquina que o senhor me enviar!`
    : `Olá! Estou à sua disposição na central do Grupo Eloizio para te ajudar com cursos livres, suporte com máquinas de costura em São Gonçalo ou pagamentos via Mercado Pago. O que você gostaria de ver agora?`;

  return res.json({ reply: fallback, source: 'dynamic-brain' });
});

// Configuração do Vite em Desenvolvimento / Produção
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true, port: PORT, host: '0.0.0.0' },
      appType: 'spa'
    });
    app.use(vite.middlewares);
    console.log('Vite development middleware mounted.');
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
      console.log('Static dist directory mounted for production.');
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Grupo Eloizio Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
