import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Award, BookOpen, Calendar, Clock, Download, Mail, MapPin, Phone,
  GraduationCap, TrendingUp, User, FileText, CheckCircle2, AlertCircle, Edit2,
  Building2, Code2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const mockProfile = {
  personal: {
    name: 'João da Silva',
    registration: '2022.2.12345',
    email: 'joao.silva@university.edu',
    phone: '(85) 98765-4321',
    birthDate: '15/03/2004',
    nationality: 'Brasileiro',
    address: 'Rua das Flores, 123 - Fortaleza, CE',
    uf: 'CE',
    city: 'Fortaleza',
  },
  academic: {
    course: 'Engenharia de Software',
    period: 3,
    startDate: '2022.2',
    expectedGraduation: '2026.1',
    status: 'Ativo',
    curriculum: 'Currículo 2022.1',
    gpa: 7.85,
    completedCredits: 72,
    totalCredits: 240,
  },
  contacts: {
    advisor: {
      name: 'Prof. Dr. Carlos Mendes',
      email: 'carlos.mendes@university.edu',
      phone: '(85) 3333-1234',
      office: 'Bloco A - Sala 201',
    },
  },
};

const mockAcademicHistory = [
  {
    semester: '2022.2',
    subjects: 5,
    completed: 5,
    gpa: 7.2,
    creditsEarned: 18,
    status: 'Concluído',
  },
  {
    semester: '2023.1',
    subjects: 5,
    completed: 5,
    gpa: 7.8,
    creditsEarned: 18,
    status: 'Concluído',
  },
  {
    semester: '2023.2',
    subjects: 5,
    completed: 5,
    gpa: 8.1,
    creditsEarned: 18,
    status: 'Concluído',
  },
  {
    semester: '2024.1',
    subjects: 5,
    completed: 5,
    gpa: 8.3,
    creditsEarned: 18,
    status: 'Concluído',
  },
  {
    semester: '2024.2',
    subjects: 6,
    completed: 6,
    gpa: 8.0,
    creditsEarned: 18,
    status: 'Concluído',
  },
  {
    semester: '2026.1',
    subjects: 6,
    completed: 0,
    gpa: 0,
    creditsEarned: 0,
    status: 'Em Curso',
  },
];

const mockDocuments = [
  { name: 'Diploma (quando formar)', icon: Award, date: 'Disponível em 2026.1' },
  { name: 'Histórico Acadêmico', icon: FileText, date: '01/06/2026' },
  { name: 'Comprovante de Matrícula', icon: CheckCircle2, date: '01/06/2026' },
  { name: 'Comprovante de Estudante', icon: GraduationCap, date: '01/06/2026' },
  { name: 'Antecedentes Criminais', icon: AlertCircle, date: 'Solicitar' },
];

const mockAchievements = [
  { title: 'Quadro de Honra', semester: '2023.2', description: 'GPA ≥ 7.5' },
  { title: 'Quadro de Honra', semester: '2024.1', description: 'GPA ≥ 7.5' },
  { title: 'Quadro de Honra', semester: '2024.2', description: 'GPA ≥ 7.5' },
];

