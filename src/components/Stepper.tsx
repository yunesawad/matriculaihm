import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepperProps {
  current: 'select' | 'review' | 'confirm';
}

const steps = [
  { key: 'select', label: '1. Selecionar' },
  { key: 'review', label: '2. Revisar' },
  { key: 'confirm', label: '3. Confirmar' },
] as const;

const Stepper = ({ current }: StepperProps) => {
  const currentIdx = steps.findIndex(s => s.key === current);

  return (
    <div className="flex items-center gap-2">
      {steps.map((step, i) => {
        const isDone = i < currentIdx || (current === 'confirm' && i <= currentIdx);
        const isActive = i === currentIdx && current !== 'confirm';
        return (
          <div key={step.key} className="flex items-center gap-2">
            {i > 0 && <div className={cn('w-8 h-0.5 rounded', isDone ? 'bg-success' : isActive ? 'bg-primary' : 'bg-border')} />}
            <div className="flex items-center gap-1.5">
              <div className={cn(
                'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors',
                isDone ? 'bg-success text-success-foreground' :
                isActive ? 'bg-primary text-primary-foreground' :
                'bg-muted text-muted-foreground'
              )}>
                {isDone ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className={cn(
                'text-sm font-medium hidden sm:block',
                isDone ? 'text-success' : isActive ? 'text-primary' : 'text-muted-foreground'
              )}>
                {step.label.split('. ')[1]}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;
