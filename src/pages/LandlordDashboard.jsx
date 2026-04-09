import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Home, Eye, Edit, Trash2, Grid, List as ListIcon } from 'lucide-react'
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
  const [viewMode, setViewMode] = useState('grid')

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
    <div className="pt-12 lg:pt-0 pb-20 bg-gray-50 min-h-screen">
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

        {/* Listings Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 font-display">Your Listings</h2>
          
          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
             <button 
               onClick={() => setViewMode('grid')}
               className={cn(
                 "p-2 rounded-lg transition-all",
                 viewMode === 'grid' ? "bg-white text-[#CA3433] shadow-sm" : "text-gray-400 hover:text-gray-600"
               )}
               title="Grid View"
             >
               <Grid size={18} />
             </button>
             <button 
               onClick={() => setViewMode('list')}
               className={cn(
                 "p-2 rounded-lg transition-all",
                 viewMode === 'list' ? "bg-white text-[#CA3433] shadow-sm" : "text-gray-400 hover:text-gray-600"
               )}
               title="List View"
             >
               <ListIcon size={18} />
             </button>
          </div>
        </div>
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
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
              <Home size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No listings yet</h3>
            <p className="text-gray-500 max-w-sm mx-auto mb-8">
              Start adding your properties to reach thousands of potential renters.
            </p>
            <Button size="lg" className="rounded-2xl px-8 shadow-xl shadow-brand-500/10" onClick={() => navigate('/landlord/properties/new')}>List Your First Property</Button>
          </div>
        ) : (
          <div className={cn(
            "grid gap-6",
            viewMode === 'grid' 
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
              : "grid-cols-1"
          )}>
            {properties.map(p => (
              viewMode === 'grid' ? (
                /* Grid View Card */
                <div key={p.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col h-full">
                  <div className="relative w-full aspect-[4/3] bg-gray-50 border-b border-gray-100 overflow-hidden">
                    <img src={p.images?.[0] || ''} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 left-3 flex gap-2">
                       <TypeBadge type={p.type} />
                    </div>
                    <div className={cn('absolute top-3 right-3 px-2 py-1 text-[10px] uppercase tracking-wider font-extrabold rounded-lg shadow-sm backdrop-blur-md', p.availability ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white')}>
                      {p.availability ? 'Available' : 'Rented'}
                    </div>
                  </div>
                  
                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-gray-900 truncate text-base line-clamp-1 flex-1 pr-2">{p.title}</h3>
                      <span className="font-extrabold text-[#CA3433] whitespace-nowrap">{formatPriceShort(p.price)}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-4 truncate">{p.area}, {p.city}</p>
                    
                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-4 mt-auto">
                      <span className="flex items-center gap-1.5"><Eye size={14}/> {p.views || 0} views</span>
                      <span className="w-1 h-1 bg-gray-200 rounded-full" />
                      <span className="capitalize">{p.type}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 pt-3 border-t border-gray-50">
                      <Button variant="secondary" size="sm" className="flex-1 h-9 text-xs font-bold rounded-xl" onClick={() => navigate(`/property/${p.id}`)}>
                        View
                      </Button>
                      <Button variant="secondary" size="sm" className="flex-1 h-9 text-xs font-bold rounded-xl text-blue-600 hover:bg-blue-50 border-blue-100" onClick={() => navigate(`/landlord/properties/${p.id}/edit`)}>
                        Edit
                      </Button>
                      <button className="p-2 h-9 w-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors border border-gray-100" onClick={() => handleDelete(p.id)} title="Delete">
                        <Trash2 size={16}/>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* List View Row */
                <div key={p.id} className="bg-white rounded-2xl border border-gray-100 p-3 sm:p-4 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative w-full sm:w-48 aspect-video sm:aspect-square md:aspect-video rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                    <img src={p.images?.[0] || ''} alt={p.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2"><TypeBadge type={p.type} /></div>
                  </div>
                  
                  <div className="flex-1 w-full min-w-0 py-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 md:gap-4 mb-2">
                       <h3 className="font-bold text-lg text-gray-900 truncate">{p.title}</h3>
                       <div className="flex items-center gap-3">
                         <span className="font-extrabold text-xl text-[#CA3433]">{formatPriceShort(p.price)}</span>
                         <div className={cn('px-2 py-0.5 text-[10px] uppercase font-bold rounded-md', p.availability ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')}>
                            {p.availability ? 'Available' : 'Rented'}
                         </div>
                       </div>
                    </div>
                    
                    <p className="text-sm text-gray-500 mb-3">{p.area}, {p.city}</p>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-400">
                      <span className="flex items-center gap-2 font-medium bg-gray-50 px-3 py-1 rounded-lg">
                        <Eye size={16} className="text-gray-400"/> 
                        <span className="text-gray-600 font-bold">{p.views || 0}</span> 
                        <span className="text-[10px] uppercase tracking-wide">Total Views</span>
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 mt-2 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-0 border-gray-50">
                    <Button variant="secondary" size="md" className="flex-1 sm:flex-none px-6 font-bold rounded-xl h-11" onClick={() => navigate(`/property/${p.id}`)}>
                      <Eye size={18} className="mr-2" /> View
                    </Button>
                    <Button variant="secondary" size="md" className="flex-1 sm:flex-none px-6 font-bold rounded-xl h-11 text-blue-600 hover:bg-blue-50 border-blue-100" onClick={() => navigate(`/landlord/properties/${p.id}/edit`)}>
                      <Edit size={18} className="mr-2" /> Edit
                    </Button>
                    <button 
                      className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors border border-red-100" 
                      onClick={() => handleDelete(p.id)}
                      title="Delete Listing"
                    >
                      <Trash2 size={20}/>
                    </button>
                  </div>
                </div>
              )
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
