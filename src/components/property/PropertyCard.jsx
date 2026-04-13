import React, { useState, useMemo, memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Bookmark, Star, Home, Eye } from 'lucide-react'
import { openAuthModal } from '../../store/authSlice'
import { useProperties } from '../../hooks/useProperties'
import { cn } from '../../utils/helpers'
import { useTranslation } from 'react-i18next'

const PropertyCardComponent = ({ property, layout = 'grid', compact = false }) => {
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
    if (!str) return 0
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i)
      hash = hash & hash
    }
    return Math.abs(hash) % 100 / 100
  }

  // Memoize values with deterministic calculation
  const { rating, numBeds } = useMemo(() => {
    const seed = simpleHash(property.id?.toString() || '')
    return {
      rating: property.rating || (4 + seed).toFixed(1),
      numBeds: property.bedrooms || Math.floor(seed * 3) + 2,
    }
  }, [property.id, property.rating, property.bedrooms])

  const formatPrice = (p) => {
    if (!p) return '0'
    const num = Number(p)
    return num.toLocaleString('en-IN')
  }

  // List Layout (Matches Image 2)
  if (layout === 'list') {
    return (
      <div 
        className="group bg-white rounded-2xl border border-gray-100 flex gap-4 p-1.5 cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
        onClick={() => navigate(`/property/${property.id}`)}
      >
        <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100/50">
          <img 
            src={mainImage} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
            onLoad={() => setImgLoaded(true)}
            loading="lazy"
          />
          {!imgLoaded && <div className="skeleton absolute inset-0" />}
          
          <button
            onClick={handleFav}
            className={cn(
              "absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all",
              isFav ? "bg-brand-500 text-white shadow-lg" : "bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white"
            )}
          >
            <Bookmark size={14} fill={isFav ? "currentColor" : "none"} />
          </button>
        </div>

        <div className="flex-1 py-1 flex flex-col justify-between min-w-0 pr-2">
          <div>
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.1em] mb-0.5 block">
              {t(`property.types.${property.type}`) || property.type || 'ROOM'}
            </span>
            <h3 className="font-black text-gray-900 text-base sm:text-lg leading-tight line-clamp-1 mb-1">
              {property.title}
            </h3>
            <p className="text-[11px] sm:text-xs font-semibold text-gray-500">
              {numBeds} {t('property.labels.bedrooms')}
            </p>
          </div>

          <div className="flex items-end justify-between mt-auto pb-0.5">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-gray-400 uppercase leading-none mb-0.5">{t('property.labels.from')}</span>
              <span className="font-black text-gray-900 text-base sm:text-lg leading-none">₹{formatPrice(property.price)}</span>
            </div>
            
            <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100 shadow-sm">
              <span className="font-black text-xs text-gray-900">{rating}</span>
              <Star size={10} fill="currentColor" className="text-orange-400" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Dashboard / Compact Layout
  if (compact) {
    return (
      <div 
        className="group bg-white rounded-2xl border border-gray-100 w-60 flex-shrink-0 overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 shadow-sm"
        onClick={() => navigate(`/property/${property.id}`)}
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-b-xl">
          <img src={mainImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute top-2 right-2 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[8px] font-black text-brand-600 uppercase tracking-wider">
             {t(`property.types.${property.type}`) || property.type}
          </div>
        </div>
        <div className="px-3 py-2">
          <h3 className="font-bold text-gray-900 text-[13px] line-clamp-1 mb-0.5">{property.title}</h3>
          <div className="flex items-center justify-between text-[10px] text-gray-500 font-bold">
             <span className="text-gray-900">₹{formatPrice(property.price)}</span>
             <div className="flex items-center gap-0.5 text-gray-900">
               <Star size={9} className="text-orange-400" fill="currentColor" />
               {rating}
             </div>
          </div>
        </div>
      </div>
    )
  }

  // Standard Grid Layout (Default)
  return (
    <div
      className={cn(
        'group bg-white rounded-2xl border border-gray-200 shadow-sm',
        'hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col overflow-hidden'
      )}
      onClick={() => navigate(`/property/${property.id}`)}
    >
      <div className="relative w-full aspect-[4/3] bg-gray-50 overflow-hidden rounded-b-2xl">
        <img
          src={mainImage}
          alt={property.title}
          className={cn(
            'w-full h-full object-cover group-hover:scale-110 transition-transform duration-700',
            imgLoaded ? 'opacity-100' : 'opacity-0'
          )}
          onLoad={() => setImgLoaded(true)}
          loading="lazy"
        />
        {!imgLoaded && <div className="skeleton absolute inset-0" />}
        
        <button
          onClick={handleFav}
          className={cn(
            'absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center z-10',
            'transition-all duration-200 shadow-sm transition-opacity',
            isFav ? 'bg-brand-500 text-white' : 'bg-white/90 backdrop-blur-sm text-gray-600'
          )}
        >
          <Bookmark size={14} fill={isFav ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="px-3.5 py-2.5 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
            {t(`property.types.${property.type}`) || property.type}
          </span>
          <div className="flex items-center gap-1 bg-gray-50/50 px-1 py-0.5 rounded-lg">
            <span className="font-black text-[9px] text-gray-900">{rating}</span>
            <Star size={9} className="text-orange-400" fill="currentColor" />
          </div>
        </div>
        
        <h3 className="font-extrabold text-gray-900 text-sm leading-tight line-clamp-1 mb-1">
          {property.title}
        </h3>
        
        <p className="text-[11px] text-gray-500 font-bold mb-2">
           {numBeds} {t('property.labels.beds')}
        </p>
        
        <div className="mt-auto pt-2 border-t border-gray-50 flex items-center justify-between">
          <p className="flex flex-col">
            <span className="text-[8px] font-bold text-gray-400 uppercase leading-none">{t('property.labels.from')}</span>
            <span className="font-black text-gray-900 text-base leading-tight">₹{formatPrice(property.price)}</span>
          </p>
          <button className="text-[#CA3433] hover:text-brand-800 transition-colors">
            <Eye size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}



export const PropertyCard = memo(PropertyCardComponent)
