import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { User } from '@supabase/supabase-js'
import { useToast } from '@/hooks/use-toast'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])


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
      console.error('Google Auth Error:', error)
      
      let errorMessage = error.message
      if (error.message?.includes('oauth_callback_failed')) {
        errorMessage = "Erro na configuração OAuth. Verifique as URLs no Google Cloud Console e Supabase."
      } else if (error.message?.includes('invalid_redirect')) {
        errorMessage = "URL de redirect inválida. Verifique a configuração no Supabase."
      }
      
      toast({
        title: "Erro no login",
        description: errorMessage,
        variant: "destructive"
      })
      return { data: null, error }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
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
    signInWithGoogle,
    signOut,
    isConfigured: true
  }
}