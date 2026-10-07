import { IEducation } from '@/types/portfolio';

export const EDUCATION: IEducation[] = [
  {
    startDate: 2023,
    endDate: 2026,
    education: 'BTech',
    course: 'Computer Science & Engineering',
    description:
      "I am currently a second year student pursuing BTech in correspondence. I'm gaining knowledge and experience throughout my graduation.",
    graduatedFrom: 'St Solider Institute of Engineering and Technology',
    grade: '7.5',
  },
  {
    startDate: 2020,
    endDate: 2023,
    education: 'Diploma',
    course: 'Computer Science & Engineering',
    description:
      'I completed my Diploma in CSE where I learned everything about Tech from scratch with zero knowledge I enrolled into Diploma. Throughout the three years of my journey in Diploma I explored Hackathons, Devfests and participated in a few tech fests.',
    graduatedFrom: 'Mehr Chand Polytechnic College',
    grade: '7.5',
  },
  {
    startDate: 2019,
    endDate: 2020,
    education: 'Matriculation',
    course: null,
    description: 'I completed my 10th class with outstanding A+ grade.',
    graduatedFrom: 'A.P.S Public Senior Secondary School',
    grade: 'A+',
  },
];

// Backwards compatibility alias
export const educationData = EDUCATION;
