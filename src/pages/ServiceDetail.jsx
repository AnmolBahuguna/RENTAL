import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  ArrowLeft, MapPin, Phone, Mail, Star, Clock,
  CheckCircle, Lock, Send, Trash2, IndianRupee,
  Calendar, Share2, Heart, ChevronDown, ChevronUp, CheckCircle2,
  X, AlertCircle, EyeOff, Briefcase, Award
} from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { useServices } from '../hooks/useServices'
import { Button } from '../components/ui/Button'
import { Skeleton } from '../components/ui/Skeleton'
import { openAuthModal } from '../store/authSlice'
import toast from 'react-hot-toast'

const CATEGORY_CONFIG = {
  tiffin: { label: 'Tiffin', emoji: '🍱', color: 'bg-amber-100 text-amber-700', border: 'border-amber-200' },
  laundry: { label: 'Laundry', emoji: '🧺', color: 'bg-blue-100 text-blue-700', border: 'border-blue-200' },
  cleaning: { label: 'Cleaning', emoji: '🧹', color: 'bg-green-100 text-green-700', border: 'border-green-200' },
}

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

export const ServiceDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user, profile } = useSelector(s => s.auth)

  const { currentService, reviews, reviewsLoading, fetchServiceById, fetchReviews, submitReview, deleteReview } = useServices()

  const [contactUnlocked, setContactUnlocked] = useState(false)
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)
  const [loading, setLoading] = useState(true)

  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [initialSlideIndex, setInitialSlideIndex] = useState(0)
  const [prevEl, setPrevEl] = useState(null)
  const [nextEl, setNextEl] = useState(null)
  const [galleryPrevEl, setGalleryPrevEl] = useState(null)
  const [galleryNextEl, setGalleryNextEl] = useState(null)
  const [showScrollToTop, setShowScrollToTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 800)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      await fetchServiceById(id)
      await fetchReviews(id)
      setLoading(false)
    }
    load()
  }, [id])

  const service = currentService
  const cat = service ? (CATEGORY_CONFIG[service.category] || {}) : {}
  const images = service?.images || []
  const mainImage = images[0] || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%239ca3af'%3ENo Image Available%3C/text%3E%3C/svg%3E"

  // Check if current user has already reviewed
  const myReview = reviews.find(r => r.reviewer_id === user?.id)

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : (4.5 + (service?.id?.charCodeAt(0) % 5 / 10)).toFixed(1) // Deterministic fallback

  const handleUnlockContact = () => {
    if (!user) {
      dispatch(openAuthModal('login'))
      return
    }
    setContactUnlocked(true)
    toast.success('Contact info revealed!')
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Link copied to clipboard!')
  }

  const handleSubmitReview = async () => {
    if (!user) { dispatch(openAuthModal('login')); return }
    if (reviewRating === 0) { toast.error('Please select a rating'); return }
    if (!reviewText.trim()) { toast.error('Please write some feedback'); return }

    setSubmittingReview(true)
    try {
      await submitReview(id, reviewRating, reviewText.trim())
      setReviewRating(0); setReviewText('')
      toast.success(myReview ? 'Review updated!' : 'Review submitted!')
    } catch (err) {
      toast.error(err.message || 'Could not submit review')
    } finally {
      setSubmittingReview(false)
    }
  }

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview(reviewId)
      toast.success('Review deleted')
    } catch { toast.error('Could not delete review') }
  }

  const openGallery = (index) => {
    setInitialSlideIndex(index)
    setIsGalleryOpen(true)
  }

  const renderSlider = () => (
    <div className="relative w-full aspect-square md:aspect-[4/3] bg-gray-100 rounded-xl sm:rounded-2xl overflow-hidden shadow-md group border border-gray-200/50">
      <Swiper
        key={service?.id}
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={{ prevEl, nextEl }}
        pagination={{ clickable: true, dynamicBullets: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        className="w-full h-full"
      >
        {images.length > 0 ? images.map((img, i) => (
          <SwiperSlide key={i}>
            <div className="w-full h-full cursor-pointer flex items-center justify-center bg-gray-100" onClick={() => openGallery(i)}>
              <img src={img} alt={`${service?.name} - View ${i + 1}`} className="w-full h-full object-cover" />
            </div>
          </SwiperSlide>
        )) : (
          <SwiperSlide>
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-300">
              <span className="text-8xl opacity-30">{cat.emoji}</span>
            </div>
          </SwiperSlide>
        )}
      </Swiper>

      {images.length > 1 && (
        <>
          <button ref={setPrevEl} className="absolute left-1 top-1/2 -translate-y-1/2 z-20 p-2 cursor-pointer active:scale-95 transition-all outline-none border-none bg-transparent text-white">
            <img src="/swipe-left.svg" alt="Previous" className="w-12 h-12 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
          </button>
          <button ref={setNextEl} className="absolute right-1 top-1/2 -translate-y-1/2 z-20 p-2 cursor-pointer active:scale-95 transition-all outline-none border-none bg-transparent text-white">
            <img src="/swipe-right.svg" alt="Next" className="w-12 h-12 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
          </button>
        </>
      )}

      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <button className="bg-white/90 backdrop-blur-sm border-0 rounded-full w-10 h-10 flex items-center justify-center hover:bg-white text-gray-900 transition-colors shadow-sm" onClick={handleShare}>
          <Share2 size={18} />
        </button>
      </div>
    </div>
  )

  if (loading) return (
    <div className="pt-8 pb-20 bg-[#F9F8F6] min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <Skeleton className="h-6 w-24 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 h-[400px] sm:h-[550px]">
          <Skeleton className="md:col-span-2 md:row-span-2 rounded-xl h-full" />
          <Skeleton className="hidden md:block col-span-1 row-span-1 rounded-xl h-full" />
          <Skeleton className="hidden md:block col-span-1 row-span-1 rounded-xl h-full" />
          <Skeleton className="hidden md:block col-span-1 row-span-1 rounded-xl h-full" />
          <Skeleton className="hidden md:block col-span-1 row-span-1 rounded-xl h-full" />
        </div>
      </div>
    </div>
  )

  if (!service) return null

  return (
    <div className="pt-8 pb-20 bg-[#F9F8F6] min-h-screen">
      <div className="w-full px-4 sm:px-10 md:px-16 lg:px-20">

        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 mb-6 transition-colors">
          <ArrowLeft size={16} /> Back to Services
        </button>

        {/* MOBILE SLIDER */}
        <div className="block lg:hidden w-full mb-6">
          {renderSlider()}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start lg:mt-6">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">

            {/* Header Card */}
            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-[0_2px_12px_rgb(0,0,0,0.03)] border border-gray-100/50">
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col gap-1">
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight font-display">
                    {service.name}
                  </h1>
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-500">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${cat.color} ${cat.border} border`}>
                      {cat.emoji} {cat.label}
                    </span>
                    <span>{service.area}, {service.city}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-6 pt-6 border-t border-gray-50">
                <div className="flex items-center gap-1.5">
                  <div className="flex">
                    <StarRating value={Math.round(parseFloat(avgRating))} readonly />
                  </div>
                  <span className="font-black text-sm text-gray-900">{avgRating}</span>
                  <span className="text-gray-400 text-xs">({reviews.length} reviews)</span>
                </div>
                {service.verification_status === 'verified' && (
                  <span className="flex items-center gap-1 text-xs text-green-600 font-bold bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
                    <CheckCircle2 size={14} /> Verified Provider
                  </span>
                )}
              </div>
            </div>

            {/* About & Provider Info (Combined) */}
            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-[0_2px_12px_rgb(0,0,0,0.03)] border border-gray-100/50">
              <h2 className="text-xl font-bold text-gray-900 mb-6 font-display">About Provider</h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-8">
                {service.description || "Premium service provider committed to quality and reliability in the GoEazy marketplace."}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#CA3433] shadow-sm border border-red-50">
                    <Briefcase size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Experience</p>
                    <p className="text-sm font-bold text-gray-900">{service.experience || 'Experienced Provider'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#CA3433] shadow-sm border border-red-50">
                    <Award size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Speciality</p>
                    <p className="text-sm font-bold text-gray-900">{service.speciality || 'General Services'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Service & Pricing Box */}
            {service.service_listings?.length > 0 && (
              <div className="bg-white rounded-xl p-6 sm:p-8 shadow-[0_2px_12px_rgb(0,0,0,0.03)] border border-gray-100/50">
                <h2 className="text-xl font-bold text-gray-900 mb-6 font-display">Services & Pricing</h2>
                <div className="space-y-4">
                  {service.service_listings?.map(item => (
                    <div key={item.id} className="flex justify-between items-center p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-brand-200 transition-colors">
                      <div>
                        <p className="font-bold text-gray-900">{item.service_name}</p>
                        {item.description && <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>}
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-[#CA3433]">₹{item.price?.toLocaleString()}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">{item.unit}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Subscription Plans Box */}
            {service.service_plans?.length > 0 && (
              <div className="bg-white rounded-xl p-6 sm:p-8 shadow-[0_2px_12px_rgb(0,0,0,0.03)] border border-gray-100/50">
                <h2 className="text-xl font-bold text-gray-900 mb-6 font-display">Subscription Plans</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {service.service_plans.map(plan => (
                    <div key={plan.id} className="p-5 rounded-xl border border-gray-100 bg-white hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-bold text-gray-900">{plan.plan_name}</p>
                        <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-[#CA3433]">
                          <IndianRupee size={16} />
                        </div>
                      </div>
                      <p className="text-2xl font-black text-[#CA3433]">₹{plan.price?.toLocaleString()}</p>
                      {plan.description && <p className="text-xs text-gray-500 mt-2 line-clamp-2">{plan.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">

            {/* DESKTOP SLIDER */}
            <div className="hidden lg:block w-full">
              {renderSlider()}
            </div>

            {/* CONTACT SIDEBAR (NO WORKING HOURS) */}
            <div id="contact-section" className="bg-white rounded-xl p-6 sm:p-8 shadow-[0_2px_24px_rgb(0,0,0,0.04)] border border-gray-100/50 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6 font-display">Provider Contact</h3>

              <div className="space-y-4 mb-8">
                <div className="p-4 bg-[#F9F8F6] rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-400 font-bold mb-1 uppercase tracking-widest leading-none">Business Owner</p>
                  <p className="font-bold text-gray-900 text-base">{service.profiles?.full_name || service.name}</p>
                </div>
              </div>

              <div className="mb-8 pt-6 border-t border-gray-50">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Location Detail</h4>
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="text-gray-400 mt-1 shrink-0" />
                  <p className="text-xs text-gray-600 font-medium leading-relaxed">
                    {service.address || `${service.area}, ${service.city}, ${service.state}`}
                    {service.landmark && <span className="block mt-1 text-gray-400">Near {service.landmark}</span>}
                  </p>
                </div>
              </div>

              {/* CONTACT SECTION AT BOTTOM */}
              <div className="pt-6 border-t border-gray-50">
                {!contactUnlocked ? (
                  <div className="space-y-4">
                    <div className="border border-[#CA3433]/20 rounded-xl p-6 text-center bg-red-50/10 relative overflow-hidden h-40 flex flex-col items-center justify-center">
                      <div className="absolute inset-0 backdrop-blur-[10px]" />
                      <div className="relative z-10">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-red-50 text-[#CA3433]">
                          <EyeOff size={24} />
                        </div>
                        <p className="font-black text-gray-900 text-sm uppercase tracking-widest">Locked</p>
                      </div>
                    </div>
                    <button
                      onClick={handleUnlockContact}
                      className="w-full bg-gray-900 text-white font-bold py-4 rounded-full hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg active:scale-98"
                    >
                      {user ? 'Pay ₹9 to Unlock Contact' : 'Login to View Contact'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {service.contact_phone && (
                      <a href={`tel:${service.contact_phone}`} className="flex items-center justify-center gap-2 w-full py-4 rounded-full bg-brand-500 text-white font-bold hover:bg-brand-600 transition-all shadow-md active:scale-95">
                        <Phone size={18} /> {service.contact_phone}
                      </a>
                    )}
                    {service.contact_email && (
                      <a href={`mailto:${service.contact_email}`} className="flex items-center justify-center gap-2 w-full py-4 rounded-full bg-white border border-gray-200 text-gray-900 font-bold hover:bg-gray-50 transition-all shadow-sm active:scale-95">
                        <Mail size={18} /> Send Email
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews (Moved to Bottom for Mobile Parity) */}
        <div className="mt-8 lg:mt-12 bg-white rounded-xl p-6 sm:p-8 shadow-[0_2px_12px_rgb(0,0,0,0.03)] border border-gray-100/50">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 font-display">Customer Reviews</h2>

          {/* Post Review */}
          {user && (profile?.role === 'user' || !profile?.role) && (
            <div className="mb-8 p-6 bg-[#F9F8F6] rounded-2xl border border-gray-100">
              <p className="font-bold text-gray-900 mb-4">{myReview ? 'Update Your Feedback' : 'Share Your Experience'}</p>
              <div className="mb-4">
                <StarRating value={reviewRating || myReview?.rating || 0} onChange={setReviewRating} />
              </div>
              <textarea
                className="w-full bg-white border border-gray-100 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#CA3433]/10 resize-none"
                rows={3}
                placeholder="Tell others what you think..."
                value={reviewText}
                onChange={e => setReviewText(e.target.value)}
              />
              <div className="flex justify-end mt-3">
                <Button size="sm" className="bg-[#CA3433] hover:bg-[#ac2d2c] rounded-full gap-2 px-6" loading={submittingReview} onClick={handleSubmitReview}>
                  <Send size={14} /> {myReview ? 'Update' : 'Post Review'}
                </Button>
              </div>
            </div>
          )}

          {/* Reviews List / Slider */}
          <div className="space-y-6">
            {reviews.length > 0 ? (
              reviews.length > 1 ? (
                <Swiper
                  modules={[Autoplay, Pagination]}
                  spaceBetween={30}
                  slidesPerView={1}
                  autoplay={{ delay: 3000, disableOnInteraction: false }}
                  loop={true}
                  pagination={{ clickable: true }}
                  className="w-full pb-10"
                >
                  {reviews.map(r => (
                    <SwiperSlide key={r.id}>
                      <div className="pb-6">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600">
                              {r.profiles?.full_name?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 text-sm">{r.profiles?.full_name || 'Anonymous User'}</p>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{new Date(r.created_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <StarRating value={r.rating} readonly />
                            {user?.id === r.reviewer_id && (
                              <button onClick={() => handleDeleteReview(r.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed pl-[52px]">
                          {r.feedback}
                        </p>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                reviews.map(r => (
                  <div key={r.id} className="pb-6 border-b border-gray-50 last:border-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600">
                          {r.profiles?.full_name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{r.profiles?.full_name || 'Anonymous User'}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{new Date(r.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <StarRating value={r.rating} readonly />
                        {user?.id === r.reviewer_id && (
                          <button onClick={() => handleDeleteReview(r.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed pl-[52px]">
                      {r.feedback}
                    </p>
                  </div>
                ))
              )
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-400 text-sm">No reviews yet. Be the first to share your experience!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Gallery Modal */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md">
          <button onClick={() => setIsGalleryOpen(false)} className="absolute top-6 right-6 z-50 w-12 h-12 bg-white/10 hover:bg-white/25 text-white rounded-full flex items-center justify-center transition-all">
            <X size={24} />
          </button>
          <div className="w-full h-full sm:h-[90%] max-w-6xl mx-auto flex items-center justify-center">
            <Swiper
              key={`gallery-${service.id}`}
              modules={[Navigation, Pagination]}
              initialSlide={initialSlideIndex}
              spaceBetween={20}
              slidesPerView={1}
              navigation={{ prevEl: galleryPrevEl, nextEl: galleryNextEl }}
              pagination={{ type: 'fraction', el: '.gallery-pagination' }}
              className="w-full h-full"
            >
              {images.map((img, i) => (
                <SwiperSlide key={i}>
                  <div className="w-full h-full flex items-center justify-center p-4">
                    <img src={img} alt={`Gallery view ${i + 1}`} className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" />
                  </div>
                </SwiperSlide>
              ))}
              <button ref={setGalleryPrevEl} className="absolute left-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center transition-all">
                <img src="/swipe-left.svg" alt="Prev" className="w-8 h-8 brightness-0 invert" />
              </button>
              <button ref={setGalleryNextEl} className="absolute right-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center transition-all">
                <img src="/swipe-right.svg" alt="Next" className="w-8 h-8 brightness-0 invert" />
              </button>
              <div className="gallery-pagination absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-white bg-black/50 px-4 py-1.5 rounded-full font-semibold text-sm backdrop-blur-md"></div>
            </Swiper>
          </div>
        </div>
      )}

      <div className="fixed bottom-6 right-4 sm:hidden z-40">
        <button
          onClick={() => {
            if (showScrollToTop) {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              const section = document.getElementById('contact-section');
              if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}
          className="flex flex-col items-center justify-center p-2.5 bg-gray-900 text-white rounded-xl shadow-lg border border-gray-800 active:scale-95 transition-transform"
        >
          {showScrollToTop ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

    </div>
  )
}
