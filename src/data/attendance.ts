import { courses } from './courses';

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

// Dados mockados para demonstração
const mockAttendanceRecords = [
  { date: '05/03', status: 'presente' as const, topic: 'Introdução e apresentação da disciplina' },
  { date: '07/03', status: 'presente' as const, topic: 'Conceitos fundamentais e histórico' },
  { date: '12/03', status: 'presente' as const, topic: 'Primeiros exemplos e aplicações' },
  { date: '14/03', status: 'presente' as const, topic: 'Exercícios práticos' },
  { date: '19/03', status: 'presente' as const, topic: 'Avaliação formativa' },
  { date: '21/03', status: 'justificada' as const, topic: 'Feriado - Tiradentes' },
  { date: '26/03', status: 'presente' as const, topic: 'Aprofundamento do tema 1' },
  { date: '28/03', status: 'falta' as const },
  { date: '02/04', status: 'presente' as const, topic: 'Transição para tema 2' },
  { date: '04/04', status: 'presente' as const, topic: 'Tema 2 - Conceitos iniciais' },
  { date: '09/04', status: 'presente' as const, topic: 'Tema 2 - Aplicações práticas' },
  { date: '11/04', status: 'presente' as const, topic: 'Exercícios tema 2' },
  { date: '16/04', status: 'falta' as const },
  { date: '18/04', status: 'presente' as const, topic: 'Revisão para prova 1' },
  { date: '23/04', status: 'presente' as const, topic: 'Prova 1' },
  { date: '25/04', status: 'presente' as const, topic: 'Retorno da prova e discussão' },
];

const mockSyllabus = [
  {
    title: 'Unidade 1: Fundamentos',
    status: 'concluido' as const,
    topics: [
      'Introdução aos conceitos básicos',
      'Terminologia e notação padrão',
      'Histórico e contextualização',
      'Aplicações no mundo real',
    ],
  },
  {
    title: 'Unidade 2: Teoria e Conceitos',
    status: 'concluido' as const,
    topics: [
      'Princípios fundamentais',
      'Desenvolvimento teórico',
      'Demonstrações e provas',
      'Teoremas principais',
    ],
  },
  {
    title: 'Unidade 3: Aplicações Práticas',
    status: 'em-andamento' as const,
    topics: [
      'Estudos de caso',
      'Projetos integradores',
      'Resolução de problemas',
      'Simulações e experimentos',
    ],
  },
  {
    title: 'Unidade 4: Tópicos Avançados',
    status: 'pendente' as const,
    topics: [
      'Extensões e generalizações',
      'Conexões com outras disciplinas',
      'Pesquisa e inovação',
      'Perspectivas futuras',
    ],
  },
];

// Lista inicia com dados mockados para demonstração
export const subjectsAttendance: SubjectAttendance[] = [
  {
    id: 'mock-1',
    code: 'MAT201',
    name: 'Cálculo III',
    professor: 'Dr. Ricardo Almeida',
    professorEmail: 'ricardo.almeida@university.edu',
    credits: 4,
    totalClasses: 16,
    attendedClasses: 14,
    justifiedAbsences: 1,
    absences: 1,
    maxAbsences: 4,
    nextClass: 'Quarta, 09:30',
    schedule: [
      { day: 'Segunda', start: '07:30', end: '09:00', room: 'A-201' },
      { day: 'Quarta', start: '07:30', end: '09:00', room: 'A-201' },
    ],
    syllabus: mockSyllabus,
    records: mockAttendanceRecords,
  },
];

const ENROLLED_KEY = 'enrollment.confirmedCourseIds.v1';

const DAY_MAP: Record<string, string> = {
  Seg: 'Segunda', Ter: 'Terça', Qua: 'Quarta', Qui: 'Quinta', Sex: 'Sexta', Sab: 'Sábado',
};

