'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  showAuth?: boolean;
}

export default function Navbar({ showAuth = true }: NavbarProps) {
  const { user, signOut, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
      <Link href="/" className="flex items-center gap-3">
        {/* Logo AF estilo Spotify */}
        <div className="w-11 h-11 bg-gradient-to-br from-[#22C55E] to-[#16A34A] rounded-xl flex items-center justify-center text-white font-black text-xl tracking-tighter shadow-lg">
          AF
        </div>
        <span 
          className="text-2xl font-bold text-[#22C55E] tracking-tight hidden sm:block"
          style={{fontFamily: 'Circular, Gotham, -apple-system, BlinkMacSystemFont, sans-serif', letterSpacing: '-0.5px'}}
        >
          ArquiFreelas
        </span>
      </Link>
      
      <ul className="hidden md:flex gap-8">
        <li>
          <Link href="/projetos" className="text-gray-600 hover:text-[#22C55E] transition font-medium">
            Projetos
          </Link>
        </li>
        <li>
          <a href="/#como-funciona" className="text-gray-600 hover:text-[#22C55E] transition font-medium">
            Como Funciona
          </a>
        </li>
        <li>
          <Link href="/planos" className="text-gray-600 hover:text-[#22C55E] transition font-medium">
            Planos
          </Link>
        </li>
      </ul>

      {showAuth && !user && !loading && (
        <div className="flex gap-3">
          <Link 
            href="/login" 
            className="px-5 py-2.5 border-2 border-[#22C55E] text-[#22C55E] rounded-xl font-semibold hover:bg-[#22C55E] hover:text-white transition"
          >
            Login
          </Link>
          <Link 
            href="/cadastro" 
            className="px-5 py-2.5 bg-[#22C55E] text-white rounded-xl font-semibold hover:bg-[#16A34A] transition shadow-md"
          >
            Cadastro
          </Link>
        </div>
      )}

      {user && (
        <div className="flex items-center gap-4">
          <span className="text-gray-600 hidden sm:block">Olá, {user.user_metadata?.full_name || user.user_metadata?.name || user.email}</span>
          <Link href="/dashboard" className="px-4 py-2 bg-[#22C55E] text-white rounded-lg hover:bg-[#16A34A] transition">
            Dashboard
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition"
          >
            Sair
          </button>
        </div>
      )}
    </nav>
  );
}


