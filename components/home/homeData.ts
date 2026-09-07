import { BarChart3, BrainCircuit, CheckCircle2, Database, Layers3, ShieldCheck, Sparkles, UsersRound } from 'lucide-react';

export const challenges = [
  { label: 'SCATTERED SYSTEMS', icon: "images/SCATTERED SYSTEMS.webp", title: 'Information lives everywhere.', description: 'Important information sits across disconnected tools, files, and workflows, making the complete picture difficult to see.' },
  { label: 'SLOW PREPARATION', icon: "images/SLOW PREPARATION.webp", title: 'Preparation slows momentum.', description: 'Teams lose time finding, cleaning, and checking data before meaningful work can begin.' },
  { label: 'UNCERTAIN AI FOUNDATIONS', icon: "images/UNCERTAIN AI FOUNDATIONS.webp", title: 'AI needs something dependable.', description: 'AI initiatives struggle when the underlying data is incomplete, inconsistent, or difficult to trust.' },
] as const;

export const journey = [
  ['01', 'Connect', 'Bring the sources that matter together in one clear workflow.', "images/Connect.webp"],
  ['02', 'Shape', 'Organize information so teams can work with it confidently.', "images/Shape.webp"],
  ['03', 'Trust', 'Build quality and governance into the way data moves.', "images/Trust.webp"],
  ['04', 'Activate', 'Prepare intelligence for AI, analytics, and daily decisions.', "images/Activate.webp"],
] as const;

export const aiOutcomes = [
  ['Search and knowledge assistants', 'Give teams a dependable foundation for finding answers across enterprise information.', "images/Search and knowledge assistants.webp"],
  ['Forecasting and prediction', 'Prepare consistent data that helps planners see what may happen next.', "images/Forecasting and prediction.webp"],
  ['Customer intelligence', 'Connect the signals needed to understand customers and improve every interaction.', "images/Customer intelligence.webp"],
  ['Automated decisions', 'Turn trusted information into repeatable actions across operational workflows.', "images/Automated decisions.webp"],
] as const;

export const testimonials = [
  { name: 'Elena Voss', role: 'Data Engineering Lead', company: 'Illustrative enterprise team', image: '/images/Elena Voss.webp', challenge: 'Preparation work was slowing every new data initiative.', transformation: 'A clearer workflow helped the team spend more time building and less time untangling inputs.', quote: 'We can finally give our teams a dependable starting point instead of another data clean-up project.' },
  { name: 'Marcus Hale', role: 'AI & Analytics Director', company: 'Illustrative enterprise team', image: '/images/Marcus Hale.webp', challenge: 'Promising experiments were difficult to turn into repeatable outcomes.', transformation: 'Better-prepared information created a stronger foundation for search, forecasting, and experimentation.', quote: 'The difference is not just cleaner data. It is more confidence in what our AI work can deliver.' },
  { name: 'Soren Whitaker', role: 'Operations Leader', company: '', image: '/images/Soren Whitaker.webp', challenge: 'Important decisions depended on inconsistent views of the business.', transformation: 'Shared, trusted workflows made reporting and operational decisions easier to align.', quote: 'When everyone can work from the same trusted foundation, decisions move with much less friction.' },
  { name: 'Aarav Mathesh', role: 'Data Governance Manager', company: 'Illustrative enterprise team', image: '/images/Aarav Mathesh.webp', challenge: 'Trust was difficult to maintain across changing sources.', transformation: 'Clearer quality workflows helped teams understand what was ready to use and what needed attention.', quote: 'Good governance became part of the work instead of a review that happened after it.' },
  { name: 'Nivaan Perera', role: 'Product Strategy Lead', company: '', image: '/images/Nivaan Perera.webp', challenge: 'Business teams needed answers without waiting for another preparation cycle.', transformation: 'More usable information helped product and leadership teams move from questions to action with greater confidence.', quote: 'We spend less time debating which version is right and more time deciding what to do next.' },
] as const;

export const stageIcons = [Database, Layers3, ShieldCheck, Sparkles] as const;
