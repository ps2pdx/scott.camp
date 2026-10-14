/**
 * Vendored read-only from ps2pdx/nertia `src/lib/decision-rules/industry-rules.ts` at 24a80c74, 2026-04-19 on main.
 * Byte-faithful apart from imports, which point at the other vendored files.
 */
import { IndustryProfile } from '../brand-system';

export const INDUSTRY_PROFILES: Record<string, IndustryProfile> = {
  'AI/ML Infrastructure': {
    name: 'AI/ML Infrastructure',
    colorMoodDefault: 'neutral',
    brightnessDefault: 'dark',
    typographyDefault: 'technical',
    densityDefault: 'balanced',
    motionIntensity: 'subtle',
    iconStyle: 'outline',
    suggestedPersonality: ['innovative', 'technical', 'sophisticated'],
  },
  'Developer Tools': {
    name: 'Developer Tools',
    colorMoodDefault: 'cool',
    brightnessDefault: 'dark',
    typographyDefault: 'technical',
    densityDefault: 'compact',
    motionIntensity: 'subtle',
    iconStyle: 'outline',
    suggestedPersonality: ['technical', 'efficient', 'powerful'],
  },
  'B2B SaaS': {
    name: 'B2B SaaS',
    colorMoodDefault: 'cool',
    brightnessDefault: 'vibrant',
    typographyDefault: 'modern',
    densityDefault: 'balanced',
    motionIntensity: 'moderate',
    iconStyle: 'outline',
    suggestedPersonality: ['professional', 'trustworthy', 'efficient'],
  },
  'Fintech': {
    name: 'Fintech',
    colorMoodDefault: 'cool',
    brightnessDefault: 'muted',
    typographyDefault: 'modern',
    densityDefault: 'balanced',
    motionIntensity: 'subtle',
    iconStyle: 'outline',
    suggestedPersonality: ['trustworthy', 'premium', 'secure'],
  },
  'Healthcare Tech': {
    name: 'Healthcare Tech',
    colorMoodDefault: 'cool',
    brightnessDefault: 'muted',
    typographyDefault: 'classic',
    densityDefault: 'spacious',
    motionIntensity: 'subtle',
    iconStyle: 'outline',
    suggestedPersonality: ['trustworthy', 'caring', 'accessible'],
  },
  'E-commerce': {
    name: 'E-commerce',
    colorMoodDefault: 'warm',
    brightnessDefault: 'vibrant',
    typographyDefault: 'modern',
    densityDefault: 'compact',
    motionIntensity: 'moderate',
    iconStyle: 'solid',
    suggestedPersonality: ['energetic', 'trustworthy', 'friendly'],
  },
  'Consumer Apps': {
    name: 'Consumer Apps',
    colorMoodDefault: 'warm',
    brightnessDefault: 'vibrant',
    typographyDefault: 'playful',
    densityDefault: 'balanced',
    motionIntensity: 'energetic',
    iconStyle: 'solid',
    suggestedPersonality: ['playful', 'friendly', 'engaging'],
  },
  'Climate Tech': {
    name: 'Climate Tech',
    colorMoodDefault: 'cool',
    brightnessDefault: 'muted',
    typographyDefault: 'modern',
    densityDefault: 'spacious',
    motionIntensity: 'subtle',
    iconStyle: 'outline',
    suggestedPersonality: ['optimistic', 'sophisticated', 'responsible'],
  },
  'EdTech': {
    name: 'EdTech',
    colorMoodDefault: 'warm',
    brightnessDefault: 'vibrant',
    typographyDefault: 'playful',
    densityDefault: 'spacious',
    motionIntensity: 'moderate',
    iconStyle: 'solid',
    suggestedPersonality: ['friendly', 'approachable', 'engaging'],
  },
  'Enterprise Software': {
    name: 'Enterprise Software',
    colorMoodDefault: 'neutral',
    brightnessDefault: 'muted',
    typographyDefault: 'classic',
    densityDefault: 'compact',
    motionIntensity: 'subtle',
    iconStyle: 'outline',
    suggestedPersonality: ['professional', 'reliable', 'powerful'],
  },
  'Cybersecurity': {
    name: 'Cybersecurity',
    colorMoodDefault: 'cool',
    brightnessDefault: 'dark',
    typographyDefault: 'technical',
    densityDefault: 'balanced',
    motionIntensity: 'subtle',
    iconStyle: 'outline',
    suggestedPersonality: ['secure', 'trustworthy', 'vigilant'],
  },
  'Gaming': {
    name: 'Gaming',
    colorMoodDefault: 'warm',
    brightnessDefault: 'vibrant',
    typographyDefault: 'playful',
    densityDefault: 'compact',
    motionIntensity: 'energetic',
    iconStyle: 'solid',
    suggestedPersonality: ['bold', 'energetic', 'immersive'],
  },
  'Media & Entertainment': {
    name: 'Media & Entertainment',
    colorMoodDefault: 'neutral',
    brightnessDefault: 'dark',
    typographyDefault: 'modern',
    densityDefault: 'spacious',
    motionIntensity: 'energetic',
    iconStyle: 'solid',
    suggestedPersonality: ['creative', 'bold', 'engaging'],
  },
  'Real Estate': {
    name: 'Real Estate',
    colorMoodDefault: 'neutral',
    brightnessDefault: 'muted',
    typographyDefault: 'classic',
    densityDefault: 'spacious',
    motionIntensity: 'subtle',
    iconStyle: 'outline',
    suggestedPersonality: ['premium', 'trustworthy', 'sophisticated'],
  },
  'Travel & Hospitality': {
    name: 'Travel & Hospitality',
    colorMoodDefault: 'warm',
    brightnessDefault: 'vibrant',
    typographyDefault: 'modern',
    densityDefault: 'spacious',
    motionIntensity: 'moderate',
    iconStyle: 'solid',
    suggestedPersonality: ['adventurous', 'welcoming', 'inspiring'],
  },
};

