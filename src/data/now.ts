import { NowItem } from '@/types/portfolio';

export const NOW_ITEMS: NowItem[] = [
  {
    id: 'working-on',
    category: 'Working On',
    title: 'Working On',
    description: 'Building data analytics projects and improving my portfolio.',
    iconName: 'working',
  },
  {
    id: 'learning',
    category: 'Learning',
    title: 'Learning',
    subtitle: 'Data Science – Newton School',
    description: 'SQL, Excel, Power BI, Python',
    iconName: 'learning',
  },
  {
    id: 'reading',
    category: 'Reading',
    title: 'Reading',
    subtitle: 'Short Stories Collection',
    description: 'by Roald Dahl',
    coverImage: '/images/now/roald-dahl.jpg',
    iconName: 'reading',
  },
  {
    id: 'playing',
    category: 'Playing',
    title: 'Playing',
    subtitle: 'NieR:Automata',
    description: 'Game of the YoRHa Edition',
    coverImage: '/images/now/nier-automata.jpg',
    iconName: 'playing',
  },
];
