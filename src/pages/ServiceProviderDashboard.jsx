import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  Plus, Edit2, Trash2, Eye, CheckCircle, AlertCircle,
  Clock, Star, ChevronRight, BarChart2, Users, Package,
} from 'lucide-react'
import { useServices } from '../hooks/useServices'
import { Button } from '../components/ui/Button'
import { Skeleton } from '../components/ui/Skeleton'
import toast from 'react-hot-toast'

const CATEGORY_CONFIG = {
  tiffin:   { label: 'Tiffin',   emoji: '🍱', color: 'bg-amber-100 text-amber-700' },
  laundry:  { label: 'Laundry',  emoji: '🧺', color: 'bg-blue-100 text-blue-700'  },
  cleaning: { label: 'Cleaning', emoji: '🧹', color: 'bg-green-100 text-green-700' },
}

const StatusBadge = ({ status }) => {
  const map = {
    verified: { icon: CheckCircle, text: 'Verified', cls: 'text-green-700 bg-green-50' },
    pending:  { icon: AlertCircle, text: 'Pending Verification', cls: 'text-amber-700 bg-amber-50' },
    rejected: { icon: Clock,       text: 'Rejected', cls: 'text-red-700 bg-red-50' },
  }
  const conf = map[status] || map.pending
  const Icon = conf.icon
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${conf.cls}`}>
      <Icon size={11} /> {conf.text}
    </span>
  )
}

export const ServiceProviderDashboard = () => {
  const navigate = useNavigate()
  const { profile } = useSelector(s => s.auth)
  const { getMyServices, deleteService } = useServices()

  const [myServices, setMyServices] = useState([])
  const [loading, setLoading] = useState(true)

  const loadMyServices = async () => {
    setLoading(true)
    try {
      const data = await getMyServices()
      setMyServices(data)
    } catch (err) {
      toast.error('Could not load your listings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadMyServices() }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return
    try {
      await deleteService(id)
      setMyServices(v => v.filter(s => s.id !== id))
      toast.success('Listing deleted')
    } catch {
      toast.error('Could not delete listing')
    }
  }

  // Stats
  const totalViews = myServices.reduce((sum, s) => sum + (s.views || 0), 0)
  const verified = myServices.filter(s => s.verification_status === 'verified').length

  return (
    <div className="pt-6 pb-20 min-h-screen bg-gray-50/50">
      <div className="w-full px-4 sm:px-10 md:px-16 lg:px-20 max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">
              Service Provider Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Welcome back, <span className="font-semibold text-gray-700">{profile?.full_name || 'Provider'}</span>
            </p>
          </div>
          <Button
            variant="primary"
            className="bg-[#CA3433] hover:bg-[#ac2d2c] rounded-xl gap-2 shadow-lg shadow-[#CA3433]/20 shrink-0"
            onClick={() => navigate('/service-provider/new')}
          >
            <Plus size={16} /> Add New Listing
          </Button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Listings', value: myServices.length, icon: Package, color: 'text-[#CA3433]' },
            { label: 'Total Views',    value: totalViews,         icon: Eye,     color: 'text-blue-500' },
            { label: 'Verified',       value: verified,           icon: CheckCircle, color: 'text-green-500' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
              <stat.icon size={20} className={`mx-auto mb-2 ${stat.color}`} />
              <p className="text-2xl font-extrabold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-400 font-medium mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Listings */}
        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}
          </div>
        ) : myServices.length > 0 ? (
          <div className="space-y-4">
            {myServices.map(service => {
              const cat = CATEGORY_CONFIG[service.category] || {}
              return (
                <div key={service.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-md transition-all">
                  {/* Category Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${cat.color || 'bg-gray-100'} border border-gray-100`}>
                    {cat.emoji}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <h3 className="font-bold text-gray-900 text-base leading-tight">{service.name}</h3>
                      <StatusBadge status={service.verification_status} />
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${service.is_open ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                        {service.is_open ? 'Open' : 'Closed'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {service.area}{service.city ? `, ${service.city}` : ''}{service.state ? ` · ${service.state}` : ''}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Eye size={11} /> {service.views || 0} views</span>
                      <span className="flex items-center gap-1"><Package size={11} /> {service.service_listings?.length || 0} items</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => navigate(`/services/${service.id}`)}
                      className="p-2.5 rounded-xl border border-gray-200 text-gray-500 hover:text-[#CA3433] hover:border-[#CA3433]/30 transition-all"
                      title="View"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="p-2.5 rounded-xl border border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-200 transition-all"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No listings yet</h3>
            <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">
              Create your first service listing and start connecting with customers!
            </p>
            <Button variant="primary" className="bg-[#CA3433] hover:bg-[#ac2d2c] rounded-xl gap-2"
              onClick={() => navigate('/service-provider/new')}>
              <Plus size={16} /> Create First Listing
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
