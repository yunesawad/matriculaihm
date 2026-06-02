import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowLeft, Calendar, CheckCircle2, ClipboardList, Download, FileWarning, GraduationCap, Sparkles, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getAllSubjects, type SubjectAttendance } from '@/data/attendance';

type FilterStatus = 'todos' | 'presente' | 'falta' | 'justificada';

const statusMeta = {
  presente: { label: 'Presente', icon: CheckCircle2, className: 'bg-success/10 text-success border-success/30' },
  falta: { label: 'Falta', icon: XCircle, className: 'bg-destructive/10 text-destructive border-destructive/30' },
  justificada: { label: 'Justificada', icon: FileWarning, className: 'bg-warning/10 text-warning border-warning/30' },
} as const;

function attendanceRate(s: SubjectAttendance) {
  return Math.round((s.attendedClasses / s.totalClasses) * 100);
}
function riskLevel(s: SubjectAttendance): 'ok' | 'alerta' | 'critico' {
  const used = s.absences / s.maxAbsences;
  if (used >= 1) return 'critico';
  if (used >= 0.7) return 'alerta';
  return 'ok';
}

const Attendance = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<SubjectAttendance[]>(() => getAllSubjects());
  const [selectedId, setSelectedId] = useState<string>(subjects[0]?.id ?? '');
  const [filter, setFilter] = useState<FilterStatus>('todos');

  // Recarrega quando uma nova matrícula é confirmada
  useEffect(() => {
    const refresh = () => {
      const next = getAllSubjects();
      setSubjects(next);
      setSelectedId(prev => next.some(s => s.id === prev) ? prev : (next[0]?.id ?? ''));
    };
    window.addEventListener('enrollment:updated', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('enrollment:updated', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  const selected = useMemo(
    () => subjects.find(s => s.id === selectedId) ?? subjects[0],
    [subjects, selectedId],
  );

  const filteredRecords = useMemo(
    () => !selected ? [] : filter === 'todos' ? selected.records : selected.records.filter(r => r.status === filter),
    [selected, filter],
  );

  const totals = useMemo(() => {
    const totalClasses = subjects.reduce((s, x) => s + x.totalClasses, 0);
    const attended = subjects.reduce((s, x) => s + x.attendedClasses, 0);
    const absences = subjects.reduce((s, x) => s + x.absences, 0);
    const justified = subjects.reduce((s, x) => s + x.justifiedAbsences, 0);
    return { rate: totalClasses ? Math.round((attended / totalClasses) * 100) : 0, absences, justified };
  }, [subjects]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/')} className="p-2 rounded-lg hover:bg-muted transition-colors">
                <ArrowLeft className="w-5 h-5 text-muted-foreground" />
              </button>
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-display font-bold text-foreground text-lg leading-tight">Controle de Presença</h1>
                <p className="text-xs text-muted-foreground">Semestre 2026.1</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Exportar relatório</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Resumo geral */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
              <ClipboardList className="w-4 h-4" /> Frequência geral
            </div>
            <p className="font-display text-3xl font-bold text-foreground">{totals.rate}%</p>
            <Progress value={totals.rate} className="mt-3 h-2" />
          </div>
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
              <XCircle className="w-4 h-4" /> Total de faltas
            </div>
            <p className="font-display text-3xl font-bold text-destructive">{totals.absences}</p>
            <p className="text-xs text-muted-foreground mt-2">No semestre atual</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
              <FileWarning className="w-4 h-4" /> Faltas justificadas
            </div>
            <p className="font-display text-3xl font-bold text-warning">{totals.justified}</p>
            <p className="text-xs text-muted-foreground mt-2">Documentos aprovados</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          {/* Lista de disciplinas */}
          <aside className="space-y-2">
            <h3 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-2 px-1">
              Disciplinas
            </h3>
            {subjectsAttendance.map(s => {
              const rate = attendanceRate(s);
              const risk = riskLevel(s);
              const isActive = s.id === selectedId;
              return (
                <button
                  key={s.id}
                  onClick={() => { setSelectedId(s.id); setFilter('todos'); }}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    isActive
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border bg-card hover:border-primary/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground font-mono">{s.code}</p>
                      <p className="font-semibold text-foreground text-sm leading-tight truncate">{s.name}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        risk === 'critico' ? 'border-destructive/40 text-destructive bg-destructive/10'
                        : risk === 'alerta' ? 'border-warning/40 text-warning bg-warning/10'
                        : 'border-success/40 text-success bg-success/10'
                      }
                    >
                      {rate}%
                    </Badge>
                  </div>
                  <Progress value={rate} className="h-1.5" />
                  <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                    <span>{s.attendedClasses}/{s.totalClasses} aulas</span>
                    <span>{s.absences}/{s.maxAbsences} faltas</span>
                  </div>
                </button>
              );
            })}
          </aside>

          {/* Detalhe da disciplina */}
          <motion.section
            key={selected.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl border border-border overflow-hidden"
          >
            <div className="p-5 border-b border-border">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-muted-foreground font-mono">{selected.code}</p>
                  <h2 className="font-display text-2xl font-bold text-foreground">{selected.name}</h2>
                  <p className="text-sm text-muted-foreground">{selected.professor}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => navigate(`/materia/${selected.id}`)}>
                    Ver detalhes
                  </Button>
                  <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground bg-muted px-3 py-2 rounded-lg">
                    <Calendar className="w-4 h-4" />
                    Próxima: <span className="font-medium text-foreground">{selected.nextClass}</span>
                  </div>
                </div>
              </div>

              {/* Alertas de risco */}
              {riskLevel(selected) !== 'ok' && (
                <div className={`mt-4 flex items-start gap-3 p-3 rounded-lg border ${
                  riskLevel(selected) === 'critico'
                    ? 'border-destructive/30 bg-destructive/5 text-destructive'
                    : 'border-warning/30 bg-warning/5 text-warning'
                }`}>
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold">
                      {riskLevel(selected) === 'critico'
                        ? 'Atenção: limite de faltas atingido'
                        : 'Aviso: você está próximo do limite de faltas'}
                    </p>
                    <p className="opacity-90">
                      {selected.absences} de {selected.maxAbsences} faltas permitidas (25% da carga horária).
                      {riskLevel(selected) === 'critico'
                        ? ' Reprovação por falta — procure a coordenação.'
                        : ` Restam ${selected.maxAbsences - selected.absences} faltas antes da reprovação.`}
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
                <Stat label="Frequência" value={`${attendanceRate(selected)}%`} tone="primary" />
                <Stat label="Presenças" value={`${selected.attendedClasses}`} tone="success" />
                <Stat label="Faltas" value={`${selected.absences}`} tone="destructive" />
                <Stat label="Justificadas" value={`${selected.justifiedAbsences}`} tone="warning" />
              </div>
            </div>

            {/* Histórico */}
            <div className="p-5">
              <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterStatus)}>
                <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                  <h3 className="font-display font-bold text-lg text-foreground">Histórico de aulas</h3>
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
                  <Download className="w-4 h-4" /> Baixar atestado de frequência
                </Button>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
};

function Stat({ label, value, tone }: { label: string; value: string; tone: 'primary' | 'success' | 'destructive' | 'warning' }) {
  const toneClass = {
    primary: 'text-primary',
    success: 'text-success',
    destructive: 'text-destructive',
    warning: 'text-warning',
  }[tone];
  return (
    <div className="bg-muted/50 rounded-lg p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`font-display text-xl font-bold ${toneClass}`}>{value}</p>
    </div>
  );
}

export default Attendance;
