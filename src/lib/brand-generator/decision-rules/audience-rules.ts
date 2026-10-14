/**
 * Vendored read-only from ps2pdx/nertia `src/lib/decision-rules/audience-rules.ts` at 24a80c74, 2026-04-19 on main.
 * Byte-faithful apart from imports, which point at the other vendored files.
 */
export interface AudienceProfile {
  name: string;
  formalityLevel: 'casual' | 'balanced' | 'formal';
  technicalLevel: 'low' | 'medium' | 'high';
  accessibilityPriority: 'standard' | 'high' | 'critical';
  ageGroup: 'young' | 'mixed' | 'mature';
  voiceCharacteristics: {
    tone: string[];
    avoid: string[];
  };
  designPreferences: {
    informationDensity: 'sparse' | 'moderate' | 'dense';
    visualComplexity: 'minimal' | 'moderate' | 'rich';
    interactionStyle: 'guided' | 'balanced' | 'efficient';
  };
}

export const AUDIENCE_PROFILES: Record<string, AudienceProfile> = {
  developers: {
    name: 'Developers',
    formalityLevel: 'casual',
    technicalLevel: 'high',
    accessibilityPriority: 'standard',
    ageGroup: 'mixed',
    voiceCharacteristics: {
      tone: ['direct', 'technical', 'concise', 'no-nonsense'],
      avoid: ['marketing speak', 'buzzwords', 'oversimplification'],
    },
    designPreferences: {
      informationDensity: 'dense',
      visualComplexity: 'minimal',
      interactionStyle: 'efficient',
    },
  },
  enterprises: {
    name: 'Enterprise Decision Makers',
    formalityLevel: 'formal',
    technicalLevel: 'medium',
    accessibilityPriority: 'high',
    ageGroup: 'mature',
    voiceCharacteristics: {
      tone: ['professional', 'authoritative', 'trustworthy', 'solution-focused'],
      avoid: ['casual slang', 'excessive jargon', 'playful language'],
    },
    designPreferences: {
      informationDensity: 'moderate',
      visualComplexity: 'moderate',
      interactionStyle: 'guided',
    },
  },
  consumers: {
    name: 'General Consumers',
    formalityLevel: 'casual',
    technicalLevel: 'low',
    accessibilityPriority: 'high',
    ageGroup: 'mixed',
    voiceCharacteristics: {
      tone: ['friendly', 'approachable', 'clear', 'helpful'],
      avoid: ['technical jargon', 'complex terms', 'formal language'],
    },
    designPreferences: {
      informationDensity: 'sparse',
      visualComplexity: 'moderate',
      interactionStyle: 'guided',
    },
  },
  youngAdults: {
    name: 'Young Adults (18-35)',
    formalityLevel: 'casual',
    technicalLevel: 'medium',
    accessibilityPriority: 'standard',
    ageGroup: 'young',
    voiceCharacteristics: {
      tone: ['energetic', 'relatable', 'authentic', 'playful'],
      avoid: ['outdated references', 'overly formal', 'condescending'],
    },
    designPreferences: {
      informationDensity: 'sparse',
      visualComplexity: 'rich',
      interactionStyle: 'balanced',
    },
  },
  professionals: {
    name: 'Business Professionals',
    formalityLevel: 'balanced',
    technicalLevel: 'medium',
    accessibilityPriority: 'standard',
    ageGroup: 'mixed',
    voiceCharacteristics: {
      tone: ['confident', 'efficient', 'results-oriented', 'clear'],
      avoid: ['excessive casualness', 'time-wasting content', 'vague promises'],
    },
    designPreferences: {
      informationDensity: 'moderate',
      visualComplexity: 'minimal',
      interactionStyle: 'efficient',
    },
  },
  healthcare: {
    name: 'Healthcare Professionals',
    formalityLevel: 'formal',
    technicalLevel: 'high',
    accessibilityPriority: 'critical',
    ageGroup: 'mature',
    voiceCharacteristics: {
      tone: ['precise', 'trustworthy', 'caring', 'evidence-based'],
      avoid: ['casual language', 'exaggeration', 'unsubstantiated claims'],
    },
    designPreferences: {
      informationDensity: 'dense',
      visualComplexity: 'minimal',
      interactionStyle: 'efficient',
    },
  },
  students: {
    name: 'Students',
    formalityLevel: 'casual',
    technicalLevel: 'low',
    accessibilityPriority: 'high',
    ageGroup: 'young',
    voiceCharacteristics: {
      tone: ['encouraging', 'clear', 'supportive', 'engaging'],
      avoid: ['condescending', 'overly complex', 'boring'],
    },
    designPreferences: {
      informationDensity: 'sparse',
      visualComplexity: 'rich',
      interactionStyle: 'guided',
    },
  },
  creatives: {
    name: 'Creative Professionals',
    formalityLevel: 'casual',
    technicalLevel: 'medium',
    accessibilityPriority: 'standard',
    ageGroup: 'mixed',
    voiceCharacteristics: {
      tone: ['inspiring', 'expressive', 'artistic', 'innovative'],
      avoid: ['corporate speak', 'rigid language', 'uninspired content'],
    },
    designPreferences: {
      informationDensity: 'sparse',
      visualComplexity: 'rich',
      interactionStyle: 'balanced',
    },
  },
  seniors: {
    name: 'Seniors (55+)',
    formalityLevel: 'balanced',
    technicalLevel: 'low',
    accessibilityPriority: 'critical',
    ageGroup: 'mature',
    voiceCharacteristics: {
      tone: ['respectful', 'clear', 'patient', 'reassuring'],
      avoid: ['slang', 'tiny text references', 'rushed language'],
    },
    designPreferences: {
      informationDensity: 'sparse',
      visualComplexity: 'minimal',
      interactionStyle: 'guided',
    },
  },
};

