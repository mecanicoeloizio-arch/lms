# LMS Profissional Completo & Plataforma Educacional Grupo Eloizio

Plataforma de ensino a distância (LMS) modular, segura e responsiva em português brasileiro (PT-BR), com gestão acadêmica integral, área do aluno mobile-first, certificados com QR Code verificável, integração financeira oficial com Mercado Pago (Pix e cartões) e pacote de exportação em PHP + PostgreSQL pronto para o servidor.

> [!IMPORTANT]
> **Decisões Críticas de Arquitetura & Implantação**:
> - **Ambiente Híbrido e Exportável**: A aplicação roda com React 19, TypeScript, Tailwind CSS e backend Node/Express com PostgreSQL/SQLite para operação imediata, e inclui uma ferramenta integrada de **Exportação para Servidor** contendo todos os scripts estruturados em **PHP 8+ (PDO, cURL), HTML5, CSS puro, jQuery e scripts DDL PostgreSQL** para cópia e cola no servidor de produção.
> - **Identidade Visual**: Sistema padrão customizado para o **Grupo Eloizio** (Cursos Livres, Mecânica e Gestão), com motor multi-instituição (white-label) permitindo alternar logotipos, nomes e cores institucionais.
> - **Financeiro Mercado Pago**: Suporte duplo com **Simulador Sandbox/Testes** (para testar pedidos, aprovação de Pix instantânea, recusas e webhooks repetidos) e **Modo Produção/Credenciais Reais** configuráveis via variáveis de ambiente seguras.

---

## 1. Visão Geral & Conceito Central

- **O que faz**: Oferece uma solução acadêmica de ponta a ponta para instituições de ensino e cursos livres, cobrindo desde a matrícula e checkout transparente via Mercado Pago, consumo de aulas com liberação progressiva, avaliações com banco de questões e notas, até a emissão e validação pública de certificados, carteirinhas de estudante e crachás com QR Code.
- **Público-Alvo**:
  - Alunos (aprendizado contínuo, celular e computador).
  - Professores / Instrutores (gestão de aulas, notas, frequência e correção de provas).
  - Coordenadores Acadêmicos e Secretaria (matrículas, histórico acadêmico, turmas e documentos).
  - Equipe Financeira (gestão de pedidos, conciliação Pix/Cartão, inadimplência e reembolsos).
  - Administradores e Superadministradores (configuração de instituição, usuários e permissões).
- **Proposta de Valor**: Automação segura do ciclo educacional com conformidade LGPD, controle de acesso estrito (RBAC) e portabilidade para servidor LAMP/LEMP com PostgreSQL.

---

## 2. Experiência do Usuário & Design Visual

### Diretrizes de Design & Anti-Slop
- **Mobile-First Real**: Layout otimizado para larguras de 320px até 1920px. Em smartphones, gavetas inferiores (bottom sheets) e menus off-canvas para ações rápidas; em tablets e desktops, barra lateral colapsável com navegação clara.
- **Tipografia e Cores (60-30-10)**:
  - Fundo Canvas (60%): Slate neutro suave (`#F8FAFC` no modo claro, `#0F172A` no modo escuro).
  - Superfícies Estruturais (30%): Cartões brancos (`#FFFFFF`) com divisores sutis de 1px (`#E2E8F0`), sem cartões aninhados com múltiplas sombras.
  - Acentos de Ação (10%): Azul Marinho Profissional Eloizio (`#1E3A8A`) e Azul Safira (`#2563EB`), com acentos de aprovação em Esmeralda (`#059669`) e alerta em Âmbar (`#D97706`).
  - Tipografia: *Plus Jakarta Sans* para títulos e interface geral, combinado com números tabulares (`tabular-nums` / *IBM Plex Mono*) para notas, moedas em BRL e códigos de validação.
- **Zero-Pill Discipline**: Metadados (carga horária, data, status) apresentados em texto limpo com separadores tipográficos (`·` ou `/`), reservando botões e abas apenas para controles interativos.

### Jornadas do Usuário Principais
1. **Jornada do Aluno**:
   - Login seguro -> Painel do Aluno -> "Continuar de onde parei" -> Player de Aula (vídeo, material de apoio em PDF/anexos, checklist de conclusão).
   - Realização de Prova (temporizador, questões de múltipla escolha e discursivas, envio e nota imediata).
   - Conquista de Certificado -> Visualização em alta resolução -> Download em PDF/impressão -> Verificação do QR Code.
2. **Jornada do Administrador / Secretaria / Financeiro**:
   - Dashboard com KPIs reais (faturamento BRL, alunos ativos, taxa de conclusão, pendências financeiras).
   - Gestão de Cursos e Turmas -> Cadastro modular de disciplinas, aulas e pré-requisitos.
   - Gestão Financeira -> Acompanhamento de transações do Mercado Pago, estornos e liberação manual de matrículas quando necessário.
   - Emissão de Documentos e Validação Pública.

