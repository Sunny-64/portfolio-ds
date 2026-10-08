import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Newsreader } from 'next/font/google';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { siteConfig } from '@/lib/site';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: 'B Sunny — Data Analyst × Software Developer',
    template: '%s — B Sunny',
  },
  description:
    "I'm B Sunny, a developer transitioning into data analytics, combining problem solving with data to build useful products and insights.",
  keywords: [
    'B Sunny',
    'Data Analyst',
    'Software Developer',
    'Data Analytics',
    'Portfolio',
    'Python',
    'SQL',
    'Power BI',
    'React',
  ],
  authors: [{ name: 'B Sunny', url: siteConfig.url }],
  creator: 'B Sunny',
  publisher: 'B Sunny',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'B Sunny — Data Analyst × Software Developer',
    description:
      "I'm B Sunny, a developer transitioning into data analytics, combining problem solving with data to build useful products and insights.",
    type: 'website',
    locale: 'en_US',
    siteName: 'B Sunny Portfolio',
    url: siteConfig.url,
    images: [
      {
        url: '/images/profile/sunny.png',
        width: 800,
        height: 1000,
        alt: 'B Sunny — Data Analyst × Software Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'B Sunny — Data Analyst × Software Developer',
    description:
      "I'm B Sunny, a developer transitioning into data analytics, combining problem solving with data to build useful products and insights.",
    creator: '@_Sunny64',
    images: ['/images/profile/sunny.png'],
  },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/icon.svg', type: 'image/svg+xml' }],
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} ${newsreader.variable} scroll-smooth`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var params = new URLSearchParams(window.location.search);
                  var queryTheme = params.get('theme');
                  var storedTheme = localStorage.getItem('theme');
                  var theme = queryTheme || storedTheme;
                  if (queryTheme) {
                    try { localStorage.setItem('theme', queryTheme); } catch (e) {}
                  }
                  // Default to light mode; only activate dark if explicitly saved by user
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-accent-soft selection:text-accent">
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
