import React from 'react'
import { PropertyForm } from '../components/property/PropertyForm'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export const PropertyNew = () => {
  const navigate = useNavigate()
  return (
    <div className="pt-4 pb-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 mb-6 transition-colors">
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 font-display">List a New Property</h1>
          <p className="text-gray-500 mt-2">Fill in the details below to reach thousands of potential renters.</p>
        </div>
        <PropertyForm />
      </div>
    </div>
  )
}
