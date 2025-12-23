'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from '@/components/Icons';


type User = { id?: number | string; name?: string; email?: string; type?: string; };
export default function NovoProjetoPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'residencial',
    description: '',
    budget: '',
    deadline: '',
    location: '',
    requirements: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(userData));
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simular criaÃ§Ã£o de projeto
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Salvar projeto no localStorage
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    const newProject = {
      id: Date.now(),
      ...formData,
      userId: user?.id,
      createdAt: new Date().toISOString(),
      status: 'aberto',
    };
    projects.push(newProject);
    localStorage.setItem('projects', JSON.stringify(projects));

    setSuccess(true);
    setLoading(false);
    
    setTimeout(() => {
      router.push('/dashboard');
    }, 2000);
  };

  if (!user) {
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
        <Link href="/dashboard" className="text-[#22C55E] hover:text-[#16A34A] font-medium transition flex items-center gap-2">
          â† Voltar ao Dashboard
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto py-12 px-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Publicar Novo Projeto</h1>

        {success ? (
          <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-8 rounded-2xl text-center">
            <div className="w-16 h-16 bg-[#22C55E] rounded-full flex items-center justify-center mx-auto mb-4">
              <Icons.Check />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Projeto publicado com sucesso!</h2>
            <p className="text-gray-600">Redirecionando para o dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-gray-100">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                TÃ­tulo do Projeto *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent transition"
                placeholder="Ex: Reforma de apartamento de 80mÂ²"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Categoria *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent transition cursor-pointer"
                  required
                >
                  <option value="residencial">Residencial</option>
                  <option value="comercial">Comercial</option>
                  <option value="industrial">Industrial</option>
                  <option value="saude">SaÃºde</option>
                  <option value="educacao">EducaÃ§Ã£o</option>
                  <option value="retail">Retail</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  LocalizaÃ§Ã£o *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent transition"
                  placeholder="Ex: SÃ£o Paulo, SP"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                DescriÃ§Ã£o do Projeto *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent transition h-32 resize-none"
                placeholder="Descreva detalhadamente o que vocÃª precisa..."
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  OrÃ§amento (R$) *
                </label>
                <input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent transition"
                  placeholder="5000"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Prazo de Entrega *
                </label>
                <input
                  type="text"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent transition"
                  placeholder="Ex: 30 dias"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Requisitos EspecÃ­ficos
              </label>
              <textarea
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent transition h-24 resize-none"
                placeholder="CertificaÃ§Ãµes necessÃ¡rias, experiÃªncia especÃ­fica, etc."
              />
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <Icons.Shield />
              <p className="text-amber-800 text-sm">
                <strong>Taxa da plataforma:</strong> 12% do valor do projeto serÃ¡ retido como comissÃ£o.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white rounded-xl font-bold hover:shadow-lg transition disabled:opacity-70 text-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Publicando...
                </span>
              ) : (
                <>
                  Publicar Projeto
                  <Icons.ArrowRight />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}


