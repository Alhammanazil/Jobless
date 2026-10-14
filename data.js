// Demo listings. Companies other than Google, Traveloka and Gojek are fictional.
window.JOBLESS = {
  categories: ['Engineering', 'Design', 'Data', 'Product', 'Marketing', 'Writing'],
  jobs: [
    {
      id: 'j1', title: 'Frontend Developer', company: 'Google', logo: 'img/google-logo.png',
      category: 'Engineering', type: 'Full-time', level: 'Mid', min: 70000, max: 90000, days: 1,
      tags: ['React', 'TypeScript', 'Accessibility'],
      summary: 'Build fast, accessible interfaces used by millions of people every day.',
      about: 'You will join a distributed product team and own features from design handoff to production, working closely with designers and backend engineers.',
      todo: ['Ship polished UI with React and TypeScript', 'Review code and mentor teammates', 'Improve performance and accessibility across the product'],
      need: ['3+ years building production web apps', 'Strong HTML, CSS and JavaScript fundamentals', 'Comfortable working async across time zones']
    },
    {
      id: 'j2', title: 'Data Scientist', company: 'Traveloka', logo: 'img/traveloka-logo.jpg',
      category: 'Data', type: 'Full-time', level: 'Senior', min: 100000, max: 130000, days: 2,
      tags: ['Python', 'SQL', 'Machine Learning'],
      summary: 'Turn booking data into recommendations that help people travel smarter.',
      about: 'Work with product and engineering to design experiments, build models and measure what actually moves the needle.',
      todo: ['Build and evaluate ranking and pricing models', 'Design A/B tests and read the results honestly', 'Present findings to non-technical stakeholders'],
      need: ['5+ years in applied data science', 'Fluent in Python and SQL', 'Experience shipping models to production']
    },
    {
      id: 'j3', title: 'Technical Writer', company: 'Gojek', logo: 'img/gojek-logo.png',
      category: 'Writing', type: 'Contract', level: 'Mid', min: 60000, max: 80000, days: 3,
      tags: ['Documentation', 'API', 'Markdown'],
      summary: 'Make complex APIs feel simple with clear guides, references and tutorials.',
      about: 'Own the developer documentation for our partner platform, from quickstarts to deep references.',
      todo: ['Write and maintain API docs and tutorials', 'Interview engineers and turn notes into clear prose', 'Set up docs-as-code workflows'],
      need: ['2+ years writing developer documentation', 'Comfortable reading code and REST APIs', 'Excellent written English']
    },
    {
      id: 'j4', title: 'UI/UX Designer', company: 'Orbit Studio', logo: null,
      category: 'Design', type: 'Full-time', level: 'Mid', min: 80000, max: 100000, days: 1,
      tags: ['Figma', 'Prototyping', 'Design Systems'],
      summary: 'Design calm, usable interfaces for a growing portfolio of SaaS products.',
      about: 'You will run discovery, design flows end to end and help evolve a shared design system.',
      todo: ['Create wireframes, prototypes and polished UI in Figma', 'Run quick usability tests', 'Maintain and extend the design system'],
      need: ['Portfolio with shipped product work', 'Strong visual and interaction skills', 'Comfortable presenting design decisions']
    },
    {
      id: 'j5', title: 'Backend Engineer', company: 'Atlas Cloud', logo: null,
      category: 'Engineering', type: 'Full-time', level: 'Senior', min: 110000, max: 140000, days: 4,
      tags: ['Node.js', 'PostgreSQL', 'AWS'],
      summary: 'Design reliable APIs and services that scale with our customers.',
      about: 'Join the platform team to build the services behind our infrastructure product.',
      todo: ['Design and ship scalable REST and event-driven services', 'Own observability and on-call quality', 'Review designs and raise the bar for the team'],
      need: ['5+ years of backend experience', 'Deep knowledge of SQL databases', 'Experience with cloud infrastructure']
    },
    {
      id: 'j6', title: 'Product Manager', company: 'Nusantara Pay', logo: null,
      category: 'Product', type: 'Full-time', level: 'Senior', min: 95000, max: 125000, days: 5,
      tags: ['Roadmapping', 'Fintech', 'Analytics'],
      summary: 'Lead a payments product from idea to launch across several markets.',
      about: 'Partner with engineering, design and compliance to deliver features customers love and regulators approve.',
      todo: ['Own the roadmap and write clear specs', 'Define and track product metrics', 'Talk to customers every week'],
      need: ['4+ years in product management', 'Experience in fintech or marketplaces', 'Data-informed and decisive']
    },
    {
      id: 'j7', title: 'Growth Marketer', company: 'Kopi Digital', logo: null,
      category: 'Marketing', type: 'Part-time', level: 'Junior', min: 30000, max: 45000, days: 2,
      tags: ['SEO', 'Email', 'Analytics'],
      summary: 'Run small, fast experiments that bring in the next thousand customers.',
      about: 'A hands-on role for someone who likes to test ideas, measure them and double down on what works.',
      todo: ['Plan and run SEO, email and social experiments', 'Report weekly on funnel metrics', 'Write copy for landing pages'],
      need: ['1+ year in growth or content marketing', 'Comfortable with analytics tools', 'Curious and scrappy']
    },
    {
      id: 'j8', title: 'Machine Learning Engineer', company: 'Lumen Health', logo: null,
      category: 'Data', type: 'Full-time', level: 'Senior', min: 120000, max: 150000, days: 6,
      tags: ['PyTorch', 'MLOps', 'Python'],
      summary: 'Ship models that help clinicians spot problems earlier.',
      about: 'Work on the full lifecycle of ML systems in a regulated environment, from data pipelines to monitoring.',
      todo: ['Train, validate and deploy models', 'Build reliable data and evaluation pipelines', 'Collaborate with clinicians and engineers'],
      need: ['4+ years in ML engineering', 'Strong Python and PyTorch', 'Care about safety and reproducibility']
    },
    {
      id: 'j9', title: 'Content Designer', company: 'Paperplane', logo: null,
      category: 'Writing', type: 'Contract', level: 'Mid', min: 50000, max: 70000, days: 8,
      tags: ['UX Writing', 'Content Strategy', 'Research'],
      summary: 'Shape the words inside the product: labels, errors, onboarding and emails.',
      about: 'Work with designers and PMs to make every screen say exactly what it should.',
      todo: ['Write and edit product copy', 'Maintain voice and tone guidelines', 'Test messaging with users'],
      need: ['2+ years in UX writing or content design', 'Portfolio of product copy', 'Attention to detail']
    },
    {
      id: 'j10', title: 'Mobile Developer (Flutter)', company: 'Bluebird Media', logo: null,
      category: 'Engineering', type: 'Full-time', level: 'Mid', min: 65000, max: 85000, days: 3,
      tags: ['Flutter', 'Dart', 'REST'],
      summary: 'Build a smooth cross-platform app for readers and listeners.',
      about: 'Join a small mobile team shipping weekly releases to iOS and Android.',
      todo: ['Build and maintain features in Flutter', 'Write tests and keep the app fast', 'Collaborate with design on animations'],
      need: ['2+ years of mobile development', 'Experience with Flutter or React Native', 'Published apps are a plus']
    },
    {
      id: 'j11', title: 'Junior Data Analyst', company: 'Kopi Digital', logo: null,
      category: 'Data', type: 'Full-time', level: 'Junior', min: 35000, max: 50000, days: 5,
      tags: ['SQL', 'Spreadsheets', 'Dashboards'],
      summary: 'Answer everyday business questions with clear dashboards and queries.',
      about: 'A friendly first analyst role with plenty of mentoring and real responsibility.',
      todo: ['Write SQL to answer business questions', 'Build and maintain dashboards', 'Document metric definitions'],
      need: ['Good SQL and spreadsheet skills', 'Eagerness to learn', 'Clear communication']
    },
    {
      id: 'j12', title: 'Product Designer', company: 'Paperplane', logo: null,
      category: 'Design', type: 'Full-time', level: 'Senior', min: 95000, max: 120000, days: 9,
      tags: ['Figma', 'Research', 'Strategy'],
      summary: 'Lead design for a core product area, from research to launch.',
      about: 'Set the direction for a flagship flow and mentor a small team of designers.',
      todo: ['Lead discovery and define product direction', 'Design and ship end-to-end flows', 'Mentor designers and shape the process'],
      need: ['5+ years in product design', 'Track record of shipped work', 'Strong storytelling and facilitation']
    }
  ]
};
