import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { User } from '@supabase/supabase-js'
import { useToast } from '@/hooks/use-toast'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isMasterAccount, setIsMasterAccount] = useState(false)
  const { toast } = useToast()

  // Master account API key
  const MASTER_API_KEY = "W1is4qaPMP6ZbyivKK6Fl8gww53476vXI8M4NSFp"
  const MASTER_EMAIL = "master@grid.com" // Configure this with your actual master email

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      checkMasterAccount(session?.user)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      checkMasterAccount(session?.user)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkMasterAccount = (user: User | null) => {
    if (user?.email === MASTER_EMAIL) {
      setIsMasterAccount(true)
      // Store master API key in localStorage for quick access
      localStorage.setItem('gridApiKey', MASTER_API_KEY)
    } else {
      setIsMasterAccount(false)
      localStorage.removeItem('gridApiKey')
    }
  }

  const signInWithGoogle = async () => {

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      })

      if (error) throw error

      return { data, error: null }
    } catch (error: any) {
      toast({
        title: "Erro no login",
        description: error.message,
        variant: "destructive"
      })
      return { data: null, error }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      localStorage.removeItem('gridApiKey')
      setIsMasterAccount(false)
      
      toast({
        title: "Logout realizado",
        description: "Sessão encerrada com sucesso"
      })
    } catch (error: any) {
      toast({
        title: "Erro no logout",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  return {
    user,
    loading,
    isMasterAccount,
    signInWithGoogle,
    signOut,
    isConfigured: true
  }
}