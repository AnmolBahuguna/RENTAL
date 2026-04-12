import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { supabase } from '../lib/supabase'
import {
  setServices, appendServices, setCurrentService,
  setReviews, addReview, removeReview,
  setServiceFilters, setServiceLoading,
  setReviewsLoading, setServiceHasMore, setServicePage,
} from '../store/serviceSlice'

const PAGE_SIZE = 12

export const useServices = () => {
  const dispatch = useDispatch()
  const {
    services, currentService, reviews, filters, loading,
    reviewsLoading, hasMore, page,
  } = useSelector(s => s.service)
  const { user } = useSelector(s => s.auth)

  // ── Fetch Services List ─────────────────────────────────────────────
  const fetchServices = useCallback(async (reset = false) => {
    dispatch(setServiceLoading(true))
    try {
      let query = supabase
        .from('service_providers')
        .select('*, profiles!service_providers_provider_id_fkey(full_name, avatar_url)')

      if (filters.category) query = query.eq('category', filters.category)
      if (filters.state)    query = query.ilike('state', `%${filters.state}%`)
      if (filters.city)     query = query.ilike('city', `%${filters.city}%`)
      if (filters.area)     query = query.ilike('area', `%${filters.area}%`)
      if (filters.query) {
        const q = `%${filters.query}%`
        query = query.or(`name.ilike.${q},area.ilike.${q},city.ilike.${q},description.ilike.${q}`)
      }

      const from = reset ? 0 : page * PAGE_SIZE
      const { data, error } = await query
        .order('created_at', { ascending: false })
        .range(from, from + PAGE_SIZE - 1)

      if (error) throw error

      if (reset) dispatch(setServices(data || []))
      else dispatch(appendServices(data || []))

      dispatch(setServiceHasMore((data || []).length === PAGE_SIZE))
      dispatch(setServicePage(reset ? 1 : page + 1))
    } catch (err) {
      console.error('fetchServices error:', err)
      dispatch(setServices([]))
    } finally {
      dispatch(setServiceLoading(false))
    }
  }, [filters, page, dispatch])

  // ── Fetch Single Service ────────────────────────────────────────────
  const fetchServiceById = useCallback(async (id) => {
    try {
      const { data, error } = await supabase
        .from('service_providers')
        .select(`
          *,
          profiles!service_providers_provider_id_fkey(full_name, avatar_url),
          service_listings(*),
          service_plans(*)
        `)
        .eq('id', id)
        .maybeSingle()

      if (error) throw error
      dispatch(setCurrentService(data))

      // Increment views
      await supabase.rpc('increment_service_views', { p_service_id: id })
    } catch (err) {
      console.error('fetchServiceById error:', err)
      dispatch(setCurrentService(null))
    }
  }, [dispatch])

  // ── Fetch Reviews for a Provider ───────────────────────────────────
  const fetchReviews = useCallback(async (serviceProviderId) => {
    dispatch(setReviewsLoading(true))
    try {
      const { data, error } = await supabase
        .from('service_reviews')
        .select('*, profiles!service_reviews_reviewer_id_fkey(full_name, avatar_url)')
        .eq('service_provider_id', serviceProviderId)
        .order('created_at', { ascending: false })

      if (error) throw error
      dispatch(setReviews(data || []))
    } catch (err) {
      console.error('fetchReviews error:', err)
    } finally {
      dispatch(setReviewsLoading(false))
    }
  }, [dispatch])

  // ── Submit Review ───────────────────────────────────────────────────
  const submitReview = async (serviceProviderId, rating, feedback) => {
    if (!user) throw new Error('Must be logged in to submit a review')

    const reviewData = {
      service_provider_id: serviceProviderId,
      reviewer_id: user.id,
      rating,
      feedback,
    }

    // Upsert — update if already reviewed
    const { data, error } = await supabase
      .from('service_reviews')
      .upsert(reviewData, { onConflict: 'service_provider_id,reviewer_id' })
      .select('*, profiles!service_reviews_reviewer_id_fkey(full_name, avatar_url)')
      .maybeSingle()

    if (error) throw error
    dispatch(addReview(data))
    return data
  }

  // ── Delete Review ───────────────────────────────────────────────────
  const deleteReview = async (reviewId) => {
    if (!user) return
    const { error } = await supabase
      .from('service_reviews')
      .delete()
      .eq('id', reviewId)
      .eq('reviewer_id', user.id)

    if (error) throw error
    dispatch(removeReview(reviewId))
  }

  // ── Create Service Provider Listing ────────────────────────────────
  const createService = async (providerData, serviceItems, plans, documentFiles) => {
    if (!user) throw new Error('Not authenticated')

    // Upload documents first
    const documentUrls = []
    if (documentFiles?.length) {
      for (const file of documentFiles) {
        const ext = file.name.split('.').pop()
        const path = `${user.id}/${Date.now()}_${file.name.replace(/\s+/g, '_')}`
        const { error: uploadError } = await supabase.storage
          .from('service-documents')
          .upload(path, file)
        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage
            .from('service-documents')
            .getPublicUrl(path)
          documentUrls.push(publicUrl)
        }
      }
    }

    // Insert main provider record
    const { data: provider, error: providerError } = await supabase
      .from('service_providers')
      .insert({ ...providerData, provider_id: user.id, documents: documentUrls })
      .select()
      .maybeSingle()

    if (providerError) throw providerError

    // Insert service items (price rows)
    if (serviceItems?.length) {
      const itemsToInsert = serviceItems.map(item => ({
        ...item,
        service_provider_id: provider.id,
      }))
      const { error: itemsError } = await supabase
        .from('service_listings')
        .insert(itemsToInsert)
      if (itemsError) console.error('Items insert error:', itemsError)
    }

    // Insert plans
    if (plans?.length) {
      const plansToInsert = plans.map(plan => ({
        ...plan,
        service_provider_id: provider.id,
      }))
      const { error: plansError } = await supabase
        .from('service_plans')
        .insert(plansToInsert)
      if (plansError) console.error('Plans insert error:', plansError)
    }

    return provider
  }

  // ── Update Service Listing ──────────────────────────────────────────
  const updateService = async (id, updates) => {
    const { data, error } = await supabase
      .from('service_providers')
      .update(updates)
      .eq('id', id)
      .eq('provider_id', user.id)
      .select()
      .maybeSingle()

    if (error) throw error
    return data
  }

  // ── Delete Service Listing ──────────────────────────────────────────
  const deleteService = async (id) => {
    const { error } = await supabase
      .from('service_providers')
      .delete()
      .eq('id', id)
      .eq('provider_id', user.id)

    if (error) throw error
  }

  // ── Get own provider listings ───────────────────────────────────────
  const getMyServices = async () => {
    if (!user) return []
    const { data, error } = await supabase
      .from('service_providers')
      .select('*, service_listings(*), service_plans(*)')
      .eq('provider_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  return {
    services, currentService, reviews, filters, loading, reviewsLoading, hasMore, page,
    fetchServices,
    fetchServiceById,
    fetchReviews,
    submitReview,
    deleteReview,
    createService,
    updateService,
    deleteService,
    getMyServices,
    updateFilters: useCallback((f) => dispatch(setServiceFilters(f)), [dispatch]),
  }
}
