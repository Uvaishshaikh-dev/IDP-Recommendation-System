export const roles = [
  { id: 'frontend', name: 'Frontend Developer', icon: 'Layout' },
  { id: 'backend', name: 'Backend Developer', icon: 'Server' },
  { id: 'fullstack', name: 'Full Stack Developer', icon: 'Layers' },
  { id: 'data_scientist', name: 'Data Scientist', icon: 'Database' },
  { id: 'product_manager', name: 'Product Manager', icon: 'Briefcase' }
];

export const allSkills = [
  { id: 'js', name: 'JavaScript / TypeScript', category: 'Technical' },
  { id: 'react', name: 'React.js', category: 'Technical' },
  { id: 'node', name: 'Node.js', category: 'Technical' },
  { id: 'python', name: 'Python', category: 'Technical' },
  { id: 'sysdesign', name: 'System Design', category: 'Technical' },
  { id: 'communication', name: 'Communication', category: 'Soft' },
  { id: 'agile', name: 'Agile & Scrum', category: 'Soft' }
];

export const roleRequirements = {
  frontend: { js: 5, react: 5, node: 2, python: 1, sysdesign: 3, communication: 4, agile: 4 },
  backend: { js: 3, react: 1, node: 5, python: 4, sysdesign: 5, communication: 4, agile: 4 },
  fullstack: { js: 5, react: 4, node: 4, python: 3, sysdesign: 4, communication: 4, agile: 4 },
  data_scientist: { js: 1, react: 1, node: 1, python: 5, sysdesign: 3, communication: 4, agile: 3 },
  product_manager: { js: 1, react: 1, node: 1, python: 1, sysdesign: 2, communication: 5, agile: 5 }
};

export const learningResources = [
  {
    id: 'res_1',
    title: 'Advanced React Patterns',
    type: 'Course',
    targetSkill: 'react',
    difficulty: 'Advanced',
    duration: '4 weeks',
    provider: 'Frontend Masters',
    description: 'Deep dive into React performance and hooks.'
  },
  {
    id: 'res_6',
    title: 'Modern JavaScript Foundations',
    type: 'Course',
    targetSkill: 'js',
    difficulty: 'Intermediate',
    duration: '2 weeks',
    provider: 'freeCodeCamp',
    description: 'Strengthen ES6+, asynchronous programming, and clean code habits.'
  },
  {
    id: 'res_7',
    title: 'Agile Delivery Playbook',
    type: 'Workshop',
    targetSkill: 'agile',
    difficulty: 'All Levels',
    duration: '1 week',
    provider: 'Atlassian University',
    description: 'Plan, estimate, and improve delivery with practical Scrum rituals.'
  },
  {
    id: 'res_2',
    title: 'System Design Interview Prep',
    type: 'Book',
    targetSkill: 'sysdesign',
    difficulty: 'Intermediate',
    duration: '2 weeks',
    provider: 'Educative',
    description: 'Learn to design scalable systems.'
  },
  {
    id: 'res_3',
    title: 'Node.js Microservices',
    type: 'Course',
    targetSkill: 'node',
    difficulty: 'Intermediate',
    duration: '3 weeks',
    provider: 'Udemy',
    description: 'Build robust backends with Node and Express.'
  },
  {
    id: 'res_4',
    title: 'Effective Communication in Tech',
    type: 'Mentorship',
    targetSkill: 'communication',
    difficulty: 'All Levels',
    duration: 'Ongoing',
    provider: 'Internal Mentor Program',
    description: '1-on-1 sessions to improve stakeholder communication.'
  },
  {
    id: 'res_5',
    title: 'Python for Data Analysis',
    type: 'Course',
    targetSkill: 'python',
    difficulty: 'Beginner',
    duration: '4 weeks',
    provider: 'Coursera',
    description: 'Pandas, NumPy, and data visualization.'
  }
];

export const flashcards = [
  {
    id: 'js-closure',
    skillId: 'js',
    skill: 'JavaScript / TypeScript',
    subject: 'Web Development',
    question: 'What is a closure in JavaScript?',
    answer: 'A closure is a function together with the lexical scope in which it was created, allowing it to remember and access outer variables even after the outer function returns.',
  },
  {
    id: 'js-event-loop',
    skillId: 'js',
    skill: 'JavaScript / TypeScript',
    subject: 'Web Development',
    question: 'What does the JavaScript event loop coordinate?',
    answer: 'It coordinates the call stack, browser or Node APIs, task queue, and microtask queue so asynchronous work can run without blocking the main thread.',
  },
  {
    id: 'react-state',
    skillId: 'react',
    skill: 'React.js',
    subject: 'Web Development',
    question: 'When should you use state in a React component?',
    answer: 'Use state for data that changes over time and should cause the component UI to render again when updated.',
  },
  {
    id: 'react-effect',
    skillId: 'react',
    skill: 'React.js',
    subject: 'Web Development',
    question: 'What is useEffect mainly used for?',
    answer: 'It is used to synchronize a component with an external system, such as fetching data, subscribing to events, or updating the document title.',
  },
  {
    id: 'node-middleware',
    skillId: 'node',
    skill: 'Node.js',
    subject: 'Backend Development',
    question: 'What is middleware in Express?',
    answer: 'Middleware is a function that receives the request, response, and next callback. It can inspect or change the request/response, end the response, or pass control onward.',
  },
  {
    id: 'node-rest',
    skillId: 'node',
    skill: 'Node.js',
    subject: 'Backend Development',
    question: 'Which HTTP method is normally used to partially update a resource?',
    answer: 'PATCH is normally used for a partial update. PUT generally replaces the full resource representation.',
  },
  {
    id: 'python-list-comp',
    skillId: 'python',
    skill: 'Python',
    subject: 'Programming Fundamentals',
    question: 'What does a Python list comprehension create?',
    answer: 'It creates a new list by applying an expression to each item in an iterable, optionally filtering the items with a condition.',
  },
  {
    id: 'python-pandas',
    skillId: 'python',
    skill: 'Python',
    subject: 'Data Analysis',
    question: 'What is a pandas DataFrame?',
    answer: 'A two-dimensional labeled table of data with rows and columns, similar to a spreadsheet or a SQL table.',
  },
  {
    id: 'system-cache',
    skillId: 'sysdesign',
    skill: 'System Design',
    subject: 'Computer Science',
    question: 'Why is caching useful in a distributed system?',
    answer: 'Caching stores frequently used results closer to the user or service, reducing latency and lowering the load on the original data source.',
  },
  {
    id: 'system-load-balancer',
    skillId: 'sysdesign',
    skill: 'System Design',
    subject: 'Computer Science',
    question: 'What is the role of a load balancer?',
    answer: 'It distributes incoming traffic across available servers to improve reliability, performance, and scalability.',
  },
  {
    id: 'communication-sbi',
    skillId: 'communication',
    skill: 'Communication',
    subject: 'Professional Skills',
    question: 'What does the SBI feedback framework stand for?',
    answer: 'Situation, Behavior, Impact. It structures feedback around when something happened, what was observed, and the resulting effect.',
  },
  {
    id: 'agile-sprint',
    skillId: 'agile',
    skill: 'Agile & Scrum',
    subject: 'Project Management',
    question: 'What is the purpose of a sprint retrospective?',
    answer: 'The team reflects on how it worked during the sprint and agrees on practical improvements to try next.',
  },
];

// Initial mock user state
export const mockUser = {
  name: "Alex Doe",
  currentRole: "Frontend Developer",
  targetRole: "Full Stack Developer",
  currentSkills: {
    js: 4,
    react: 4,
    node: 2,
    python: 1,
    sysdesign: 2,
    communication: 3,
    agile: 4
  },
  completedRecommendationIds: [],
  reviewedFlashcardIds: [],
  knownFlashcardIds: []
};
