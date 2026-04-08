import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Eye, EyeOff, Home, GraduationCap } from 'lucide-react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { closeAuthModal, openAuthModal } from '../../store/authSlice'
import { useAuth } from '../../hooks/useAuth'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'

const ROLE_OPTIONS = [
  { value: 'user',     label: 'Student / Professional', icon: <GraduationCap size={20} className="text-brand-500" /> },
  { value: 'landlord', label: 'Landlord / Owner',        icon: <Home size={20} className="text-brand-500" /> },
]

export const AuthModal = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { authModalOpen, authModalTab } = useSelector(s => s.auth)
  const { signIn, signUp, signInWithGoogle } = useAuth()

  const [tab, setTab] = useState(authModalTab)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [selectedRole, setSelectedRole] = useState('user')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState({})

  React.useEffect(() => { setTab(authModalTab) }, [authModalTab])

  const validate = () => {
    const e = {}
    if (tab === 'signup' && !form.name.trim()) e.name = 'Name is required'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required'
    if (form.password.length < 6) e.password = 'Min 6 characters'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      if (tab === 'login') {
        await signIn({ email: form.email, password: form.password })
        toast.success('Welcome back!')
        dispatch(closeAuthModal())
        
        const returnTo = localStorage.getItem('sb_return_to')
        if (returnTo) {
          navigate(returnTo)
          localStorage.removeItem('sb_return_to')
        }
      } else {
        await signUp({ email: form.email, password: form.password, name: form.name, role: selectedRole })
        toast.success('Account created! Check your email to confirm.')
        const returnTo = localStorage.getItem('sb_return_to')
        dispatch(closeAuthModal())
        if (selectedRole === 'landlord') {
          navigate('/landlord')
        } else if (returnTo) {
          navigate(returnTo)
          localStorage.removeItem('sb_return_to')
        } else {
          navigate('/dashboard')
        }
      }
    } catch (err) {
      toast.error(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    // Save current path to return back after OAuth redirect
    localStorage.setItem('sb_return_to', window.location.pathname + window.location.search)
    
    setGoogleLoading(true)
    try {
      await signInWithGoogle()
    } catch (err) {
      toast.error(err.message || 'Google sign-in failed')
      setGoogleLoading(false)
    }
  }

  return (
    <Modal open={authModalOpen} onClose={() => dispatch(closeAuthModal())} size="sm">
      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-6">
        {['login', 'signup'].map(t => (
          <button
            key={t}
            onClick={() => { setTab(t); setErrors({}) }}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
              tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t === 'login' ? 'Sign In' : 'Sign Up'}
          </button>
        ))}
      </div>

      {/* Google OAuth */}
      <Button
        variant="secondary"
        size="lg"
        className="w-full mb-4"
        loading={googleLoading}
        onClick={handleGoogle}
      >
        Continue with Google
      </Button>

      <div className="relative flex items-center gap-3 mb-4">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400 font-medium">or continue with email</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {tab === 'signup' && (
          <Input
            label="Full Name"
            placeholder="Priya Sharma"
            leftIcon={<User size={16} />}
            value={form.name}
            onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErrors(v => ({ ...v, name: '' })) }}
            error={errors.name}
            autoComplete="name"
          />
        )}

        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          leftIcon={<Mail size={16} />}
          value={form.email}
          onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(v => ({ ...v, email: '' })) }}
          error={errors.email}
          autoComplete="email"
        />

        <Input
          label="Password"
          type={showPass ? 'text' : 'password'}
          placeholder={tab === 'signup' ? 'Min 6 characters' : '••••••••'}
          leftIcon={<Lock size={16} />}
          rightIcon={
            <button type="button" onClick={() => setShowPass(v => !v)} className="cursor-pointer">
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
          value={form.password}
          onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setErrors(v => ({ ...v, password: '' })) }}
          error={errors.password}
          autoComplete={tab === 'signup' ? 'new-password' : 'current-password'}
        />

        {/* Role Selector (Sign Up only) */}
        {tab === 'signup' && (
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">I am a...</p>
            <div className="grid grid-cols-2 gap-3">
              {ROLE_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSelectedRole(opt.value)}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                    selectedRole === opt.value
                      ? 'border-brand-500 bg-brand-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-xl mb-1">{opt.icon}</div>
                  <p className="text-sm font-semibold text-gray-900">{opt.label}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        <Button type="submit" variant="primary" size="lg" className="w-full" loading={loading}>
          {tab === 'login' ? 'Sign In' : 'Create Account'}
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-4">
        {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
        <button
          className="text-brand-500 font-semibold hover:underline"
          onClick={() => { setTab(tab === 'login' ? 'signup' : 'login'); setErrors({}) }}
        >
          {tab === 'login' ? 'Sign Up' : 'Sign In'}
        </button>
      </p>
    </Modal>
  )
}
