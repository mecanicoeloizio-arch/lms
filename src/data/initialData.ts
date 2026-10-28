import {
  Institution,
  User,
  Course,
  Enrollment,
  LessonProgress,
  Assessment,
  Certificate,
  StudentCard,
  Badge,
  Order,
  Transaction,
  AuditLog,
  LibraryResource,
  FacultyMember,
  SecretariatRequest,
  CourseTestimonial
} from '../types/lms';

export const initialInstitution: Institution = {
  id: 'inst-eloizio-01',
  name: 'Grupo Eloizio - Cursos Livres & Treinamentos',
  slug: 'grupo-eloizio',
  primaryColor: '#1E3A8A',
  documentCnpj: '38.412.985/0001-44',
  phone: '(21) 99613-4073',
  email: 'contato@grupoeloizio.com.br',
  city: 'São Gonçalo',
  state: 'RJ',
  signatureName: 'Eloizio',
  signatureRole: 'Diretor Geral & Fundador'
};

export const initialUsers: User[] = [
  {
    id: 'user-superadmin-01',
    institutionId: 'inst-eloizio-01',
    name: 'Eloizio (CEO & Fundador)',
    email: 'mecanicoeloizio@gmail.com',
    role: 'superadmin',
    documentCpf: '112.334.556-78',
    phone: '(21) 98764-8727',
    registrationNumber: 'SUP-001',
    avatarUrl: '',
    active: true,
    createdAt: '2026-01-10T10:00:00.000Z'
  },
  {
    id: 'user-admin-01',
    institutionId: 'inst-eloizio-01',
    name: 'Mariana Souza (Diretoria)',
    email: 'mariana.diretoria@grupoeloizio.com.br',
    role: 'institution_admin',
    documentCpf: '223.445.667-89',
    phone: '(21) 99613-4073',
    registrationNumber: 'DIR-010',
    avatarUrl: '',
    active: true,
    createdAt: '2026-01-12T10:00:00.000Z'
  },
  {
    id: 'user-coord-01',
    institutionId: 'inst-eloizio-01',
    name: 'Prof. Ricardo Fonseca (Coordenação)',
    email: 'ricardo.pedagogico@grupoeloizio.com.br',
    role: 'coordinator',
    documentCpf: '334.556.778-90',
    phone: '(21) 98111-2233',
    registrationNumber: 'CRD-025',
    avatarUrl: '',
    active: true,
    createdAt: '2026-01-15T10:00:00.000Z'
  },
  {
    id: 'user-prof-01',
    institutionId: 'inst-eloizio-01',
    name: 'Carlos Eduardo da Silva (Instrutor)',
    email: 'carlos.mecanica@grupoeloizio.com.br',
    role: 'instructor',
    documentCpf: '445.667.889-01',
    phone: '(21) 98222-3344',
    registrationNumber: 'INS-042',
    avatarUrl: '',
    active: true,
    createdAt: '2026-01-20T10:00:00.000Z'
  },
  {
    id: 'user-student-01',
    institutionId: 'inst-eloizio-01',
    name: 'Lucas Mendes de Oliveira (Aluno)',
    email: 'lucas.aluno@gmail.com',
    role: 'student',
    documentCpf: '556.778.990-12',
    phone: '(21) 97333-4455',
    registrationNumber: 'MAT-2026-089',
    avatarUrl: '',
    active: true,
    createdAt: '2026-02-01T14:30:00.000Z'
  },
  {
    id: 'user-finance-01',
    institutionId: 'inst-eloizio-01',
    name: 'Beatriz Nogueira (Financeiro)',
    email: 'financeiro@grupoeloizio.com.br',
    role: 'finance',
    documentCpf: '667.889.001-23',
    phone: '(21) 99444-5566',
    registrationNumber: 'FIN-008',
    avatarUrl: '',
    active: true,
    createdAt: '2026-01-18T11:00:00.000Z'
  },
  {
    id: 'user-secretary-01',
    institutionId: 'inst-eloizio-01',
    name: 'Juliana Santos (Secretaria)',
    email: 'secretaria@grupoeloizio.com.br',
    role: 'secretary',
    documentCpf: '778.990.112-34',
    phone: '(21) 99555-6677',
    registrationNumber: 'SEC-015',
    avatarUrl: '',
    active: true,
    createdAt: '2026-01-19T09:00:00.000Z'
  }
];

