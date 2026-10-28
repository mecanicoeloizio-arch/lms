import React, { useState } from 'react';
import { 
  UserPlus, 
  CheckCircle2, 
  Printer, 
  QrCode, 
  ShieldCheck, 
  Briefcase, 
  GraduationCap, 
  Home, 
  FileText, 
  Sparkles,
  ArrowRight,
  BookOpen,
  UserCheck,
  CreditCard
} from 'lucide-react';
import { StudentComprehensiveProfile, Course } from '../types/lms';
import { LMSStorageService } from '../services/storage';
import { StudentProfileService } from '../services/studentProfileService';

interface StudentRegistrationFormProps {
  onEnrollmentCompleted?: (courseId: string, userId: string) => void;
  onNavigateToFinancial?: () => void;
}

export const StudentRegistrationForm: React.FC<StudentRegistrationFormProps> = ({
  onEnrollmentCompleted,
  onNavigateToFinancial
}) => {
  const courses = LMSStorageService.getCourses();
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || '');
  
  // Dados do Formulário
  const [formData, setFormData] = useState<Partial<StudentComprehensiveProfile>>({
    fullName: '',
    socialName: '',
    documentCpf: '',
    documentRg: '',
    rgIssuer: 'DETRAN',
    rgUf: 'RJ',
    birthDate: '1995-06-15',
    gender: 'masculino',
    maritalStatus: 'solteiro',
    nationality: 'Brasileira',
    birthPlace: 'São Gonçalo / RJ',
    motherName: '',
    fatherName: '',
    address: {
      cep: '24440-410',
      street: 'Rua Doutor Alfredo Backer',
      number: '480',
      complement: 'Sala 102',
      neighborhood: 'Alcântara',
      city: 'São Gonçalo',
      state: 'RJ'
    },
    phonePrimary: '',
    phoneSecondary: '',
    email: '',
    functionalId: StudentProfileService.generateFunctionalId(),
    jobTitle: 'Mecânico de Manutenção de Máquinas',
    companyName: 'Oficina Têxtil São Gonçalo',
    companyCnpj: '34.891.204/0001-55',
    professionalCouncilReg: 'CFT-RJ 91823-T',
    pisPasep: '124.89102.33-1',
    admissionDate: '2023-08-10',
    employmentType: 'clt',
    priorEducationLevel: 'medio',
    priorSchoolName: 'Colégio Estadual Pandiá Calógeras',
    priorGraduationYear: 2017,
    classCohort: 'Turma MC-2026.1 - Noturno Flex',
    lgpdConsent: true,
    contractAccepted: true
  });

  const [registeredProfile, setRegisteredProfile] = useState<StudentComprehensiveProfile | null>(null);
  const [successToast, setSuccessToast] = useState(false);

  // Preenchimento de exemplo rápido
  const handleFillSample = () => {
    setFormData({
      fullName: 'Marcos Vinicius de Souza Bastos',
      socialName: '',
      documentCpf: '389.412.870-44',
      documentRg: '28.941.502-3',
      rgIssuer: 'DETRAN',
      rgUf: 'RJ',
      birthDate: '1996-09-22',
      gender: 'masculino',
      maritalStatus: 'casado',
      nationality: 'Brasileira',
      birthPlace: 'Niterói / RJ',
      motherName: 'Silvia Helena de Souza Bastos',
      fatherName: 'Antônio Marcos Bastos',
      address: {
        cep: '24710-001',
        street: 'Avenida Jornalista Roberto Marinho',
        number: '1250',
        complement: 'Galpão 4',
        neighborhood: 'Rocha',
        city: 'São Gonçalo',
        state: 'RJ'
      },
      phonePrimary: '(21) 98455-9012',
      phoneSecondary: '(21) 2611-3040',
      email: 'marcos.bastos.costura@gmail.com',
      functionalId: StudentProfileService.generateFunctionalId(),
      jobTitle: 'Técnico em Manutenção de Máquinas Industriais',
      companyName: 'Confecções Leste Fluminense S/A',
      companyCnpj: '41.982.330/0001-92',
      professionalCouncilReg: 'CFT-RJ 78942-T',
      pisPasep: '130.49182.55-9',
      admissionDate: '2022-04-15',
      employmentType: 'clt',
      priorEducationLevel: 'medio',
      priorSchoolName: 'Ciep 240 Haroldo Barbosa',
      priorGraduationYear: 2014,
      classCohort: 'Turma MC-2026.1 - Noturno Flex',
      lgpdConsent: true,
      contractAccepted: true
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.documentCpf || !formData.email) {
      alert('Por favor, preencha pelo menos Nome Completo, CPF e E-mail.');
      return;
    }

    const selectedCourse = courses.find(c => c.id === selectedCourseId) || courses[0];

    const saved = StudentProfileService.saveProfile({
      id: `prof-${Date.now()}`,
      userId: `user-${Date.now()}`,
      fullName: formData.fullName || '',
      socialName: formData.socialName,
      documentCpf: formData.documentCpf || '',
      documentRg: formData.documentRg || '',
      rgIssuer: formData.rgIssuer || 'SSP',
      rgUf: formData.rgUf || 'RJ',
      birthDate: formData.birthDate || '1995-01-01',
      gender: formData.gender as any || 'masculino',
      maritalStatus: formData.maritalStatus as any || 'solteiro',
      nationality: formData.nationality || 'Brasileira',
      birthPlace: formData.birthPlace || 'São Gonçalo / RJ',
      motherName: formData.motherName || '',
      fatherName: formData.fatherName,
      address: formData.address || {
        cep: '24440-000',
        street: 'Rua Principal',
        number: '1',
        neighborhood: 'Centro',
        city: 'São Gonçalo',
        state: 'RJ'
      },
      phonePrimary: formData.phonePrimary || '',
      phoneSecondary: formData.phoneSecondary,
      email: formData.email || '',
      functionalId: formData.functionalId || StudentProfileService.generateFunctionalId(),
      jobTitle: formData.jobTitle || 'Técnico em Formação',
      companyName: formData.companyName || 'Autônomo',
      companyCnpj: formData.companyCnpj,
      professionalCouncilReg: formData.professionalCouncilReg,
      pisPasep: formData.pisPasep,
      admissionDate: formData.admissionDate,
      employmentType: formData.employmentType as any || 'clt',
      priorEducationLevel: formData.priorEducationLevel as any || 'medio',
      priorSchoolName: formData.priorSchoolName || '',
      priorGraduationYear: Number(formData.priorGraduationYear) || 2018,
      courseId: selectedCourse.id,
      classCohort: formData.classCohort || 'Turma 2026.1',
      lgpdConsent: true,
      contractAccepted: true,
      enrolledAt: new Date().toISOString(),
      registrationCode: StudentProfileService.generateRegistrationCode(),
      status: 'active'
    });

    // Registrar no LMS Storage
    LMSStorageService.enrollCourse(selectedCourse.id, saved.userId);

    setRegisteredProfile(saved);
    setSuccessToast(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrint = () => {
    window.print();
  };

  const selectedCourse = courses.find(c => c.id === (registeredProfile?.courseId || selectedCourseId)) || courses[0];

  return (
    <div className="space-y-6">
      {/* Cabeçalho da Seção */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-blue-50 text-blue-900 border border-blue-200 text-xs font-semibold uppercase tracking-wider mb-2">
            <UserPlus className="w-3.5 h-3.5 text-blue-700" />
            Secretaria Acadêmica & Recursos Humanos
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Ficha de Matrícula Completa & Identificação Funcional
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            Cadastro unificado para emissão de prontuário, histórico acadêmico escolar prévio, identificação funcional de colaborador/aluno e registro com QR Code de autenticação digital.
          </p>
        </div>
        
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleFillSample}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Exemplo Preenchido
          </button>
        </div>
      </div>

      {/* Alerta de Sucesso / Prontuário Emitido */}
      {registeredProfile && (
        <div className="bg-emerald-50 border-2 border-emerald-500 rounded-2xl p-6 shadow-md space-y-4 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Matrícula Concluída com Sucesso!</span>
                <h2 className="text-lg font-black text-slate-900">{registeredProfile.fullName}</h2>
                <p className="text-xs text-slate-600 font-mono">
                  Código de Registro: <strong className="text-emerald-800">{registeredProfile.registrationCode}</strong> · Matrícula Funcional: <strong className="text-blue-900">{registeredProfile.functionalId}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-4 py-2 bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                Imprimir Ficha & Crachá
              </button>
              {onNavigateToFinancial && (
                <button
                  onClick={onNavigateToFinancial}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-900 text-white hover:bg-blue-800 rounded-xl text-xs font-bold shadow-xs transition-colors"
                >
                  <CreditCard className="w-4 h-4" />
                  Ir para Pagamento Pix
                </button>
              )}
            </div>
          </div>

          {/* Cartão de Identificação Funcional e Estudantil */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-blue-900" /> Resumo do Registro Funcional & Acadêmico
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px]">Curso Matriculado:</span>
                  <strong className="text-slate-900">{selectedCourse.title}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">CPF:</span>
                  <strong className="text-slate-900">{registeredProfile.documentCpf}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">RG / Emissor:</span>
                  <strong className="text-slate-900">{registeredProfile.documentRg} ({registeredProfile.rgIssuer}/{registeredProfile.rgUf})</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Cargo / Função:</span>
                  <strong className="text-slate-900">{registeredProfile.jobTitle}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Empresa / Vínculo:</span>
                  <strong className="text-slate-900">{registeredProfile.companyName}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Reg. Profissional:</span>
                  <strong className="text-slate-900">{registeredProfile.professionalCouncilReg || 'Isento/Em Formação'}</strong>
                </div>
              </div>
            </div>

            {/* Crachá Funcional Compacto */}
            <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white rounded-xl p-4 border border-blue-800 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-[10px] font-mono tracking-widest uppercase text-blue-300">Grupo Eloizio</span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-1.5 py-0.5 rounded font-mono">
                  ATIVO 2026
                </span>
              </div>
              <div className="my-2 flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-blue-800 border border-white/20 flex items-center justify-center font-bold text-sm text-white shrink-0">
                  {registeredProfile.fullName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-xs leading-tight">{registeredProfile.fullName}</div>
                  <div className="text-[10px] text-blue-200 mt-0.5 font-mono">{registeredProfile.functionalId}</div>
                  <div className="text-[10px] text-amber-300 truncate">{registeredProfile.jobTitle}</div>
                </div>
              </div>
              <div className="flex items-center justify-between text-[10px] pt-2 border-t border-white/10 text-slate-300">
                <span>São Gonçalo - RJ</span>
                <span className="font-mono">{registeredProfile.registrationCode}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Formulário de Cadastro Completo */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-8">
        {/* Bloco 1: Seleção do Curso & Turma */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <BookOpen className="w-5 h-5 text-blue-900" />
            <h2 className="text-base font-bold text-slate-900">1. Curso Pretendido & Turma</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Curso Disponível *
              </label>
              <select
                value={selectedCourseId}
                onChange={e => setSelectedCourseId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-900"
              >
                {courses.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.title} — {c.durationHours}h (R$ {c.priceBrl.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Turma / Modalidade de Ingresso *
              </label>
              <input
                type="text"
                value={formData.classCohort}
                onChange={e => setFormData({ ...formData, classCohort: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-900"
                placeholder="Ex: Turma 2026.1 - Online Flexível"
              />
            </div>
          </div>
        </section>

        {/* Bloco 2: Dados Pessoais & Documentação Civil */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <UserPlus className="w-5 h-5 text-blue-900" />
            <h2 className="text-base font-bold text-slate-900">2. Identificação Civil & Dados Pessoais</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Nome Completo (Conforme Certidão/RG) *
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-900"
                placeholder="Nome completo do aluno"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Nome Social (Opcional)
              </label>
              <input
                type="text"
                value={formData.socialName || ''}
                onChange={e => setFormData({ ...formData, socialName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-900"
                placeholder="Nome social se aplicável"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                CPF (com validação) *
              </label>
              <input
                type="text"
                required
                value={formData.documentCpf}
                onChange={e => setFormData({ ...formData, documentCpf: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-900 font-mono"
                placeholder="000.000.000-00"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Documento de Identidade (RG) *
              </label>
              <input
                type="text"
                value={formData.documentRg}
                onChange={e => setFormData({ ...formData, documentRg: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-900 font-mono"
                placeholder="Ex: 24.891.302-7"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Órgão Emissor / UF *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.rgIssuer}
                  onChange={e => setFormData({ ...formData, rgIssuer: e.target.value })}
                  className="w-2/3 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  placeholder="DETRAN / SSP"
                />
                <input
                  type="text"
                  value={formData.rgUf}
                  onChange={e => setFormData({ ...formData, rgUf: e.target.value })}
                  className="w-1/3 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-900 uppercase font-mono"
                  placeholder="RJ"
                  maxLength={2}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Data de Nascimento *
              </label>
              <input
                type="date"
                value={formData.birthDate}
                onChange={e => setFormData({ ...formData, birthDate: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Gênero
              </label>
              <select
                value={formData.gender}
                onChange={e => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-900"
              >
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
                <option value="outro">Outro</option>
                <option value="nao_informar">Prefiro não informar</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Estado Civil
              </label>
              <select
                value={formData.maritalStatus}
                onChange={e => setFormData({ ...formData, maritalStatus: e.target.value as any })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-900"
              >
                <option value="solteiro">Solteiro(a)</option>
                <option value="casado">Casado(a)</option>
                <option value="uniao_estavel">União Estável</option>
                <option value="divorciado">Divorciado(a)</option>
                <option value="viuvo">Viúvo(a)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Nome da Mãe *
              </label>
              <input
                type="text"
                value={formData.motherName}
                onChange={e => setFormData({ ...formData, motherName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-900"
                placeholder="Filiação materna completa"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Nome do Pai (Opcional)
              </label>
              <input
                type="text"
                value={formData.fatherName || ''}
                onChange={e => setFormData({ ...formData, fatherName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-900"
                placeholder="Filiação paterna"
              />
            </div>
          </div>
        </section>

        {/* Bloco 3: Endereço & Meios de Contato */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Home className="w-5 h-5 text-blue-900" />
            <h2 className="text-base font-bold text-slate-900">3. Endereço Residencial & Contatos</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                CEP (com busca automática) *
              </label>
              <input
                type="text"
                value={formData.address?.cep}
                onChange={e => setFormData({
                  ...formData,
                  address: { ...formData.address!, cep: e.target.value }
                })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-900 font-mono"
                placeholder="24440-410"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Logradouro (Rua, Av, Travessa) *
              </label>
              <input
                type="text"
                value={formData.address?.street}
                onChange={e => setFormData({
                  ...formData,
                  address: { ...formData.address!, street: e.target.value }
                })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-900"
                placeholder="Rua Doutor Alfredo Backer"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Número *
              </label>
              <input
                type="text"
                value={formData.address?.number}
                onChange={e => setFormData({
                  ...formData,
                  address: { ...formData.address!, number: e.target.value }
                })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-900"
                placeholder="480"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Bairro *
              </label>
              <input
                type="text"
                value={formData.address?.neighborhood}
                onChange={e => setFormData({
                  ...formData,
                  address: { ...formData.address!, neighborhood: e.target.value }
                })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-900"
                placeholder="Alcântara"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Município *
              </label>
              <input
                type="text"
                value={formData.address?.city}
                onChange={e => setFormData({
                  ...formData,
                  address: { ...formData.address!, city: e.target.value }
                })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-900"
                placeholder="São Gonçalo"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                WhatsApp / Celular *
              </label>
              <input
                type="text"
                required
                value={formData.phonePrimary}
                onChange={e => setFormData({ ...formData, phonePrimary: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-900 font-mono"
                placeholder="(21) 99613-4073"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                E-mail Principal *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-900"
                placeholder="aluno@email.com"
              />
            </div>
          </div>
        </section>

        {/* Bloco 4: Identificação Funcional & Ocupação Profissional */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Briefcase className="w-5 h-5 text-blue-900" />
            <h2 className="text-base font-bold text-slate-900">4. Identificação Funcional & Dados Profissionais</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Matrícula Funcional (Gerada Automaticamente)
              </label>
              <input
                type="text"
                value={formData.functionalId}
                onChange={e => setFormData({ ...formData, functionalId: e.target.value })}
                className="w-full bg-slate-100 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Cargo / Ocupação Atual *
              </label>
              <input
                type="text"
                value={formData.jobTitle}
                onChange={e => setFormData({ ...formData, jobTitle: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-900"
                placeholder="Ex: Mecânico Têxtil / Costureiro(a)"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Empresa Empregadora / Razão Social
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-900"
                placeholder="Ex: Oficina Mecânica ou Autônomo"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Registro de Classe (CFT, CRC, etc.)
              </label>
              <input
                type="text"
                value={formData.professionalCouncilReg || ''}
                onChange={e => setFormData({ ...formData, professionalCouncilReg: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-900 font-mono"
                placeholder="Ex: CFT-RJ 84920-T"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                PIS / PASEP / NIT
              </label>
              <input
                type="text"
                value={formData.pisPasep || ''}
                onChange={e => setFormData({ ...formData, pisPasep: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-900 font-mono"
                placeholder="128.49021.44-8"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Regime de Vínculo
              </label>
              <select
                value={formData.employmentType}
                onChange={e => setFormData({ ...formData, employmentType: e.target.value as any })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-900"
              >
                <option value="clt">CLT (Carteira Assinada)</option>
                <option value="pj_mei">MEI / Pessoa Jurídica</option>
                <option value="autonomo">Profissional Autônomo</option>
                <option value="estudante">Estudante / Em busca de recolocação</option>
                <option value="servidor">Servidor Público</option>
              </select>
            </div>
          </div>
        </section>

        {/* Bloco 5: Histórico Escolar Prévio */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <GraduationCap className="w-5 h-5 text-blue-900" />
            <h2 className="text-base font-bold text-slate-900">5. Histórico Escolar Prévio & Formação</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Escolaridade Anterior Concluída *
              </label>
              <select
                value={formData.priorEducationLevel}
                onChange={e => setFormData({ ...formData, priorEducationLevel: e.target.value as any })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-900"
              >
                <option value="medio">Ensino Médio Completo</option>
                <option value="fundamental">Ensino Fundamental Completo</option>
                <option value="superior_incompleto">Ensino Superior Incompleto</option>
                <option value="superior_completo">Ensino Superior Completo</option>
                <option value="pos_graduacao">Pós-Graduação / Especialização</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Instituição de Origem *
              </label>
              <input
                type="text"
                value={formData.priorSchoolName}
                onChange={e => setFormData({ ...formData, priorSchoolName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-900"
                placeholder="Nome da escola ou faculdade"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Ano de Conclusão *
              </label>
              <input
                type="number"
                value={formData.priorGraduationYear}
                onChange={e => setFormData({ ...formData, priorGraduationYear: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-900 font-mono"
                placeholder="2018"
              />
            </div>
          </div>
        </section>

        {/* Bloco 6: Consentimento LGPD & Termos de Matrícula */}
        <section className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              required
              checked={formData.lgpdConsent}
              onChange={e => setFormData({ ...formData, lgpdConsent: e.target.checked })}
              className="mt-0.5 rounded border-slate-300 text-blue-900 focus:ring-blue-900"
            />
            <span className="text-xs text-slate-700 leading-relaxed">
              <strong>Consentimento LGPD (Lei 13.709/2018):</strong> Autorizo expressamente o Grupo Eloizio a tratar meus dados pessoais para fins acadêmicos, emissão de certificados com validação pública por QR Code, histórico escolar e cobrança de mensalidades via Mercado Pago.
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              required
              checked={formData.contractAccepted}
              onChange={e => setFormData({ ...formData, contractAccepted: e.target.checked })}
              className="mt-0.5 rounded border-slate-300 text-blue-900 focus:ring-blue-900"
            />
            <span className="text-xs text-slate-700 leading-relaxed">
              <strong>Regimento Escolar e Contrato de Prestação de Serviços:</strong> Declaro sob as penas da lei que todas as informações acima são verdadeiras e estou de acordo com os critérios de aprovação (nota mínima 7.0 e frequência mínima de 75%).
            </span>
          </label>
        </section>

        {/* Botão de Envio */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Certificação criptográfica emitido sob supervisão da Gestora Luiza Souza.
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3.5 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            Efetivar Matrícula & Gerar Ficha Cadastral
          </button>
        </div>
      </form>
    </div>
  );
};