export default function Profile() {
  const navigate = useNavigate();
  const { personal, academic, contacts } = mockProfile;
  const progressPercent = (academic.completedCredits / academic.totalCredits) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="Voltar"
              >
                <ArrowLeft className="w-5 h-5 text-muted-foreground" />
              </button>
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <User className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-mono">Perfil</p>
                <h1 className="font-display font-bold text-foreground text-lg leading-tight">
                  {personal.name}
                </h1>
              </div>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Edit2 className="w-4 h-4" />
              <span className="hidden sm:inline">Editar</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Profile Hero */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl border border-border p-6"
        >
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center flex-shrink-0">
              <span className="text-4xl font-bold text-primary-foreground">JS</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                <div>
                  <h2 className="font-display text-3xl font-bold text-foreground">{personal.name}</h2>
                  <p className="text-sm text-muted-foreground font-mono mt-1">{personal.registration}</p>
                </div>
                <Badge variant="secondary" className="text-sm">{academic.status}</Badge>
              </div>
              <p className="text-foreground font-medium mb-2">{academic.course}</p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" /> Período {academic.period}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" /> Desde {academic.startDate}
                </span>
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4" /> Formação: {academic.expectedGraduation}
                </span>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-6 pt-6 border-t border-border">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-muted rounded-xl p-4">
                <p className="text-xs text-muted-foreground mb-1">Média Geral (GPA)</p>
                <p className="font-display text-2xl font-bold text-primary">{academic.gpa}</p>
              </div>
              <div className="bg-muted rounded-xl p-4">
                <p className="text-xs text-muted-foreground mb-1">Créditos Completados</p>
                <p className="font-display text-2xl font-bold text-success">
                  {academic.completedCredits}/{academic.totalCredits}
                </p>
              </div>
              <div className="bg-muted rounded-xl p-4">
                <p className="text-xs text-muted-foreground mb-1">Progresso do Curso</p>
                <p className="font-display text-2xl font-bold text-primary">{Math.round(progressPercent)}%</p>
              </div>
              <div className="bg-muted rounded-xl p-4">
                <p className="text-xs text-muted-foreground mb-1">Semestres Cursados</p>
                <p className="font-display text-2xl font-bold text-foreground">{academic.period}</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Tabs */}
        <Tabs defaultValue="personal" className="space-y-4">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="personal">Dados Pessoais</TabsTrigger>
            <TabsTrigger value="academic">Histórico Acadêmico</TabsTrigger>
            <TabsTrigger value="documents">Documentos</TabsTrigger>
            <TabsTrigger value="contacts">Contatos</TabsTrigger>
          </TabsList>

          {/* DADOS PESSOAIS */}
          <TabsContent value="personal" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-xl border border-border p-6"
              >
                <h3 className="font-display font-bold text-lg text-foreground mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" /> Informações Pessoais
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Matrícula</p>
                    <p className="font-medium text-foreground font-mono">{personal.registration}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Data de Nascimento</p>
                    <p className="font-medium text-foreground">{personal.birthDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Nacionalidade</p>
                    <p className="font-medium text-foreground">{personal.nationality}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card rounded-xl border border-border p-6"
              >
                <h3 className="font-display font-bold text-lg text-foreground mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" /> Contato
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <Mail className="w-3 h-3" /> Email
                    </p>
                    <p className="font-medium text-foreground text-sm">{personal.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <Phone className="w-3 h-3" /> Telefone
                    </p>
                    <p className="font-medium text-foreground">{personal.phone}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card rounded-xl border border-border p-6 md:col-span-2"
              >
                <h3 className="font-display font-bold text-lg text-foreground mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" /> Endereço
                </h3>
                <p className="font-medium text-foreground">{personal.address}</p>
                <p className="text-sm text-muted-foreground mt-2">{personal.city}, {personal.uf}</p>
              </motion.div>
            </div>
          </TabsContent>

          {/* HISTÓRICO ACADÊMICO */}
          <TabsContent value="academic" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {/* Resumo */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-xl border border-border p-6"
              >
                <h3 className="font-display font-bold text-lg text-foreground mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" /> Desempenho Geral
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-muted rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-2">Semestres Completados</p>
                    <p className="font-display text-3xl font-bold text-foreground">{academic.period}</p>
                  </div>
                  <div className="bg-muted rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-2">Média Acumulada</p>
                    <p className="font-display text-3xl font-bold text-primary">{academic.gpa}</p>
                  </div>
                  <div className="bg-muted rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-2">Créditos Obtidos</p>
                    <p className="font-display text-3xl font-bold text-success">{academic.completedCredits}</p>
                  </div>
                </div>
              </motion.div>

              {/* Histórico por semestre */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card rounded-xl border border-border p-6"
              >
                <h3 className="font-display font-bold text-lg text-foreground mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" /> Histórico por Semestre
                </h3>
                <div className="space-y-3">
                  {mockAcademicHistory.map((semester) => (
                    <div key={semester.semester} className="p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-foreground">{semester.semester}</p>
                          <p className="text-xs text-muted-foreground">
                            {semester.subjects} disciplinas • {semester.completed} concluídas
                          </p>
                        </div>
                        <Badge
                          variant={semester.status === 'Concluído' ? 'secondary' : 'outline'}
                          className="text-xs"
                        >
                          {semester.status}
                        </Badge>
                      </div>
                      <div className="flex gap-4 text-sm">
                        <span className="text-muted-foreground">
                          GPA: <span className="font-semibold text-foreground">{semester.gpa}</span>
                        </span>
                        <span className="text-muted-foreground">
                          Créditos: <span className="font-semibold text-foreground">{semester.creditsEarned}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Realizações */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card rounded-xl border border-border p-6"
              >
                <h3 className="font-display font-bold text-lg text-foreground mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" /> Realizações
                </h3>
                <div className="space-y-3">
                  {mockAchievements.map((achievement, i) => (
                    <div key={i} className="p-4 rounded-lg border border-success/30 bg-success/5">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-success mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-foreground">{achievement.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {achievement.semester} • {achievement.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </TabsContent>

          {/* DOCUMENTOS */}
          <TabsContent value="documents" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <h3 className="font-display font-bold text-lg text-foreground mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" /> Documentos Importantes
              </h3>
              <div className="space-y-3">
                {mockDocuments.map((doc, i) => {
                  const Icon = doc.icon;
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">{doc.date}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Baixar</span>
                      </Button>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </TabsContent>

          {/* CONTATOS */}
          <TabsContent value="contacts" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <h3 className="font-display font-bold text-lg text-foreground mb-4 flex items-center gap-2">
                <Code2 className="w-5 h-5 text-primary" /> Orientador Acadêmico
              </h3>
              <div className="bg-muted/30 rounded-xl p-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-primary">CM</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-display font-bold text-lg text-foreground mb-3">
                      {contacts.advisor.name}
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        <a href={`mailto:${contacts.advisor.email}`} className="hover:text-primary">
                          {contacts.advisor.email}
                        </a>
                      </p>
                      <p className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <a href={`tel:${contacts.advisor.phone}`} className="hover:text-primary">
                          {contacts.advisor.phone}
                        </a>
                      </p>
                      <p className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {contacts.advisor.office}
                      </p>
                    </div>
                    <Button size="sm" className="mt-4 gap-2">
                      <Mail className="w-4 h-4" />
                      Enviar Mensagem
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
