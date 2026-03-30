import { useEnrollment } from '@/context/EnrollmentContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Calendar, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EnrollmentSidebar = () => {
  const { selectedCourses, removeCourse, totalCredits, setShowSchedule, setStep, hasConflict } = useEnrollment();

  const conflicts = selectedCourses.filter(c => {
    const others = selectedCourses.filter(o => o.id !== c.id);
    for (const o of others) {
      for (const sa of c.schedule) {
        for (const sb of o.schedule) {
          if (sa.day === sb.day) {
            const toMin = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
            if (toMin(sa.start) < toMin(sb.end) && toMin(sb.start) < toMin(sa.end)) return true;
          }
        }
      }
    }
    return false;
  });

  return (
    <div className="bg-card rounded-xl border border-border p-4 sticky top-24 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-foreground text-base">Suas Disciplinas</h3>
        <Badge variant="secondary" className="font-semibold">
          {selectedCourses.length} disc. · {totalCredits} cred.
        </Badge>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        <AnimatePresence>
          {selectedCourses.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">Nenhuma disciplina selecionada</p>
          ) : (
            selectedCourses.map(c => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center justify-between gap-2 py-1.5 px-2 rounded-lg bg-muted/50"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.code} · {c.credits}cr</p>
                </div>
                <button onClick={() => removeCourse(c.id)} className="p-1 rounded hover:bg-destructive/10 transition-colors flex-shrink-0">
                  <X className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {conflicts.length > 0 && (
        <div className="flex items-center gap-2 p-2 rounded-lg bg-destructive/10 text-destructive text-xs font-medium">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          Conflito de horário detectado!
        </div>
      )}

      <Button
        variant="outline"
        className="w-full"
        onClick={() => setShowSchedule(true)}
        disabled={selectedCourses.length === 0}
      >
        <Calendar className="w-4 h-4 mr-2" />
        Ver Grade Horária
      </Button>

      <Button
        className="w-full font-display font-bold"
        disabled={selectedCourses.length === 0}
        onClick={() => setStep('review')}
      >
        Continuar →
      </Button>
    </div>
  );
};

export default EnrollmentSidebar;
