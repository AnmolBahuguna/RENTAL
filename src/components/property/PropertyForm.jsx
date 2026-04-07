import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, X, Image as ImageIcon } from 'lucide-react'
import { Input, Textarea, Select } from '../ui/Input'
import { Button } from '../ui/Button'
import { PROPERTY_TYPES, AMENITIES } from '../../utils/constants'
import { useProperties } from '../../hooks/useProperties'
import toast from 'react-hot-toast'

export const PropertyForm = ({ initialData, isEdit = false }) => {
  const navigate = useNavigate()
  const { createProperty, updateProperty } = useProperties()
  const [loading, setLoading] = useState(false)
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
    availability: initialData?.availability ?? true
  })

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length + previewUrls.length > 6) {
      toast.error('Maximum 6 images allowed')
      return
    }
    setImages(prev => [...prev, ...files])
    
    // Create preview URLs
    const newPreviews = files.map(f => URL.createObjectURL(f))
    setPreviewUrls(prev => [...prev, ...newPreviews])
  }

  const removeImage = (index) => {
    setPreviewUrls(prev => prev.filter((_, i) => i !== index))
    // We only remove from `images` if it's a new file (not from initialData)
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.price || !form.city || !form.area) {
      toast.error('Please fill all required fields')
      return
    }
    if (!isEdit && images.length === 0) {
      toast.error('At least one image is required')
      return
    }

    setLoading(true)
    try {
      if (isEdit) {
        // Need to pass existing images that weren't deleted
        const remainingExisting = previewUrls.filter(url => !url.startsWith('blob:'))
        await updateProperty(initialData.id, { ...form, images: remainingExisting }, images)
        toast.success('Property updated successfully!')
      } else {
        await createProperty(form, images)
        toast.success('Property listed successfully!')
      }
      navigate('/landlord')
    } catch (err) {
      toast.error(err.message || 'Failed to save property')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8 bg-white p-6 sm:p-10 rounded-3xl border border-gray-100 shadow-sm">
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900 border-b pb-2">Basic Details</h3>
        <Input
          label="Property Title *"
          placeholder="e.g. Modern 1BHK in Bandra"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          required
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Monthly Rent (₹) *"
            type="number"
            placeholder="e.g. 15000"
            value={form.price}
            onChange={e => setForm({ ...form, price: Number(e.target.value) })}
            required
          />
          <Select
            label="Property Type *"
            value={form.type}
            onChange={e => setForm({ ...form, type: e.target.value })}
          >
            {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </Select>
        </div>
        <Textarea
          label="Description"
          placeholder="Tell renters about your property..."
          rows={4}
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900 border-b pb-2">Location</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="City *"
            value={form.city}
            onChange={e => setForm({ ...form, city: e.target.value })}
            required
          >
            <option value="" disabled>Select a city</option>
            {['Dehradun', 'Srinagar', 'Rishikesh', 'Haldwani', 'Nainital', 'Haridwar', 'Roorkee', 'Rudrapur'].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Select>
          <Input
            label="Area/Locality *"
            placeholder="e.g. Hinjewadi"
            value={form.area}
            onChange={e => setForm({ ...form, area: e.target.value })}
            required
          />
          <Input
            label="Pincode"
            placeholder="e.g. 411057"
            value={form.pincode}
            onChange={e => setForm({ ...form, pincode: e.target.value })}
          />
        </div>
        <Input
          label="Nearby Landmarks"
          placeholder="e.g. 2km from Metro Station, Next to Mall"
          value={form.nearby_landmarks}
          onChange={e => setForm({ ...form, nearby_landmarks: e.target.value })}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900 border-b pb-2">Premium Contact Details <span className="text-sm text-brand-500 font-normal ml-2">(Locked for non-subscribers)</span></h3>
        <Input
          label="Exact Property Address"
          placeholder="e.g. Flat 402, Building B, XYZ Apartments..."
          value={form.exact_location}
          onChange={e => setForm({ ...form, exact_location: e.target.value })}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Owner Contact Phone"
            placeholder="e.g. +91 9876543210"
            value={form.contact_phone}
            onChange={e => setForm({ ...form, contact_phone: e.target.value })}
          />
          <Input
            label="Owner Contact Email"
            type="email"
            placeholder="e.g. owner@example.com"
            value={form.contact_email}
            onChange={e => setForm({ ...form, contact_email: e.target.value })}
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
                key={a.id}
                type="button"
                onClick={() => toggleAmenity(a.id)}
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
        <h3 className="text-xl font-bold text-gray-900 border-b pb-2">Photos (Max 6)</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {previewUrls.map((url, i) => (
            <div key={i} className="relative aspect-video rounded-xl overflow-hidden group">
              <img src={url} alt={`Preview ${i}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          {previewUrls.length < 6 && (
            <label className="aspect-video rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:border-brand-400 hover:bg-brand-50 transition-colors text-gray-500">
              <ImageIcon size={24} className="mb-2" />
              <span className="text-sm font-semibold">Add Photo</span>
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900 border-b pb-2">Status</h3>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
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
        <Button type="submit" variant="primary" size="lg" className="flex-1" loading={loading} disabled={loading}>
          {isEdit ? 'Save Changes' : 'List Property'}
        </Button>
      </div>
    </form>
  )
}
