'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Icons } from '@/components/Icons';

// Imágenes de Unsplash sin derechos de autor
const projectImages = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80', // Casa moderna
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', // Interior
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80', // Casa diseño
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80', // Moderna
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', // Exterior
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80', // Oficina
];

interface ProjectItem {
  id: number | string;
  title: string;
  category: string;
  price: string;
  location: string;
  description: string;
  image: string;
  deadline: string;
  files?: { name: string; url: string; type?: string; size?: number }[];
}

const projects: ProjectItem[] = [
  {
    id: 1,
    title: 'Reforma de Apartamento Luxo',
    category: 'Residencial',
    price: 'R$ 5.000',
    location: 'São Paulo, SP',
    description: 'Reforma completa de apartamento de 80m² no bairro Higienópolis.',
    image: projectImages[0],
    deadline: '30 dias',
  },
  {
    id: 2,
    title: 'Projeto de Escritório Corporativo',
    category: 'Comercial',
    price: 'R$ 15.000',
    location: 'Rio de Janeiro, RJ',
    description: 'Design de escritório moderno de 200m² para 30 pessoas.',
    image: projectImages[1],
    deadline: '45 dias',
  },
  {
    id: 3,
    title: 'Casa de Praia Contemporânea',
    category: 'Residencial',
    price: 'R$ 45.000',
    location: 'Florianópolis, SC',
    description: 'Projeto completo de casa de praia com 300m² e piscina.',
    image: projectImages[2],
    deadline: '90 dias',
  },
  {
    id: 4,
    title: 'Loft Industrial Moderno',
    category: 'Residencial',
    price: 'R$ 8.500',
    location: 'Curitiba, PR',
    description: 'Transformação de galpão em loft residencial de 120m².',
    image: projectImages[3],
    deadline: '60 dias',
  },
  {
    id: 5,
    title: 'Restaurante Gourmet',
    category: 'Comercial',
    price: 'R$ 25.000',
    location: 'Belo Horizonte, MG',
    description: 'Projeto de restaurante de alto padrão com 150m².',
    image: projectImages[4],
    deadline: '75 dias',
  },
  {
    id: 6,
    title: 'Coworking Space',
    category: 'Comercial',
    price: 'R$ 18.000',
    location: 'Porto Alegre, RS',
    description: 'Espaço de coworking moderno para 50 pessoas.',
    image: projectImages[5],
    deadline: '40 dias',
  },
];

export default function ProjetosPage() {
  const [filter, setFilter] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [projectsList, setProjectsList] = useState<ProjectItem[]>(projects);

  // Load user-created projects from localStorage (client-side only)
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('projects') || '[]') as unknown[];
      if (Array.isArray(stored) && stored.length > 0) {
        // Normalize stored projects to same shape as sample projects
        const normalized = stored.map((p: unknown) => {
          const obj = p as Record<string, unknown>;
          const files = (obj['files'] as unknown[]) || [];
          const firstImage = files.length > 0 && (files[0] as Record<string, unknown>)['type'] && String((files[0] as Record<string, unknown>)['type']).startsWith('image/') ? (files[0] as Record<string, unknown>)['url'] as string : projectImages[0];

          return {
            id: obj['id'] as string | number,
            title: (obj['title'] as string) || 'Untitled',
            category: (obj['category'] as string) || 'Residencial',
            price: obj['budget'] ? `R$ ${(obj['budget'] as string)}` : 'Sem orçamento',
            location: (obj['location'] as string) || 'Remoto',
            description: (obj['description'] as string) || '',
            image: firstImage,
            deadline: (obj['deadline'] as string) || 'N/A',
            files: files as { name: string; url: string; type?: string; size?: number }[],
          };
        });

        setProjectsList(prev => [...normalized, ...prev]);
      }
    } catch {
      // ignore
    }
  }, []);

  const filteredProjects = projectsList.filter(project => {
    const matchesFilter = filter === 'todos' || project.category.toLowerCase() === filter;
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-br from-[#22C55E] to-[#16A34A] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">
            AF
          </div>
          <span className="text-2xl font-bold text-gray-800">ArquiFreelas</span>
        </Link>
        <div className="flex gap-4">
          <Link href="/login" className="px-5 py-2.5 border-2 border-[#22C55E] text-[#22C55E] rounded-xl hover:bg-[#22C55E] hover:text-white transition font-medium">
            Login
          </Link>
          <Link href="/cadastro" className="px-5 py-2.5 bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white rounded-xl hover:shadow-lg transition font-medium">
            Cadastro
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#22C55E] to-[#16A34A] text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Projetos Disponíveis</h1>
          <p className="text-xl opacity-90 mb-8">Encontre o projeto perfeito para suas habilidades</p>
          
          {/* Search */}
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[300px] relative">
              <Icons.Search />
              <input
                type="text"
                placeholder="Buscar por título, localização..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-4 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-6 py-4 rounded-xl text-gray-800 focus:outline-none cursor-pointer"
            >
              <option value="todos">Todas Categorias</option>
              <option value="residencial">Residencial</option>
              <option value="comercial">Comercial</option>
              <option value="industrial">Industrial</option>
            </select>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-gray-600 mb-6">{filteredProjects.length} projetos encontrados</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div key={project.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition hover:-translate-y-2 border border-gray-100">
                <div className="relative h-48">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <span className="absolute top-4 left-4 bg-[#22C55E] text-white px-4 py-1.5 rounded-full text-sm font-medium">
                    {project.category}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">{project.title}</h3>
                  <p className="text-gray-500 text-sm mb-2 flex items-center gap-1">
                    <Icons.Location /> {project.location}
                  </p>
                  <p className="text-gray-600 text-sm mb-4">{project.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1"><Icons.Clock /> {project.deadline}</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <span className="text-2xl font-bold text-[#22C55E]">{project.price}</span>
                    <Link
                      href={`/projetos/${project.id}`}
                      className="px-5 py-2.5 bg-[#22C55E] text-white rounded-xl hover:bg-[#16A34A] transition font-medium"
                    >
                      Ver Detalhes
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Quer publicar seu próprio projeto?</h2>
          <p className="text-gray-400 mb-8">Cadastre-se agora e encontre os melhores freelancers para seu projeto.</p>
          <Link href="/cadastro" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white rounded-xl font-semibold hover:shadow-lg transition">
            Publicar Projeto
            <Icons.ArrowRight />
          </Link>
        </div>
      </section>
    </main>
  );
}
