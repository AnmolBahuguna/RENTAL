import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Search, ChevronDown, User, LogOut, Home, Building, Tent, MapPin, Grid, PlusCircle, LayoutDashboard, Menu, X } from 'lucide-react'
import { openAuthModal } from '../../store/authSlice'
import { toggleMobileMenu, closeMobileMenu } from '../../store/uiSlice'
import { useAuth } from '../../hooks/useAuth'
import { useProperties } from '../../hooks/useProperties'
import { cn } from '../../utils/helpers'
import { useTranslation } from 'react-i18next'
import { Skeleton } from '../ui/Skeleton'
import { BannerSlider } from './BannerSlider'

export const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { t, i18n } = useTranslation()
  const { user, profile, role, signOut, loading } = useAuth()
  const { filters, updateFilters } = useProperties()
  const { mobileMenuOpen } = useSelector(s => s.ui)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [cityMenuOpen, setCityMenuOpen] = useState(false)
  const [langMenuOpen, setLangMenuOpen] = useState(false)
  const [selectedCity, setSelectedCity] = useState('Dehradun')

  const languages = [
    { code: 'en', label: 'English', short: 'EN' },
    { code: 'hi', label: 'हिंदी', short: 'HI' }
  ]
  const currentLang = languages.find(l => l.code === (i18n.language?.split('-')[0] || 'en')) || languages[0]

  const changeLanguage = (code) => {
    i18n.changeLanguage(code)
    setLangMenuOpen(false)
  }

  const CITIES = ['Dehradun', 'Srinagar', 'Rishikesh', 'Haldwani', 'Nainital', 'Haridwar', 'Roorkee', 'Rudrapur']

  const handleSignOut = async () => {
    await signOut()
    setUserMenuOpen(false)
    navigate('/')
  }

  const handleLiveSearch = (e) => {
    const value = e.target.value
    updateFilters({ query: value })
    
    // Redirect to search page if not already there
    if (!location.pathname.startsWith('/search')) {
      navigate('/search')
    }
    
    if (mobileMenuOpen && value.length > 3) dispatch(closeMobileMenu())
  }

  const categoryTabs = [
    { name: t('property.types.Room'), value: 'Room', icon: <Home size={18} /> },
    { name: t('property.types.Flat'), value: 'Flat', icon: <Building size={18} /> },
    { name: t('property.types.Hostel'), value: 'Hostel', icon: <Tent size={18} /> },
    { name: t('property.types.PG'), value: 'PG', icon: <Building size={18} /> },
  ]

  return (
    <nav className="relative z-40 bg-white">
      {/* Top Navbar */}
      <div className="w-full mx-auto px-4 sm:px-10 md:px-16 lg:px-20">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & EN */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg border-2 border-brand-500 rounded-tl-xl rounded-br-xl bg-white shadow-sm flex items-center justify-center font-bold font-display rotate-3 group-hover:rotate-6 transition-transform">
                <div className="-rotate-3 flex items-end justify-center">
                  <span className="text-brand-500 text-[20px] font-black leading-none">G</span>
                  <span className="text-brand-600 text-[14px] font-black leading-none rotate-12 -ml-0.5 mb-0.5">E</span>
                </div>
              </div>
              <span className="font-display font-bold text-2xl text-gray-900 tracking-tight">
                GoEazy
              </span>
            </Link>
            
            <div className="relative">
              <button 
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="hidden md:flex items-center gap-1.5 text-sm font-bold text-gray-700 hover:text-brand-500 transition-colors uppercase"
              >
                {currentLang.short} <ChevronDown size={14} className={`transition-transform duration-200 ${langMenuOpen ? 'rotate-180 text-brand-500' : ''}`} />
              </button>

              {langMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setLangMenuOpen(false)} />
                  <div className="absolute left-0 top-full mt-2 w-32 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden py-1">
                    {languages.map(l => (
                      <button
                        key={l.code}
                        onClick={() => changeLanguage(l.code)}
                        className={`w-full text-left px-4 py-2 text-sm font-semibold transition-colors ${currentLang.code === l.code ? 'bg-brand-50 text-brand-600' : 'text-gray-700 hover:bg-gray-50'}`}
                      >
                        {l.label} ({l.short})
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                id="desktop-search"
                name="desktop-search"
                value={filters.query || ''}
                placeholder={t('hero.searchPlaceholder')}
                onChange={handleLiveSearch}
                className="w-full bg-gray-50 border border-transparent focus:border-[#CA3433] focus:ring-2 focus:ring-[#CA3433]/10 rounded-full py-2.5 pl-12 pr-4 text-sm font-medium focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Right Links & Auth */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center space-x-6 text-sm font-medium text-gray-500">
              <Link to="/search" className="px-3 py-1 bg-brand-lime text-gray-900 rounded-md font-semibold hover:bg-lime-400 transition-colors">{t('nav.home')}</Link>
              <button onClick={() => user ? navigate('/landlord') : dispatch(openAuthModal('login'))} className="hover:text-gray-900 transition-colors">{t('nav.list')}</button>
              <Link to="/nearby" className="hover:text-gray-900 transition-colors py-2">{t('nav.nearby')}</Link>
              <Link to="/about" className="hover:text-gray-900 transition-colors py-2">{t('nav.about')}</Link>
            </div>
            
            <div className="w-px h-6 bg-gray-200"></div>

            <button className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <div className="w-6 h-6 rounded-full bg-brand-50 flex items-center justify-center text-xs overflow-hidden border border-brand-100">
                <img src="/INR.webp" alt="INR" className="w-full h-full object-cover" />
              </div>
              INR <ChevronDown size={14} />
            </button>

            {loading ? (
              <Skeleton className="h-10 w-28 rounded-full" />
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(v => !v)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#0B0F19] text-white text-sm font-semibold hover:bg-[#FF3366] transition-all duration-300 transform hover:scale-105"
                >
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Avatar" className="w-5 h-5 rounded-full object-cover" />
                  ) : (
                    <User size={16} />
                  )}
                  <span>{profile?.full_name?.split(' ')[0] || 'Dashboard'}</span>
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden">
                      <div className="py-1">
                        <button
                          onClick={() => { navigate(role === 'landlord' ? '/landlord' : '/dashboard'); setUserMenuOpen(false) }}
                          className="w-full flex flex-col items-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          {t('nav.dashboard')}
                        </button>
                        <button
                          onClick={() => { navigate('/settings'); setUserMenuOpen(false) }}
                          className="w-full flex flex-col items-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100"
                        >
                          {t('nav.settings')}
                        </button>
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                        >
                           {t('nav.signOut')}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button 
                onClick={() => dispatch(openAuthModal('login'))}
                className="px-6 py-2.5 rounded-full bg-[#0B0F19] text-white text-sm font-semibold hover:bg-[#FF3366] transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl shadow-black/20"
              >
                {t('nav.login')}
              </button>
            )}
          </div>
          
           {/* Mobile hamburger */}
           <button
            className="md:hidden p-2 rounded-xl text-gray-900"
            onClick={() => dispatch(toggleMobileMenu())}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Secondary Navbar (Categories) */}
      {!location.pathname.startsWith('/property/') && !['/dashboard', '/settings', '/landlord', '/privacy', '/terms', '/cookies', '/refund', '/about'].some(r => location.pathname.startsWith(r)) && (
        <>
          <div className="w-full border-t border-b border-gray-100 bg-white flex relative">
            <div className="flex items-center h-16 px-4 sm:px-10 md:px-16 lg:px-20 gap-6 overflow-x-auto scrollbar-hide flex-1">
              <button 
                onClick={() => updateFilters({ type: '' })}
                className="flex items-center gap-2 px-6 h-full bg-gradient-to-r from-brand-pink to-brand-500 text-white font-semibold rounded-tr-3xl"
              >
                <Grid size={18} /> {t('nav.allCategory')}
              </button>

              <div className="flex items-center gap-8 px-4 font-semibold text-sm flex-1 whitespace-nowrap min-w-max">
                {categoryTabs.map(tab => (
                  <button 
                    key={tab.name}
                    onClick={() => {
                      updateFilters({ type: tab.value })
                      navigate(`/search?type=${tab.value}`)
                    }}
                    className={cn(
                      "flex items-center gap-2 h-16 border-b-2 transition-all px-2",
                      filters.type === tab.value ? "border-brand-purple text-brand-purple bg-purple-50/50" : "border-transparent text-gray-500 hover:text-gray-900"
                    )}
                  >
                    {tab.icon} {tab.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="hidden lg:flex items-center h-16 border-l border-gray-100 pl-6 pr-8 bg-white min-w-max relative cursor-pointer shrink-0" onClick={() => setCityMenuOpen(!cityMenuOpen)}>
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full border border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center shrink-0">
                    <img src="/1.webp" alt="City" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col text-sm">
                    <span className="font-semibold text-gray-900 leading-tight">{selectedCity}</span>
                    <span className="text-gray-500 text-xs">Uttarakhand</span>
                  </div>
                  <ChevronDown size={16} className={`text-gray-400 ml-4 transition-transform duration-200 ${cityMenuOpen ? 'rotate-180' : ''}`} />
                </div>

                {/* City Dropdown Menu */}
                {cityMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setCityMenuOpen(false); }} />
                    <div className="absolute right-4 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden py-2" onClick={(e) => e.stopPropagation()}>
                      {CITIES.map(city => (
                        <button
                          key={city}
                          onClick={() => {
                            setSelectedCity(city)
                            setCityMenuOpen(false)
                          }}
                          className={`w-full text-left px-5 py-2.5 text-sm font-semibold transition-colors ${selectedCity === city ? 'bg-brand-50 text-brand-600' : 'text-gray-700 hover:bg-gray-50'}`}
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
          </div>
          
          {/* Mobile Search Bar (Out of menu, above banner) */}
          <div className="md:hidden px-4 py-3 bg-white relative border-b border-gray-100 transition-all">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                id="mobile-search-outside"
                name="mobile-search-outside"
                value={filters.query || ''}
                placeholder={t('hero.searchPlaceholder')}
                onChange={handleLiveSearch}
                className="w-full bg-gray-50 border border-[#CA3433] rounded-full py-2.5 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#CA3433]/20 shadow-sm transition-all"
              />
            </div>
          </div>

          <BannerSlider />
        </>
      )}
      
       {/* Mobile Menu */}
       {mobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-white border-b border-gray-100 shadow-xl overflow-y-auto max-h-[80vh] z-50">
          <div className="px-4 py-4 space-y-4">
            
            <Link to="/search" onClick={() => dispatch(closeMobileMenu())} className="block font-semibold text-gray-700 py-2">{t('nav.home')}</Link>
            <button onClick={() => { dispatch(closeMobileMenu()); user ? navigate('/landlord') : dispatch(openAuthModal('login')) }} className="block w-full text-left font-semibold text-gray-700 py-2">{t('nav.list')}</button>
            <Link to="/nearby" onClick={() => dispatch(closeMobileMenu())} className="block w-full text-left font-semibold text-gray-700 py-2">{t('nav.nearby')}</Link>
            <Link to="/about" onClick={() => dispatch(closeMobileMenu())} className="block w-full text-left font-semibold text-gray-700 py-2">{t('nav.about')}</Link>
            
            <div className="w-full h-px bg-gray-100 my-4" />
            
            {user ? (
               <>
                <Link to={role === 'landlord' ? '/landlord' : '/dashboard'}
                  className="block font-semibold text-gray-700 py-2"
                  onClick={() => dispatch(closeMobileMenu())}
                >
                  {t('nav.dashboard')}
                </Link>
                <Link to="/settings"
                  className="block font-semibold text-gray-700 py-2"
                  onClick={() => dispatch(closeMobileMenu())}
                >
                  {t('nav.settings')}
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block font-semibold text-red-500 py-2"
                >
                  {t('nav.signOut')}
                </button>
               </>
            ) : (
              <button 
                onClick={() => { dispatch(openAuthModal('login')); dispatch(closeMobileMenu()); }}
                className="w-full py-3 rounded-full bg-[#0B0F19] text-white text-sm font-semibold hover:bg-[#FF3366] transition-all active:scale-95"
              >
                {t('nav.login')}
              </button>
            )}
          </div>
        </div>
       )}
    </nav>
  )
}
