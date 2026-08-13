import { BarChart3, BrainCircuit, CheckCircle2, Database, Layers3, ShieldCheck, Sparkles, UsersRound } from 'lucide-react';

export const challenges = [
  { label: 'SCATTERED SYSTEMS', title: 'Information lives everywhere.', description: 'Important information sits across disconnected tools, files, and workflows, making the complete picture difficult to see.', icon: Database },
  { label: 'SLOW PREPARATION', title: 'Preparation slows momentum.', description: 'Teams lose time finding, cleaning, and checking data before meaningful work can begin.', icon: Layers3 },
  { label: 'UNCERTAIN AI FOUNDATIONS', title: 'AI needs something dependable.', description: 'AI initiatives struggle when the underlying data is incomplete, inconsistent, or difficult to trust.', icon: BrainCircuit },
] as const;

export const journey = [
  ['01', 'Connect', 'Bring the sources that matter together in one clear workflow.'],
  ['02', 'Shape', 'Organize information so teams can work with it confidently.'],
  ['03', 'Trust', 'Build quality and governance into the way data moves.'],
  ['04', 'Activate', 'Prepare intelligence for AI, analytics, and daily decisions.'],
] as const;

export const aiOutcomes = [
  ['Search and knowledge assistants', 'Give teams a dependable foundation for finding answers across enterprise information.', Sparkles],
  ['Forecasting and prediction', 'Prepare consistent data that helps planners see what may happen next.', BarChart3],
  ['Customer intelligence', 'Connect the signals needed to understand customers and improve every interaction.', UsersRound],
  ['Automated decisions', 'Turn trusted information into repeatable actions across operational workflows.', CheckCircle2],
] as const;

export const testimonials = [
  { name: 'Maya Chen', role: 'Data Engineering Lead', company: 'Illustrative enterprise team', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80', challenge: 'Preparation work was slowing every new data initiative.', transformation: 'A clearer workflow helped the team spend more time building and less time untangling inputs.', quote: 'We can finally give our teams a dependable starting point instead of another data clean-up project.' },
  { name: 'Jordan Ellis', role: 'AI & Analytics Director', company: 'Illustrative enterprise team', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80', challenge: 'Promising experiments were difficult to turn into repeatable outcomes.', transformation: 'Better-prepared information created a stronger foundation for search, forecasting, and experimentation.', quote: 'The difference is not just cleaner data. It is more confidence in what our AI work can deliver.' },
  { name: 'Priya Raman', role: 'Operations Leader', company: '', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80', challenge: 'Important decisions depended on inconsistent views of the business.', transformation: 'Shared, trusted workflows made reporting and operational decisions easier to align.', quote: 'When everyone can work from the same trusted foundation, decisions move with much less friction.' },
  { name: 'Noah Williams', role: 'Data Governance Manager', company: 'Illustrative enterprise team', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80', challenge: 'Trust was difficult to maintain across changing sources.', transformation: 'Clearer quality workflows helped teams understand what was ready to use and what needed attention.', quote: 'Good governance became part of the work instead of a review that happened after it.' },
  { name: 'Sofia Laurent', role: 'Product Strategy Lead', company: '', image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=160&q=80', challenge: 'Business teams needed answers without waiting for another preparation cycle.', transformation: 'More usable information helped product and leadership teams move from questions to action with greater confidence.', quote: 'We spend less time debating which version is right and more time deciding what to do next.' },
] as const;

export const audiences = [
  ['Data engineering teams', 'Spend less time untangling preparation work and more time building the systems your business needs.'],
  ['AI and analytics teams', 'Start with cleaner, better-prepared data so experiments can become useful products.'],
  ['Enterprise decision makers', 'Create a dependable foundation for confident reporting, planning, and intelligent automation.'],
] as const;

export const stageIcons = [Database, Layers3, ShieldCheck, Sparkles] as const;
