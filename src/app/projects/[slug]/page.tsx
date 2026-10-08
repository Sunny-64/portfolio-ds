import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PROJECTS, getProjectBySlug } from '@/data/projects';
import { TrackProjectView } from '@/components/projects/TrackProjectView';
import { ProjectLinks } from '@/components/projects/ProjectLinks';

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return PROJECTS.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: 'Project Not Found',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: project.name,
    description: project.description,
    alternates: {
      canonical: `/projects/${project.slug}`,
    },
    openGraph: {
      title: `${project.name} — B Sunny`,
      description: project.description,
      url: `/projects/${project.slug}`,
      images: [
        {
          url: project.imageUrl,
          alt: project.name,
        },
      ],
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      {/* Silent client-side project_view tracker */}
      <TrackProjectView slug={project.slug} />

      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-20 sm:pb-28">
        <Link
          href="/projects"
          className="group inline-flex items-center gap-2 font-mono text-xs text-foreground-secondary hover:text-accent transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
          <span>Back to All Projects</span>
        </Link>

        <article className="space-y-8">
          <header className="space-y-4 pb-6 border-b border-border">
            <div className="font-mono text-xs tracking-wider uppercase text-accent font-semibold">
              {project.category === 'data-analytics' ? 'Data Analytics' : 'Web Development'}
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground font-normal tracking-tight">
              {project.name}
            </h1>
            <p className="text-foreground-secondary text-base sm:text-lg leading-relaxed font-light">
              {project.description}
            </p>

            <ProjectLinks
              slug={project.slug}
              github={project.github}
              url={project.url}
              name={project.name}
            />
          </header>

          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-border bg-surface">
            <Image
              src={project.imageUrl}
              alt={project.name}
              fill
              priority
              sizes="(max-width: 896px) 100vw, 896px"
              className="object-cover"
            />
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <h2 className="font-mono text-xs tracking-wider uppercase text-foreground-muted">
              Tech Stack &amp; Tools
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.techStack.split(',').map((tech) => (
                <span
                  key={tech.trim()}
                  className="font-mono text-xs px-3 py-1 rounded bg-surface border border-border text-foreground-secondary"
                >
                  {tech.trim()}
                </span>
              ))}
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
