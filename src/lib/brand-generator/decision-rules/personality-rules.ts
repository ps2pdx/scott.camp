/**
 * Vendored read-only from ps2pdx/nertia `src/lib/decision-rules/personality-rules.ts` at 24a80c74, 2026-04-19 on main.
 * Byte-faithful apart from imports, which point at the other vendored files.
 */
import { PersonalityMapping } from '../brand-system';

export const PERSONALITY_MAPPINGS: Record<string, PersonalityMapping> = {
  innovative: {
    trait: 'innovative',
    designImpact: {
      borderRadius: 'rounded',
      spacing: 'generous',
      contrast: 'high',
      motion: 'expressive',
      typography: 'geometric',
    },
  },
  trustworthy: {
    trait: 'trustworthy',
    designImpact: {
      borderRadius: 'subtle',
      spacing: 'balanced',
      contrast: 'medium',
      motion: 'subtle',
      typography: 'humanist',
    },
  },
  bold: {
    trait: 'bold',
    designImpact: {
      borderRadius: 'sharp',
      spacing: 'generous',
      contrast: 'high',
      motion: 'expressive',
      typography: 'geometric',
    },
  },
  friendly: {
    trait: 'friendly',
    designImpact: {
      borderRadius: 'pill',
      spacing: 'generous',
      contrast: 'medium',
      motion: 'expressive',
      typography: 'humanist',
    },
  },
  premium: {
    trait: 'premium',
    designImpact: {
      borderRadius: 'subtle',
      spacing: 'generous',
      contrast: 'low',
      motion: 'subtle',
      typography: 'transitional',
    },
  },
  technical: {
    trait: 'technical',
    designImpact: {
      borderRadius: 'sharp',
      spacing: 'tight',
      contrast: 'high',
      motion: 'minimal',
      typography: 'geometric',
    },
  },
  playful: {
    trait: 'playful',
    designImpact: {
      borderRadius: 'pill',
      spacing: 'balanced',
      contrast: 'high',
      motion: 'expressive',
      typography: 'humanist',
    },
  },
  minimal: {
    trait: 'minimal',
    designImpact: {
      borderRadius: 'sharp',
      spacing: 'generous',
      contrast: 'high',
      motion: 'minimal',
      typography: 'geometric',
    },
  },
  sophisticated: {
    trait: 'sophisticated',
    designImpact: {
      borderRadius: 'subtle',
      spacing: 'generous',
      contrast: 'low',
      motion: 'subtle',
      typography: 'transitional',
    },
  },
  approachable: {
    trait: 'approachable',
    designImpact: {
      borderRadius: 'rounded',
      spacing: 'balanced',
      contrast: 'medium',
      motion: 'subtle',
      typography: 'humanist',
    },
  },
  energetic: {
    trait: 'energetic',
    designImpact: {
      borderRadius: 'rounded',
      spacing: 'tight',
      contrast: 'high',
      motion: 'expressive',
      typography: 'geometric',
    },
  },
  professional: {
    trait: 'professional',
    designImpact: {
      borderRadius: 'subtle',
      spacing: 'balanced',
      contrast: 'medium',
      motion: 'subtle',
      typography: 'transitional',
    },
  },
  creative: {
    trait: 'creative',
    designImpact: {
      borderRadius: 'rounded',
      spacing: 'generous',
      contrast: 'high',
      motion: 'expressive',
      typography: 'humanist',
    },
  },
  reliable: {
    trait: 'reliable',
    designImpact: {
      borderRadius: 'subtle',
      spacing: 'balanced',
      contrast: 'medium',
      motion: 'minimal',
      typography: 'transitional',
    },
  },
  secure: {
    trait: 'secure',
    designImpact: {
      borderRadius: 'sharp',
      spacing: 'balanced',
      contrast: 'high',
      motion: 'minimal',
      typography: 'geometric',
    },
  },
};

export function getPersonalityMapping(trait: string): PersonalityMapping | null {
  const lowerTrait = trait.toLowerCase();
  return PERSONALITY_MAPPINGS[lowerTrait] || null;
}

