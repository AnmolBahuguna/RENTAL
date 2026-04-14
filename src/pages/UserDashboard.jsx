import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Clock, User as UserIcon, ChevronLeft } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useProperties } from '../hooks/useProperties'
import { PropertyCard } from '../components/property/PropertyCard'
import { supabase } from '../lib/supabase'
import { MOCK_PROPERTIES } from '../utils/constants'
import { Skeleton } from '../components/ui/Skeleton'

export const UserDashboard = () => {
  const { user, profile } = useAuth()
  const { favorites, recentlyViewed } = useProperties()
  const [favProps, setFavProps] = useState([])
  const [recentProps, setRecentProps] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadProperties()
    }
  }, [user, favorites, recentlyViewed]) // React to changes in the Redux IDs

  const loadProperties = async () => {
    if (!user) return
    
    // Only set loading if we don't have any data yet
    if (favProps.length === 0 && recentProps.length === 0) {
      setLoading(true)
    }

    try {
      // Fetch details for favorited ids
      if (favorites.length > 0) {
        const { data } = await supabase.from('properties').select('*').in('id', favorites)
        if (data) {
           // preserve order based on favorites array
           const ordered = favorites.map(id => data.find(p => p.id === id)).filter(Boolean)
           setFavProps(ordered)
        }
      } else {
        setFavProps([])
      }

      // Fetch details for recently viewed ids
      if (recentlyViewed.length > 0) {
        const { data } = await supabase.from('properties').select('*').in('id', recentlyViewed)
        if (data) {
          // preserve order based on recentlyViewed array
          const ordered = recentlyViewed.map(id => data.find(p => p.id === id)).filter(Boolean)
          setRecentProps(ordered)
        }
      } else {
        setRecentProps([])
      }
    } catch (err) {
      console.error('[UserDashboard] Load error:', err)
      // Fallback
      setFavProps(MOCK_PROPERTIES.filter(p => favorites.includes(p.id)))
      setRecentProps(recentlyViewed.map(id => MOCK_PROPERTIES.find(p => p.id === id)).filter(Boolean))
    } finally {
      setLoading(false)
    }
  }

  const LoadingRow = () => (
    <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="flex-shrink-0 w-64 rounded-xl bg-white border border-gray-100 p-3 space-y-3">
          <Skeleton className="h-44 w-full rounded-xl" />
          <div className="space-y-2 px-1">
            <Skeleton className="h-5 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
            <div className="pt-1 flex gap-2">
              <Skeleton className="h-3 w-1/4 rounded-full" />
              <Skeleton className="h-3 w-1/4 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="pt-4 pb-20 bg-gray-50 min-h-screen">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-brand-200 bg-gray-200">
            {profile ? (
              <img src={profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <Skeleton variant="circle" className="w-full h-full" />
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 font-display">
              {profile ? `Hi, ${profile?.full_name?.split(' ')[0] || 'User'}!` : <Skeleton className="h-8 w-32" />}
            </h1>
            <p className="text-gray-500">Pick up exactly where you left off.</p>
          </div>
        </div>

        {/* Saved Properties */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#fdf2f2] text-[#CA3433] flex items-center justify-center">
                <Heart size={20} fill="currentColor" />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900 font-display leading-none">Saved Properties</h2>
                {!loading && <span className="text-xs font-bold text-gray-400 mt-1 block uppercase tracking-wider">{favProps.length} Items</span>}
              </div>
            </div>
            
            {favProps.length > 0 && (
              <Link 
                to="/dashboard/saved" 
                className="text-sm font-extrabold text-[#CA3433] hover:underline flex items-center gap-1 group"
              >
                View all
                <ChevronLeft size={16} className="rotate-180 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            )}
          </div>

          {loading ? (
            <LoadingRow />
          ) : favProps.length === 0 ? (
            <div className="bg-white p-10 rounded-3xl border border-gray-100 text-center shadow-sm">
              <p className="text-gray-500 font-medium mb-4">You haven't saved any properties yet.</p>
              <Link to="/search" className="bg-[#fdf2f2] text-[#CA3433] px-6 py-2.5 rounded-xl font-bold hover:bg-[#fbe1e1] transition-colors inline-block">Explore listings</Link>
            </div>
          ) : (
            <div className="scroll-row px-1 -mx-1">
              {favProps.slice(0, 3).map(p => (
                <div key={p.id} className="flex-shrink-0">
                  <PropertyCard property={p} compact />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recently Viewed */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#fdf2f2] text-[#CA3433] flex items-center justify-center">
              <Clock size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900 font-display leading-none">Recently Viewed</h2>
              <p className="text-[10px] text-gray-400 mt-1 font-medium bg-gray-50 px-2 py-0.5 rounded-md inline-block">
                Auto-clears after 72 hours
              </p>
            </div>
          </div>

          {loading ? (
            <LoadingRow />
          ) : recentProps.length === 0 ? (
            <div className="bg-white p-10 rounded-3xl border border-gray-100 text-center shadow-sm">
              <p className="text-gray-500 font-medium">No recently viewed properties.</p>
            </div>
          ) : (
            <div className="scroll-row px-1 -mx-1">
              {recentProps.map(p => (
                <div key={p.id} className="flex-shrink-0">
                  <PropertyCard property={p} compact />
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
