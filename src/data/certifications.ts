import { ICertification } from '@/types/portfolio';

export const CERTIFICATIONS: ICertification[] = [
  {
    id: 'newton-school',
    title: 'Data Science Program',
    organization: 'Newton School',
    status: 'IN PROGRESS',
    description:
      'Data Science program covering data analysis, Excel, SQL, Python, Power BI, statistics and related analytical skills.',
  },
  {
    id: 'o7-fullstack',
    title: 'Full Stack Development Training',
    organization: 'O7 Services',
    period: 'Aug 2022 – Feb 2023',
    description:
      'Six-month training program focused on MERN stack development, JavaScript, React Native and Express.js, including a capstone project.',
  },
  {
    id: 'o7-php',
    title: 'Industrial Training — Core PHP',
    organization: 'O7 Services',
    period: 'Jul 2022 – Aug 2022',
    description:
      'Industrial training focused on PHP and building a minor project.',
  },
];