// Aggregate multiple personality traits into design decisions
export function aggregatePersonalityDesign(traits: string[]): {
  borderRadius: 'sharp' | 'subtle' | 'rounded' | 'pill';
  spacing: 'tight' | 'balanced' | 'generous';
  contrast: 'low' | 'medium' | 'high';
  motion: 'minimal' | 'subtle' | 'expressive';
  typography: 'geometric' | 'humanist' | 'transitional';
} {
  const mappings = traits
    .map((t) => getPersonalityMapping(t))
    .filter((m): m is PersonalityMapping => m !== null);

  if (mappings.length === 0) {
    return {
      borderRadius: 'subtle',
      spacing: 'balanced',
      contrast: 'medium',
      motion: 'subtle',
      typography: 'humanist',
    };
  }

  // Count votes for each property
  const borderRadiusCounts: Record<string, number> = {};
  const spacingCounts: Record<string, number> = {};
  const contrastCounts: Record<string, number> = {};
  const motionCounts: Record<string, number> = {};
  const typographyCounts: Record<string, number> = {};

  // Weight earlier traits more heavily
  mappings.forEach((m, index) => {
    const weight = mappings.length - index; // First trait gets highest weight
    const impact = m.designImpact;

    borderRadiusCounts[impact.borderRadius] = (borderRadiusCounts[impact.borderRadius] || 0) + weight;
    spacingCounts[impact.spacing] = (spacingCounts[impact.spacing] || 0) + weight;
    contrastCounts[impact.contrast] = (contrastCounts[impact.contrast] || 0) + weight;
    motionCounts[impact.motion] = (motionCounts[impact.motion] || 0) + weight;
    typographyCounts[impact.typography] = (typographyCounts[impact.typography] || 0) + weight;
  });

  // Get the highest voted option for each
  const getWinner = <T extends string>(counts: Record<string, number>): T => {
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0] as T;
  };

  return {
    borderRadius: getWinner<'sharp' | 'subtle' | 'rounded' | 'pill'>(borderRadiusCounts),
    spacing: getWinner<'tight' | 'balanced' | 'generous'>(spacingCounts),
    contrast: getWinner<'low' | 'medium' | 'high'>(contrastCounts),
    motion: getWinner<'minimal' | 'subtle' | 'expressive'>(motionCounts),
    typography: getWinner<'geometric' | 'humanist' | 'transitional'>(typographyCounts),
  };
}

// Map design decisions to concrete token values
export function mapDesignToTokens(design: ReturnType<typeof aggregatePersonalityDesign>): {
  borderRadius: { sm: string; md: string; lg: string; button: string };
  spacing: { section: string; card: string; component: string };
  shadow: { sm: string; md: string; lg: string };
  motionDuration: { fast: string; base: string; slow: string };
} {
  const borderRadiusMap = {
    sharp: { sm: '0', md: '0.125rem', lg: '0.25rem', button: '0.125rem' },
    subtle: { sm: '0.125rem', md: '0.375rem', lg: '0.5rem', button: '0.375rem' },
    rounded: { sm: '0.25rem', md: '0.5rem', lg: '0.75rem', button: '0.5rem' },
    pill: { sm: '0.5rem', md: '0.75rem', lg: '1rem', button: '9999px' },
  };

  const spacingMap = {
    tight: { section: '3rem', card: '1rem', component: '0.5rem' },
    balanced: { section: '4rem', card: '1.5rem', component: '1rem' },
    generous: { section: '6rem', card: '2rem', component: '1.5rem' },
  };

  const shadowMap = {
    low: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.03)',
      md: '0 2px 4px -1px rgb(0 0 0 / 0.05)',
      lg: '0 4px 6px -2px rgb(0 0 0 / 0.05)',
    },
    medium: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    },
    high: {
      sm: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.15)',
      lg: '0 20px 25px -5px rgb(0 0 0 / 0.15)',
    },
  };

  const motionMap = {
    minimal: { fast: '100ms', base: '150ms', slow: '200ms' },
    subtle: { fast: '150ms', base: '250ms', slow: '400ms' },
    expressive: { fast: '200ms', base: '350ms', slow: '600ms' },
  };

  return {
    borderRadius: borderRadiusMap[design.borderRadius],
    spacing: spacingMap[design.spacing],
    shadow: shadowMap[design.contrast],
    motionDuration: motionMap[design.motion],
  };
}
