import React, { useState } from 'react';
import { User, UserRole } from '../types/lms';
import { LMSStorageService } from '../services/storage';
import { 
  GraduationCap, 
  UserCheck, 
  Shield, 
  Menu, 
  X, 
  Sparkles, 
  RotateCcw,
  BookOpen,
  Award,
  WalletCards,
  FileCode,
  CheckCircle2,
  UserPlus,
  Settings,
  Cpu,
  Coffee
} from 'lucide-react';

interface HeaderProps {
  activeUser: User;
  onUserChange: (user: User) => void;
  onNavigate: (section: string) => void;
  activeSection: string;
  onOpenLuiza: () => void;
}

const ROLE_LABELS: Record<UserRole, { label: string; tag: string }> = {
  superadmin: { label: 'Superadministrador', tag: 'Acesso Total' },
  institution_admin: { label: 'Admin da Instituição', tag: 'Gestão Geral' },
  coordinator: { label: 'Coordenador Acadêmico', tag: 'Pedagógico' },
  instructor: { label: 'Professor / Instrutor', tag: 'Docência' },
  student: { label: 'Aluno Matriculado', tag: 'Estudante' },
  finance: { label: 'Financeiro', tag: 'Mercado Pago' },
  secretary: { label: 'Secretaria', tag: 'Registros' }
};

export const Header: React.FC<HeaderProps> = ({
  activeUser,
  onUserChange,
  onNavigate,
  activeSection,
  onOpenLuiza
}) => {
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const users = LMSStorageService.getUsers();

  const handleSelectRole = (userId: string) => {
    const updated = LMSStorageService.setActiveUser(userId);
    onUserChange(updated);
    setRoleMenuOpen(false);
  };

  const handleResetData = () => {
    if (window.confirm('Deseja restaurar todos os dados do banco para o padrão inicial?')) {
      LMSStorageService.resetToDefault();
      const user = LMSStorageService.getActiveUser();
      onUserChange(user);
      window.location.reload();
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Início', icon: GraduationCap },
    { id: 'showcase', label: 'Vitrine Padrão Ouro', icon: Sparkles },
    { id: 'simulator', label: 'Simulador de Bancada', icon: Cpu },
    { id: 'registration', label: 'Nova Matrícula', icon: UserPlus },
    { id: 'courses', label: 'Cursos', icon: BookOpen },
    { id: 'student_portal', label: 'Área do Aluno', icon: UserCheck },
    { id: 'library', label: 'Biblioteca Virtual', icon: BookOpen },
    { id: 'soe', label: 'SOE (Orientação)', icon: Award },
    { id: 'secretariat', label: 'Secretaria Online', icon: FileCode },
    { id: 'faculty', label: 'Docentes & Diretoria', icon: GraduationCap },
    { id: 'documents', label: 'Certificados', icon: Award },
    { id: 'financial', label: 'Financeiro (Mercado Pago)', icon: WalletCards },
    { id: 'admin_config', label: 'Painel Admin (APIs)', icon: Settings },
    { id: 'export_php', label: 'Exportar Servidor (PHP/SQL)', icon: FileCode },
    { id: 'tests', label: 'Testes', icon: CheckCircle2 }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200">
      {/* Barra de Notificação e Suporte Rápido */}
      <div className="bg-slate-900 text-slate-200 px-4 py-1.5 text-xs flex items-center justify-between">
        <div className="flex items-center gap-3 truncate">
          <span className="font-semibold text-blue-400">Grupo Eloizio</span>
          <span className="hidden sm:inline text-slate-400">·</span>
          <span className="hidden sm:inline text-slate-300">Cursos Livres, Mecânica Têxtil & Assessoria Contábil</span>
          <span className="hidden md:inline text-slate-400">·</span>
          <span className="hidden md:inline text-slate-400">São Gonçalo - RJ</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenLuiza}
            className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-bold transition-colors"
            title="Abrir Atendimento Oficial & Gestão de IA com Luiza Souza (FUNC-LUIZA-001)"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Atendente Oficial &amp; Gestora IA: Luiza Souza</span>
            <span className="sm:hidden font-mono text-[11px]">Luiza Souza IA</span>
            <span className="text-[9px] bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded font-black font-mono">
              FUNC-001
            </span>
          </button>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <button
            onClick={handleResetData}
            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
            title="Restaurar dados iniciais para testes limpos"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden md:inline">Restaurar</span>
          </button>
        </div>
      </div>

      {/* Top Bar Principal (Strict Top Bar Contract: Brand — Nav Links — Primary Action & RBAC) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Brand wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            aria-label="Abrir menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2.5 text-left focus:outline-none"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-900 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              E
            </div>
            <div>
              <span className="font-bold text-slate-900 text-lg leading-tight block">
                Eloizio Academy
              </span>
              <span className="text-[11px] text-slate-500 font-medium leading-none block">
                LMS Profissional
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (single line, subtle hover, overflow scroll) */}
        <nav className="hidden lg:flex items-center gap-5 text-xs xl:text-sm font-medium text-slate-600 overflow-x-auto no-scrollbar py-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                activeSection === item.id
                  ? 'text-blue-900 font-bold border-b-2 border-blue-900'
                  : 'hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: RBAC Role Impersonator / User Profile */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors text-xs text-left"
              aria-expanded={roleMenuOpen}
            >
              <div className="w-6 h-6 rounded-full bg-blue-800 text-white flex items-center justify-center font-bold text-xs shrink-0">
                {activeUser.name.charAt(0)}
              </div>
              <div className="hidden sm:block text-left">
                <p className="font-semibold text-slate-900 leading-tight truncate max-w-[140px]">
                  {activeUser.name.split(' ')[0]}
                </p>
                <p className="text-[10px] text-blue-700 font-medium">
                  {ROLE_LABELS[activeUser.role]?.label || activeUser.role}
                </p>
              </div>
              <Shield className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>

            {/* Menu Dropdown de Seleção de Perfil RBAC */}
            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs font-semibold text-slate-900">Simulador de Permissões RBAC</p>
                  <p className="text-[11px] text-slate-500">Alterne instantaneamente entre os 7 perfis:</p>
                </div>
                <div className="max-h-80 overflow-y-auto py-1">
                  {users.map(u => (
                    <button
                      key={u.id}
                      onClick={() => handleSelectRole(u.id)}
                      className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                        activeUser.id === u.id ? 'bg-blue-50/70 text-blue-900 font-semibold' : 'text-slate-700'
                      }`}
                    >
                      <div className="truncate pr-2">
                        <p className="font-medium text-slate-900 truncate">{u.name}</p>
                        <p className="text-[10px] text-slate-500">{ROLE_LABELS[u.role]?.label}</p>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono shrink-0">
                        {ROLE_LABELS[u.role]?.tag}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Menu Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition-colors ${
                  activeSection === item.id
                    ? 'bg-blue-900 text-white font-medium'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
