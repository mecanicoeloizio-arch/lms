import React, { useState } from 'react';
import { Course, CourseModality, User } from '../types/lms';
import { LMSStorageService } from '../services/storage';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Clock, 
  CheckCircle2, 
  FileText, 
  Video, 
  Play,
  Lock,
  Layers,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface AcademicManagerProps {
  currentUser: User;
  onOpenPlayer: (courseId: string, lessonId?: string) => void;
  onEnroll: (courseId: string) => void;
}

export const AcademicManager: React.FC<AcademicManagerProps> = ({
  currentUser,
  onOpenPlayer,
  onEnroll
}) => {
  const [courses, setCourses] = useState<Course[]>(LMSStorageService.getCourses());
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(courses[0] || null);
  const [activeTab, setActiveTab] = useState<'catalog' | 'editor'>('catalog');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  // Estado para edição/criação de curso
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editPrice, setEditPrice] = useState(0);
  const [editDuration, setEditDuration] = useState(40);
  const [editModality, setEditModality] = useState<CourseModality>('livre');
  const [editDescription, setEditDescription] = useState('');
  const [editMinGrade, setEditMinGrade] = useState(7.0);

  // Estado para novo módulo
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [newModuleUnlockDays, setNewModuleUnlockDays] = useState(0);

  // Estado para nova aula
  const [targetModuleId, setTargetModuleId] = useState<string | null>(null);
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonVideo, setNewLessonVideo] = useState('');
  const [newLessonDuration, setNewLessonDuration] = useState(20);

  const canManage = ['superadmin', 'institution_admin', 'coordinator', 'instructor'].includes(currentUser.role);
  const enrollments = LMSStorageService.getUserEnrollments(currentUser.id);

  const categories = ['all', ...Array.from(new Set(courses.map(c => c.category)))];

  const filteredCourses = categoryFilter === 'all' 
    ? courses 
    : courses.filter(c => c.category === categoryFilter);

  const handleCreateCourse = () => {
    const inst = LMSStorageService.getInstitution();
    const newCourse: Course = {
      id: `course-${Date.now()}`,
      institutionId: inst.id,
      instructorId: currentUser.id,
      category: editCategory.trim() || 'Cursos Livres',
      title: editTitle.trim() || 'Novo Curso Profissional',
      slug: (editTitle || 'novo-curso').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      shortDescription: editDescription.substring(0, 120),
      description: editDescription,
      modality: editModality,
      durationHours: Number(editDuration) || 40,
      priceBrl: Number(editPrice) || 0,
      status: 'published',
      minPassingGrade: Number(editMinGrade) || 7.0,
      minAttendancePercent: 75,
      coverGradient: 'from-blue-900 to-indigo-800',
      prerequisites: [],
      modules: [],
      createdAt: new Date().toISOString()
    };

    LMSStorageService.saveCourse(newCourse);
    const updated = LMSStorageService.getCourses();
    setCourses(updated);
    setSelectedCourse(newCourse);
    setIsEditing(false);
    setActiveTab('editor');
  };

  const handleAddModule = () => {
    if (!selectedCourse || !newModuleTitle.trim()) return;

    const newMod = {
      id: `mod-${Date.now()}`,
      courseId: selectedCourse.id,
      title: newModuleTitle.trim(),
      sortOrder: selectedCourse.modules.length + 1,
      unlockDaysAfterEnrollment: Number(newModuleUnlockDays) || 0,
      lessons: []
    };

    const updatedCourse = {
      ...selectedCourse,
      modules: [...selectedCourse.modules, newMod]
    };

    LMSStorageService.saveCourse(updatedCourse);
    setSelectedCourse(updatedCourse);
    setCourses(LMSStorageService.getCourses());
    setNewModuleTitle('');
    setNewModuleUnlockDays(0);
  };

  const handleAddLesson = (moduleId: string) => {
    if (!selectedCourse || !newLessonTitle.trim()) return;

    const updatedModules = selectedCourse.modules.map(mod => {
      if (mod.id !== moduleId) return mod;

      const newLesson = {
        id: `les-${Date.now()}`,
        moduleId,
        title: newLessonTitle.trim(),
        description: 'Conteúdo detalhado e roteiro prático da aula.',
        videoUrl: newLessonVideo.trim() || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        durationMinutes: Number(newLessonDuration) || 15,
        sortOrder: mod.lessons.length + 1,
        isFreePreview: mod.lessons.length === 0,
        materials: []
      };

      return {
        ...mod,
        lessons: [...mod.lessons, newLesson]
      };
    });

    const updatedCourse = {
      ...selectedCourse,
      modules: updatedModules
    };

    LMSStorageService.saveCourse(updatedCourse);
    setSelectedCourse(updatedCourse);
    setCourses(LMSStorageService.getCourses());
    setTargetModuleId(null);
    setNewLessonTitle('');
    setNewLessonVideo('');
  };

  const handleDeleteCourse = (courseId: string) => {
    if (window.confirm('Confirma a exclusão deste curso?')) {
      LMSStorageService.deleteCourse(courseId);
      const updated = LMSStorageService.getCourses();
      setCourses(updated);
      setSelectedCourse(updated[0] || null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Barra de Controles e Abas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Gestão Acadêmica & Catálogo de Cursos
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Formação profissional, módulos modulares, vídeos e critérios de aprovação
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Segmented Control */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'catalog' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Catálogo de Cursos
            </button>
            {canManage && (
              <button
                onClick={() => setActiveTab('editor')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeTab === 'editor' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Gerenciador de Módulos & Aulas
              </button>
            )}
          </div>

          {canManage && activeTab === 'editor' && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-900 text-white rounded-lg text-xs font-medium hover:bg-blue-800 transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo Curso</span>
            </button>
          )}
        </div>
      </div>

      {/* ABA 1: CATÁLOGO DE CURSOS */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          {/* Filtros de Categoria (Segmented buttons) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            <span className="text-xs text-slate-400 font-medium shrink-0">Filtrar por área:</span>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 text-xs rounded-full transition-colors whitespace-nowrap ${
                  categoryFilter === cat
                    ? 'bg-blue-900 text-white font-medium'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat === 'all' ? 'Todos os Cursos' : cat}
              </button>
            ))}
          </div>

          {/* Grid de Cursos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => {
              const isEnrolled = enrollments.some(e => e.courseId === course.id && e.status !== 'cancelled');
              const enrollment = enrollments.find(e => e.courseId === course.id);
              const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);

              return (
                <div
                  key={course.id}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col hover:border-slate-300 transition-all shadow-sm"
                >
                  {/* Banner do Curso (Estilização SVG e Gradiente de Alta Fidelidade) */}
                  <div className={`h-36 bg-gradient-to-br ${course.coverGradient} p-4 flex flex-col justify-between text-white relative`}>
                    <div className="flex items-center justify-between text-xs text-blue-200">
                      <span className="font-semibold uppercase tracking-wider">{course.category}</span>
                      <span className="bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded text-[11px] font-mono">
                        {course.modality.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-white line-clamp-2 leading-snug">
                        {course.title}
                      </h3>
                    </div>
                  </div>

                  {/* Informações e Metadados (Clean unboxed metadata) */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <p className="text-xs text-slate-600 line-clamp-3 mb-3">
                        {course.shortDescription || course.description}
                      </p>

                      <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{course.durationHours}h</span>
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-1">
                          <Layers className="w-3.5 h-3.5 text-slate-400" />
                          <span>{course.modules.length} módulos</span>
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{totalLessons} aulas</span>
                      </div>
                    </div>

                    {/* Preço e Ação */}
                    <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-slate-400 block">Investimento</span>
                        <span className="text-base font-bold text-slate-900 font-mono tabular-nums">
                          {course.priceBrl === 0 ? 'Gratuito' : `R$ ${course.priceBrl.toFixed(2)}`}
                        </span>
                      </div>

                      {isEnrolled ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onOpenPlayer(course.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Continuar ({enrollment?.progressPercent || 0}%)</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => onEnroll(course.id)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-blue-900 text-white rounded-lg text-xs font-semibold hover:bg-blue-800 transition-colors shadow-sm"
                        >
                          <span>Matricular</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ABA 2: GERENCIADOR ESTRUTURAL DE MÓDULOS E AULAS (ADMIN / PROFESSOR) */}
      {activeTab === 'editor' && canManage && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna 1: Lista de Cursos Selecionáveis */}
          <div className="lg:col-span-1 space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">Selecione o Curso para Editar:</h2>
            <div className="space-y-2">
              {courses.map(course => (
                <div
                  key={course.id}
                  onClick={() => setSelectedCourse(course)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    selectedCourse?.id === course.id
                      ? 'border-blue-900 bg-blue-50/40 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-blue-800 font-medium uppercase">{course.category}</span>
                    <span className="text-xs font-mono font-bold text-slate-900">R$ {course.priceBrl.toFixed(2)}</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">{course.title}</h4>
                  <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500 font-mono">
                    <span>{course.durationHours}h</span>
                    <span>·</span>
                    <span>{course.modules.length} módulos</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Coluna 2 e 3: Editor de Módulos e Aulas do Curso Selecionado */}
          <div className="lg:col-span-2 space-y-6">
            {selectedCourse ? (
              <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-6">
                {/* Header do Curso Selecionado */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[11px] font-mono uppercase text-slate-400">Editando Estrutura</span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">{selectedCourse.title}</h3>
                    <p className="text-xs text-slate-500">
                      Média para aprovação: <strong>{selectedCourse.minPassingGrade.toFixed(1)}</strong> · Carga horária: <strong>{selectedCourse.durationHours} horas</strong>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenPlayer(selectedCourse.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 hover:text-slate-900 rounded-lg text-xs font-medium hover:bg-slate-200 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Ver no Player</span>
                    </button>
                    {currentUser.role === 'superadmin' && (
                      <button
                        onClick={() => handleDeleteCourse(selectedCourse.id)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Excluir curso"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Adicionar Módulo */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5 text-blue-900" />
                    <span>Adicionar Novo Módulo</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        placeholder="Ex: Módulo 5: Diagnóstico e Manutenção Avançada"
                        value={newModuleTitle}
                        onChange={e => setNewModuleTitle(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900/20"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        placeholder="Dias p/ liberação (0 = imediato)"
                        value={newModuleUnlockDays || ''}
                        onChange={e => setNewModuleUnlockDays(Number(e.target.value))}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900/20"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleAddModule}
                    disabled={!newModuleTitle.trim()}
                    className="px-3.5 py-1.5 bg-blue-900 text-white text-xs font-semibold rounded-lg hover:bg-blue-800 disabled:opacity-40 transition-colors"
                  >
                    Salvar Módulo
                  </button>
                </div>

                {/* Lista de Módulos e Aulas */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Grade Curricular ({selectedCourse.modules.length} Módulos)
                  </h4>

                  {selectedCourse.modules.length === 0 ? (
                    <div className="text-center py-8 border border-dashed border-slate-200 rounded-xl">
                      <p className="text-xs text-slate-400">Nenhum módulo cadastrado ainda.</p>
                    </div>
                  ) : (
                    selectedCourse.modules.map(mod => (
                      <div key={mod.id} className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                        <div className="bg-slate-100/70 px-4 py-2.5 flex items-center justify-between border-b border-slate-200">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-blue-900 text-white text-[11px] font-bold flex items-center justify-center font-mono">
                              {mod.sortOrder}
                            </span>
                            <span className="font-bold text-xs sm:text-sm text-slate-800">{mod.title}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {mod.unlockDaysAfterEnrollment > 0 && (
                              <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-mono flex items-center gap-1">
                                <Lock className="w-3 h-3" /> Libera em {mod.unlockDaysAfterEnrollment} dias
                              </span>
                            )}
                            <button
                              onClick={() => setTargetModuleId(targetModuleId === mod.id ? null : mod.id)}
                              className="text-xs text-blue-900 hover:underline font-semibold"
                            >
                              + Adicionar Aula
                            </button>
                          </div>
                        </div>

                        {/* Formulário de Nova Aula */}
                        {targetModuleId === mod.id && (
                          <div className="p-3 bg-blue-50/50 border-b border-blue-100 space-y-2 text-xs">
                            <p className="font-semibold text-blue-900">Nova Aula para este Módulo:</p>
                            <input
                              type="text"
                              placeholder="Título da Aula (ex: 2.4 Regulagem de Tensão da Linha)"
                              value={newLessonTitle}
                              onChange={e => setNewLessonTitle(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                placeholder="URL do Vídeo (YouTube embed ou MP4)"
                                value={newLessonVideo}
                                onChange={e => setNewLessonVideo(e.target.value)}
                                className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800"
                              />
                              <input
                                type="number"
                                placeholder="Duração (minutos)"
                                value={newLessonDuration || ''}
                                onChange={e => setNewLessonDuration(Number(e.target.value))}
                                className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800"
                              />
                            </div>
                            <div className="flex items-center gap-2 pt-1">
                              <button
                                onClick={() => handleAddLesson(mod.id)}
                                disabled={!newLessonTitle.trim()}
                                className="px-3 py-1 bg-blue-900 text-white rounded text-xs font-semibold hover:bg-blue-800"
                              >
                                Salvar Aula
                              </button>
                              <button
                                onClick={() => setTargetModuleId(null)}
                                className="px-3 py-1 text-slate-600 hover:text-slate-900 text-xs"
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Aulas do Módulo */}
                        <div className="divide-y divide-slate-100">
                          {mod.lessons.map(lesson => (
                            <div key={lesson.id} className="px-4 py-2.5 flex items-center justify-between text-xs hover:bg-slate-50">
                              <div className="flex items-center gap-2.5">
                                <Video className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span className="font-medium text-slate-800">{lesson.title}</span>
                                {lesson.isFreePreview && (
                                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-medium">
                                    Gratuita
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-3 text-slate-400 font-mono">
                                <span>{lesson.durationMinutes} min</span>
                                {lesson.materials.length > 0 && (
                                  <span className="flex items-center gap-1 text-blue-700">
                                    <FileText className="w-3 h-3" />
                                    <span>{lesson.materials.length} PDF</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
                Selecione um curso na coluna ao lado para gerenciar seus módulos.
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL DE CRIAÇÃO DE CURSO */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg p-5 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Cadastrar Novo Curso Acadêmico</h3>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Título do Curso</label>
                <input
                  type="text"
                  placeholder="Ex: Regulagem Avançada de Ponto Corrente"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Categoria</label>
                  <input
                    type="text"
                    placeholder="Mecânica & Manutenção"
                    value={editCategory}
                    onChange={e => setEditCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Modalidade</label>
                  <select
                    value={editModality}
                    onChange={e => setEditModality(e.target.value as CourseModality)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs"
                  >
                    <option value="livre">Curso Livre</option>
                    <option value="profissionalizante">Profissionalizante</option>
                    <option value="tecnico">Técnico / Aperfeiçoamento</option>
                    <option value="extensao">Extensão</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Preço (BRL)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="497.00"
                    value={editPrice || ''}
                    onChange={e => setEditPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Carga Horária (h)</label>
                  <input
                    type="number"
                    placeholder="120"
                    value={editDuration || ''}
                    onChange={e => setEditDuration(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nota de Corte</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="7.0"
                    value={editMinGrade || ''}
                    onChange={e => setEditMinGrade(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Descrição Detalhada</label>
                <textarea
                  rows={3}
                  placeholder="Metodologia, objetivos, ementa e público-alvo..."
                  value={editDescription}
                  onChange={e => setEditDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setIsEditing(false)}
                className="px-3.5 py-1.5 text-slate-600 hover:text-slate-900 text-xs font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateCourse}
                disabled={!editTitle.trim()}
                className="px-4 py-2 bg-blue-900 text-white rounded-lg text-xs font-semibold hover:bg-blue-800 disabled:opacity-40"
              >
                Criar Curso
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
