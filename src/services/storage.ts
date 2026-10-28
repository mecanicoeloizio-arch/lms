import {
  Institution,
  User,
  UserRole,
  Course,
  Enrollment,
  LessonProgress,
  Assessment,
  AssessmentAttempt,
  Certificate,
  StudentCard,
  Badge,
  Order,
  Transaction,
  AuditLog,
  WebhookLog,
  LibraryResource,
  FacultyMember,
  SecretariatRequest,
  StudyPlanDay,
  CourseTestimonial,
  SystemConfig
} from '../types/lms';
import {
  initialInstitution,
  initialUsers,
  initialCourses,
  initialAssessments,
  initialEnrollments,
  initialLessonProgress,
  initialCertificates,
  initialStudentCards,
  initialBadges,
  initialOrders,
  initialTransactions,
  initialAuditLogs,
  initialLibraryResources,
  initialFaculty,
  initialSecretariatRequests,
  initialTestimonials
} from '../data/initialData';

const STORAGE_KEYS = {
  INSTITUTION: 'lms_eloizio_institution',
  USERS: 'lms_eloizio_users',
  ACTIVE_USER_ID: 'lms_eloizio_active_user_id',
  COURSES: 'lms_eloizio_courses',
  ASSESSMENTS: 'lms_eloizio_assessments',
  ATTEMPTS: 'lms_eloizio_attempts',
  ENROLLMENTS: 'lms_eloizio_enrollments',
  LESSON_PROGRESS: 'lms_eloizio_lesson_progress',
  CERTIFICATES: 'lms_eloizio_certificates',
  STUDENT_CARDS: 'lms_eloizio_student_cards',
  BADGES: 'lms_eloizio_badges',
  ORDERS: 'lms_eloizio_orders',
  TRANSACTIONS: 'lms_eloizio_transactions',
  WEBHOOK_LOGS: 'lms_eloizio_webhook_logs',
  AUDIT_LOGS: 'lms_eloizio_audit_logs',
  MP_ACCESS_TOKEN: 'lms_eloizio_mp_token',
  MP_SANDBOX_MODE: 'lms_eloizio_mp_sandbox',
  LIBRARY_RESOURCES: 'lms_eloizio_library',
  FACULTY: 'lms_eloizio_faculty',
  SECRETARIAT_REQUESTS: 'lms_eloizio_secretariat_requests',
  STUDY_PLANS: 'lms_eloizio_study_plans',
  SYSTEM_CONFIG: 'lms_eloizio_system_config'
};

function getItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error(`Error loading key ${key} from storage:`, e);
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing key ${key} to storage:`, e);
  }
}

export const defaultSystemConfig: SystemConfig = {
  mpAccessToken: 'APP_USR-849102938475-021014-9b8c2e1f4a3d5e6f7a8b9c0d1e2f3a4b-192837465',
  mpPublicKey: 'APP_USR-7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d',
  mpWebhookSecret: 'eloizio_sec_whk_2026_996134073_hmac',
  mpSandboxMode: true,

  whatsappNumber: '21 996134073',
  baileysApiUrl: 'http://localhost:8080/api/baileys',
  baileysApiKey: 'baileys_eloizio_token_21996134073',
  baileysSessionName: 'central_grupo_eloizio',
  baileysAutoNotifyEnrollment: true,
  baileysAutoNotifyCertificate: true,

  smtpHost: 'smtp.gmail.com',
  smtpPort: 587,
  smtpSecure: 'tls',
  smtpUser: 'contato@grupoeloizio.com.br',
  smtpPassword: 'app_pwd_eloizio_2026',
  smtpFromName: 'Grupo Eloizio - Academy',
  smtpFromEmail: 'contato@grupoeloizio.com.br',

  dbHost: 'localhost',
  dbPort: 5432,
  dbName: 'lms_eloizio_db',
  dbUser: 'postgres',
  dbPassword: 'postgres_password_2026',
  dbSslMode: 'prefer'
};

export class LMSStorageService {
  // --- Instituição ---
  static getInstitution(): Institution {
    return getItem<Institution>(STORAGE_KEYS.INSTITUTION, initialInstitution);
  }

  static updateInstitution(inst: Partial<Institution>): Institution {
    const current = this.getInstitution();
    const updated = { ...current, ...inst };
    setItem(STORAGE_KEYS.INSTITUTION, updated);
    this.addAuditLog('INSTITUTION_UPDATED', 'institutions', updated.id, 'Dados da instituição atualizados.');
    return updated;
  }

  // --- Usuários e RBAC ---
  static getUsers(): User[] {
    return getItem<User[]>(STORAGE_KEYS.USERS, initialUsers);
  }

  static getActiveUser(): User {
    const users = this.getUsers();
    const activeId = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER_ID);
    const found = users.find(u => u.id === activeId);
    return found || users[0]; // fallback para o superadmin
  }

  static setActiveUser(userId: string): User {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ID, userId);
    const active = this.getActiveUser();
    this.addAuditLog('USER_IMPERSONATED', 'users', userId, `Sessão alterada para perfil ${active.role} (${active.name})`);
    return active;
  }

  static switchRole(role: UserRole): User {
    const users = this.getUsers();
    const targetUser = users.find(u => u.role === role);
    if (targetUser) {
      return this.setActiveUser(targetUser.id);
    }
    return this.getActiveUser();
  }

  // --- Cursos ---
  static getCourses(): Course[] {
    return getItem<Course[]>(STORAGE_KEYS.COURSES, initialCourses);
  }

  static getCourseById(id: string): Course | undefined {
    return this.getCourses().find(c => c.id === id);
  }

  static saveCourse(course: Course): Course {
    const courses = this.getCourses();
    const index = courses.findIndex(c => c.id === course.id);
    if (index >= 0) {
      courses[index] = course;
      this.addAuditLog('COURSE_UPDATED', 'courses', course.id, `Curso "${course.title}" atualizado.`);
    } else {
      courses.unshift(course);
      this.addAuditLog('COURSE_CREATED', 'courses', course.id, `Curso "${course.title}" criado.`);
    }
    setItem(STORAGE_KEYS.COURSES, courses);
    return course;
  }

  static deleteCourse(id: string): void {
    const courses = this.getCourses().filter(c => c.id !== id);
    setItem(STORAGE_KEYS.COURSES, courses);
    this.addAuditLog('COURSE_DELETED', 'courses', id, `Curso ID ${id} excluído.`);
  }

  // --- Matrículas e Progresso ---
  static getEnrollments(): Enrollment[] {
    return getItem<Enrollment[]>(STORAGE_KEYS.ENROLLMENTS, initialEnrollments);
  }

  static getUserEnrollments(userId: string): Enrollment[] {
    return this.getEnrollments().filter(e => e.userId === userId);
  }

  static getEnrollment(userId: string, courseId: string): Enrollment | undefined {
    return this.getEnrollments().find(e => e.userId === userId && e.courseId === courseId);
  }

  static enrollCourse(courseId: string, userId: string): Enrollment {
    const enrollments = this.getEnrollments();
    let existing = enrollments.find(e => e.userId === userId && e.courseId === courseId);
    if (!existing) {
      existing = {
        id: 'enr-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        userId,
        courseId,
        status: 'active',
        progressPercent: 0,
        enrolledAt: new Date().toISOString()
      };
      enrollments.unshift(existing);
      setItem(STORAGE_KEYS.ENROLLMENTS, enrollments);
      this.addAuditLog('ENROLLMENT_CREATED', 'enrollment', existing.id, 'Matricula efetuada para usuario ' + userId + ' no curso ' + courseId);
    }
    return existing;
  }

  static getLessonProgress(): LessonProgress[] {
    return getItem<LessonProgress[]>(STORAGE_KEYS.LESSON_PROGRESS, initialLessonProgress);
  }

  static toggleLessonProgress(enrollmentId: string, lessonId: string, completed: boolean): { enrollment: Enrollment; progressPercent: number } {
    const progressList = this.getLessonProgress();
    let entry = progressList.find(p => p.enrollmentId === enrollmentId && p.lessonId === lessonId);

    if (entry) {
      entry.completed = completed;
      entry.completedAt = completed ? new Date().toISOString() : undefined;
    } else {
      entry = {
        id: `lp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        enrollmentId,
        lessonId,
        completed,
        completedAt: completed ? new Date().toISOString() : undefined,
        secondsWatched: completed ? 600 : 0
      };
      progressList.push(entry);
    }
    setItem(STORAGE_KEYS.LESSON_PROGRESS, progressList);

    // Recalcular porcentagem total do curso
    const enrollments = this.getEnrollments();
    const enrollment = enrollments.find(e => e.id === enrollmentId);
    if (enrollment) {
      const course = this.getCourseById(enrollment.courseId);
      if (course) {
        const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
        if (totalLessons > 0) {
          const completedCount = course.modules
            .flatMap(m => m.lessons)
            .filter(l => progressList.some(p => p.enrollmentId === enrollmentId && p.lessonId === l.id && p.completed))
            .length;
          
          enrollment.progressPercent = Math.min(100, Math.round((completedCount / totalLessons) * 100));
          if (enrollment.progressPercent === 100 && enrollment.status !== 'completed') {
            enrollment.status = 'completed';
            enrollment.completedAt = new Date().toISOString();
            // Emitir certificado automaticamente se aprovado
            this.issueCertificateIfEligible(enrollment);
          }
          setItem(STORAGE_KEYS.ENROLLMENTS, enrollments);
          return { enrollment, progressPercent: enrollment.progressPercent };
        }
      }
    }

    return { enrollment: enrollment!, progressPercent: enrollment?.progressPercent || 0 };
  }

  // --- Avaliações ---
  static getAssessments(): Assessment[] {
    return getItem<Assessment[]>(STORAGE_KEYS.ASSESSMENTS, initialAssessments);
  }

  static getAttempts(): AssessmentAttempt[] {
    return getItem<AssessmentAttempt[]>(STORAGE_KEYS.ATTEMPTS, []);
  }

  static submitAssessmentAttempt(assessmentId: string, userId: string, answers: Record<string, string>): AssessmentAttempt {
    const assessment = this.getAssessments().find(a => a.id === assessmentId);
    if (!assessment) throw new Error('Avaliação não encontrada.');

    let correctCount = 0;
    const totalQuestions = assessment.questions.length;

    assessment.questions.forEach(q => {
      const selectedOptionId = answers[q.id];
      const correctOption = q.options.find(o => o.isCorrect);
      if (selectedOptionId && correctOption && selectedOptionId === correctOption.id) {
        correctCount += 1;
      }
    });

    const score = Number(((correctCount / (totalQuestions || 1)) * 10).toFixed(1));
    const passed = score >= assessment.passingGrade;

    const attempt: AssessmentAttempt = {
      id: `att-${Date.now()}`,
      assessmentId,
      userId,
      score,
      passed,
      startedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      finishedAt: new Date().toISOString(),
      answers
    };

    const attempts = this.getAttempts();
    attempts.unshift(attempt);
    setItem(STORAGE_KEYS.ATTEMPTS, attempts);

    // Atualizar enrollment nota
    const enrollments = this.getEnrollments();
    const enrollment = enrollments.find(e => e.userId === userId && e.courseId === assessment.courseId);
    if (enrollment) {
      enrollment.finalGrade = Math.max(enrollment.finalGrade || 0, score);
      setItem(STORAGE_KEYS.ENROLLMENTS, enrollments);
      if (enrollment.progressPercent === 100 && passed) {
        this.issueCertificateIfEligible(enrollment);
      }
    }

    this.addAuditLog('ASSESSMENT_SUBMITTED', 'assessments', assessmentId, `Tentativa registrada. Nota: ${score} (${passed ? 'Aprovado' : 'Reprovado'})`);
    return attempt;
  }

  // --- Certificados ---
  static getCertificates(): Certificate[] {
    return getItem<Certificate[]>(STORAGE_KEYS.CERTIFICATES, initialCertificates);
  }

  static issueCertificateIfEligible(enrollment: Enrollment): Certificate | null {
    const certs = this.getCertificates();
    const existing = certs.find(c => c.enrollmentId === enrollment.id && !c.revoked);
    if (existing) return existing;

    const user = this.getUsers().find(u => u.id === enrollment.userId);
    const course = this.getCourseById(enrollment.courseId);
    const inst = this.getInstitution();

    if (!user || !course) return null;

    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const validationCode = `ELO-${new Date().getFullYear()}-${randomSuffix}`;

    const newCert: Certificate = {
      id: `cert-${Date.now()}`,
      enrollmentId: enrollment.id,
      userId: user.id,
      courseId: course.id,
      validationCode,
      studentName: user.name,
      courseTitle: course.title,
      durationHours: course.durationHours,
      issuedAt: new Date().toISOString(),
      conclusionDate: new Date().toLocaleDateString('pt-BR'),
      institutionName: inst.name,
      institutionCnpj: inst.documentCnpj,
      signerName: inst.signatureName,
      signerRole: inst.signatureRole,
      revoked: false
    };

    certs.unshift(newCert);
    setItem(STORAGE_KEYS.CERTIFICATES, certs);
    this.addAuditLog('CERTIFICATE_ISSUED', 'certificates', newCert.id, `Certificado ${validationCode} emitido para ${user.name}`);
    return newCert;
  }

  static revokeCertificate(certId: string, reason: string): Certificate | null {
    const certs = this.getCertificates();
    const cert = certs.find(c => c.id === certId);
    if (cert) {
      cert.revoked = true;
      cert.revocationReason = reason;
      cert.revocationDate = new Date().toISOString();
      setItem(STORAGE_KEYS.CERTIFICATES, certs);
      this.addAuditLog('CERTIFICATE_REVOKED', 'certificates', cert.id, `Certificado ${cert.validationCode} revogado. Motivo: ${reason}`);
      return cert;
    }
    return null;
  }

  static revalidateCertificate(certId: string): Certificate | null {
    const certs = this.getCertificates();
    const cert = certs.find(c => c.id === certId);
    if (cert) {
      cert.revoked = false;
      cert.revocationReason = undefined;
      cert.revocationDate = undefined;
      setItem(STORAGE_KEYS.CERTIFICATES, certs);
      this.addAuditLog('CERTIFICATE_RESTORED', 'certificates', cert.id, `Certificado ${cert.validationCode} restaurado.`);
      return cert;
    }
    return null;
  }

  // --- Carteirinhas e Crachás ---
  static getStudentCards(): StudentCard[] {
    return getItem<StudentCard[]>(STORAGE_KEYS.STUDENT_CARDS, initialStudentCards);
  }

  static getBadges(): Badge[] {
    return getItem<Badge[]>(STORAGE_KEYS.BADGES, initialBadges);
  }

  // --- Pedidos & Mercado Pago ---
  static getOrders(): Order[] {
    return getItem<Order[]>(STORAGE_KEYS.ORDERS, initialOrders);
  }

  static getTransactions(): Transaction[] {
    return getItem<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, initialTransactions);
  }

  static getWebhookLogs(): WebhookLog[] {
    return getItem<WebhookLog[]>(STORAGE_KEYS.WEBHOOK_LOGS, []);
  }

  static createOrder(userId: string, courseId: string, paymentMethod: 'pix' | 'credit_card' | 'boleto', installments = 1): Order {
    const course = this.getCourseById(courseId);
    if (!course) throw new Error('Curso não encontrado.');

    const orderId = `ord-mp-${Date.now()}`;
    const mpPaymentId = `mp-pay-${Math.floor(1000000000 + Math.random() * 9000000000)}`;

    // Gerador dinâmico de payload Pix Copia e Cola padrão BR Code
    const cleanCnpj = '38412985000144';
    const amountStr = course.priceBrl.toFixed(2);
    const pixCopiaECola = `00020126580014br.gov.bcb.pix0136${cleanCnpj}520400005303986540${amountStr.length < 10 ? '0' + amountStr.length : amountStr.length}${amountStr}5802BR5913GRUPO ELOIZIO6012SAO GONCALO62070503***6304${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const order: Order = {
      id: orderId,
      userId,
      courseId,
      courseTitle: course.title,
      amountBrl: course.priceBrl,
      status: 'pending',
      paymentMethod,
      mpPaymentId,
      pixCopiaECola,
      installments,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const orders = this.getOrders();
    orders.unshift(order);
    setItem(STORAGE_KEYS.ORDERS, orders);

    this.addAuditLog('ORDER_CREATED', 'orders', order.id, `Pedido #${order.id} gerado para ${course.title} (R$ ${course.priceBrl.toFixed(2)}) via ${paymentMethod.toUpperCase()}`);
    return order;
  }

  static approveOrder(orderId: string): { order: Order; enrollment: Enrollment } {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) throw new Error('Pedido não encontrado.');

    order.status = 'approved';
    order.updatedAt = new Date().toISOString();
    setItem(STORAGE_KEYS.ORDERS, orders);

    // Registrar transação
    const transactions = this.getTransactions();
    const tx: Transaction = {
      id: `tx-${Date.now()}`,
      orderId: order.id,
      mpPaymentId: order.mpPaymentId || `mp-${Date.now()}`,
      status: 'approved',
      statusDetail: 'accredited',
      amount: order.amountBrl,
      paymentMethod: order.paymentMethod,
      idempotencyKey: `idemp-${order.id}-approved`,
      rawPayload: JSON.stringify({ action: 'payment.updated', status: 'approved', id: order.mpPaymentId }),
      createdAt: new Date().toISOString()
    };
    transactions.unshift(tx);
    setItem(STORAGE_KEYS.TRANSACTIONS, transactions);

    // Liberação automática da matrícula!
    const enrollments = this.getEnrollments();
    let enrollment = enrollments.find(e => e.userId === order.userId && e.courseId === order.courseId);

    if (enrollment) {
      enrollment.status = 'active';
    } else {
      enrollment = {
        id: `enr-${Date.now()}`,
        userId: order.userId,
        courseId: order.courseId,
        status: 'active',
        progressPercent: 0,
        enrolledAt: new Date().toISOString()
      };
      enrollments.unshift(enrollment);
    }
    setItem(STORAGE_KEYS.ENROLLMENTS, enrollments);

    this.addAuditLog('PAYMENT_APPROVED', 'orders', order.id, `Pagamento aprovado no Mercado Pago. Matrícula liberada automaticamente para o curso ${order.courseTitle}.`);
    return { order, enrollment };
  }

  static processWebhookSimulation(mpPaymentId: string, action: string, status: string): { success: boolean; isDuplicate: boolean; message: string } {
    const logs = this.getWebhookLogs();
    const idempotencyKey = `webhook-mp-${mpPaymentId}-${status}`;
    const isDuplicate = logs.some(l => l.idempotencyKey === idempotencyKey);

    const logEntry: WebhookLog = {
      id: `whl-${Date.now()}`,
      receivedAt: new Date().toISOString(),
      topic: 'payment',
      action,
      dataId: mpPaymentId,
      idempotencyKey,
      isDuplicate,
      status: isDuplicate ? 'ignored' : 'processed',
      rawBody: JSON.stringify({ id: mpPaymentId, action, data: { id: mpPaymentId }, date_created: new Date().toISOString() })
    };

    logs.unshift(logEntry);
    setItem(STORAGE_KEYS.WEBHOOK_LOGS, logs);

    if (isDuplicate) {
      this.addAuditLog('WEBHOOK_IDEMPOTENT_IGNORED', 'webhooks', mpPaymentId, `Webhook duplicado com chave ${idempotencyKey} ignorado sem alterar banco.`);
      return { success: true, isDuplicate: true, message: 'Evento duplicado detectado. Processamento idempotente preservou integridade.' };
    }

    // Se não for duplicado e for aprovação, aprovar pedido
    const orders = this.getOrders();
    const order = orders.find(o => o.mpPaymentId === mpPaymentId);
    if (order && status === 'approved') {
      this.approveOrder(order.id);
    }

    return { success: true, isDuplicate: false, message: 'Webhook recebido e processado com sucesso. Status sincronizado.' };
  }

  // --- Auditoria ---
  static getAuditLogs(): AuditLog[] {
    return getItem<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, initialAuditLogs);
  }

  static addAuditLog(action: string, entity: string, entityId: string, details: string): void {
    const active = this.getActiveUser();
    const log: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      userId: active?.id || 'sys',
      userName: active?.name || 'Sistema',
      userRole: active?.role || 'superadmin',
      action,
      entity,
      entityId,
      details,
      timestamp: new Date().toISOString()
    };
    const logs = this.getAuditLogs();
    logs.unshift(log);
    setItem(STORAGE_KEYS.AUDIT_LOGS, logs.slice(0, 200)); // Limite de 200 logs
  }

  // --- Biblioteca Virtual & Acervo Técnico ---
  static getLibraryResources(): LibraryResource[] {
    return getItem<LibraryResource[]>(STORAGE_KEYS.LIBRARY_RESOURCES, initialLibraryResources);
  }

  static downloadLibraryResource(id: string): LibraryResource | null {
    const list = this.getLibraryResources();
    const item = list.find(r => r.id === id);
    if (item) {
      item.downloadsCount += 1;
      setItem(STORAGE_KEYS.LIBRARY_RESOURCES, list);
      this.addAuditLog('LIBRARY_DOWNLOAD', 'library', item.id, `Manual/Apostila "${item.title}" baixado.`);
      return item;
    }
    return null;
  }

  // --- Corpo Docente, Diretoria & SOE ---
  static getFaculty(): FacultyMember[] {
    return getItem<FacultyMember[]>(STORAGE_KEYS.FACULTY, initialFaculty);
  }

  // --- Secretaria Online & Declarações Oficiais ---
  static getSecretariatRequests(): SecretariatRequest[] {
    return getItem<SecretariatRequest[]>(STORAGE_KEYS.SECRETARIAT_REQUESTS, initialSecretariatRequests);
  }

  static requestDocument(
    userId: string,
    studentName: string,
    documentCpf: string,
    type: 'declaracao_matricula' | 'segunda_via_certificado' | 'historico_completo' | 'atestado_frequencia',
    courseTitle: string
  ): SecretariatRequest {
    const requests = this.getSecretariatRequests();
    const code = `DEC-ELO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newReq: SecretariatRequest = {
      id: `req-${Date.now()}`,
      userId,
      studentName,
      documentCpf,
      type,
      courseTitle,
      status: 'ready', // Imediato para declaração de matrícula no padrão ouro!
      requestedAt: new Date().toISOString(),
      deliveryDate: new Date().toISOString(),
      validationCode: code,
      digitalSignature: 'Juliana Santos · Secretária Geral (Portaria Oficial 04/2026)'
    };

    requests.unshift(newReq);
    setItem(STORAGE_KEYS.SECRETARIAT_REQUESTS, requests);
    this.addAuditLog('SECRETARIAT_DOC_ISSUED', 'secretariat', newReq.id, `Documento ${type} emitido para ${studentName} (Código: ${code})`);
    return newReq;
  }

  // --- Depoimentos & Prova Social de Alta Conversão ---
  static getTestimonials(): CourseTestimonial[] {
    return initialTestimonials;
  }

  // --- SOE: Plano de Estudos Adaptativo (Orientação Educacional) ---
  static getStudyPlanDays(): StudyPlanDay[] {
    const defaultDays: StudyPlanDay[] = [
      {
        dayNumber: 1,
        title: 'Dia 1: Anatomia da Máquina Reta e Chaves de Fenda Imantadas',
        durationMinutes: 30,
        lessonReference: '1.1 Apresentação e Anatomia',
        tips: 'Separe uma bancada limpa e uma chave de fenda 1/8 imantada para não perder parafusos miúdos.',
        completed: true
      },
      {
        dayNumber: 2,
        title: 'Dia 2: Bomba de Óleo, Filtros e Prevenção de Travamentos',
        durationMinutes: 30,
        lessonReference: '1.3 Sistema de Lubrificação',
        tips: 'Verifique se o visor de acrílico borbulha óleo quando a polia é girada com o pedal.',
        completed: true
      },
      {
        dayNumber: 3,
        title: 'Dia 3: Altura Exata da Barra da Agulha (Traçado de Fábrica)',
        durationMinutes: 40,
        lessonReference: '2.1 Altura da Barra da Agulha',
        tips: 'Atenção aos dois riscos na barra da agulha: o risco superior alinha no topo do mancal.',
        completed: true
      },
      {
        dayNumber: 4,
        title: 'Dia 4: Ponto de Laçada e Folga Lateral de 0.05mm a 0.1mm',
        durationMinutes: 45,
        lessonReference: '2.2 Ponto de Laçada',
        tips: 'Use uma folha de papel fino de 75g dobrada como calibrador improvisado caso não tenha cálibre.',
        completed: false
      },
      {
        dayNumber: 5,
        title: 'Dia 5: Regulagem de Dentes Impelentes e Transporte Suave',
        durationMinutes: 30,
        lessonReference: '2.3 Dentes Impelentes',
        tips: 'Os dentes devem ultrapassar a chapa em 0.8mm a 1.0mm no ponto mais alto.',
        completed: false
      },
      {
        dayNumber: 6,
        title: 'Dia 6: Cruzamento de Loopers da Overloque 3 e 4 Fios',
        durationMinutes: 45,
        lessonReference: '3.1 Overloque: Cruzamento dos Loopers',
        tips: 'Nunca force os loopers manualmente com alicate comum; ajuste sempre pela porca sextavada.',
        completed: false
      },
      {
        dayNumber: 7,
        title: 'Dia 7: Afiação e Ajuste de Facas + Simulado de Prova Teórica',
        durationMinutes: 50,
        lessonReference: '3.2 Facas e Avaliação Final',
        tips: 'Faça o teste de corte da linha com tesoura cega antes de mexer na mola da faca superior.',
        completed: false
      }
    ];

    return getItem<StudyPlanDay[]>(STORAGE_KEYS.STUDY_PLANS, defaultDays);
  }

  static toggleStudyPlanDay(dayNumber: number): StudyPlanDay[] {
    const days = this.getStudyPlanDays();
    const day = days.find(d => d.dayNumber === dayNumber);
    if (day) {
      day.completed = !day.completed;
      setItem(STORAGE_KEYS.STUDY_PLANS, days);
      this.addAuditLog('SOE_STUDY_PLAN_TOGGLED', 'study_plan', `day-${dayNumber}`, `Dia ${dayNumber} do plano de estudos marcado como ${day.completed ? 'concluído' : 'pendente'}.`);
    }
    return days;
  }




  // --- Reset Geral de Demonstração ---
  static resetToDefault(): void {
    localStorage.clear();
    setItem(STORAGE_KEYS.INSTITUTION, initialInstitution);
    setItem(STORAGE_KEYS.USERS, initialUsers);
    setItem(STORAGE_KEYS.ACTIVE_USER_ID, initialUsers[0].id);
    setItem(STORAGE_KEYS.COURSES, initialCourses);
    setItem(STORAGE_KEYS.ASSESSMENTS, initialAssessments);
    setItem(STORAGE_KEYS.ENROLLMENTS, initialEnrollments);
    setItem(STORAGE_KEYS.LESSON_PROGRESS, initialLessonProgress);
    setItem(STORAGE_KEYS.CERTIFICATES, initialCertificates);
    setItem(STORAGE_KEYS.STUDENT_CARDS, initialStudentCards);
    setItem(STORAGE_KEYS.BADGES, initialBadges);
    setItem(STORAGE_KEYS.ORDERS, initialOrders);
    setItem(STORAGE_KEYS.TRANSACTIONS, initialTransactions);
    setItem(STORAGE_KEYS.AUDIT_LOGS, initialAuditLogs);
    setItem(STORAGE_KEYS.LIBRARY_RESOURCES, initialLibraryResources);
    setItem(STORAGE_KEYS.FACULTY, initialFaculty);
    setItem(STORAGE_KEYS.SECRETARIAT_REQUESTS, initialSecretariatRequests);
  }

  // --- Configurações do Sistema (Mercado Pago, Baileys WhatsApp, PHPMailer, PostgreSQL) ---
  static getSystemConfig(): SystemConfig {
    return getItem<SystemConfig>(STORAGE_KEYS.SYSTEM_CONFIG, defaultSystemConfig);
  }

  static saveSystemConfig(config: SystemConfig): SystemConfig {
    setItem(STORAGE_KEYS.SYSTEM_CONFIG, config);
    this.addAuditLog('SYSTEM_CONFIG_UPDATED', 'system_config', 'global', 'Chaves e parâmetros do sistema (Mercado Pago, Baileys, PHPMailer, PostgreSQL) foram atualizados.');
    return config;
  }
}
