import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Clock, User as UserIcon } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useProperties } from '../hooks/useProperties'
import { PropertyCard } from '../components/property/PropertyCard'
import { supabase } from '../lib/supabase'
import { MOCK_PROPERTIES } from '../utils/constants'
import { Skeleton } from '../components/ui/Skeleton'

export const UserDashboard = () => {
  const { user, profile } = useAuth()
  const { fetchFavorites, fetchRecentlyViewed, favorites, recentlyViewed } = useProperties()
  const [favProps, setFavProps] = useState([])
  const [recentProps, setRecentProps] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      Promise.all([fetchFavorites(), fetchRecentlyViewed()]).then(() => loadProperties())
    }
  }, [user])

  const loadProperties = async () => {
    try {
      // Fetch details for favorited ids
      if (favorites.length > 0) {
        const { data } = await supabase.from('properties').select('*').in('id', favorites)
        if (data) setFavProps(data)
      }

      // Fetch details for recently viewed ids
      if (recentlyViewed.length > 0) {
        const { data } = await supabase.from('properties').select('*').in('id', recentlyViewed)
        if (data) {
          // preserve order based on recentlyViewed array
          const ordered = recentlyViewed.map(id => data.find(p => p.id === id)).filter(Boolean)
          setRecentProps(ordered)
        }
      }
    } catch {
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
    <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
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
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
              <Heart size={20} fill="currentColor" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 font-display">Saved Properties</h2>
            {!loading && <span className="text-sm font-medium text-gray-400">({favProps.length})</span>}
          </div>

          {loading ? (
            <LoadingRow />
          ) : favProps.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border border-gray-100 text-center">
              <p className="text-gray-500">You haven't saved any properties yet.</p>
              <Link to="/search" className="text-brand-600 font-semibold hover:underline mt-2 inline-block">Explore listings</Link>
            </div>
          ) : (
            <div className="scroll-row">
              {favProps.map(p => (
                <div key={p.id} className="flex-shrink-0">
                  <PropertyCard property={p} compact />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recently Viewed */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-500 flex items-center justify-center">
              <Clock size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 font-display">Recently Viewed</h2>
          </div>

          {loading ? (
            <LoadingRow />
          ) : recentProps.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border border-gray-100 text-center">
              <p className="text-gray-500">No recently viewed properties.</p>
            </div>
          ) : (
            <div className="scroll-row">
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
