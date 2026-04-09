import React from 'react'
import { useTranslation } from 'react-i18next'
import { MapPin, Hammer, ArrowLeft, Construction } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'

export const NearbyServices = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="pt-8 pb-20 min-h-screen bg-white flex flex-col items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 text-center">
        {/* Animated Icon Container */}
        <div className="relative w-32 h-32 mx-auto mb-10">
          <div className="absolute inset-0 bg-[#fff5f5] rounded-full animate-ping opacity-20"></div>
          <div className="relative w-full h-full bg-white border-2 border-[#ffe3e3] rounded-full flex items-center justify-center shadow-sm">
             <Construction size={48} className="text-[#CA3433]" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-[#CA3433] rounded-2xl flex items-center justify-center text-white shadow-lg rotate-12">
            <MapPin size={24} />
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight font-display">
          {t('nearbyPage.title')}
        </h1>
        
        <div className="inline-block px-4 py-1.5 bg-brand-lime rounded-full text-brand-900 font-bold text-sm tracking-wide mb-8">
          {t('nearbyPage.comingSoon')}
        </div>

        <p className="text-xl text-gray-500 leading-relaxed mb-12 max-w-lg mx-auto">
          {t('nearbyPage.desc')}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            onClick={() => navigate('/search')}
            variant="primary" 
            className="w-full sm:w-auto px-10 py-4 rounded-full font-bold shadow-lg shadow-[#CA3433]/20 bg-[#CA3433] hover:bg-[#ac2d2c]"
          >
            {t('nearbyPage.back')}
          </Button>
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={16} /> {t('property.labels.back')}
          </button>
        </div>
      </div>

      {/* Aesthetic Decorations */}
      <div className="absolute top-1/4 left-10 w-2 h-2 bg-[#ffc9c9] rounded-full animate-pulse"></div>
      <div className="absolute top-1/2 right-20 w-3 h-3 bg-[#ffe3e3] rounded-full animate-pulse delay-700"></div>
      <div className="absolute bottom-1/4 left-1/4 w-4 h-4 bg-[#fff5f5] rounded-full animate-pulse delay-300"></div>
    </div>
  )
}
