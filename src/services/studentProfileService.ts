import { StudentComprehensiveProfile } from '../types/lms';
import { LMSStorageService } from './storage';

const STORAGE_KEY_PROFILES = 'lms_eloizio_student_profiles';

const initialStudentProfiles: StudentComprehensiveProfile[] = [
  {
    id: 'prof-student-01',
    userId: 'user-student-01',
    fullName: 'Lucas Mendes de Oliveira',
    socialName: '',
    documentCpf: '556.778.990-12',
    documentRg: '24.891.302-7',
    rgIssuer: 'DETRAN/DIC',
    rgUf: 'RJ',
    birthDate: '1998-05-14',
    gender: 'masculino',
    maritalStatus: 'solteiro',
    nationality: 'Brasileira',
    birthPlace: 'São Gonçalo / RJ',
    motherName: 'Maria Aparecida Mendes de Oliveira',
    fatherName: 'José Carlos de Oliveira',
    address: {
      cep: '24440-410',
      street: 'Rua Doutor Alfredo Backer',
      number: '482',
      complement: 'Apto 204 Bloco B',
      neighborhood: 'Alcântara',
      city: 'São Gonçalo',
      state: 'RJ'
    },
    phonePrimary: '(21) 97333-4455',
    phoneSecondary: '(21) 2601-8890',
    email: 'lucas.aluno@gmail.com',
    functionalId: 'FUNC-MEC-2026-089',
    jobTitle: 'Auxiliar de Mecânica Têxtil',
    companyName: 'Confecções Leste Fluminense LTDA',
    companyCnpj: '12.345.678/0001-90',
    professionalCouncilReg: 'CFT-RJ 84920-T',
    pisPasep: '128.49021.44-8',
    admissionDate: '2024-03-01',
    employmentType: 'clt',
    priorEducationLevel: 'medio',
    priorSchoolName: 'Colégio Estadual Pandiá Calógeras (São Gonçalo)',
    priorGraduationYear: 2016,
    courseId: 'course-mecanica-costura-01',
    classCohort: 'Turma MC-2026.1 Noturno Intensivo',
    lgpdConsent: true,
    contractAccepted: true,
    enrolledAt: '2026-02-01T14:30:00.000Z',
    registrationCode: 'REG-ELO-2026-089-SG',
    status: 'active'
  }
];

export class StudentProfileService {
  static getProfiles(): StudentComprehensiveProfile[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PROFILES);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(initialStudentProfiles));
        return initialStudentProfiles;
      }
      return JSON.parse(stored);
    } catch {
      return initialStudentProfiles;
    }
  }

  static getProfileByUserId(userId: string): StudentComprehensiveProfile | undefined {
    const profiles = this.getProfiles();
    return profiles.find(p => p.userId === userId);
  }

  static getProfileById(id: string): StudentComprehensiveProfile | undefined {
    const profiles = this.getProfiles();
    return profiles.find(p => p.id === id);
  }

  static saveProfile(profile: StudentComprehensiveProfile): StudentComprehensiveProfile {
    const profiles = this.getProfiles();
    const index = profiles.findIndex(p => p.id === profile.id || p.userId === profile.userId);
    
    if (index >= 0) {
      profiles[index] = profile;
    } else {
      profiles.unshift(profile);
    }
    
    localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(profiles));
    
    // Registrar log de auditoria
    LMSStorageService.addAuditLog(
      'STUDENT_COMPREHENSIVE_REGISTERED',
      'student_profile',
      profile.id,
      `Ficha cadastral completa e identificação funcional registrada para ${profile.fullName} (CPF: ${profile.documentCpf}).`
    );

    return profile;
  }

  static generateRegistrationCode(): string {
    const random = Math.floor(10000 + Math.random() * 90000);
    return `REG-ELO-2026-${random}-SG`;
  }

  static generateFunctionalId(prefix = 'FUNC-MEC'): string {
    const random = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-2026-${random}`;
  }
}
