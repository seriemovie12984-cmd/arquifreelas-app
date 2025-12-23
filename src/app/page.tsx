'use client';

import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { Icons } from '@/components/Icons';

// Imágenes 4K de Unsplash (sin derechos de autor)
const heroImage = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80';
const projectImages = [
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section with Background Image */}
      <section className="relative min-h-[600px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImage}
            alt="Arquitetura moderna"
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#22C55E]/90 to-[#16A34A]/90"></div>
        </div>
        <div className="relative z-10 text-white text-center px-6 py-24">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Conecte Arquitetos com Freelancers
          </h1>
          <p className="text-xl md:text-2xl mb-10 opacity-95 max-w-3xl mx-auto">
            A plataforma que revoluciona a forma de gerenciar projetos de arquitetura
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/cadastro" className="px-10 py-4 bg-white text-[#22C55E] rounded-xl font-bold hover:bg-gray-100 transition text-lg shadow-lg flex items-center gap-2">
              Comece Agora
              <Icons.ArrowRight />
            </Link>
            <a href="#features" className="px-10 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-[#22C55E] transition text-lg">
              Saiba Mais
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">
          Por que ArquiFreelas?
        </h2>
        <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">
          A plataforma mais completa para conectar profissionais de arquitetura
        </p>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-xl transition group">
            <div className="w-14 h-14 bg-[#22C55E]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#22C55E]/20 transition">
              <Icons.Shield />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Pagamentos Seguros</h3>
            <p className="text-gray-500">Integração com Mercado Pago. Pagamentos em escrow com 30% no início e 70% ao final.</p>
          </div>
          <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-xl transition group">
            <div className="w-14 h-14 bg-[#22C55E]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#22C55E]/20 transition">
              <Icons.Chat />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Chat Seguro</h3>
            <p className="text-gray-500">Mensagens privadas com bloqueio automático de contatos externos.</p>
          </div>
          <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-xl transition group">
            <div className="w-14 h-14 bg-[#22C55E]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#22C55E]/20 transition">
              <Icons.Star />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Avaliações Verificadas</h3>
            <p className="text-gray-500">Sistema de rating de 5 estrelas. Reputação é tudo na nossa plataforma.</p>
          </div>
          <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-xl transition group">
            <div className="w-14 h-14 bg-[#22C55E]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#22C55E]/20 transition">
              <Icons.Chart />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Dashboard Completo</h3>
            <p className="text-gray-500">Acompanhe seus projetos, propostas, mensagens e pagamentos em um único lugar.</p>
          </div>
          <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-xl transition group">
            <div className="w-14 h-14 bg-[#22C55E]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#22C55E]/20 transition">
              <Icons.Briefcase />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Portfolio Profissional</h3>
            <p className="text-gray-500">Freelancers podem mostrar seus melhores trabalhos e atrair mais clientes.</p>
          </div>
          <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-xl transition group">
            <div className="w-14 h-14 bg-[#22C55E]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#22C55E]/20 transition">
              <Icons.CreditCard />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Planos Flexíveis</h3>
            <p className="text-gray-500">Plano Básico (R$ 25), Profissional (R$ 45) e Empresa (R$ 75) por mês.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="como-funciona" className="py-20 px-6 bg-gray-50">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">
          Como Funciona
        </h2>
        <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">
          Em apenas 5 passos simples você estará conectado com os melhores profissionais
        </p>
        <div className="grid md:grid-cols-5 gap-6 max-w-6xl mx-auto">
          {[
            { num: 1, title: 'Cadastre-se', desc: 'Crie sua conta como Arquiteto ou Freelancer.' },
            { num: 2, title: 'Publique ou Busque', desc: 'Publique projetos ou busque oportunidades.' },
            { num: 3, title: 'Chat & Propostas', desc: 'Converse com segurança e envie propostas.' },
            { num: 4, title: 'Pagamento Seguro', desc: 'Pagamento em escrow. 12% de comissão.' },
            { num: 5, title: 'Avalie', desc: 'Avalie o trabalho e construa reputação.' },
          ].map((step) => (
            <div key={step.num} className="bg-white p-6 rounded-2xl text-center shadow-sm hover:shadow-lg transition">
              <div className="w-14 h-14 bg-gradient-to-br from-[#22C55E] to-[#16A34A] text-white rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-4 shadow-lg">
                {step.num}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{step.title}</h3>
              <p className="text-gray-500 text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Projects Preview */}
      <section className="py-20 px-6 bg-white">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">
          Projetos Disponíveis
        </h2>
        <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">
          Explore projetos de arquitetura de todo o Brasil
        </p>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { img: projectImages[0], cat: 'Residencial', title: 'Reforma de Apartamento', price: 'R$ 5.000', desc: 'Reforma completa de apartamento de 80m²' },
            { img: projectImages[1], cat: 'Comercial', title: 'Projeto de Escritório', price: 'R$ 15.000', desc: 'Design de escritório corporativo de 200m²' },
            { img: projectImages[2], cat: 'Residencial', title: 'Casa Contemporânea', price: 'R$ 45.000', desc: 'Projeto completo de casa moderna' },
          ].map((project, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition hover:-translate-y-2 border border-gray-100">
              <div className="relative h-56">
                <Image
                  src={project.img}
                  alt={project.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <span className="absolute top-4 left-4 bg-[#22C55E] text-white px-4 py-1.5 rounded-full text-sm font-medium">
                  {project.cat}
                </span>
              </div>
              <div className="p-6">
                <h4 className="text-xl font-semibold mt-2 mb-2 text-gray-800">{project.title}</h4>
                <p className="text-gray-500 text-sm mb-4">{project.desc}</p>
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <span className="text-[#22C55E] font-bold text-xl">{project.price}</span>
                  <Link href="/projetos" className="px-5 py-2.5 bg-[#22C55E] text-white rounded-xl hover:bg-[#16A34A] transition text-sm font-medium">
                    Ver Mais
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link href="/projetos" className="inline-flex items-center gap-2 px-8 py-4 bg-[#22C55E] text-white rounded-xl font-semibold hover:bg-[#16A34A] transition shadow-lg">
            Ver Todos os Projetos
            <Icons.ArrowRight />
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#22C55E] to-[#16A34A] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Pronto para começar?</h2>
          <p className="text-xl opacity-90 mb-8">
            Junte-se a milhares de profissionais que já estão usando ArquiFreelas
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/cadastro" className="px-8 py-4 bg-white text-[#22C55E] rounded-xl font-bold hover:bg-gray-100 transition shadow-lg">
              Criar Conta Grátis
            </Link>
            <Link href="/projetos" className="px-8 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-[#22C55E] transition">
              Explorar Projetos
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 bg-gradient-to-br from-[#22C55E] to-[#16A34A] rounded-xl flex items-center justify-center text-white font-black text-xl">
                AF
              </div>
              <span className="text-xl font-bold">ArquiFreelas</span>
            </div>
            <p className="text-gray-400 text-sm">A plataforma que conecta arquitetos e freelancers de todo o Brasil.</p>
          </div>
          <div>
            <h4 className="text-[#22C55E] font-semibold mb-4">Empresa</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="#" className="hover:text-[#22C55E] transition">Sobre Nós</Link></li>
              <li><Link href="#" className="hover:text-[#22C55E] transition">Blog</Link></li>
              <li><Link href="#" className="hover:text-[#22C55E] transition">Carreiras</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[#22C55E] font-semibold mb-4">Suporte</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="#" className="hover:text-[#22C55E] transition">Central de Ajuda</Link></li>
              <li><Link href="#" className="hover:text-[#22C55E] transition">Contato</Link></li>
              <li><Link href="#" className="hover:text-[#22C55E] transition">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[#22C55E] font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="#" className="hover:text-[#22C55E] transition">Termos de Serviço</Link></li>
              <li><Link href="#" className="hover:text-[#22C55E] transition">Privacidade</Link></li>
              <li><Link href="#" className="hover:text-[#22C55E] transition">Cookies</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
          <p>&copy; 2025 ArquiFreelas. Todos os direitos reservados.</p>
        </div>
      </footer>
    </main>
  );
}
