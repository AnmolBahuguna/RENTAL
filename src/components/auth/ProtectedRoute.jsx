import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, role, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="skeleton w-12 h-12 rounded-full" />
      </div>
    )
  }
  
  if (!user) return <Navigate to="/" />
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/" />
  
  return children
}
