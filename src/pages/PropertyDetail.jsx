import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MapPin, Heart, Share2, Phone, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { openAuthModal } from '../store/authSlice'
import { useProperties } from '../hooks/useProperties'
import { TypeBadge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { formatPrice, cn, AMENITY_ICONS } from '../utils/helpers'
import toast from 'react-hot-toast'

export const PropertyDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector(s => s.auth)
  const { currentProperty, fetchPropertyById, favorites, toggleFavorite } = useProperties()

  useEffect(() => {
    fetchPropertyById(id)
  }, [id])

  if (!currentProperty) {
    return (
      <div className="pt-32 min-h-screen flex items-center justify-center">
        <div className="skeleton w-32 h-32 rounded-full" />
      </div>
    )
  }

  const p = currentProperty
  const isFav = favorites.includes(p.id)
  const isAvailable = p.availability !== false

  const handleFav = () => {
    if (!user) { dispatch(openAuthModal('signup')); return }
    toggleFavorite(p.id)
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Link copied to clipboard!')
  }

  const images = p.images || []
  const mainImage = images[0] || 'https://via.placeholder.com/800x600?text=No+Image'
  const otherImages = images.slice(1, 4)

  return (
    <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Nav */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 mb-6 transition-colors">
          <ArrowLeft size={16} /> Back to Search
        </button>

        <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-100 mb-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <TypeBadge type={p.type} />
                {!isAvailable && (
                  <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-md">
                    Not Available
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 font-display">{p.title}</h1>
              <div className="flex items-center gap-2 text-gray-500 text-sm sm:text-base">
                <MapPin size={16} className="text-brand-500" />
                {p.area}, {p.city} • {p.pincode}
              </div>
            </div>
            <div className="flex items-center justify-between lg:flex-col lg:items-end gap-2">
              <div className="text-3xl font-bold text-brand-600">
                {formatPrice(p.price)}<span className="text-sm text-gray-500 font-normal"> / month</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="icon" onClick={handleShare}><Share2 size={18} /></Button>
                <Button variant="secondary" size="icon" onClick={handleFav} className={isFav ? 'text-red-500 border-red-200 bg-red-50' : ''}>
                  <Heart size={18} fill={isFav ? 'currentColor' : 'none'} />
                </Button>
              </div>
            </div>
          </div>

          {/* Images Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10 h-[400px] sm:h-[500px]">
            <div className="md:col-span-3 h-full rounded-2xl overflow-hidden relative group">
              <img src={mainImage} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="hidden md:flex flex-col gap-4 h-full">
              {otherImages.map((img, i) => (
                <div key={i} className="flex-1 rounded-2xl overflow-hidden relative group">
                  <img src={img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="view" />
                </div>
              ))}
              {images.length > 4 && (
                <div className="flex-1 rounded-2xl overflow-hidden relative bg-black">
                  <img src={images[4]} className="w-full h-full object-cover opacity-50" alt="view" />
                  <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
                    +{images.length - 4} More
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-10">
              {/* Description */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4 font-display">About this property</h2>
                <div className="bg-gray-50 rounded-2xl p-6 text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {p.description}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4 font-display">What this place offers</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {(p.amenities || []).map(a => (
                    <div key={a} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white shadow-sm">
                      <span className="text-2xl">{AMENITY_ICONS[a]}</span>
                      <span className="font-semibold text-gray-700 capitalize text-sm">{a}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Landmarks */}
              {p.nearby_landmarks && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4 font-display">Nearby Landmarks</h2>
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-brand-50 text-brand-800">
                    <MapPin className="flex-shrink-0 mt-0.5" size={18} />
                    <p className="font-medium text-sm leading-relaxed">{p.nearby_landmarks}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar / Contact */}
            <div className="lg:col-span-1">
              <div className="bg-white border text-center border-gray-200 rounded-3xl p-6 shadow-xl sticky top-24">
                <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 overflow-hidden border-2 border-brand-100">
                  <img src={p.profiles?.avatar_url || p.landlord?.avatar} alt="Owner" className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-lg text-gray-900">{p.profiles?.full_name || p.landlord?.name}</h3>
                <p className="text-sm text-gray-500 mb-6">Property Owner · Verified <CheckCircle2 size={14} className="inline text-green-500" /></p>
                
                <div className="space-y-3 mb-6">
                  {user ? (
                    <>
                      <a href={`tel:${p.profiles?.phone || p.landlord?.phone || ''}`} className="flex items-center justify-center gap-2 w-full p-3 rounded-xl bg-brand-500 text-white font-semibold hover:bg-brand-600 transition-colors">
                        <Phone size={18} /> Contact Owner
                      </a>
                      <a href={`mailto:${p.profiles?.email || 'owner@example.com'}`} className="flex items-center justify-center gap-2 w-full p-3 rounded-xl bg-white border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
                        <Mail size={18} /> Send Email
                      </a>
                    </>
                  ) : (
                    <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-600">
                      Please <button onClick={() => dispatch(openAuthModal('login'))} className="text-brand-600 font-bold hover:underline">sign in</button> to view owner contact details.
                    </div>
                  )}
                </div>

                <div className="text-xs text-gray-400">
                  Report this listing if it seems incorrect or fraudulent.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
