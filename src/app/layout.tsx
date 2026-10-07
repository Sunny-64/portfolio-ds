import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Newsreader } from 'next/font/google';
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
  title: 'B Sunny — Data Analyst & Software Developer',
  description:
    "I'm a software developer transitioning into data analytics, combining problem solving with data to build useful products and insights.",
  keywords: [
    'B Sunny',
    'Data Analyst',
    'Software Developer',
    'Portfolio',
    'Python',
    'SQL',
    'Power BI',
    'React',
  ],
  authors: [{ name: 'B Sunny' }],
  openGraph: {
    title: 'B Sunny — Data Analyst & Software Developer',
    description:
      "I'm a software developer transitioning into data analytics, combining problem solving with data to build useful products and insights.",
    type: 'website',
    locale: 'en_US',
    siteName: 'B Sunny Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'B Sunny — Data Analyst & Software Developer',
    description:
      "I'm a software developer transitioning into data analytics, combining problem solving with data to build useful products and insights.",
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
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var theme = queryTheme || storedTheme;
                  if (theme === 'dark' || (!theme && prefersDark)) {
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
        {children}
      </body>
    </html>
  );
}
