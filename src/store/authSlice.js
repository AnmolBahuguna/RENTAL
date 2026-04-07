import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    profile: null,
    role: null, // 'landlord' | 'user'
    loading: true,
    authModalOpen: false,
    authModalTab: 'login', // 'login' | 'signup'
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
      state.loading = false
    },
    setProfile: (state, action) => {
      state.profile = action.payload
      state.role = action.payload?.role || null
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    openAuthModal: (state, action) => {
      state.authModalOpen = true
      state.authModalTab = action.payload || 'login'
    },
    closeAuthModal: (state) => {
      state.authModalOpen = false
    },
    logout: (state) => {
      state.user = null
      state.profile = null
      state.role = null
      state.loading = false
    },
  },
})

export const { setUser, setProfile, setLoading, openAuthModal, closeAuthModal, logout } = authSlice.actions
export default authSlice.reducer
