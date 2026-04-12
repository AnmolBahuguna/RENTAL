import React from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Star, ChevronRight, CheckCircle, Clock } from 'lucide-react'

const CATEGORY_CONFIG = {
  tiffin:   { label: 'Tiffin',   emoji: '🍱', color: 'bg-amber-100 text-amber-700' },
  laundry:  { label: 'Laundry',  emoji: '🧺', color: 'bg-blue-100 text-blue-700'  },
  cleaning: { label: 'Cleaning', emoji: '🧹', color: 'bg-green-100 text-green-700' },
}

export const ServiceCard = ({ service, layout = 'grid' }) => {
  const navigate = useNavigate()
  const cat = CATEGORY_CONFIG[service.category] || {}

  // Compute avg rating if reviews exist (passed optionally)
  const avgRating = service.avg_rating || null

  const isList = layout === 'list'

  return (
    <div
      onClick={() => navigate(`/services/${service.id}`)}
      className={`bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.10)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden group ${isList ? 'flex gap-4 p-4' : ''}`}
    >
      {/* Category Header / Color Bar */}
      {!isList && (
        <div className={`w-full h-1.5 ${service.category === 'tiffin' ? 'bg-amber-400' : service.category === 'laundry' ? 'bg-blue-400' : 'bg-green-400'}`} />
      )}

      <div className={isList ? 'flex-1' : 'p-4'}>
        {/* Top Row: Category badge + availability */}
        <div className="flex items-center justify-between mb-3">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${cat.color}`}>
            <span>{cat.emoji}</span>
            {cat.label}
          </span>
          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${service.is_open ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${service.is_open ? 'bg-green-500' : 'bg-red-400'}`} />
            {service.is_open ? 'Open' : 'Closed'}
          </span>
        </div>

        {/* Provider Name */}
        <h3 className="font-bold text-gray-900 text-base leading-tight mb-1 group-hover:text-[#CA3433] transition-colors line-clamp-1">
          {service.name}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-gray-400 text-xs mb-3">
          <MapPin size={11} className="shrink-0" />
          <span className="truncate">{service.area}{service.city ? `, ${service.city}` : ''}</span>
        </div>

        {/* Speciality snippet */}
        {service.speciality && (
          <p className="text-xs text-gray-500 line-clamp-2 mb-3">{service.speciality}</p>
        )}

        {/* Footer: Rating + CTA */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
          {avgRating ? (
            <div className="flex items-center gap-1 text-amber-500">
              <Star size={13} fill="currentColor" />
              <span className="text-xs font-bold text-gray-700">{avgRating.toFixed(1)}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-gray-300 text-xs">
              <Star size={12} />
              <span>New</span>
            </div>
          )}
          {service.verification_status === 'verified' && (
            <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
              <CheckCircle size={11} /> Verified
            </span>
          )}
          <ChevronRight size={14} className="text-gray-300 group-hover:text-[#CA3433] transition-colors ml-auto" />
        </div>
      </div>
    </div>
  )
}
