import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      const params = new URLSearchParams(window.location.search)
      
      if (params.get('type') === 'recovery') {
        navigate('/update-password')
        return
      }

      if (user) {
        const role = user.user_metadata?.role
        // Differentiate between practitioner and looking for services (learner)
        if (role === 'practitioner') {
          navigate('/expert')
        } else {
          navigate('/')
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
