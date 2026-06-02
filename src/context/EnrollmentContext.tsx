import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Course, courses as allCourses } from '@/data/courses';

type Step = 'select' | 'review' | 'confirm';

export type EnrollmentError =
  | { kind: 'slot-full'; course: Course; alternatives?: string[] }
  | { kind: 'prerequisite'; course: Course; missing: string[] }
  | { kind: 'conflict'; courseA: Course; courseB: Course }
  | { kind: 'network'; retry: () => void };

interface EnrollmentState {
  step: Step;
  selectedCourses: Course[];
  courses: Course[];
  confirmed: boolean;
  showSchedule: boolean;
  /** R1 — indicador visual de auto-save */
  lastSavedAt: Date | null;
  setStep: (step: Step) => void;
  toggleCourse: (course: Course) => boolean;
  removeCourse: (id: string) => void;
  confirmEnrollment: () => void;
  reset: () => void;
  setShowSchedule: (v: boolean) => void;
  hasConflict: (course: Course) => Course | null;
  /** R4 — IDs de todas as disciplinas atualmente em conflito */
  conflictingIds: Set<string>;
  totalCredits: number;
}

const EnrollmentContext = createContext<EnrollmentState | null>(null);
const STORAGE_KEY = 'enrollment.selectedCourseIds.v1';
export const ENROLLED_KEY = 'enrollment.confirmedCourseIds.v1';

export function useEnrollment() {
  const ctx = useContext(EnrollmentContext);
  if (!ctx) throw new Error('useEnrollment must be inside EnrollmentProvider');
  return ctx;
}

function timesOverlap(a: { start: string; end: string }, b: { start: string; end: string }) {
  const toMin = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
  return toMin(a.start) < toMin(b.end) && toMin(b.start) < toMin(a.end);
}

export function EnrollmentProvider({ children }: { children: React.ReactNode }) {
  const [step, setStep] = useState<Step>('select');
  const [selectedCourses, setSelectedCourses] = useState<Course[]>(() => {
    // R1 — Restaura seleções salvas do localStorage
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const ids: string[] = JSON.parse(raw);
      return allCourses.filter(c => ids.includes(c.id));
    } catch {
      return [];
    }
  });
  const [confirmed, setConfirmed] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  // R1 — Auto-save em localStorage a cada mudança
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedCourses.map(c => c.id)));
      setLastSavedAt(new Date());
    } catch {
      /* ignore quota errors */
    }
  }, [selectedCourses]);

  const totalCredits = selectedCourses.reduce((s, c) => s + c.credits, 0);

  const hasConflict = useCallback((course: Course): Course | null => {
    for (const sel of selectedCourses) {
      if (sel.id === course.id) continue;
      for (const sa of sel.schedule) {
        for (const sb of course.schedule) {
          if (sa.day === sb.day && timesOverlap(sa, sb)) return sel;
        }
      }
    }
    return null;
  }, [selectedCourses]);

  // R4 — Computa todos os IDs em conflito (para destacar ambos os lados)
  const conflictingIds = React.useMemo(() => {
    const ids = new Set<string>();
    for (let i = 0; i < selectedCourses.length; i++) {
      for (let j = i + 1; j < selectedCourses.length; j++) {
        const a = selectedCourses[i], b = selectedCourses[j];
        const clash = a.schedule.some(sa =>
          b.schedule.some(sb => sa.day === sb.day && timesOverlap(sa, sb))
        );
        if (clash) { ids.add(a.id); ids.add(b.id); }
      }
    }
    return ids;
  }, [selectedCourses]);

  const toggleCourse = useCallback((course: Course): boolean => {
    setSelectedCourses(prev =>
      prev.find(c => c.id === course.id)
        ? prev.filter(c => c.id !== course.id)
        : [...prev, course]
    );
    return true;
  }, []);

  const removeCourse = useCallback((id: string) => {
    setSelectedCourses(prev => prev.filter(c => c.id !== id));
  }, []);

  const confirmEnrollment = useCallback(() => {
    setConfirmed(true);
    setStep('confirm');
    try {
      // Persiste IDs matriculados para aparecerem em Presença / Detalhe da matéria
      const existing: string[] = JSON.parse(localStorage.getItem(ENROLLED_KEY) || '[]');
      const merged = Array.from(new Set([...existing, ...selectedCourses.map(c => c.id)]));
      localStorage.setItem(ENROLLED_KEY, JSON.stringify(merged));
      window.dispatchEvent(new Event('enrollment:updated'));
      localStorage.removeItem(STORAGE_KEY);
    } catch { /* ignore */ }
  }, [selectedCourses]);

  const reset = useCallback(() => {
    setStep('select');
    setSelectedCourses([]);
    setConfirmed(false);
  }, []);

  return (
    <EnrollmentContext.Provider value={{
      step, selectedCourses, courses: allCourses, confirmed, showSchedule, lastSavedAt,
      setStep, toggleCourse, removeCourse, confirmEnrollment, reset,
      setShowSchedule, hasConflict, conflictingIds, totalCredits,
    }}>
      {children}
    </EnrollmentContext.Provider>
  );
}
