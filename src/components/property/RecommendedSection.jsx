import React, { useMemo } from 'react'
import { Sparkles, RefreshCcw, ChevronRight } from 'lucide-react'
import { useProperties } from '../../hooks/useProperties'
import { PropertyCard } from './PropertyCard'
import { useAuth } from '../../hooks/useAuth'

export const RecommendedSection = () => {
  const { profile } = useAuth()
  const { getRecommendedProperties, loading } = useProperties()
  
  const recommendations = useMemo(() => getRecommendedProperties(), [getRecommendedProperties])

  if (loading || !recommendations.length) return null

  const handleRetakeQuiz = () => {
    window.dispatchEvent(new Event('goeazy_quiz_reset'))
  }

  return (
    <section className="mb-12">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#CA3433] to-[#ff6b6b] rounded-xl flex items-center justify-center shadow-md shadow-red-500/20">
            <Sparkles size={16} className="text-white fill-current" />
          </div>
          <div>
            <h2 className="font-display font-bold text-xl text-gray-900">
              Recommended for {profile?.name?.split(' ')[0] || 'You'}
            </h2>
            <p className="text-[11px] text-gray-400 font-medium mt-0.5">Based on your quiz preferences</p>
          </div>
          <span className="text-sm text-gray-400 font-medium ml-1">({recommendations.length})</span>
        </div>

        <button
          onClick={handleRetakeQuiz}
          className="flex items-center gap-1 text-sm font-semibold text-[#CA3433] hover:text-[#ac2d2c] transition-colors"
        >
          <RefreshCcw size={14} />
          Retake <ChevronRight size={16} />
        </button>
      </div>

      {/* Horizontal Scroll Row — same pattern as PropertySection / UserDashboard */}
      <div className="scroll-row px-1 -mx-1">
        {recommendations.map(p => (
          <div key={p.id} className="flex-shrink-0">
            <PropertyCard property={p} compact />
          </div>
        ))}
      </div>
    </section>
  )
}
