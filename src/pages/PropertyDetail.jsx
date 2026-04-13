import React, { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MapPin, Heart, Share2, Phone, Mail, ArrowLeft, CheckCircle2, ChevronDown, ChevronUp, Lock, EyeOff, X } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { useSelector, useDispatch } from 'react-redux'
import { openAuthModal } from '../store/authSlice'
import { useProperties } from '../hooks/useProperties'
import { TypeBadge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { formatPrice, AMENITY_ICONS } from '../utils/helpers'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { Skeleton } from '../components/ui/Skeleton'
import { LocationViewer } from '../components/map/LocationViewer'

export const PropertyDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { user } = useSelector(s => s.auth)
  const { currentProperty, fetchPropertyById, favorites, toggleFavorite, loading } = useProperties()
  const [showScrollToTop, setShowScrollToTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Toggle to Up arrow if we've scrolled past a threshold (e.g. 1000px) 
      // or if we're near the contact section
      setShowScrollToTop(window.scrollY > 800)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const [hasUnlocked, setHasUnlocked] = useState(false)
  const [unlocking, setUnlocking] = useState(false)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [initialSlideIndex, setInitialSlideIndex] = useState(0)
  
  // State for custom navigation elements (ensures reliable init)
  const [prevEl, setPrevEl] = useState(null)
  const [nextEl, setNextEl] = useState(null)
  const [galleryPrevEl, setGalleryPrevEl] = useState(null)
  const [galleryNextEl, setGalleryNextEl] = useState(null)

  const openGallery = (index) => {
    setInitialSlideIndex(index)
    setIsGalleryOpen(true)
  }

  useEffect(() => {
    fetchPropertyById(id)
    checkUnlockStatus()
  }, [id, user])

  const checkUnlockStatus = async () => {
    if (!user || !id) return
    const { data } = await supabase
      .from('unlocked_properties')
      .select('id')
      .eq('user_id', user.id)
      .eq('property_id', id)
      .maybeSingle()
    if (data) setHasUnlocked(true)
  }

  if (loading || !currentProperty) {
    return (
      <div className="pt-8 pb-20 bg-[#F9F8F6] min-h-screen">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-6 w-24 mb-6" />
          
          {/* Image Bento Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 h-[400px] sm:h-[550px]">
             <Skeleton className="md:col-span-2 md:row-span-2 rounded-lg sm:rounded-xl h-full" />
             <Skeleton className="hidden md:block col-span-1 row-span-1 rounded-lg sm:rounded-xl h-full" />
             <Skeleton className="hidden md:block col-span-1 row-span-1 rounded-lg sm:rounded-xl h-full" />
             <Skeleton className="hidden md:block col-span-1 row-span-1 rounded-lg sm:rounded-xl h-full" />
             <Skeleton className="hidden md:block col-span-1 row-span-1 rounded-lg sm:rounded-xl h-full" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-48 w-full rounded-lg sm:rounded-xl" />
              <Skeleton className="h-64 w-full rounded-lg sm:rounded-xl" />
            </div>
            <div className="lg:col-span-1">
              <Skeleton className="h-96 w-full rounded-lg sm:rounded-xl" />
            </div>
          </div>
        </div>
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

  const handleUnlock = async () => {
    if (!user) { dispatch(openAuthModal('login')); return }
    if (unlocking) return // Prevent double-submission
    setUnlocking(true)
    try {
      // 1. Create order via Edge Function
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-razorpay-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
        },
        body: JSON.stringify({ property_id: p.id })
      })

      if (response.status === 409) {
        // Already unlocked — just refresh UI
        setHasUnlocked(true)
        await checkUnlockStatus()
        setUnlocking(false)
        return
      }

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}))
        throw new Error(errBody.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      const orderData = await response.json()

      // 2. Load Razorpay script robustly
      const loadRazorpay = () => {
        return new Promise((resolve) => {
          if (window.Razorpay) return resolve(true)
          const script = document.createElement('script')
          script.src = 'https://checkout.razorpay.com/v1/checkout.js'
          script.onload = () => resolve(true)
          script.onerror = () => resolve(false)
          document.body.appendChild(script)
        })
      }

      const scriptLoaded = await loadRazorpay()
      if (!scriptLoaded) throw new Error('Razorpay SDK failed to load')

      // 3. Open Razorpay Checkout Modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        order_id: orderData.id,
        currency: 'INR',
        name: 'GOEAZY',
        description: `Unlock contact details for ${p.title}`,
        handler: async function (response) {
          try {
            setUnlocking(true)
            const { data: { session } } = await supabase.auth.getSession()
            const token = session?.access_token

            const verifyResp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-razorpay-payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                property_id: p.id
              })
            })

            if (!verifyResp.ok) {
              const vErrBody = await verifyResp.json().catch(() => ({}))
              throw new Error(vErrBody.error || `HTTP ${verifyResp.status}: ${verifyResp.statusText}`)
            }

            toast.success('Payment verified! Contact details unlocked.')
            setHasUnlocked(true)
            checkUnlockStatus() 
          } catch (vErr) {
            console.error('Verification error:', vErr)
            toast.error('Payment verification failed: ' + vErr.message)
          } finally {
            setUnlocking(false)
          }
        },
        prefill: {
          name: user?.user_metadata?.full_name || 'Customer',
          email: user?.email || '',
          contact: user?.user_metadata?.phone || '9999999999'
        },
        theme: { color: '#CA3433' },
        modal: {
          ondismiss: function() {
            setUnlocking(false)
          }
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', function (response){
        console.error('Razorpay payment failed:', response.error)
        const desc = response.error?.description || response.error?.reason || 'Payment could not be completed'
        toast.error('Payment failed: ' + desc)
        setUnlocking(false)
      })
      rzp.open()
    } catch (err) {
      console.error('Payment initiation error:', err)
      
      // Attempt to extract detailed error from Supabase Function response
      let errorMsg = err.message
      if (err.context && typeof err.context.json === 'function') {
        try {
          const body = await err.context.json()
          if (body.error) errorMsg = body.error
        } catch {
          // fallback to original message
        }
      }
      
      toast.error('Could not initiate payment: ' + errorMsg)
    } finally {
      setUnlocking(false)
    }
  }

  const images = p.images || []
  const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23f3f4f6'/%3E%3Cpath d='M370 280l30 30 30-30m-60 40h60' stroke='%23d1d5db' stroke-width='2' fill='none'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%239ca3af'%3ENo Image Available%3C/text%3E%3C/svg%3E"
  const mainImage = images[0] || PLACEHOLDER_IMAGE
  const otherImages = images.slice(1, 5) // up to 4 other images

  const renderSlider = () => (
    <div className="relative w-full aspect-square md:aspect-[4/3] bg-gray-100 rounded-xl sm:rounded-2xl overflow-hidden shadow-md group border border-gray-200/50">
      <Swiper
        key={p.id}
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={{
          prevEl: prevEl,
          nextEl: nextEl,
        }}
        pagination={{ clickable: true, dynamicBullets: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        className="w-full h-full"
      >
        {images.map((img, i) => (
          <SwiperSlide key={i}>
            <div 
              className="w-full h-full cursor-pointer flex items-center justify-center bg-gray-100"
              onClick={() => openGallery(i)}
            >
              <img 
                src={img} 
                alt={`${p.title} - View ${i + 1}`} 
                className="w-full h-full object-contain" 
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Icons */}
      <button ref={setPrevEl} className="absolute left-1 top-1/2 -translate-y-1/2 z-20 p-2 cursor-pointer active:scale-95 transition-all outline-none border-none bg-transparent text-white">
        <img src="/swipe-left.svg" alt="Previous" className="w-12 h-12 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
      </button>
      <button ref={setNextEl} className="absolute right-1 top-1/2 -translate-y-1/2 z-20 p-2 cursor-pointer active:scale-95 transition-all outline-none border-none bg-transparent text-white">
        <img src="/swipe-right.svg" alt="Next" className="w-12 h-12 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
      </button>
      
      {/* Overlay Actions */}
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <button className="bg-white/90 backdrop-blur-sm border-0 rounded-full w-10 h-10 p-0 flex items-center justify-center hover:bg-white text-gray-900 transition-colors shadow-sm cursor-pointer" onClick={handleShare}>
          <Share2 size={18} />
        </button>
        <button className={`bg-white/90 backdrop-blur-sm border-0 rounded-full w-10 h-10 p-0 flex items-center justify-center hover:bg-white transition-colors shadow-sm cursor-pointer ${isFav ? 'text-red-500' : 'text-gray-900'}`} onClick={handleFav}>
          <Heart size={18} fill={isFav ? 'currentColor' : 'none'} />
        </button>
      </div>
    </div>
  )

  return (
    <div className="pt-8 pb-20 bg-[#F9F8F6] min-h-screen">
      <div className="w-full px-4 sm:px-10 md:px-16 lg:px-20">
        
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 mb-6 transition-colors">
          <ArrowLeft size={16} /> {t('property.labels.back')}
        </button>

        {/* MOBILE SLIDER - Top of page */}
        <div className="block lg:hidden w-full mb-6">
          {renderSlider()}
        </div>

        {/* MAIN CONTENT COLUMNS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start lg:mt-6">
          
          {/* LEFT COLUMN - CONTENT GRID */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
            
            {/* Header Card - Full Width */}
            <div className="bg-white rounded-lg sm:rounded-xl p-6 sm:p-8 shadow-[0_2px_12px_rgb(0,0,0,0.03)] border border-gray-100/50">
              <div className="flex justify-between items-start mb-4">
                 <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2 font-display">
                   {formatPrice(p.price)}
                 </h1>
                 <div className="bg-brand-lime px-4 py-1.5 rounded-full text-brand-900 font-bold text-sm tracking-wide">
                   {isAvailable ? t('property.labels.active') : t('property.labels.inactive')}
                 </div>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2 whitespace-nowrap overflow-x-auto scrollbar-hide py-1">
                <span>{t(`property.types.${p.type}`) || p.type}</span>
                <span className="text-gray-300">•</span>
                <span>{p.area}</span>
                <span className="text-gray-300">•</span>
                <span>{p.city}</span>
              </div>
              <p className="text-gray-500 text-sm">
                {hasUnlocked || (p.landlord_id === user?.id) ? (p.exact_location || `${p.area}, ${p.city} • ${p.pincode}`) : `${p.area}, ${p.city} • ${p.pincode}`}
              </p>
            </div>

            {/* Amenities Card - Top Left */}
            <div className="h-full">
              {p.amenities && p.amenities.length > 0 && (
                <div className="bg-white rounded-lg sm:rounded-xl p-6 sm:p-8 shadow-[0_2px_12px_rgb(0,0,0,0.03)] border border-gray-100/50 h-full flex flex-col">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight font-display">{t('property.sections.amenities')}</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {p.amenities.map(a => (
                      <div key={a} className="flex gap-3 items-center">
                         <div className="w-10 h-10 rounded-full bg-[#F9F8F6] flex items-center justify-center text-gray-600">
                           {(() => {
                             const Icon = AMENITY_ICONS[a];
                             return Icon ? <Icon size={20} /> : null;
                           })()}
                         </div>
                         <span className="font-semibold text-gray-700 capitalize text-[15px]">{a}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Key Details Card - Top Right */}
            <div className="h-full bg-white rounded-lg sm:rounded-xl p-6 sm:p-8 shadow-[0_2px_12px_rgb(0,0,0,0.03)] border border-gray-100/50 flex flex-col">
               <h2 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight font-display">{t('property.sections.keyDetails')}</h2>
               <div className="grid grid-cols-2 gap-6 gap-y-8 border-t border-gray-100 pt-6">
                 <div>
                   <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">{t(`property.types.${p.type}`) || t('search.properties')}</p>
                   <p className="text-gray-900 font-semibold">{t(`property.types.${p.type}`) || p.type}</p>
                 </div>
                 <div>
                   <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">{t('search.cityArea')}</p>
                   <p className="text-gray-900 font-semibold">{p.city}</p>
                 </div>
                 <div>
                   <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Pincode</p>
                   <p className="text-gray-900 font-semibold mx-0">{p.pincode || 'N/A'}</p>
                 </div>
                 <div>
                   <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">{t('property.labels.views')}</p>
                   <p className="text-gray-900 font-semibold">{p.views}</p>
                 </div>
               </div>
            </div>

            {/* About Card - Middle Left */}
            <div className="h-full">
              {p.description && (
                <div className="bg-white rounded-lg sm:rounded-xl p-6 sm:p-8 shadow-[0_2px_12px_rgb(0,0,0,0.03)] border border-gray-100/50 h-full flex flex-col">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight font-display">{t('property.sections.about')}</h2>
                  {(hasUnlocked || p.landlord_id === user?.id) ? (
                    <div className="text-gray-600 leading-relaxed whitespace-pre-wrap text-[15px]">
                      {p.description}
                    </div>
                  ) : (
                    <div className="relative min-h-[180px] overflow-hidden rounded-xl border border-black/5 bg-slate-50/20 flex items-center justify-center">
                      <div className="absolute inset-0 p-6 text-gray-600 leading-relaxed whitespace-pre-wrap text-[15px] select-none" style={{ filter: 'blur(8px)', userSelect: 'none', pointerEvents: 'none' }}>
                        {p.description}
                      </div>
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-brand-50/20 backdrop-blur-[12px] border border-brand-500/20">
                        <div className="w-14 h-14 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center border border-brand-100 shadow-sm mb-3">
                          <EyeOff size={28} className="text-brand-500" />
                        </div>
                        <p className="text-brand-900/60 font-bold tracking-widest text-[12px] uppercase">{t('property.sections.detailsLocked')}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Nearby Landmarks Card - Middle Right */}
            <div className="h-full">
              {p.nearby_landmarks && (
                <div className="bg-white rounded-lg sm:rounded-xl p-6 sm:p-8 shadow-[0_2px_12px_rgb(0,0,0,0.03)] border border-gray-100/50 h-full flex flex-col">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight font-display">{t('property.sections.nearby')}</h2>
                  {(hasUnlocked || p.landlord_id === user?.id) ? (
                    <div className="flex items-start gap-4 p-5 rounded-xl bg-[#F9F8F6]">
                      <MapPin className="text-gray-400 mt-1 flex-shrink-0" size={20} />
                      <p className="text-gray-700 font-medium leading-relaxed">{p.nearby_landmarks}</p>
                    </div>
                  ) : (
                    <div className="relative min-h-[180px] overflow-hidden rounded-xl border border-black/5 bg-slate-50/20 flex items-center justify-center">
                      <div className="absolute inset-0 p-6 flex items-start gap-4 select-none" style={{ filter: 'blur(8px)', userSelect: 'none', pointerEvents: 'none' }}>
                        <MapPin className="text-gray-400 mt-1 flex-shrink-0" size={20} />
                        <p className="text-gray-700 font-medium leading-relaxed">{p.nearby_landmarks}</p>
                      </div>
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-brand-50/20 backdrop-blur-[12px] border border-brand-500/20">
                        <div className="w-14 h-14 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center border border-brand-100 shadow-sm mb-3">
                          <EyeOff size={28} className="text-brand-500" />
                        </div>
                        <p className="text-brand-900/60 font-bold tracking-widest text-[12px] uppercase">{t('property.sections.detailsLocked')}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Location on Map Card */}
            {p.latitude && p.longitude && (
              <div className="h-full">
                {(hasUnlocked || p.landlord_id === user?.id) ? (
                  <LocationViewer
                    latitude={p.latitude}
                    longitude={p.longitude}
                    title={p.title}
                    address={p.map_address || p.exact_location || `${p.area}, ${p.city}`}
                  />
                ) : (
                  <div className="bg-white rounded-lg sm:rounded-xl p-6 sm:p-8 shadow-[0_2px_12px_rgb(0,0,0,0.03)] border border-gray-100/50 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold text-gray-900 tracking-tight font-display flex items-center gap-2">
                        <MapPin size={22} className="text-[#CA3433]" />
                        Location on Map
                      </h2>
                    </div>
                    <div className="relative min-h-[260px] overflow-hidden rounded-xl border border-black/5 bg-slate-50/20 flex items-center justify-center">
                      <div className="absolute inset-0 select-none opacity-20" style={{ backgroundImage: 'radial-gradient(circle at center, #cbd5e1 2px, transparent 2px)', backgroundSize: '16px 16px', filter: 'blur(4px)', userSelect: 'none', pointerEvents: 'none' }}></div>
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-brand-50/20 backdrop-blur-[12px] border border-brand-500/20">
                        <div className="w-14 h-14 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center border border-brand-100 shadow-sm mb-3">
                          <EyeOff size={28} className="text-brand-500" />
                        </div>
                        <p className="text-brand-900/60 font-bold tracking-widest text-[12px] uppercase">{t('property.sections.detailsLocked')}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* RIGHT COLUMN - SLIDER & SIDEBAR */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
            {/* DESKTOP SLIDER */}
            <div className="hidden lg:block w-full">
              {renderSlider()}
            </div>

            {/* CONTACT SIDEBAR */}
            <div id="contact-section" className="bg-white rounded-lg sm:rounded-xl p-6 sm:p-8 shadow-[0_2px_24px_rgb(0,0,0,0.04)] border border-gray-100/50">
              <h3 className="text-xl font-bold text-gray-900 mb-6 tracking-tight font-display">{t('property.sections.requestContact')}</h3>
              
              <div className="space-y-4 mb-8">
                <div className="p-4 bg-[#F9F8F6] rounded-xl border border-gray-100">
                   <p className="text-xs text-gray-500 font-bold mb-1 uppercase tracking-wider">{t('property.sections.owner')}</p>
                   <p className="font-semibold text-gray-900">{p.profiles?.full_name || p.landlord?.name}</p>
                </div>

                {user ? (
                    (hasUnlocked || p.landlord_id === user.id) ? (
                      <div className="space-y-3">
                        <a href={`tel:${p.contact_phone || p.profiles?.phone || p.landlord?.phone || ''}`} className="flex items-center justify-center gap-2 w-full px-5 py-3.5 rounded-full bg-brand-500 text-white font-bold hover:bg-brand-600 transition-colors text-[15px]">
                          <Phone size={18} /> {p.contact_phone || p.profiles?.phone || 'Call Now'}
                        </a>
                        <a href={`mailto:${p.contact_email || p.profiles?.email || 'owner@example.com'}`} className="flex items-center justify-center gap-2 w-full px-5 py-3.5 rounded-full bg-white border border-gray-200 text-gray-900 font-bold hover:bg-gray-50 transition-colors shadow-sm text-[15px]">
                          <Mail size={18} /> Send Email
                        </a>
                      </div>
                    ) : (
                      <div className="border border-brand-100/50 rounded-xl p-6 text-center bg-brand-50/10 relative overflow-hidden h-48 flex flex-col items-center justify-center shadow-sm border border-brand-600/20">
                        <div className="absolute inset-0 backdrop-blur-[15px]" />
                        <div className="relative z-10 flex flex-col items-center">
                          <div className="w-12 h-12 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-3 border border-brand-100 shadow-sm text-brand-500">
                            <EyeOff size={24} />
                          </div>
                          <p className="font-bold text-gray-900 mb-2 font-display text-lg">{t('property.sections.detailsLocked')}</p>
                          <p className="text-[13px] text-gray-500 leading-relaxed max-w-xs mx-auto px-4">{t('property.sections.lockDesc')}</p>
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="border border-gray-100 rounded-xl p-6 text-center bg-[#fcfbf9]">
                      <p className="text-sm text-gray-600 mb-4 font-medium">{t('property.sections.signinPrompt')}</p>
                      <Button variant="secondary" className="w-full rounded-full font-bold bg-white" onClick={() => dispatch(openAuthModal('login'))}>
                        {t('nav.login')}
                      </Button>
                    </div>
                  )}
              </div>

              {((user && !(hasUnlocked || p.landlord_id === user.id)) || !user) && (
                <button 
                  onClick={handleUnlock} 
                  disabled={unlocking}
                  className="w-full bg-gray-900 text-white font-bold text-[15px] py-4 rounded-full hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-gray-900/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {unlocking ? t('property.sections.processing') : t('property.sections.unlockBtn')}
                </button>
              )}
            </div>

            {/* Listing Agent Card */}
            <div className="bg-white rounded-lg sm:rounded-xl p-6 sm:p-8 shadow-[0_2px_12px_rgb(0,0,0,0.03)] border border-gray-100/50">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight font-display">Listing Agent</h2>
              <div className="flex items-center gap-6">
                <img src={p.profiles?.avatar_url || p.landlord?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.profiles?.full_name || 'Owner')}`} alt="Agent" className="w-16 h-16 rounded-full object-cover bg-gray-100" />
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">{p.profiles?.full_name || p.landlord?.name} <CheckCircle2 size={16} className="text-green-500" /></h3>
                  <div className="flex flex-col text-sm text-gray-500 mt-1 gap-1">
                    {(hasUnlocked || p.landlord_id === user?.id) ? (
                      <>
                        <a href={`mailto:${p.contact_email || p.profiles?.email}`} className="hover:text-gray-900 truncate">{p.contact_email || p.profiles?.email || 'owner@example.com'}</a>
                        <a href={`tel:${p.contact_phone || p.profiles?.phone}`} className="hover:text-gray-900">{p.contact_phone || p.profiles?.phone || 'Not provided'}</a>
                      </>
                    ) : (
                      <span>{t('property.sections.contactLocked')}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Jump to Contact Feature */}
      <div className="fixed bottom-6 right-4 sm:hidden z-40">
        <button 
          onClick={() => {
            if (showScrollToTop) {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              const section = document.getElementById('contact-section');
              if (section) {
                const offset = 80;
                const top = section.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
              }
            }
          }}
          className="flex flex-col items-center justify-center p-2.5 bg-gray-900 text-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-800 active:scale-95 transition-transform"
        >
          {showScrollToTop ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {/* Fullscreen Image Gallery Modal */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md">
          {/* Close Button */}
          <button 
            onClick={() => setIsGalleryOpen(false)}
            className="absolute top-6 right-6 z-50 w-12 h-12 bg-white/10 hover:bg-white/25 text-white rounded-full flex items-center justify-center transition-all duration-200"
          >
            <X size={24} />
          </button>
          
          <div className="w-full h-full sm:h-[90%] max-w-6xl mx-auto flex items-center justify-center">
            <Swiper
              key={`gallery-${p.id}`}
              modules={[Navigation, Pagination]}
              initialSlide={initialSlideIndex}
              spaceBetween={20}
              slidesPerView={1}
              navigation={{
                prevEl: galleryPrevEl,
                nextEl: galleryNextEl,
              }}
              pagination={{ type: 'fraction', el: '.gallery-pagination' }}
              className="w-full h-full"
            >
              {images.map((img, i) => (
                <SwiperSlide key={i}>
                  <div className="w-full h-full flex items-center justify-center p-4 sm:p-12">
                    <img 
                      src={img} 
                      alt={`Gallery view ${i + 1}`} 
                      className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" 
                    />
                  </div>
                </SwiperSlide>
              ))}
              
              {/* Custom Navigation Icons for Gallery */}
              <button ref={setGalleryPrevEl} className="absolute left-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center transition-all cursor-pointer">
                <img src="/swipe-left.svg" alt="Previous" className="w-8 h-8 brightness-0 invert" />
              </button>
              <button ref={setGalleryNextEl} className="absolute right-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center transition-all cursor-pointer">
                <img src="/swipe-right.svg" alt="Next" className="w-8 h-8 brightness-0 invert" />
              </button>
              
              {/* Custom Fraction Pagination at bottom */}
              <div className="gallery-pagination absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-white bg-black/50 px-4 py-1.5 rounded-full font-semibold tracking-widest text-sm backdrop-blur-md"></div>
            </Swiper>
          </div>
        </div>
      )}

    </div>
  )
}
