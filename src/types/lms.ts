/**
 * Definições de Tipos TypeScript - LMS Profissional Grupo Eloizio
 * Arquitetura de Entidades Relacionais e RBAC
 */

export type UserRole =
  | 'superadmin'       // Superadministrador
  | 'institution_admin'// Administrador da Instituição
  | 'coordinator'      // Coordenador Acadêmico
  | 'instructor'       // Professor / Instrutor
  | 'student'          // Aluno
  | 'finance'          // Financeiro
  | 'secretary';       // Secretaria

export interface Institution {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  primaryColor: string;
  documentCnpj: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  signatureName: string;
  signatureRole: string;
}

export interface User {
  id: string;
  institutionId: string;
  name: string;
  email: string;
  role: UserRole;
  documentCpf: string;
  phone: string;
  avatarUrl?: string;
  registrationNumber: string; // Matrícula
  active: boolean;
  createdAt: string;
}

export type CourseModality = 'livre' | 'profissionalizante' | 'tecnico' | 'extensao';

export interface LessonMaterial {
  id: string;
  lessonId: string;
  title: string;
  fileUrl: string;
  fileType: 'pdf' | 'doc' | 'zip' | 'link';
  fileSizeBytes: number;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  videoUrl: string;
  durationMinutes: number;
  sortOrder: number;
  isFreePreview: boolean;
  materials: LessonMaterial[];
}

export interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  sortOrder: number;
  unlockDaysAfterEnrollment: number;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  institutionId: string;
  instructorId: string;
  category: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  modality: CourseModality;
  durationHours: number;
  priceBrl: number;
  status: 'draft' | 'published' | 'archived';
  minPassingGrade: number; // Ex: 7.0
  minAttendancePercent: number; // Ex: 75%
  coverGradient: string;
  prerequisites: string[]; // IDs de outros cursos
  modules: CourseModule[];
  createdAt: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  status: 'active' | 'completed' | 'blocked' | 'cancelled';
  progressPercent: number;
  enrolledAt: string;
  completedAt?: string;
  finalGrade?: number;
  attendancePercent?: number;
}

export interface LessonProgress {
  id: string;
  enrollmentId: string;
  lessonId: string;
  completed: boolean;
  completedAt?: string;
  secondsWatched: number;
}

export interface QuestionOption {
  id: string;
  questionId: string;
  optionText: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  assessmentId: string;
  questionText: string;
  type: 'multiple_choice' | 'true_false';
  scorePoints: number;
  explanation: string;
  options: QuestionOption[];
}

export interface Assessment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  passingGrade: number;
  maxAttempts: number;
  timeLimitMinutes: number;
  randomizeQuestions: boolean;
  questions: Question[];
}

export interface AssessmentAttempt {
  id: string;
  assessmentId: string;
  userId: string;
  score: number;
  passed: boolean;
  startedAt: string;
  finishedAt: string;
  answers: Record<string, string>; // questionId -> optionId
}

export interface Certificate {
  id: string;
  enrollmentId: string;
  userId: string;
  courseId: string;
  validationCode: string; // Ex: ELO-2026-MC892
  studentName: string;
  courseTitle: string;
  durationHours: number;
  issuedAt: string;
  conclusionDate: string;
  institutionName: string;
  institutionCnpj: string;
  signerName: string;
  signerRole: string;
  revoked: boolean;
  revocationReason?: string;
  revocationDate?: string;
}

export interface StudentCard {
  id: string;
  userId: string;
  studentName: string;
  documentCpf: string;
  registrationNumber: string;
  courseTitle: string;
  institutionName: string;
  validUntil: string;
  validationCode: string;
  avatarUrl?: string;
}

export interface Badge {
  id: string;
  userId: string;
  name: string;
  role: string;
  department: string;
  registrationNumber: string;
  institutionName: string;
  validationCode: string;
}

export type PaymentMethod = 'pix' | 'credit_card' | 'boleto';
export type OrderStatus = 'pending' | 'approved' | 'rejected' | 'refunded' | 'cancelled';

export interface Order {
  id: string;
  userId: string;
  courseId: string;
  courseTitle: string;
  amountBrl: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  mpPreferenceId?: string;
  mpPaymentId?: string;
  pixQrCodeBase64?: string;
  pixCopiaECola?: string;
  installments?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  orderId: string;
  mpPaymentId: string;
  status: string;
  statusDetail: string;
  amount: number;
  paymentMethod: string;
  idempotencyKey: string;
  rawPayload: string;
  createdAt: string;
}

