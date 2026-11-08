export const COUNTDOWN_SECONDS = 3
export const GO_DISPLAY_MS = 500

export type CharacterSkin = 'knight' | 'percival' | 'merlin' | 'king'

export type Difficulty = 'easy' | 'medium' | 'hard'

export const DIFFICULTY_SETTINGS = {
  easy: {
    label: 'EASY',
    lives: 3,
    duration: 120,
  },
  medium: {
    label: 'MEDIUM',
    lives: 2,
    duration: 90,
  },
  hard: {
    label: 'HARD',
    lives: 1,
    duration: 60,
  },
} as const
