// GoEazy App - Vercel Build Refresh (Reverted listing payment feature)
import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { Home } from './pages/Home'
import { Search } from './pages/Search'
import { PropertyDetail } from './pages/PropertyDetail'
import { UserDashboard } from './pages/UserDashboard'
import { SavedProperties } from './pages/SavedProperties'
import { LandlordDashboard } from './pages/LandlordDashboard'
import { PropertyNew } from './pages/PropertyNew'
import { PropertyEdit } from './pages/PropertyEdit'
import { NotFound } from './pages/NotFound'
import { Settings } from './pages/Settings'
import PrivacyPolicy from './pages/legal/PrivacyPolicy'
import TermsOfService from './pages/legal/TermsOfService'
import CookiePolicy from './pages/legal/CookiePolicy'
import RefundPolicy from './pages/legal/RefundPolicy'
import { NearbyServices } from './pages/NearbyServices'
import { About } from './pages/About'
import { useAuth } from './hooks/useAuth'
import { useProperties } from './hooks/useProperties'
import { RoleSelectionModal } from './components/auth/RoleSelectionModal'
import ScrollToTop from './components/common/ScrollToTop'
import { useEffect } from 'react'

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, role, loading } = useAuth()
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="skeleton w-12 h-12 rounded-full" /></div>
  }
  
  if (!user) return <Navigate to="/" />
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/" />
  
  return children
}

function App() {
  const { user } = useAuth()
  const { fetchFavorites, fetchRecentlyViewed } = useProperties()

  // Initialize data on login/refresh
  useEffect(() => {
    if (user) {
      console.log('[App] Synchronizing user data...')
      fetchFavorites()
      fetchRecentlyViewed()
    }
  }, [user, fetchFavorites, fetchRecentlyViewed])
  
  return (
    <BrowserRouter>
      <ScrollToTop />
      <RoleSelectionModal />
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/search" />} />
          <Route path="/search" element={<Search />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          
          {/* Legal Routes */}
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/cookies" element={<CookiePolicy />} />
          <Route path="/refund" element={<RefundPolicy />} />
          <Route path="/nearby" element={<NearbyServices />} />
          <Route path="/about" element={<About />} />
          
          {/* User Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['user', null]}>
              <UserDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard/saved" element={
            <ProtectedRoute allowedRoles={['user', null]}>
              <SavedProperties />
            </ProtectedRoute>
          } />
          
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          
          {/* Landlord Routes */}
          <Route path="/landlord" element={
            <ProtectedRoute allowedRoles={['landlord']}>
              <LandlordDashboard />
            </ProtectedRoute>
          } />
          <Route path="/landlord/properties/new" element={
            <ProtectedRoute allowedRoles={['landlord']}>
              <PropertyNew />
            </ProtectedRoute>
          } />
          <Route path="/landlord/properties/:id/edit" element={
            <ProtectedRoute allowedRoles={['landlord']}>
              <PropertyEdit />
            </ProtectedRoute>
          } />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
