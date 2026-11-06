import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { UserDTO } from '../api/Models/user-api'

interface UserState {
  user: UserDTO | null
  isAuth: boolean
  isLoading: boolean
  authError: boolean
}

const initialState: UserState = {
  user: null,
  isAuth: false,
  isLoading: true,
  authError: false,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Экшен для сохранения данных пользователя
    setUser: (state, action: PayloadAction<UserDTO | null>) => {
      state.user = action.payload
      state.isAuth = !!action.payload
    },
    // Экшен для сброса состояния
    clearUser: state => {
      state.user = null
      state.isAuth = false
      state.isLoading = false
      state.authError = false
    },
    // Экшен для изменения статуса загрузки
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    // Экшен для изменения статуса ошибки проверки авторизации
    setAuthError: (state, action: PayloadAction<boolean>) => {
      state.authError = action.payload
    },
  },
})

export const { setUser, clearUser, setLoading, setAuthError } =
  userSlice.actions
export default userSlice.reducer
