import React from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export const LegalLayout = ({ children, title, lastUpdated }) => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <div className="pt-12 md:pt-16 pb-20 min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 mb-8 transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          {t('property.labels.back')}
        </button>

        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight font-display">
            {title}
          </h1>
          <p className="text-gray-500 font-medium">{lastUpdated}</p>
        </div>

        <div className="prose prose-gray max-w-none">
          {children}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-xl font-bold italic text-gray-800">Thank you for choosing GoEazy!</p>
        </div>
      </div>
    </div>
  )
}
