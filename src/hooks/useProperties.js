import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { supabase } from '../lib/supabase'
import { MOCK_PROPERTIES } from '../utils/constants'
import {
  setListings, appendListings, setFeatured, setCurrentProperty,
  setFavorites, toggleFavorite as toggleFav,
  setRecentlyViewed, addRecentlyViewed,
  setLoading, setHasMore, setPage, setFilters, setTotalCount,
} from '../store/propertySlice'

const PAGE_SIZE = 12

export const useProperties = () => {
  const dispatch = useDispatch()
  const { listings, featured, currentProperty, favorites, recentlyViewed, filters, loading, hasMore, page, totalCount } = useSelector(s => s.property)
  const { user } = useSelector(s => s.auth)

  const fetchProperties = useCallback(async (reset = false) => {
    dispatch(setLoading(true))
    try {
      let query = supabase
        .from('properties')
        .select('*, profiles!properties_landlord_id_fkey(full_name, avatar_url, phone)', { count: 'exact' })
        .eq('availability', true)

      if (filters.type) query = query.eq('type', filters.type)
      if (filters.priceMin > 0) query = query.gte('price', filters.priceMin)
      if (filters.priceMax < 100000) query = query.lte('price', filters.priceMax)
      
      if (filters.amenities?.length > 0) {
        query = query.contains('amenities', filters.amenities)
      }

      if (filters.city) {
        query = query.ilike('city', `%${filters.city}%`)
      }

      if (filters.area) {
        // Fuzzy matching: e.g. "bndra" -> "%b%n%d%r%a%"
        const fuzzyPattern = '%' + filters.area.toLowerCase().split('').filter(c => c.trim()).join('%') + '%'
        query = query.ilike('area', fuzzyPattern)
      }

      if (filters.query) {
        const q = `%${filters.query}%`
        query = query.or(`title.ilike.${q},city.ilike.${q},area.ilike.${q},description.ilike.${q}`)
      }

      const { data, error, count: dbCount } = await query
        .order(filters.sortBy || 'created_at', { ascending: filters.sortOrder === 'asc' })
        .range(reset ? 0 : page * PAGE_SIZE, (reset ? 0 : page * PAGE_SIZE) + PAGE_SIZE - 1)

      if (error) throw error

      if (dbCount !== null) dispatch(setTotalCount(dbCount))
      
      if (reset) dispatch(setListings(data || []))
      else dispatch(appendListings(data || []))
      
      // If we got fewer items than PAGE_SIZE, we hit the end
      dispatch(setHasMore((data || []).length === PAGE_SIZE))
      dispatch(setPage(reset ? 1 : page + 1))
    } catch (err) {
      console.error(err)
      // Fallback to mock data with client filtering
      let result = [...MOCK_PROPERTIES]
      if (filters.city) result = result.filter(p => p.city?.toLowerCase().includes(filters.city.toLowerCase()))
      if (filters.type) result = result.filter(p => p.type === filters.type)
      if (filters.amenities?.length) result = result.filter(p => filters.amenities.every(a => p.amenities?.includes(a)))
      
      if (filters.query) {
        const q = filters.query.toLowerCase()
        result = result.filter(p => 
          p.title?.toLowerCase().includes(q) || 
          p.city?.toLowerCase().includes(q) || 
          p.area?.toLowerCase().includes(q) || 
          p.description?.toLowerCase().includes(q)
        )
      }

      result = result.filter(p => p.price >= filters.priceMin && p.price <= filters.priceMax)
      
      if (filters.area) {
        const fuzzyRegex = new RegExp(filters.area.toLowerCase().split('').filter(c => c.trim()).join('.*'))
        result = result.filter(p => fuzzyRegex.test(p.area?.toLowerCase()))
      }

      if (reset) dispatch(setListings(result))
      else dispatch(appendListings(result))
      dispatch(setHasMore(false))
    } finally {
      dispatch(setLoading(false))
    }
  }, [filters, page])

  const fetchFeatured = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*, profiles!properties_landlord_id_fkey(full_name, avatar_url)')
        .eq('availability', true)
        .order('views', { ascending: false })
        .limit(8)
      if (error) throw error
      dispatch(setFeatured(data?.length ? data : MOCK_PROPERTIES.sort((a, b) => b.views - a.views).slice(0, 8)))
    } catch {
      dispatch(setFeatured(MOCK_PROPERTIES.sort((a, b) => b.views - a.views).slice(0, 8)))
    }
  }, [])

  const fetchByType = useCallback(async (type) => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('type', type)
        .eq('availability', true)
        .order('views', { ascending: false })
        .limit(10)
      if (error) throw error
      return data?.length ? data : MOCK_PROPERTIES.filter(p => p.type === type)
    } catch {
      return MOCK_PROPERTIES.filter(p => p.type === type)
    }
  }, [])

  const fetchPropertyById = useCallback(async (id) => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*, profiles!properties_landlord_id_fkey(full_name, avatar_url, phone, bio)')
        .eq('id', id)
        .maybeSingle()
      if (error) throw error
      dispatch(setCurrentProperty(data))
      // Track recently viewed
      const isMock = MOCK_PROPERTIES.some(p => String(p.id) === String(id))
      console.log(`[fetchPropertyById] Tracking ${id}. Mock: ${isMock}`)

      if (user && !isMock) {
        dispatch(addRecentlyViewed(id))
        await supabase.from('recently_viewed').upsert({ user_id: user.id, property_id: id, viewed_at: new Date().toISOString() })
      } else if (isMock) {
        dispatch(addRecentlyViewed(id))
      }
    } catch {
      const mock = MOCK_PROPERTIES.find(p => String(p.id) === String(id))
      dispatch(setCurrentProperty(mock || null))
    }
  }, [user])

  const createProperty = async (propertyData, images) => {
    // Upload images first
    const imageUrls = []
    for (const img of images) {
      const ext = img.name.split('.').pop()
      const path = `properties/${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`
      
      console.log(`[useProperties] Uploading image: ${path}`)
      const { error: uploadError } = await supabase.storage.from('property-images').upload(path, img)

      if (uploadError) {
        console.error('[useProperties] Image upload failed:', uploadError)
        throw new Error(`Image upload failed: ${uploadError.message}`)
      }
      
      const { data: { publicUrl } } = supabase.storage.from('property-images').getPublicUrl(path)
      imageUrls.push(publicUrl)
    }

    const { data, error } = await supabase
      .from('properties')
      .insert({ ...propertyData, landlord_id: user.id, images: imageUrls, views: 0 })
      .select()
      .maybeSingle()
    if (error) throw error
    return data
  }

  const updateProperty = async (id, updates, newImages) => {
    let imageUrls = updates.images || []
    if (newImages?.length) {
      for (const img of newImages) {
        const ext = img.name.split('.').pop()
        const path = `properties/${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`
        
        console.log(`[useProperties] Uploading new image: ${path}`)
        const { error: uploadError } = await supabase.storage.from('property-images').upload(path, img)

        if (uploadError) {
          console.error('[useProperties] New image upload failed:', uploadError)
          throw new Error(`Image upload failed: ${uploadError.message}`)
        }
        
        const { data: { publicUrl } } = supabase.storage.from('property-images').getPublicUrl(path)
        imageUrls.push(publicUrl)
      }
    }
    const { data, error } = await supabase
      .from('properties')
      .update({ ...updates, images: imageUrls })
      .eq('id', id)
      .eq('landlord_id', user.id)
      .select()
      .maybeSingle()
    if (error) throw error
    return data
  }

  const deleteProperty = async (id) => {
    // Verify session identity before deletion
    const { data: { user: sessionUser }, error: sessionError } = await supabase.auth.getUser()
    if (sessionError || !sessionUser) {
      throw new Error('Authentication session expired. Please log in again.')
    }

    const { error: deleteError, count } = await supabase
      .from('properties')
      .delete({ count: 'exact' })
      .eq('id', id)

    if (deleteError) throw deleteError

    if (count === 0) {
      throw new Error('Property not found or you do not have permission to delete it')
    }

    return true
  }

  const fetchFavorites = useCallback(async () => {
    if (!user) return
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('property_id')
        .eq('user_id', user.id)
      if (error) throw error
      dispatch(setFavorites(data?.map(f => f.property_id) || []))
    } catch { /* silent */ }
  }, [user])

  const toggleFavorite = async (propertyId) => {
    if (!user) return
    const isFav = favorites.includes(propertyId)
    const isMock = MOCK_PROPERTIES.some(p => String(p.id) === String(propertyId))
    
    dispatch(toggleFav(propertyId))
    
    if (isMock) {
      console.log('[toggleFavorite] Mock property handled in-memory.')
      return
    }

    try {
      if (isFav) {
        await supabase.from('favorites').delete().eq('user_id', user.id).eq('property_id', propertyId)
      } else {
        await supabase.from('favorites').insert({ user_id: user.id, property_id: propertyId })
      }
    } catch (err) { 
      console.error('[toggleFavorite] Sync failed:', err)
      dispatch(toggleFav(propertyId)) /* revert */ 
    }
  }

  const fetchRecentlyViewed = useCallback(async () => {
    if (!user) return
    try {
      const { data } = await supabase
        .from('recently_viewed')
        .select('property_id')
        .eq('user_id', user.id)
        .order('viewed_at', { ascending: false })
        .limit(20)
      dispatch(setRecentlyViewed(data?.map(r => r.property_id) || []))
    } catch { /* silent */ }
  }, [user])

  const getLandlordProperties = async () => {
    // Get session ID directly for reliability
    const { data: { user: sessionUser } } = await supabase.auth.getUser()
    const activeId = sessionUser?.id || user?.id

    if (!activeId) throw new Error('You must be logged in to view your properties')

    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('landlord_id', activeId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  }

  return {
    listings, featured, currentProperty, favorites, recentlyViewed, filters,
    loading, hasMore, page, totalCount,
    fetchProperties, fetchFeatured, fetchByType, fetchPropertyById,
    createProperty, updateProperty, deleteProperty,
    fetchFavorites, toggleFavorite, fetchRecentlyViewed, getLandlordProperties,
    updateFilters: useCallback((f) => dispatch(setFilters(f)), [dispatch]),
    resetFilters: useCallback(() => dispatch(resetFilters()), [dispatch]),
  }
}
