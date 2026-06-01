export interface AttendanceRecord {
  date: string; // dd/mm
  status: 'presente' | 'falta' | 'justificada';
  topic?: string;
}

export interface SubjectAttendance {
  id: string;
  code: string;
  name: string;
  professor: string;
  totalClasses: number;
  attendedClasses: number;
  justifiedAbsences: number;
  absences: number;
  maxAbsences: number; // limite (25%)
  nextClass: string;
  records: AttendanceRecord[];
}

export const subjectsAttendance: SubjectAttendance[] = [
  {
    id: '1', code: 'MAT102', name: 'Cálculo II', professor: 'Dr. Ricardo Almeida',
    totalClasses: 40, attendedClasses: 36, justifiedAbsences: 1, absences: 3, maxAbsences: 10,
    nextClass: 'Seg, 02/04 — 07:30',
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
    totalClasses: 38, attendedClasses: 30, justifiedAbsences: 0, absences: 8, maxAbsences: 9,
    nextClass: 'Ter, 03/04 — 09:15',
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
    totalClasses: 40, attendedClasses: 40, justifiedAbsences: 0, absences: 0, maxAbsences: 10,
    nextClass: 'Qua, 04/04 — 09:15',
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
    totalClasses: 32, attendedClasses: 28, justifiedAbsences: 2, absences: 2, maxAbsences: 8,
    nextClass: 'Qui, 05/04 — 07:30',
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
    totalClasses: 24, attendedClasses: 22, justifiedAbsences: 0, absences: 2, maxAbsences: 6,
    nextClass: 'Sex, 06/04 — 09:15',
    records: [
      { date: '04/03', status: 'presente', topic: 'Technical vocabulary' },
      { date: '11/03', status: 'presente', topic: 'Reading papers' },
      { date: '18/03', status: 'falta', topic: 'Abstracts' },
      { date: '25/03', status: 'presente', topic: 'Presentations' },
    ],
  },
];
