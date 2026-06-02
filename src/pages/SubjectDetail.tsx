import { useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AlertTriangle, ArrowLeft, BookOpen, Calendar, CheckCircle2, Clock,
  Download, FileWarning, GraduationCap, Mail, MapPin, User, XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getSubjectById, subjectsAttendance, type SubjectAttendance } from '@/data/attendance';

type FilterStatus = 'todos' | 'presente' | 'falta' | 'justificada';

const statusMeta = {
  presente: { label: 'Presente', icon: CheckCircle2, className: 'bg-success/10 text-success border-success/30' },
  falta: { label: 'Falta', icon: XCircle, className: 'bg-destructive/10 text-destructive border-destructive/30' },
  justificada: { label: 'Justificada', icon: FileWarning, className: 'bg-warning/10 text-warning border-warning/30' },
} as const;

const unitStatusMeta = {
  concluido: { label: 'Concluído', className: 'bg-success/10 text-success border-success/30' },
  'em-andamento': { label: 'Em andamento', className: 'bg-primary/10 text-primary border-primary/30' },
  pendente: { label: 'Pendente', className: 'bg-muted text-muted-foreground border-border' },
} as const;

const attendanceRate = (s: SubjectAttendance) =>
  Math.round((s.attendedClasses / s.totalClasses) * 100);

const riskLevel = (s: SubjectAttendance): 'ok' | 'alerta' | 'critico' => {
  const used = s.absences / s.maxAbsences;
  if (used >= 1) return 'critico';
  if (used >= 0.7) return 'alerta';
  return 'ok';
};

const SubjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const subject = id ? getSubjectById(id) : undefined;
  const [filter, setFilter] = useState<FilterStatus>('todos');

  if (!subject) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="font-display text-2xl font-bold text-foreground">Disciplina não encontrada</h1>
        <p className="text-muted-foreground">A disciplina solicitada não existe ou foi removida.</p>
        <Button onClick={() => navigate('/')}>Voltar ao início</Button>
      </div>
    );
  }

  const rate = attendanceRate(subject);
  const risk = riskLevel(subject);
  const filteredRecords = useMemo(
    () => filter === 'todos' ? subject.records : subject.records.filter(r => r.status === filter),
    [subject, filter],
  );

  const concluded = subject.syllabus.filter(u => u.status === 'concluido').length;
  const progress = Math.round((concluded / subject.syllabus.length) * 100);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-muted transition-colors" aria-label="Voltar">
                <ArrowLeft className="w-5 h-5 text-muted-foreground" />
              </button>
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground font-mono">{subject.code}</p>
                <h1 className="font-display font-bold text-foreground text-lg leading-tight truncate">
                  {subject.name}
                </h1>
              </div>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Ementa em PDF</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Hero / Resumo da disciplina */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl border border-border p-6"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-2xl">
              <Badge variant="secondary" className="mb-2">Cursando · 2026.1</Badge>
              <h2 className="font-display text-3xl font-bold text-foreground mb-2">{subject.name}</h2>
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {subject.professor}</span>
                {subject.professorEmail && (
                  <a href={`mailto:${subject.professorEmail}`} className="flex items-center gap-1.5 hover:text-primary">
                    <Mail className="w-4 h-4" /> {subject.professorEmail}
                  </a>
                )}
                <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" /> {subject.credits} créditos</span>
              </div>
            </div>
            <div className="bg-muted rounded-xl px-4 py-3 min-w-[200px]">
              <p className="text-xs text-muted-foreground mb-1">Próxima aula</p>
              <p className="font-display font-bold text-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" /> {subject.nextClass}
              </p>
            </div>
          </div>

          {/* Métricas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            <MetricCard label="Frequência" value={`${rate}%`} tone="primary" extra={<Progress value={rate} className="h-1.5 mt-2" />} />
            <MetricCard label="Presenças" value={`${subject.attendedClasses}/${subject.totalClasses}`} tone="success" />
            <MetricCard label="Faltas" value={`${subject.absences}/${subject.maxAbsences}`} tone="destructive" extra={
              <p className="text-[11px] text-muted-foreground mt-1">Limite: 25%</p>
            } />
            <MetricCard label="Justificadas" value={`${subject.justifiedAbsences}`} tone="warning" />
          </div>

          {risk !== 'ok' && (
            <div className={`mt-5 flex items-start gap-3 p-3 rounded-lg border ${
              risk === 'critico'
                ? 'border-destructive/30 bg-destructive/5 text-destructive'
                : 'border-warning/30 bg-warning/5 text-warning'
            }`}>
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold">
                  {risk === 'critico' ? 'Limite de faltas atingido' : 'Você está próximo do limite de faltas'}
                </p>
                <p className="opacity-90">
                  {subject.absences} de {subject.maxAbsences} faltas permitidas.
                  {risk === 'critico'
                    ? ' Procure a coordenação imediatamente.'
                    : ` Restam ${subject.maxAbsences - subject.absences} faltas antes da reprovação.`}
                </p>
              </div>
            </div>
          )}
        </motion.section>

        {/* Conteúdo em abas */}
        <Tabs defaultValue="horario" className="space-y-4">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="horario">Horário</TabsTrigger>
            <TabsTrigger value="conteudo">Conteúdo Programático</TabsTrigger>
            <TabsTrigger value="presenca">Presença</TabsTrigger>
          </TabsList>

          {/* HORÁRIO */}
          <TabsContent value="horario" className="space-y-4">
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="font-display font-bold text-lg text-foreground mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" /> Encontros semanais
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {subject.schedule.map((slot, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-border bg-muted/30">
                    <div className="w-14 h-14 rounded-lg bg-primary/10 text-primary flex flex-col items-center justify-center">
                      <span className="text-[10px] uppercase tracking-wider font-semibold">{slot.day.slice(0, 3)}</span>
                      <Calendar className="w-4 h-4 mt-0.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-bold text-foreground">{slot.day}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> {slot.start} — {slot.end}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" /> Sala {slot.room}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* CONTEÚDO PROGRAMÁTICO */}
          <TabsContent value="conteudo" className="space-y-4">
            <div className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                <h3 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" /> Plano de ensino
                </h3>
                <div className="flex items-center gap-3 min-w-[200px]">
                  <Progress value={progress} className="h-2" />
                  <span className="text-sm font-semibold text-foreground">{progress}%</span>
                </div>
              </div>

              <ol className="relative border-l-2 border-border ml-3 space-y-5">
                {subject.syllabus.map((unit, i) => {
                  const meta = unitStatusMeta[unit.status];
                  return (
                    <li key={i} className="pl-6 relative">
                      <span className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        unit.status === 'concluido' ? 'bg-success border-success' :
                        unit.status === 'em-andamento' ? 'bg-primary border-primary animate-pulse' :
                        'bg-card border-border'
                      }`}>
                        {unit.status === 'concluido' && <CheckCircle2 className="w-3 h-3 text-success-foreground" />}
                      </span>
                      <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
                        <h4 className="font-display font-bold text-foreground">{unit.title}</h4>
                        <Badge variant="outline" className={meta.className}>{meta.label}</Badge>
                      </div>
                      <ul className="space-y-1.5">
                        {unit.topics.map((t, ti) => (
                          <li key={ti} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 mt-2 flex-shrink-0" />
                            {t}
                          </li>
                        ))}
                      </ul>
                    </li>
                  );
                })}
              </ol>
            </div>
          </TabsContent>

          {/* PRESENÇA */}
          <TabsContent value="presenca" className="space-y-4">
            {/* Visualização didática: grid de aulas */}
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="font-display font-bold text-lg text-foreground mb-1">Linha do tempo de aulas</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Cada quadrado representa uma aula. Passe o mouse para ver o conteúdo.
              </p>
              <div className="flex flex-wrap gap-2">
                {subject.records.map((r, i) => {
                  const meta = statusMeta[r.status];
                  const Icon = meta.icon;
                  return (
                    <div
                      key={i}
                      title={`${r.date} — ${meta.label}${r.topic ? ` · ${r.topic}` : ''}`}
                      className={`w-12 h-12 rounded-lg border flex flex-col items-center justify-center text-[10px] font-semibold cursor-default transition-transform hover:scale-110 ${meta.className}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span className="mt-0.5">{r.date}</span>
                    </div>
                  );
                })}
              </div>

              {/* Legenda */}
              <div className="flex flex-wrap gap-4 mt-5 pt-4 border-t border-border text-xs">
                {(['presente','falta','justificada'] as const).map(k => {
                  const m = statusMeta[k];
                  const Icon = m.icon;
                  return (
                    <span key={k} className="flex items-center gap-1.5 text-muted-foreground">
                      <span className={`w-5 h-5 rounded border flex items-center justify-center ${m.className}`}>
                        <Icon className="w-3 h-3" />
                      </span>
                      {m.label}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Histórico detalhado */}
            <div className="bg-card rounded-xl border border-border p-5">
              <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterStatus)}>
                <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                  <h3 className="font-display font-bold text-lg text-foreground">Histórico detalhado</h3>
                  <TabsList>
                    <TabsTrigger value="todos">Todos</TabsTrigger>
                    <TabsTrigger value="presente">Presenças</TabsTrigger>
                    <TabsTrigger value="falta">Faltas</TabsTrigger>
                    <TabsTrigger value="justificada">Justificadas</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value={filter} className="mt-0">
                  {filteredRecords.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground text-sm">
                      Nenhum registro nesta categoria.
                    </div>
                  ) : (
                    <div className="rounded-lg border border-border overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-24">Data</TableHead>
                            <TableHead>Conteúdo</TableHead>
                            <TableHead className="w-40 text-right">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredRecords.map((r, i) => {
                            const meta = statusMeta[r.status];
                            const Icon = meta.icon;
                            return (
                              <TableRow key={i}>
                                <TableCell className="font-mono text-sm">{r.date}</TableCell>
                                <TableCell className="text-sm text-foreground">{r.topic ?? '—'}</TableCell>
                                <TableCell className="text-right">
                                  <Badge variant="outline" className={`gap-1 ${meta.className}`}>
                                    <Icon className="w-3 h-3" />
                                    {meta.label}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              <div className="mt-5 flex flex-wrap gap-2 justify-end">
                <Button variant="outline" size="sm" className="gap-2">
                  <FileWarning className="w-4 h-4" /> Justificar falta
                </Button>
                <Button size="sm" className="gap-2">
                  <Download className="w-4 h-4" /> Atestado de frequência
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Navegação entre matérias */}
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 font-semibold">Outras disciplinas</p>
          <div className="flex flex-wrap gap-2">
            {subjectsAttendance.filter(s => s.id !== subject.id).map(s => (
              <Link
                key={s.id}
                to={`/materia/${s.id}`}
                className="text-sm px-3 py-1.5 rounded-lg border border-border bg-muted/40 hover:border-primary hover:bg-primary/5 transition-colors"
              >
                {s.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

function MetricCard({ label, value, tone, extra }: {
  label: string;
  value: string;
  tone: 'primary' | 'success' | 'destructive' | 'warning';
  extra?: React.ReactNode;
}) {
  const toneClass = {
    primary: 'text-primary',
    success: 'text-success',
    destructive: 'text-destructive',
    warning: 'text-warning',
  }[tone];
  return (
    <div className="bg-muted/40 rounded-xl p-4 border border-border">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`font-display text-2xl font-bold ${toneClass}`}>{value}</p>
      {extra}
    </div>
  );
}

export default SubjectDetail;
