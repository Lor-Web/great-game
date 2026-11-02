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
    incrementScore: (state, action) => {
      state.score += action.payload
    },
  },
})

export const { incrementScore } = gameSlice.actions
export default gameSlice.reducer
