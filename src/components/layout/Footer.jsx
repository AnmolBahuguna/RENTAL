import React from 'react'
import { Link } from 'react-router-dom'
import { Home, Mail, Phone } from 'lucide-react'

export const Footer = () => {
  return (
    <footer className="bg-gray-950 text-gray-300 mt-20">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand-500 rounded-xl flex items-center justify-center">
                <Home size={16} className="text-white" />
              </div>
              <span className="font-display font-bold text-xl text-white tracking-tight">
                GO<span className="text-brand-400">EASY</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              India's premium platform for students and professionals to find their perfect home away from home.
            </p>
            <div className="flex gap-3">
              {/* Add social links here if needed */}
            </div>
          </div>

          {/* For Users */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">For Renters</h4>
            <ul className="space-y-2.5">
              {['Browse Rooms', 'Browse Flats', 'Browse Hostels', 'Browse PGs', 'Search by City'].map(item => (
                <li key={item}>
                  <Link to="/search" className="text-sm text-gray-400 hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Landlords */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">For Landlords</h4>
            <ul className="space-y-2.5">
              {['List a Property', 'Manage Listings', 'View Analytics', 'Landlord Dashboard', 'Pricing Plans'].map(item => (
                <li key={item}>
                  <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <div className="space-y-3">
              <a href="mailto:hello@goeazy.in" className="flex items-center gap-2.5 text-sm text-gray-400 hover:text-white transition-colors">
                <Mail size={15} className="text-brand-400" /> hello@goeazy.in
              </a>
              <a href="tel:+918000000000" className="flex items-center gap-2.5 text-sm text-gray-400 hover:text-white transition-colors">
                <Phone size={15} className="text-brand-400" /> +91 80000 00000
              </a>
            </div>
            <div className="mt-6 p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
              <p className="text-xs text-gray-400 mb-1">Available across India</p>
              <p className="text-sm font-semibold text-white">Mumbai · Delhi · Bangalore · Pune · Hyderabad</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">© 2024 GoEazy. All rights reserved.</p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
              <a key={item} href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
