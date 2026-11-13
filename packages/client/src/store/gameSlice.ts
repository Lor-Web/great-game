import { createSlice } from '@reduxjs/toolkit'

interface GameState {
  score: number
}

const initialState: GameState = {
  score: 0,
}

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    restore: state => {
      state.score = 0
    },
    incrementScore: (state, action) => {
      state.score += action.payload
    },
  },
})

export const { restore, incrementScore } = gameSlice.actions
export default gameSlice.reducer
