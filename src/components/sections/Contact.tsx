'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { portfolioData } from '@/data/portfolio';
import { Reveal } from '@/components/ui/Reveal';

export function Contact() {
  const { contact } = portfolioData;
  const [copied, setCopied] = useState(false);

  const handleEmailClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // 1. Copy email address to clipboard
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText('sunny6464n@gmail.com');
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }

    // 2. Open Gmail compose window in a new tab
    const gmailUrl = 'https://mail.google.com/mail/?view=cm&fs=1&to=sunny6464n@gmail.com';
    const win = window.open(gmailUrl, '_blank', 'noopener,noreferrer');

    // 3. Fallback to OS mailto protocol if popup was blocked or preferred
    if (!win || win.closed || typeof win.closed === 'undefined') {
      window.location.href = 'mailto:sunny6464n@gmail.com';
    }
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'linkedin':
        return (
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
          </svg>
        );
      case 'github':
        return (
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
        );
      case 'x':
        return (
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        );
      case 'discord':
        return (
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
          </svg>
        );
      case 'whatsapp':
        return (
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <section id="contact" className="relative pt-16 sm:pt-20 pb-16 sm:pb-24 border-t border-border overflow-hidden">
      <Reveal className="relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Heading */}
          <div className="md:col-span-6 lg:col-span-6">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground font-normal tracking-tight leading-tight whitespace-pre-line">
              {contact.heading}
            </h2>
          </div>

          {/* Right Column: CTA & Social links */}
          <div className="md:col-span-6 lg:col-span-6 space-y-6 pt-1">
            <p className="text-foreground-secondary text-sm sm:text-base font-light">
              {contact.subheading}
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex flex-wrap items-center gap-5">
                <a
                  href="mailto:sunny6464n@gmail.com"
                  onClick={handleEmailClick}
                  className="group inline-flex items-center gap-2 bg-foreground text-background dark:bg-accent dark:text-surface px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-foreground/90 dark:hover:bg-accent-hover transition-all duration-200 shadow-sm cursor-pointer select-none"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Copied sunny6464n@gmail.com!</span>
                    </>
                  ) : (
                    <>
                      <span>Email Me</span>
                      <span className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1">
                        →
                      </span>
                    </>
                  )}
                </a>

                {/* Social Icons */}
                <div className="flex items-center gap-4 text-foreground-secondary">
                  {contact.socials.map((social) => (
                    <Link
                      key={social.platform}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Visit B Sunny on ${social.label}`}
                      className="p-1.5 rounded hover:text-accent transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      {getSocialIcon(social.platform)}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Direct email display */}
              <div className="flex items-center gap-2 font-mono text-xs text-foreground-muted">
                <span>Direct:</span>
                <button
                  type="button"
                  onClick={() => {
                    if (typeof navigator !== 'undefined' && navigator.clipboard) {
                      navigator.clipboard.writeText('sunny6464n@gmail.com');
                      setCopied(true);
                      setTimeout(() => setCopied(false), 3000);
                    }
                  }}
                  className="text-foreground-secondary hover:text-accent transition-colors underline underline-offset-2 cursor-pointer"
                  title="Click to copy email address"
                >
                  sunny6464n@gmail.com
                </button>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
