import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
<<<<<<< HEAD
import { MapPin, Heart, Share2, Phone, Mail, ArrowLeft, CheckCircle2, ChevronDown, ChevronUp, Lock, EyeOff, X, Star, Trash2 } from 'lucide-react'
=======
<<<<<<< Updated upstream
import { MapPin, Heart, Share2, Phone, Mail, ArrowLeft, CheckCircle2, ChevronDown, ChevronUp, Lock, EyeOff, X } from 'lucide-react'
>>>>>>> bugs-and-warnings
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
=======
import { MapPin, Heart, Share2, Phone, Mail, ArrowLeft, CheckCircle2, ChevronDown, Lock, EyeOff } from 'lucide-react'
>>>>>>> Stashed changes
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

const StarRating = ({ value, onChange, readonly = false }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map(n => (
      <button
        key={n}
        type="button"
        disabled={readonly}
        onClick={() => onChange && onChange(n)}
        className={`transition-transform ${!readonly ? 'hover:scale-125 cursor-pointer' : 'cursor-default'}`}
      >
        <Star
          size={readonly ? 14 : 22}
          className={n <= value ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}
        />
      </button>
    ))}
  </div>
)

export const PropertyDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { user } = useSelector(s => s.auth)
<<<<<<< HEAD
  const { 
    currentProperty, fetchPropertyById, fetchGatedData, 
    favorites, toggleFavorite, loading,
    reviews, fetchReviews, submitReview, deleteReview
  } = useProperties()
  const [showScrollToTop, setShowScrollToTop] = useState(false)
  const [gatedData, setGatedData] = useState(null)
  
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)

  const [visitDate, setVisitDate] = useState('')
  const [bookingVisit, setBookingVisit] = useState(false)
  const [pulseUnlock, setPulseUnlock] = useState(false)
  const visitDateRef = React.useRef('')
  
  useEffect(() => {
    visitDateRef.current = visitDate
  }, [visitDate])
=======
<<<<<<< Updated upstream
  const { currentProperty, fetchPropertyById, favorites, toggleFavorite, loading } = useProperties()
  const [showScrollToTop, setShowScrollToTop] = useState(false)
=======
  
  const { currentProperty, fetchPropertyById, fetchGatedData, favorites, toggleFavorite, loading } = useProperties()
  
  const [showScrollToTop, setShowScrollToTop] = useState(false)
  const [gatedData, setGatedData] = useState(null)
  const [hasUnlocked, setHasUnlocked] = useState(false)
  const [unlocking, setUnlocking] = useState(false)
>>>>>>> Stashed changes
>>>>>>> bugs-and-warnings

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 800)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
<<<<<<< Updated upstream

  const [hasUnlocked, setHasUnlocked] = useState(false)
  const [unlocking, setUnlocking] = useState(false)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [initialSlideIndex, setInitialSlideIndex] = useState(0)
  
  // State for custom navigation elements (ensures reliable init)
  const [galleryPrevEl, setGalleryPrevEl] = useState(null)
  const [galleryNextEl, setGalleryNextEl] = useState(null)

  const openGallery = (index) => {
    setInitialSlideIndex(index)
    setIsGalleryOpen(true)
  }
