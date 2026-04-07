import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { supabase } from '../lib/supabase'
import { setUser, setProfile, logout, setLoading } from '../store/authSlice'

export const useAuth = () => {
  const dispatch = useDispatch()
  const { user, profile, role, loading, authModalOpen, authModalTab } = useSelector(s => s.auth)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {

      if (error) console.error('Auth: Session error', error)
      
      dispatch(setUser(session?.user ?? null))
      if (session?.user) fetchProfile(session.user.id)
      else dispatch(setLoading(false))
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {

      
      dispatch(setUser(session?.user ?? null))
      if (session?.user) {
        fetchProfile(session.user.id)
      } else if (event === 'SIGNED_OUT') {
        dispatch(logout())
      } else {
        dispatch(setLoading(false))
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId) => {
    try {
      // First try to fetch
      let { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()
      
      // If no profile exists (e.g., first-time OAuth), create one automatically
      if (!data && !error) {

        const { data: { user } } = await supabase.auth.getUser()
        const fullName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
        
        const { data: newProfile, error: upsertError } = await supabase
          .from('profiles')
          .upsert({
            id: userId,
            email: user?.email,
            full_name: fullName,
            avatar_url: user?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${fullName}`,
            created_at: new Date().toISOString()
          })
          .select()
          .maybeSingle()

        if (upsertError) {
          console.error('Auth: Profile creation failed', upsertError)
          throw upsertError
        }
        data = newProfile
      } else if (error) {
        console.error('Auth: Profile fetch error', error)
        throw error
      }


      dispatch(setProfile(data))
    } catch (err) {
      console.error('Auth: fetchProfile catch block', err)
      dispatch(setLoading(false))
    }
  }

  const signUp = async ({ email, password, name, role }) => {
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name } },
    })
    if (error) throw error

    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email,
        full_name: name,
        role,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
        created_at: new Date().toISOString(),
      })
    }
    return data
  }

  const signIn = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  const signInWithGoogle = async () => {
    // Priority: Saved return path > Env variable > current origin
    const savedPath = localStorage.getItem('sb_return_to')
    const redirectUrl = savedPath 
      ? `${window.location.origin}${savedPath}`
      : (import.meta.env.VITE_REDIRECT_URL || `${window.location.origin}/search`)
    
    console.log('Auth: Initiating Google Sign-In with redirect:', redirectUrl)

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { 
        redirectTo: redirectUrl,
        queryParams: {
          prompt: 'select_account'
        }
      },
    })
    if (error) throw error
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    dispatch(logout())
  }

  const updateProfile = async (updates) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .maybeSingle()
    if (error) throw error
    dispatch(setProfile(data))
    return data
  }

  return { user, profile, role, loading, authModalOpen, authModalTab, signUp, signIn, signInWithGoogle, signOut, updateProfile }
}
