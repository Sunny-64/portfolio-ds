export interface NavItem {
  label: string;
  href: string;
}

export interface SocialLink {
  platform: 'email' | 'linkedin' | 'github' | 'x';
  label: string;
  url: string;
}

export interface PortfolioData {
  name: string;
  role: string;
  positioning: string;
  headline: {
    line1: string;
    line2: string;
    accentLine: string;
  };
  heroDescription: string;
  location?: string;
  ctaPrimary: {
    label: string;
    href: string;
  };
  ctaSecondary: {
    label: string;
    href: string;
  };
  about: {
    heading: string;
    paragraphs: string[];
    highlights: string[];
  };
  contact: {
    heading: string;
    subheading: string;
    email: string;
    socials: SocialLink[];
  };
  footer: {
    copyrightName: string;
    year: number;
    tagline: string;
  };
}

export interface SkillItem {
  id: string;
  name: string;
  iconName: 'data-analysis' | 'sql' | 'excel' | 'power-bi' | 'python' | 'web-dev';
}

export interface ExperienceItemData {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
}

export interface ProjectItemData {
  id: string;
  title: string;
  technologies: string[];
  description: string;
  image: string;
  href: string;
  githubUrl?: string;
}

export interface EducationItemData {
  id: string;
  degree: string;
  institution: string;
  location: string;
  period: string;
  description?: string;
}
