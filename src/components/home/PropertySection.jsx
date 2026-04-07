import React, { useEffect, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { PropertyCard } from '../property/PropertyCard'
import { useProperties } from '../../hooks/useProperties'
import { setFilters } from '../../store/propertySlice'
import { MOCK_PROPERTIES } from '../../utils/constants'

const SectionSkeleton = () => (
  <div className="flex gap-5 overflow-x-auto pb-2">
    {[1,2,3,4].map(i => (
      <div key={i} className="flex-shrink-0 w-56 rounded-2xl bg-white border border-gray-100 overflow-hidden">
        <div className="skeleton h-42 w-full" style={{ height: '168px' }} />
        <div className="p-3 space-y-2">
          <div className="skeleton h-4 w-4/5 rounded" />
          <div className="skeleton h-3 w-3/5 rounded" />
          <div className="skeleton h-3 w-2/5 rounded" />
        </div>
      </div>
    ))}
  </div>
)

export const PropertySection = ({ title, type, emoji, viewAllPath }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { fetchByType } = useProperties()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetchByType(type)
      .then(data => setItems(data?.length ? data : MOCK_PROPERTIES.filter(p => p.type === type)))
      .finally(() => setLoading(false))
  }, [type])

  if (!loading && items.length === 0) return null

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{emoji}</span>
          <h2 className="font-display font-bold text-xl text-gray-900">{title}</h2>
          {!loading && (
            <span className="text-sm text-gray-400 font-medium ml-1">({items.length})</span>
          )}
        </div>
        <button
          onClick={() => {
            dispatch(setFilters({ type: type === 'all' ? '' : type }))
            navigate(viewAllPath || '/search')
          }}
          className="flex items-center gap-1 text-sm font-semibold text-brand-500 hover:text-brand-700 transition-colors"
        >
          View all <ChevronRight size={16} />
        </button>
      </div>

      {loading ? (
        <SectionSkeleton />
      ) : (
        <div className="scroll-row">
          {items.map(property => (
            <div key={property.id} className="flex-shrink-0">
              <PropertyCard property={property} compact />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export const FeaturedSection = () => {
  const { featured, fetchFeatured, loading } = useProperties()
  const items = featured.length ? featured : MOCK_PROPERTIES.sort((a,b) => b.views - a.views).slice(0,6)

  useEffect(() => { fetchFeatured() }, [])

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔥</span>
          <h2 className="font-display font-bold text-xl text-gray-900">Most Popular</h2>
        </div>
        <Link to="/search" className="flex items-center gap-1 text-sm font-semibold text-brand-500 hover:text-brand-700 transition-colors">
          View all <ChevronRight size={16} />
        </Link>
      </div>
      <div className="scroll-row">
        {items.map(property => (
          <div key={property.id} className="flex-shrink-0">
            <PropertyCard property={property} compact />
          </div>
        ))}
      </div>
    </section>
  )
}