---

## 3. Matriz de Permissões (RBAC)

| Perfil | Acesso aos Cursos | Notas e Frequência | Emissão Documentos | Financeiro & Checkout | Configurações Globais |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Superadministrador** | Total (cria/edita/remove) | Total | Total + Revogação | Total + Conciliação | Total + Multi-tenancy |
| **Admin da Instituição** | Instituição atual | Total | Total | Relatórios & Pedidos | Instituição atual |
| **Coordenador** | Gestão de turmas e matriz | Visualizar e homologar | Emissão e consulta | Não permitido | Apenas acadêmico |
| **Professor / Instrutor** | Seus cursos e aulas | Lançar notas e presenças | Consulta de alunos | Não permitido | Perfil pessoal |
| **Financeiro** | Apenas consulta | Não permitido | Consulta de adimplência | Gestão total de pagamentos | Gateways e regras de preço |
| **Secretaria** | Matrículas e turmas | Histórico escolar | Emissão e registro | Consulta de pendências | Apenas cadastro de alunos |
| **Aluno** | Cursos matriculados | Suas notas e progresso | Seus certificados e carteirinha | Seus pedidos e faturas | Dados pessoais e avatar |

---

## 4. Arquitetura Técnica & Modelo de Dados

### Diagrama de Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       INTERFACE RESPONSIVA (React 19)                       │
│  ┌─────────────────┐  ┌──────────────────┐  ┌────────────────────────────┐  │
│  │ Portal do Aluno │  │ Painel de Gestão │  │ Verificador Público de     │  │
│  │ (Player, Provas,│  │ (Cursos, Turmas, │  │ Certificados & Carteirinhas│  │
│  │ Certificados)   │  │ Notas, Financeiro│  │ (Validação instantânea)    │  │
│  └────────┬────────┘  └────────┬─────────┘  └─────────────┬──────────────┘  │
└───────────┼────────────────────┼──────────────────────────┼─────────────────┘
            ▼                    ▼                          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                     CAMADA DE SERVIÇOS & CONTROLADORES                      │
│  ┌───────────────────────┐ ┌───────────────────────┐ ┌───────────────────┐  │
│  │ Auth & RBAC Security  │ │ Motor Acadêmico & LTI │ │ Mercado Pago SDK  │  │
│  │ (JWT, Sessões, LGPD)  │ │ (Progresso, Provas)   │ │ (Pix, Webhooks)   │  │
│  └───────────────────────┘ └───────────────────────┘ └───────────────────┘  │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      BANCO DE DADOS RELACIONAL POSTGRESQL                   │
│  users · roles · institutions · courses · modules · lessons · enrollments   │
│  assessments · questions · certificates · orders · transactions · logs      │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    GERADOR DE EXPORTAÇÃO PHP + SQL                          │
│  Gera pacote zip/cópia com conexao.php (PDO), controllers, views em HTML5/ │
│  jQuery/CSS e scripts DDL PostgreSQL prontos para o servidor do cliente.    │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Entidades do Banco de Dados Relacional (PostgreSQL)
1. `institutions`: id, name, slug, logo_url, primary_color, document_cnpj, phone, email, created_at.
2. `users`: id, institution_id, name, email, password_hash, role (enum), document_cpf, phone, avatar_url, active, created_at.
3. `courses`: id, institution_id, category, title, description, modality (livre, profissionalizante, tecnico), duration_hours, price_brl, status (draft, published, archived), image_url, created_at.
4. `course_modules`: id, course_id, title, sort_order, unlock_days.
5. `lessons`: id, module_id, title, description, video_url, duration_minutes, sort_order, is_free_preview.
6. `lesson_materials`: id, lesson_id, title, file_url, file_type, file_size_bytes.
7. `enrollments`: id, user_id, course_id, status (active, completed, blocked, cancelled), progress_percent, enrolled_at, completed_at.
8. `lesson_progress`: id, enrollment_id, lesson_id, completed (bool), completed_at, last_time_seconds.
9. `assessments`: id, course_id, title, passing_grade, max_attempts, time_limit_minutes, randomize_questions.
10. `questions`: id, assessment_id, question_text, question_type (multiple_choice, true_false, essay), score_points.
11. `question_options`: id, question_id, option_text, is_correct.
12. `assessment_attempts`: id, user_id, assessment_id, score, passed, started_at, finished_at.
13. `certificates`: id, enrollment_id, user_id, course_id, validation_code (unique), qr_code_url, issued_at, revoked (bool), revocation_reason.
14. `student_cards`: id, user_id, enrollment_id, registration_number, valid_until, validation_code.
15. `orders`: id, user_id, course_id, amount_brl, status (pending, approved, rejected, refunded), payment_method (pix, credit_card, boleto), mp_preference_id, mp_payment_id, created_at.
16. `transactions`: id, order_id, mp_payment_id, status, status_detail, raw_payload, idempotency_key, created_at.
17. `audit_logs`: id, user_id, action, target_table, target_id, ip_address, created_at.

---

## 5. Módulos & Fases de Implementação

### Módulo 1: Fundação, Design System e Controle de Acesso (RBAC)
- Estrutura completa de navegação responsiva (Top bar contract, sidebar colapsável, drawer mobile).
- Troca de perfil dinâmica para auditoria e teste (Superadmin, Admin Instituição, Coordenador, Professor, Aluno, Financeiro, Secretaria).
- Gestão de perfil, preferências de exibição e proteção de rotas conforme permissões.

### Módulo 2: Gestão Acadêmica Completa (Cursos, Turmas e Aulas)
- Catálogo de cursos com modalidades configuráveis (Cursos Livres, Mecânica e Manutenção de Máquinas, Contabilidade Online, etc.).
- Editor de módulos, aulas com suporte a vídeo (YouTube, Vimeo, MP4), PDFs e materiais de apoio.
- Matrículas, liberação progressiva de aulas e controle de pré-requisitos.
- Banco de questões, gerador de provas com sorteio, temporizador, notas automáticas e frequência.

### Módulo 3: Portal do Aluno & Player de Aula Focado
- Dashboard do estudante com indicador de progresso geral e recente.
- Player de aula imersivo com navegação lateral expansível, marcação de aula concluída e sincronização de progresso.
- Minhas notas, avaliações realizadas e histórico de frequência.
- Suporte interativo com a persona **Camilla Faria** (assistente executiva do Grupo Eloizio) para acolher e orientar o aluno.

### Módulo 4: Documentos Oficiais (Certificados, Carteirinhas e Crachás)
- Emissão de certificados com número de série alfanumérico único, carga horária, assinaturas digitais e layout gráfico profissional pronto para impressão/PDF.
- Carteirinha de estudante com foto, QR Code e dados acadêmicos.
- Crachá institucional para técnicos e colaboradores.
- Página pública de validação de autenticidade acessível via QR Code ou digitação do código.
- Registro auditável de cancelamento e reemissão com histórico preservado.

### Módulo 5: Financeiro & Integração Mercado Pago
- Checkout transparente e catálogo de preços com valores em BRL.
- Geração de Pix dinâmico com QR Code em tempo real e código Copia e Cola.
- Cartão de crédito e simulação de status (Pendente, Aprovado, Recusado, Reembolsado).
- Simulador de Webhook com verificação de idempotência para garantir que notificações repetidas não dupliquem matrículas.
- Painel financeiro com conciliação, extrato e relatórios de vendas.

### Módulo 6: Central de Exportação para o Servidor (PHP + PostgreSQL)
- Visualizador e exportador de código-fonte pronto para cópia e cola:
  - `config/database.php`: Conexão PDO segura com PostgreSQL e tratamento de exceções.
  - `controllers/`: Controladores em PHP puro com cURL para Mercado Pago e consultas preparadas.
  - `views/`: Telas em HTML5 limpo, CSS responsivo e jQuery moderno.
  - `schema.sql`: Script DDL PostgreSQL com todas as tabelas, índices e constraints para importação direta no banco do servidor.
- Documentação passo a passo de implantação no servidor.

### Módulo 7: Suíte de Testes Automatizados e Evidências
- Painel de testes de ponta a ponta executáveis na interface:
  - Teste de autenticação e barreira de permissões RBAC.
  - Teste de fluxo de matrícula e progressão de aulas.
  - Teste de cálculo de notas e geração de certificado.
  - Teste de validação pública do QR Code.
  - Teste de idempotência do Webhook do Mercado Pago.
  - Teste de responsividade nas larguras de 320px a 1920px.

---

## 6. Verificação e Critérios de Aceite

1. **Responsividade**: Verificada em 320px, 375px, 768px, 1024px e 1440px sem transbordamento horizontal.
2. **Segurança**: Permissões estritas por perfil; tentativa de acesso indevido bloqueada com feedback amigável.
3. **Persistência**: Progresso do aluno, notas, pedidos e certificados salvos e consistentes.
4. **Mercado Pago**: Pix gerado com sucesso, webhook processado de forma idempotente e matrícula liberada após aprovação.
5. **Portabilidade**: Scripts PHP/SQL íntegros, prontos para download e cópia para o servidor do cliente.
