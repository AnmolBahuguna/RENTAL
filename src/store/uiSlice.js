import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    mobileMenuOpen: false,
    searchOpen: false,
    activeCategory: 'all',
  },
  reducers: {
    toggleMobileMenu: (state) => { state.mobileMenuOpen = !state.mobileMenuOpen },
    closeMobileMenu: (state) => { state.mobileMenuOpen = false },
    setSearchOpen: (state, action) => { state.searchOpen = action.payload },
    setActiveCategory: (state, action) => { state.activeCategory = action.payload },
  },
})

export const { toggleMobileMenu, closeMobileMenu, setSearchOpen, setActiveCategory } = uiSlice.actions
export default uiSlice.reducer
