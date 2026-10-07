import { IProject } from '@/types/portfolio';

export const PROJECTS: IProject[] = [
  {
    name: 'NFT Marketplace',
    imageUrl: '/images/projects/nft-marketplace.png',
    description:
      'NFT Marketplace is a platform where you can mint your own NFT at efficient gas price. You can Sell or Auction the NFT. This project uses Metamask for the transactions.',
    url: 'https://nft-marketplace-ashy-xi.vercel.app/',
    github: 'https://github.com/Sunny-64/NFT-marketplace',
    techStack: 'Reactjs, Nodejs, MongoDB, Solidity, Ethereum, Firebase',
    category: 'web-development',
  },
  {
    name: 'News App',
    imageUrl: '/images/projects/news-app.png',
    description:
      'News App uses a third party API to show the News of various categories and countries. It shows the country specific news with country specific language. The project has a really nice UI with the support of dark mode.',
    url: 'https://news-app-1vy4.vercel.app/',
    github: 'https://github.com/Sunny-64/News-App',
    techStack: 'Reactjs, Nodejs, Tailwind CSS',
    category: 'web-development',
  },
  {
    name: 'Online Journal',
    imageUrl: '/images/projects/online-journal.png',
    description:
      'Online journal is a writing specific platform where users can write their thoughts and share it to others. Users can share their research to other people and journal their entire day.',
    url: 'https://writejournal.000webhostapp.com/',
    github: 'https://github.com/Sunny-64/Journal-Project-using-PHP',
    techStack: 'PHP, HTML, CSS, JavaScript',
    category: 'web-development',
  },
  {
    name: 'Secrets',
    imageUrl: '/images/projects/secrets.png',
    description:
      'Secrets is a platform where users can share their secrets anonymously. It uses OAuth to provide users multiple ways to register and login like Google and Facebook Authentication.',
    url: 'https://secret-chi.vercel.app/',
    github: 'https://github.com/Sunny-64/Secret/tree/0b850ed6999ff3aca4d6fd84204f5d12',
    techStack: 'HTML, CSS, Bootstrap, JavaScript, Nodejs, MongoDB',
    category: 'web-development',
  },
  {
    name: 'Simon Game',
    imageUrl: '/images/projects/simon-game.png',
    description:
      'The Simon game is the exciting game of colours and sounds in which players must repeat random sequences of colours by pressing the colored boxes in the correct order.',
    url: 'https://sunny-64.github.io/100-Days-Of-Web-Development/Simon%20game/index.html',
    github: 'https://github.com/Sunny-64/100-Days-Of-Web-Development/tree/main/Simon%20game',
    techStack: 'HTML, CSS, JavaScript',
    category: 'web-development',
  },
  {
    name: 'Analog Clock',
    imageUrl: '/images/projects/analog-clock.png',
    description:
      'This analog clock project is built using HTML, CSS, and JavaScript. It features real-time movement of hour, minute, and second hands.',
    url: 'https://sunny-64.github.io/100-Days-Of-Web-Development/Analog%20Clock/index.html',
    github: 'https://github.com/Sunny-64/100-Days-Of-Web-Development/tree/main/Analog%20Clock',
    techStack: 'HTML, CSS, JavaScript',
    category: 'web-development',
  },
];

// Alias for backwards compatibility if needed
export const projectsData = PROJECTS;