export function getIndustryProfile(industry: string): IndustryProfile | null {
  // Direct match
  if (INDUSTRY_PROFILES[industry]) {
    return INDUSTRY_PROFILES[industry];
  }

  // Fuzzy match - check if any profile name is contained in the industry string
  const lowerIndustry = industry.toLowerCase();
  for (const [key, profile] of Object.entries(INDUSTRY_PROFILES)) {
    if (lowerIndustry.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerIndustry)) {
      return profile;
    }
  }

  // Check for common keywords
  const keywordMap: Record<string, string> = {
    'ai': 'AI/ML Infrastructure',
    'machine learning': 'AI/ML Infrastructure',
    'developer': 'Developer Tools',
    'devtools': 'Developer Tools',
    'saas': 'B2B SaaS',
    'b2b': 'B2B SaaS',
    'finance': 'Fintech',
    'banking': 'Fintech',
    'payment': 'Fintech',
    'health': 'Healthcare Tech',
    'medical': 'Healthcare Tech',
    'ecommerce': 'E-commerce',
    'retail': 'E-commerce',
    'shop': 'E-commerce',
    'consumer': 'Consumer Apps',
    'mobile app': 'Consumer Apps',
    'climate': 'Climate Tech',
    'sustainability': 'Climate Tech',
    'green': 'Climate Tech',
    'education': 'EdTech',
    'learning': 'EdTech',
    'enterprise': 'Enterprise Software',
    'security': 'Cybersecurity',
    'cyber': 'Cybersecurity',
    'game': 'Gaming',
    'media': 'Media & Entertainment',
    'entertainment': 'Media & Entertainment',
    'real estate': 'Real Estate',
    'property': 'Real Estate',
    'travel': 'Travel & Hospitality',
    'hotel': 'Travel & Hospitality',
  };

  for (const [keyword, profileKey] of Object.entries(keywordMap)) {
    if (lowerIndustry.includes(keyword)) {
      return INDUSTRY_PROFILES[profileKey];
    }
  }

  return null;
}

export function getIndustryDefaults(industry: string): Partial<{
  colorMood: 'warm' | 'cool' | 'neutral';
  colorBrightness: 'vibrant' | 'muted' | 'dark';
  typographyStyle: 'modern' | 'classic' | 'playful' | 'technical';
  densityPreference: 'spacious' | 'balanced' | 'compact';
}> {
  const profile = getIndustryProfile(industry);
  if (!profile) return {};

  return {
    colorMood: profile.colorMoodDefault,
    colorBrightness: profile.brightnessDefault,
    typographyStyle: profile.typographyDefault,
    densityPreference: profile.densityDefault,
  };
}
