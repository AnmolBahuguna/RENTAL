import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Layout } from './components/layout/Layout'
import { Home } from './pages/Home'
import { Search } from './pages/Search'
import { PropertyDetail } from './pages/PropertyDetail'
import { UserDashboard } from './pages/UserDashboard'
import { LandlordDashboard } from './pages/LandlordDashboard'
import { PropertyNew } from './pages/PropertyNew'
import { PropertyEdit } from './pages/PropertyEdit'
import { NotFound } from './pages/NotFound'
import { useAuth } from './hooks/useAuth'
import { RoleSelectionModal } from './components/auth/RoleSelectionModal'

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
  // Initialize auth hook to listen to session
  useAuth()
  
  return (
    <BrowserRouter>
      <RoleSelectionModal />
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/search" />} />
          <Route path="/search" element={<Search />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          
          {/* User Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['user', null]}>
              <UserDashboard />
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
