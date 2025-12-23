'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from '@/components/Icons';
import { useAuth } from '@/hooks/useAuth';

export default function CadastroPage() {
  const router = useRouter();
  const { signInWithGoogle, user, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'freelancer',
    cpf: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleGoogleSignup = async () => {
    try {
      setIsSubmitting(true);
      setError('');
      await signInWithGoogle();
    } catch (err: unknown) {
      console.error('Google signup error:', err);
      setError('Erro ao cadastrar com Google. Tente novamente.');
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem.');
      setIsSubmitting(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      setIsSubmitting(false);
      return;
    }

    // Por ahora solo permitimos registro con Google
    setError('Por favor, use o cadastro com Google.');
    setIsSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#22C55E]"></div>
      </div>
    );
  }

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
        <Link href="/login" className="text-[#22C55E] hover:text-[#16A34A] font-semibold transition">
          Já tenho conta
        </Link>
      </nav>

      {/* Cadastro Form */}
      <div className="flex items-center justify-center py-12 px-4">
        <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-lg">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#22C55E] to-[#16A34A] rounded-2xl flex items-center justify-center text-white font-black text-2xl mx-auto mb-4 shadow-lg">
              AF
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Criar Conta</h1>
            <p className="text-gray-500 mt-2">Junte-se à plataforma ArquiFreelas</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Tipo de usuário */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Tipo de Conta
              </label>
              <div className="flex gap-4">
                <label className={`flex-1 p-5 border-2 rounded-2xl cursor-pointer text-center transition ${formData.userType === 'arquiteto' ? 'border-[#22C55E] bg-[#22C55E]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input
                    type="radio"
                    name="userType"
                    value="arquiteto"
                    checked={formData.userType === 'arquiteto'}
                    onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                    className="hidden"
                  />
                  <div className="w-12 h-12 bg-[#22C55E]/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Icons.Briefcase />
                  </div>
                  <p className="font-semibold text-gray-800">Arquiteto</p>
                  <p className="text-sm text-gray-500">Publicar projetos</p>
                </label>
                <label className={`flex-1 p-5 border-2 rounded-2xl cursor-pointer text-center transition ${formData.userType === 'freelancer' ? 'border-[#22C55E] bg-[#22C55E]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input
                    type="radio"
                    name="userType"
                    value="freelancer"
                    checked={formData.userType === 'freelancer'}
                    onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                    className="hidden"
                  />
                  <div className="w-12 h-12 bg-[#22C55E]/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Icons.User />
                  </div>
                  <p className="font-semibold text-gray-800">Freelancer</p>
                  <p className="text-sm text-gray-500">Buscar trabalhos</p>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nome Completo
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent transition"
                placeholder="Seu nome completo"
                required
              />
            </div>

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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  CPF
                </label>
                <input
                  type="text"
                  value={formData.cpf}
                  onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent transition"
                  placeholder="000.000.000-00"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Telefone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent transition"
                  placeholder="(11) 99999-9999"
                />
              </div>
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
                placeholder="Mínimo 6 caracteres"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirmar Senha
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent transition"
                placeholder="Repita a senha"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white rounded-xl font-bold hover:shadow-lg transition disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Criando conta...
                </span>
              ) : (
                <>
                  Criar Conta
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

          {/* Google Register */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={isSubmitting}
            className="w-full py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-300 transition flex items-center justify-center gap-3 disabled:opacity-70"
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
            ) : (
              <>
                <Icons.Google />
                Cadastrar com Google
              </>
            )}
          </button>

          <p className="text-center mt-8 text-gray-500">
            Já tem uma conta?{' '}
            <Link href="/login" className="text-[#22C55E] hover:text-[#16A34A] font-semibold transition">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
