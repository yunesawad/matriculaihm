import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { decodeScheduleCodes } from '@/lib/scheduleCode';
import { Languages } from 'lucide-react';

interface Props {
  code: string;
}

/**
 * R3 — Tradutor de horário compacto.
 * Mostra códigos crípticos como "2M34 4T12" com tooltip explicando.
 */
const CompactCodeTooltip = ({ code }: Props) => {
  const decoded = decodeScheduleCodes(code);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={e => e.stopPropagation()}
          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
        >
          <Languages className="w-3 h-3" />
          {code}
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p className="text-xs font-semibold mb-1">Tradução do código:</p>
        {decoded.length === 0 ? (
          <p className="text-xs">Formato não reconhecido</p>
        ) : (
          <ul className="space-y-1">
            {decoded.map(d => (
              <li key={d.raw} className="text-xs">
                <span className="font-mono font-bold">{d.raw}</span> ={' '}
                {d.day}, {d.shift} ({d.lessons.join(' e ')} aulas) — {d.timeRange}
              </li>
            ))}
          </ul>
        )}
      </TooltipContent>
    </Tooltip>
  );
};

export default CompactCodeTooltip;