=======
>>>>>>> Stashed changes

  useEffect(() => {
    fetchPropertyById(id)
    fetchReviews(id)
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
    if (data) {
      setHasUnlocked(true)
      const gated = await fetchGatedData(id)
      setGatedData(gated)
    }
  }

  // Also fetch gated data if current user is the landlord
  useEffect(() => {
    const isLandlord = currentProperty && user && currentProperty.landlord_id === user.id
    if (isLandlord && !gatedData) {
      fetchGatedData(id).then(setGatedData)
    }
  }, [currentProperty, user, id, fetchGatedData, gatedData])

  if (loading || !currentProperty) {
    return (
      <div className="pt-8 pb-20 bg-[#F9F8F6] min-h-screen">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-6 w-24 mb-6" />
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

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0'

  const myReview = reviews.find(r => r.reviewer_id === user?.id)

  const handleFav = () => {
    if (!user) { dispatch(openAuthModal('signup')); return }
    toggleFavorite(p.id)
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success(t('property.sections.linkCopied'))
  }

  const submitSiteVisit = async () => {
    if (!user) { dispatch(openAuthModal('login')); return }
    if (p.landlord_id === user.id) { toast.error('You cannot book a visit for your own property'); return }
    if (!visitDate) { toast.error('Please select a date for the visit'); return }
    
    if (!hasUnlocked) {
       setPulseUnlock(true)
       const unlockBtn = document.getElementById('unlock-button')
       if (unlockBtn) unlockBtn.scrollIntoView({ behavior: 'smooth', block: 'center' })
       toast.error('Please unlock contact details to confirm your visit')
       setTimeout(() => setPulseUnlock(false), 2000)
       return
    }
    
    setBookingVisit(true)
    try {
      const { error } = await supabase.from('site_visits').insert({
        property_id: p.id,
        user_id: user.id,
        landlord_id: p.landlord_id,
        visit_date: visitDate,
        status: 'pending'
      })
      if (error) throw error
      toast.success('Visit Request Sent! Track it in your dashboard.')
      setVisitDate('')
    } catch (err) {
      console.error(err)
      toast.error('Failed to book visit.')
    } finally {
      setBookingVisit(false)
    }
  }

  const handleUnlock = async () => {
    if (!user) { dispatch(openAuthModal('login')); return }
    if (unlocking) return
    setUnlocking(true)
    try {
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
        setHasUnlocked(true)
        await checkUnlockStatus()
        setUnlocking(false)
        return
      }

      const orderData = await response.json()
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

      if (!(await loadRazorpay())) throw new Error('Razorpay SDK failed to load')

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        order_id: orderData.id,
        currency: 'INR',
        name: 'GOEAZY',
        description: `Unlock contact details for ${p.title}`,
        handler: async function (response) {
          try {
            setUnlocking(true)
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
            if (!verifyResp.ok) throw new Error('Payment verification failed')
            toast.success('Payment verified! Contact details unlocked.')
            setHasUnlocked(true)
            checkUnlockStatus() 
            if (visitDateRef.current) {
              const { error: visitErr } = await supabase.from('site_visits').insert({
                 property_id: p.id,
                 user_id: user.id,
                 landlord_id: p.landlord_id,
                 visit_date: visitDateRef.current,
                 status: 'pending'
              });
              if (!visitErr) {
                 toast.success('Visit Request Sent! Track it in your dashboard.')
                 setVisitDate('')
              }
            }
          } catch (vErr) {
            toast.error('Payment verification failed')
          } finally {
            setUnlocking(false)
          }
        },
        prefill: {
          name: user?.user_metadata?.full_name || 'Customer',
          email: user?.email || '',
          contact: user?.user_metadata?.phone || '9999999999'
        },
<<<<<<< Updated upstream
        theme: { color: '#CA3433' },
        modal: {
          ondismiss: function() {
            setUnlocking(false)
          }
        }
=======
        theme: { color: '#FF3366' }
>>>>>>> Stashed changes
      }
      new window.Razorpay(options).open()
    } catch (err) {
<<<<<<< Updated upstream
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
=======
      toast.error('Could not initiate payment')
>>>>>>> Stashed changes
    } finally {
      setUnlocking(false)
    }
  }

  const images = p.images || []
  const mainImage = images[0] || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%239ca3af'%3ENo Image Available%3C/text%3E%3C/svg%3E"
  const otherImages = images.slice(1, 5)

  const renderSlider = (prefix) => (
    <div className="relative w-full aspect-square md:aspect-[4/3] bg-gray-100 rounded-xl sm:rounded-2xl overflow-hidden shadow-md group border border-gray-200/50">
      <Swiper
        key={`${p.id}-${prefix}`}
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={{
          prevEl: `.prev-btn-${prefix}`,
          nextEl: `.next-btn-${prefix}`,
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
      <button className={`prev-btn-${prefix} absolute left-1 top-1/2 -translate-y-1/2 z-20 p-2 cursor-pointer active:scale-95 transition-all outline-none border-none bg-transparent text-white`}>
        <img src="/swipe-left.svg" alt="Previous" className="w-12 h-12 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
      </button>
      <button className={`next-btn-${prefix} absolute right-1 top-1/2 -translate-y-1/2 z-20 p-2 cursor-pointer active:scale-95 transition-all outline-none border-none bg-transparent text-white`}>
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
<<<<<<< Updated upstream
      <div className="w-full px-4 sm:px-10 md:px-16 lg:px-20">
        
=======
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
>>>>>>> Stashed changes
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 mb-6 transition-colors">
          <ArrowLeft size={16} /> {t('property.labels.back')}
        </button>

<<<<<<< Updated upstream
        {/* MOBILE SLIDER - Top of page */}
        <div className="block lg:hidden w-full mb-6">
          {renderSlider('mobile')}
        </div>

        {/* MAIN CONTENT COLUMNS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start lg:mt-6">
          
          {/* LEFT COLUMN - CONTENT GRID */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
            
            {/* Header Card - Full Width */}
=======
        {/* IMAGE BENTO GRID */}
        <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 ${images.length >= 5 ? 'h-[400px] sm:h-[550px]' : 'h-[400px]'}`}>
          <div className={`${images.length >= 5 ? 'md:col-span-2 md:row-span-2' : 'md:col-span-4'} h-full rounded-lg sm:rounded-xl overflow-hidden relative group`}>
            <img src={mainImage} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 bg-gray-200" />
            <div className="absolute top-4 right-4 flex gap-2 z-10">
              <Button variant="secondary" className="bg-white/90 backdrop-blur-sm border-0 rounded-full w-10 h-10 p-0 flex items-center justify-center hover:bg-white text-gray-900 transition-colors shadow-sm" onClick={handleShare}>
                <Share2 size={16} />
              </Button>
              <Button variant="secondary" className={`bg-white/90 backdrop-blur-sm border-0 rounded-full w-10 h-10 p-0 flex items-center justify-center transition-colors shadow-sm ${isFav ? 'text-red-500 hover:bg-red-50' : 'text-gray-900 hover:bg-white'}`} onClick={handleFav}>
                <Heart size={16} fill={isFav ? 'currentColor' : 'none'} />
              </Button>
            </div>
          </div>
          {images.length >= 5 && otherImages.map((img, i) => (
            <div key={i} className="hidden md:block col-span-1 row-span-1 h-full rounded-lg sm:rounded-xl overflow-hidden relative group bg-gray-200">
              <img src={img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={`view-${i}`} />
              {i === 3 && images.length > 5 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white font-bold text-xl backdrop-blur-[2px]">
                  +{images.length - 5}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
>>>>>>> Stashed changes
            <div className="bg-white rounded-lg sm:rounded-xl p-6 sm:p-8 shadow-[0_2px_12px_rgb(0,0,0,0.03)] border border-gray-100/50">
              <div className="flex justify-between items-start mb-4">
                 <div className="flex flex-col gap-1">
                   <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2 font-display">
                     {formatPrice(p.price)}
                   </h1>
                   <div className="flex items-center gap-2 mt-1">
                     <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
                       <Star size={14} className="text-amber-500 fill-amber-500" />
                       <span className="text-sm font-bold text-amber-900">{avgRating}</span>
                     </div>
                     <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">• {reviews.length} {t('property.labels.reviews')}</span>
                   </div>
                 </div>
                 <div className="bg-brand-lime px-4 py-1.5 rounded-full text-brand-900 font-bold text-sm tracking-wide">
                   {isAvailable ? t('property.labels.active') : t('property.labels.inactive')}
                 </div>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2 whitespace-nowrap overflow-x-auto scrollbar-hide py-1">
                <span>{t(`property.types.${p.type}`) || p.type}</span>
                <span className="text-gray-300">•</span>
                <span>{p.area}</span>
                <span className="text-gray-300">•</span>
                <span>{t(`cities.${p.city}`) || p.city}</span>
              </div>
              <p className="text-gray-500 text-sm">
                {(hasUnlocked || p.landlord_id === user?.id) ? (gatedData?.exact_location || `${p.area}, ${p.city}`) : `${p.area}, ${p.city} • ${p.pincode}`}
              </p>
            </div>

<<<<<<< Updated upstream
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
                   <p className="text-gray-900 font-semibold">{t(`cities.${p.city}`) || p.city}</p>
                 </div>
                 <div>
                   <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">{t('property.labels.pincode')}</p>
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
=======
            {p.description && (
              <div className="bg-white rounded-lg sm:rounded-xl p-6 sm:p-8 shadow-[0_2px_12px_rgb(0,0,0,0.03)] border border-gray-100/50">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight font-display">{t('property.sections.about')}</h2>
                <div className="text-gray-600 leading-relaxed whitespace-pre-wrap text-[15px]">{p.description}</div>
              </div>
            )}

            <div className="bg-white rounded-lg sm:rounded-xl p-6 sm:p-8 shadow-[0_2px_12px_rgb(0,0,0,0.03)] border border-gray-100/50">
               <h2 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight font-display">{t('property.sections.keyDetails')}</h2>
               <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 gap-y-8 border-t border-gray-100 pt-6">
                 <div><p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Type</p><p className="text-gray-900 font-semibold">{t(`property.types.${p.type}`) || p.type}</p></div>
                 <div><p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">City</p><p className="text-gray-900 font-semibold">{p.city}</p></div>
                 <div><p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Pincode</p><p className="text-gray-900 font-semibold">{p.pincode || 'N/A'}</p></div>
                 <div><p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Views</p><p className="text-gray-900 font-semibold">{p.views}</p></div>
               </div>
            </div>

            {p.amenities?.length > 0 && (
              <div className="bg-white rounded-lg sm:rounded-xl p-6 sm:p-8 shadow-[0_2px_12px_rgb(0,0,0,0.03)] border border-gray-100/50">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight font-display">{t('property.sections.amenities')}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {p.amenities.map(a => (
                    <div key={a} className="flex gap-3 items-center">
                       <div className="w-10 h-10 rounded-full bg-[#F9F8F6] flex items-center justify-center text-gray-600">
                         {(() => { const Icon = AMENITY_ICONS[a]; return Icon ? <Icon size={20} /> : null; })()}
                       </div>
                       <span className="font-semibold text-gray-700 capitalize text-[15px]">{a}</span>
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
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
            {gatedData?.latitude && gatedData?.longitude ? (
              <div className="h-full">
                <LocationViewer
                  latitude={gatedData.latitude}
                  longitude={gatedData.longitude}
                  title={p.title}
                  address={gatedData.exact_location || `${p.area}, ${p.city}`}
                />
              </div>
            ) : (
              <div className="h-full">
                <div className="bg-white rounded-lg sm:rounded-xl p-6 sm:p-8 shadow-[0_2px_12px_rgb(0,0,0,0.03)] border border-gray-100/50">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight font-display flex items-center gap-2">
                      <MapPin size={22} className="text-gray-300" />
                      {t('property.sections.locationMap')}
                    </h2>
                  </div>
                  <div className="relative h-[260px] overflow-hidden rounded-xl border border-black/5 bg-slate-50/20 flex items-center justify-center">
                    <div className="absolute inset-0 bg-gray-50 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/0,0,1/400x300?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}')] bg-cover opacity-20 grayscale pointer-events-none" style={{ filter: 'blur(4px)' }} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-brand-50/20 backdrop-blur-[12px] border border-brand-500/20">
                      <div className="w-14 h-14 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center border border-brand-100 shadow-sm mb-3">
                        <Lock size={28} className="text-brand-500" />
                      </div>
                      <p className="text-brand-900/60 font-bold tracking-widest text-[12px] uppercase">{t('property.sections.locationLocked')}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* RIGHT COLUMN - SLIDER & SIDEBAR */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
            {/* DESKTOP SLIDER */}
            <div className="hidden lg:block w-full">
              {renderSlider('desktop')}
            </div>

            {/* CONTACT SIDEBAR */}
            <div id="contact-section" className="bg-white rounded-lg sm:rounded-xl p-6 sm:p-8 shadow-[0_2px_24px_rgb(0,0,0,0.04)] border border-gray-100/50">
              <h3 className="text-xl font-bold text-gray-900 mb-6 tracking-tight font-display">{t('property.sections.requestContact')}</h3>
              
<<<<<<< HEAD
              <div className="mb-6 p-5 bg-white rounded-xl border border-[#CA3433]/20 shadow-[0_4px_12px_rgb(202,52,51,0.05)] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#CA3433]"></div>
                <h4 className="font-bold text-gray-900 mb-3 text-sm flex items-center justify-between">
                  Book a Site Visit
                </h4>
                <div className="flex gap-2">
                  <input 
                    type="date" 
                    min={new Date().toISOString().split('T')[0]}
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#CA3433]/20 focus:border-[#CA3433] outline-none transition-all cursor-pointer"
                  />
                  <Button 
                    variant="primary" 
                    className="rounded-lg px-5 bg-[#CA3433] whitespace-nowrap shadow-md shadow-[#CA3433]/20"
                    onClick={submitSiteVisit}
                    disabled={bookingVisit}
                  >
                    {bookingVisit ? 'Booking...' : 'Book'}
                  </Button>
                </div>
              </div>

=======
=======
              </div>
            )}

            {p.nearby_landmarks && (
              <div className="bg-white rounded-lg sm:rounded-xl p-6 sm:p-8 shadow-[0_2px_12px_rgb(0,0,0,0.03)] border border-gray-100/50">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight font-display">{t('property.sections.nearby')}</h2>
                {(hasUnlocked || p.landlord_id === user?.id) ? (
                  <div className="flex items-start gap-4 p-5 rounded-xl bg-[#F9F8F6]">
                    <MapPin className="text-gray-400 mt-1 flex-shrink-0" size={20} />
                    <p className="text-gray-700 font-medium leading-relaxed">{p.nearby_landmarks}</p>
                  </div>
                ) : (
                  <div className="relative h-20 overflow-hidden rounded-xl border border-black/5 flex items-center justify-center">
                    <div className="absolute inset-0 bg-brand-50/20 backdrop-blur-[12px] flex items-center justify-center">
                      <Lock size={18} className="text-brand-500 mr-2" />
                      <p className="text-brand-900/60 font-bold tracking-widest text-[10px] uppercase">Details Locked</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {gatedData?.latitude && gatedData?.longitude ? (
              <LocationViewer latitude={gatedData.latitude} longitude={gatedData.longitude} title={p.title} address={gatedData.exact_location || `${p.area}, ${p.city}`} />
            ) : (
              <div className="bg-white rounded-lg sm:rounded-xl p-6 sm:p-8 shadow-[0_2px_12px_rgb(0,0,0,0.03)] border border-gray-100/50">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight font-display flex items-center gap-2"><MapPin size={22} className="text-gray-300" /> Location Map</h2>
                <div className="relative h-[260px] overflow-hidden rounded-xl border border-black/5 bg-slate-50/20 flex flex-col items-center justify-center">
                   <Lock size={28} className="text-brand-500 mb-2" />
                   <p className="text-brand-900/60 font-bold tracking-widest text-[12px] uppercase">Map Locked</p>
                   <Button variant="primary" size="sm" className="mt-4 rounded-full px-6 bg-[#CA3433]" onClick={handleUnlock}>Unlock for ₹9</Button>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg sm:rounded-xl p-6 sm:p-8 shadow-[0_2px_12px_rgb(0,0,0,0.03)] border border-gray-100/50">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight font-display">Listing Agent</h2>
              <div className="flex items-center gap-6">
                <img src={p.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.profiles?.full_name || 'Owner')}`} alt="Agent" className="w-16 h-16 rounded-full object-cover bg-gray-100" />
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">{p.profiles?.full_name || 'Listing Owner'} <CheckCircle2 size={16} className="text-green-500" /></h3>
                  <div className="flex gap-4 text-sm text-gray-500 mt-1">
                    {(hasUnlocked || p.landlord_id === user?.id) ? (
                      <><span>{gatedData?.contact_email || 'Email Available'}</span><span>•</span><span>{gatedData?.contact_phone || 'Phone Available'}</span></>
                    ) : (<span>Contact Details Locked</span>)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1" id="contact-section">
            <div className="bg-white rounded-lg sm:rounded-xl p-6 sm:p-8 shadow-[0_2px_24px_rgb(0,0,0,0.04)] sticky top-28 border border-gray-100/50">
              <h3 className="text-xl font-bold text-gray-900 mb-6 tracking-tight font-display">Contact Details</h3>
>>>>>>> Stashed changes
>>>>>>> bugs-and-warnings
              <div className="space-y-4 mb-8">
                <div className="p-4 bg-[#F9F8F6] rounded-xl border border-gray-100">
                   <p className="text-xs text-gray-500 font-bold mb-1 uppercase tracking-wider">Owner</p>
                   <p className="font-semibold text-gray-900">{p.profiles?.full_name || 'Listing Owner'}</p>
                </div>
<<<<<<< Updated upstream

                {user ? (
                    (hasUnlocked || p.landlord_id === user.id) ? (
                      <div className="space-y-3">
                        <a href={`tel:${gatedData?.contact_phone || ''}`} className="flex items-center justify-center gap-2 w-full px-5 py-3.5 rounded-full bg-brand-500 text-white font-bold hover:bg-brand-600 transition-colors text-[15px]">
                          <Phone size={18} /> {gatedData?.contact_phone || t('property.sections.callNow')}
                        </a>
                        <a href={`mailto:${gatedData?.contact_email || ''}`} className="flex items-center justify-center gap-2 w-full px-5 py-3.5 rounded-full bg-white border border-gray-200 text-gray-900 font-bold hover:bg-gray-50 transition-colors shadow-sm text-[15px]">
                          <Mail size={18} /> {t('property.sections.sendEmail')}
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
=======
                {hasUnlocked || p.landlord_id === user?.id ? (
                  <div className="space-y-3">
                    <a href={`tel:${gatedData?.contact_phone || ''}`} className="flex items-center justify-center gap-2 w-full px-5 py-3.5 rounded-full bg-brand-500 text-white font-bold hover:bg-brand-600 transition-colors"><Phone size={18} /> {gatedData?.contact_phone || 'Call Now'}</a>
                    <a href={`mailto:${gatedData?.contact_email || ''}`} className="flex items-center justify-center gap-2 w-full px-5 py-3.5 rounded-full bg-white border border-gray-200 text-gray-900 font-bold shadow-sm"><Mail size={18} /> Send Email</a>
                  </div>
                ) : (
                  <div className="border border-gray-100 rounded-xl p-6 text-center bg-[#fcfbf9]">
                    <div className="w-12 h-12 bg-white border border-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400"><Phone size={20} /></div>
                    <p className="font-bold text-gray-900 mb-2">Details Locked</p>
                    <p className="text-[13px] text-gray-500">Unlock to see exact location and contact phone number.</p>
                  </div>
                )}
>>>>>>> Stashed changes
              </div>
<<<<<<< HEAD

              {((user && !(hasUnlocked || p.landlord_id === user.id)) || !user) && (
                <button 
                  id="unlock-button"
                  onClick={handleUnlock} 
                  disabled={unlocking}
                  className={`w-full bg-gray-900 text-white font-bold text-[15px] py-4 rounded-full hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-gray-900/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed ${pulseUnlock ? 'ring-4 ring-[#CA3433] bg-[#CA3433] scale-105 transition-all duration-300' : ''}`}
                >
                  {unlocking ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      {t('property.sections.processing')}
                    </span>
                  ) : (
                    <>
                      <Lock size={18} />
                      <span>{t('property.labels.pay')}</span>
                      <span className="bg-white/20 px-2 py-0.5 rounded-md text-[13px] font-black">₹9</span>
                      <span>{t('property.labels.toUnlock')}</span>
                    </>
                  )}
=======
              {!hasUnlocked && p.landlord_id !== user?.id && (
                <button onClick={handleUnlock} disabled={unlocking} className="w-full bg-gray-900 text-white font-bold py-4 rounded-full hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-70">
                  {unlocking ? 'Processing...' : 'Unlock for ₹9'}
>>>>>>> bugs-and-warnings
                </button>
              )}
            </div>
<<<<<<< Updated upstream

            {/* Listing Agent Card */}
            <div className="bg-white rounded-lg sm:rounded-xl p-6 sm:p-8 shadow-[0_2px_12px_rgb(0,0,0,0.03)] border border-gray-100/50">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight font-display">{t('property.sections.agent')}</h2>
              <div className="flex items-center gap-6">
                <img src={p.profiles?.avatar_url || p.landlord?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.profiles?.full_name || 'Owner')}`} alt="Agent" className="w-16 h-16 rounded-full object-cover bg-gray-100" />
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">{p.profiles?.full_name || p.landlord?.name} <CheckCircle2 size={16} className="text-green-500" /></h3>
                  <div className="flex flex-col text-sm text-gray-500 mt-1 gap-1">
                    {(hasUnlocked || p.landlord_id === user?.id) ? (
                      <>
                        <a href={`mailto:${gatedData?.contact_email || ''}`} className="hover:text-gray-900">{gatedData?.contact_email || t('property.sections.emailLocked')}</a>
                        <span className="hidden sm:inline">•</span>
                        <a href={`tel:${gatedData?.contact_phone || ''}`} className="hover:text-gray-900">{gatedData?.contact_phone || t('property.sections.phoneLocked')}</a>
                      </>
                    ) : (
                      <span>{t('property.sections.contactLocked')}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
=======
>>>>>>> Stashed changes
          </div>
        </div>

        {/* Ratings & Reviews Section - Bottom Content */}
        <div className="mt-8">
            <div className="bg-white rounded-lg sm:rounded-xl p-6 sm:p-8 shadow-[0_2px_12px_rgb(0,0,0,0.03)] border border-gray-100/50">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 tracking-tight font-display">{t('property.sections.reviews')}</h2>
                  <p className="text-sm text-gray-500 font-medium mt-1">{t('property.sections.authenticFeedback')}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black text-gray-900">{avgRating}</p>
                  <div className="flex justify-end gap-0.5 mt-1">
                    {[1,2,3,4,5].map(n => (
                      <Star key={n} size={12} className={n <= Math.round(avgRating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit Review Form */}
              {user && !myReview && (
                <div className="mb-10 p-6 rounded-2xl bg-[#F9F8F6] border border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-4">{t('property.sections.postReview')}</h4>
                  <div className="mb-4">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('property.sections.yourRating')}</p>
                    <StarRating value={reviewRating} onChange={setReviewRating} />
                  </div>
                  <div className="mb-4">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('property.sections.yourFeedback')}</p>
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder={t('property.sections.reviewPlaceholder')}
                      className="w-full bg-white rounded-xl border border-gray-200 p-4 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all min-h-[100px]"
                    />
                  </div>
                  <Button
                    variant="primary"
                    className="w-full sm:w-auto rounded-full px-8 bg-[#CA3433]"
                    disabled={submittingReview || !reviewRating || !reviewText.trim()}
                    onClick={async () => {
                      setSubmittingReview(true)
                      try {
                        await submitReview(p.id, reviewRating, reviewText)
                        setReviewRating(0)
                        setReviewText('')
                        toast.success(t('property.sections.reviewSuccess'))
                      } catch {
                        toast.error(t('property.sections.reviewError'))
                      } finally {
                        setSubmittingReview(false)
                      }
                    }}
                  >
                    {submittingReview ? t('property.sections.posting') : t('property.sections.postReview')}
                  </Button>
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-6 overflow-hidden">
                {reviews.length === 0 ? (
                  <div className="py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-gray-300">
                      <Star size={24} />
                    </div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{t('property.sections.noReviews')}</p>
                    <p className="text-[13px] text-gray-400">{t('property.sections.beTheFirst')}</p>
                  </div>
                ) : (
                  reviews.map(review => (
                    <div key={review.id} className="group pb-6 border-b border-gray-100 last:border-0 last:pb-0 overflow-hidden">
                      <div className="flex justify-between items-start mb-3 gap-2 flex-wrap">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={review.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.profiles?.full_name || 'User')}`}
                            alt="Reviewer"
                            className="w-10 h-10 rounded-full bg-gray-100 object-cover flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <h5 className="font-bold text-gray-900 text-[15px] flex items-center gap-1.5 truncate">
                              {review.profiles?.full_name || t('property.sections.anonymous')}
                              <CheckCircle2 size={12} className="text-brand-500" />
                            </h5>
                            <StarRating value={review.rating} readonly />
                          </div>
                        </div>
                        <div className="flex items-center gap-4 flex-shrink-0">
                          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                          {user && user.id === review.reviewer_id && (
                            <button
                              onClick={() => deleteReview(review.id)}
                              className="text-gray-300 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap pl-0 sm:pl-13 break-words">
                        {review.feedback}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
        </div>
      </div>
<<<<<<< Updated upstream

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

=======
>>>>>>> Stashed changes
    </div>
  )
}
