import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { Search, Filter, ChevronDown, Grid, List as ListIcon, RefreshCw } from 'lucide-react'
import { useServices } from '../hooks/useServices'
import { ServiceCard } from '../components/services/ServiceCard'
import { Button } from '../components/ui/Button'
import { Skeleton } from '../components/ui/Skeleton'
import { resetServiceFilters } from '../store/serviceSlice'

const CATEGORIES = [
  { value: '',         label: 'All Services', emoji: '✨' },
  { value: 'tiffin',  label: 'Tiffin',        emoji: '🍱' },
  { value: 'laundry', label: 'Laundry',       emoji: '🧺' },
  { value: 'cleaning',label: 'Cleaning',      emoji: '🧹' },
]

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh','Chandigarh',
  'Puducherry','Lakshadweep','Dadra & Nagar Haveli',
]

export const NearbyServices = () => {
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const { services, filters, loading, hasMore, fetchServices, updateFilters } = useServices()

  const [viewMode, setViewMode] = useState('grid')
  const [searchInput, setSearchInput] = useState('')
  const [showStateDropdown, setShowStateDropdown] = useState(false)

  // Read ?category= from URL
  useEffect(() => {
    const cat = searchParams.get('category')
    if (cat && ['tiffin', 'laundry', 'cleaning'].includes(cat) && filters.category !== cat) {
      updateFilters({ category: cat })
    }
  }, [searchParams])

  // Fetch whenever filters change
  useEffect(() => {
    fetchServices(true)
  }, [filters, fetchServices])

  // Live search handler
  const handleSearch = (e) => {
    const val = e.target.value
    setSearchInput(val)
    updateFilters({ query: val })
  }

  return (
    <div className="pt-6 pb-16 min-h-screen bg-gray-50/50">
      <div className="w-full px-4 sm:px-10 md:px-16 lg:px-20">

        {/* ── Page Header ──────────────────────────────────── */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight font-display">
            Nearby <span className="text-[#CA3433]">Services</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Find trusted tiffin, laundry &amp; cleaning services near you
          </p>
        </div>

        {/* ── Search Bar + State Filter Row ────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="service-search"
              type="text"
              placeholder="Search by name, area, city..."
              value={searchInput}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#CA3433] focus:ring-2 focus:ring-[#CA3433]/10 transition-all shadow-sm"
            />
          </div>

          {/* Area input */}
          <input
            type="text"
            placeholder="Area (e.g. Rajouri Garden)"
            value={filters.area || ''}
            onChange={e => updateFilters({ area: e.target.value })}
            className="sm:w-48 px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#CA3433] focus:ring-2 focus:ring-[#CA3433]/10 transition-all shadow-sm"
          />

          {/* State selector */}
          <div className="relative">
            <button
              onClick={() => setShowStateDropdown(v => !v)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:border-gray-300 shadow-sm transition-all w-full sm:w-auto"
            >
              <span className="text-gray-600">{filters.state || 'All States'}</span>
              <ChevronDown size={14} className={`text-gray-400 transition-transform ${showStateDropdown ? 'rotate-180' : ''}`} />
            </button>
            {showStateDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowStateDropdown(false)} />
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 z-20 max-h-72 overflow-y-auto">
                  <button
                    onClick={() => { updateFilters({ state: '' }); setShowStateDropdown(false) }}
                    className="w-full px-4 py-3 text-left text-sm font-semibold text-[#CA3433] hover:bg-red-50 border-b border-gray-50"
                  >
                    All States
                  </button>
                  {INDIAN_STATES.map(s => (
                    <button
                      key={s}
                      onClick={() => { updateFilters({ state: s }); setShowStateDropdown(false) }}
                      className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors ${filters.state === s ? 'font-bold text-[#CA3433] bg-red-50' : 'text-gray-700'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Reset filters */}
          {(filters.category || filters.state || filters.area || filters.query) && (
            <button
              onClick={() => { dispatch(resetServiceFilters()); setSearchInput('') }}
              className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold text-gray-500 hover:text-[#CA3433] transition-colors"
            >
              <RefreshCw size={13} /> Reset
            </button>
          )}
        </div>

        {/* ── Category Tabs ─────────────────────────────────── */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => updateFilters({ category: cat.value })}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap border transition-all ${
                filters.category === cat.value
                  ? 'bg-[#CA3433] text-white border-[#CA3433] shadow-md shadow-[#CA3433]/20'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              <span>{cat.emoji}</span>
              {cat.label}
            </button>
          ))}

          {/* View toggles (desktop) */}
          <div className="hidden md:flex items-center gap-2 ml-auto">
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg border transition-all ${viewMode === 'grid' ? 'border-gray-300 bg-white shadow-sm' : 'border-transparent text-gray-400'}`}>
              <Grid size={18} />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg border transition-all ${viewMode === 'list' ? 'border-gray-300 bg-white shadow-sm' : 'border-transparent text-gray-400'}`}>
              <ListIcon size={18} />
            </button>
          </div>
        </div>

        {/* ── Results Count ─────────────────────────────────── */}
        <p className="text-xs text-gray-400 font-medium mb-4">
          {loading ? 'Searching...' : `${services.length > 0 ? services.length : 0} provider${services.length !== 1 ? 's' : ''} found${filters.state ? ` in ${filters.state}` : ''}`}
        </p>

        {/* ── Results Grid ─────────────────────────────────── */}
        {loading && services.length === 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <Skeleton className="h-1.5 w-full" />
                <div className="p-4 space-y-3">
                  <div className="flex justify-between">
                    <Skeleton className="h-5 w-20 rounded-full" />
                    <Skeleton className="h-5 w-14 rounded-full" />
                  </div>
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : services.length > 0 ? (
          <>
            <div className={`grid gap-3 sm:gap-5 ${viewMode === 'grid' ? 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
              {services.map(s => (
                <ServiceCard key={s.id} service={s} layout={viewMode} />
              ))}
            </div>
            {hasMore && (
              <div className="mt-10 text-center">
                <Button variant="secondary" onClick={() => fetchServices(false)} loading={loading}>
                  Load More
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No providers found</h3>
            <p className="text-gray-500 text-sm max-w-xs mx-auto mb-6">
              Try adjusting your search — change the area, state, or category
            </p>
            <Button variant="secondary" onClick={() => { dispatch(resetServiceFilters()); setSearchInput('') }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
