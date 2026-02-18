
import { AppState } from './types';

export const INITIAL_STATE: AppState = {
  hero: {
    id: 'hero',
    title: 'Turn your audience into buyers',
    subtitle: 'STRATEGY - SUBCONSCIOUS - SALES - VISION - IDENTITY',
    body: "We combine strategy & subconscious work because knowing what to do means nothing if you can't make yourself do it.",
    cta: 'EXPLORE WMHQ',
    imageUrl: 'https://images.unsplash.com/photo-1481349518771-20055b2a7b24?q=80&w=2000&auto=format&fit=crop'
  },
  mission: {
    id: 'mission',
    title: 'Your Silent Advantage',
    body: 'Wisdom isn\'t loud. It\'s felt. At Woman Mastery HQ, we move away from the hustle and towards high-level utility. We teach you how to command presence without saying a word.',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2000&auto=format&fit=crop'
  },
  programs: [
    {
      id: 'step-1',
      title: 'The Inner Architecture',
      body: 'Deconstructing old narratives to build a foundation of unshakable self-possession and psychological clarity.',
      cta: 'PHASE 01'
    },
    {
      id: 'step-2',
      title: 'The Strategic Outer',
      body: 'Refining your environment, your network, and your non-verbal communication for maximum impact.',
      cta: 'PHASE 02'
    },
    {
      id: 'step-3',
      title: 'The Legacy Matrix',
      body: 'Transforming success into a multi-generational asset class that transcends industry and time.',
      cta: 'PHASE 03'
    }
  ],
  testimonial: {
    id: 'testimonial',
    title: 'THE WISPR EFFECT',
    body: '"I finally found a space that understands that my ambition is not a conflict with my femininity. It is the fuel for it."',
    subtitle: '— Julianne M., Founder'
  },
  footer: {
    tagline: 'Quietly redefining what is possible.',
    contact: 'concierge@womanmasteryhq.com'
  }
};
