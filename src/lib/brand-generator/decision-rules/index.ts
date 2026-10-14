/**
 * Vendored read-only from ps2pdx/nertia `src/lib/decision-rules/index.ts` at 24a80c74, 2026-04-19 on main.
 * Byte-faithful apart from imports, which point at the other vendored files.
 */
export { INDUSTRY_PROFILES, getIndustryProfile, getIndustryDefaults } from './industry-rules';
export { PERSONALITY_MAPPINGS, getPersonalityMapping, aggregatePersonalityDesign, mapDesignToTokens } from './personality-rules';
export { AUDIENCE_PROFILES, getAudienceProfile, getAudienceTypography, getAudienceVoiceGuidance } from './audience-rules';

import { DiscoveryInputs } from '../brand-system';
import { getIndustryProfile, getIndustryDefaults } from './industry-rules';
import { aggregatePersonalityDesign, mapDesignToTokens } from './personality-rules';
import { getAudienceProfile, getAudienceTypography, getAudienceVoiceGuidance } from './audience-rules';

export interface DerivedDesignDecisions {
  // From industry
  industry: {
    profile: ReturnType<typeof getIndustryProfile>;
    defaults: ReturnType<typeof getIndustryDefaults>;
  };
  // From personality
  personality: {
    designDecisions: ReturnType<typeof aggregatePersonalityDesign>;
    tokenValues: ReturnType<typeof mapDesignToTokens>;
  };
  // From audience
  audience: {
    profile: ReturnType<typeof getAudienceProfile>;
    typography: ReturnType<typeof getAudienceTypography>;
    voice: ReturnType<typeof getAudienceVoiceGuidance>;
  };
  // Combined recommendations
  recommendations: {
    colorMode: 'light' | 'dark' | 'both';
    primaryMotion: 'minimal' | 'subtle' | 'expressive';
    accessibilityLevel: 'AA' | 'AAA';
    suggestedFonts: {
      display: string[];
      body: string[];
      mono: string[];
    };
  };
}

export function deriveDesignDecisions(inputs: DiscoveryInputs): DerivedDesignDecisions {
  // Get profiles
  const industryProfile = getIndustryProfile(inputs.industry);
  const industryDefaults = getIndustryDefaults(inputs.industry);
  const audienceProfile = getAudienceProfile(inputs.targetAudience);
  const audienceTypography = getAudienceTypography(inputs.targetAudience);
  const audienceVoice = getAudienceVoiceGuidance(inputs.targetAudience);

  // Aggregate personality traits
  const personalityDesign = aggregatePersonalityDesign(inputs.personalityAdjectives);
  const tokenValues = mapDesignToTokens(personalityDesign);

  // Determine color mode preference
  let colorMode: 'light' | 'dark' | 'both' = 'both';
  if (inputs.colorBrightness === 'dark' || industryDefaults.colorBrightness === 'dark') {
    colorMode = 'dark';
  } else if (audienceProfile?.accessibilityPriority === 'critical') {
    colorMode = 'light'; // Better for accessibility
  }

  // Determine motion intensity
  let primaryMotion: 'minimal' | 'subtle' | 'expressive' = personalityDesign.motion;
  if (audienceProfile?.accessibilityPriority === 'critical') {
    primaryMotion = 'minimal'; // Reduce motion for accessibility
  }

  // Determine accessibility level
  let accessibilityLevel: 'AA' | 'AAA' = 'AA';
  if (audienceProfile?.accessibilityPriority === 'critical' || audienceProfile?.accessibilityPriority === 'high') {
    accessibilityLevel = 'AAA';
  }

  // Suggest fonts based on typography style and audience
  const suggestedFonts = getSuggestedFonts(inputs.typographyStyle, personalityDesign.typography, audienceTypography.preferMonospace);

  return {
    industry: {
      profile: industryProfile,
      defaults: industryDefaults,
    },
    personality: {
      designDecisions: personalityDesign,
      tokenValues,
    },
    audience: {
      profile: audienceProfile,
      typography: audienceTypography,
      voice: audienceVoice,
    },
    recommendations: {
      colorMode,
      primaryMotion,
      accessibilityLevel,
      suggestedFonts,
    },
  };
}

