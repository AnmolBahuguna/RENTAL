import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  ArrowLeft, MapPin, Phone, Mail, Star, Clock,
  CheckCircle, AlertCircle, Lock, Send, Trash2,
  ChevronRight, Shield, IndianRupee, Calendar,
} from 'lucide-react'
import { useServices } from '../hooks/useServices'
import { Button } from '../components/ui/Button'
import { Skeleton } from '../components/ui/Skeleton'
import { openAuthModal } from '../store/authSlice'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'

const CATEGORY_CONFIG = {
  tiffin:   { label: 'Tiffin',   emoji: '🍱', color: 'bg-amber-100 text-amber-700', border: 'border-amber-200' },
  laundry:  { label: 'Laundry',  emoji: '🧺', color: 'bg-blue-100 text-blue-700',   border: 'border-blue-200' },
  cleaning: { label: 'Cleaning', emoji: '🧹', color: 'bg-green-100 text-green-700', border: 'border-green-200' },
}

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
const DAY_KEYS = ['mon','tue','wed','thu','fri','sat','sun']

const StarRating = ({ value, onChange, readonly = false }) => (
  <div className="flex gap-1">
    {[1,2,3,4,5].map(n => (
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

  // Check if current user has already reviewed
  const myReview = reviews.find(r => r.reviewer_id === user?.id)

  // Compute avg rating
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null

  const handleUnlockContact = () => {
    if (!user) {
      dispatch(openAuthModal('login'))
      return
    }
    // For now, show contact after login (payment integration same as properties can be added)
    setContactUnlocked(true)
    toast.success('Contact details unlocked!')
  }

  const handleSubmitReview = async () => {
    if (!user) {
      dispatch(openAuthModal('login'))
      return
    }
    if (reviewRating === 0) {
      toast.error('Please select a rating')
      return
    }
    if (!reviewText.trim()) {
      toast.error('Please write a short feedback')
      return
    }
    setSubmittingReview(true)
    try {
      await submitReview(id, reviewRating, reviewText.trim())
      setReviewRating(0)
      setReviewText('')
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
    } catch {
      toast.error('Could not delete review')
    }
  }

  if (loading) return (
    <div className="pt-8 pb-20 min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    </div>
  )

  if (!service) return (
    <div className="pt-20 text-center">
      <p className="text-gray-500">Service provider not found.</p>
      <Button variant="secondary" onClick={() => navigate('/nearby')} className="mt-4">
        Back to Services
      </Button>
    </div>
  )

  return (
    <div className="pt-6 pb-20 min-h-screen bg-gray-50/50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-5 transition-colors font-medium"
        >
          <ArrowLeft size={16} /> Back to Services
        </button>

        {/* ── Hero Card ─────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            {/* Category icon */}
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0 ${cat.color ? cat.color.replace('text-', 'bg-').replace('-700','-100') : 'bg-gray-100'} border ${cat.border || 'border-gray-200'}`}>
              {cat.emoji}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${cat.color}`}>
                  {cat.label}
                </span>
                {service.verification_status === 'verified' && (
                  <span className="flex items-center gap-1 text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full">
                    <CheckCircle size={11} /> Verified
                  </span>
                )}
                {service.verification_status === 'pending' && (
                  <span className="flex items-center gap-1 text-xs text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded-full">
                    <AlertCircle size={11} /> Verification Pending
                  </span>
                )}
              </div>

              <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-1.5 leading-tight">
                {service.name}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <MapPin size={13} />
                  {service.area}{service.city ? `, ${service.city}` : ''}{service.state ? ` · ${service.state}` : ''}
                </span>
                {avgRating && (
                  <span className="flex items-center gap-1 font-semibold text-amber-600">
                    <Star size={13} fill="currentColor" /> {avgRating} ({reviews.length})
                  </span>
                )}
              </div>
            </div>

            {/* Availability badge */}
            <div className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 ${service.is_open ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
              <span className={`w-2 h-2 rounded-full ${service.is_open ? 'bg-green-500' : 'bg-red-400'}`} />
              {service.is_open ? 'Currently Open' : 'Currently Closed'}
            </div>
          </div>
        </div>

        {/* ── About Provider ─────────────────────────────────── */}
        {(service.description || service.experience || service.speciality) && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
            <h2 className="text-base font-bold text-gray-900 mb-4">About the Provider</h2>
            {service.description && <p className="text-sm text-gray-600 leading-relaxed mb-3">{service.description}</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {service.experience && (
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-[10px] uppercase font-bold text-gray-400 mb-0.5">Experience</p>
                  <p className="text-sm font-semibold text-gray-800">{service.experience}</p>
                </div>
              )}
              {service.speciality && (
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-[10px] uppercase font-bold text-gray-400 mb-0.5">Speciality</p>
                  <p className="text-sm font-semibold text-gray-800">{service.speciality}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Services & Pricing ─────────────────────────────── */}
        {service.service_listings?.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
            <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <IndianRupee size={16} className="text-[#CA3433]" /> Services & Pricing
            </h2>
            <div className="divide-y divide-gray-50">
              {service.service_listings.map(item => (
                <div key={item.id} className="py-3 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{item.service_name}</p>
                    {item.description && <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-base font-bold text-[#CA3433]">₹{item.price?.toLocaleString()}</p>
                    {item.unit && <p className="text-xs text-gray-400">{item.unit}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Subscription Plans ─────────────────────────────── */}
        {service.service_plans?.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
            <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar size={16} className="text-[#CA3433]" /> Subscription Plans
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {service.service_plans.map(plan => (
                <div key={plan.id} className="border border-gray-100 rounded-xl p-4 hover:border-[#CA3433]/30 hover:bg-red-50/20 transition-all">
                  <p className="font-bold text-gray-900 mb-1">{plan.plan_name}</p>
                  <p className="text-xl font-extrabold text-[#CA3433] mb-1">₹{plan.price?.toLocaleString()}</p>
                  {plan.description && <p className="text-xs text-gray-500">{plan.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Availability Hours ─────────────────────────────── */}
        {service.working_hours && Object.keys(service.working_hours).length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
            <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock size={16} className="text-[#CA3433]" /> Working Hours
            </h2>
            <div className="divide-y divide-gray-50">
              {DAYS.map((day, i) => {
                const key = DAY_KEYS[i]
                const hours = service.working_hours[key]
                return (
                  <div key={day} className="flex items-center justify-between py-2.5 text-sm">
                    <span className="font-medium text-gray-700 w-28">{day}</span>
                    <span className={hours && hours !== 'Closed' ? 'text-green-600 font-semibold' : 'text-gray-400'}>
                      {hours || '—'}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Location ───────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
          <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
            <MapPin size={16} className="text-[#CA3433]" /> Location
          </h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {service.area && (
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 mb-0.5">Area</p>
                <p className="font-semibold text-gray-800">{service.area}</p>
              </div>
            )}
            {service.city && (
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 mb-0.5">City</p>
                <p className="font-semibold text-gray-800">{service.city}</p>
              </div>
            )}
            {service.state && (
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 mb-0.5">State</p>
                <p className="font-semibold text-gray-800">{service.state}</p>
              </div>
            )}
            {service.landmark && (
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 mb-0.5">Nearby Landmark</p>
                <p className="font-semibold text-gray-800">{service.landmark}</p>
              </div>
            )}
          </div>
          {service.address && (
            <p className="mt-3 text-sm text-gray-500 bg-gray-50 rounded-lg p-3">{service.address}</p>
          )}
        </div>

        {/* ── Contact Details (Locked) ───────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
          <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Phone size={16} className="text-[#CA3433]" /> Contact Details
          </h2>

          {contactUnlocked ? (
            <div className="grid sm:grid-cols-2 gap-3">
              {service.contact_phone && (
                <a
                  href={`tel:${service.contact_phone}`}
                  className="flex items-center gap-3 bg-green-50 rounded-xl px-4 py-3 hover:bg-green-100 transition-colors"
                >
                  <Phone size={18} className="text-green-600" />
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Phone</p>
                    <p className="font-bold text-gray-900">{service.contact_phone}</p>
                  </div>
                </a>
              )}
              {service.contact_email && (
                <a
                  href={`mailto:${service.contact_email}`}
                  className="flex items-center gap-3 bg-blue-50 rounded-xl px-4 py-3 hover:bg-blue-100 transition-colors"
                >
                  <Mail size={18} className="text-blue-600" />
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Email</p>
                    <p className="font-bold text-gray-900">{service.contact_email}</p>
                  </div>
                </a>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Lock size={22} className="text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 mb-4">
                {user ? 'Tap below to reveal contact details' : 'Login to access provider contact details'}
              </p>
              <Button
                variant="primary"
                className="bg-[#CA3433] hover:bg-[#ac2d2c] rounded-xl px-8"
                onClick={handleUnlockContact}
              >
                {user ? 'Show Contact' : 'Login to View'}
              </Button>
            </div>
          )}
        </div>

        {/* ── Reviews & Ratings ──────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Star size={16} className="text-amber-400 fill-amber-400" />
              Reviews {reviews.length > 0 && <span className="text-sm font-normal text-gray-400">({reviews.length})</span>}
            </h2>
            {avgRating && (
              <div className="text-right">
                <p className="text-2xl font-extrabold text-gray-900">{avgRating}</p>
                <div className="flex">
                  <StarRating value={Math.round(parseFloat(avgRating))} readonly />
                </div>
              </div>
            )}
          </div>

          {/* Submit / Edit Review */}
          {user && (profile?.role === 'user' || profile?.role === null) && (
            <div className="bg-gray-50 rounded-xl p-4 mb-5">
              <p className="text-sm font-semibold text-gray-700 mb-3">
                {myReview ? 'Update Your Review' : 'Write a Review'}
              </p>
              <div className="mb-3">
                <StarRating value={reviewRating || myReview?.rating || 0} onChange={setReviewRating} />
              </div>
              <textarea
                rows={3}
                placeholder="Share your experience with this service..."
                value={reviewText || (myReview?.feedback || '')}
                onChange={e => setReviewText(e.target.value)}
                className="w-full text-sm bg-white border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#CA3433] focus:ring-1 focus:ring-[#CA3433]/20 resize-none"
              />
              <div className="flex justify-end mt-2">
                <Button
                  variant="primary"
                  size="sm"
                  className="bg-[#CA3433] hover:bg-[#ac2d2c] rounded-lg gap-2"
                  loading={submittingReview}
                  onClick={handleSubmitReview}
                >
                  <Send size={13} />
                  {myReview ? 'Update Review' : 'Submit Review'}
                </Button>
              </div>
            </div>
          )}

          {!user && (
            <div className="bg-gray-50 rounded-xl p-4 mb-5 text-center">
              <p className="text-sm text-gray-500 mb-2">Login to leave a review</p>
              <Button size="sm" variant="secondary" onClick={() => dispatch(openAuthModal('login'))}>
                Sign In
              </Button>
            </div>
          )}

          {/* Reviews List */}
          {reviewsLoading ? (
            <div className="space-y-4">
              {[1,2,3].map(i => <Skeleton key={i} className="h-20 rounded-xl" />)}
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map(review => (
                <div key={review.id} className="border border-gray-100 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      {review.profiles?.avatar_url ? (
                        <img src={review.profiles.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                          {review.profiles?.full_name?.[0]?.toUpperCase() || 'U'}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-gray-900 leading-none">{review.profiles?.full_name || 'Anonymous'}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {new Date(review.created_at).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StarRating value={review.rating} readonly />
                      {user?.id === review.reviewer_id && (
                        <button
                          onClick={() => handleDeleteReview(review.id)}
                          className="text-gray-300 hover:text-red-400 transition-colors ml-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                  {review.feedback && (
                    <p className="text-sm text-gray-600 leading-relaxed">{review.feedback}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Star size={28} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No reviews yet — be the first!</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
