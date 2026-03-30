import { useEnrollment } from '@/context/EnrollmentContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { useState } from 'react';

const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
const timeSlots = ['7:30', '9:15', '11:00', '13:00', '14:45', '16:30', '18:15', '20:00'];
const timeEnds = ['9:00', '11:00', '12:45', '14:45', '16:30', '18:15', '20:00', '21:45'];

const areaColorMap: Record<string, string> = {
  exatas: 'bg-[hsl(220,72%,55%)]/20 border-[hsl(220,72%,55%)]/40 text-[hsl(220,72%,35%)]',
  humanas: 'bg-[hsl(160,50%,45%)]/20 border-[hsl(160,50%,45%)]/40 text-[hsl(160,50%,25%)]',
  sociais: 'bg-[hsl(280,50%,55%)]/20 border-[hsl(280,50%,55%)]/40 text-[hsl(280,50%,35%)]',
  default: 'bg-muted border-border text-muted-foreground',
};

const ScheduleGrid = () => {
  const { showSchedule, setShowSchedule, selectedCourses, courses } = useEnrollment();
  const [showAll, setShowAll] = useState(false);

  const displayCourses = showAll ? courses.filter(c => c.enabled) : selectedCourses;

  const getBlock = (day: string, time: string) => {
    return displayCourses.filter(c =>
      c.schedule.some(s => s.day === day && s.start === time)
    );
  };

  // Check conflicts
  const hasConflict = (day: string, time: string) => {
    return getBlock(day, time).length > 1;
  };

  return (
    <Dialog open={showSchedule} onOpenChange={setShowSchedule}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Grade Horária</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-2 mb-4">
          <Button
            variant={showAll ? 'outline' : 'default'}
            size="sm"
            onClick={() => setShowAll(false)}
          >
            Ver selecionadas
          </Button>
          <Button
            variant={showAll ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowAll(true)}
          >
            Ver todas as turmas
          </Button>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[700px]">
            {/* Header */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              <div className="text-xs font-medium text-muted-foreground p-2">Horário</div>
              {days.map(d => (
                <div key={d} className="text-xs font-bold text-center text-foreground p-2 bg-muted rounded-lg">
                  {d}
                </div>
              ))}
            </div>

            {/* Time rows */}
            {timeSlots.map((time, ti) => (
              <div key={time} className="grid grid-cols-7 gap-1 mb-1">
                <div className="text-xs text-muted-foreground p-2 flex items-center">
                  {time}<br/>{timeEnds[ti]}
                </div>
                {days.map(day => {
                  const blocks = getBlock(day, time);
                  const conflict = hasConflict(day, time);
                  return (
                    <div key={`${day}-${time}`} className={cn(
                      'min-h-[60px] rounded-lg p-1',
                      blocks.length === 0 && 'bg-muted/30',
                      conflict && 'conflict-stripes',
                    )}>
                      {blocks.map(c => {
                        const sched = c.schedule.find(s => s.day === day && s.start === time);
                        return (
                          <div
                            key={c.id}
                            className={cn(
                              'rounded-md border p-1.5 text-xs h-full',
                              areaColorMap[c.area] || areaColorMap.default,
                            )}
                          >
                            <p className="font-bold truncate">{c.code}</p>
                            <p className="truncate opacity-80">{c.name.substring(0, 15)}</p>
                            <p className="opacity-60">{sched?.room}</p>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleGrid;
