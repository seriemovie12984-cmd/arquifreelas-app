'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Icons } from '@/components/Icons';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  subscription_status: string | null;
}

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const loadProfile = async () => {
      if (user) {
        const supabase = await createClient();
        if (!supabase) {
          console.warn('Supabase client not available in this runtime');
          return;
        }

        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (data) {
          setProfile(data);
        }
      }
    };

    if (mounted && !loading && user) {
      loadProfile();
    }
  }, [user, loading, mounted]);

  useEffect(() => {
    if (mounted && !loading && !user) {
      window.location.href = '/login';
    }
  }, [mounted, loading, user]);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (e) {
      console.error('Logout error:', e);
    }
    window.location.href = '/';
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#22C55E]"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const userName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Usuario';
  const userAvatar = user.user_metadata?.avatar_url || user.user_metadata?.picture;

  return (
    <main className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <a href="/" className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-br from-[#22C55E] to-[#16A34A] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">
            AF
          </div>
          <span className="text-2xl font-bold text-gray-800">ArquiFreelas</span>
        </a>
        <div className="flex items-center gap-4">
          {userAvatar && (
            <Image src={userAvatar} alt="" width={40} height={40} className="w-10 h-10 rounded-full" />
          )}
          <span className="text-gray-600">Ola, <span className="font-semibold">{userName}</span></span>
          {profile?.role === 'admin' && (
            <a
              href="/admin"
              className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition font-medium"
            >
              Admin
            </a>
          )}
          <button
            onClick={handleLogout}
            className="px-4 py-2 border-2 border-red-400 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition font-medium"
          >
            Sair
          </button>
        </div>
      </nav>

      <div className="flex">
        <aside className="w-64 bg-white shadow-lg min-h-[calc(100vh-72px)] p-6">
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full text-left px-4 py-3 rounded-xl transition flex items-center gap-3 ${activeTab === 'overview' ? 'bg-[#22C55E]/10 text-[#22C55E]' : 'hover:bg-gray-100 text-gray-600'}`}
            >
              <Icons.Chart /> Visao Geral
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`w-full text-left px-4 py-3 rounded-xl transition flex items-center gap-3 ${activeTab === 'projects' ? 'bg-[#22C55E]/10 text-[#22C55E]' : 'hover:bg-gray-100 text-gray-600'}`}
            >
              <Icons.Folder /> Meus Projetos
            </button>
            <button
              onClick={() => setActiveTab('proposals')}
              className={`w-full text-left px-4 py-3 rounded-xl transition flex items-center gap-3 ${activeTab === 'proposals' ? 'bg-[#22C55E]/10 text-[#22C55E]' : 'hover:bg-gray-100 text-gray-600'}`}
            >
              <Icons.Document /> Propostas
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`w-full text-left px-4 py-3 rounded-xl transition flex items-center gap-3 ${activeTab === 'messages' ? 'bg-[#22C55E]/10 text-[#22C55E]' : 'hover:bg-gray-100 text-gray-600'}`}
            >
              <Icons.Message /> Mensagens
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`w-full text-left px-4 py-3 rounded-xl transition flex items-center gap-3 ${activeTab === 'payments' ? 'bg-[#22C55E]/10 text-[#22C55E]' : 'hover:bg-gray-100 text-gray-600'}`}
            >
              <Icons.Wallet /> Pagamentos
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full text-left px-4 py-3 rounded-xl transition flex items-center gap-3 ${activeTab === 'profile' ? 'bg-[#22C55E]/10 text-[#22C55E]' : 'hover:bg-gray-100 text-gray-600'}`}
            >
              <Icons.User /> Meu Perfil
            </button>
            <a
              href="/projetos/novo"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white rounded-xl hover:shadow-lg transition mt-6 font-semibold"
            >
              <Icons.Plus /> Novo Projeto
            </a>
          </nav>
        </aside>

        <div className="flex-1 p-8">
          {activeTab === 'overview' && (
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-8">Visao Geral</h1>
              
              <div className="grid md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <p className="text-gray-500 text-sm">Projetos Ativos</p>
                  <p className="text-3xl font-bold text-[#22C55E]">0</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <p className="text-gray-500 text-sm">Propostas Pendentes</p>
                  <p className="text-3xl font-bold text-orange-500">0</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <p className="text-gray-500 text-sm">Mensagens</p>
                  <p className="text-3xl font-bold text-blue-500">0</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <p className="text-gray-500 text-sm">Ganhos do Mes</p>
                  <p className="text-3xl font-bold text-[#22C55E]">R$ 0</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-xl font-semibold mb-4">Projetos Recentes</h2>
                <p className="text-gray-500 text-center py-8">Voce ainda nao tem projetos. Crie seu primeiro projeto!</p>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Meus Projetos</h1>
                <a href="/projetos/novo" className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white rounded-xl hover:shadow-lg transition font-semibold">
                  <Icons.Plus /> Novo Projeto
                </a>
              </div>
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <p className="text-gray-500 text-center py-8">Voce ainda nao tem projetos. Crie seu primeiro projeto!</p>
              </div>
            </div>
          )}

          {activeTab === 'proposals' && (
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-8">Propostas</h1>
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <p className="text-gray-500 text-center py-8">Nenhuma proposta recebida ainda.</p>
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-8">Mensagens</h1>
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <p className="text-gray-500 text-center py-8">Nenhuma mensagem ainda.</p>
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-8">Pagamentos</h1>
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <p className="text-gray-500 text-center py-8">Nenhum pagamento registrado.</p>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-8">Meu Perfil</h1>
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center gap-6 mb-6">
                  {userAvatar ? (
                    <Image src={userAvatar} alt="" width={96} height={96} className="w-24 h-24 rounded-2xl shadow-lg" />
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-br from-[#22C55E] to-[#16A34A] rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                      {userName?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{userName}</h2>
                    <p className="text-gray-500">{user.email}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="bg-[#22C55E]/10 text-[#22C55E] px-3 py-1 rounded-full text-sm capitalize font-medium">
                        {profile?.role || 'user'}
                      </span>
                      {profile?.subscription_status && (
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          profile.subscription_status === 'active' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {profile.subscription_status === 'active' ? 'Premium' : profile.subscription_status}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {profile?.subscription_status !== 'active' && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-[#22C55E]/10 to-[#16A34A]/10 rounded-xl border border-[#22C55E]/20">
                    <h3 className="font-semibold text-gray-800 mb-2">Upgrade para Premium</h3>
                    <p className="text-gray-600 text-sm mb-4">Acesse recursos exclusivos e aumente suas chances de conseguir projetos.</p>
                    <a 
                      href="/planos"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#22C55E] text-white rounded-lg hover:bg-[#16A34A] transition"
                    >
                      Ver Planos
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}


