import { useCallback, useEffect, useState } from "react";

export type ExerciseLog = {
  completed?: boolean;
  weight?: string;
  bestWeight?: string;
  notes?: string;
  updatedAt?: string;
};

export type ProgressState = {
  exercises: Record<string, ExerciseLog>;
  history: Record<string, string[]>;
};

const STORAGE_KEY = "sr:progress:v1";
const EMPTY: ProgressState = { exercises: {}, history: {} };

function read(): ProgressState {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    return {
      exercises: parsed.exercises ?? {},
      history: parsed.history ?? {},
    };
  } catch {
    return EMPTY;
  }
}

function write(state: ProgressState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent("sr:progress"));
  } catch {
    /* ignore */
  }
}

export function useProgress() {
  const [state, setState] = useState<ProgressState>(EMPTY);

  useEffect(() => {
    setState(read());
    const onChange = () => setState(read());
    window.addEventListener("sr:progress", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("sr:progress", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const key = (dayId: string, name: string) => `${dayId}::${name}`;

  const getExercise = useCallback(
    (dayId: string, name: string): ExerciseLog | undefined =>
      state.exercises[key(dayId, name)],
    [state]
  );

  const setExercise = useCallback(
    (dayId: string, name: string, patch: Partial<ExerciseLog>) => {
      const current = read();
      const k = key(dayId, name);
      const next: ProgressState = {
        ...current,
        exercises: {
          ...current.exercises,
          [k]: {
            ...current.exercises[k],
            ...patch,
            updatedAt: new Date().toISOString(),
          },
        },
      };
      write(next);
      setState(next);
    },
    []
  );

  const markDayComplete = useCallback((dayId: string) => {
    const current = read();
    const arr = current.history[dayId] ?? [];
    const next: ProgressState = {
      ...current,
      history: {
        ...current.history,
        [dayId]: [...arr, new Date().toISOString()],
      },
    };
    write(next);
    setState(next);
  }, []);

  const resetDay = useCallback((dayId: string, names: string[]) => {
    const current = read();
    const exercises = { ...current.exercises };
    for (const n of names) delete exercises[key(dayId, n)];
    const next: ProgressState = { ...current, exercises };
    write(next);
    setState(next);
  }, []);

  return { state, getExercise, setExercise, markDayComplete, resetDay };
}
