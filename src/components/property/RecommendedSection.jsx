import React, { useMemo } from 'react'
import { Sparkles, RefreshCcw, ArrowRight } from 'lucide-react'
import { useProperties } from '../../hooks/useProperties'
import { PropertyCard } from './PropertyCard'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../ui/Button'

export const RecommendedSection = () => {
  const { profile } = useAuth()
  const { getRecommendedProperties, loading } = useProperties()
  
  const recommendations = useMemo(() => getRecommendedProperties(), [getRecommendedProperties])

  if (loading || !recommendations.length) return null

  const handleRetakeQuiz = () => {
    window.dispatchEvent(new Event('goeazy_quiz_reset'))
  }

  return (
    <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#CA3433] to-[#ff4d4d] rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/20">
            <Sparkles size={20} className="text-white fill-current" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              Recommended for {profile?.name?.split(' ')[0] || 'You'}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-medium">Handpicked matches based on your quiz answers.</p>
          </div>
        </div>

        <button 
          onClick={handleRetakeQuiz}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-500 hover:text-[#CA3433] hover:border-red-100 transition-all shadow-sm"
        >
          <RefreshCcw size={14} />
          Retake Quiz
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
        {recommendations.map(p => (
           <PropertyCard key={p.id} property={p} compact />
        ))}
      </div>
      
      {recommendations.length === 8 && (
        <div className="mt-6 flex justify-center">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                <span>Swipe for more results matching your vibe</span>
                <ArrowRight size={10} />
            </p>
        </div>
      )}
    </div>
  )
}
