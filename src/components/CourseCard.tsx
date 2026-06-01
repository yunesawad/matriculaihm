import { Course } from '@/data/courses';
import { useEnrollment } from '@/context/EnrollmentContext';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertTriangle, Check, Info, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { motion } from 'framer-motion';
import CompactCodeTooltip from './CompactCodeTooltip';
import { getCompactCode } from '@/lib/compactCode';

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  const { selectedCourses, toggleCourse, hasConflict, conflictingIds } = useEnrollment();
  const isSelected = selectedCourses.some(c => c.id === course.id);
  const conflict = !isSelected ? hasConflict(course) : null;
  // R4 — Quando selecionado, ambos os lados do conflito ficam destacados
  const isInConflict = isSelected && conflictingIds.has(course.id);
  const [justSelected, setJustSelected] = useState(false);
  const slotsLow = course.slots.total - course.slots.taken <= 5;
  const slotsFull = course.slots.taken >= course.slots.total;
  const slotsPercent = (course.slots.taken / course.slots.total) * 100;

  const areaColors: Record<string, string> = {
    exatas: 'border-l-[hsl(var(--area-exatas))]',
    humanas: 'border-l-[hsl(var(--area-humanas))]',
    sociais: 'border-l-[hsl(var(--area-sociais))]',
    default: 'border-l-[hsl(var(--area-default))]',
  };

  const handleToggle = () => {
    if (!course.enabled || slotsFull) return;
    toggleCourse(course);
    if (!isSelected) {
      setJustSelected(true);
      setTimeout(() => setJustSelected(false), 300);
    }
  };

  const scheduleText = course.schedule
    .map(s => `${s.day} ${s.start}-${s.end}`)
    .join(', ');

  return (
    <motion.div
      layout
      className={cn(
        'bg-card rounded-xl border-l-4 border border-border p-4 transition-all cursor-pointer',
        areaColors[course.area] || areaColors.default,
        isSelected && !isInConflict && 'ring-2 ring-primary/50 border-primary/30 bg-primary/5',
        // R4 — destaque vermelho quando ambas selecionadas conflitam
        isInConflict && 'ring-2 ring-destructive border-destructive bg-destructive/5 conflict-stripes',
        conflict && !isSelected && 'opacity-80',
        !course.enabled && 'opacity-50 cursor-not-allowed',
        slotsFull && course.enabled && 'opacity-60',
        justSelected && 'animate-card-pulse',
      )}
      onClick={handleToggle}
    >
      <div className="flex items-start gap-3">
        <div className="pt-0.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Checkbox
                  checked={isSelected}
                  disabled={!course.enabled || slotsFull}
                  className="w-5 h-5"
                  onCheckedChange={() => handleToggle()}
                  onClick={e => e.stopPropagation()}
                />
              </div>
            </TooltipTrigger>
            {(!course.enabled || slotsFull) && (
              <TooltipContent>
                {!course.enabled ? course.disabledReason : 'Vagas esgotadas'}
              </TooltipContent>
            )}
          </Tooltip>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <h4 className="font-display font-bold text-foreground text-base leading-tight">{course.name}</h4>
              <p className="text-xs text-muted-foreground mt-0.5">{course.code} · {course.credits} créditos</p>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-1 rounded hover:bg-muted transition-colors flex-shrink-0" onClick={e => e.stopPropagation()}>
                  <Info className="w-4 h-4 text-muted-foreground" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-sm">{course.description}</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <p className="text-sm text-muted-foreground mb-1">{course.professor}</p>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <p className="text-sm text-foreground/80">📅 {scheduleText}</p>
            {/* R3 — código compacto traduzido em tooltip */}
            <CompactCodeTooltip code={getCompactCode(course)} />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Slots */}
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-muted-foreground" />
              <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn('h-full rounded-full transition-all', slotsPercent > 90 ? 'bg-destructive' : slotsPercent > 70 ? 'bg-warning' : 'bg-success')}
                  style={{ width: `${slotsPercent}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">{course.slots.taken}/{course.slots.total}</span>
            </div>

            {slotsLow && !slotsFull && (
              <Badge className="bg-destructive/10 text-destructive border-0 text-xs">Últimas vagas!</Badge>
            )}
            {slotsFull && (
              <Badge className="bg-muted text-muted-foreground border-0 text-xs">Esgotado</Badge>
            )}

            {/* Prerequisites */}
            {course.prerequisitesMet ? (
              <Badge className="bg-success/10 text-success border-0 text-xs">
                <Check className="w-3 h-3 mr-0.5" /> Pré-requisito OK
              </Badge>
            ) : (
              <Badge className="bg-warning/10 text-warning border-0 text-xs">
                <AlertTriangle className="w-3 h-3 mr-0.5" /> Requer: {course.prerequisites.join(', ')}
              </Badge>
            )}

            {conflict && !isSelected && (
              <Badge className="bg-destructive/10 text-destructive border-0 text-xs">
                <AlertTriangle className="w-3 h-3 mr-0.5" /> Conflito com {conflict.code}
              </Badge>
            )}
            {isInConflict && (
              <Badge className="bg-destructive text-destructive-foreground border-0 text-xs">
                <AlertTriangle className="w-3 h-3 mr-0.5" /> Em conflito de horário
              </Badge>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;
