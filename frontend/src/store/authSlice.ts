import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"

interface AuthState {
  user: any
  isAuthenticated: boolean
}

const savedUser = localStorage.getItem("user")

const initialState: AuthState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  isAuthenticated: !!savedUser,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<any>) => {
      state.user = action.payload
      state.isAuthenticated = true
      localStorage.setItem("user", JSON.stringify(action.payload)) // ⬅️ penting
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      localStorage.removeItem("user") // ⬅️ penting
    },
  },
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer