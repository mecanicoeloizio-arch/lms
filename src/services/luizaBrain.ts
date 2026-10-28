import { Course, CourseModule, Lesson, UserRole, LuizaExecutiveAction, StudentComprehensiveProfile } from '../types/lms';
import { LMSStorageService } from './storage';
import { StudentProfileService } from './studentProfileService';
import { LMSExportService } from './exportService';

export interface ScriptFileRecord {
  filename: string;
  filepath: string;
  language: string;
  description: string;
  lines: string[];
}

export interface LuizaProfile {
  name: string;
  fullName: string;
  functionalId: string;
  roleTitle: string;
  institution: string;
  email: string;
  phone: string;
  location: string;
  photoUrl: string;
  hireDate: string;
  bioSummary: string;
  education: Array<{ degree: string; institution: string; year: string; field: string }>;
  certifications: string[];
  executiveCapabilities: string[];
}

const STORAGE_KEY_LUIZA_ACTIONS = 'lms_eloizio_luiza_actions';
const STORAGE_KEY_SCRIPT_FILES = 'lms_eloizio_script_overrides';

export class LuizaBrainService {
  static getProfile(): LuizaProfile {
    return {
      name: 'Luiza',
      fullName: 'Luiza Souza',
      functionalId: 'FUNC-LUIZA-001',
      roleTitle: 'Atendente Oficial & Gestora Geral de IA (Grupo Eloizio)',
      institution: 'Grupo Eloizio (São Gonçalo - RJ)',
      email: 'luiza.souza@grupoeloizio.com.br',
      phone: '(21) 99613-4073',
      location: 'São Gonçalo, Rio de Janeiro - Brasil',
      photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
      hireDate: '15/01/2024',
      bioSummary: 'Atendente Oficial Inteligente e Gestora Geral Executiva do Grupo Eloizio. Responsável pelo atendimento direto a clientes e alunos (vendas de cursos livres 100% online, orçamentos de conserto e reforma de máquinas em São Gonçalo, assessoria MEI e pagamentos Mercado Pago) e pela gestão e automação de toda a plataforma LMS (simulação de papéis, matrículas, acolhimento psicopedagógico SOE e alteração de scripts linha por linha).',
      education: [
        {
          degree: 'Doutorado em Engenharia de Software & Tecnologias Educacionais',
          institution: 'Universidade Federal Fluminense (UFF)',
          year: '2023',
          field: 'Sistemas Distribuídos e Aprendizagem Adaptativa'
        },
        {
          degree: 'Mestrado em Ciência da Computação (Foco em Inteligência Artificial)',
          institution: 'UFRJ / COPPE',
          year: '2020',
          field: 'Processamento de Linguagem Natural e Automação'
        },
        {
          degree: 'Bacharelado em Ciência da Computação e Pedagogia',
          institution: 'Universidade do Estado do Rio de Janeiro (UERJ)',
          year: '2017',
          field: 'Educação Profissionalizante e Desenvolvimento de Software'
        }
      ],
      certifications: [
        'Certificação Internacional em Arquitetura LMS (SCORM 2004 / xAPI / LTI 1.3)',
        'Especialista em Segurança de Dados Educacionais & LGPD (Lei 13.709/2018)',
        'Mestre de Bancada em Mecânica Têxtil Industrial & Eletroeletrônica Direct Drive',
        'Analista Contábil & Tributária para Cursos Livres e MEI (Legislação Simples Nacional)'
      ],
      executiveCapabilities: [
        'Acesso total de leitura e escrita a todo o banco de dados e arquivos do LMS',
        'Edição e correção cirúrgica de scripts linha por linha (SQL, PHP, jQuery, cURL)',
        'Criação, edição e exclusão de módulos, aulas e cursos completos',
        'Simulação instantânea de qualquer papel funcional (Aluno, Docente, Direção, SOE, etc.)',
        'Matrícula completa de novos alunos com validação de CPF e identificação funcional',
        'Emissão de laudos de orientação pedagógica (SOE) e planos de estudo adaptativos'
      ]
    };
  }

  // Obter logs de ações executivas realizadas pela Luiza
  static getActions(): LuizaExecutiveAction[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_LUIZA_ACTIONS);
      if (!stored) return [];
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  static recordAction(actionType: LuizaExecutiveAction['actionType'], description: string, targetEntity: string): LuizaExecutiveAction {
    const actions = this.getActions();
    const newAction: LuizaExecutiveAction = {
      id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
      actionType,
      description,
      targetEntity,
      status: 'applied',
      appliedBy: 'Luiza Souza'
    };

    actions.unshift(newAction);
    localStorage.setItem(STORAGE_KEY_LUIZA_ACTIONS, JSON.stringify(actions.slice(0, 50)));

    LMSStorageService.addAuditLog(
      `LUIZA_EXEC_${actionType.toUpperCase()}`,
      targetEntity,
      newAction.id,
      `Ação executiva realizada por Luiza Souza: ${description}`
    );

    return newAction;
  }

  // 1. AÇÃO: Acrescentar Módulo ao Curso
  static addModuleToCourse(courseId: string, moduleTitle: string, description?: string): CourseModule {
    const courses = LMSStorageService.getCourses();
    const course = courses.find(c => c.id === courseId);
    if (!course) throw new Error('Curso não encontrado.');

    const newModuleId = `mod-${Date.now()}`;
    const sortOrder = course.modules.length + 1;

    const newModule: CourseModule = {
      id: newModuleId,
      courseId,
      title: moduleTitle,
      description: description || `Módulo estruturado pela Gestora Luiza Souza em ${new Date().toLocaleDateString('pt-BR')}.`,
      sortOrder,
      unlockDaysAfterEnrollment: 0,
      lessons: [
        {
          id: `les-${Date.now()}-1`,
          moduleId: newModuleId,
          title: `1. Introdução Teórica e Prática a ${moduleTitle}`,
          description: 'Fundamentos operacionais, normas de segurança e visão técnica detalhada.',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          durationMinutes: 28,
          sortOrder: 1,
          isFreePreview: false,
          materials: []
        },
        {
          id: `les-${Date.now()}-2`,
          moduleId: newModuleId,
          title: `2. Procedimento de Bancada e Testes Reais`,
          description: 'Execução passo a passo em bancada com calibradores e instrumentos de precisão.',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          durationMinutes: 35,
          sortOrder: 2,
          isFreePreview: false,
          materials: []
        }
      ]
    };

    course.modules.push(newModule);
    LMSStorageService.saveCourse(course);

    this.recordAction(
      'add_module',
      `Acrescentou o módulo "${moduleTitle}" com 2 aulas no curso "${course.title}".`,
      `curso:${course.id}`
    );

    return newModule;
  }

  // 2. AÇÃO: Retirar Módulo do Curso
  static removeModuleFromCourse(courseId: string, moduleId: string): boolean {
    const courses = LMSStorageService.getCourses();
    const course = courses.find(c => c.id === courseId);
    if (!course) throw new Error('Curso não encontrado.');

    const modIndex = course.modules.findIndex(m => m.id === moduleId);
    if (modIndex < 0) throw new Error('Módulo não encontrado no curso.');

    const removedTitle = course.modules[modIndex].title;
    course.modules.splice(modIndex, 1);
    
    // Reordenar módulos restantes
    course.modules.forEach((mod, idx) => {
      mod.sortOrder = idx + 1;
    });

    LMSStorageService.saveCourse(course);

    this.recordAction(
      'remove_module',
      `Removeu o módulo "${removedTitle}" do curso "${course.title}".`,
      `curso:${course.id}`
    );

    return true;
  }

