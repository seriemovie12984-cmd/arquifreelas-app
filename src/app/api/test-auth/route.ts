import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    env_check: {
      SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET',
      SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET',
      url_value: process.env.NEXT_PUBLIC_SUPABASE_URL || 'undefined',
    },
    expected_callback: 'https://v-production-554b.up.railway.app/auth/callback',
    supabase_callback: 'https://wfmwbvgntfuivbdudsub.supabase.co/auth/v1/callback',
    instructions: {
      step1: 'En Supabase Dashboard > Authentication > URL Configuration:',
      site_url: 'https://v-production-554b.up.railway.app',
      redirect_urls: [
        'https://v-production-554b.up.railway.app/auth/callback',
        'http://localhost:3000/auth/callback'
      ],
      step2: 'En Google Cloud Console > APIs & Services > Credentials:',
      authorized_js_origins: [
        'https://v-production-554b.up.railway.app',
        'https://wfmwbvgntfuivbdudsub.supabase.co',
        'http://localhost:3000'
      ],
      authorized_redirect_uris: [
        'https://wfmwbvgntfuivbdudsub.supabase.co/auth/v1/callback'
      ]
    }
  })
}
