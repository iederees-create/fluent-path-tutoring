import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AuthCallback() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleAuthCallback = async () => {
      const params = new URLSearchParams(location.search)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (params.get('type') === 'recovery' || location.hash.includes('type=recovery')) {
        navigate('/update-password')
        return
      }

      if (user) {
        const role = user.user_metadata?.role || 'learner'
        
        // Ensure user has a profile in public.profiles table
        try {
          const { data: profile, error: fetchError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle()

          if (!profile && !fetchError) {
            // Insert a default profile record
            await supabase.from('profiles').insert({
              id: user.id,
              email: user.email,
              role: role,
              learning_hours: 24,
              lessons_done: 18,
              current_level: 'B2+',
              subscription_plan: 'Pay As You Go'
            })
          }
        } catch (err) {
          console.error("Error creating/checking user profile:", err)
        }

        // Differentiate between practitioner and looking for services (learner)
        if (role === 'practitioner') {
          navigate('/expert')
        } else {
          navigate('/dashboard') // Route learner straight to dashboard
        }
      } else {
        navigate('/auth')
      }
    }

    handleAuthCallback()
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 font-medium font-display uppercase tracking-widest text-xs">Authenticating...</p>
      </div>
    </div>
  )
}
