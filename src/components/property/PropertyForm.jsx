import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, X, Image as ImageIcon, Zap } from 'lucide-react'
import { Input, Textarea, Select } from '../ui/Input'
import { Button } from '../ui/Button'
import { PROPERTY_TYPES, AMENITIES } from '../../utils/constants'
import { useProperties } from '../../hooks/useProperties'
import { useSelector } from 'react-redux'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import { LocationPicker } from '../map/LocationPicker'

// ── Persian Red Success Animation ────────────────────────────────────────────
const ListingSuccessOverlay = () => (
  <div className="fixed inset-0 z-[99] flex flex-col items-center justify-center bg-white/95 backdrop-blur-md animate-in fade-in duration-300">
    <div className="relative flex flex-col items-center gap-6">
      {/* Animated ring */}
      <div className="relative w-36 h-36">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Background circle */}
          <circle cx="50" cy="50" r="46" fill="none" stroke="#fce8e8" strokeWidth="4" />
          {/* Animated stroke circle */}
          <circle
            cx="50" cy="50" r="46"
            fill="none"
            stroke="#CA3433"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="289"
            strokeDashoffset="289"
            style={{
              animation: 'drawCircle 0.5s ease-out forwards',
              transformOrigin: 'center',
              transform: 'rotate(-90deg)',
            }}
          />
          {/* Animated checkmark */}
          <polyline
            points="28,52 44,66 72,36"
            fill="none"
            stroke="#CA3433"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="70"
            strokeDashoffset="70"
            style={{ animation: 'drawTick 0.4s ease-out 0.45s forwards' }}
          />
        </svg>
        {/* Pulse ring */}
        <div
          className="absolute inset-0 rounded-full border-4 border-[#CA3433]/20"
          style={{ animation: 'pulseRing 1s ease-out 0.6s infinite' }}
        />
      </div>

      <div className="text-center" style={{ animation: 'fadeInUp 0.5s ease-out 0.8s both' }}>
        <h2 className="text-3xl font-black text-gray-900 font-display mb-2">Listing Live! 🎉</h2>
        <p className="text-gray-500 font-medium">Your property is now visible to renters across Uttarakhand.</p>
      </div>
    </div>

    <style>{`
      @keyframes drawCircle {
        to { stroke-dashoffset: 0; }
      }
      @keyframes drawTick {
        to { stroke-dashoffset: 0; }
      }
      @keyframes pulseRing {
        0%   { transform: scale(1); opacity: 0.6; }
        100% { transform: scale(1.5); opacity: 0; }
      }
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(12px); }
        to   { opacity: 1; transform: translateY(0); }
      }
    `}</style>
  </div>
)

