import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Home, Eye, Edit, Trash2 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useProperties } from '../hooks/useProperties'
import { Button } from '../components/ui/Button'
import { TypeBadge } from '../components/ui/Badge'
import { formatPriceShort, cn } from '../utils/helpers'
import toast from 'react-hot-toast'
import { Skeleton } from '../components/ui/Skeleton'

export const LandlordDashboard = () => {
  const { user, profile } = useAuth()
  const { getLandlordProperties, deleteProperty } = useProperties()
  const navigate = useNavigate()
  
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadProperties()
    }
  }, [user])

  const loadProperties = async () => {
    try {
      if (user) console.log('[LandlordDashboard] Fetching properties for user:', user.id)
      const data = await getLandlordProperties()
      setProperties(data)
    } catch (err) {
      console.error('[LandlordDashboard] Failed to load properties:', err)
      toast.error('Failed to load listings')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return
    
    const toastId = toast.loading('Deleting property...')
    try {
      await deleteProperty(id)
      setProperties(prev => prev.filter(p => p.id !== id))
      toast.success('Property deleted permanently', { id: toastId })
    } catch (err) {
      console.error('Delete failed:', err)
      toast.error(err.message || 'Failed to delete property', { id: toastId })
    }
  }

  const totalListings = properties.length
  const totalViews = properties.reduce((sum, p) => sum + (p.views || 0), 0)

  return (
    <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#ffc9c9] bg-gray-200">
               {profile ? (
                 <img src={profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} alt="Avatar" className="w-full h-full object-cover"/>
               ) : (
                 <Skeleton variant="circle" className="w-full h-full" />
               )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-display">
                {profile ? `Welcome, ${profile?.full_name?.split(' ')[0] || 'Landlord'}!` : <Skeleton className="h-8 w-40" />}
              </h1>
              <p className="text-gray-500">Manage your properties and track views.</p>
            </div>
          </div>
          <Button onClick={() => navigate('/landlord/properties/new')} variant="primary" leftIcon={<Plus size={18} />}>
            New Listing
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-5">
            <div className="w-14 h-14 rounded-xl bg-[#fff5f5] flex items-center justify-center text-[#CA3433]">
              <Home size={24} />
            </div>
            <div className="flex-1">
              <p className="text-gray-500 text-sm font-medium">Total Listings</p>
              {loading ? <Skeleton className="h-8 w-12 mt-1" /> : <h3 className="text-3xl font-bold text-gray-900">{totalListings}</h3>}
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-5">
            <div className="w-14 h-14 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
              <Eye size={24} />
            </div>
            <div className="flex-1">
              <p className="text-gray-500 text-sm font-medium">Total Profile Views</p>
              {loading ? <Skeleton className="h-8 w-12 mt-1" /> : <h3 className="text-3xl font-bold text-gray-900">{totalViews}</h3>}
            </div>
          </div>
        </div>

        {/* Listings Table or Grid */}
        <h2 className="text-xl font-bold text-gray-900 mb-6 font-display">Your Listings</h2>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 space-y-4 shadow-sm">
                <Skeleton className="aspect-video w-full rounded-xl" />
                <div className="space-y-3 px-1">
                  <div className="flex justify-between">
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-5 w-1/4" />
                  </div>
                  <Skeleton className="h-4 w-3/4" />
                  <div className="pt-2 flex gap-2">
                    <Skeleton className="h-8 flex-1 rounded-xl" />
                    <Skeleton className="h-8 flex-1 rounded-xl" />
                    <Skeleton className="h-8 w-10 rounded-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
            <div className="flex justify-center mb-4 text-gray-300">
              <Home size={64} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No listings yet</h3>
            <p className="text-gray-500 max-w-sm mx-auto mb-6">
              Start adding your properties to reach thousands of potential renters.
            </p>
            <Button onClick={() => navigate('/landlord/properties/new')}>List Your First Property</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map(p => (
              <div key={p.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.1)] hover:shadow-[0_0_30px_rgba(0,0,0,0.15)] transition-shadow">
                <div className="relative w-full aspect-square bg-gray-50 border-b border-gray-100 overflow-hidden">
                  <img src={p.images?.[0] || ''} alt={p.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3"><TypeBadge type={p.type} /></div>
                  <div className={cn('absolute top-3 right-3 px-2 py-1 text-xs font-bold rounded-full shadow-sm', p.availability ? 'bg-green-100 text-green-700' : 'bg-[#fff1f1] text-[#CA3433]')}>
                    {p.availability ? 'Available' : 'Rented'}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900 truncate pr-2">{p.title}</h3>
                    <span className="font-bold text-[#CA3433]">{formatPriceShort(p.price)}</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-4 truncate">{p.area}, {p.city}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1"><Eye size={14}/> {p.views || 0} views</span>
                  </div>
                  <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                    <Button variant="secondary" size="sm" className="flex-1" onClick={() => navigate(`/property/${p.id}`)}>
                      <Eye size={14} className="mr-1"/> View
                    </Button>
                    <Button variant="secondary" size="sm" className="flex-1 text-blue-600 hover:bg-blue-50" onClick={() => navigate(`/landlord/properties/${p.id}/edit`)}>
                      <Edit size={14} className="mr-1"/> Edit
                    </Button>
                    <button className="p-2 rounded-xl border border-gray-200 text-[#CA3433] hover:bg-[#fff1f1] transition-colors" onClick={() => handleDelete(p.id)}>
                      <Trash2 size={16}/>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