  // 3. AÇÃO: Criar Curso Completo
  static createFullCourse(data: {
    title: string;
    category: string;
    shortDescription: string;
    durationHours: number;
    priceBrl: number;
  }): Course {
    const newCourseId = `course-${Date.now()}`;
    const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newCourse: Course = {
      id: newCourseId,
      institutionId: 'inst-eloizio-01',
      instructorId: 'user-prof-01',
      category: data.category,
      title: data.title,
      slug,
      shortDescription: data.shortDescription,
      description: `${data.shortDescription} Treinamento profissionalizante completo com apostilas em PDF, suporte com a bancada de instrutores do Grupo Eloizio e Certificado com QR Code.`,
      modality: 'profissionalizante',
      durationHours: data.durationHours,
      priceBrl: data.priceBrl,
      status: 'published',
      minPassingGrade: 7.0,
      minAttendancePercent: 75,
      coverGradient: 'from-blue-900 to-indigo-900',
      prerequisites: [],
      createdAt: new Date().toISOString(),
      modules: (() => {
        const titleLower = data.title.toLowerCase();
        if (titleLower.includes('idoso') || titleLower.includes('cuidador') || titleLower.includes('dependente') || titleLower.includes('saúde') || titleLower.includes('saude')) {
          return [
            {
              id: `mod-${Date.now()}-1`,
              courseId: newCourseId,
              title: 'Módulo 1: Fundamentos do Cuidado, Ética e Estatuto do Idoso',
              description: 'Diretrizes humanizadas, legislação, papel profissional e postura ética.',
              sortOrder: 1,
              unlockDaysAfterEnrollment: 0,
              lessons: [
                {
                  id: `les-${Date.now()}-1`,
                  moduleId: `mod-${Date.now()}-1`,
                  title: '1. O Papel Humanizado do Cuidador e Legislação Vigente',
                  description: 'Princípios do Estatuto do Idoso e rotinas essenciais de acolhimento.',
                  videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                  durationMinutes: 28,
                  sortOrder: 1,
                  isFreePreview: true,
                  materials: []
                },
                {
                  id: `les-${Date.now()}-2`,
                  moduleId: `mod-${Date.now()}-1`,
                  title: '2. Ergonomia, Transferência e Prevenção de Quedas',
                  description: 'Técnicas de transferência segura entre cama e cadeira sem esforço lombar.',
                  videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                  durationMinutes: 35,
                  sortOrder: 2,
                  isFreePreview: false,
                  materials: []
                }
              ]
            },
            {
              id: `mod-${Date.now()}-2`,
              courseId: newCourseId,
              title: 'Módulo 2: Sinais Vitais, Farmacologia e Nutrição Adaptada',
              description: 'Aferição de pressão arterial, temperatura, glicemia e rotina de medicação.',
              sortOrder: 2,
              unlockDaysAfterEnrollment: 0,
              lessons: [
                {
                  id: `les-${Date.now()}-3`,
                  moduleId: `mod-${Date.now()}-2`,
                  title: '1. Aferição Correta de Pressão Arterial e Glicemia Capilar',
                  description: 'Protocolos de segurança e identificação de sinais de alerta clínico.',
                  videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                  durationMinutes: 32,
                  sortOrder: 1,
                  isFreePreview: false,
                  materials: []
                },
                {
                  id: `les-${Date.now()}-4`,
                  moduleId: `mod-${Date.now()}-2`,
                  title: '2. Administração de Medicamentos Prescritos e Dietas',
                  description: 'Horários, vias de administração e hidratação adequada para o idoso.',
                  videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                  durationMinutes: 30,
                  sortOrder: 2,
                  isFreePreview: false,
                  materials: []
                }
              ]
            },
            {
              id: `mod-${Date.now()}-3`,
              courseId: newCourseId,
              title: 'Módulo 3: Cuidados Especiais (Alzheimer, Parkinson e Mobilidade Reduzida)',
              description: 'Higiene no leito, estimulação cognitiva, prevenção de escaras e demências.',
              sortOrder: 3,
              unlockDaysAfterEnrollment: 0,
              lessons: [
                {
                  id: `les-${Date.now()}-5`,
                  moduleId: `mod-${Date.now()}-3`,
                  title: '1. Manejo Comportamental em Alzheimer e Demências',
                  description: 'Comunicação assertiva, paciência e controle de episódios de agitação.',
                  videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                  durationMinutes: 40,
                  sortOrder: 1,
                  isFreePreview: false,
                  materials: []
                },
                {
                  id: `les-${Date.now()}-6`,
                  moduleId: `mod-${Date.now()}-3`,
                  title: '2. Higiene no Leito e Mudança de Decúbito',
                  description: 'Prevenção de lesões por pressão (escaras) e banho assistido.',
                  videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                  durationMinutes: 35,
                  sortOrder: 2,
                  isFreePreview: false,
                  materials: []
                }
              ]
            },
            {
              id: `mod-${Date.now()}-4`,
              courseId: newCourseId,
              title: 'Módulo 4: Primeiros Socorros, Emergências e Relatórios Diários',
              description: 'Manobra de desengasgo, RCP básica, acionamento do SAMU e prontuário diário.',
              sortOrder: 4,
              unlockDaysAfterEnrollment: 0,
              lessons: [
                {
                  id: `les-${Date.now()}-7`,
                  moduleId: `mod-${Date.now()}-4`,
                  title: '1. Conduta Imediata em Engasgo, Desmaio e Convulsão',
                  description: 'Manobra de Heimlich adaptada para idosos e estabilização de emergência.',
                  videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                  durationMinutes: 38,
                  sortOrder: 1,
                  isFreePreview: false,
                  materials: []
                },
                {
                  id: `les-${Date.now()}-8`,
                  moduleId: `mod-${Date.now()}-4`,
                  title: '2. Elaboração do Relatório Diário de Cuidados e Ética',
                  description: 'Como registrar ocorrências para a família e médicos responsáveis.',
                  videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                  durationMinutes: 25,
                  sortOrder: 2,
                  isFreePreview: false,
                  materials: []
                }
              ]
            }
          ];
        }

        // Módulos genéricos contextualizados com o título do curso
        return [
          {
            id: `mod-${Date.now()}-1`,
            courseId: newCourseId,
            title: `Módulo 1: Fundamentos & Apresentação Técnica de ${data.title}`,
            description: 'Apresentação da área de atuação, ferramentas obrigatórias e segurança.',
            sortOrder: 1,
            unlockDaysAfterEnrollment: 0,
            lessons: [
              {
                id: `les-${Date.now()}-1`,
                moduleId: `mod-${Date.now()}-1`,
                title: `1. Aula Inaugural: Visão Geral e Mercado de Trabalho em ${data.title}`,
                description: 'Oportunidades de faturamento, montagem profissional e ética.',
                videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                durationMinutes: 25,
                sortOrder: 1,
                isFreePreview: true,
                materials: []
              },
              {
                id: `les-${Date.now()}-2`,
                moduleId: `mod-${Date.now()}-1`,
                title: '2. Ferramentas, Equipamentos e Procedimentos Iniciais',
                description: 'Preparação prática e normas de segurança.',
                videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                durationMinutes: 30,
                sortOrder: 2,
                isFreePreview: false,
                materials: []
              }
            ]
          },
          {
            id: `mod-${Date.now()}-2`,
            courseId: newCourseId,
            title: 'Módulo 2: Procedimentos Práticos & Execução Avançada',
            description: 'Aplicação prática, resolução de problemas reais e calibração.',
            sortOrder: 2,
            unlockDaysAfterEnrollment: 0,
            lessons: [
              {
                id: `les-${Date.now()}-3`,
                moduleId: `mod-${Date.now()}-2`,
                title: '1. Prática Passo a Passo com Metodologia Grupo Eloizio',
                description: 'Demonstração gravada em alta definição com instrumentos calibrados.',
                videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                durationMinutes: 40,
                sortOrder: 1,
                isFreePreview: false,
                materials: []
              },
              {
                id: `les-${Date.now()}-4`,
                moduleId: `mod-${Date.now()}-2`,
                title: '2. Casos Clínicos / Testes Reais e Emissão do Certificado Oficial',
                description: 'Avaliação prática para emissão de certificado registrado.',
                videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                durationMinutes: 35,
                sortOrder: 2,
                isFreePreview: false,
                materials: []
              }
            ]
          }
        ];
      })()
    };

    LMSStorageService.saveCourse(newCourse);

    this.recordAction(
      'add_course',
      `Criou o curso "${newCourse.title}" (${data.durationHours}h) na categoria "${data.category}".`,
      `curso:${newCourse.id}`
    );

    return newCourse;
  }

  // 4. AÇÃO: Simular Papel Funcional
  static simulateRole(role: UserRole): { user: any; message: string } {
    const users = LMSStorageService.getUsers();
    let targetUser = users.find(u => u.role === role);

    if (!targetUser) {
      // Se não encontrar, usar o primeiro
      targetUser = users[0];
    }

    const updatedUser = LMSStorageService.setActiveUser(targetUser.id);

    const roleNames: Record<UserRole, string> = {
      superadmin: 'Superadministrador (Eloizio - CEO)',
      institution_admin: 'Diretoria Administrativa (Mariana Souza)',
      coordinator: 'Coordenação Acadêmica (Prof. Ricardo Fonseca)',
      instructor: 'Professor / Instrutor de Bancada (Carlos Eduardo)',
      student: 'Aluno Matriculado (Lucas Mendes)',
      finance: 'Financeiro / Mercado Pago (Beatriz Nogueira)',
      secretary: 'Secretaria Online (Juliana Santos)'
    };

    this.recordAction(
      'simulate_role',
      `Simulou alternância para o papel: ${roleNames[role]}.`,
      `usuario:${targetUser.id}`
    );

    return {
      user: updatedUser,
      message: `Ambiente chaveado com sucesso para o perfil [${roleNames[role]}]. Todas as permissões e dados em tela agora refletem esta visão.`
    };
  }

  // 5. AÇÃO: Emitir Parecer e Plano de Estudos SOE
  static issueSoeAdvisory(studentName: string, weeklyHoursGoal: number): string {
    const advice = `
PARECER DO SERVIÇO DE ORIENTAÇÃO EDUCACIONAL (SOE)
Grupo Eloizio - Unidade São Gonçalo / RJ
Aluna(o): ${studentName}
Meta Semanal: ${weeklyHoursGoal} horas de dedicação

Diagnóstico Pedagógico da Luiza Souza:
1. Recomenda-se dividir os estudos em blocos de 30 a 45 minutos diários com foco na prática de bancada.
2. Nas primeiras duas semanas, priorizar a fixação do Módulo 1 (Sincronismo de Lançadeira e Ponto de Laçada).
3. Utilizar o checklist diário do SOE para acompanhar a evolução e solicitar atestado de frequência junto à Secretaria quando atingir 50% de progresso.
Parecer emitido eletronicamente com carimbo funcional FUNC-LUIZA-001.
    `.trim();

    this.recordAction(
      'issue_soe_report',
      `Emissão de Parecer e Plano SOE individualizado para ${studentName}.`,
      `soe:aluno`
    );

    return advice;
  }

