import { useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useProperties } from '../../hooks/useProperties'

export const AppInitializer = () => {
  const { user } = useAuth()
  const { fetchFavorites, fetchRecentlyViewed } = useProperties()

  // Initialize global data on login/refresh
  useEffect(() => {
    if (user) {
      console.log('[AppInitializer] Synchronizing user data...')
      fetchFavorites()
      fetchRecentlyViewed()
    }
  }, [user, fetchFavorites, fetchRecentlyViewed])

  return null // This component doesn't render anything UI-wise
}
