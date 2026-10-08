import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { Skills } from '@/components/sections/Skills';
import { Projects } from '@/components/sections/Projects';
import { Education } from '@/components/sections/Education';
import { Experience } from '@/components/sections/Experience';
import { WhatImUpTo } from '@/components/sections/WhatImUpTo';
import { Blog } from '@/components/sections/Blog';
import { Contact } from '@/components/sections/Contact';
import { getPersonSchema, getWebSiteSchema } from '@/lib/schema';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: '/',
    type: 'website',
  },
};

export default function Home() {
  const personSchema = getPersonSchema();
  const webSiteSchema = getWebSiteSchema();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
      <Navbar />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. Hero */}
        <Hero />

        {/* 2. What I Work With */}
        <Skills />

        {/* 3. Selected Work (Top 3 only) */}
        <Projects />

        {/* 4. Education (Compact 3-card layout) */}
        <Education />

        {/* 5. Work I've Done (Scroll-linked experience timeline) */}
        <Experience />

        {/* 6. What I'm Up To (Curated personal items) */}
        <WhatImUpTo />

        {/* 7. Latest from the Blog (Self-hiding when no published posts) */}
        <Blog />

        {/* 8. Let's Build Something Useful */}
        <Contact />
      </main>
      {/* 9. Footer */}
      <Footer />
    </div>
  );
}
