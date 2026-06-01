// Tradutor de códigos compactos de horário acadêmico (R3 - Requisito emergente)
// Formato: DTNN onde D=dia (2-7), T=turno (M/T/N), NN=aulas
// Ex.: "2M34" = Segunda, Manhã, 3ª e 4ª aulas

const DAYS: Record<string, string> = {
  '2': 'Segunda-feira',
  '3': 'Terça-feira',
  '4': 'Quarta-feira',
  '5': 'Quinta-feira',
  '6': 'Sexta-feira',
  '7': 'Sábado',
};

const SHIFTS: Record<string, { label: string; base: number }> = {
  M: { label: 'Manhã', base: 7 },   // 1ª aula começa 7:30
  T: { label: 'Tarde', base: 13 },  // 1ª aula 13:00
  N: { label: 'Noite', base: 19 },  // 1ª aula 19:00
};

export interface DecodedSlot {
  raw: string;
  day: string;
  shift: string;
  lessons: string[];
  timeRange: string;
}

export function decodeScheduleCode(code: string): DecodedSlot | null {
  const match = code.trim().match(/^([2-7])([MTN])(\d+)$/);
  if (!match) return null;
  const [, d, t, nums] = match;
  const day = DAYS[d];
  const shift = SHIFTS[t];
  if (!day || !shift) return null;
  const lessons = nums.split('');
  const first = parseInt(lessons[0], 10);
  const last = parseInt(lessons[lessons.length - 1], 10);
  const startH = shift.base + (t === 'M' ? 0 : 0) + (first - 1);
  const endH = shift.base + (t === 'M' ? 0 : 0) + last;
  const fmt = (h: number, m = 0) =>
    `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  // Aulas de 50min na manhã com :30 inicial — simplificação
  const startMin = t === 'M' ? 30 : 0;
  return {
    raw: code,
    day,
    shift: shift.label,
    lessons: lessons.map(n => `${n}ª`),
    timeRange: `${fmt(startH, startMin)} – ${fmt(endH, startMin)}`,
  };
}

export function decodeScheduleCodes(codes: string): DecodedSlot[] {
  return codes
    .split(/\s+/)
    .map(decodeScheduleCode)
    .filter((s): s is DecodedSlot => s !== null);
}
