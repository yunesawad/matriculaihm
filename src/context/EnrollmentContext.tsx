import React, { createContext, useContext, useState, useCallback } from 'react';
import { Course, courses as allCourses } from '@/data/courses';

type Step = 'select' | 'review' | 'confirm';

interface EnrollmentState {
  step: Step;
  selectedCourses: Course[];
  courses: Course[];
  confirmed: boolean;
  showSchedule: boolean;
  setStep: (step: Step) => void;
  toggleCourse: (course: Course) => boolean;
  removeCourse: (id: string) => void;
  confirmEnrollment: () => void;
  reset: () => void;
  setShowSchedule: (v: boolean) => void;
  hasConflict: (course: Course) => Course | null;
  totalCredits: number;
}

const EnrollmentContext = createContext<EnrollmentState | null>(null);

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
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [confirmed, setConfirmed] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);

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

  const toggleCourse = useCallback((course: Course): boolean => {
    const exists = selectedCourses.find(c => c.id === course.id);
    if (exists) {
      setSelectedCourses(prev => prev.filter(c => c.id !== course.id));
      return true;
    }
    setSelectedCourses(prev => [...prev, course]);
    return true;
  }, [selectedCourses]);

  const removeCourse = useCallback((id: string) => {
    setSelectedCourses(prev => prev.filter(c => c.id !== id));
  }, []);

  const confirmEnrollment = useCallback(() => {
    setConfirmed(true);
    setStep('confirm');
  }, []);

  const reset = useCallback(() => {
    setStep('select');
    setSelectedCourses([]);
    setConfirmed(false);
  }, []);

  return (
    <EnrollmentContext.Provider value={{
      step, selectedCourses, courses: allCourses, confirmed, showSchedule,
      setStep, toggleCourse, removeCourse, confirmEnrollment, reset,
      setShowSchedule, hasConflict, totalCredits,
    }}>
      {children}
    </EnrollmentContext.Provider>
  );
}
