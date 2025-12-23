'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function DebugPage() {
  const [debugInfo, setDebugInfo] = useState<{
    supabaseUrl: string | null;
    hasAnonKey: boolean;
    session: unknown;
    user: unknown;
    error: string | null;
  }>({
    supabaseUrl: null,
    hasAnonKey: false,
    session: null,
    user: null,
    error: null,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClientComponentClient();
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        setDebugInfo({
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT SET',
          hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          session: session ? {
            user_id: session.user?.id,
            email: session.user?.email,
            provider: session.user?.app_metadata?.provider,
            full_name: session.user?.user_metadata?.full_name,
          } : null,
          user: session?.user ? 'EXISTS' : 'NULL',
          error: error?.message || null,
        });
      } catch (e: unknown) {
        setDebugInfo(prev => ({
          ...prev,
          error: e instanceof Error ? e.message : 'Unknown error',
        }));
      }
    };

    checkAuth();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-green-400 p-8 font-mono">
      <h1 className="text-2xl mb-6">🔧 Debug Info</h1>
      <pre className="bg-gray-800 p-4 rounded-lg overflow-auto">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
      
      <div className="mt-8 space-y-4">
        <a 
          href="/login" 
          className="block bg-blue-600 text-white px-4 py-2 rounded text-center"
        >
          Ir a Login
        </a>
        <a 
          href="/dashboard" 
          className="block bg-green-600 text-white px-4 py-2 rounded text-center"
        >
          Ir a Dashboard
        </a>
      </div>
    </div>
  );
}
