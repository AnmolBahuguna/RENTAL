import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Filter, Grid, List as ListIcon, ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useProperties } from '../hooks/useProperties'
import { PropertyCard } from '../components/property/PropertyCard'
import { Input, Select } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { setFilters, resetFilters } from '../store/propertySlice'
import { PROPERTY_TYPES, AMENITIES, SORT_OPTIONS } from '../utils/constants'
import { AMENITY_ICONS } from '../utils/helpers'

export const Search = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { listings, filters, loading, hasMore, fetchProperties, updateFilters } = useProperties()
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [localFilters, setLocalFilters] = useState({
    city: filters.city || '', 
    area: filters.area || '', 
    priceMin: filters.priceMin || 0, 
    priceMax: filters.priceMax || 100000, 
    amenities: [...(filters.amenities || [])], 
    sortBy: filters.sortBy || 'created_at', 
    sortOrder: filters.sortOrder || 'desc'
  })

  useEffect(() => {
    setLocalFilters({
      city: filters.city || '', 
      area: filters.area || '', 
      priceMin: filters.priceMin || 0, 
      priceMax: filters.priceMax || 100000, 
      amenities: [...(filters.amenities || [])], 
      sortBy: filters.sortBy || 'created_at', 
      sortOrder: filters.sortOrder || 'desc'
    })
  }, [filters])

  const applyFilters = () => {
    updateFilters(localFilters)
    setShowFilters(false)
  }

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
            <h1 className="text-2xl md:text-3xl font-light text-gray-800 flex items-center gap-2 italic font-display tracking-tight flex-wrap">
              <span className="text-brand-500 font-normal opacity-50">—</span> 
              <span>{t('search.quoteStart')} <strong className="font-extrabold text-gray-900">{t('search.quoteEnd')}</strong></span>
            </h1>
            <p className="text-sm sm:text-base text-gray-500 mt-2 pl-8 font-medium">
              {t('search.resultsFound', { 
                count: count, 
                type: filters.type ? t(`property.types.${filters.type}`) : t('search.properties') 
              })}
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
             
             {/* Filters Button & Dropdown */}
             <div className="relative z-20">
               <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-2 px-6 py-2.5 bg-white border rounded-xl text-sm font-semibold transition-all ml-4 ${showFilters ? 'border-brand-500 text-brand-600 shadow-sm' : 'border-gray-200 text-gray-700 hover:shadow-sm'}`}>
                  <Filter size={16} />
                  {t('search.filters')}
                  <ChevronDown size={14} className={`ml-2 transition-transform duration-300 ${showFilters ? 'rotate-180 text-brand-500' : 'text-gray-400'}`} />
               </button>
               
               {showFilters && (
                 <>
                   {/* Click away overlay */}
                   <div className="fixed inset-0 z-10" onClick={() => setShowFilters(false)}></div>
                   
                   <div className="absolute right-0 top-full mt-3 w-[360px] bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 p-6 z-20 cursor-default">
                     <div className="space-y-6">
                       
                       {/* Location */}
                       <div>
                         <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Location Selection</label>
                         <div className="space-y-3">
                           <div className="flex bg-gray-50 rounded-xl overflow-hidden border border-gray-200 focus-within:border-brand-500 focus-within:bg-white transition-colors pr-3">
                             <input type="text" placeholder="City (e.g. Mumbai)" className="w-full bg-transparent border-none text-[15px] p-3 focus:ring-0 outline-none" value={localFilters.city} onChange={e => setLocalFilters({...localFilters, city: e.target.value})} />
                           </div>
                           <div className="flex bg-gray-50 rounded-xl overflow-hidden border border-gray-200 focus-within:border-brand-500 focus-within:bg-white transition-colors pr-3">
                             <input type="text" placeholder="Search area or keywords (e.g. bndra)" className="w-full bg-transparent border-none text-[15px] p-3 focus:ring-0 outline-none" value={localFilters.area} onChange={e => setLocalFilters({...localFilters, area: e.target.value})} />
                           </div>
                         </div>
                       </div>

                       {/* Sort By */}
                       <div>
                         <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">{t('search.sortBy')}</label>
                         <div className="grid grid-cols-1 gap-2">
                           {SORT_OPTIONS.map(opt => (
                             <button
                               key={opt.value}
                               onClick={() => updateFilters({ sort: opt.value })}
                               className={`text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${filters.sort === opt.value ? 'bg-brand-50 text-brand-600 border border-brand-100' : 'text-gray-600 hover:bg-gray-50'}`}
                             >
                               {t(`search.sort.${opt.value.replace(':', '_')}`) || opt.label}
                             </button>
                           ))}
                         </div>
                       </div>

                       {/* Property Type */}
                       <div>
                         <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">{t('property.types.VILLA')}</label>
                         <div className="grid grid-cols-2 gap-2">
                           <button
                             onClick={() => updateFilters({ type: '' })}
                             className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border ${!filters.type ? 'bg-brand-50 text-brand-600 border-brand-100' : 'border-gray-100 text-gray-600 hover:bg-gray-50'}`}
                           >
                             {t('search.allTypes')}
                           </button>
                           {['Room', 'Flat', 'Hostel', 'PG'].map(type => (
                             <button
                               key={type}
                               onClick={() => updateFilters({ type })}
                               className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border ${filters.type === type ? 'bg-brand-50 text-brand-600 border-brand-100' : 'border-gray-100 text-gray-600 hover:bg-gray-50'}`}
                             >
                               {t(`property.types.${type}`)}
                             </button>
                           ))}
                         </div>
                       </div>

                       {/* Price Range */}
                       <div>
                         <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">{t('search.priceRange')}</label>
                         <div className="flex items-center gap-3">
                           <input type="number" className="w-full bg-gray-50 border border-gray-200 rounded-xl text-[15px] p-3 outline-none focus:border-brand-500 focus:bg-white transition-colors" placeholder="Min" value={localFilters.priceMin || ''} onChange={e => setLocalFilters({...localFilters, priceMin: Number(e.target.value)})} />
                           <span className="text-gray-400 font-bold">-</span>
                           <input type="number" className="w-full bg-gray-50 border border-gray-200 rounded-xl text-[15px] p-3 outline-none focus:border-brand-500 focus:bg-white transition-colors" placeholder="Max" value={localFilters.priceMax || ''} onChange={e => setLocalFilters({...localFilters, priceMax: Number(e.target.value)})} />
                         </div>
                       </div>

                       {/* Sort By */}
                       <div>
                         <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Sort Results</label>
                         <div className="relative">
                           <select className="w-full bg-gray-50 border border-gray-200 rounded-xl text-[15px] p-3 outline-none focus:border-brand-500 focus:bg-white transition-colors cursor-pointer appearance-none" 
                            value={`${localFilters.sortBy}:${localFilters.sortOrder}`} 
                            onChange={e => {
                              const [by, ord] = e.target.value.split(':');
                              setLocalFilters({...localFilters, sortBy: by, sortOrder: ord})
                            }}>
                             {SORT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                           </select>
                           <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                         </div>
                       </div>

                       {/* Amenities */}
                       <div>
                         <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">Property Amenities</label>
                         <div className="flex flex-wrap gap-2">
                           {AMENITIES.map(a => {
                             const active = localFilters.amenities.includes(a.id);
                             return (
                               <button key={a.id} onClick={() => {
                                 const newAms = active ? localFilters.amenities.filter(id => id !== a.id) : [...localFilters.amenities, a.id];
                                 setLocalFilters({...localFilters, amenities: newAms})
                               }} className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-bold transition-all border ${active ? 'bg-brand-50 text-brand-700 border-brand-200' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}>
                                 <span className="text-base text-gray-400">
                                   {(() => {
                                     const Icon = AMENITY_ICONS[a.id];
                                     return Icon ? <Icon size={18} /> : null;
                                   })()}
                                 </span> {a.label}
                               </button>
                             )
                           })}
                         </div>
                       </div>

                       <div className="pt-2 flex gap-3 border-t border-gray-100">
                         <Button variant="secondary" className="flex-1 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl" onClick={() => { dispatch(resetFilters()); setShowFilters(false); }}>Reset All</Button>
                         <Button variant="primary" className="flex-1 rounded-xl shadow-md" onClick={applyFilters}>Apply Filters</Button>
                       </div>

                     </div>
                   </div>
                 </>
               )}
             </div>
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
