import React, { useState, useEffect } from 'react';
import { User } from './types/lms';
import { LMSStorageService } from './services/storage';
import { Header } from './components/Header';
import { DashboardOverview } from './components/DashboardOverview';
import { AcademicManager } from './components/AcademicManager';
import { StudentPortal } from './components/StudentPortal';
import { LessonPlayer } from './components/LessonPlayer';
import { DocumentCenter } from './components/DocumentCenter';
import { PublicValidator } from './components/PublicValidator';
import { FinancialCenter } from './components/FinancialCenter';
import { PhpServerExporter } from './components/PhpServerExporter';
import { TestRunner } from './components/TestRunner';
import { LuizaSouzaModal } from './components/LuizaSouzaModal';
import { StudentRegistrationForm } from './components/StudentRegistrationForm';
import { HighConversionShowcase } from './components/HighConversionShowcase';
import { VirtualLibrary } from './components/VirtualLibrary';
import { SoeOrientation } from './components/SoeOrientation';
import { SecretariatDesk } from './components/SecretariatDesk';
import { FacultyDirectory } from './components/FacultyDirectory';
import { AdminConfigPanel } from './components/AdminConfigPanel';
import { DiagnosticSimulator } from './components/DiagnosticSimulator';
import { LuizaFloatingWidget } from './components/LuizaFloatingWidget';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User>(() => LMSStorageService.getActiveUser());
  const [activeSection, setActiveSection] = useState<string>('dashboard');
  const [playerCourseId, setPlayerCourseId] = useState<string | null>(null);
  const [playerLessonId, setPlayerLessonId] = useState<string | undefined>(undefined);
  const [validatorCode, setValidatorCode] = useState<string>('');
  const [isLuizaOpen, setIsLuizaOpen] = useState(false);

  // Garantir sincronização se o usuário trocar
  const handleUserChange = (newUser: User) => {
    setCurrentUser(newUser);
  };

  const handleOpenPlayer = (courseId: string, lessonId?: string) => {
    setPlayerCourseId(courseId);
    setPlayerLessonId(lessonId);
    setActiveSection('player');
  };

  const handleOpenValidator = (code: string) => {
    setValidatorCode(code);
    setActiveSection('validator');
  };

  const handleEnrollAndPay = (courseId: string) => {
    // Abrir o checkout para este curso
    setActiveSection('financial');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      {/* Top Bar e Contrato de Navegação */}
      <Header
        activeUser={currentUser}
        onUserChange={handleUserChange}
        onNavigate={section => {
          setActiveSection(section);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        activeSection={activeSection}
        onOpenLuiza={() => setIsLuizaOpen(true)}
      />

      {/* Viewport Principal com Container Responsivo Mobile-First */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeSection === 'dashboard' && (
          <DashboardOverview
            currentUser={currentUser}
            onNavigate={setActiveSection}
            onOpenPlayer={handleOpenPlayer}
          />
        )}

        {activeSection === 'showcase' && (
          <HighConversionShowcase
            onSelectCourse={courseId => {
              handleEnrollAndPay(courseId);
            }}
            onOpenPlayer={handleOpenPlayer}
            onOpenSimulator={() => setActiveSection('simulator')}
          />
        )}

        {activeSection === 'simulator' && (
          <DiagnosticSimulator
            onOpenCourse={handleOpenPlayer}
          />
        )}

        {activeSection === 'registration' && (
          <StudentRegistrationForm
            onEnrollmentCompleted={(courseId) => handleOpenPlayer(courseId)}
            onNavigateToFinancial={() => setActiveSection('financial')}
          />
        )}

        {activeSection === 'courses' && (
          <AcademicManager
            currentUser={currentUser}
            onOpenPlayer={handleOpenPlayer}
            onEnroll={handleEnrollAndPay}
          />
        )}

        {activeSection === 'student_portal' && (
          <StudentPortal
            currentUser={currentUser}
            onOpenPlayer={handleOpenPlayer}
            onOpenDocuments={() => setActiveSection('documents')}
            onOpenFinancial={() => setActiveSection('financial')}
          />
        )}

        {activeSection === 'library' && (
          <VirtualLibrary />
        )}

        {activeSection === 'soe' && (
          <SoeOrientation
            currentUser={currentUser}
            onOpenLuiza={() => setIsLuizaOpen(true)}
          />
        )}

        {activeSection === 'secretariat' && (
          <SecretariatDesk
            currentUser={currentUser}
          />
        )}

        {activeSection === 'faculty' && (
          <FacultyDirectory />
        )}

        {activeSection === 'player' && playerCourseId && (
          <LessonPlayer
            courseId={playerCourseId}
            initialLessonId={playerLessonId}
            currentUser={currentUser}
            onBack={() => setActiveSection('student_portal')}
            onOpenDocuments={() => setActiveSection('documents')}
            onOpenLuiza={() => setIsLuizaOpen(true)}
          />
        )}

        {activeSection === 'documents' && (
          <DocumentCenter
            currentUser={currentUser}
            onOpenValidator={handleOpenValidator}
          />
        )}

        {activeSection === 'validator' && (
          <PublicValidator
            initialCode={validatorCode}
            onBack={() => setActiveSection('documents')}
          />
        )}

        {activeSection === 'financial' && (
          <FinancialCenter
            currentUser={currentUser}
            onEnrollmentUnlocked={handleOpenPlayer}
          />
        )}

        {activeSection === 'admin_config' && (
          <AdminConfigPanel />
        )}

        {activeSection === 'export_php' && (
          <PhpServerExporter />
        )}

        {activeSection === 'tests' && (
          <TestRunner />
        )}
      </main>

      {/* Botão Flutuante Oficial de Atendimento & Gestão IA: Luiza Souza (FUNC-001) */}
      <LuizaFloatingWidget onOpen={() => setIsLuizaOpen(true)} />

      {/* Modal Unificado Oficial: Luiza Souza (Atendente Oficial & Gestora IA LMS) */}
      <LuizaSouzaModal
        isOpen={isLuizaOpen}
        onClose={() => setIsLuizaOpen(false)}
        currentUser={currentUser}
        onNavigateToSection={(sec) => setActiveSection(sec)}
        onUserRoleChanged={() => {
          setCurrentUser(LMSStorageService.getActiveUser());
        }}
      />

      {/* Rodapé Clean */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">Grupo Eloizio</span>
            <span>·</span>
            <span>Plataforma LMS Profissional & Educacional</span>
            <span>·</span>
            <span>São Gonçalo - RJ</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
            <span>Moeda: BRL (R$)</span>
            <span>·</span>
            <span>Fuso: America/Sao_Paulo</span>
            <span>·</span>
            <span>Mercado Pago API v1</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
