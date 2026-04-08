import React, { useState, useMemo, memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Bookmark, Star, Home } from 'lucide-react'
import { openAuthModal } from '../../store/authSlice'
import { useProperties } from '../../hooks/useProperties'
import { cn } from '../../utils/helpers'
import { useTranslation } from 'react-i18next'

const PropertyCardComponent = ({ property, layout = 'grid' }) => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { user } = useSelector(s => s.auth)
  const { favorites, toggleFavorite } = useProperties()
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)

  const isFav = favorites.includes(property.id)
  const images = property.images || []
  const mainImage = images[0]

  const handleFav = (e) => {
    e.stopPropagation()
    if (!user) { dispatch(openAuthModal('signup')); return }
    toggleFavorite(property.id)
  }

  // Generate deterministic "random" values based on property ID
  const simpleHash = (str) => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i)
      hash = hash & hash
    }
    return Math.abs(hash) % 100 / 100
  }

  // Memoize values with deterministic calculation
  const { rating, numGuests, numBeds } = useMemo(() => {
    const seed = simpleHash(property.id?.toString() || '')
    return {
      rating: property.rating || (4 + seed).toFixed(1),
      numGuests: Math.floor(seed * 6) + 4,
      numBeds: property.bedrooms || Math.floor(seed * 3) + 2,
    }
  }, [property.id, property.rating, property.bedrooms])

  const formatPrice = (p) => {
    if (!p) return '0'
    const num = Number(p)
    if (num >= 1000) return (num / 1000).toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })
    return num.toLocaleString()
  }

  if (layout === 'list') {
    return (
      <div 
        className="group bg-white rounded-xl border border-gray-100 flex gap-4 cursor-pointer hover:shadow-lg transition-all overflow-hidden"
         onClick={() => navigate(`/property/${property.id}`)}
      >
        <div className="relative w-40 h-full flex-shrink-0 bg-gray-50">
          <img src={mainImage} className="w-full h-full object-contain" />
        </div>
        <div className="py-4 pr-4 flex flex-col justify-between flex-1">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{t(`property.types.${property.type}`) || t('search.properties')}</p>
            <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2">{property.title}</h3>
            <p className="text-sm text-gray-500">{numGuests} {t('property.labels.guests')} · {numBeds} {t('property.labels.bedrooms')}</p>
          </div>
          <div className="flex items-center justify-between mt-4">
             <p className="text-sm text-gray-500">{t('property.labels.from')} <span className="font-bold text-gray-900 text-base">{formatPrice(property.price)}</span></p>
             <div className="flex items-center gap-1">
               <span className="font-bold text-sm text-gray-900">{rating}</span>
               <div className="flex text-orange-400">
                  <Star size={12} fill="currentColor" />
                  <Star size={12} fill="currentColor" />
                  <Star size={12} fill="currentColor" />
                  <Star size={12} fill="currentColor" />
                  <Star size={12} fill="currentColor" />
               </div>
             </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'group bg-white rounded-xl border border-gray-200 shadow-[0_10px_35px_rgb(0,0,0,0.08)]',
        'hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col overflow-hidden'
      )}
      onClick={() => navigate(`/property/${property.id}`)}
    >
      {/* Image Container - Bottom edges rounded more than card */}
      <div className="relative w-full aspect-video sm:aspect-video bg-gray-50 isolate rounded-b-2xl overflow-hidden p-1">
        {!imgLoaded && !imgError && (
          <div className="skeleton absolute inset-0 z-0" />
        )}
        {mainImage && !imgError ? (
          <img
            src={mainImage}
            alt={property.title}
            className={cn(
              'w-full h-full object-contain group-hover:scale-105 transition-transform duration-700',
              imgLoaded ? 'opacity-100' : 'opacity-0'
            )}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200">
            <Home size={32} className="text-gray-300" />
          </div>
        )}

        {/* Favorite button (Bookmark) */}
        <button
          onClick={handleFav}
          className={cn(
            'absolute bottom-3 right-3 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center z-10',
            'transition-all duration-200 shadow-md',
            isFav ? 'bg-brand-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-black'
          )}
        >
          <Bookmark size={14} className="sm:w-4 sm:h-4" fill={isFav ? 'currentColor' : 'none'} color={isFav ? 'white' : 'currentColor'} strokeWidth={isFav ? 0 : 2} />
        </button>
      </div>

      {/* Content - Added consistent padding */}
      <div className="p-4 flex-1 flex flex-col min-w-0">
        <p className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1 shadow-sm sm:mb-2">
          {t(`property.types.${property.type}`) || t('search.properties')}
        </p>
        
        <h3 className="font-bold text-gray-900 text-sm sm:text-lg leading-snug line-clamp-1 mb-1 sm:mb-2">
          {property.title}
        </h3>
        
        <p className="text-[11px] sm:text-sm text-gray-500 mb-4 sm:mb-6">
           {numGuests} {t('property.labels.guests')} · {numBeds} {t('property.labels.beds')}
        </p>
 
        <div className="mt-auto flex items-center justify-between">
          <p className="text-[11px] sm:text-sm text-gray-500">
            {t('property.labels.from')} <span className="font-bold text-gray-900 text-[12px] sm:text-lg">{formatPrice(property.price)}</span>
          </p>
          <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
            <span className="font-bold text-[11px] sm:text-sm text-gray-900">{rating}</span>
            <div className="flex text-orange-400 gap-0.5">
               <Star size={10} className="sm:w-3 sm:h-3" fill="currentColor" strokeWidth={0} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const PropertyCard = memo(PropertyCardComponent)