export const initialCourses: Course[] = [
  {
    id: 'course-mec-01',
    institutionId: 'inst-eloizio-01',
    instructorId: 'user-prof-01',
    category: 'Mecânica & Manutenção',
    title: 'Mecânica e Manutenção de Máquinas de Costura Industriais e Domésticas',
    slug: 'mecanica-manutencao-maquinas-costura',
    shortDescription: 'Formação completa prática do zero ao profissional: regulagens de lançadeira, agulha, lubrificação, motores direct drive e diagnóstico de falhas.',
    description: 'Curso profissionalizante com metodologia prática desenvolvida para formar mecânicos habilitados a atender confecções, ateliês e clientes particulares. Abrange máquinas retas industriais, overloques, galoneiras e modelos domésticos portáteis.',
    modality: 'profissionalizante',
    durationHours: 120,
    priceBrl: 497.00,
    status: 'published',
    minPassingGrade: 7.0,
    minAttendancePercent: 75,
    coverGradient: 'from-blue-900 to-indigo-800',
    prerequisites: [],
    createdAt: '2026-01-10T10:00:00.000Z',
    modules: [
      {
        id: 'mod-mec-1',
        courseId: 'course-mec-01',
        title: 'Módulo 1: Fundamentos Mecânicos, Segurança e Ferramental',
        description: 'Introdução ao funcionamento mecânico, EPIs e ferramentas indispensáveis na bancada.',
        sortOrder: 1,
        unlockDaysAfterEnrollment: 0,
        lessons: [
          {
            id: 'les-mec-101',
            moduleId: 'mod-mec-1',
            title: '1.1 Apresentação do Curso e Anatomia da Máquina Reta Industrial',
            description: 'Conhecendo cada componente: cabeçote, carcaça, mesa, estica-fio, dentes impelentes e lançadeira.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            durationMinutes: 28,
            sortOrder: 1,
            isFreePreview: true,
            materials: [
              {
                id: 'mat-1',
                lessonId: 'les-mec-101',
                title: 'Manual Técnico Ilustrado - Componentes da Reta (PDF)',
                fileUrl: '#download-manual-reta',
                fileType: 'pdf',
                fileSizeBytes: 2450000
              }
            ]
          },
          {
            id: 'les-mec-102',
            moduleId: 'mod-mec-1',
            title: '1.2 Ferramentas Indispensáveis na Bancada do Mecânico',
            description: 'Chaves de fenda imantadas, calibradores de folga, pinças de aço, paquímetro e extratores.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            durationMinutes: 22,
            sortOrder: 2,
            isFreePreview: false,
            materials: []
          },
          {
            id: 'les-mec-103',
            moduleId: 'mod-mec-1',
            title: '1.3 Sistema de Lubrificação por Bomba de Óleo e Filtros',
            description: 'Como funciona o carter, bomba de sucção, visor de fluxo e prevenção de travamento.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            durationMinutes: 30,
            sortOrder: 3,
            isFreePreview: false,
            materials: [
              {
                id: 'mat-2',
                lessonId: 'les-mec-103',
                title: 'Tabela de Viscosidade de Lubrificantes Têxteis (PDF)',
                fileUrl: '#tabela-oleo',
                fileType: 'pdf',
                fileSizeBytes: 890000
              }
            ]
          }
        ]
      },
      {
        id: 'mod-mec-2',
        courseId: 'course-mec-01',
        title: 'Módulo 2: Sincronismo da Lançadeira e Barra da Agulha (Reta Industrial)',
        description: 'O segredo do ponto perfeito: ajuste de tempo, altura da barra e folga da agulha.',
        sortOrder: 2,
        unlockDaysAfterEnrollment: 0,
        lessons: [
          {
            id: 'les-mec-201',
            moduleId: 'mod-mec-2',
            title: '2.1 Altura da Barra da Agulha: Traçado e Posicionamento Exato',
            description: 'Como medir a distância do olho da agulha à ponta da lançadeira com régua de precisão.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            durationMinutes: 35,
            sortOrder: 1,
            isFreePreview: false,
            materials: []
          },
          {
            id: 'les-mec-202',
            moduleId: 'mod-mec-2',
            title: '2.2 Ponto de Laçada: Folga Lateral de 0.05mm a 0.1mm',
            description: 'Evitando quebra de agulha e pulo de ponto em tecidos grossos e finos.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            durationMinutes: 40,
            sortOrder: 2,
            isFreePreview: false,
            materials: []
          },
          {
            id: 'les-mec-203',
            moduleId: 'mod-mec-2',
            title: '2.3 Dentes Impelentes e Chapa de Agulha: Altura e Transporte',
            description: 'Regulagem da altura dos dentes em relação à chapa para evitar franzimento e marcas no tecido.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            durationMinutes: 25,
            sortOrder: 3,
            isFreePreview: false,
            materials: []
          }
        ]
      },
      {
        id: 'mod-mec-3',
        courseId: 'course-mec-01',
        title: 'Módulo 3: Regulagem e Sincronismo de Overloque e Galoneira',
        description: 'Dominando o sincronismo de loopers superior e inferior, facas e tensores.',
        sortOrder: 3,
        unlockDaysAfterEnrollment: 2,
        lessons: [
          {
            id: 'les-mec-301',
            moduleId: 'mod-mec-3',
            title: '3.1 Overloque 3 e 4 Fios: Cruzamento dos Loopers',
            description: 'Passo a passo da regulagem do looper inferior cruzando com a agulha e looper superior.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            durationMinutes: 45,
            sortOrder: 1,
            isFreePreview: false,
            materials: [
              {
                id: 'mat-3',
                lessonId: 'les-mec-301',
                title: 'Esquema Gráfico de Cruzamento de Loopers (PDF)',
                fileUrl: '#loopers-pdf',
                fileType: 'pdf',
                fileSizeBytes: 1200000
              }
            ]
          },
          {
            id: 'les-mec-302',
            moduleId: 'mod-mec-3',
            title: '3.2 Ajuste das Facas Superior e Inferior (Corte Perfeito)',
            description: 'Ângulo de afiação, pressão de mola e corte suave sem mastigar a costura.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            durationMinutes: 30,
            sortOrder: 2,
            isFreePreview: false,
            materials: []
          }
        ]
      },
      {
        id: 'mod-mec-4',
        courseId: 'course-mec-01',
        title: 'Módulo 4: Diagnóstico de Defeitos, Motores Direct Drive e Avaliação',
        description: 'Solução rápida dos 15 problemas mais frequentes e avaliação teórica com certificação.',
        sortOrder: 4,
        unlockDaysAfterEnrollment: 4,
        lessons: [
          {
            id: 'les-mec-401',
            moduleId: 'mod-mec-4',
            title: '4.1 Motores Eletrônicos Direct Drive: Parâmetros e Códigos de Erro',
            description: 'Configuração do painel de controle, posicionador de agulha e reset de fábrica.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            durationMinutes: 38,
            sortOrder: 1,
            isFreePreview: false,
            materials: []
          },
          {
            id: 'les-mec-402',
            moduleId: 'mod-mec-4',
            title: '4.2 Roteiro de Diagnóstico Rápido: Pulo de Ponto, Linha Quebrando e Ruído',
            description: 'Checklist passo a passo para diagnosticar em menos de 10 minutos na bancada.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            durationMinutes: 32,
            sortOrder: 2,
            isFreePreview: false,
            materials: [
              {
                id: 'mat-4',
                lessonId: 'les-mec-402',
                title: 'Guia de Bolso: 15 Defeitos e Soluções Imediatas (PDF)',
                fileUrl: '#guia-defeito',
                fileType: 'pdf',
                fileSizeBytes: 1850000
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'course-cont-02',
    institutionId: 'inst-eloizio-01',
    instructorId: 'user-prof-01',
    category: 'Gestão & Assessoria Contábil',
    title: 'Contabilidade Prática e Gestão Fiscal 100% Online para MEI e ME',
    slug: 'contabilidade-pratica-gestao-fiscal',
    shortDescription: 'Organização contábil completa: emissão de notas fiscais, controle de fluxo de caixa, tributação Simples Nacional e declarações anuais.',
    description: 'Capacitação prática orientada a microempreendedores e autônomos que desejam manter sua empresa 100% regularizada, economizando impostos e emitindo notas com segurança.',
    modality: 'livre',
    durationHours: 80,
    priceBrl: 349.00,
    status: 'published',
    minPassingGrade: 7.0,
    minAttendancePercent: 75,
    coverGradient: 'from-emerald-900 to-teal-800',
    prerequisites: [],
    createdAt: '2026-01-15T10:00:00.000Z',
    modules: [
      {
        id: 'mod-cont-1',
        courseId: 'course-cont-02',
        title: 'Módulo 1: Estrutura Fiscal e Regularização do MEI / ME',
        sortOrder: 1,
        unlockDaysAfterEnrollment: 0,
        lessons: [
          {
            id: 'les-cont-101',
            moduleId: 'mod-cont-1',
            title: '1.1 Enquadramento Tributário: MEI x ME x Simples Nacional',
            description: 'Limites de faturamento, alíquotas e vantagens de cada regime.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            durationMinutes: 30,
            sortOrder: 1,
            isFreePreview: true,
            materials: []
          },
          {
            id: 'les-cont-102',
            moduleId: 'mod-cont-1',
            title: '1.2 Emissão de Notas Fiscais Eletrônicas (NFS-e e NF-e)',
            description: 'Passo a passo no emissor nacional e preenchimento correto de CFOP e tributos.',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            durationMinutes: 25,
            sortOrder: 2,
            isFreePreview: false,
            materials: []
          }
        ]
      }
    ]
  },
  {
    id: 'course-tec-03',
    institutionId: 'inst-eloizio-01',
    instructorId: 'user-prof-01',
    category: 'Mecânica & Manutenção',
    title: 'Especialização em Motores Eletrônicos Direct Drive e Placas de Controle',
    slug: 'motores-direct-drive-placas-controle',
    shortDescription: 'Eletrônica aplicada a máquinas de costura: teste de transistores IGBT, sensores hall e circuitos de alimentação.',
    description: 'Curso avançado para mecânicos que desejam consertar também a parte eletroeletrônica das máquinas computadorizadas.',
    modality: 'tecnico',
    durationHours: 60,
    priceBrl: 289.00,
    status: 'published',
    minPassingGrade: 7.0,
    minAttendancePercent: 80,
    coverGradient: 'from-purple-900 to-slate-900',
    prerequisites: ['course-mec-01'],
    createdAt: '2026-01-20T10:00:00.000Z',
    modules: []
  }
];

export const initialAssessments: Assessment[] = [
  {
    id: 'assess-mec-final',
    courseId: 'course-mec-01',
    title: 'Avaliação Final Teórica - Mecânica de Máquinas de Costura',
    description: 'Avaliação oficial para concessão de Certificado Profissional. Nota mínima exigida: 7.0 (70%).',
    passingGrade: 7.0,
    maxAttempts: 3,
    timeLimitMinutes: 45,
    randomizeQuestions: true,
    questions: [
      {
        id: 'q1',
        assessmentId: 'assess-mec-final',
        questionText: 'Qual é a folga ideal recomendada entre a ponta da lançadeira e a cava da agulha na máquina reta industrial?',
        type: 'multiple_choice',
        scorePoints: 2.5,
        explanation: 'A folga ideal situa-se entre 0,05 mm e 0,10 mm para evitar tanto o pulo de ponto quanto a quebra da ponta da agulha por colisão mecânica.',
        options: [
          { id: 'q1_o1', questionId: 'q1', optionText: '0,05 mm a 0,10 mm (quase tocando sem atrito)', isCorrect: true },
          { id: 'q1_o2', questionId: 'q1', optionText: '1,50 mm a 2,00 mm', isCorrect: false },
          { id: 'q1_o3', questionId: 'q1', optionText: '0,80 mm a 1,20 mm', isCorrect: false },
          { id: 'q1_o4', questionId: 'q1', optionText: 'A lançadeira deve raspar com força na agulha', isCorrect: false }
        ]
      },
      {
        id: 'q2',
        assessmentId: 'assess-mec-final',
        questionText: 'Quando a máquina de costura está pulando ponto em tecidos grossos, qual é a causa mecânica mais frequente?',
        type: 'multiple_choice',
        scorePoints: 2.5,
        explanation: 'O desajuste no tempo da lançadeira (atrasada) ou agulha com altura incorreta impede que a ponta da lançadeira intercepte o laço de linha formado.',
        options: [
          { id: 'q2_o1', questionId: 'q2', optionText: 'Tempo da lançadeira desajustado ou barra da agulha alta', isCorrect: true },
          { id: 'q2_o2', questionId: 'q2', optionText: 'Falta de linha na bobina inferior', isCorrect: false },
          { id: 'q2_o3', questionId: 'q2', optionText: 'Dentes impelentes instalados invertidos', isCorrect: false },
          { id: 'q2_o4', questionId: 'q2', optionText: 'Pedal de acionamento desregulado', isCorrect: false }
        ]
      },
      {
        id: 'q3',
        assessmentId: 'assess-mec-final',
        questionText: 'Na máquina Overloque, como deve ocorrer o cruzamento entre o looper inferior e o looper superior?',
        type: 'multiple_choice',
        scorePoints: 2.5,
        explanation: 'O looper superior deve passar por trás do looper inferior ao subir, com folga micrométrica sem colisão.',
        options: [
          { id: 'q3_o1', questionId: 'q3', optionText: 'O looper superior passa por trás do inferior mantendo folga mínima sem atrito', isCorrect: true },
          { id: 'q3_o2', questionId: 'q3', optionText: 'Ambos os loopers devem bater suas pontas em cada ciclo', isCorrect: false },
          { id: 'q3_o3', questionId: 'q3', optionText: 'O looper superior não se movimenta', isCorrect: false },
          { id: 'q3_o4', questionId: 'q3', optionText: 'O cruzamento só ocorre a cada 5 voltas da polia', isCorrect: false }
        ]
      },
      {
        id: 'q4',
        assessmentId: 'assess-mec-final',
        questionText: 'O óleo de lubrificação utilizado em máquinas industriais de alta rotação deve ser:',
        type: 'multiple_choice',
        scorePoints: 2.5,
        explanation: 'O óleo mineral têxtil branco de baixa viscosidade é formulado para não manchar tecidos e lubrificar bombas em rotações de até 5.500 RPM.',
        options: [
          { id: 'q4_o1', questionId: 'q4', optionText: 'Óleo mineral têxtil transparente de baixa viscosidade (ISO 10 a 22)', isCorrect: true },
          { id: 'q4_o2', questionId: 'q4', optionText: 'Óleo automotivo de motor 20W50', isCorrect: false },
          { id: 'q4_o3', questionId: 'q4', optionText: 'Graxa automotiva em todo o carter', isCorrect: false },
          { id: 'q4_o4', questionId: 'q4', optionText: 'Qualquer óleo de cozinha vegetal', isCorrect: false }
        ]
      }
    ]
  }
];

export const initialEnrollments: Enrollment[] = [
  {
    id: 'enr-lucas-01',
    userId: 'user-student-01',
    courseId: 'course-mec-01',
    status: 'completed',
    progressPercent: 100,
    enrolledAt: '2026-02-01T14:30:00.000Z',
    completedAt: '2026-02-24T18:00:00.000Z',
    finalGrade: 9.5,
    attendancePercent: 95
  },
  {
    id: 'enr-lucas-02',
    userId: 'user-student-01',
    courseId: 'course-cont-02',
    status: 'active',
    progressPercent: 45,
    enrolledAt: '2026-02-25T10:00:00.000Z',
    finalGrade: 8.0,
    attendancePercent: 90
  }
];

export const initialLessonProgress: LessonProgress[] = [
  { id: 'lp-1', enrollmentId: 'enr-lucas-01', lessonId: 'les-mec-101', completed: true, secondsWatched: 1680, completedAt: '2026-02-02T10:00:00.000Z' },
  { id: 'lp-2', enrollmentId: 'enr-lucas-01', lessonId: 'les-mec-102', completed: true, secondsWatched: 1320, completedAt: '2026-02-04T11:00:00.000Z' },
  { id: 'lp-3', enrollmentId: 'enr-lucas-01', lessonId: 'les-mec-103', completed: true, secondsWatched: 1800, completedAt: '2026-02-07T14:00:00.000Z' },
  { id: 'lp-4', enrollmentId: 'enr-lucas-01', lessonId: 'les-mec-201', completed: true, secondsWatched: 2100, completedAt: '2026-02-10T16:00:00.000Z' },
  { id: 'lp-5', enrollmentId: 'enr-lucas-01', lessonId: 'les-mec-202', completed: true, secondsWatched: 2400, completedAt: '2026-02-14T15:00:00.000Z' },
  { id: 'lp-6', enrollmentId: 'enr-lucas-01', lessonId: 'les-mec-203', completed: true, secondsWatched: 1500, completedAt: '2026-02-18T10:30:00.000Z' },
  { id: 'lp-7', enrollmentId: 'enr-lucas-01', lessonId: 'les-mec-301', completed: true, secondsWatched: 2700, completedAt: '2026-02-20T17:00:00.000Z' },
  { id: 'lp-8', enrollmentId: 'enr-lucas-01', lessonId: 'les-mec-302', completed: true, secondsWatched: 1800, completedAt: '2026-02-21T16:30:00.000Z' },
  { id: 'lp-9', enrollmentId: 'enr-lucas-01', lessonId: 'les-mec-401', completed: true, secondsWatched: 2280, completedAt: '2026-02-23T19:00:00.000Z' },
  { id: 'lp-10', enrollmentId: 'enr-lucas-01', lessonId: 'les-mec-402', completed: true, secondsWatched: 1920, completedAt: '2026-02-24T17:45:00.000Z' }
];

export const initialCertificates: Certificate[] = [
  {
    id: 'cert-elo-01',
    enrollmentId: 'enr-lucas-01',
    userId: 'user-student-01',
    courseId: 'course-mec-01',
    validationCode: 'ELO-2026-MC892',
    studentName: 'Lucas Mendes de Oliveira',
    courseTitle: 'Mecânica e Manutenção de Máquinas de Costura Industriais e Domésticas',
    durationHours: 120,
    issuedAt: '2026-02-24T18:30:00.000Z',
    conclusionDate: '24/02/2026',
    institutionName: 'Grupo Eloizio - Treinamentos Profissionais',
    institutionCnpj: '38.412.985/0001-44',
    signerName: 'Eloizio',
    signerRole: 'Diretor Geral & Fundador',
    revoked: false
  }
];

export const initialStudentCards: StudentCard[] = [
  {
    id: 'card-lucas-01',
    userId: 'user-student-01',
    studentName: 'Lucas Mendes de Oliveira',
    documentCpf: '556.778.990-12',
    registrationNumber: 'MAT-2026-089',
    courseTitle: 'Mecânica de Máquinas de Costura',
    institutionName: 'Grupo Eloizio Academy',
    validUntil: '31/12/2026',
    validationCode: 'CARTEIRA-ELO-089'
  }
];

export const initialBadges: Badge[] = [
  {
    id: 'bdg-carlos-01',
    userId: 'user-prof-01',
    name: 'Carlos Eduardo da Silva',
    role: 'Instrutor Técnico Especialista',
    department: 'Mecânica & Manutenção',
    registrationNumber: 'INS-042',
    institutionName: 'Grupo Eloizio',
    validationCode: 'CRACHA-ELO-INS042'
  }
];

export const initialOrders: Order[] = [
  {
    id: 'ord-mp-1001',
    userId: 'user-student-01',
    courseId: 'course-mec-01',
    courseTitle: 'Mecânica e Manutenção de Máquinas de Costura Industriais e Domésticas',
    amountBrl: 497.00,
    status: 'approved',
    paymentMethod: 'pix',
    mpPaymentId: 'mp-pay-9876543210',
    pixCopiaECola: '00020126580014br.gov.bcb.pix0136384129850001445204000053039865405497.005802BR5913GRUPO ELOIZIO6012SAO GONCALO62070503***6304A1B2',
    createdAt: '2026-02-01T14:20:00.000Z',
    updatedAt: '2026-02-01T14:22:15.000Z'
  },
  {
    id: 'ord-mp-1002',
    userId: 'user-student-01',
    courseId: 'course-cont-02',
    courseTitle: 'Contabilidade Prática e Gestão Fiscal 100% Online',
    amountBrl: 349.00,
    status: 'approved',
    paymentMethod: 'credit_card',
    mpPaymentId: 'mp-pay-8765432109',
    installments: 3,
    createdAt: '2026-02-25T09:45:00.000Z',
    updatedAt: '2026-02-25T09:46:10.000Z'
  },
  {
    id: 'ord-mp-1003',
    userId: 'user-student-01',
    courseId: 'course-tec-03',
    courseTitle: 'Especialização em Motores Eletrônicos Direct Drive',
    amountBrl: 289.00,
    status: 'pending',
    paymentMethod: 'pix',
    mpPaymentId: 'mp-pay-7654321098',
    pixCopiaECola: '00020126580014br.gov.bcb.pix0136384129850001445204000053039865405289.005802BR5913GRUPO ELOIZIO6012SAO GONCALO62070503***6304C3D4',
    createdAt: '2026-02-26T11:15:00.000Z',
    updatedAt: '2026-02-26T11:15:00.000Z'
  }
];

export const initialTransactions: Transaction[] = [
  {
    id: 'tx-001',
    orderId: 'ord-mp-1001',
    mpPaymentId: 'mp-pay-9876543210',
    status: 'approved',
    statusDetail: 'accredited',
    amount: 497.00,
    paymentMethod: 'pix',
    idempotencyKey: 'idemp-pix-ord-1001-v1',
    rawPayload: JSON.stringify({ action: 'payment.updated', status: 'approved', id: 'mp-pay-9876543210' }),
    createdAt: '2026-02-01T14:22:15.000Z'
  },
  {
    id: 'tx-002',
    orderId: 'ord-mp-1002',
    mpPaymentId: 'mp-pay-8765432109',
    status: 'approved',
    statusDetail: 'accredited',
    amount: 349.00,
    paymentMethod: 'credit_card',
    idempotencyKey: 'idemp-cc-ord-1002-v1',
    rawPayload: JSON.stringify({ action: 'payment.updated', status: 'approved', id: 'mp-pay-8765432109' }),
    createdAt: '2026-02-25T09:46:10.000Z'
  }
];

export const initialAuditLogs: AuditLog[] = [
  {
    id: 'log-001',
    userId: 'user-superadmin-01',
    userName: 'Eloizio (CEO)',
    userRole: 'superadmin',
    action: 'COURSE_PUBLISHED',
    entity: 'courses',
    entityId: 'course-mec-01',
    details: 'Curso de Mecânica e Manutenção publicado oficialmente com 4 módulos e 10 aulas.',
    timestamp: '2026-01-10T10:15:00.000Z'
  },
  {
    id: 'log-002',
    userId: 'user-student-01',
    userName: 'Lucas Mendes',
    userRole: 'student',
    action: 'CERTIFICATE_ISSUED',
    entity: 'certificates',
    entityId: 'cert-elo-01',
    details: 'Certificado ELO-2026-MC892 emitido com aproveitamento de 9.5 e 95% de frequência.',
    timestamp: '2026-02-24T18:30:00.000Z'
  }
];

export const initialLibraryResources: LibraryResource[] = [
  {
    id: 'lib-001',
    title: 'Manual de Serviço & Manutenção - Reta Industrial Singer / Siruba',
    category: 'manual_servico',
    machineBrand: 'Siruba / Singer',
    description: 'Manual técnico completo com vistas explodidas, folgas de lançadeira, regulagem de dentes impelentes e tabela de códigos de peças de reposição.',
    fileSizeBytes: 4850000,
    pagesCount: 68,
    fileUrl: '#manual-reta-siruba-pdf',
    downloadsCount: 1420,
    featured: true
  },
  {
    id: 'lib-002',
    title: 'Guia de Sincronismo de Loopers para Overloque 747K / 757K',
    category: 'manual_servico',
    machineBrand: 'Siruba',
    description: 'Esquema gráfico milimétrico de cruzamento entre agulhas e loopers superior/inferior, evitando quebras e pontos frouxos.',
    fileSizeBytes: 2900000,
    pagesCount: 42,
    fileUrl: '#guia-overloque-loopers-pdf',
    downloadsCount: 980,
    featured: true
  },
  {
    id: 'lib-003',
    title: 'Manual de Parâmetros e Circuitos de Motores Direct Drive (Jack & Sun Special)',
    category: 'esquema_eletrico',
    machineBrand: 'Jack / Sun Special',
    description: 'Tabela de códigos de falha (E1, E2, E7), calibração do posicionador de agulha e esquemático da fonte chaveada.',
    fileSizeBytes: 3400000,
    pagesCount: 54,
    fileUrl: '#direct-drive-schematic-pdf',
    downloadsCount: 760,
    featured: true
  },
  {
    id: 'lib-004',
    title: 'Catálogo Ilustrado de Peças e Lançadeiras Rotativas (Koban / Hirose)',
    category: 'catalogo_pecas',
    machineBrand: 'Koban / Hirose',
    description: 'Comparativo de lançadeiras com teflon para tecidos finos vs. lançadeiras de aço temperado para jeans pesado.',
    fileSizeBytes: 6200000,
    pagesCount: 88,
    fileUrl: '#catalogo-lancadeiras-pdf',
    downloadsCount: 1150,
    featured: false
  },
  {
    id: 'lib-005',
    title: 'Apostila Prática: Emissão de Notas Fiscais e Regularização Fiscal MEI',
    category: 'guia_fiscal',
    description: 'Passo a passo no Portal Nacional de Emissão de NFS-e, emissão de CCMEI, parcelamento DAS e declaração anual DASN-SIMPEI.',
    fileSizeBytes: 1800000,
    pagesCount: 36,
    fileUrl: '#guia-fiscal-mei-pdf',
    downloadsCount: 640,
    featured: false
  }
];

export const initialFaculty: FacultyMember[] = [
  {
    id: 'fac-01',
    name: 'Eloizio',
    title: 'Fundador, CEO & Especialista Técnico',
    department: 'Diretoria',
    bio: 'Mais de 25 anos de experiência prática em manutenção mecânica industrial e desenvolvimento de novos talentos técnicos no Rio de Janeiro.',
    avatarInitials: 'EL',
    rating: 4.98,
    studentsTaught: 3850,
    experienceYears: 25,
    contactWhatsApp: '(21) 98764-8727'
  },
  {
    id: 'fac-02',
    name: 'Carlos Eduardo da Silva',
    title: 'Docente Titular de Mecânica & Bancada',
    department: 'Mecânica Têxtil',
    bio: 'Especialista em alinhamento de lançadeiras, sincronismo de loopers, solda de peças finas e calibração de transportes diferenciais.',
    avatarInitials: 'CE',
    rating: 4.95,
    studentsTaught: 1920,
    experienceYears: 18,
    contactWhatsApp: '(21) 98222-3344'
  },
  {
    id: 'fac-03',
    name: 'Profª. Renata Alencar',
    title: 'Orientadora Educacional (SOE)',
    department: 'SOE',
    bio: 'Pedagoga e especialista em aprendizagem acelerada para adultos. Cria planos de estudo adaptativos e acompanha o ritmo de cada estudante.',
    avatarInitials: 'RA',
    rating: 4.96,
    studentsTaught: 2400,
    experienceYears: 12,
    contactWhatsApp: '(21) 99613-4073'
  },
  {
    id: 'fac-04',
    name: 'Juliana Santos',
    title: 'Secretária Acadêmica Oficial',
    department: 'Secretaria',
    bio: 'Responsável pelos registros de matrícula, expedição de declarações, histórico escolar e validação documental de todos os alunos.',
    avatarInitials: 'JS',
    rating: 4.92,
    studentsTaught: 4100,
    experienceYears: 9,
    contactWhatsApp: '(21) 99555-6677'
  },
  {
    id: 'fac-05',
    name: 'Mariana Souza',
    title: 'Diretora Pedagógica & Governança',
    department: 'Diretoria',
    bio: 'Supervisiona a qualidade curricular, alinhamento às normas técnicas e parcerias com confecções e ateliês para encaminhamento de formandos.',
    avatarInitials: 'MS',
    rating: 4.97,
    studentsTaught: 2800,
    experienceYears: 15,
    contactWhatsApp: '(21) 99613-4073'
  }
];

export const initialSecretariatRequests: SecretariatRequest[] = [
  {
    id: 'req-sec-01',
    userId: 'user-student-01',
    studentName: 'Lucas Mendes de Oliveira',
    documentCpf: '556.778.990-12',
    type: 'declaracao_matricula',
    courseTitle: 'Mecânica e Manutenção de Máquinas de Costura Industriais e Domésticas',
    status: 'ready',
    requestedAt: '2026-02-15T09:00:00.000Z',
    deliveryDate: '2026-02-15T09:05:00.000Z',
    validationCode: 'DEC-ELO-2026-0982',
    digitalSignature: 'Juliana Santos · Secretária Geral (Portaria 04/2026)'
  }
];

export const initialTestimonials: CourseTestimonial[] = [
  {
    id: 'test-1',
    courseId: 'course-mec-01',
    studentName: 'Marcos Vinícius Abreu',
    location: 'Niterói, RJ',
    quote: 'Em menos de 45 dias de curso, consertei a primeira máquina reta de uma confecção perto da minha casa e cobrei R$ 180 pelo serviço. O curso se pagou na primeira semana!',
    outcome: 'Abriu oficina própria de manutenção têxtil',
    rating: 5,
    avatarInitials: 'MV'
  },
  {
    id: 'test-2',
    courseId: 'course-mec-01',
    studentName: 'Cláudia Regina Fontes',
    location: 'São Gonçalo, RJ',
    quote: 'Eu dependia de mecânico para qualquer barulho na minha overloque e perdia dias de entrega. Hoje regulo a lançadeira e as facas de olhos fechados graças à metodologia do Eloizio.',
    outcome: 'Economia de R$ 900/mês em manutenção no ateliê',
    rating: 5,
    avatarInitials: 'CR'
  },
  {
    id: 'test-3',
    courseId: 'course-cont-02',
    studentName: 'Rodrigo Silveira',
    location: 'Rio de Janeiro, RJ',
    quote: 'A assessoria contábil e as aulas práticas me tiraram do medo de emitir notas. Regularizei meu MEI sem multas e com total tranquilidade.',
    outcome: 'MEI regularizado com nota fiscal em dia',
    rating: 5,
    avatarInitials: 'RS'
  }
];
