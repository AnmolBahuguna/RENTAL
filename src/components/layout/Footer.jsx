import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Home, Mail, Phone } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { openAuthModal } from '../../store/authSlice'

export const Footer = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector(s => s.auth)

  const handleLandlordClick = (e) => {
    e.preventDefault()
    if (user) {
      navigate('/landlord')
    } else {
      localStorage.setItem('sb_return_to', '/landlord')
      dispatch(openAuthModal('signup'))
    }
  }

  // Renter links navigate directly to the correct search category
  const renterLinks = [
    { label: t('footer.links.rooms'), to: '/search?type=Room' },
    { label: t('footer.links.flats'), to: '/search?type=Flat' },
    { label: t('footer.links.hostels'), to: '/search?type=Hostel' },
    { label: t('footer.links.pgs'), to: '/search?type=PG' },
  ]

  // Landlord links (pricing removed)
  const landlordLinks = [
    { label: t('footer.links.list') },
    { label: t('footer.links.manage') },
    { label: t('footer.links.analytics') },
    { label: t('footer.links.dashboard') },
  ]

  return (
    <footer className="bg-gray-950 text-gray-300 mt-20">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6 group cursor-pointer">
              <div className="w-9 h-9 rounded-lg border-2 border-brand-500 rounded-tl-xl rounded-br-xl bg-white shadow-sm flex items-center justify-center font-bold font-display rotate-3 group-hover:rotate-6 transition-transform">
                <div className="-rotate-3 flex items-end justify-center">
                  <span className="text-brand-500 text-[20px] font-black leading-none">G</span>
                  <span className="text-brand-600 text-[14px] font-black leading-none rotate-12 -ml-0.5 mb-0.5">E</span>
                </div>
              </div>
              <span className="font-display font-bold text-2xl text-white tracking-tight">
                GoEazy
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              {t('footer.description')}
            </p>
            <div className="flex gap-3">
              {/* Add social links here if needed */}
            </div>
          </div>

          {/* Link Sections Container */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-2">
            {/* For Users */}
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">{t('footer.forRenters')}</h4>
              <ul className="space-y-2.5">
                {renterLinks.map(item => (
                  <li key={item.label}>
                    <Link to={item.to} className="text-sm text-gray-400 hover:text-white transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* For Landlords */}
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">{t('footer.forLandlords')}</h4>
              <ul className="space-y-2.5">
                {landlordLinks.map(item => (
                  <li key={item.label}>
                    <button onClick={handleLandlordClick} className="text-sm text-gray-400 hover:text-white transition-colors text-left">
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">{t('footer.contact')}</h4>
            <div className="space-y-3">
              <a href="mailto:supportgoeazy@gmail.com" className="flex items-center gap-2.5 text-sm text-gray-400 hover:text-white transition-colors">
                <Mail size={15} className="text-brand-400" /> supportgoeazy@gmail.com
              </a>
              <a href="tel:8979452055" className="flex items-center gap-2.5 text-sm text-gray-400 hover:text-white transition-colors">
                <Phone size={15} className="text-brand-400" /> +91 89794 52055
              </a>
            </div>
            <div className="mt-6 p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
              <p className="text-xs text-gray-400 mb-1">{t('footer.availableIndia')}</p>
              <p className="text-sm font-semibold text-white">{t('footer.cities')}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">{t('footer.allRights')}</p>
          <div className="flex flex-wrap gap-6 justify-center sm:justify-end">
            {[
              { label: t('footer.links.privacy'), to: '/privacy' },
              { label: t('footer.links.terms'), to: '/terms' },
              { label: t('footer.links.cookie'), to: '/cookies' },
              { label: t('footer.links.refund'), to: '/refund' }
            ].map(item => (
              <Link key={item.label} to={item.to} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">{item.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