export interface WebhookLog {
  id: string;
  receivedAt: string;
  topic: string;
  action: string;
  dataId: string;
  idempotencyKey: string;
  isDuplicate: boolean;
  status: 'processed' | 'ignored' | 'error';
  rawBody: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  entity: string;
  entityId: string;
  details: string;
  timestamp: string;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  courseId: string;
  date: string;
  present: boolean;
  lessonTitle: string;
}

export interface LibraryResource {
  id: string;
  title: string;
  category: 'manual_servico' | 'esquema_eletrico' | 'catalogo_pecas' | 'guia_fiscal' | 'apostila';
  machineBrand?: string; // Singer, Siruba, Jack, Brother, etc.
  description: string;
  fileSizeBytes: number;
  pagesCount: number;
  fileUrl: string;
  downloadsCount: number;
  featured: boolean;
}

export interface StudyPlanDay {
  dayNumber: number;
  title: string;
  durationMinutes: number;
  lessonReference: string;
  tips: string;
  completed: boolean;
}

export interface SecretariatRequest {
  id: string;
  userId: string;
  studentName: string;
  documentCpf: string;
  type: 'declaracao_matricula' | 'segunda_via_certificado' | 'historico_completo' | 'atestado_frequencia';
  courseTitle: string;
  status: 'pending' | 'ready' | 'delivered';
  requestedAt: string;
  deliveryDate?: string;
  validationCode: string;
  digitalSignature: string;
}

export interface FacultyMember {
  id: string;
  name: string;
  title: string;
  department: 'Diretoria' | 'Mecânica Têxtil' | 'Gestão & Contabilidade' | 'SOE' | 'Secretaria';
  bio: string;
  avatarInitials: string;
  rating: number;
  studentsTaught: number;
  experienceYears: number;
  contactWhatsApp: string;
}

export interface CourseTestimonial {
  id: string;
  courseId: string;
  studentName: string;
  location: string;
  quote: string;
  outcome: string;
  rating: number;
  avatarInitials: string;
}

export interface StudentAddress {
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface StudentComprehensiveProfile {
  id: string;
  userId: string;
  fullName: string;
  socialName?: string;
  documentCpf: string;
  documentRg: string;
  rgIssuer: string;
  rgUf: string;
  birthDate: string;
  gender: 'masculino' | 'feminino' | 'outro' | 'nao_informar';
  maritalStatus: 'solteiro' | 'casado' | 'divorciado' | 'viuvo' | 'uniao_estavel';
  nationality: string;
  birthPlace: string;
  motherName: string;
  fatherName?: string;
  address: StudentAddress;
  phonePrimary: string;
  phoneSecondary?: string;
  email: string;
  functionalId: string; // Matrícula Funcional do Aluno/Trabalhador
  jobTitle: string; // Função / Cargo Profissional
  companyName: string; // Empresa / Vínculo
  companyCnpj?: string;
  professionalCouncilReg?: string; // CFT, CRC, etc.
  pisPasep?: string;
  admissionDate?: string;
  employmentType: 'clt' | 'pj_mei' | 'autonomo' | 'estudante' | 'servidor';
  priorEducationLevel: 'fundamental' | 'medio' | 'superior_incompleto' | 'superior_completo' | 'pos_graduacao';
  priorSchoolName: string;
  priorGraduationYear: number;
  courseId: string;
  classCohort: string;
  lgpdConsent: boolean;
  contractAccepted: boolean;
  enrolledAt: string;
  registrationCode: string;
  status: 'active' | 'graduated' | 'suspended';
}

export interface LuizaExecutiveAction {
  id: string;
  timestamp: string;
  actionType: 'add_course' | 'add_module' | 'remove_module' | 'edit_script_line' | 'simulate_role' | 'register_student' | 'issue_soe_report';
  description: string;
  targetEntity: string;
  status: 'applied' | 'pending';
  appliedBy: 'Luiza Souza';
}

export interface SystemConfig {
  // Mercado Pago
  mpAccessToken: string;
  mpPublicKey: string;
  mpWebhookSecret: string;
  mpSandboxMode: boolean;

  // WhatsApp API (Baileys via git)
  whatsappNumber: string; // 21 996134073
  baileysApiUrl: string;
  baileysApiKey: string;
  baileysSessionName: string;
  baileysAutoNotifyEnrollment: boolean;
  baileysAutoNotifyCertificate: boolean;

  // E-mail (PHPMailer / SMTP)
  smtpHost: string;
  smtpPort: number;
  smtpSecure: 'tls' | 'ssl' | 'none';
  smtpUser: string;
  smtpPassword: string;
  smtpFromName: string;
  smtpFromEmail: string;

  // PostgreSQL Database
  dbHost: string;
  dbPort: number;
  dbName: string;
  dbUser: string;
  dbPassword: string;
  dbSslMode: 'prefer' | 'require' | 'disable';
}
