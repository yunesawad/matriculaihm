export interface AttendanceRecord {
  date: string; // dd/mm
  status: 'presente' | 'falta' | 'justificada';
  topic?: string;
}

export interface ClassSchedule {
  day: string;
  start: string;
  end: string;
  room: string;
}

export interface SyllabusUnit {
  title: string;
  topics: string[];
  status: 'concluido' | 'em-andamento' | 'pendente';
}

export interface SubjectAttendance {
  id: string;
  code: string;
  name: string;
  professor: string;
  professorEmail?: string;
  credits: number;
  totalClasses: number;
  attendedClasses: number;
  justifiedAbsences: number;
  absences: number;
  maxAbsences: number; // limite (25%)
  nextClass: string;
  schedule: ClassSchedule[];
  syllabus: SyllabusUnit[];
  records: AttendanceRecord[];
}

// Lista inicia vazia — disciplinas são preenchidas a partir das matrículas do aluno.
export const subjectsAttendance: SubjectAttendance[] = [];

const ENROLLED_KEY = 'enrollment.confirmedCourseIds.v1';

const DAY_MAP: Record<string, string> = {
  Seg: 'Segunda', Ter: 'Terça', Qua: 'Quarta', Qui: 'Quinta', Sex: 'Sexta', Sab: 'Sábado',
};

/** Cria um SubjectAttendance "vazio" (sem aulas ainda) a partir de um curso matriculado. */
function subjectFromCourse(c: import('./courses').Course): SubjectAttendance {
  const firstSlot = c.schedule[0];
  return {
    id: `enr-${c.id}`,
    code: c.code,
    name: c.name,
    professor: c.professor,
    credits: c.credits,
    totalClasses: 0,
    attendedClasses: 0,
    justifiedAbsences: 0,
    absences: 0,
    maxAbsences: Math.max(4, c.credits * 4), // estimativa: 25% da carga horária
    nextClass: firstSlot ? `${firstSlot.day}, primeira aula — ${firstSlot.start}` : 'A definir',
    schedule: c.schedule.map(s => ({
      day: DAY_MAP[s.day] ?? s.day,
      start: s.start,
      end: s.end,
      room: s.room,
    })),
    syllabus: [
      { title: 'Plano de ensino', topics: [c.description], status: 'pendente' },
    ],
    records: [],
  };
}

/** Lê IDs matriculados do localStorage (SSR-safe). */
function readEnrolledIds(): string[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(ENROLLED_KEY) || '[]'); } catch { return []; }
}

/** Lista combinada: mock + disciplinas recém-matriculadas. */
export function getAllSubjects(): SubjectAttendance[] {
  // Import dinâmico para evitar ciclo
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { courses } = require('./courses') as typeof import('./courses');
  const ids = readEnrolledIds();
  const existingCodes = new Set(subjectsAttendance.map(s => s.code));
  const extras = courses
    .filter(c => ids.includes(c.id) && !existingCodes.has(c.code))
    .map(subjectFromCourse);
  return [...subjectsAttendance, ...extras];
}

export const getSubjectById = (id: string) =>
  getAllSubjects().find((s) => s.id === id);

export const getSubjectByName = (name: string) =>
  getAllSubjects().find((s) => s.name.toLowerCase().includes(name.toLowerCase().split(' ')[0]));
