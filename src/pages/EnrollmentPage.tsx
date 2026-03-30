import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEnrollment } from '@/context/EnrollmentContext';
import Stepper from '@/components/Stepper';
import CourseCard from '@/components/CourseCard';
import EnrollmentSidebar from '@/components/EnrollmentSidebar';
import ScheduleGrid from '@/components/ScheduleGrid';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Check, CheckCircle2, AlertTriangle, Download, Home, Calendar, ChevronLeft, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const EnrollmentPage = () => {
  const navigate = useNavigate();
  const enrollment = useEnrollment();
  const { step, setStep, courses, selectedCourses, totalCredits, confirmEnrollment, confirmed, reset } = enrollment;

  // Filters
  const [typeFilter, setTypeFilter] = useState<'all' | 'obrigatoria' | 'optativa'>('all');
  const [periodFilter, setPeriodFilter] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'enabled' | 'disabled'>('all');
  const [search, setSearch] = useState('');

  // Confirmation modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [processing, setProcessing] = useState(false);

  const filteredCourses = courses.filter(c => {
    if (typeFilter !== 'all' && c.type !== typeFilter) return false;
    if (periodFilter !== null && c.period !== periodFilter) return false;
    if (statusFilter === 'enabled' && !c.enabled) return false;
    if (statusFilter === 'disabled' && c.enabled) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.code.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const weeklyHours = selectedCourses.reduce((sum, c) => sum + c.schedule.length * 1.5, 0);

  const handleConfirm = () => {
    setProcessing(true);
    setTimeout(() => {
      confirmEnrollment();
      setShowConfirmModal(false);
      setProcessing(false);
    }, 2000);
  };

  // ========== TELA 5 - CONFIRMATION SUCCESS ==========
  if (confirmed) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="mb-6">
            <Stepper current="confirm" />
          </div>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-20 h-20 mx-auto bg-success rounded-full flex items-center justify-center mb-6"
            >
              <Check className="w-10 h-10 text-success-foreground" />
            </motion.div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Matrícula realizada com sucesso!
            </h1>
            <p className="text-muted-foreground mb-2">Protocolo: <span className="font-mono font-bold text-foreground">#2026.2.12345</span></p>
          </motion.div>

          <div className="bg-card rounded-xl border border-border p-6 mb-6">
            <h3 className="font-display font-bold text-lg mb-4">Resumo da Matrícula</h3>
            <div className="space-y-2">
              {selectedCourses.map(c => (
                <div key={c.id} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium text-foreground">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.code} · {c.professor}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">{c.credits}cr</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border flex justify-between">
              <span className="font-display font-bold">Total</span>
              <span className="font-display font-bold text-primary">{totalCredits} créditos</span>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-4 mb-6 space-y-2">
            <h4 className="font-display font-semibold text-sm text-foreground">Próximos Passos</h4>
            <p className="text-sm text-muted-foreground">📅 Período de ajustes: 05/04 a 10/04</p>
            <p className="text-sm text-muted-foreground">📚 Início das aulas: 15/04</p>
            <p className="text-sm text-muted-foreground">📧 Consulte seu e-mail para confirmação</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="outline"><Download className="w-4 h-4 mr-2" />Baixar Comprovante</Button>
            <Button variant="outline"><Calendar className="w-4 h-4 mr-2" />Ver Minha Grade</Button>
            <Button onClick={() => { reset(); navigate('/'); }}><Home className="w-4 h-4 mr-2" />Voltar ao Dashboard</Button>
          </div>
        </div>
      </div>
    );
  }

  // ========== TELA 4 - REVIEW ==========
  if (step === 'review') {
    const hasConflicts = selectedCourses.some(c => {
      const others = selectedCourses.filter(o => o.id !== c.id);
      return others.some(o =>
        c.schedule.some(sa => o.schedule.some(sb =>
          sa.day === sb.day && (() => {
            const toMin = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
            return toMin(sa.start) < toMin(sb.end) && toMin(sb.start) < toMin(sa.end);
          })()
        ))
      );
    });

    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-6 flex items-center justify-between">
            <Stepper current="review" />
            <span className="text-sm text-muted-foreground">Dashboard &gt; Matrícula 2026.2 &gt; Revisão</span>
          </div>

          <h2 className="font-display text-2xl font-bold text-foreground mb-6">Revisão da Matrícula</h2>

          <div className="grid gap-4 mb-6">
            {selectedCourses.map(c => (
              <div key={c.id} className="bg-card rounded-xl border border-border p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-display font-bold text-foreground">{c.name}</h4>
                  <p className="text-sm text-muted-foreground">{c.code} · {c.professor}</p>
                  <p className="text-sm text-muted-foreground">
                    {c.schedule.map(s => `${s.day} ${s.start}-${s.end} (${s.room})`).join(' | ')}
                  </p>
                </div>
                <Badge variant="secondary" className="font-bold text-lg">{c.credits}cr</Badge>
              </div>
            ))}
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-card rounded-xl border border-border p-4 text-center">
              <p className="text-sm text-muted-foreground">Total Créditos</p>
              <p className="text-2xl font-display font-bold text-primary">{totalCredits}</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4 text-center">
              <p className="text-sm text-muted-foreground">Horas/Semana</p>
              <p className="text-2xl font-display font-bold text-foreground">{weeklyHours}h</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4 text-center">
              <p className="text-sm text-muted-foreground">Disciplinas</p>
              <p className="text-2xl font-display font-bold text-foreground">{selectedCourses.length}</p>
            </div>
          </div>

          {/* Alerts */}
          <div className="space-y-2 mb-6">
            {!hasConflicts ? (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-success/10 text-success text-sm font-medium">
                <CheckCircle2 className="w-4 h-4" /> Sem conflitos de horário
              </div>
            ) : (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-medium">
                <AlertTriangle className="w-4 h-4" /> Conflito de horário detectado!
              </div>
            )}
            {weeklyHours > 24 && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-warning/10 text-warning text-sm font-medium">
                <AlertTriangle className="w-4 h-4" /> Carga horária alta ({weeklyHours}h/semana) - Média: 20h
              </div>
            )}
            <div className="flex items-center gap-2 p-3 rounded-lg bg-success/10 text-success text-sm font-medium">
              <CheckCircle2 className="w-4 h-4" /> Todos os pré-requisitos atendidos
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep('select')}>
              <ChevronLeft className="w-4 h-4 mr-1" />Voltar
            </Button>
            <Button size="lg" className="font-display font-bold flex-1" onClick={() => setShowConfirmModal(true)}>
              Confirmar Matrícula
            </Button>
          </div>

          {/* Confirmation Modal */}
          <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-display">Confirmar Matrícula?</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div className="space-y-1">
                  {selectedCourses.map(c => (
                    <p key={c.id} className="text-sm text-foreground">• {c.name} ({c.code})</p>
                  ))}
                </div>
                <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
                  <p className="text-sm text-foreground">
                    <strong>Importante:</strong> Após confirmar, alterações só podem ser feitas durante o período de ajustes (05/04 a 10/04).
                  </p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={agreed} onCheckedChange={(v) => setAgreed(v === true)} />
                  <span className="text-sm text-foreground">Li e concordo com as condições</span>
                </label>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowConfirmModal(false)} disabled={processing}>Cancelar</Button>
                <Button onClick={handleConfirm} disabled={!agreed || processing} className="font-display font-bold">
                  {processing ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Processando...
                    </span>
                  ) : 'Confirmar Matrícula'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    );
  }

  // ========== TELA 2 - COURSE SELECTION ==========
  const FilterBtn = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button
      onClick={onClick}
      className={cn(
        'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
        active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
      )}
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb + Stepper */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <button onClick={() => navigate('/')} className="hover:text-foreground transition-colors">Dashboard</button>
            <span>&gt;</span>
            <span className="text-foreground font-medium">Matrícula 2026.2</span>
          </div>
          <Stepper current="select" />
        </div>

        <div className="flex gap-6">
          {/* Main area */}
          <div className="flex-1 min-w-0">
            {/* Filters */}
            <div className="bg-card rounded-xl border border-border p-4 mb-4 space-y-3">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar por nome ou código..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="flex gap-1">
                  <FilterBtn active={typeFilter === 'all'} onClick={() => setTypeFilter('all')}>Todas</FilterBtn>
                  <FilterBtn active={typeFilter === 'obrigatoria'} onClick={() => setTypeFilter('obrigatoria')}>Obrigatórias</FilterBtn>
                  <FilterBtn active={typeFilter === 'optativa'} onClick={() => setTypeFilter('optativa')}>Optativas</FilterBtn>
                </div>
                <div className="w-px bg-border" />
                <div className="flex gap-1">
                  <FilterBtn active={periodFilter === null} onClick={() => setPeriodFilter(null)}>Todos Per.</FilterBtn>
                  {[3, 4, 5].map(p => (
                    <FilterBtn key={p} active={periodFilter === p} onClick={() => setPeriodFilter(p)}>{p}°</FilterBtn>
                  ))}
                </div>
                <div className="w-px bg-border" />
                <div className="flex gap-1">
                  <FilterBtn active={statusFilter === 'all'} onClick={() => setStatusFilter('all')}>Todos</FilterBtn>
                  <FilterBtn active={statusFilter === 'enabled'} onClick={() => setStatusFilter('enabled')}>Habilitado</FilterBtn>
                  <FilterBtn active={statusFilter === 'disabled'} onClick={() => setStatusFilter('disabled')}>Não hab.</FilterBtn>
                </div>
              </div>
            </div>

            {/* Course cards */}
            <div className="space-y-3">
              {filteredCourses.map(c => (
                <CourseCard key={c.id} course={c} />
              ))}
              {filteredCourses.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  Nenhuma disciplina encontrada com os filtros selecionados.
                </div>
              )}
            </div>
          </div>

          {/* Right sidebar */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <EnrollmentSidebar />
          </div>
        </div>
      </div>

      <ScheduleGrid />
    </div>
  );
};

export default EnrollmentPage;
