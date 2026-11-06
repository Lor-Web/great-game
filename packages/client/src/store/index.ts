import { configureStore } from '@reduxjs/toolkit'
import gameReducer from './gameSlice'
import userReducer from './userSlice'

export const store = configureStore({
  reducer: {
    user: userReducer, // Теперь состояние пользователя доступно во всем приложении
    game: gameReducer,
  },
})

// Типизация для дальнейшего использования в хуках
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
