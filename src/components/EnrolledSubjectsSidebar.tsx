import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Course, courses as allCourses } from '@/data/courses';
import { getAllSubjects, type SubjectAttendance } from '@/data/attendance';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, BookOpen, CheckCircle2, Clock, Lightbulb, TrendingDown, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const ENROLLED_KEY = 'enrollment.confirmedCourseIds.v1';

interface EnrolledSubject {
  course: Course;
  attendance: SubjectAttendance | undefined;
}

const getTip = (subject: SubjectAttendance): { text: string; icon: React.ReactNode; type: 'info' | 'warning' | 'success' } => {
  const attendanceRate = subject.totalClasses ? (subject.attendedClasses / subject.totalClasses) * 100 : 0;
  const absenceRate = subject.maxAbsences ? (subject.absences / subject.maxAbsences) * 100 : 0;

  // Crítico - limite de faltas atingido
  if (absenceRate >= 100) {
    return {
      text: `Limite de faltas atingido em ${subject.name}. Procure a coordenação imediatamente.`,
      icon: <AlertTriangle className="w-4 h-4" />,
      type: 'warning',
    };
  }

  // Alerta - próximo do limite de faltas
  if (absenceRate >= 70) {
    return {
      text: `Você tem ${subject.maxAbsences - subject.absences} falta(s) antes da reprovação em ${subject.name}.`,
      icon: <AlertTriangle className="w-4 h-4" />,
      type: 'warning',
    };
  }

  // Alerta - baixa frequência
  if (attendanceRate < 75 && subject.totalClasses > 0) {
    return {
      text: `Sua frequência em ${subject.name} está baixa (${Math.round(attendanceRate)}%). Aumente sua presença!`,
      icon: <TrendingDown className="w-4 h-4" />,
      type: 'warning',
    };
  }

  // Sucesso - bom desempenho
  if (attendanceRate >= 90) {
    return {
      text: `Excelente frequência em ${subject.name}! Continue assim!`,
      icon: <CheckCircle2 className="w-4 h-4" />,
      type: 'success',
    };
  }

  // Info - status normal
  return {
    text: `Continue acompanhando suas aulas em ${subject.name}. Próxima aula: ${subject.nextClass}`,
    icon: <Clock className="w-4 h-4" />,
    type: 'info',
  };
};

export default function EnrolledSubjectsSidebar() {
  const navigate = useNavigate();
  const [enrolledSubjects, setEnrolledSubjects] = useState<EnrolledSubject[]>([]);
  const [tips, setTips] = useState<Array<{ text: string; icon: React.ReactNode; type: 'info' | 'warning' | 'success' }>>([]);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  const refresh = useCallback(() => {
    try {
      const enrolledIds: string[] = JSON.parse(localStorage.getItem(ENROLLED_KEY) || '[]');
      const enrolledCourses = allCourses.filter(c => enrolledIds.includes(c.id));
      const attendanceData = getAllSubjects();

      const subjects = enrolledCourses.map(course => ({
        course,
        attendance: attendanceData.find(a => a.id === `enr-${course.id}`),
      }));

      setEnrolledSubjects(subjects);

      // Generate tips from attendance data
      const newTips = subjects
        .map(s => s.attendance)
        .filter((a): a is SubjectAttendance => a !== undefined)
        .map(getTip);

      setTips(newTips);
      setCurrentTipIndex(0);
    } catch {
      setEnrolledSubjects([]);
      setTips([]);
    }
  }, []);

  useEffect(() => {
    refresh();

    window.addEventListener('enrollment:updated', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('enrollment:updated', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, [refresh]);

  if (enrolledSubjects.length === 0) {
    return null;
  }

  const currentTip = tips[currentTipIndex];

  return (
    <aside className="bg-card rounded-xl border border-border p-4">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-4 h-4 text-primary" />
          <h3 className="font-display font-bold text-sm text-foreground">Minhas Disciplinas</h3>
          <Badge variant="secondary" className="ml-auto text-xs">{enrolledSubjects.length}</Badge>
        </div>

        {/* Lista compacta de disciplinas */}
        <div className="space-y-2 max-h-48 overflow-y-auto mb-4">
          {enrolledSubjects.map(({ course, attendance }) => {
            const rate = attendance && attendance.totalClasses
              ? Math.round((attendance.attendedClasses / attendance.totalClasses) * 100)
              : 0;

            const riskLevel = attendance
              ? attendance.absences / attendance.maxAbsences >= 1
                ? 'critico'
                : attendance.absences / attendance.maxAbsences >= 0.7
                ? 'alerta'
                : 'ok'
              : 'ok';

            return (
              <button
                key={course.id}
                onClick={() => navigate(`/materia/enr-${course.id}`)}
                className="w-full text-left p-2 rounded-lg border border-border hover:border-primary/40 hover:bg-primary/5 transition-colors text-sm"
              >
                <p className="font-semibold text-foreground text-xs truncate">{course.name}</p>
                <p className="text-xs text-muted-foreground font-mono mb-1">{course.code}</p>
                <div className="flex items-center gap-2 justify-between">
                  <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all',
                        riskLevel === 'critico' && 'bg-destructive',
                        riskLevel === 'alerta' && 'bg-warning',
                        riskLevel === 'ok' && 'bg-success'
                      )}
                      style={{ width: `${rate}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground">{rate}%</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dicas dinâmicas */}
      {currentTip && tips.length > 0 && (
        <div className={cn(
          'rounded-lg border p-3',
          currentTip.type === 'warning' && 'border-warning/30 bg-warning/5',
          currentTip.type === 'success' && 'border-success/30 bg-success/5',
          currentTip.type === 'info' && 'border-primary/30 bg-primary/5'
        )}>
          <div className="flex items-start gap-2 mb-2">
            <div className={cn(
              currentTip.type === 'warning' && 'text-warning',
              currentTip.type === 'success' && 'text-success',
              currentTip.type === 'info' && 'text-primary'
            )}>
              {currentTip.icon}
            </div>
            <p className={cn(
              'text-xs leading-relaxed',
              currentTip.type === 'warning' && 'text-warning',
              currentTip.type === 'success' && 'text-success',
              currentTip.type === 'info' && 'text-primary'
            )}>
              {currentTip.text}
            </p>
          </div>

          {tips.length > 1 && (
            <div className="flex items-center justify-between gap-2 mt-3">
              <div className="flex gap-1">
                {tips.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentTipIndex(i)}
                    className={cn(
                      'w-1.5 h-1.5 rounded-full transition-all',
                      currentTipIndex === i ? 'bg-primary' : 'bg-border'
                    )}
                  />
                ))}
              </div>
              <button
                onClick={() => setCurrentTipIndex((i) => (i + 1) % tips.length)}
                className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
              >
                <Lightbulb className="w-3 h-3" /> Próxima
              </button>
            </div>
          )}
        </div>
      )}

      <Button
        variant="outline"
        size="sm"
        className="w-full mt-3 text-xs"
        onClick={() => navigate('/presenca')}
      >
        Ver detalhes de presença
      </Button>
    </aside>
  );
}
