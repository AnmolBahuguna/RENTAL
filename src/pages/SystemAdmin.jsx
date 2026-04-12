import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useServices } from '../hooks/useServices'
import { LogOut, ShieldAlert, ShieldCheck, Activity, Users, Building, AlertTriangle, FileText, CheckCircle, XCircle, Eye } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Modal } from '../components/ui/Modal'
import { Button } from '../components/ui/Button'
import toast from 'react-hot-toast'

export const SystemAdmin = () => {
  const { user, loading, signInWithGoogle, signOut } = useAuth()
  const { getAdminPendingServices, updateServiceStatus } = useServices()
  const navigate = useNavigate()
  
  const [stats, setStats] = useState({ users: 0, properties: 0, services: 0 })
  const [loadingStats, setLoadingStats] = useState(true)

  // Service Approvals State
  const [providers, setProviders] = useState([])
  const [loadingProviders, setLoadingProviders] = useState(true)
  const [selectedDoc, setSelectedDoc] = useState(null)

  const ADMIN_EMAIL = 'prriiyansunegi@gmail.com'

  useEffect(() => {
    // Only load stats if authorized
    if (user && user.email === ADMIN_EMAIL) {
      loadStats()
      loadProviders()
    }
  }, [user])

  const loadStats = async () => {
    try {
      const [uRes, pRes, sRes] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('properties').select('*', { count: 'exact', head: true }),
        supabase.from('service_providers').select('*', { count: 'exact', head: true })
      ])
      
      setStats({
        users: uRes.count || 0,
        properties: pRes.count || 0,
        services: sRes.count || 0
      })
    } catch (e) {
      console.error('Error loading admin stats:', e)
    } finally {
      setLoadingStats(false)
    }
  }

  const loadProviders = async () => {
    try {
      const data = await getAdminPendingServices()
      setProviders(data)
    } catch (e) {
      console.error('Failed to load pending services', e)
    } finally {
      setLoadingProviders(false)
    }
  }

  const handleAction = async (id, newStatus) => {
    const toastId = toast.loading(`Marking as ${newStatus}...`)
    try {
      await updateServiceStatus(id, newStatus)
      setProviders(prev => prev.map(p => p.id === id ? { ...p, verification_status: newStatus } : p))
      toast.success(`Service Provider ${newStatus}`, { id: toastId })
    } catch (err) {
      toast.error('Failed to update status', { id: toastId })
    }
  }

  const handleGoogleLogin = async () => {
    // Set the return path so they land back here after Google auth
    localStorage.setItem('sb_return_to', '/systemadmin')
    await signInWithGoogle()
  }

  // Still checking session loading from auth slice
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  // 1. Not Logged In -> Show Admin Google Login
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl text-center">
          <div className="w-20 h-20 bg-gray-800/50 rounded-full border border-gray-700 flex items-center justify-center mx-auto mb-6">
            <ShieldCheck size={40} className="text-blue-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">System Admin</h1>
          <p className="text-gray-400 text-sm mb-8">Authorized personnel only. Please sign in with the master administrator account to view the dashboard.</p>
          
          <button 
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 font-bold py-3.5 px-4 animate-in slide-in-from-bottom hover:bg-gray-100 transition-all rounded-xl hover:-translate-y-1 hover:shadow-lg hover:shadow-white/10 active:scale-95"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
            Continue with Google
          </button>
        </div>
      </div>
    )
  }

  // 2. Logged in, but WRONG EMAIL -> Access Denied!
  if (user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Warning Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <ShieldAlert size={800} className="text-red-600" />
        </div>
        
        <div className="max-w-md w-full bg-gray-900 border border-red-900/50 rounded-3xl p-8 relative z-10 text-center shadow-2xl shadow-red-900/20">
          <div className="w-20 h-20 bg-red-500/10 rounded-full border border-red-500/20 flex items-center justify-center mx-auto mb-6 animate-pulse">
            <AlertTriangle size={40} className="text-red-500" />
          </div>
          <h1 className="text-3xl font-extrabold text-red-500 mb-2 font-display">ACCESS DENIED</h1>
          <p className="text-gray-300 mb-6 text-sm">
            The account <strong className="text-white bg-gray-800 px-2 py-1 rounded mx-1">{user.email}</strong> does not have administrator privileges.
          </p>
          
          <button
            onClick={async () => { await signOut(); navigate('/systemadmin'); }}
            className="w-full py-3.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-bold transition-all flex items-center justify-center gap-2"
          >
            <LogOut size={18} /> Sign Out
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="w-full mt-3 py-3.5 rounded-xl border border-gray-700 text-gray-400 hover:text-white hover:border-gray-600 font-bold transition-all"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    )
  }

  // 3. SECURE ADMIN DASHBOARD (SUCCESS)
  return (
    <div className="min-h-screen bg-[#F9F8F6] text-gray-900">
      {/* Top Navbar */}
      <nav className="h-16 border-b border-gray-100 flex items-center justify-between px-6 bg-white/80 sticky top-0 backdrop-blur-xl z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-[#CA3433]" size={24} />
          <span className="font-bold tracking-widest uppercase text-sm text-gray-900">GoEazy<span className="text-[#CA3433]">_Admin</span></span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-gray-500 font-medium tracking-wide">Secure Session</p>
            <p className="text-sm font-bold text-gray-900">{user.email}</p>
          </div>
          <button 
            onClick={async () => { await signOut(); navigate('/'); }}
            className="w-10 h-10 rounded-full bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-all"
            title="Secure Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6 lg:p-10 space-y-10">
        
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-extrabold font-display">System Overview</h1>
          <p className="text-gray-500 mt-1 flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse outline outline-2 outline-green-100"></span>
            All systems nominal. You have database access.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 relative overflow-hidden group hover:border-[#CA3433]/30 transition-colors shadow-sm">
            <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-10 transition-opacity">
              <Users size={80} className="text-gray-900" />
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mb-4">
              <Users size={20} />
            </div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Total Users</p>
            {loadingStats ? <div className="h-10 w-24 bg-gray-100 rounded animate-pulse" /> : 
              <p className="text-4xl font-black text-gray-900">{stats.users}</p>}
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-6 relative overflow-hidden group hover:border-[#CA3433]/30 transition-colors shadow-sm">
            <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-10 transition-opacity">
              <Building size={80} className="text-gray-900" />
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
              <Building size={20} />
            </div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Total Properties</p>
            {loadingStats ? <div className="h-10 w-24 bg-gray-100 rounded animate-pulse" /> : 
              <p className="text-4xl font-black text-gray-900">{stats.properties}</p>}
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-6 relative overflow-hidden group hover:border-[#CA3433]/30 transition-colors shadow-sm">
            <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-10 transition-opacity">
              <Activity size={80} className="text-gray-900" />
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center mb-4">
              <Activity size={20} />
            </div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Service Providers</p>
            {loadingStats ? <div className="h-10 w-24 bg-gray-100 rounded animate-pulse" /> : 
              <p className="text-4xl font-black text-gray-900">{stats.services}</p>}
          </div>
        </div>

        {/* ── APPROVAL WORKFLOW ── */}
        <div>
          <h2 className="text-2xl font-bold font-display mb-6">Service Provider Approvals</h2>
          
          {loadingProviders ? (
            <div className="space-y-4">
              {[1,2,3].map(i => <div key={i} className="h-28 bg-white border border-gray-100 shadow-sm animate-pulse rounded-2xl" />)}
            </div>
          ) : providers.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-300">
              <CheckCircle className="mx-auto text-gray-300 mb-3" size={40} />
              <p className="text-gray-500 font-medium">All caught up! No service providers waiting for approval.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {providers.map(p => (
                <div key={p.id} className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 flex flex-col md:flex-row gap-6 justify-between hover:border-gray-200 transition-colors">
                  
                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{p.name}</h3>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                        ${p.verification_status === 'pending' ? 'bg-amber-100 text-amber-700' : ''}
                        ${p.verification_status === 'verified' ? 'bg-green-100 text-green-700' : ''}
                        ${p.verification_status === 'rejected' ? 'bg-red-100 text-red-700' : ''}
                      `}>
                        {p.verification_status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Owner: <span className="font-semibold text-gray-900">{p.profiles?.full_name}</span> ({p.profiles?.email})</p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <p><strong className="text-gray-400 font-medium mr-1 uppercase text-[10px] tracking-wider">Category</strong> <span className="capitalize">{p.category}</span></p>
                      <p><strong className="text-gray-400 font-medium mr-1 uppercase text-[10px] tracking-wider">Location</strong> {p.area}, {p.city}</p>
                      <p>
                        <strong className="text-gray-400 font-medium mr-1 uppercase text-[10px] tracking-wider">Fee</strong> 
                        <span className={`font-bold ${p.payment_status === 'paid' ? 'text-green-600' : 'text-amber-500'}`}>{p.payment_status?.toUpperCase() || 'UNPAID'}</span>
                      </p>
                    </div>
                  </div>

                  {/* Documents & Actions */}
                  <div className="flex flex-col items-end gap-3 justify-center border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 w-full md:w-auto">
                    {p.documents?.length > 0 ? (
                      <button 
                        onClick={() => setSelectedDoc(p.documents[0])}
                        className="flex items-center gap-2 text-sm font-semibold text-[#CA3433] hover:text-white bg-red-50 hover:bg-[#CA3433] px-4 py-2 rounded-xl transition-colors w-full md:w-auto justify-center"
                      >
                        <FileText size={16} /> View Document
                      </button>
                    ) : (
                      <span className="text-sm text-gray-400 italic">No Document Provided</span>
                    )}

                    <div className="flex gap-2 w-full md:w-auto mt-2">
                      <button 
                        onClick={() => handleAction(p.id, 'verified')}
                        disabled={p.verification_status === 'verified'}
                        className="flex-1 md:flex-none flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:hover:bg-green-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95"
                      >
                        <CheckCircle size={16} /> Approve
                      </button>
                      <button 
                        onClick={() => handleAction(p.id, 'rejected')}
                        disabled={p.verification_status === 'rejected'}
                        className="flex-1 md:flex-none flex items-center justify-center gap-1.5 bg-gray-100 hover:bg-red-100 hover:text-red-600 disabled:opacity-50 text-gray-600 px-5 py-2.5 rounded-xl text-sm font-bold transition-colors active:scale-95"
                      >
                        <XCircle size={16} /> Reject
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

        {/* Document Modal */}
        <Modal open={!!selectedDoc} onClose={() => setSelectedDoc(null)} size="lg" className="bg-white">
          <div className="p-2">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 font-display">Document Viewer</h3>
            </div>
            {selectedDoc && (
              <div className="rounded-xl overflow-hidden bg-gray-50 border border-gray-200 flex items-center justify-center min-h-[400px]">
                {selectedDoc.toLowerCase().endsWith('.pdf') ? (
                  <iframe src={selectedDoc} className="w-full h-[60vh] rounded-xl" title="Document" />
                ) : (
                  <img src={selectedDoc} alt="Document" className="max-w-full max-h-[70vh] object-contain" />
                )}
              </div>
            )}
            <div className="mt-4 flex justify-end">
              <Button onClick={() => setSelectedDoc(null)} variant="secondary" className="font-bold">Close Viewer</Button>
            </div>
          </div>
        </Modal>

        {/* Database Warning */}
        <div className="bg-red-50 border border-red-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-red-100 flex flex-shrink-0 items-center justify-center">
              <ShieldAlert className="text-red-600" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Restricted Root Zone</h3>
              <p className="text-gray-600 text-sm leading-relaxed max-w-3xl">
                You are viewing real production data. Direct database modifications from this panel are logged. 
                For deeper manipulation like adding new tables or managing strict security roles, kindly use the direct Supabase Admin Dashboard.
              </p>
            </div>
          </div>
        </div>

      </main>
    </div>
  )
}