function getSuggestedFonts(
  typographyStyle: string,
  typographyFamily: 'geometric' | 'humanist' | 'transitional',
  preferMonospace: boolean
): { display: string[]; body: string[]; mono: string[] } {
  const fontMap = {
    modern: {
      geometric: {
        display: ['Inter', 'Geist', 'Plus Jakarta Sans'],
        body: ['Inter', 'Geist', 'DM Sans'],
      },
      humanist: {
        display: ['Source Sans 3', 'Open Sans', 'Lato'],
        body: ['Source Sans 3', 'Open Sans', 'Nunito'],
      },
      transitional: {
        display: ['Inter', 'IBM Plex Sans', 'Roboto'],
        body: ['Inter', 'IBM Plex Sans', 'Roboto'],
      },
    },
    classic: {
      geometric: {
        display: ['Libre Franklin', 'Work Sans', 'Archivo'],
        body: ['Libre Franklin', 'Work Sans', 'Archivo'],
      },
      humanist: {
        display: ['Merriweather', 'Lora', 'Crimson Text'],
        body: ['Source Serif 4', 'Crimson Text', 'Lora'],
      },
      transitional: {
        display: ['Playfair Display', 'Cormorant', 'EB Garamond'],
        body: ['Source Serif 4', 'Libre Baskerville', 'Spectral'],
      },
    },
    playful: {
      geometric: {
        display: ['Outfit', 'Poppins', 'Quicksand'],
        body: ['Poppins', 'Nunito', 'Quicksand'],
      },
      humanist: {
        display: ['Baloo 2', 'Comfortaa', 'Varela Round'],
        body: ['Nunito', 'Comfortaa', 'Quicksand'],
      },
      transitional: {
        display: ['Sora', 'Outfit', 'Poppins'],
        body: ['Nunito', 'Poppins', 'Outfit'],
      },
    },
    technical: {
      geometric: {
        display: ['JetBrains Mono', 'Space Grotesk', 'Azeret Mono'],
        body: ['Inter', 'Space Grotesk', 'Geist'],
      },
      humanist: {
        display: ['Space Grotesk', 'IBM Plex Sans', 'Figtree'],
        body: ['Inter', 'IBM Plex Sans', 'Figtree'],
      },
      transitional: {
        display: ['Space Grotesk', 'Inter', 'IBM Plex Sans'],
        body: ['Inter', 'IBM Plex Sans', 'Geist'],
      },
    },
  };

  const monoFonts = preferMonospace
    ? ['JetBrains Mono', 'Fira Code', 'Source Code Pro']
    : ['Geist Mono', 'IBM Plex Mono', 'Roboto Mono'];

  const styleKey = typographyStyle as keyof typeof fontMap;
  const familyKey = typographyFamily;

  const fonts = fontMap[styleKey]?.[familyKey] || fontMap.modern.humanist;

  return {
    display: fonts.display,
    body: fonts.body,
    mono: monoFonts,
  };
}

// Generate a summary for prompt injection
export function generateDecisionSummary(decisions: DerivedDesignDecisions): string {
  const lines: string[] = [];

  if (decisions.industry.profile) {
    lines.push(`## Industry Intelligence: ${decisions.industry.profile.name}`);
    lines.push(`- Default color mood: ${decisions.industry.profile.colorMoodDefault}`);
    lines.push(`- Suggested motion: ${decisions.industry.profile.motionIntensity}`);
    lines.push(`- Icon style: ${decisions.industry.profile.iconStyle}`);
    lines.push('');
  }

  lines.push('## Personality-Derived Design:');
  lines.push(`- Border radius: ${decisions.personality.designDecisions.borderRadius}`);
  lines.push(`- Spacing: ${decisions.personality.designDecisions.spacing}`);
  lines.push(`- Contrast: ${decisions.personality.designDecisions.contrast}`);
  lines.push(`- Motion: ${decisions.personality.designDecisions.motion}`);
  lines.push(`- Typography family: ${decisions.personality.designDecisions.typography}`);
  lines.push('');

  if (decisions.audience.profile) {
    lines.push(`## Audience Optimization: ${decisions.audience.profile.name}`);
    lines.push(`- Formality: ${decisions.audience.profile.formalityLevel}`);
    lines.push(`- Technical level: ${decisions.audience.profile.technicalLevel}`);
    lines.push(`- Accessibility: ${decisions.audience.profile.accessibilityPriority}`);
    lines.push(`- Voice tone: ${decisions.audience.voice.tone.join(', ')}`);
    lines.push(`- Avoid: ${decisions.audience.voice.avoid.join(', ')}`);
    lines.push('');
  }

  lines.push('## Recommendations:');
  lines.push(`- Primary color mode: ${decisions.recommendations.colorMode}`);
  lines.push(`- Motion intensity: ${decisions.recommendations.primaryMotion}`);
  lines.push(`- Accessibility target: WCAG ${decisions.recommendations.accessibilityLevel}`);
  lines.push(`- Suggested display fonts: ${decisions.recommendations.suggestedFonts.display.join(', ')}`);
  lines.push(`- Suggested body fonts: ${decisions.recommendations.suggestedFonts.body.join(', ')}`);
  lines.push(`- Suggested mono fonts: ${decisions.recommendations.suggestedFonts.mono.join(', ')}`);

  return lines.join('\n');
}
