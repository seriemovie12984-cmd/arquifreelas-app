'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Icons } from '@/components/Icons';

interface ProjectFile {
  name: string;
  url: string;
  type?: string;
  size?: number;
}

interface Project {
  id: number | string;
  title: string;
  description?: string;
  files?: ProjectFile[];
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    // First look up in localStorage projects
    try {
      const stored = JSON.parse(localStorage.getItem('projects') || '[]') as unknown[];
      const found = stored.find((p: unknown) => {
        const obj = p as { id?: number | string };
        return String(obj.id) === String(id);
      }) as Project | undefined;

      if (found) {
        setProject(found);
        return;
      }
    } catch {
      // ignore
    }

    // fallback: if not found, redirect back to projetos
    setTimeout(() => {
      router.push('/projetos');
    }, 800);
  }, [id, router]);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icons.Clock />
          </div>
          <p className="text-gray-600">Carregando projeto ou não encontrado...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#22C55E] to-[#16A34A] rounded-xl flex items-center justify-center text-white font-black">AF</div>
            <span className="font-bold">ArquiFreelas</span>
          </Link>
          <Link href="/projetos" className="text-[#22C55E] hover:underline">← Voltar</Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
        <p className="text-gray-600 mb-4">{project.description}</p>

        {project.files && project.files.length > 0 && (
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <h3 className="font-semibold mb-3">Anexos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.files.map((f: ProjectFile, i: number) => (
                <div key={i} className="flex items-center justify-between gap-4 bg-gray-50 p-3 rounded">
                  <div className="flex items-center gap-3">
                    {f.type?.startsWith('image/') ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={f.url} alt={f.name} className="w-20 h-16 object-cover rounded-md" />
                    ) : (
                      <div className="w-20 h-16 flex items-center justify-center bg-white rounded-md text-sm text-gray-600">{f.name.split('.').pop()?.toUpperCase()}</div>
                    )}
                    <div>
                      <div className="font-medium text-gray-800">{f.name}</div>
                      <div className="text-xs text-gray-500">{Math.round((f.size||0)/1024)} KB</div>
                    </div>
                  </div>
                  <div>
                    <a href={f.url} target="_blank" rel="noreferrer" className="px-4 py-2 bg-[#22C55E] text-white rounded hover:bg-[#16A34A]">Download</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex gap-4">
          <a href="#" className="px-6 py-3 bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white rounded">Enviar Proposta</a>
        </div>
      </div>
    </main>
  );
}
