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

export const subjectsAttendance: SubjectAttendance[] = [
  {
    id: '1', code: 'MAT102', name: 'Cálculo II', professor: 'Dr. Ricardo Almeida',
    professorEmail: 'ricardo.almeida@unisystem.edu', credits: 4,
    totalClasses: 40, attendedClasses: 36, justifiedAbsences: 1, absences: 3, maxAbsences: 10,
    nextClass: 'Seg, 02/04 — 07:30',
    schedule: [
      { day: 'Segunda', start: '07:30', end: '09:00', room: 'A-201' },
      { day: 'Quarta', start: '07:30', end: '09:00', room: 'A-201' },
    ],
    syllabus: [
      { title: 'Unidade 1 — Integrais', topics: ['Integrais definidas e indefinidas', 'Técnicas de integração', 'Integração por partes'], status: 'concluido' },
      { title: 'Unidade 2 — Aplicações', topics: ['Substituição trigonométrica', 'Frações parciais', 'Aplicações de integrais'], status: 'concluido' },
      { title: 'Unidade 3 — Volumes e Comprimentos', topics: ['Volumes por discos', 'Volumes por cascas', 'Comprimento de arco'], status: 'em-andamento' },
      { title: 'Unidade 4 — Séries', topics: ['Sequências e séries', 'Critérios de convergência', 'Séries de Taylor'], status: 'pendente' },
    ],
    records: [
      { date: '01/03', status: 'presente', topic: 'Integrais definidas' },
      { date: '03/03', status: 'presente', topic: 'Técnicas de integração' },
      { date: '08/03', status: 'falta', topic: 'Integração por partes' },
      { date: '10/03', status: 'presente', topic: 'Substituição trigonométrica' },
      { date: '15/03', status: 'justificada', topic: 'Frações parciais (atestado médico)' },
      { date: '17/03', status: 'presente', topic: 'Aplicações de integrais' },
      { date: '22/03', status: 'falta', topic: 'Volumes por discos' },
      { date: '24/03', status: 'presente', topic: 'Volumes por cascas' },
      { date: '29/03', status: 'falta', topic: 'Comprimento de arco' },
      { date: '31/03', status: 'presente', topic: 'Revisão para prova' },
    ],
  },
  {
    id: '2', code: 'FIS102', name: 'Física II', professor: 'Dra. Maria Santos',
    professorEmail: 'maria.santos@unisystem.edu', credits: 4,
    totalClasses: 38, attendedClasses: 30, justifiedAbsences: 0, absences: 8, maxAbsences: 9,
    nextClass: 'Ter, 03/04 — 09:15',
    schedule: [
      { day: 'Terça', start: '09:15', end: '11:00', room: 'B-105' },
      { day: 'Quinta', start: '09:15', end: '11:00', room: 'B-105' },
    ],
    syllabus: [
      { title: 'Unidade 1 — Termodinâmica I', topics: ['Temperatura e calor', 'Lei zero', 'Primeira lei'], status: 'concluido' },
      { title: 'Unidade 2 — Termodinâmica II', topics: ['Processos isotérmicos', 'Capacidade térmica', 'Segunda lei'], status: 'em-andamento' },
      { title: 'Unidade 3 — Aplicações', topics: ['Ciclos termodinâmicos', 'Entropia', 'Máquinas térmicas'], status: 'pendente' },
    ],
    records: [
      { date: '02/03', status: 'presente', topic: 'Termodinâmica I' },
      { date: '04/03', status: 'falta', topic: 'Lei zero da termodinâmica' },
      { date: '09/03', status: 'falta', topic: 'Primeira lei' },
      { date: '11/03', status: 'presente', topic: 'Processos isotérmicos' },
      { date: '16/03', status: 'falta', topic: 'Capacidade térmica' },
      { date: '18/03', status: 'presente', topic: 'Segunda lei' },
      { date: '23/03', status: 'falta', topic: 'Ciclos termodinâmicos' },
      { date: '25/03', status: 'falta', topic: 'Entropia' },
      { date: '30/03', status: 'presente', topic: 'Máquinas térmicas' },
    ],
  },
  {
    id: '3', code: 'COM201', name: 'Programação Orientada a Objetos', professor: 'Dr. Pedro Costa',
    professorEmail: 'pedro.costa@unisystem.edu', credits: 4,
    totalClasses: 40, attendedClasses: 40, justifiedAbsences: 0, absences: 0, maxAbsences: 10,
    nextClass: 'Qua, 04/04 — 09:15',
    schedule: [
      { day: 'Segunda', start: '09:15', end: '11:00', room: 'C-302' },
      { day: 'Quarta', start: '09:15', end: '11:00', room: 'C-302' },
    ],
    syllabus: [
      { title: 'Unidade 1 — Fundamentos', topics: ['Classes e objetos', 'Encapsulamento', 'Herança', 'Polimorfismo'], status: 'concluido' },
      { title: 'Unidade 2 — Design Patterns', topics: ['Interfaces', 'Padrões de projeto', 'Singleton e Factory', 'Observer'], status: 'em-andamento' },
      { title: 'Unidade 3 — Qualidade', topics: ['Tratamento de exceções', 'Testes unitários', 'Refatoração'], status: 'pendente' },
    ],
    records: [
      { date: '01/03', status: 'presente', topic: 'Classes e objetos' },
      { date: '03/03', status: 'presente', topic: 'Encapsulamento' },
      { date: '08/03', status: 'presente', topic: 'Herança' },
      { date: '10/03', status: 'presente', topic: 'Polimorfismo' },
      { date: '15/03', status: 'presente', topic: 'Interfaces' },
      { date: '17/03', status: 'presente', topic: 'Padrões de projeto' },
      { date: '22/03', status: 'presente', topic: 'Singleton e Factory' },
      { date: '24/03', status: 'presente', topic: 'Observer' },
      { date: '29/03', status: 'presente', topic: 'Tratamento de exceções' },
      { date: '31/03', status: 'presente', topic: 'Testes unitários' },
    ],
  },
  {
    id: '4', code: 'EST101', name: 'Estatística', professor: 'Dra. Ana Oliveira',
    professorEmail: 'ana.oliveira@unisystem.edu', credits: 4,
    totalClasses: 32, attendedClasses: 28, justifiedAbsences: 2, absences: 2, maxAbsences: 8,
    nextClass: 'Qui, 05/04 — 07:30',
    schedule: [
      { day: 'Quinta', start: '07:30', end: '09:00', room: 'A-105' },
    ],
    syllabus: [
      { title: 'Unidade 1 — Probabilidade', topics: ['Espaços amostrais', 'Probabilidade condicional', 'Independência'], status: 'concluido' },
      { title: 'Unidade 2 — Distribuições', topics: ['Normal e binomial', 'Poisson', 'Distribuições contínuas'], status: 'em-andamento' },
      { title: 'Unidade 3 — Inferência', topics: ['Estimação', 'Testes de hipótese', 'Intervalos de confiança'], status: 'pendente' },
    ],
    records: [
      { date: '02/03', status: 'presente', topic: 'Probabilidade' },
      { date: '09/03', status: 'justificada', topic: 'Distribuições (evento institucional)' },
      { date: '16/03', status: 'presente', topic: 'Normal e binomial' },
      { date: '23/03', status: 'falta', topic: 'Inferência' },
      { date: '30/03', status: 'presente', topic: 'Testes de hipótese' },
    ],
  },
  {
    id: '5', code: 'ING101', name: 'Inglês Técnico', professor: 'Dr. John Smith',
    professorEmail: 'john.smith@unisystem.edu', credits: 2,
    totalClasses: 24, attendedClasses: 22, justifiedAbsences: 0, absences: 2, maxAbsences: 6,
    nextClass: 'Sex, 06/04 — 09:15',
    schedule: [
      { day: 'Sexta', start: '09:15', end: '11:00', room: 'D-301' },
    ],
    syllabus: [
      { title: 'Unit 1 — Vocabulary', topics: ['Technical vocabulary', 'Reading papers', 'Abstracts'], status: 'concluido' },
      { title: 'Unit 2 — Communication', topics: ['Presentations', 'Emails', 'Meetings'], status: 'em-andamento' },
      { title: 'Unit 3 — Writing', topics: ['Reports', 'Documentation', 'Articles'], status: 'pendente' },
    ],
    records: [
      { date: '04/03', status: 'presente', topic: 'Technical vocabulary' },
      { date: '11/03', status: 'presente', topic: 'Reading papers' },
      { date: '18/03', status: 'falta', topic: 'Abstracts' },
      { date: '25/03', status: 'presente', topic: 'Presentations' },
    ],
  },
];

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
