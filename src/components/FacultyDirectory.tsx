import React from 'react';
import { FacultyMember } from '../types/lms';
import { LMSStorageService } from '../services/storage';
import { handleImageError } from '../utils/imageFallbacks';
import { 
  Users, 
  Award, 
  Star, 
  MessageCircle, 
  Briefcase, 
  GraduationCap, 
  Sparkles,
  Phone
} from 'lucide-react';

export const FacultyDirectory: React.FC = () => {
  const faculty = LMSStorageService.getFaculty();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-900" />
            <span>Corpo Docente, Diretoria & Equipe Acadêmica</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Profissionais especializados com mais de duas décadas de experiência prática no setor têxtil, mecânico e pedagógico
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-blue-900 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg shrink-0">
          <Award className="w-4 h-4 text-amber-500" />
          <span>Equipe com Média de Avaliação 4.96/5.0</span>
        </div>
      </div>

      {/* Cartão de Destaque Executivo: Luiza Souza */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white rounded-2xl p-6 border-2 border-amber-400/50 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
          <div className="w-20 h-20 rounded-2xl border-2 border-amber-400 overflow-hidden shrink-0 shadow-sm bg-slate-800">
            <img 
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80" 
              alt="Luiza Souza" 
              className="w-full h-full object-cover"
              onError={(e) => handleImageError(e, 'luiza')}
            />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="text-amber-400 font-mono font-bold text-[10px] uppercase tracking-wider bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
                Matrícula Funcional: FUNC-LUIZA-001
              </span>
              <span className="text-emerald-300 font-mono text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-400/30">
                Gestão Geral de Inteligência Artificial
              </span>
            </div>
            <h2 className="text-xl font-black text-white">Luiza Souza</h2>
            <p className="text-xs text-blue-200 font-medium">Gestora Geral de Inteligência Acadêmica & Operações LMS</p>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed pt-1">
              Supervisão em tempo real de todo o ecossistema educacional do Grupo Eloizio: suporte ao corpo docente, alterações de código nos scripts linha por linha, gestão de matrículas com identificação funcional e orientação pedagógica aos alunos.
            </p>
          </div>
        </div>

        <div className="flex sm:flex-col items-center gap-2 shrink-0">
          <div className="text-center bg-white/10 px-4 py-2 rounded-xl border border-white/10">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Disponibilidade</span>
            <strong className="text-emerald-400 text-xs">Atendimento 24/7</strong>
          </div>
        </div>
      </div>

      {/* Grid de Membros da Equipe */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {faculty.map(member => (
          <div
            key={member.id}
            className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all shadow-xs"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded">
                  {member.department}
                </span>

                <div className="flex items-center gap-1 text-amber-500 font-mono text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{member.rating.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <div className="w-14 h-14 rounded-full bg-blue-900 text-white font-extrabold text-lg flex items-center justify-center shrink-0 shadow-sm border-2 border-white">
                  {member.avatarInitials}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base leading-tight">
                    {member.name}
                  </h3>
                  <p className="text-xs text-blue-800 font-medium mt-0.5">
                    {member.title}
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed pt-1">
                {member.bio}
              </p>

              {/* Métricas do Docente/Gestor */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px] font-mono">
                <div>
                  <span className="text-slate-400 block">Experiência</span>
                  <span className="font-bold text-slate-800">{member.experienceYears} anos</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Alunos Treinados</span>
                  <span className="font-bold text-slate-800">{member.studentsTaught.toLocaleString('pt-BR')}+</span>
                </div>
              </div>
            </div>

            {/* Contato Direto */}
            <div className="pt-3 border-t border-slate-100">
              <a
                href={`https://wa.me/55${member.contactWhatsApp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>{member.contactWhatsApp}</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
