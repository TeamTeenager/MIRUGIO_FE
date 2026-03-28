import { supabase } from './supabase'

export async function initAnonymousAuth(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession()

  if (session?.user) return session.user.id

  const { data, error } = await supabase.auth.signInAnonymously()
  if (error) {
    console.error('Anonymous auth failed:', error.message)
    return null
  }

  return data.user?.id ?? null
}
