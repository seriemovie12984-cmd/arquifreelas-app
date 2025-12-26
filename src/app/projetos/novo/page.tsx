'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Icons } from '@/components/Icons';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';

export default function NovoProjetoPage() {
  const { user, loading: authLoading } = useAuth();
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
  const [mounted, setMounted] = useState(false);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<{id:number,name:string,url?:string,type:string,size:number}[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{[key:number]:number}>({});
  const [uploadedFiles, setUploadedFiles] = useState<{name:string,url:string,type:string,size:number}[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !authLoading && !user) {
      window.location.href = '/login';
    }
  }, [authLoading, user, mounted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // If files selected, upload them to Supabase Storage
    setUploading(true);
    const uploaded: {name:string,url:string,type:string,size:number}[] = [];

    if (selectedFiles.length > 0) {
      const supabase = await createClient();
      if (!supabase) {
        // Couldn't create client in this runtime, warn and continue storing names locally
        console.warn('Supabase client not available; files will not be uploaded')
      } else {
        for (let i = 0; i < selectedFiles.length; i++) {
          const file = selectedFiles[i];
          try {
            const path = `project-files/${user?.id}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-_]/g, '_')}`;
            const { error: uploadError } = await supabase.storage.from('project-files').upload(path, file);
            if (uploadError) {
              console.error('Upload error:', uploadError.message);
              continue;
            }
            const { data } = supabase.storage.from('project-files').getPublicUrl(path);
            uploaded.push({ name: file.name, url: data.publicUrl, type: file.type, size: file.size });

            // progress approximation
            setUploadProgress(prev => ({ ...prev, [i]: 100 }));
          } catch (err) {
            console.error('Exception uploading file:', err);
          }
        }
      }
    }

    setUploadedFiles(uploaded);
    setUploading(false);

    // Simulate small delay (and keep behaviour backwards compatible with localStorage fallback)
    await new Promise(resolve => setTimeout(resolve, 600));

    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    const newProject = {
      id: Date.now(),
      ...formData,
      userId: user?.id,
      userEmail: user?.email,
      createdAt: new Date().toISOString(),
      status: 'aberto',
      files: uploaded, // array of uploaded files metadata
    };
    projects.push(newProject);
    localStorage.setItem('projects', JSON.stringify(projects));

    setSuccess(true);
    setLoading(false);

    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 2000);
  };

  if (!mounted || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#22C55E]"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-br from-[#22C55E] to-[#16A34A] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">
            AF
          </div>
          <span className="text-2xl font-bold text-gray-800">ArquiFreelas</span>
        </Link>
        <a href="/dashboard" className="text-[#22C55E] hover:text-[#16A34A] font-medium transition flex items-center gap-2">
          &larr; Voltar ao Dashboard
        </a>
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
                Titulo do Projeto *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent transition"
                placeholder="Ex: Reforma de apartamento de 80m2"
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
                  <option value="saude">Saude</option>
                  <option value="educacao">Educacao</option>
                  <option value="retail">Retail</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Localizacao *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent transition"
                  placeholder="Ex: Sao Paulo, SP"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Descricao do Projeto *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent transition h-32 resize-none"
                placeholder="Descreva detalhadamente o que voce precisa..."
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Orcamento (R$) *
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
                Requisitos Especificos
              </label>
              <textarea
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent transition h-24 resize-none"
                placeholder="Certificacoes necessarias, experiencia especifica, etc."
              />
            </div>

            {/* File upload section */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Anexos (imagens, PDF)</label>
              <input
                type="file"
                accept="image/*,application/pdf"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  setSelectedFiles(files);
                  const p = files.map((f, i) => ({ id: Date.now() + i, name: f.name, url: f.type.startsWith('image/') ? URL.createObjectURL(f) : undefined, type: f.type, size: f.size }));
                  setPreviews(p);
                }}
                className="block"
              />

              {previews.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {previews.map((p, idx) => (
                    <div key={p.id} className="bg-white p-2 rounded-xl border border-gray-100">
                      {p.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.url} alt={p.name} className="w-full h-28 object-cover rounded-md" />
                      ) : (
                        <div className="w-full h-28 flex items-center justify-center text-sm text-gray-600">{p.name}</div>
                      )}
                      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                        <span className="truncate">{p.name}</span>
                        <span>{Math.round(p.size/1024)} KB</span>
                      </div>

                      <div className="mt-2">
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div className="bg-[#22C55E] h-2 rounded-full" style={{ width: `${uploadProgress[idx] || 0}%` }} />
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{uploadProgress[idx] ? `${uploadProgress[idx]}%` : 'Pendente'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {uploading && (
                <div className="mt-4 bg-blue-50 border border-blue-100 text-blue-700 px-4 py-3 rounded-md">
                  <div className="flex items-center gap-3">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    <div>Enviando anexos... Aguarde.</div>
                  </div>
                </div>
              )}

              {uploadedFiles.length > 0 && (
                <div className="mt-4 bg-white rounded-xl p-4 border border-gray-100">
                  <h4 className="text-sm font-semibold mb-2">Anexos enviados</h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    {uploadedFiles.map((f, i) => (
                      <li key={i} className="flex items-center justify-between">
                        <span className="truncate max-w-[60%]">{f.name}</span>
                        <a href={f.url} target="_blank" rel="noreferrer" className="text-[#22C55E] hover:underline">Abrir</a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <Icons.Shield />
              <p className="text-amber-800 text-sm">
                <strong>Taxa da plataforma:</strong> 12% do valor do projeto sera retido como comissao.
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


