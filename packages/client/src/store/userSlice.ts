import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { UserDTO } from '../api/Models/user-api'

interface UserState {
  user: UserDTO | null
  isAuth: boolean
  isLoading: boolean
}

const initialState: UserState = {
  user: null,
  isAuth: false,
  isLoading: false,
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
    },
  },
})

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer
