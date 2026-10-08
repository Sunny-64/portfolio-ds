import { PortfolioData, NavItem } from '@/types/portfolio';
import { getPublishedPosts } from '@/data/blog';

export const baseNavItems: NavItem[] = [
  { label: 'Home', href: '#intro' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Education', href: '#education' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
];

/**
 * Dynamically resolves navigation items.
 * If published blog posts exist, includes 'Blog'.
 * Omits 'About' because there is no standalone About section.
 */
export function getNavItems(): NavItem[] {
  const publishedPosts = getPublishedPosts();
  if (publishedPosts.length > 0) {
    const items = [...baseNavItems];
    // Insert Blog right before Contact
    items.splice(items.length - 1, 0, { label: 'Blog', href: '#blog' });
    return items;
  }
  return baseNavItems;
}

export const portfolioData: PortfolioData = {
  name: 'B SUNNY',
  role: 'Data Analyst × Software Developer',
  positioning: 'Data Analyst × Software Developer',
  headline: {
    line1: 'Turning',
    line2: 'Data into',
    accentLine: 'Better Decisions.',
  },
  heroDescription:
    "I'm B Sunny, a developer transitioning into data analytics, combining problem solving with data to build useful products and insights.",
  location: 'JALANDHAR, INDIA',
  resumeUrl: 'https://drive.google.com/file/d/1uDbMH-rGIP4eviZ3H_NzlJXuLC4G-aeg/view?usp=sharing',
  ctaPrimary: {
    label: 'View My Work',
    href: '#projects',
  },
  ctaSecondary: {
    label: 'Get In Touch',
    href: '#contact',
  },
  contact: {
    heading: "Let's build\nsomething useful.",
    subheading: 'Feel free to reach out for opportunities, collaborations or just a friendly hello.',
    email: 'mailto:sunny6464n@gmail.com',
    socials: [
      {
        platform: 'linkedin',
        label: 'LinkedIn',
        url: 'https://www.linkedin.com/in/b-sunny-a97579219',
      },
      {
        platform: 'github',
        label: 'GitHub',
        url: 'https://github.com/Sunny-64',
      },
      {
        platform: 'x',
        label: 'X (Twitter)',
        url: 'https://x.com/_Sunny64',
      },
      {
        platform: 'discord',
        label: 'Discord',
        url: 'https://discord.com/users/919598728485154897',
      },
      {
        platform: 'whatsapp',
        label: 'WhatsApp',
        url: 'https://wa.me/917973699425',
      },
    ],
  },
  footer: {
    copyrightName: 'B Sunny',
    year: 2026,
    tagline: 'DATA  ×  SOFTWARE  ×  IMPACT',
  },
};
