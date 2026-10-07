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

export interface IExperience {
  id: string;
  company: string;
  role: string;
  period: string;
  startDate: string;
  endDate: string;
  experienceType?: string;
  description: string;
  profile: string;
  location?: string;
  technologies?: string[];
}

export interface ICertification {
  id: string;
  title: string;
  organization: string;
  status?: string;
  period?: string;
  description: string;
}

export interface IEducation {
  id?: string;
  startDate: number;
  endDate: number;
  education: string;
  course: string | null;
  description: string;
  graduatedFrom: string;
  grade: string;
}

export type ProjectCategory = 'web-development' | 'data-analytics';

export interface IProject {
  name: string;
  imageUrl: string;
  description: string;
  url: string;
  github: string;
  techStack: string;
  category: ProjectCategory;
}