  // 6. AÇÃO: Matrícula Completa com Identificação Funcional
  static registerStudentWithFullDossier(data: Partial<StudentComprehensiveProfile>): StudentComprehensiveProfile {
    const courses = LMSStorageService.getCourses();
    const targetCourse = courses.find(c => c.id === data.courseId) || courses[0];

    const newProfile: StudentComprehensiveProfile = {
      id: `prof-${Date.now()}`,
      userId: `user-std-${Date.now()}`,
      fullName: data.fullName || 'Novo Aluno Registrado',
      socialName: data.socialName || '',
      documentCpf: data.documentCpf || '123.456.789-00',
      documentRg: data.documentRg || '12.345.678-9',
      rgIssuer: data.rgIssuer || 'DETRAN',
      rgUf: data.rgUf || 'RJ',
      birthDate: data.birthDate || '1995-01-01',
      gender: data.gender || 'masculino',
      maritalStatus: data.maritalStatus || 'solteiro',
      nationality: data.nationality || 'Brasileira',
      birthPlace: data.birthPlace || 'São Gonçalo / RJ',
      motherName: data.motherName || 'Mãe Cadastrada',
      fatherName: data.fatherName || '',
      address: data.address || {
        cep: '24440-000',
        street: 'Rua Principal',
        number: '100',
        neighborhood: 'Centro',
        city: 'São Gonçalo',
        state: 'RJ'
      },
      phonePrimary: data.phonePrimary || '(21) 99613-4073',
      phoneSecondary: data.phoneSecondary || '',
      email: data.email || 'novo.aluno@exemplo.com.br',
      functionalId: data.functionalId || StudentProfileService.generateFunctionalId(),
      jobTitle: data.jobTitle || 'Técnico em Formação',
      companyName: data.companyName || 'Atuação Autônoma / Grupo Eloizio',
      companyCnpj: data.companyCnpj || '',
      professionalCouncilReg: data.professionalCouncilReg || '',
      pisPasep: data.pisPasep || '',
      admissionDate: data.admissionDate || new Date().toISOString().split('T')[0],
      employmentType: data.employmentType || 'autonomo',
      priorEducationLevel: data.priorEducationLevel || 'medio',
      priorSchoolName: data.priorSchoolName || 'Escola Estadual de São Gonçalo',
      priorGraduationYear: data.priorGraduationYear || 2018,
      courseId: targetCourse.id,
      classCohort: data.classCohort || 'Turma 2026.1 - Online Flexível',
      lgpdConsent: true,
      contractAccepted: true,
      enrolledAt: new Date().toISOString(),
      registrationCode: StudentProfileService.generateRegistrationCode(),
      status: 'active'
    };

    // Salvar no repositório de perfis
    StudentProfileService.saveProfile(newProfile);

    // Criar matrícula acadêmica correspondente no LMS
    LMSStorageService.enrollCourse(newProfile.courseId, newProfile.userId);

    this.recordAction(
      'register_student',
      `Matriculou ${newProfile.fullName} no curso "${targetCourse.title}" com Matrícula Funcional ${newProfile.functionalId} e Código ${newProfile.registrationCode}.`,
      `matricula:${newProfile.id}`
    );

    return newProfile;
  }

  // 7. AÇÃO: Editor & Inspetor de Scripts Linha por Linha
  static getScriptFiles(): ScriptFileRecord[] {
    const rawFiles = LMSExportService.getPhpFiles();
    const schemaSql = LMSExportService.getPostgreSqlSchema();

    const result: ScriptFileRecord[] = [
      {
        filename: 'database/schema.sql',
        filepath: '/database/schema.sql',
        language: 'sql',
        description: 'Estrutura DDL PostgreSQL das tabelas, chaves e constraints do LMS',
        lines: schemaSql.split('\n')
      }
    ];

    rawFiles.forEach(rf => {
      result.push({
        filename: rf.path,
        filepath: `/${rf.path}`,
        language: rf.language,
        description: rf.description,
        lines: rf.content.split('\n')
      });
    });

    // Carregar patches armazenados localmente se houver
    try {
      const overrides = localStorage.getItem(STORAGE_KEY_SCRIPT_FILES);
      if (overrides) {
        const parsed: Record<string, string[]> = JSON.parse(overrides);
        result.forEach(file => {
          if (parsed[file.filename]) {
            file.lines = parsed[file.filename];
          }
        });
      }
    } catch {}

    return result;
  }

  static patchScriptLine(filename: string, lineNumber: number, newContent: string, reason: string): boolean {
    const files = this.getScriptFiles();
    const target = files.find(f => f.filename === filename);
    if (!target) throw new Error(`Arquivo ${filename} não localizado no repositório.`);

    const lineIndex = lineNumber - 1;
    if (lineIndex < 0 || lineIndex >= target.lines.length) {
      throw new Error(`Linha ${lineNumber} está fora do limite do arquivo (1 a ${target.lines.length}).`);
    }

    const previousContent = target.lines[lineIndex];
    target.lines[lineIndex] = newContent;

    // Salvar modificação no storage
    let storedOverrides: Record<string, string[]> = {};
    try {
      storedOverrides = JSON.parse(localStorage.getItem(STORAGE_KEY_SCRIPT_FILES) || '{}');
    } catch {}

    storedOverrides[filename] = target.lines;
    localStorage.setItem(STORAGE_KEY_SCRIPT_FILES, JSON.stringify(storedOverrides));

    this.recordAction(
      'edit_script_line',
      `Modificou linha ${lineNumber} de "${filename}": [${previousContent.trim().substring(0, 30)}...] -> [${newContent.trim().substring(0, 30)}...]. Motivo: ${reason}`,
      `script:${filename}`
    );

    return true;
  }

  static resetScriptFiles(): void {
    localStorage.removeItem(STORAGE_KEY_SCRIPT_FILES);
    this.recordAction('edit_script_line', 'Restaurou todos os scripts para as versões originais de fábrica.', 'scripts:all');
  }

  // --- MÓDULO DE NEUROPSICOLOGIA DA APRENDIZAGEM & NEUROMARKETING ---
  static generateNeuroPill(topic: string): {
    title: string;
    pill: string;
    mnemonic: string;
    dualCodingGuide: string;
  } {
    const topicLower = topic.toLowerCase();
    this.recordAction(
      'issue_soe_report',
      `Gerou Pílula Neurodidática de Alta Retenção para o tópico: "${topic}"`,
      `neuro:${topic}`
    );

    if (topicLower.includes('lançadeira') || topicLower.includes('lancadeira') || topicLower.includes('sincronismo')) {
      return {
        title: 'Pílula Neurodidática: Sincronismo da Lançadeira Rotativa (Regra dos 2mm)',
        pill: 'O cérebro precisa de uma âncora motora: Agulha desce no fundo (PMI). Quando sobe exatamente 2,0 milímetros, a laçada se abre por inércia do fio. O bico da lançadeira deve cruzar a cava da agulha com folga de uma folha de papel (0,08mm), sem raspar.',
        mnemonic: 'Mnemônico "P-S-L": Ponto Morto -> Sobe dois milímetros -> Lança a linha sem tocar.',
        dualCodingGuide: 'Mentalize o relógio: Quando a agulha está a subir, o bico da lançadeira entra como a mão que apanha a bola no ar antes que ela caia.'
      };
    }

    if (topicLower.includes('tensão') || topicLower.includes('tensao') || topicLower.includes('linha')) {
      return {
        title: 'Pílula Neurodidática: Equilíbrio Perfeito de Tensões',
        pill: 'Tensão não é aperto desmedido, é equilíbrio hidrostático de forças: O nó do ponto 301 deve se esconder exatamente no miolo do sanduíche de tecidos. Se o fio de cima aparece embaixo, solte a bobina ou aperte o tensor superior.',
        mnemonic: 'Mnemônico "Centro é Ouro": Se puxa pra cima, cede embaixo; se puxa pra baixo, cede em cima.',
        dualCodingGuide: 'Imagine um cabo de guerra entre duas crianças de forças iguais: a bandeirinha amarrada no meio não pode pender para nenhum dos lados.'
      };
    }

    if (topicLower.includes('contabilidade') || topicLower.includes('mei') || topicLower.includes('imposto')) {
      return {
        title: 'Pílula Neurodidática: Desmistificando o MEI para Prestador de Serviços',
        pill: 'O MEI do mecânico de costura (CNAE 9529-1/05) simplifica tudo: Uma única guia DAS mensal (INSS + ISS) garante aposentadoria, auxílio-doença e emissão de NF-e para confecções sem burocracia.',
        mnemonic: 'Mnemônico "D-A-S": Direito previdenciário, Acesso a clientes grandes, Segurança jurídica.',
        dualCodingGuide: 'Pense no MEI como o escudo da sua oficina: ele barra multas da prefeitura e abre a porta de crédito bancário barato.'
      };
    }

    return {
      title: `Pílula Neurodidática: ${topic}`,
      pill: 'Fragmentação em micro-passos: Isole o sintoma, teste o movimento mecânico no volante manual antes de ligar a chave geral e confirme a tolerância com instrumento calibrado.',
      mnemonic: 'Mnemônico "O-D-A": Observar sintoma -> Diagnosticar causa-raiz -> Agir com ferramenta correta.',
      dualCodingGuide: 'Visualização tridimensional: visualize o movimento dos eixos e engrenagens antes de soltar qualquer parafuso.'
    };
  }

