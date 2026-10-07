import { IExperience } from '@/types/portfolio';

export const EXPERIENCE: IExperience[] = [
  {
    id: 'rocketpos',
    company: 'RocketPOS',
    role: 'Frontend Developer',
    profile: 'Frontend Developer',
    startDate: 'August 2025',
    endDate: 'July 2026',
    period: 'August 2025 – July 2026',
    experienceType: 'Full-time',
    description:
      'Worked as a Frontend Developer building and improving web applications and customer-facing products using modern frontend technologies.',
    technologies: ['React', 'TypeScript', 'Tailwind CSS'],
  },
  {
    id: 'aeria',
    company: 'Aeria',
    role: 'Full Stack Developer',
    profile: 'Full Stack Developer',
    startDate: 'July 2024',
    endDate: 'January 2025',
    period: 'July 2024 – January 2025',
    experienceType: 'Internship / Full-time',
    description:
      'I worked as a Backend Developer at Aeria. My day-to-day work involved writing APIs on the backend, making sure they worked reliably, and integrating them with the frontend.',
    technologies: ['NestJS', 'PostgreSQL', 'APIs', 'Frontend Integration'],
  },
  {
    id: 'qservices',
    company: 'Qservices',
    role: 'Node.js + Blockchain Developer',
    profile: 'Node.js + Blockchain Developer',
    startDate: 'April 2023',
    endDate: 'November 2023',
    period: 'April 2023 – November 2023',
    experienceType: 'Internship',
    description:
      'During my internship, I worked with Node.js and Blockchain and implemented them across several projects. I developed applications from scratch through hosting and deployment, and also worked with React Native toward the end of my internship.',
    technologies: ['Node.js', 'Blockchain', 'Deployment', 'React Native'],
  },
];

// Alias for backwards compatibility if needed
export const experienceData = EXPERIENCE;
