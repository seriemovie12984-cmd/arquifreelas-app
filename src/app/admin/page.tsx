'use client';

// Prevent static prerendering - this page requires authentication
export const dynamic = 'force-dynamic';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  provider: string | null;
  stripe_customer_id: string | null;
  subscription_status: string | null;
  role: string;
  created_at: string;
}

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserProfile[]>([]);

  interface Invoice { id: string; user_id: string; amount: number; status: string; created_at?: string }
  interface Overview { totalInvoiced: number; totalPaid: number; adminCommission: number; topUsers?: { user_id: string; total: number }[] }

  const [overview, setOverview] = useState<Overview | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSubscriptions: 0,
    newToday: 0,
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/admin');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user) return;

      // Crear cliente Supabase de forma segura en tiempo de ejecución (solo navegador)
      const supabase = await createClient();
      if (!supabase) {
        setError('Imposible conectar con Supabase en este entorno');
        setLoadingUsers(false);
        return;
      }

      try {
        // Verificar si el usuario es admin
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profile?.role !== 'admin') {
          const roleText = profile?.role || 'sin rol'
          setError(`No tienes permisos de administrador. Rol actual: "${roleText}". Si deberías ser admin, ejecuta en Supabase SQL:\n\nupdate profiles set role = 'admin' where email = '${user.email}';`)
          setLoadingUsers(false);
          return;
        }

        // Obtener todos los usuarios (solo admin puede ver esto)
        const { data: usersData, error: usersError } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (usersError) {
          // Si hay error de permisos, mostrar mensaje
          setError('No se pudieron cargar los usuarios. Verifica los permisos RLS.');
          setLoadingUsers(false);
          return;
        }

        if (usersData) {
          setUsers(usersData);
          
          // Calcular estadísticas
          const today = new Date().toDateString();
          const newToday = usersData.filter(
            u => new Date(u.created_at).toDateString() === today
          ).length;
          
          const activeSubscriptions = usersData.filter(
            u => u.subscription_status === 'active'
          ).length;

          setStats({
            totalUsers: usersData.length,
            activeSubscriptions,
            newToday,
          });
        }
      } catch {
        setError('Error al cargar datos');
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();

    // Load admin overview and invoices
    const fetchOverviewAndInvoices = async () => {
      try {
        const [ovRes, invRes] = await Promise.all([
          fetch('/api/admin/overview'),
          fetch('/api/admin/invoices/list')
        ])

        if (ovRes.ok) setOverview(await ovRes.json())
        if (invRes.ok) setInvoices(await invRes.json())
      } catch (e) {
        console.error('Admin fetch error', e)
      }
    }

    fetchOverviewAndInvoices()
  }, [user]);

  if (loading || loadingUsers) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#22C55E]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Acceso Denegado</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link href="/dashboard" className="text-[#22C55E] hover:underline">
            Volver al Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Header */}
      <nav className="bg-white shadow-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-11 h-11 bg-gradient-to-br from-[#22C55E] to-[#16A34A] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">
                AF
              </div>
              <span className="text-2xl font-bold text-gray-800">ArquiFreelas</span>
            </Link>
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              ADMIN
            </span>
          </div>
          <Link href="/dashboard" className="text-gray-600 hover:text-[#22C55E]">
            ← Volver al Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Panel de Administración</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Usuarios</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalUsers}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Facturado</p>
                <p className="text-3xl font-bold text-[#22C55E]">R$ {(overview?.totalInvoiced || 0).toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">💸</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Pagado</p>
                <p className="text-3xl font-bold text-purple-600">R$ {(overview?.totalPaid || 0).toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Comisión Admin</p>
                <p className="text-3xl font-bold text-gray-800">R$ {(overview?.adminCommission || 0).toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🏦</span>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Usuarios Registrados</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Proveedor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Suscripción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registrado
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      No hay usuarios registrados todavía
                    </td>
                  </tr>
                ) : (
                  users.map((profile) => (
                    <tr key={profile.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {profile.avatar_url ? (
                            <Image
                              className="h-10 w-10 rounded-full"
                              src={profile.avatar_url}
                              alt=""
                              width={40}
                              height={40}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-[#22C55E] flex items-center justify-center text-white font-bold">
                              {profile.full_name?.charAt(0) || profile.email?.charAt(0) || '?'}
                            </div>
                          )}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {profile.full_name || 'Sin nombre'}
                            </div>
                            <div className="text-sm text-gray-500">{profile.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          profile.provider === 'google' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {profile.provider === 'google' ? '🔵 Google' : profile.provider || 'Email'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          profile.subscription_status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : profile.subscription_status === 'canceled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {profile.subscription_status || 'Free'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          profile.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {profile.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(profile.created_at).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Invoices */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mt-8">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Facturas</h2>
            <div className="text-sm text-gray-600">Total: {invoices.length}</div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">Sin facturas</td></tr>
                ) : (
                  invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-700">{String(inv.id).slice(0,8)}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{inv.user_id}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">R$ {Number(inv.amount).toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm">{inv.status}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          <a href={`/invoices/${inv.id}`} className="px-3 py-1 bg-[#22C55E] text-white rounded text-xs">Abrir</a>
                          <a href={`/api/invoices/${inv.id}/qr`} className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs">QR</a>
                          {inv.status !== 'paid' && (
                            <button onClick={async () => {
                              if (!confirm('Marcar factura como pagada?')) return;
                              const res = await fetch(`/api/admin/invoices/${inv.id}/pay`, { method: 'POST' })
                              if (res.ok) { alert('Marcada como pagada'); location.reload() } else { const j = await res.json().catch(() => ({})); alert('Error: ' + (j.error || 'unknown')) }
                            }} className="px-3 py-1 bg-blue-600 text-white rounded text-xs">Marcar pagada</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