// ── Main Form ─────────────────────────────────────────────────────────────────
export const PropertyForm = ({ initialData, isEdit = false }) => {
  const navigate = useNavigate()
  const { updateProperty } = useProperties()
  const { user } = useSelector(s => s.auth)
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [images, setImages] = useState([])
  const [previewUrls, setPreviewUrls] = useState(initialData?.images || [])
  
  const [form, setForm] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    price: initialData?.price || '',
    city: initialData?.city || '',
    area: initialData?.area || '',
    pincode: initialData?.pincode || '',
    type: initialData?.type || PROPERTY_TYPES[0],
    amenities: initialData?.amenities || [],
    nearby_landmarks: initialData?.nearby_landmarks || '',
    exact_location: initialData?.exact_location || '',
    contact_phone: initialData?.contact_phone || '',
    contact_email: initialData?.contact_email || '',
    availability: initialData?.availability ?? true,
    latitude: initialData?.latitude || null,
    longitude: initialData?.longitude || null,
    map_address: initialData?.map_address || '',
  })

  const handleLocationChange = ({ latitude, longitude, map_address }) => {
    setForm(f => ({ ...f, latitude, longitude, map_address: map_address || '' }))
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length + previewUrls.length > 4) {
      toast.error('Maximum 4 images allowed')
      return
    }
    setImages(prev => [...prev, ...files])
    const newPreviews = files.map(f => URL.createObjectURL(f))
    setPreviewUrls(prev => [...prev, ...newPreviews])
  }

  const removeImage = (index) => {
    setPreviewUrls(prev => prev.filter((_, i) => i !== index))
    if (index >= (initialData?.images?.length || 0)) {
      const idxInFiles = index - (initialData?.images?.length || 0)
      setImages(prev => prev.filter((_, i) => i !== idxInFiles))
    }
  }

  const toggleAmenity = (id) => {
    setForm(f => ({
      ...f,
      amenities: f.amenities.includes(id)
        ? f.amenities.filter(a => a !== id)
        : [...f.amenities, id]
    }))
  }

  // ── Validation (shared) ───────────────────────────────────────────────────
  const validateForm = () => {
    if (!form.title || !form.price || !form.city || !form.area) {
      toast.error('Please fill all required fields')
      return false
    }
    if (previewUrls.length !== 4) {
      toast.error('Exactly 4 images are required')
      return false
    }
    return true
  }

  // ── Edit Mode: direct save ─────────────────────────────────────────────────
  const handleEditSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)
    try {
      const remainingExisting = previewUrls.filter(url => !url.startsWith('blob:'))
      await updateProperty(initialData.id, { ...form, images: remainingExisting }, images)
      toast.success('Property updated successfully!')
      navigate('/landlord')
    } catch (err) {
      toast.error(err.message || 'Failed to save property')
    } finally {
      setLoading(false)
    }
  }

  // ── New Listing: Pay to Go Live ────────────────────────────────────────────
  const handlePayToGoLive = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    if (loading) return
    setLoading(true)

    try {
      // 1. Get fresh session token FIRST before anything else
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token

      if (!token) {
        toast.error('Session expired — please log in again')
        setLoading(false)
        return
      }


      const uploadedUrls = []
      for (const file of images) {
        const ext = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${ext}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('property-images')
          .upload(`${session.user.id}/${fileName}`, file, { upsert: false })

        if (uploadError) throw new Error('Image upload failed: ' + uploadError.message)

        const { data: { publicUrl } } = supabase.storage
          .from('property-images')
          .getPublicUrl(uploadData.path)

        uploadedUrls.push(publicUrl)
      }

      if (uploadedUrls.length !== 4) throw new Error('Image upload incomplete')

      // 2. Load Razorpay SDK first
      const loadRazorpay = () => new Promise((resolve) => {
        if (window.Razorpay) return resolve(true)
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.onload = () => resolve(true)
        script.onerror = () => resolve(false)
        document.body.appendChild(script)
      })

      const scriptLoaded = await loadRazorpay()
      if (!scriptLoaded) throw new Error('Razorpay SDK failed to load')

      // 3. Create Razorpay order via Edge Function
      const orderResp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-listing-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
        }
      })

      if (!orderResp.ok) {
        const errText = await orderResp.text()
        console.error('[PayToGoLive] Order creation failed:', orderResp.status, errText)
        let errJson = {}
        try { errJson = JSON.parse(errText) } catch(e) {}
        const fullMsg = [errJson.error, errJson.detail, `HTTP ${orderResp.status}`].filter(Boolean).join(' | ')
        toast.error(fullMsg, { duration: 8000 })
        throw new Error(fullMsg)
      }

      const orderData = await orderResp.json()

      // 4. Open Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        order_id: orderData.id,
        currency: 'INR',
        name: 'GoEazy',
        description: 'List Your Property — Go Live',
        image: '/favicon.svg',
        handler: async function(response) {
          try {
            setLoading(true)
            // Refresh token
            const { data: { session: freshSession } } = await supabase.auth.getSession()
            const freshToken = freshSession?.access_token

            // 5. Verify payment and create listing server-side
            const verifyResp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-listing-payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${freshToken}`,
                'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                property_data: { ...form, images: uploadedUrls }
              })
            })

            if (!verifyResp.ok) {
              const vErr = await verifyResp.json().catch(() => ({}))
              throw new Error(vErr.error || 'Payment verification failed')
            }

            // 6. Show success animation then navigate
            setShowSuccess(true)
            setTimeout(() => navigate('/landlord'), 2800)

          } catch (vErr) {
            console.error('Verification error:', vErr)
            toast.error('Payment verification failed: ' + vErr.message)
          } finally {
            setLoading(false)
          }
        },
        prefill: {
          name: user?.user_metadata?.full_name || 'Landlord',
          email: user?.email || '',
        },
        theme: { color: '#CA3433' },
        modal: {
          ondismiss: () => setLoading(false)
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', (resp) => {
        const desc = resp.error?.description || 'Payment could not be completed'
        toast.error('Payment failed: ' + desc)
        setLoading(false)
      })
      rzp.open()

    } catch (err) {
      console.error('Pay to Go Live error:', err)
      toast.error(err.message || 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <>
      {showSuccess && <ListingSuccessOverlay />}

      <form
        onSubmit={isEdit ? handleEditSubmit : (e) => e.preventDefault()}
        className="max-w-4xl mx-auto space-y-8 bg-white p-6 sm:p-10 rounded-3xl border border-gray-100 shadow-sm"
      >
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900 border-b pb-2">Basic Details</h3>
          <Input
            id="property-title" name="title" label="Property Title *"
            placeholder="e.g. Modern 1BHK in Bandra"
            value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              id="property-price" name="price" label="Monthly Rent (₹) *" type="number"
              placeholder="e.g. 15000"
              value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} required
            />
            <Select
              id="property-type" name="type" label="Property Type *"
              value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
            >
              {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </Select>
          </div>
          <Textarea
            id="property-description" name="description" label="Description"
            placeholder="Tell renters about your property..."
            rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900 border-b pb-2">Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              id="property-city" name="city" label="City *"
              value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} required
            >
              <option value="" disabled>Select a city</option>
              {['Dehradun', 'Srinagar', 'Rishikesh', 'Haldwani', 'Nainital', 'Haridwar', 'Roorkee', 'Rudrapur'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
            <Input
              id="property-area" name="area" label="Area/Locality *"
              placeholder="e.g. Hinjewadi"
              value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} required
            />
            <Input
              id="property-pincode" name="pincode" label="Pincode"
              placeholder="e.g. 411057"
              value={form.pincode} onChange={e => setForm({ ...form, pincode: e.target.value })}
            />
          </div>
          <Input
            id="property-landmarks" name="nearby_landmarks" label="Nearby Landmarks"
            placeholder="e.g. 2km from Metro Station, Next to Mall"
            value={form.nearby_landmarks} onChange={e => setForm({ ...form, nearby_landmarks: e.target.value })}
          />

          {/* Map Pin Section */}
          <div className="border border-gray-100 rounded-2xl p-4 bg-gray-50/50">
            <LocationPicker
              value={{ latitude: form.latitude, longitude: form.longitude, map_address: form.map_address }}
              onChange={handleLocationChange}
              label="Pin Property on Map"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900 border-b pb-2">
            Premium Contact Details <span className="text-sm text-brand-500 font-normal ml-2">(Locked for non-subscribers)</span>
          </h3>
          <Input
            id="property-address" name="exact_location" label="Exact Property Address"
            placeholder="e.g. Flat 402, Building B, XYZ Apartments..."
            value={form.exact_location} onChange={e => setForm({ ...form, exact_location: e.target.value })}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              id="property-phone" name="contact_phone" label="Owner Contact Phone"
              placeholder="e.g. +91 9876543210"
              value={form.contact_phone} onChange={e => setForm({ ...form, contact_phone: e.target.value })}
            />
            <Input
              id="property-email" name="contact_email" label="Owner Contact Email" type="email"
              placeholder="e.g. owner@example.com"
              value={form.contact_email} onChange={e => setForm({ ...form, contact_email: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900 border-b pb-2">Amenities</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 md:grid-cols-5 gap-3">
            {AMENITIES.map(a => {
              const isActive = form.amenities.includes(a.id)
              return (
                <button
                  key={a.id} type="button" onClick={() => toggleAmenity(a.id)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                    isActive ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-gray-100 bg-white text-gray-500 hover:border-brand-200'
                  }`}
                >
                  <span className="text-2xl">{a.icon}</span>
                  <span className="text-xs font-semibold">{a.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900 border-b pb-2">Photos (Exactly 4)</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {previewUrls.map((url, i) => (
              <div key={i} className="relative aspect-video rounded-xl overflow-hidden group">
                <img src={url} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                <button
                  type="button" onClick={() => removeImage(i)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            {previewUrls.length < 4 && (
              <label className="aspect-video rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:border-brand-400 hover:bg-brand-50 transition-colors text-gray-500">
                <ImageIcon size={24} className="mb-2" />
                <span className="text-sm font-semibold">Add Photo</span>
                <input id="property-images" name="images" type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900 border-b pb-2">Status</h3>
          <label htmlFor="property-availability" className="flex items-center gap-3 cursor-pointer">
            <input
              id="property-availability" name="availability" type="checkbox"
              className="w-5 h-5 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
              checked={form.availability}
              onChange={e => setForm({ ...form, availability: e.target.checked })}
            />
            <span className="text-sm font-semibold text-gray-900">Available to rent</span>
          </label>
        </div>

        <div className="flex gap-4 pt-6">
          <Button type="button" variant="secondary" size="lg" className="flex-1" onClick={() => navigate(-1)} disabled={loading}>
            Cancel
          </Button>

          {isEdit ? (
            <Button type="submit" variant="primary" size="lg" className="flex-1" loading={loading} disabled={loading}>
              Save Changes
            </Button>
          ) : (
            <button
              type="button"
              onClick={handlePayToGoLive}
              disabled={loading}
              className="flex-1 relative overflow-hidden flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#CA3433] to-[#E63946] text-white font-extrabold text-base shadow-xl shadow-red-500/30 hover:shadow-red-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100 group"
            >
              {/* Shine effect */}
              <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Processing...
                </span>
              ) : (
                <>
                  <Zap size={20} className="shrink-0" />
                  <span>PAY to Go Live</span>
                  <span className="ml-1 bg-white/20 px-2 py-0.5 rounded-lg text-sm font-black">₹199</span>
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </>
  )
}