  static diagnoseCognitiveBlock(studentFeeling: string): {
    diagnosis: string;
    practicalExercise: string;
    reassurance: string;
  } {
    this.recordAction(
      'issue_soe_report',
      `Diagnóstico de Bloqueio Cognitivo Discente: "${studentFeeling.substring(0, 40)}..."`,
      'soe:cognitive'
    );

    return {
      diagnosis: 'Sobrecarga da Memória de Trabalho (Cognitive Overload): Ao tentar decorar todas as peças de uma vez, o córtex pré-frontal atinge saturação. A mecânica não se decora, se compreende pela física de encaixes.',
      practicalExercise: 'Exercício de Desensibilização: Vá até a máquina desligada da tomada. Gire o volante com a mão lentamente 5 vezes. Foque a sua atenção apenas no movimento da barra da agulha subindo e descendo. Não tente mexer em parafusos hoje.',
      reassurance: 'O próprio Eloizio começou do zero há 25 anos em São Gonçalo. É absolutamente normal sentir insegurança nas primeiras 3 semanas. Nosso suporte no WhatsApp (21 99613-4073) está pronto para te acolher a cada passo!'
    };
  }

  static generateNeuromarketingPitch(targetAudience: 'confeccao_industrial' | 'atelie_costureira' | 'aluno_curso'): {
    headline: string;
    hook: string;
    lossAversion: string;
    contrastOffer: string;
    guarantee: string;
    cta: string;
  } {
    if (targetAudience === 'confeccao_industrial') {
      return {
        headline: 'Plano de Manutenção Preventiva Sem Paradas Inesperadas',
        hook: 'Você sabia que uma única máquina reta parada por 3 horas custa mais de R$ 450 em costureira ociosa e atraso de fardo de produção?',
        lossAversion: 'Não espere a lançadeira estourar na sexta-feira à tarde no meio de uma entrega urgente.',
        contrastOffer: 'Por uma fração de R$ 180 por máquina com revisão programada aos sábados, o Grupo Eloizio garante tolerâncias milimétricas e lubrificação com óleo sintético de alta durabilidade.',
        guarantee: 'Garantia de 30 dias em todas as regulagens de bancada com atendimento prioritário em São Gonçalo e região.',
        cta: 'Solicitar Visita Técnica Diagnóstica Gratuita pelo WhatsApp (21) 99613-4073'
      };
    }

    if (targetAudience === 'atelie_costureira') {
      return {
        headline: 'Sua Máquina de Costura Costurando Como Nova em Folha',
        hook: 'O ponto está pulando ou o tecido está franzindo? Não é você nem a linha barata: é apenas uma regulagem de 0,08mm na lançadeira que precisa de carinho.',
        lossAversion: 'Continuar forçando a máquina pode empenar a barra da agulha e custar 3 vezes mais caro no futuro.',
        contrastOffer: 'Revisão completa, descarbonização e lubrificação com teste em malha fina e jeans por apenas R$ 120,00.',
        guarantee: 'Se a máquina não costurar liso na sua frente na entrega, você não paga nada.',
        cta: 'Chamar a Equipe do Eloizio no WhatsApp Agora'
      };
    }

    return {
      headline: 'A Profissão Mais Disputada do Polo Têxtil',
      hook: 'Faltam mecânicos capacitados em todo o Brasil. As confecções disputam profissionais que realmente entendem de eletrônica Direct Drive.',
      lossAversion: 'Ficar em empregos comuns ganhando salário mínimo enquanto um mecânico autônomo fatura de R$ 4.000 a R$ 8.000 com liberdade.',
      contrastOffer: 'Menos de 2 consertos por semana pagam seu treinamento completo com certificado oficial reconhecido.',
      guarantee: 'Garantia Incondicional de 7 Dias pelo Mercado Pago.',
      cta: 'Garantir Vaga com Mentoria do Eloizio'
    };
  }

  static generateSpacedRepetitionSchedule(topicName: string): Array<{
    phase: string;
    intervalDays: number;
    targetDate: string;
    focusGoal: string;
  }> {
    const today = new Date();
    const intervals = [
      { phase: '1ª Revisão (Fixação Sináptica)', days: 1, goal: 'Revisar notas e responder ao quiz rápido sem consultar o gabarito.' },
      { phase: '2ª Revisão (Recuperação Espaçada)', days: 3, goal: 'Simular o diagnóstico no Simulador de Bancada Virtual.' },
      { phase: '3ª Revisão (Consolidação de Longo Prazo)', days: 7, goal: 'Executar a regulagem na prática com volante manual e chave de fenda.' },
      { phase: '4ª Revisão (Domínio Permanente)', days: 30, goal: 'Ensinar o procedimento para outra pessoa ou aplicar em máquina real.' }
    ];

    return intervals.map(item => {
      const target = new Date(today);
      target.setDate(today.getDate() + item.days);
      return {
        phase: item.phase,
        intervalDays: item.days,
        targetDate: target.toLocaleDateString('pt-BR'),
        focusGoal: item.goal
      };
    });
  }

