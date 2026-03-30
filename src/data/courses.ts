export interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  professor: string;
  schedule: { day: string; start: string; end: string; room: string }[];
  slots: { taken: number; total: number };
  prerequisites: string[];
  prerequisitesMet: boolean;
  type: 'obrigatoria' | 'optativa';
  period: number;
  area: 'exatas' | 'humanas' | 'sociais' | 'default';
  description: string;
  enabled: boolean;
  disabledReason?: string;
}

export const courses: Course[] = [
  {
    id: '1', code: 'MAT201', name: 'Cálculo III', credits: 4,
    professor: 'Dr. Ricardo Almeida',
    schedule: [
      { day: 'Seg', start: '7:30', end: '9:00', room: 'A-201' },
      { day: 'Qua', start: '7:30', end: '9:00', room: 'A-201' },
    ],
    slots: { taken: 28, total: 40 }, prerequisites: ['MAT102'], prerequisitesMet: true,
    type: 'obrigatoria', period: 3, area: 'exatas',
    description: 'Integrais múltiplas, séries de Fourier, equações diferenciais parciais.',
    enabled: true,
  },
  {
    id: '2', code: 'FIS201', name: 'Física III - Eletromagnetismo', credits: 4,
    professor: 'Dra. Maria Santos',
    schedule: [
      { day: 'Ter', start: '9:15', end: '11:00', room: 'B-105' },
      { day: 'Qui', start: '9:15', end: '11:00', room: 'B-105' },
    ],
    slots: { taken: 35, total: 40 }, prerequisites: ['FIS102'], prerequisitesMet: true,
    type: 'obrigatoria', period: 3, area: 'exatas',
    description: 'Campos elétrico e magnético, leis de Maxwell, ondas eletromagnéticas.',
    enabled: true,
  },
  {
    id: '3', code: 'COM301', name: 'Estrutura de Dados Avançada', credits: 4,
    professor: 'Dr. Pedro Costa',
    schedule: [
      { day: 'Seg', start: '9:15', end: '11:00', room: 'C-302' },
      { day: 'Qua', start: '9:15', end: '11:00', room: 'C-302' },
    ],
    slots: { taken: 12, total: 40 }, prerequisites: ['COM201'], prerequisitesMet: true,
    type: 'obrigatoria', period: 4, area: 'exatas',
    description: 'Árvores balanceadas, grafos, algoritmos de busca e ordenação avançados.',
    enabled: true,
  },
  {
    id: '4', code: 'COM302', name: 'Banco de Dados', credits: 4,
    professor: 'Dra. Ana Oliveira',
    schedule: [
      { day: 'Ter', start: '7:30', end: '9:00', room: 'C-201' },
      { day: 'Qui', start: '7:30', end: '9:00', room: 'C-201' },
    ],
    slots: { taken: 22, total: 35 }, prerequisites: ['COM201'], prerequisitesMet: true,
    type: 'obrigatoria', period: 4, area: 'exatas',
    description: 'Modelagem relacional, SQL avançado, normalização, NoSQL.',
    enabled: true,
  },
  {
    id: '5', code: 'HUM101', name: 'Filosofia da Ciência', credits: 2,
    professor: 'Dr. João Ferreira',
    schedule: [
      { day: 'Sex', start: '9:15', end: '11:00', room: 'D-101' },
    ],
    slots: { taken: 18, total: 50 }, prerequisites: [], prerequisitesMet: true,
    type: 'optativa', period: 0, area: 'humanas',
    description: 'Epistemologia, métodos científicos, paradigmas de Kuhn.',
    enabled: true,
  },
  {
    id: '6', code: 'COM401', name: 'Inteligência Artificial', credits: 4,
    professor: 'Dr. Lucas Mendes',
    schedule: [
      { day: 'Seg', start: '13:00', end: '14:45', room: 'C-401' },
      { day: 'Qua', start: '13:00', end: '14:45', room: 'C-401' },
    ],
    slots: { taken: 38, total: 40 }, prerequisites: ['COM301', 'MAT201'], prerequisitesMet: true,
    type: 'optativa', period: 5, area: 'exatas',
    description: 'Busca, aprendizado de máquina, redes neurais, processamento de linguagem natural.',
    enabled: true,
  },
  {
    id: '7', code: 'SOC201', name: 'Sociologia da Tecnologia', credits: 2,
    professor: 'Dra. Carla Lima',
    schedule: [
      { day: 'Sab', start: '9:15', end: '11:00', room: 'D-201' },
    ],
    slots: { taken: 8, total: 30 }, prerequisites: [], prerequisitesMet: true,
    type: 'optativa', period: 0, area: 'sociais',
    description: 'Impactos sociais da tecnologia, ética digital, sociedade em rede.',
    enabled: true,
  },
  {
    id: '8', code: 'MAT301', name: 'Álgebra Linear II', credits: 4,
    professor: 'Dr. Fernando Rocha',
    schedule: [
      { day: 'Seg', start: '7:30', end: '9:00', room: 'A-301' },
      { day: 'Qua', start: '7:30', end: '9:00', room: 'A-301' },
    ],
    slots: { taken: 15, total: 35 }, prerequisites: ['MAT301'], prerequisitesMet: false,
    type: 'obrigatoria', period: 5, area: 'exatas',
    description: 'Espaços vetoriais, transformações lineares, autovalores.',
    enabled: false, disabledReason: 'Pré-requisito MAT301 (Álgebra Linear I) não cursado.',
  },
  {
    id: '9', code: 'COM303', name: 'Redes de Computadores', credits: 4,
    professor: 'Dr. Bruno Tavares',
    schedule: [
      { day: 'Ter', start: '13:00', end: '14:45', room: 'C-303' },
      { day: 'Qui', start: '13:00', end: '14:45', room: 'C-303' },
    ],
    slots: { taken: 40, total: 40 }, prerequisites: [], prerequisitesMet: true,
    type: 'obrigatoria', period: 4, area: 'exatas',
    description: 'Protocolos TCP/IP, roteamento, segurança de redes.',
    enabled: true,
  },
  {
    id: '10', code: 'COM304', name: 'Engenharia de Software', credits: 4,
    professor: 'Dra. Patrícia Nunes',
    schedule: [
      { day: 'Ter', start: '14:45', end: '16:30', room: 'C-304' },
      { day: 'Qui', start: '14:45', end: '16:30', room: 'C-304' },
    ],
    slots: { taken: 25, total: 40 }, prerequisites: ['COM201'], prerequisitesMet: true,
    type: 'obrigatoria', period: 5, area: 'exatas',
    description: 'Metodologias ágeis, UML, testes de software, DevOps.',
    enabled: true,
  },
];
