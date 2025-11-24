import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type GameState = 'menu' | 'playing' | 'paused' | 'gameOver';

export interface GameStore {
  state: GameState;
  score: number;
  highScore: number;
  lives: number;
  stage: number;
  isBossActive: boolean;
  
  setState: (state: GameState) => void;
  addScore: (points: number) => void;
  loseLife: () => void;
  nextStage: () => void;
  resetGame: () => void;
  setBossActive: (active: boolean) => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      state: 'menu',
      score: 0,
      highScore: 0,
      lives: 3,
      stage: 1,
      isBossActive: false,

      setState: (state) => set({ state }),
      addScore: (points) =>
        set((state) => {
          const newScore = state.score + points;
          return {
            score: newScore,
            highScore: Math.max(state.highScore, newScore),
          };
        }),
      loseLife: () =>
        set((state) => {
          const newLives = state.lives - 1;
          if (newLives <= 0) {
            return { lives: 0, state: 'gameOver' };
          }
          return { lives: newLives };
        }),
      nextStage: () => set((state) => ({ stage: state.stage + 1 })),
      resetGame: () =>
        set({
          state: 'playing',
          score: 0,
          lives: 3,
          stage: 1,
          isBossActive: false,
        }),
      setBossActive: (active) => set({ isBossActive: active }),
    }),
    {
      name: 'galaga-storage',
      partialize: (state) => ({ highScore: state.highScore }),
    }
  )
);