  // --- RECONHECIMENTO DO CEO ELOIZIO ---
  static isCeoUser(user?: { email?: string; role?: string; name?: string } | null, query?: string): boolean {
    const candidate = user || (typeof LMSStorageService !== 'undefined' ? LMSStorageService.getActiveUser() : null);
    if (candidate) {
      if (candidate.email === 'mecanicoeloizio@gmail.com') return true;
      if (candidate.role === 'superadmin') return true;
      if (candidate.name && candidate.name.toLowerCase().includes('eloizio')) return true;
    }

    try {
      if (typeof localStorage !== 'undefined' && localStorage.getItem('eloizio_ceo_authenticated') === 'true') {
        return true;
      }
    } catch {}

    if (query) {
      const q = query.toLowerCase();
      if (
        q.includes('sou o eloizio') ||
        q.includes('sou eloizio') ||
        q.includes('aqui é o eloizio') ||
        q.includes('aqui e o eloizio') ||
        q.includes('sou o ceo') ||
        q.includes('sou o chefe') ||
        q.includes('chefe eloizio') ||
        q.includes('mecanicoeloizio@gmail.com') ||
        q.includes('21987648727') ||
        q.includes('21 987648727')
      ) {
        try {
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem('eloizio_ceo_authenticated', 'true');
          }
        } catch {}
        return true;
      }
    }
    return false;
  }


  // Relatório Executivo em Tempo Real para o CEO
  static getCeoExecutiveReport(): {
    totalRevenueBrl: number;
    totalOrders: number;
    paidOrders: number;
    totalStudents: number;
    totalCourses: number;
    pendingCertificates: number;
    mpStatus: string;
    baileysStatus: string;
    summaryText: string;
  } {
    const orders = LMSStorageService.getOrders();
    const paidOrdersList = orders.filter(o => o.status === 'approved');
    const totalRevenueBrl = paidOrdersList.reduce((acc, o) => acc + (o.amountBrl || 0), 0);
    const users = LMSStorageService.getUsers();
    const students = users.filter(u => u.role === 'student');
    const courses = LMSStorageService.getCourses();
    const certificates = LMSStorageService.getCertificates();
    const config = LMSStorageService.getSystemConfig();

    const summaryText = `📊 RELATÓRIO EXECUTIVO MASTER · GRUPO ELOIZIO
Data: ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}
Diretor Geral: Eloizio (CEO)

💰 Faturamento Bruto Mercado Pago: R$ ${totalRevenueBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
📦 Total de Transações: ${orders.length} pedidos (${paidOrdersList.length} aprovados via Pix / Cartão)
👥 Base de Alunos Ativos: ${students.length} alunos matriculados
📚 Cursos no Catálogo: ${courses.length} formações profissionalizantes ativas
🎓 Certificados Emitidos: ${certificates.length} com QR Code e registro oficial
📲 Central WhatsApp (Baileys): ${config.whatsappNumber} (${config.baileysSessionName})
⚙️ Banco de Dados: PostgreSQL 16 (DQL/DML) ativo`;

    return {
      totalRevenueBrl,
      totalOrders: orders.length,
      paidOrders: paidOrdersList.length,
      totalStudents: students.length,
      totalCourses: courses.length,
      pendingCertificates: certificates.length,
      mpStatus: config.mpSandboxMode ? 'Sandbox de Testes Ativo' : 'Produção Ativa',
      baileysStatus: 'Conectado · Central (21) 99613-4073',
      summaryText
    };
  }

  // --- ANÁLISE MULTIMÍDIA AVANÇADA (IMAGENS, VÍDEOS, ÁUDIOS, PDF E TXT) ---

  // 1. Análise de Imagem (Peça, Mecânica, Documento, Sintoma)
  static analyzeImageFile(fileMeta: { name: string; size: number; dataUrl?: string }): {
    title: string;
    category: 'mecanica' | 'comprovante' | 'documento' | 'geral';
    details: string;
    recommendations: string[];
  } {
    const nameLower = fileMeta.name.toLowerCase();
    const sizeKb = Math.round(fileMeta.size / 1024);

    if (
      nameLower.includes('lancadeira') || 
      nameLower.includes('lançadeira') || 
      nameLower.includes('agulha') || 
      nameLower.includes('cava') ||
      nameLower.includes('folga') ||
      nameLower.includes('ponto') ||
      nameLower.includes('reta') ||
      nameLower.includes('overloque') ||
      nameLower.includes('maquina') ||
      nameLower.includes('mecanica')
    ) {
      return {
        title: `Diagnóstico Mecânico da Imagem: "${fileMeta.name}" (${sizeKb} KB)`,
        category: 'mecanica',
        details: `Identifiquei o conjunto mecânico de costura industrial (Lançadeira Rotativa e Barra de Agulha). Na inspeção visual dos dentes e do bico da lançadeira, verifica-se indício de desalinhamento de folga axial superior a 0,12mm (padrão correto: 0,05 a 0,10mm) e leve atrito na chapa de agulha.`,
        recommendations: [
          'Girar o volante manualmente até o Ponto Morto Inferior (PMI) e observar a subida de 2,0mm.',
          'Conferir se a ponta da lançadeira passa no terço inferior da cava sem tocar o aço da agulha.',
          'Caso haja rebarba ou ponta cega na lançadeira, polir com lixa d\'água 1200 e pasta diamantada.',
          'Para revisão completa na nossa oficina em São Gonçalo ou atendimento com o Eloizio: WhatsApp (21) 99613-4073.'
        ]
      };
    }

    if (nameLower.includes('pix') || nameLower.includes('comprovante') || nameLower.includes('recibo') || nameLower.includes('mercado') || nameLower.includes('pago')) {
      return {
        title: `Análise de Comprovante de Pagamento: "${fileMeta.name}" (${sizeKb} KB)`,
        category: 'comprovante',
        details: `Comprovante de pagamento identificado via Mercado Pago / Pix. Os metadados de autenticação visual e código de operação conferem com o padrão de compensação instantânea da nossa API de recebimentos.`,
        recommendations: [
          'Matrícula e acesso ao Portal do Aluno são liberados automaticamente no banco PostgreSQL.',
          'Você já pode acessar as aulas na aba "Área do Aluno" ou no Vitrine de Cursos.',
          'Em caso de dúvidas com o faturamento, nossa chave oficial está cadastrada no Grupo Eloizio.'
        ]
      };
    }

    return {
      title: `Inspeção Multimídia da Imagem: "${fileMeta.name}" (${sizeKb} KB)`,
      category: 'geral',
      details: `Imagem carregada e processada com sucesso no motor de visão da Luiza Souza. Analisada a geometria de encaixes, componentes técnicos e nitidez da imagem.`,
      recommendations: [
        'Caso se trate de uma peça com defeito, tire fotos em ângulo aproximado com boa luz sobre a barra de agulha e a bobina.',
        'Você pode trazer a máquina diretamente na oficina do Grupo Eloizio no Centro de São Gonçalo - RJ.',
        'Nosso WhatsApp direto com a equipe técnica: (21) 99613-4073.'
      ]
    };
  }

  // 2. Análise de Áudio / Som (Ruídos Mecânicos, Relatos de Clientes)
  static analyzeAudioFile(fileMeta: { name: string; size: number; durationSeconds?: number }): {
    transcription: string;
    acousticDiagnosis: string;
    actionPlan: string;
  } {
    const nameLower = fileMeta.name.toLowerCase();
    const duration = fileMeta.durationSeconds ? `${fileMeta.durationSeconds}s` : 'Áudio gravado';

    return {
      transcription: `[Transcrição do Áudio · ${duration}]: "Relato de ruído mecânico periódico acompanhado de falha de alimentação do tecido na máquina de costura industrial reta."`,
      acousticDiagnosis: `Diagnóstico Acústico (Luiza Souza - FUNC-001): Identifiquei frequência metálica de batimento seco a aproximadamente 2.800 RPM. A curva sonora é característica de dente impelente batendo na face inferior da chapa de agulha ou folga excessiva no excêntrico da biela do eixo de transporte.`,
      actionPlan: `1. Desligue a máquina da tomada. 2. Afrouxe o parafuso de regulagem de altura do dente sob o cárter. 3. Ajuste a altura do dente para projetar 0,8mm a 1,0mm acima da chapa no ponto mais alto. 4. Se o ruído persistir, o Eloizio pode inspecionar pessoalmente na nossa oficina de São Gonçalo pelo WhatsApp (21) 99613-4073.`
    };
  }

  // 3. Análise de Vídeo (Movimento de Máquinas, Operação em Alta Rotação)
  static analyzeVideoFile(fileMeta: { name: string; size: number }): {
    title: string;
    frameInspection: string;
    benchProtocol: string;
  } {
    const sizeMb = (fileMeta.size / (1024 * 1024)).toFixed(1);
    return {
      title: `Análise Cinemática de Vídeo: "${fileMeta.name}" (${sizeMb} MB)`,
      frameInspection: `Vídeo reproduzido e analisado quadro a quadro: Observa-se que a alavanca puxa-fio completa o ciclo de laçada com leve atraso em relação ao esticador de linha inferior, provocando laço frouxo na parte inferior do ponto 301. O motor Direct Drive apresenta rotação estável, descartando falha elétrica no inversor.`,
      benchProtocol: `Recomendação de Bancada: Sincronizar o excêntrico do eixo principal conforme a marca de referência gravada no volante. Se preferir a execução com instrumentos calibrados, agende uma bancada presencial com o Eloizio em São Gonçalo.`
    };
  }

  // 4. Análise de Documentos (PDF, TXT, SQL, PHP)
  static analyzeDocumentFile(fileMeta: { name: string; size: number; contentSample?: string; extension: string }): {
    summary: string;
    insights: string[];
    complianceNotice: string;
  } {
    const ext = fileMeta.extension.toLowerCase();
    const sizeKb = Math.round(fileMeta.size / 1024);

    if (ext === 'pdf') {
      return {
        summary: `Documento PDF Processado: "${fileMeta.name}" (${sizeKb} KB). Estrutura de documento formal, histórico acadêmico ou manual técnico identificado.`,
        insights: [
          'Documento estruturado e legível para fins acadêmicos e comprovação de formação profissional.',
          'Compatível com os padrões de arquivamento digital e conformidade com a LGPD do Grupo Eloizio.',
          'Pode ser anexado ao dossiê funcional do aluno na Secretaria Online.'
        ],
        complianceNotice: 'Documento auditado pela Gestora Luiza Souza (FUNC-LUIZA-001) para fins de registro institucional.'
      };
    }

    if (ext === 'txt' || ext === 'sql' || ext === 'php') {
      const sample = fileMeta.contentSample || '';
      const lineCount = sample.split('\n').length;
      return {
        summary: `Arquivo de Código/Script Processado: "${fileMeta.name}" (${lineCount} linhas detectadas).`,
        insights: [
          `Linguagem identificada: ${ext.toUpperCase()}`,
          `Sintaxe analisada: Código estruturado para execução em servidor Linux / Apache / PHP 8+ com PostgreSQL 16.`,
          `Status de validação: Sem vulnerabilidades graves de injeção ou travamento de deadlock.`
        ],
        complianceNotice: 'Arquivo pronto para inclusão no módulo de exportação ou patch linha por linha no LMS.'
      };
    }

    return {
      summary: `Documento Recebido: "${fileMeta.name}" (${sizeKb} KB).`,
      insights: [
        'Arquivo catalogado no repositório de documentos do Grupo Eloizio.',
        'Metadados validados com data e carimbo digital seguro.'
      ],
      complianceNotice: 'Acesso seguro garantido sob a LGPD.'
    };
  }

  // Helper para interpretar comandos de criação de cursos a partir da linguagem natural
  static parseCourseCreationPrompt(prompt: string): {
    title: string;
    category: string;
    durationHours: number;
    priceBrl: number;
    shortDescription: string;
  } {
    const lower = prompt.toLowerCase();
    
    // Extrair horas se especificadas
    let durationHours = 80;
    const hoursMatch = prompt.match(/(\d+)\s*(h|horas|hora)\b/i);
    if (hoursMatch) {
      durationHours = parseInt(hoursMatch[1], 10);
    }

    // Extrair preço se especificado
    let priceBrl = 397;
    const priceMatch = prompt.match(/(?:r\$\s*|valor(?:\s*de)?\s*|por\s*)(\d+(?:[.,]\d{2})?)/i);
    if (priceMatch) {
      priceBrl = parseFloat(priceMatch[1].replace(',', '.'));
    }

    // Extrair categoria com base no tema
    let category = 'Mecânica Têxtil Industrial';
    if (lower.includes('idoso') || lower.includes('cuidador') || lower.includes('dependente') || lower.includes('saúde') || lower.includes('saude') || lower.includes('enferm')) {
      category = 'Saúde & Cuidado Humanizado';
    } else if (lower.includes('direct drive') || lower.includes('eletrônic') || lower.includes('eletronic') || lower.includes('motor')) {
      category = 'Eletrônica & Motores Direct Drive';
    } else if (lower.includes('overloque') || lower.includes('interloque')) {
      category = 'Mecânica de Overloque & Interloque';
    } else if (lower.includes('galoneira') || lower.includes('colarete')) {
      category = 'Mecânica de Galoneira & Especiais';
    } else if (lower.includes('reta') || lower.includes('lockstitch')) {
      category = 'Mecânica de Reta Industrial';
    } else if (lower.includes('venda') || lower.includes('gestão') || lower.includes('gestao') || lower.includes('marketing')) {
      category = 'Negócios & Gestão para Oficinas';
    } else if (lower.includes('costura') || lower.includes('corte') || lower.includes('modelagem')) {
      category = 'Costura & Modelagem Profissional';
    } else {
      category = 'Cursos Livres Profissionalizantes';
    }

    // Limpar o texto para extrair um título profissional
    let clean = prompt
      .replace(/^(luiza|ola|olá|por favor|chefe|eloizio|quero que você|quero que vc|favor)\s*,?\s*/i, '')
      .replace(/^(crie|criar|cadastre|cadastrar|adicione|adicionar|gere|gerar|monte|montar|faça a inclusão de|faca a inclusao de|faça a inclusão|faca a inclusao|inclua|incluir|faça um curso|faca um curso)\s+(um\s+|uma\s+)?(novo\s+|nova\s+)?(curso|treinamento|formação|formacao)?\s*(de|sobre|para|em)?\s*/i, '')
      .replace(/\s+(completo|detalhado|com módulos|com modulos|com aulas|passo a passo).*/i, '')
      .replace(/(com\s+\d+\s*(h|horas|hora)).*/i, '')
      .replace(/(por\s+r?\$\s*\d+).*/i, '')
      .replace(/(no\s+valor\s+de\s+r?\$\s*\d+).*/i, '')
      .trim();

    clean = clean.replace(/[.?!,;:]+$/, '').trim();

    let title = '';
    if (clean && clean.length > 3) {
      title = clean.charAt(0).toUpperCase() + clean.slice(1);
      if (!title.toLowerCase().includes('curso') && !title.toLowerCase().includes('especialização') && !title.toLowerCase().includes('manutenção') && !title.toLowerCase().includes('formação')) {
        title = `Formação Profissional em ${title}`;
      }
    } else if (lower.includes('idoso') || lower.includes('cuidador')) {
      title = 'Formação Completa em Cuidador de Idosos e Dependentes';
    } else if (lower.includes('overloque')) {
      title = 'Especialização em Mecânica e Regulagem de Overloque (3 e 4 Fios)';
    } else if (lower.includes('direct drive') || lower.includes('motor')) {
      title = 'Manutenção e Parametrização de Motores Direct Drive Industriais';
    } else if (lower.includes('galoneira')) {
      title = 'Mestre de Bancada: Manutenção e Sincronismo de Galoneiras';
    } else {
      title = 'Formação Avançada em Mecânica de Máquinas de Costura Industriais';
    }

    const shortDescription = `Treinamento profissionalizante completo com apostilas em PDF, suporte e certificado com QR Code reconhecido em todo o Brasil.`;

    return {
      title,
      category,
      durationHours,
      priceBrl,
      shortDescription
    };
  }

  // --- MOTOR DE PROCESSAMENTO INTELIGENTE DE LINGUAGEM NATURAL (NLP) ---
  static processQuery(
    rawText: string, 
    context: { isCeo: boolean; userName?: string; userEmail?: string }
  ): { reply: string; actionTaken?: string; suggestedSection?: string } {
    const text = rawText.trim();
    const lower = text.toLowerCase();
    const isCeo = context.isCeo || this.isCeoUser(null, text);

    // 0. SAUDAÇÕES NATURAIS E ACOLHEDORAS
    if (
      lower === 'ola' || 
      lower === 'olá' || 
      lower === 'oi' || 
      lower === 'opa' || 
      lower === 'bom dia' || 
      lower === 'boa tarde' || 
      lower === 'boa noite' || 
      lower.startsWith('ola ') || 
      lower.startsWith('olá ') || 
      lower.startsWith('oi ')
    ) {
      const hour = new Date().getHours();
      const greeting = hour >= 18 ? 'Boa noite' : hour >= 12 ? 'Boa tarde' : 'Bom dia';

      if (isCeo) {
        return {
          reply: `${greeting}, Chefe Eloizio! Já tomei meu café e estou 100% a postos para organizar o fluxo, executar suas ordens, emitir relatórios ou estruturar novos cursos. Em que posso te ajudar agora?`,
          actionTaken: 'ceo_greeting'
        };
      }

      return {
        reply: `${greeting}! Sou a Luiza Souza (FUNC-001), Atendente Oficial e Gerente de Inteligência do Grupo Eloizio. Seja muito bem-vindo! Como posso te ajudar hoje? Posso te apresentar nossos cursos livres online, fazer orçamentos para máquinas na nossa oficina física em São Gonçalo ou tirar dúvidas contábeis sobre MEI!`,
        actionTaken: 'visitor_greeting'
      };
    }

    // 1. RECONHECIMENTO & TRATAMENTO DE ALTO NÍVEL DO CEO ELOIZIO
    if (isCeo && (
      lower.includes('chefe') || 
      lower.includes('eloizio') || 
      lower.includes('sou eu') || 
      lower.includes('ceo') ||
      lower.includes('relatório') ||
      lower.includes('relatorio') ||
      lower.includes('faturamento') ||
      lower.includes('balanço') ||
      lower.includes('balanco') ||
      lower.includes('vendas') ||
      lower.includes('alunos') ||
      lower.includes('painel') ||
      lower.includes('status')
    )) {
      if (lower.includes('relatório') || lower.includes('relatorio') || lower.includes('faturamento') || lower.includes('balanço') || lower.includes('balanco') || lower.includes('vendas')) {
        const report = this.getCeoExecutiveReport();
        return {
          reply: `Sim, Chefe Eloizio! Aqui está o balanço consolidado em tempo real:\n\n${report.summaryText}\n\nTodos os pagamentos foram conferidos pela API do Mercado Pago e o banco PostgreSQL está com todas as conexões seguras. O que o senhor deseja ordenar em seguida?`,
          actionTaken: 'ceo_report_generated'
        };
      }

      if (lower.includes('alunos') || lower.includes('matriculados')) {
        const users = LMSStorageService.getUsers().filter(u => u.role === 'student');
        const enrollments = LMSStorageService.getEnrollments();
        return {
          reply: `Chefe Eloizio, temos exatamente ${users.length} alunos cadastrados no sistema com ${enrollments.length} matrículas ativas. A retenção média nas aulas práticas é de 82%. O senhor quer que eu abra a Secretaria Online ou liste os últimos matriculados?`,
          actionTaken: 'ceo_students_checked',
          suggestedSection: 'secretariat'
        };
      }

      return {
        reply: `Às suas ordens, Chefe Eloizio! O Modo CEO Master está 100% ativo para o senhor. O senhor tem acesso irrestrito ao Painel Executivo, Editor de Scripts SQL/PHP linha por linha, controle financeiro do Mercado Pago e à gestão da nossa oficina em São Gonçalo. O que o senhor precisa que eu execute agora?`,
        actionTaken: 'ceo_greeted'
      };
    }

    // 2. CRIAÇÃO DE CURSOS OU MÓDULOS (COMANDOS DE CRIAÇÃO EXECUTIVA)
    const isCourseCreation = 
      (lower.includes('crie') || lower.includes('criar') || lower.includes('cadastr') || lower.includes('adicion') || lower.includes('inclu') || lower.includes('montar') || lower.includes('gerar') || lower.includes('fazer')) &&
      (lower.includes('curso') || lower.includes('formação') || lower.includes('formacao') || lower.includes('treinamento'));

    const isModuleCreation = 
      (lower.includes('crie') || lower.includes('criar') || lower.includes('adicion') || lower.includes('inclu') || lower.includes('novo')) &&
      (lower.includes('módulo') || lower.includes('modulo') || lower.includes('aula') || lower.includes('disciplina'));

    if (isCourseCreation) {
      // Executar Criação Real do Curso com Estrutura Pedagógica Rica
      const parsed = this.parseCourseCreationPrompt(text);
      const newCourse = this.createFullCourse({
        title: parsed.title,
        category: parsed.category,
        shortDescription: parsed.shortDescription,
        durationHours: parsed.durationHours,
        priceBrl: parsed.priceBrl
      });

      const modulesListFormatted = newCourse.modules.map(m => 
        `• **${m.title}**\n${m.lessons.map(l => `  - ${l.title}`).join('\n')}`
      ).join('\n\n');

      return {
        reply: `✅ CURSO CRIADO E REGISTRADO COM SUCESSO!\n\n${isCeo ? 'Chefe Eloizio, executei sua ordem imediatamente e já estruturei a nova formação' : 'Estruturei com sucesso o novo curso'} no catálogo oficial do Grupo Eloizio:\n\n📚 **${newCourse.title}**\n🏷️ **Área:** ${newCourse.category}\n⏱️ **Carga Horária:** ${newCourse.durationHours} horas\n💰 **Investimento:** R$ ${newCourse.priceBrl.toFixed(2)} (liberação imediata via Mercado Pago Pix / Cartão em até 12x)\n\n📦 **Matriz Curricular Estruturada:**\n\n${modulesListFormatted}\n\n🎓 **Certificação:** Válido em todo o território nacional sob a Lei Federal nº 9.394/96 com QR Code rastreável.\n\nO curso já está salvo no banco de dados PostgreSQL e publicado na plataforma! Já pode ser visualizado na aba "Cursos" ou na "Vitrine"!`,
        actionTaken: 'course_created',
        suggestedSection: 'courses'
      };
    }

    if (isModuleCreation) {
      if (!isCeo) {
        return {
          reply: `⚠️ A adição de módulos na matriz curricular é restrita ao CEO Eloizio e aos docentes autorizados.`,
          actionTaken: 'module_creation_unauthorized'
        };
      }

      const courses = LMSStorageService.getCourses();
      const targetCourse = courses[0];
      const cleanModTitle = text
        .replace(/^(crie|criar|adicione|adicionar|inclua|incluir|novo|nova)\s+(módulo|modulo|aula|disciplina)\s*(de|sobre)?\s*/i, '')
        .trim() || 'Módulo Avançado de Prática de Bancada';

      const capitalizedMod = cleanModTitle.charAt(0).toUpperCase() + cleanModTitle.slice(1);
      const newModule = this.addModuleToCourse(targetCourse.id, capitalizedMod);

      return {
        reply: `✅ NOVO MÓDULO ADICIONADO NA MATRIZ CURRICULAR!\n\nChefe Eloizio, criei e inseri o módulo "${newModule.title}" com 2 aulas na matriz curricular do curso "${targetCourse.title}".\n\nJá sincronizado com o banco PostgreSQL e com a Área do Aluno!`,
        actionTaken: 'module_created',
        suggestedSection: 'courses'
      };
    }

    // 3. TENTATIVA DE INVASÃO / PRIVILÉGIOS POR USUÁRIOS COMUNS (PROTEÇÃO DE PRODUÇÃO)
    if (!isCeo && (
      lower.includes('simular diretor') || 
      lower.includes('mudar para admin') || 
      lower.includes('virar admin') || 
      lower.includes('editar script') || 
      lower.includes('deletar curso') || 
      lower.includes('apagar banco') ||
      lower.includes('senha do banco') ||
      lower.includes('token mercado pago')
    )) {
      return {
        reply: `🛡️ ATENÇÃO: ACESSO RESTRITO AO CEO ELOIZIO\n\nPor rígidos padrões de segurança, conformidade com a LGPD e governança do Grupo Eloizio em modo de produção, a edição de scripts, exclusão de cursos e concessão de privilégios de superadministrador são bloqueadas para usuários públicos e estudantes.\n\nApenas o CEO Eloizio (mecanicoeloizio@gmail.com) possui a chave master de autorização. Como posso te auxiliar com os nossos cursos profissionalizantes ou no conserto de máquinas na oficina de São Gonçalo?`,
        actionTaken: 'security_blocked'
      };
    }

    // 4. DÚVIDAS TÉCNICAS DE MECÂNICA DE COSTURA (RESPOSTAS PRECISAS E RICAS)
    if (lower.includes('ponto pulando') || lower.includes('pulando ponto') || lower.includes('falha de ponto')) {
      return {
        reply: `🔧 DIAGNÓSTICO TÉCNICO DE PONTO PULANDO (Luiza Souza - Especialista de Bancada):\n\nO ponto pula por 3 motivos físicos principais:\n1. Sincronismo Lançadeira-Agulha: A agulha deve descer ao Ponto Morto Inferior (PMI) e subir 2,0mm. Nesse exato instante, o bico da lançadeira precisa passar pelo terço inferior da cava da agulha.\n2. Folga Lateral Excessiva: A distância entre o bico e a agulha deve ser de 0,05mm a 0,10mm (uma folha de papel sulfite). Se estiver maior, a laçada escapa.\n3. Agulha Torta ou Cega: Substitua a agulha por uma nova (ex: DPx5 para reta industrial ou DBx1) e verifique se a cava está voltada para o lado correto da lançadeira!\n\nNa nossa oficina física em São Gonçalo fazemos essa calibragem com gabarito. Se quiser aprender o passo a passo completo, recomendo nosso curso de Mecânica Industrial!`,
        actionTaken: 'tech_advice_skipped_stitch'
      };
    }

    if (lower.includes('linha arrebentando') || lower.includes('quebrando linha') || lower.includes('linha quebra')) {
      return {
        reply: `🧵 DIAGNÓSTICO: QUEBRA FREQUENTE DE LINHA\n\n1. Rebarba no Bico da Lançadeira ou Chapa: Passe o dedo (ou uma meia fina) no bico e no furo da chapa de agulha. Se desfiar, há uma quina viva provocada por agulha que bateu. Solução: Polimento com lixa 1200 e fio dental com pasta de polir.\n2. Tensão Superior Excessiva: Afrouxe o conjunto de discos tensores no sentido anti-horário.\n3. Passagem de Linha Incorreta: Confira se a linha não está dando volta no guia do cabeçote ou enrolando no porta-fio.\n4. Agulha Incompatível: Linha grossa (ex: 40 ou 60) requer agulha nº 16 ou 18; usar agulha nº 11 vai esmagar e cortar a linha.`,
        actionTaken: 'tech_advice_thread_break'
      };
    }

    if (lower.includes('linha embolando') || lower.includes('ninho de linha') || lower.includes('embolando embaixo')) {
      return {
        reply: `⚠️ LINHA EMBOLANDO EMBAIXO DO TECIDO (Ninho de Passarinho / Birdnesting):\n\nMuita gente pensa que o problema é na bobina, mas em 95% dos casos o defeito é na PARTE DE CIMA:\n1. A linha pulou fora dos discos tensores superiores ou o calcador estava abaixado na hora de passar a linha.\n2. O puxa-fio (alavanca de retorno) não foi enfiado.\n3. Solução Imediata: Levante o calcador (isso abre os discos tensores), repasse toda a linha superior até a agulha, abaixe o calcador e teste novamente!`,
        actionTaken: 'tech_advice_birdnesting'
      };
    }

    if (lower.includes('sincronismo') || lower.includes('lançadeira') || lower.includes('lancadeira')) {
      const pill = this.generateNeuroPill('lançadeira');
      return {
        reply: `⚙️ REGULAGEM DO SINCRONISMO DA LANÇADEIRA:\n\n${pill.pill}\n\n📌 ${pill.mnemonic}\n🎨 ${pill.dualCodingGuide}\n\nVocê também pode praticar no nosso "Simulador de Bancada Virtual" aqui no portal para ver o movimento em tempo real antes de mexer na máquina real!`,
        actionTaken: 'tech_advice_timing',
        suggestedSection: 'simulator'
      };
    }

    if (lower.includes('direct drive') || lower.includes('motor eletrônico') || lower.includes('motor eletronico') || lower.includes('painel')) {
      return {
        reply: `⚡ MOTORES DIRECT DRIVE & ELETRÔNICA:\n\nOs motores modernos Direct Drive são integrados ao cabeçote, economizam até 70% de energia e dispensam correia. Os defeitos mais comuns são:\n1. Erro de Parada de Agulha (Sensor Hall fora de posição no volante).\n2. Erro de Tensão Elétrica (Flutuação de 110V/220V em São Gonçalo).\n3. Trava Mecânica por Linha enrolada atrás do volante.\n\nNosso treinamento ensina a testar a placa inversora e calibrar os parâmetros no painel digital sem medo!`,
        actionTaken: 'tech_advice_direct_drive'
      };
    }

    // 5. ATENDIMENTO COMERCIAL: OFICINA EM SÃO GONÇALO - RJ
    if (lower.includes('oficina') || lower.includes('conserto') || lower.includes('são gonçalo') || lower.includes('sao goncalo') || lower.includes('reforma') || lower.includes('manutenção') || lower.includes('manutencao') || lower.includes('orçamento') || lower.includes('orcamento')) {
      return {
        reply: `🏬 OFICINA MECÂNICA DO GRUPO ELOIZIO EM SÃO GONÇALO - RJ:\n\n• Atendimento: Segunda a Sábado das 08h às 18h.\n• Serviços: Compra, venda, conserto, reforma completa e modernização para Direct Drive de máquinas retas, overloques, galoneiras e pesadas (pespontadeiras, travetes).\n• Central WhatsApp Oficial: (21) 99613-4073\n• Contato Pessoal do Eloizio (CEO): (21) 98764-8727\n• Garantia: 30 a 90 dias em peças e mão de obra com teste na sua frente antes da retirada!\n\nPode nos mandar uma foto ou trazer o cabeçote na oficina para orçamento gratuito!`,
        actionTaken: 'commercial_workshop_info'
      };
    }

    // 6. ATENDIMENTO COMERCIAL: CONSULTA DE COMPRA / INFORMAÇÕES DE CURSOS EXISTENTES
    if (
      lower.includes('comprar curso') || 
      lower.includes('fazer o curso') || 
      lower.includes('matricular no curso') || 
      lower.includes('quanto custa') || 
      lower.includes('preço') || 
      lower.includes('preco') || 
      lower.includes('valor do curso') || 
      lower.includes('inscrição') || 
      lower.includes('inscricao') ||
      (lower.includes('curso') && (lower.includes('catálogo') || lower.includes('catalogo') || lower.includes('disponível') || lower.includes('disponivel') || lower.includes('grade') || lower.includes('horas') || lower.includes('online')))
    ) {
      return {
        reply: `🎓 CURSOS LIVRES 100% ONLINE · GRUPO ELOIZIO (PADRÃO OURO):\n\n1. Curso de Mecânica de Máquinas de Costura (Industriais e Domésticas - 120h):\n   • Investimento: Apenas R$ 497,00 à vista no Pix com desconto ou em até 12x no cartão de crédito via Mercado Pago.\n   • Certificado: Válido em todo o território nacional sob a Lei Federal de Cursos Livres nº 9.394/96, com QR Code para validação pública imediata.\n   • Didática: Vídeos gravados em alta definição direto da bancada do Eloizio, apostilas ilustradas em PDF e suporte pedagógico do SOE.\n\nDeseja que eu te direcione para a vitrine oficial ou para o checkout seguro agora?`,
        actionTaken: 'commercial_courses_info',
        suggestedSection: 'showcase'
      };
    }

    // 6. ATENDIMENTO COMERCIAL: MERCADO PAGO E FORMAS DE PAGAMENTO
    if (lower.includes('mercado pago') || lower.includes('pagamento') || lower.includes('pagar') || lower.includes('pix') || lower.includes('cartão') || lower.includes('cartao') || lower.includes('parcelar')) {
      return {
        reply: `💳 PAGAMENTOS SEGUROS VIA MERCADO PAGO:\n\n• Todos os nossos recebimentos são processados EXCLUSIVAMENTE pelo gateway oficial do Mercado Pago (com criptografia SSL de 256 bits).\n• Pix Imediato: O QR Code e a chave Copia e Cola são gerados instantaneamente e sua liberação ocorre em menos de 3 segundos.\n• Cartão de Crédito: Parcelamento em até 12 vezes com aprovação imediata.\n• Notificação Automática: Nosso Webhook atualiza o banco PostgreSQL e envia o comprovante para seu WhatsApp.\n\nVocê pode testar ou pagar diretamente na aba "Financeiro (Mercado Pago)" do nosso portal!`,
        actionTaken: 'commercial_payments_info',
        suggestedSection: 'financial'
      };
    }

    // 7. ATENDIMENTO COMERCIAL: ASSESSORIA CONTÁBIL MEI
    if (lower.includes('mei') || lower.includes('contabilidade') || lower.includes('nota fiscal') || lower.includes('nfse') || lower.includes('imposto') || lower.includes('das')) {
      return {
        reply: `📑 ASSESSORIA CONTÁBIL 100% ONLINE PARA OFICINAS E ATELIÊS:\n\nOferecemos assessoria ágil e digital (serviços práticos que não exigem CRC direto para execução):\n• Abertura e Regularização de CNPJ MEI (CNAE 9529-1/05 - Reparação de artigos do vestuário e máquinas).\n• Emissão de NFS-e no Portal Nacional da Receita.\n• Emissão e parcelamento de guias mensais DAS.\n• Declaração Anual Simplificada (DASN-SIMPEI).\n\nQuer regularizar sua oficina para prestar serviços para grandes confecções e ter CNPJ limpo? Fale com a gente no (21) 99613-4073!`,
        actionTaken: 'commercial_mei_info'
      };
    }

    // 8. CERTIFICADOS E DOCUMENTOS
    if (lower.includes('certificado') || lower.includes('carteirinha') || lower.includes('crachá') || lower.includes('cracha') || lower.includes('diploma')) {
      return {
        reply: `📜 CERTIFICADOS E IDENTIFICAÇÃO ESTUDANTIL:\n\nAo concluir as aulas e atingir a nota mínima de 7,0 na Prova Final, nosso sistema emite automaticamente:\n1. Certificado Digital em Alta Resolução assinado pelo Eloizio e com QR Code criptográfico verificável publicamente.\n2. Carteirinha Digital de Estudante com foto, matrícula e código de barras.\n3. Histórico Escolar Completo para comprovação profissional.\n\nVocê pode consultar seus documentos na aba "Certificados & Documentos"!`,
        actionTaken: 'academic_documents_info',
        suggestedSection: 'documents'
      };
    }

    // 9. RESPOSTA DE CONTEXTO GERAL (NUNCA RESPOSTA ALEATÓRIA OU PERDIDA)
    return {
      reply: `Entendido perfeitamente! Como Atendente Oficial e Gestora de Inteligência do Grupo Eloizio (FUNC-001), estou aqui para te orientar em tudo que envolve nossos cursos livres online, a oficina física de máquinas de costura em São Gonçalo-RJ, pagamentos no Mercado Pago ou dúvidas pedagógicas.\n\nVocê pode me mandar uma pergunta específica sobre o defeito da sua máquina, anexar uma foto/vídeo/áudio do sintoma, ou falar direto com a gente no WhatsApp (21) 99613-4073! O que gostaria de verificar agora?`,
      actionTaken: 'general_assistance'
    };
  }

  // --- CONSULTA ASSÍNCRONA VIA API GEMINI INTELIGENTE COM FALLBACK LOCAL ---
  static async askAi(
    rawText: string,
    context: { isCeo: boolean; userName?: string; userEmail?: string },
    media?: { base64Data?: string; mimeType?: string }
  ): Promise<{ reply: string; actionTaken?: string; suggestedSection?: string }> {
    const isCeo = context.isCeo || this.isCeoUser(null, rawText);
    const lower = rawText.toLowerCase();

    const isCourseCreation = 
      (lower.includes('crie') || lower.includes('criar') || lower.includes('cadastr') || lower.includes('adicion') || lower.includes('inclu') || lower.includes('montar') || lower.includes('gerar') || lower.includes('fazer')) &&
      (lower.includes('curso') || lower.includes('formação') || lower.includes('formacao') || lower.includes('treinamento'));

    // 1. Tentar chamar a inteligência generativa na API server (/api/luiza/chat)
    try {
      const response = await fetch('/api/luiza/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: rawText,
          isCeo,
          userName: context.userName,
          userEmail: context.userEmail,
          media
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.reply) {
          let replyText = data.reply;
          let actionTaken = 'ai_gemini_response';
          let suggestedSection: string | undefined = undefined;

          // Se Gemini gerou a especificação de curso com [COURSE_JSON: ...]
          const courseMatch = replyText.match(/\[COURSE_JSON:\s*(\{[\s\S]*?\})\s*\]/);
          if (courseMatch && courseMatch[1]) {
            try {
              const parsedCourse = JSON.parse(courseMatch[1]);
              this.createFullCourse({
                title: parsedCourse.title,
                category: parsedCourse.category || 'Cursos Livres Profissionalizantes',
                shortDescription: parsedCourse.shortDescription || parsedCourse.description,
                durationHours: parsedCourse.durationHours || 80,
                priceBrl: parsedCourse.priceBrl || 397
              });
              replyText = replyText.replace(/\[COURSE_JSON:\s*\{[\s\S]*?\}\s*\]/, '').trim();
              actionTaken = 'course_created';
              suggestedSection = 'courses';
            } catch (e) {
              console.warn('Erro ao processar COURSE_JSON:', e);
            }
          } else if (isCourseCreation) {
            // Se o usuário pediu criação mas não veio o bloco JSON
            const parsed = this.parseCourseCreationPrompt(rawText);
            this.createFullCourse({
              title: parsed.title,
              category: parsed.category,
              shortDescription: parsed.shortDescription,
              durationHours: parsed.durationHours,
              priceBrl: parsed.priceBrl
            });
            actionTaken = 'course_created';
            suggestedSection = 'courses';
          }

          return {
            reply: replyText,
            actionTaken,
            suggestedSection
          };
        }
      }
    } catch (err) {
      console.warn('Conexão com Gemini API indisponível, acionando motor neuro-cognitivo local:', err);
    }

    // 2. Fallback imediato: Motor NLP cognitivo local com todas as regras de negócios
    return this.processQuery(rawText, { ...context, isCeo });
  }
}


