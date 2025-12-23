'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from '@/components/Icons';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulación de login
    if (formData.email === 'teste@arquifreelas.com' && formData.password === 'Senha123!') {
      localStorage.setItem('user', JSON.stringify({
        id: '1',
        name: 'Usuário Teste',
        email: formData.email,
        type: 'arquiteto'
      }));
      router.push('/dashboard');
    } else if (formData.email && formData.password) {
      // Aceptar cualquier login para pruebas
      localStorage.setItem('user', JSON.stringify({
        id: '2',
        name: formData.email.split('@')[0],
        email: formData.email,
        type: 'freelancer'
      }));
      router.push('/dashboard');
    } else {
      setError('Por favor, preencha todos os campos.');
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-br from-[#22C55E] to-[#16A34A] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">
            AF
          </div>
          <span className="text-2xl font-bold text-gray-800">ArquiFreelas</span>
        </Link>
        <Link href="/cadastro" className="text-[#22C55E] hover:text-[#16A34A] font-semibold transition">
          Criar Conta
        </Link>
      </nav>

      {/* Login Form */}
      <div className="flex items-center justify-center py-20 px-4">
        <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#22C55E] to-[#16A34A] rounded-2xl flex items-center justify-center text-white font-black text-2xl mx-auto mb-4 shadow-lg">
              AF
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Bem-vindo de volta!</h1>
            <p className="text-gray-500 mt-2">Entre na sua conta ArquiFreelas</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                E-mail
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent transition"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Senha
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent transition"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-[#22C55E] rounded focus:ring-[#22C55E]" />
                <span className="text-gray-600">Lembrar de mim</span>
              </label>
              <Link href="#" className="text-[#22C55E] hover:text-[#16A34A] font-medium transition">
                Esqueceu a senha?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white rounded-xl font-bold hover:shadow-lg transition disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Entrando...
                </span>
              ) : (
                <>
                  Entrar
                  <Icons.ArrowRight />
                </>
              )}
            </button>
          </form>

          <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-gray-400 text-sm">ou continue com</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Google Login */}
          <button
            type="button"
            onClick={() => {
              localStorage.setItem('user', JSON.stringify({
                id: 'google-' + Date.now(),
                name: 'Usuário Google',
                email: 'usuario@gmail.com',
                type: 'freelancer',
                loginMethod: 'google'
              }));
              router.push('/dashboard');
            }}
            className="w-full py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-300 transition flex items-center justify-center gap-3"
          >
            <Icons.Google />
            Entrar com Google
          </button>

          <p className="text-center mt-8 text-gray-500">
            Não tem uma conta?{' '}
            <Link href="/cadastro" className="text-[#22C55E] hover:text-[#16A34A] font-semibold transition">
              Cadastre-se grátis
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
