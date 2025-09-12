import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TimerState {
  isRunning: boolean;
  startTime: number | null;
  projectId: string | null;
  taskId: string | null;
  elapsedTime: number;
  startTimer: (projectId: string, taskId: string) => void;
  stopTimer: () => void;
  resetTimer: () => void;
  updateElapsedTime: () => void;
}

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      isRunning: false,
      startTime: null,
      projectId: null,
      taskId: null,
      elapsedTime: 0,

      startTimer: (projectId, taskId) => {
        const now = Date.now();
        set({
          isRunning: true,
          startTime: now,
          projectId,
          taskId,
        });
      },

      stopTimer: () => {
        const state = get();
        if (state.isRunning && state.startTime) {
          const elapsed = state.elapsedTime + (Date.now() - state.startTime);
          set({
            isRunning: false,
            startTime: null,
            elapsedTime: elapsed,
          });
        }
      },

      resetTimer: () => {
        set({
          isRunning: false,
          startTime: null,
          projectId: null,
          taskId: null,
          elapsedTime: 0,
        });
      },

      updateElapsedTime: () => {
        const state = get();
        if (state.isRunning && state.startTime) {
          const elapsed = state.elapsedTime + (Date.now() - state.startTime);
          set({
            elapsedTime: elapsed,
            startTime: Date.now(),
          });
        }
      },
    }),
    {
      name: 'timer-storage',
    }
  )
);
