import { AIOutcomes } from './AIOutcomes';
import { AudienceSection } from './AudienceSection';
import { Challenges } from './Challenges';
import { FinalCTA } from './FinalCTA';
import { OutcomeStatements } from './OutcomeStatements';
import { Testimonials } from './Testimonials';
import { TransformationJourney } from './TransformationJourney';

export function HomeSections() {
  return <><Challenges /><TransformationJourney /><AIOutcomes /><Testimonials /><OutcomeStatements /><AudienceSection /><FinalCTA /></>;
}
