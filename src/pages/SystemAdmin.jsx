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
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Top Navbar */}
      <nav className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-black/50 sticky top-0 backdrop-blur-xl z-50">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-brand-500" size={24} />
          <span className="font-bold tracking-widest uppercase text-sm">GoEazy<span className="text-brand-500">_Admin</span></span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-gray-400 font-medium">Logged in securely as</p>
            <p className="text-sm font-bold text-gray-200">{user.email}</p>
          </div>
          <button 
            onClick={async () => { await signOut(); navigate('/'); }}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-500 flex items-center justify-center transition-all"
            title="Secure Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6 lg:p-10 space-y-12">
        
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-extrabold font-display">System Overview</h1>
          <p className="text-gray-400 mt-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            All systems nominal. You have root access.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-brand-500/50 transition-colors">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Users size={80} />
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-4">
              <Users size={20} />
            </div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Total Users</p>
            {loadingStats ? <div className="h-10 w-24 bg-white/10 rounded animate-pulse" /> : 
              <p className="text-5xl font-black text-white">{stats.users}</p>}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-brand-500/50 transition-colors">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Building size={80} />
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 flex items-center justify-center mb-4">
              <Building size={20} />
            </div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Total Properties</p>
            {loadingStats ? <div className="h-10 w-24 bg-white/10 rounded animate-pulse" /> : 
              <p className="text-5xl font-black text-white">{stats.properties}</p>}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-brand-500/50 transition-colors">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Activity size={80} />
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400 flex items-center justify-center mb-4">
              <Activity size={20} />
            </div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Service Providers</p>
            {loadingStats ? <div className="h-10 w-24 bg-white/10 rounded animate-pulse" /> : 
              <p className="text-5xl font-black text-white">{stats.services}</p>}
          </div>
        </div>

        {/* ── APPROVAL WORKFLOW ── */}
        <div>
          <h2 className="text-2xl font-bold font-display mb-4 border-b border-white/10 pb-2">Service Provider Approvals</h2>
          
          {loadingProviders ? (
            <div className="space-y-4">
              {[1,2,3].map(i => <div key={i} className="h-20 bg-white/5 animate-pulse rounded-xl" />)}
            </div>
          ) : providers.length === 0 ? (
            <div className="bg-white/5 rounded-2xl p-10 text-center border border-dashed border-white/10">
              <p className="text-gray-400">No service providers looking for approval.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {providers.map(p => (
                <div key={p.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col md:flex-row gap-6 justify-between hover:bg-white/10 transition-colors">
                  
                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-bold">{p.name}</h3>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase
                        ${p.verification_status === 'pending' ? 'bg-amber-500/20 text-amber-400' : ''}
                        ${p.verification_status === 'verified' ? 'bg-green-500/20 text-green-400' : ''}
                        ${p.verification_status === 'rejected' ? 'bg-red-500/20 text-red-400' : ''}
                      `}>
                        {p.verification_status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">Owner: {p.profiles?.full_name} ({p.profiles?.email})</p>
                    <p className="text-sm text-gray-300"><strong>Category:</strong> {p.category} | <strong>Area:</strong> {p.area}, {p.city}</p>
                    <p className="text-sm text-gray-300 mt-1"><strong>Payment:</strong> <span className={p.payment_status === 'paid' ? 'text-green-400' : 'text-amber-400'}>{p.payment_status?.toUpperCase() || 'UNKNOWN'}</span></p>
                  </div>

                  {/* Documents & Actions */}
                  <div className="flex flex-col items-end gap-3 justify-center border-l md:border-white/10 md:pl-6">
                    {p.documents?.length > 0 ? (
                      <button 
                        onClick={() => setSelectedDoc(p.documents[0])}
                        className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 bg-blue-500/10 px-4 py-2 rounded-xl transition-colors w-full md:w-auto justify-center"
                      >
                        <FileText size={16} /> View Document
                      </button>
                    ) : (
                      <span className="text-sm text-gray-500">No Document Uploaded</span>
                    )}

                    <div className="flex gap-2 w-full md:w-auto">
                      <button 
                        onClick={() => handleAction(p.id, 'verified')}
                        disabled={p.verification_status === 'verified'}
                        className="flex-1 md:flex-none flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:hover:bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
                      >
                        <CheckCircle size={16} /> Approve
                      </button>
                      <button 
                        onClick={() => handleAction(p.id, 'rejected')}
                        disabled={p.verification_status === 'rejected'}
                        className="flex-1 md:flex-none flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
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
        <Modal open={!!selectedDoc} onClose={() => setSelectedDoc(null)} size="lg" className="bg-gray-900 border border-gray-800">
          <div className="p-2">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Document Viewer</h3>
            </div>
            {selectedDoc && (
              <div className="rounded-xl overflow-hidden bg-black/50 border border-white/5 flex items-center justify-center min-h-[400px]">
                {selectedDoc.toLowerCase().endsWith('.pdf') ? (
                  <iframe src={selectedDoc} className="w-full h-[60vh] rounded-xl" title="Document" />
                ) : (
                  <img src={selectedDoc} alt="Document" className="max-w-full max-h-[70vh] object-contain" />
                )}
              </div>
            )}
            <div className="mt-4 flex justify-end">
              <Button onClick={() => setSelectedDoc(null)} variant="secondary" className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700">Close Viewer</Button>
            </div>
          </div>
        </Modal>

        {/* Database Warning */}
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <ShieldAlert className="text-red-500 shrink-0 mt-1" size={24} />
            <div>
              <h3 className="text-lg font-bold text-red-500 mb-1">Restricted Root Zone</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                You are viewing real production data. Direct database modifications are heavily restricted. 
                For deeper manipulation like adding new tables or managing users perfectly, use the direct Supabase Admin Panel.
              </p>
            </div>
          </div>
        </div>

      </main>
    </div>
  )
}