export function getAudienceProfile(audience: string): AudienceProfile | null {
  const lowerAudience = audience.toLowerCase();

  // Direct match
  for (const [key, profile] of Object.entries(AUDIENCE_PROFILES)) {
    if (lowerAudience === key.toLowerCase() || lowerAudience === profile.name.toLowerCase()) {
      return profile;
    }
  }

  // Keyword matching
  const keywordMap: Record<string, string> = {
    developer: 'developers',
    engineer: 'developers',
    programmer: 'developers',
    coder: 'developers',
    enterprise: 'enterprises',
    executive: 'enterprises',
    'c-suite': 'enterprises',
    cio: 'enterprises',
    cto: 'enterprises',
    consumer: 'consumers',
    'everyday user': 'consumers',
    'general public': 'consumers',
    millennial: 'youngAdults',
    'gen z': 'youngAdults',
    'young professional': 'youngAdults',
    business: 'professionals',
    professional: 'professionals',
    manager: 'professionals',
    doctor: 'healthcare',
    nurse: 'healthcare',
    medical: 'healthcare',
    patient: 'healthcare',
    student: 'students',
    learner: 'students',
    educator: 'students',
    designer: 'creatives',
    artist: 'creatives',
    creative: 'creatives',
    senior: 'seniors',
    elderly: 'seniors',
    retiree: 'seniors',
  };

  for (const [keyword, profileKey] of Object.entries(keywordMap)) {
    if (lowerAudience.includes(keyword)) {
      return AUDIENCE_PROFILES[profileKey];
    }
  }

  return null;
}

// Map audience to typography recommendations
export function getAudienceTypography(audience: string): {
  baseFontSize: string;
  lineHeight: number;
  preferMonospace: boolean;
  maxLineLength: string;
} {
  const profile = getAudienceProfile(audience);

  if (!profile) {
    return {
      baseFontSize: '1rem',
      lineHeight: 1.5,
      preferMonospace: false,
      maxLineLength: '65ch',
    };
  }

  const accessibilityMap = {
    standard: { baseFontSize: '1rem', lineHeight: 1.5 },
    high: { baseFontSize: '1.0625rem', lineHeight: 1.6 },
    critical: { baseFontSize: '1.125rem', lineHeight: 1.75 },
  };

  return {
    ...accessibilityMap[profile.accessibilityPriority],
    preferMonospace: profile.technicalLevel === 'high',
    maxLineLength: profile.designPreferences.informationDensity === 'dense' ? '75ch' : '65ch',
  };
}

// Map audience to voice guidance
export function getAudienceVoiceGuidance(audience: string): {
  tone: string[];
  avoid: string[];
  readingLevel: 'simple' | 'standard' | 'advanced';
  callToActionStyle: 'enthusiastic' | 'professional' | 'urgent';
} {
  const profile = getAudienceProfile(audience);

  if (!profile) {
    return {
      tone: ['clear', 'helpful'],
      avoid: ['jargon'],
      readingLevel: 'standard',
      callToActionStyle: 'professional',
    };
  }

  const readingLevelMap = {
    low: 'simple' as const,
    medium: 'standard' as const,
    high: 'advanced' as const,
  };

  const ctaStyleMap = {
    casual: 'enthusiastic' as const,
    balanced: 'professional' as const,
    formal: 'professional' as const,
  };

  return {
    tone: profile.voiceCharacteristics.tone,
    avoid: profile.voiceCharacteristics.avoid,
    readingLevel: readingLevelMap[profile.technicalLevel],
    callToActionStyle: ctaStyleMap[profile.formalityLevel],
  };
}
