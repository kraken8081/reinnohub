export interface Project {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  tags: string[];
  createdAt: string;
}

export const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Modern UI Design Systems',
    description: 'A comprehensive guide to building scalable and maintainable design systems for modern web applications. Covers typography, color theory, and component architecture.',
    url: 'https://example.com/design-systems',
    imageUrl: 'https://pixabay.com/get/g744ca09f1a4d3e24a9bfac76966bcea8a7ba9488e037f15edcb32cbb246688ff26125867e00bf28e6a3a0b674a3d9a36b6c7937d97abfe88696eeb0e29e6cfbb_1280.jpg',
    tags: ['Design', 'UI/UX', 'System'],
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'Advanced TypeScript Patterns',
    description: 'Deep dive into advanced TypeScript features including generics, conditional types, and mapped types. Essential for building robust libraries.',
    url: 'https://example.com/typescript',
    imageUrl: 'https://pixabay.com/get/g1ba4a24852b35ad468c541805aaa7aa2b74f518442a192cc2d66ceb67d21ff84b635eab8198d96cb8702d2a1ff49eeaf5378ad0e66cda5de7110ee640f50659d_1280.jpg',
    tags: ['Development', 'TypeScript', 'Code'],
    createdAt: '2024-01-18',
  },
  {
    id: '3',
    title: 'The Future of Digital Architecture',
    description: 'Exploring how digital spaces are evolving to mimic physical architecture. A look at spatial computing and 3D web interfaces.',
    url: 'https://example.com/architecture',
    imageUrl: 'https://pixabay.com/get/gf044e5f6e22c7cac29dfb720384a58007b906733847e59a0b04c56e6d8c9355eabc84479b23f92bdfbcdca1a4a36b92b6bd8b107162886fd63dd2da3ee579c0e_1280.jpg',
    tags: ['Architecture', '3D', 'Web'],
    createdAt: '2024-01-19',
  },
  {
    id: '4',
    title: 'Minimalist Workspace Setup',
    description: 'How to create a distraction-free environment for deep work. Tips on lighting, ergonomics, and desk organization.',
    url: 'https://example.com/workspace',
    imageUrl: 'https://pixabay.com/get/g3c8fc547e872fa236e542f75e67a849515bc243e117a05d0527be2287ea21c7c3cf9f6494056ea435efbad7158dbe0c6a0519006c75d45d476839f2b33d54a67_1280.png',
    tags: ['Productivity', 'Workspace', 'Minimalism'],
    createdAt: '2024-01-20',
  },
  {
    id: '5',
    title: 'Next-Gen Circuit Design',
    description: 'Understanding the fundamentals of modern hardware design and how it intersects with software optimization.',
    url: 'https://example.com/hardware',
    imageUrl: 'https://pixabay.com/get/g3828826f3f07ef95461fe8576d3a135e5b50ebced36f22ca09aa23b713fa1197908c47bcc0fa7b6998a905fceb5fbb703d07c64d425fde31f903762a8066729c_1280.jpg',
    tags: ['Hardware', 'Tech', 'Engineering'],
    createdAt: '2024-01-10',
  },
  {
    id: '6',
    title: 'Creative Workflow Optimization',
    description: 'Streamlining the creative process from ideation to execution. Tools and techniques for digital artists and designers.',
    url: 'https://example.com/workflow',
    imageUrl: 'https://pixabay.com/get/g7dddd9a9eec07da0318f006d5113334bd07865a9fbf1d6967ab946f2ce9bbd334f33606131c5edce8878af36edda873c675867a41ebc053686bf84a8517d8669_1280.jpg',
    tags: ['Workflow', 'Creativity', 'Tools'],
    createdAt: '2024-01-12',
  },
];
