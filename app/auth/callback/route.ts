import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      return NextResponse.redirect(`${origin}/`)
    }
    
    // Return the user to an error page with the specific error
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`)
  }

  // Return the user to an error page if no code was provided
  return NextResponse.redirect(`${origin}/login?error=No authorization code provided`)
}
