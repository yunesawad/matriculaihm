import { Course } from '@/data/courses';

const DAY_TO_NUM: Record<string, string> = {
  Seg: '2', Ter: '3', Qua: '4', Qui: '5', Sex: '6', Sab: '7',
};

function timeToLessons(start: string): { shift: 'M' | 'T' | 'N'; lessons: string } {
  const [h, m] = start.split(':').map(Number);
  const totalMin = h * 60 + m;
  // Manhã: 7:30=1,8:20=2,9:15=3,10:05=4,10:55=5
  // Tarde: 13:00=1,13:55=2,14:45=3,15:35=4
  // Noite: 19:00=1,19:55=2,20:45=3,21:35=4
  if (h < 12) {
    const map: Record<number, string> = { 450: '12', 555: '34', 645: '56' };
    return { shift: 'M', lessons: map[totalMin] ?? '12' };
  }
  if (h < 18) {
    const map: Record<number, string> = { 780: '12', 885: '34', 975: '56' };
    return { shift: 'T', lessons: map[totalMin] ?? '12' };
  }
  return { shift: 'N', lessons: '12' };
}

export function getCompactCode(course: Course): string {
  if (course.compactCode) return course.compactCode;
  return course.schedule
    .map(s => {
      const d = DAY_TO_NUM[s.day] ?? '2';
      const { shift, lessons } = timeToLessons(s.start);
      return `${d}${shift}${lessons}`;
    })
    .join(' ');
}
