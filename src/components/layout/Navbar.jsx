import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Search, ChevronDown, User, LogOut, Home, Building, Tent, MapPin, Grid, PlusCircle, LayoutDashboard, Menu, X } from 'lucide-react'
import { openAuthModal } from '../../store/authSlice'
import { toggleMobileMenu, closeMobileMenu } from '../../store/uiSlice'
import { useAuth } from '../../hooks/useAuth'
import { useProperties } from '../../hooks/useProperties'
import { cn, getInitials } from '../../utils/helpers'

export const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, profile, role, signOut } = useAuth()
  const { filters, updateFilters } = useProperties()
  const { mobileMenuOpen } = useSelector(s => s.ui)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    setUserMenuOpen(false)
    navigate('/')
  }

  const categoryTabs = [
    { name: 'Rooms', value: 'Room', icon: <Home size={18} /> },
    { name: 'Flats', value: 'Flat', icon: <Building size={18} /> },
    { name: 'Hostels', value: 'Hostel', icon: <Tent size={18} /> },
    { name: 'PGs', value: 'PG', icon: <Building size={18} /> },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white">
      {/* Top Navbar */}
      <div className="w-full mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & EN */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg border-2 border-brand-500 rounded-tl-xl rounded-br-xl text-brand-500 flex flex-col items-center justify-center font-bold font-display rotate-3">
                <span className="-rotate-3 text-lg leading-none">A</span>
              </div>
              <span className="font-display font-bold text-2xl text-gray-900 tracking-tight">
                aceplace
              </span>
            </Link>
            <button className="hidden md:flex items-center gap-1 text-sm font-semibold text-gray-700">
              EN <ChevronDown size={14} />
            </button>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search"
                className="w-full bg-gray-50 border-none rounded-full py-2.5 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
            </div>
          </div>

          {/* Right Links & Auth */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center space-x-6 text-sm font-medium text-gray-500">
              <button className="px-3 py-1 bg-brand-lime text-gray-900 rounded-md font-semibold">Buy</button>
              <button className="hover:text-gray-900">Sell</button>
              <button className="hover:text-gray-900">Rent</button>
              <button className="hover:text-gray-900">Contact us</button>
            </div>
            
            <div className="w-px h-6 bg-gray-200"></div>

            <button className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs overflow-hidden border border-gray-200">
                🇺🇸
              </div>
              USD <ChevronDown size={14} />
            </button>

            {user ? (
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
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 z-20 overflow-hidden">
                      <div className="py-1">
                        <button
                          onClick={() => { navigate(role === 'landlord' ? '/landlord' : '/dashboard'); setUserMenuOpen(false) }}
                          className="w-full flex flex-col items-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Dashboard
                        </button>
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                        >
                           Sign Out
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
                Login
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
      <div className="w-full border-t border-b border-gray-100 bg-white">
        <div className="flex items-center h-16 ml-4 sm:ml-8 gap-6 overflow-x-auto scrollbar-hide">
          <button 
            onClick={() => updateFilters({ type: '' })}
            className="flex items-center gap-2 px-6 h-full bg-gradient-to-r from-brand-pink to-brand-500 text-white font-semibold rounded-tr-3xl"
          >
            <Grid size={18} /> ALL CATEGORY <ChevronDown size={16} />
          </button>

          <div className="flex items-center gap-8 px-4 font-semibold text-sm flex-1 whitespace-nowrap min-w-max">
            {categoryTabs.map(tab => (
              <button 
                key={tab.name}
                onClick={() => {
                  updateFilters({ type: tab.value })
                  if(window.location.pathname !== '/search') navigate('/search')
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

          <div className="hidden lg:flex items-center h-16 border-l border-gray-100 pl-6 pr-8 bg-white min-w-max">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full border border-gray-200 overflow-hidden bg-blue-50 flex items-center justify-center p-1">
                <MapPin size={24} className="text-pink-400 absolute" />
              </div>
              <div className="flex flex-col text-sm">
                <span className="font-semibold text-gray-900 leading-tight">Dubai City</span>
                <span className="text-gray-500 text-xs">Jumeirah</span>
              </div>
              <ChevronDown size={16} className="text-gray-400 ml-4" />
            </div>
          </div>
        </div>
      </div>
      
       {/* Mobile Menu */}
       {mobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-white border-b border-gray-100 shadow-xl overflow-y-auto max-h-[80vh]">
          <div className="px-4 py-4 space-y-4">
             <div className="relative w-full mb-4">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search"
                className="w-full bg-gray-50 border-none rounded-full py-3 pl-12 pr-4 text-sm font-medium focus:outline-none"
              />
            </div>
            
            <Link className="block font-semibold text-gray-700 py-2">Buy</Link>
            <Link className="block font-semibold text-gray-700 py-2">Sell</Link>
            <Link className="block font-semibold text-gray-700 py-2">Rent</Link>
            <Link className="block font-semibold text-gray-700 py-2">Contact us</Link>
            
            <div className="w-full h-px bg-gray-100 my-4" />
            
            {user ? (
               <>
                <Link to={role === 'landlord' ? '/landlord' : '/dashboard'}
                  className="block font-semibold text-gray-700 py-2"
                  onClick={() => dispatch(closeMobileMenu())}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block font-semibold text-red-500 py-2"
                >
                  Sign Out
                </button>
               </>
            ) : (
              <button 
                onClick={() => { dispatch(openAuthModal('login')); dispatch(closeMobileMenu()); }}
                className="w-full py-3 rounded-full bg-[#0B0F19] text-white text-sm font-semibold hover:bg-[#FF3366] transition-all active:scale-95"
              >
                Login
              </button>
            )}
          </div>
        </div>
       )}
    </nav>
  )
}
