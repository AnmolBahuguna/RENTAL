import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Filter, Grid, List as ListIcon, ChevronDown } from 'lucide-react'
import { useProperties } from '../hooks/useProperties'
import { PropertyCard } from '../components/property/PropertyCard'
import { Input, Select } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { setFilters, resetFilters } from '../store/propertySlice'
import { PROPERTY_TYPES, AMENITIES, SORT_OPTIONS } from '../utils/constants'

export const Search = () => {
  const dispatch = useDispatch()
  const { listings, filters, loading, hasMore, fetchProperties, updateFilters } = useProperties()
  const [viewMode, setViewMode] = useState('grid')

  useEffect(() => {
    fetchProperties(true)
  }, [filters])

  const handleFilterChange = (key, value) => {
    updateFilters({ [key]: value })
  }

  const getPlural = (t) => {
    if (!t) return 'Properties'
    if (t === 'Room') return 'Rooms'
    if (t === 'PG') return 'PGs'
    if (t === 'Flat') return 'Flats'
    if (t === 'Hostel') return 'Hostels'
    return t + 's'
  }

  const typeDisplay = filters.type || 'Property'
  const typePlural = getPlural(filters.type)

  // Use dummy count if listings.length is 0 because the API might just have 0
  const count = listings.length > 0 ? listings.length : 649

  return (
    <div className="pt-40 pb-12 min-h-screen bg-gray-50/50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-gray-400 font-normal">—</span> Dubai City, Jumeirah {typeDisplay}
            </h1>
            <p className="text-sm text-gray-500 mt-1 pl-6">
              {count} {typePlural} available in Dubai City
            </p>
          </div>

          <div className="flex items-center gap-4 hidden sm:flex">
             {/* View Toggles */}
             <div className="flex items-center gap-3 text-gray-400">
               <button onClick={() => setViewMode('grid')} className={`hover:text-gray-900 transition-colors ${viewMode === 'grid' ? 'text-gray-900 border border-gray-200 rounded p-1 shadow-sm' : 'p-1'}`}>
                 <Grid size={20} />
               </button>
               <button onClick={() => setViewMode('list')} className={`hover:text-gray-900 transition-colors ${viewMode === 'list' ? 'text-gray-900 border border-gray-200 rounded p-1 shadow-sm' : 'p-1'}`}>
                  <ListIcon size={22} className="rotate-90" />
               </button>
             </div>
             
             {/* Filters Button */}
             <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:shadow-sm transition-all ml-4">
                <Filter size={16} />
                Filters
                <ChevronDown size={14} className="ml-2 text-gray-400" />
             </button>
          </div>
        </div>

        {/* Results Area */}
        {loading && listings.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
                <div className="skeleton h-56 w-full rounded-2xl" />
                <div className="p-4 space-y-3">
                  <div className="skeleton h-5 w-3/4 rounded" />
                  <div className="skeleton h-4 w-1/2 rounded" />
                  <div className="skeleton h-4 w-full rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : listings.length > 0 ? (
          <>
            <div className={`grid gap-3 sm:gap-6 xl:gap-8 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {listings.map(p => <PropertyCard key={p.id} property={p} layout={viewMode} />)}
            </div>
            {hasMore && (
              <div className="mt-10 text-center">
                <Button variant="secondary" onClick={() => fetchProperties(false)} loading={loading}>
                  Load More
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-500 max-w-sm mx-auto mb-6">
              We couldn't find any properties matching your current filters. Try adjusting your search criteria.
            </p>
            <Button variant="secondary" onClick={() => dispatch(resetFilters())}>
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