/** Gera dados mockados aleatórios de presença */
function generateMockAttendance(totalClasses: number) {
  const records: AttendanceRecord[] = [];
  const statuses: Array<'presente' | 'falta' | 'justificada'> = ['presente', 'presente', 'presente', 'presente', 'falta', 'justificada'];
  const topics = [
    'Introdução ao tema',
    'Fundamentos teóricos',
    'Exemplos práticos',
    'Exercícios',
    'Discussão de conceitos',
    'Aplicações',
    'Resolução de problemas',
    'Revisão',
    'Prova',
    'Retorno da avaliação',
  ];

  let date = new Date(2026, 2, 1); // Março 2026
  for (let i = 0; i < totalClasses; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    records.push({
      date: `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`,
      status,
      topic: status === 'presente' ? topics[Math.floor(Math.random() * topics.length)] : undefined,
    });
    date.setDate(date.getDate() + 3); // A cada 3 dias
  }
  return records;
}

/** Gera syllabus mockado com tópicos realistas */
function generateMockSyllabus() {
  return [
    {
      title: 'Unidade 1: Fundamentos',
      status: 'concluido' as const,
      topics: [
        'Introdução aos conceitos básicos',
        'Terminologia e notação padrão',
        'Histórico e contextualização',
        'Aplicações no mundo real',
      ],
    },
    {
      title: 'Unidade 2: Teoria e Conceitos',
      status: 'concluido' as const,
      topics: [
        'Princípios fundamentais',
        'Desenvolvimento teórico',
        'Demonstrações e provas',
        'Teoremas principais',
      ],
    },
    {
      title: 'Unidade 3: Aplicações Práticas',
      status: 'em-andamento' as const,
      topics: [
        'Estudos de caso',
        'Projetos integradores',
        'Resolução de problemas',
        'Simulações e experimentos',
      ],
    },
    {
      title: 'Unidade 4: Tópicos Avançados',
      status: 'pendente' as const,
      topics: [
        'Extensões e generalizações',
        'Conexões com outras disciplinas',
        'Pesquisa e inovação',
        'Perspectivas futuras',
      ],
    },
  ];
}

/** Cria um SubjectAttendance com dados mockados a partir de um curso matriculado. */
function subjectFromCourse(c: import('./courses').Course): SubjectAttendance {
  const firstSlot = c.schedule[0];
  const totalClasses = Math.max(10, c.credits * 4); // Estimativa de aulas
  const records = generateMockAttendance(totalClasses);
  
  const attendedCount = records.filter(r => r.status === 'presente').length;
  const absenceCount = records.filter(r => r.status === 'falta').length;
  const justifiedCount = records.filter(r => r.status === 'justificada').length;

  return {
    id: `enr-${c.id}`,
    code: c.code,
    name: c.name,
    professor: c.professor,
    credits: c.credits,
    totalClasses,
    attendedClasses: attendedCount,
    justifiedAbsences: justifiedCount,
    absences: absenceCount,
    maxAbsences: Math.ceil(totalClasses * 0.25),
    nextClass: firstSlot ? `${DAY_MAP[firstSlot.day] ?? firstSlot.day}, ${firstSlot.start}` : 'A definir',
    schedule: c.schedule.map(s => ({
      day: DAY_MAP[s.day] ?? s.day,
      start: s.start,
      end: s.end,
      room: s.room,
    })),
    syllabus: generateMockSyllabus(),
    records,
  };
}

/** Lê IDs matriculados do localStorage (SSR-safe). */
function readEnrolledIds(): string[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(ENROLLED_KEY) || '[]'); } catch { return []; }
}

/** Lista combinada: mock + disciplinas recém-matriculadas. */
export function getAllSubjects(): SubjectAttendance[] {
  const ids = readEnrolledIds();
  const existingCodes = new Set(subjectsAttendance.map(s => s.code));
  const extras = courses
    .filter(c => ids.includes(c.id) && !existingCodes.has(c.code))
    .map(subjectFromCourse);
  return [...subjectsAttendance, ...extras];
}

export const getSubjectById = (id: string) => {
  const subjects = getAllSubjects();
  // Try direct match first
  let subject = subjects.find((s) => s.id === id);
  if (subject) return subject;
  
  // If not found and id starts with 'enr-', also try matching without 'enr-' prefix
  if (id.startsWith('enr-')) {
    const courseId = id.slice(4); // Remove 'enr-' prefix
    subject = subjects.find((s) => s.id === `enr-${courseId}`);
    if (subject) return subject;
  }
  
  return undefined;
};

export const getSubjectByName = (name: string) =>
  getAllSubjects().find((s) => s.name.toLowerCase().includes(name.toLowerCase().split(' ')[0]));
