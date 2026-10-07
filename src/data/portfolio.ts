import { PortfolioData, NavItem } from '@/types/portfolio';

export const navItems: NavItem[] = [
  { label: 'Home', href: '#intro' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

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
  // location: 'JALANDHAR, INDIA',
  ctaPrimary: {
    label: 'View My Work',
    href: '#projects',
  },
  ctaSecondary: {
    label: 'About Me',
    href: '#about',
  },
  about: {
    heading: 'A developer exploring data.',
    paragraphs: [
      "I'm a software developer with a strong interest in data analysis and building products. I enjoy working with data, finding insights, and turning them into real-world solutions. Currently, I'm focusing on learning data analytics tools and building projects that combine software and data.",
    ],
    highlights: [
      'Analytical Thinking',
      'Problem Solving',
      'Continuous Learning',
      'Building Useful Tools',
    ],
  },
  contact: {
    heading: "Let's build\nsomething useful.",
    subheading: 'Open to opportunities and collaborations.',
    email: 'mailto:bsunny.dev@example.com', // Replace with your actual email address
    socials: [
      {
        platform: 'linkedin',
        label: 'LinkedIn',
        url: 'https://linkedin.com/in/bsunny', // Replace with your actual LinkedIn profile
      },
      {
        platform: 'github',
        label: 'GitHub',
        url: 'https://github.com/bsunny', // Replace with your actual GitHub profile
      },
      {
        platform: 'x',
        label: 'X (Twitter)',
        url: 'https://x.com/bsunny', // Replace with your actual X profile
      },
    ],
  },
  footer: {
    copyrightName: 'B Sunny',
    year: 2026,
    tagline: 'DATA  ×  SOFTWARE  ×  IMPACT',
  },
};
