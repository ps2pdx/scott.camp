/**
 * Vendored read-only from ps2pdx/nertia `src/app/api/generate-tokens/route.ts` at ec9a0a6b (5ad7ca3e^) lines 15 to 468: INDUSTRY_ACCENTS, BACKGROUND_PALETTES, getBorderRadius, generateCTAs and generateDemoBrandSystem, lifted out of the route; the Anthropic call, Firebase and the prompt builder are left behind.
 * Byte-faithful apart from imports, which point at the other vendored files.
 */
import { BrandSystem, DiscoveryInputs } from './brand-system';

// Industry-specific accent colors
const INDUSTRY_ACCENTS: Record<string, Record<string, { accent: { light: string; dark: string }; accentHover: { light: string; dark: string } }>> = {
  'AI/ML Infrastructure': {
    warm: { accent: { light: '#D97757', dark: '#FF8A65' }, accentHover: { light: '#BF5F3F', dark: '#D97757' } },
    cool: { accent: { light: '#00A67E', dark: '#34D399' }, accentHover: { light: '#059669', dark: '#00A67E' } },
    neutral: { accent: { light: '#6366F1', dark: '#818CF8' }, accentHover: { light: '#4F46E5', dark: '#6366F1' } },
  },
  'Developer Tools': {
    warm: { accent: { light: '#F97316', dark: '#FB923C' }, accentHover: { light: '#EA580C', dark: '#F97316' } },
    cool: { accent: { light: '#3B82F6', dark: '#60A5FA' }, accentHover: { light: '#2563EB', dark: '#3B82F6' } },
    neutral: { accent: { light: '#A855F7', dark: '#C084FC' }, accentHover: { light: '#9333EA', dark: '#A855F7' } },
  },
  'B2B SaaS': {
    warm: { accent: { light: '#F59E0B', dark: '#FBBF24' }, accentHover: { light: '#D97706', dark: '#F59E0B' } },
    cool: { accent: { light: '#0EA5E9', dark: '#38BDF8' }, accentHover: { light: '#0284C7', dark: '#0EA5E9' } },
    neutral: { accent: { light: '#6366F1', dark: '#818CF8' }, accentHover: { light: '#4F46E5', dark: '#6366F1' } },
  },
  Fintech: {
    warm: { accent: { light: '#FFB800', dark: '#FCD34D' }, accentHover: { light: '#D9A000', dark: '#FFB800' } },
    cool: { accent: { light: '#0066FF', dark: '#3B82F6' }, accentHover: { light: '#0052CC', dark: '#0066FF' } },
    neutral: { accent: { light: '#10B981', dark: '#34D399' }, accentHover: { light: '#059669', dark: '#10B981' } },
  },
  'Healthcare Tech': {
    warm: { accent: { light: '#F97316', dark: '#FB923C' }, accentHover: { light: '#EA580C', dark: '#F97316' } },
    cool: { accent: { light: '#06B6D4', dark: '#22D3EE' }, accentHover: { light: '#0891B2', dark: '#06B6D4' } },
    neutral: { accent: { light: '#8B5CF6', dark: '#A78BFA' }, accentHover: { light: '#7C3AED', dark: '#8B5CF6' } },
  },
  'E-commerce': {
    warm: { accent: { light: '#EF4444', dark: '#F87171' }, accentHover: { light: '#DC2626', dark: '#EF4444' } },
    cool: { accent: { light: '#10B981', dark: '#34D399' }, accentHover: { light: '#059669', dark: '#10B981' } },
    neutral: { accent: { light: '#EC4899', dark: '#F472B6' }, accentHover: { light: '#DB2777', dark: '#EC4899' } },
  },
  'Consumer Apps': {
    warm: { accent: { light: '#FF6B6B', dark: '#FFA07A' }, accentHover: { light: '#E85D5D', dark: '#FF6B6B' } },
    cool: { accent: { light: '#4ECDC4', dark: '#6EE7DE' }, accentHover: { light: '#3DBDB5', dark: '#4ECDC4' } },
    neutral: { accent: { light: '#A855F7', dark: '#C084FC' }, accentHover: { light: '#9333EA', dark: '#A855F7' } },
  },
  'Climate Tech': {
    warm: { accent: { light: '#84CC16', dark: '#A3E635' }, accentHover: { light: '#65A30D', dark: '#84CC16' } },
    cool: { accent: { light: '#14B8A6', dark: '#2DD4BF' }, accentHover: { light: '#0D9488', dark: '#14B8A6' } },
    neutral: { accent: { light: '#22C55E', dark: '#4ADE80' }, accentHover: { light: '#16A34A', dark: '#22C55E' } },
  },
};

// Background colors based on brightness preference
const BACKGROUND_PALETTES = {
  vibrant: {
    background: { light: '#FFFFFF', dark: '#0A0A0A' },
    cardBackground: { light: '#FFFFFF', dark: '#141414' },
    surface: {
      default: { light: '#FFFFFF', dark: '#0F0F0F' },
      elevated: { light: '#FFFFFF', dark: '#1A1A1A' },
      sunken: { light: '#F5F5F5', dark: '#050505' },
    },
  },
  muted: {
    background: { light: '#FAFAFA', dark: '#121212' },
    cardBackground: { light: '#F5F5F5', dark: '#1E1E1E' },
    surface: {
      default: { light: '#FAFAFA', dark: '#171717' },
      elevated: { light: '#FFFFFF', dark: '#262626' },
      sunken: { light: '#F0F0F0', dark: '#0A0A0A' },
    },
  },
  dark: {
    background: { light: '#F8FAFC', dark: '#030712' },
    cardBackground: { light: '#F1F5F9', dark: '#0F172A' },
    surface: {
      default: { light: '#F8FAFC', dark: '#0A0F1A' },
      elevated: { light: '#FFFFFF', dark: '#1E293B' },
      sunken: { light: '#E2E8F0', dark: '#020617' },
    },
  },
};

// Personality-influenced border radius
interface BorderRadiusScale {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  full: string;
}

function getBorderRadius(personalities: string[]): BorderRadiusScale {
  const hasPlayful = personalities.includes('playful') || personalities.includes('friendly');
  const hasMinimal = personalities.includes('minimal') || personalities.includes('sophisticated');
  const hasBold = personalities.includes('bold');

  if (hasPlayful) {
    return { none: '0', sm: '0.25rem', md: '0.5rem', lg: '0.75rem', xl: '1rem', '2xl': '1.5rem', full: '9999px' };
  } else if (hasMinimal) {
    return { none: '0', sm: '0.125rem', md: '0.25rem', lg: '0.375rem', xl: '0.5rem', '2xl': '0.75rem', full: '9999px' };
  } else if (hasBold) {
    return { none: '0', sm: '0.125rem', md: '0.375rem', lg: '0.625rem', xl: '0.875rem', '2xl': '1.25rem', full: '9999px' };
  }
  return { none: '0', sm: '0.125rem', md: '0.375rem', lg: '0.5rem', xl: '0.75rem', '2xl': '1rem', full: '9999px' };
}

// CTA examples based on personality and industry
function generateCTAs(inputs: DiscoveryInputs): string[] {
  const hasPlayful = inputs.personalityAdjectives.includes('playful');
  const hasBold = inputs.personalityAdjectives.includes('bold');
  const hasFriendly = inputs.personalityAdjectives.includes('friendly');
  const hasPremium = inputs.personalityAdjectives.includes('premium');

  if (hasPlayful) {
    return ["Let's Go", 'Try It Free', 'Jump In', 'Get Started'];
  } else if (hasBold) {
    return ['Start Now', 'Get Access', 'Claim Your Spot', 'Join Today'];
  } else if (hasFriendly) {
    return ['Get Started', 'Learn More', 'Say Hello', 'Explore'];
  } else if (hasPremium) {
    return ['Request Access', 'Schedule Demo', 'Get Started', 'Contact Sales'];
  }
  return ['Get Started', 'Learn More', 'Try Free', 'See Pricing'];
}

export function generateDemoBrandSystem(inputs: DiscoveryInputs): BrandSystem {
  // Get industry-specific palette, falling back to generic
  const industryPalettes = INDUSTRY_ACCENTS[inputs.industry] || INDUSTRY_ACCENTS['B2B SaaS'];
  const palette = industryPalettes[inputs.colorMood];

  // Get brightness-based backgrounds
  const backgrounds = BACKGROUND_PALETTES[inputs.colorBrightness];

  // Get personality-influenced border radius
  const borderRadius = getBorderRadius(inputs.personalityAdjectives);

  // Generate typography based on style
  const fontFamilies: Record<string, { display: string; body: string; sans: string; mono: string }> = {
    modern: { display: 'Inter, system-ui, sans-serif', body: 'Inter, system-ui, sans-serif', sans: 'Inter, system-ui, sans-serif', mono: 'JetBrains Mono, monospace' },
    classic: { display: 'Playfair Display, Georgia, serif', body: 'Source Serif Pro, Georgia, serif', sans: 'Source Sans Pro, sans-serif', mono: 'Source Code Pro, monospace' },
    playful: { display: 'Fredoka, sans-serif', body: 'Nunito, sans-serif', sans: 'Nunito, sans-serif', mono: 'Space Mono, monospace' },
    technical: { display: 'JetBrains Sans, system-ui, sans-serif', body: 'IBM Plex Sans, sans-serif', sans: 'IBM Plex Sans, sans-serif', mono: 'IBM Plex Mono, monospace' },
  };

  const fonts = fontFamilies[inputs.typographyStyle] || fontFamilies.modern;

  // Generate CTAs based on personality
  const ctas = generateCTAs(inputs);

  return {
    metadata: {
      name: inputs.companyName,
      generatedAt: new Date().toISOString(),
      version: '2.0.0',
    },
    colors: {
      background: backgrounds.background,
      foreground: { light: '#171717', dark: '#EDEDED' },
      muted: { light: '#6B7280', dark: '#9CA3AF' },
      accent: palette.accent,
      accentHover: palette.accentHover,
      cardBackground: backgrounds.cardBackground,
      cardBorder: { light: '#E5E7EB', dark: '#2D2D2D' },
      success: { light: '#10B981', dark: '#34D399' },
      warning: { light: '#F59E0B', dark: '#FBBF24' },
      error: { light: '#EF4444', dark: '#F87171' },
      // v2: Extended colors
      surface: backgrounds.surface,
      border: {
        default: { light: '#E5E7EB', dark: '#2D2D2D' },
        subtle: { light: '#F3F4F6', dark: '#1F1F1F' },
        strong: { light: '#D1D5DB', dark: '#404040' },
        focus: { light: palette.accent.light, dark: palette.accent.dark },
      },
      overlay: { light: 'rgba(0, 0, 0, 0.5)', dark: 'rgba(0, 0, 0, 0.7)' },
      usageRatios: { background: 60, surface: 30, accent: 10 },
    },
    typography: {
      fontFamily: fonts,
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
      },
      fontWeight: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
      lineHeight: {
        tight: 1.25,
        normal: 1.5,
        relaxed: 1.75,
      },
      // v2: Letter spacing
      letterSpacing: {
        tight: '-0.025em',
        normal: '0em',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em',
      },
      // v2: Type scale
      scale: {
        h1: { size: '3rem', weight: 700, lineHeight: 1.15, font: 'display' as const },
        h2: { size: '2.25rem', weight: 600, lineHeight: 1.25, font: 'display' as const },
        h3: { size: '1.875rem', weight: 600, lineHeight: 1.3, font: 'display' as const },
        h4: { size: '1.5rem', weight: 500, lineHeight: 1.4, font: 'body' as const },
        body: { size: '1rem', weight: 400, lineHeight: 1.5, font: 'body' as const },
        label: { size: '0.875rem', weight: 500, lineHeight: 1.5, font: 'body' as const },
        small: { size: '0.75rem', weight: 400, lineHeight: 1.5, font: 'body' as const },
        micro: { size: '0.625rem', weight: 500, lineHeight: 1.4, font: 'body' as const, letterSpacing: '0.05em', textTransform: 'uppercase' as const },
      },
    },
    // v2: Grid system
    grid: {
      desktop: { columns: 12, gutter: '24px', maxWidth: '1280px', margin: '32px' },
      mobile: { columns: 4, gutter: '16px', margin: '16px' },
    },
    spacing: {
      '0': '0',
      '1': '0.25rem',
      '2': '0.5rem',
      '3': '0.75rem',
      '4': '1rem',
      '6': '1.5rem',
      '8': '2rem',
      '12': '3rem',
      '16': '4rem',
      '24': '6rem',
      // v2: Named tokens
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem',
      '3xl': '4rem',
      '4xl': '6rem',
      // v2: Semantic spacing
      semantic: {
        section: { paddingX: '2rem', paddingY: '4rem' },
        card: { padding: '1.5rem' },
        component: { gap: '1rem' },
        text: { gap: '0.5rem' },
        inline: { gap: '0.25rem' },
        container: { maxWidth: '80rem', paddingX: '1.5rem' },
      },
    },
    // v2: Icons
    icons: {
      sizes: { small: '16px', default: '24px', large: '32px', hero: '48px' },
      strokeWeight: '1.5px',
      boundingBox: '24px',
      strokeCaps: 'rounded' as const,
      categories: ['interface', 'navigation', 'social', 'actions'],
    },
    // v2: Components
    components: {
      button: {
        primary: {
          background: palette.accent,
          foreground: { light: '#FFFFFF', dark: '#FFFFFF' },
          backgroundHover: palette.accentHover,
          border: palette.accent,
        },
        secondary: {
          background: { light: '#F3F4F6', dark: '#2D2D2D' },
          foreground: { light: '#171717', dark: '#EDEDED' },
          backgroundHover: { light: '#E5E7EB', dark: '#404040' },
          border: { light: '#E5E7EB', dark: '#404040' },
        },
        outline: {
          background: { light: 'transparent', dark: 'transparent' },
          foreground: palette.accent,
          backgroundHover: { light: `${palette.accent.light}10`, dark: `${palette.accent.dark}10` },
          border: palette.accent,
        },
        paddingX: '1.5rem',
        paddingY: '0.75rem',
        fontSize: '0.875rem',
        fontWeight: 500,
        borderRadius: '0.5rem',
        letterSpacing: '0.025em',
      },
      card: {
        variants: {
          feature: { background: { light: '#F9FAFB', dark: '#1A1A1A' }, border: { light: '#E5E7EB', dark: '#2D2D2D' }, padding: '1.5rem' },
          stat: { background: { light: '#FFFFFF', dark: '#121212' }, border: { light: '#E5E7EB', dark: '#2D2D2D' }, padding: '1.5rem' },
          image: { background: { light: '#F3F4F6', dark: '#1A1A1A' }, border: { light: '#E5E7EB', dark: '#2D2D2D' }, padding: '0' },
        },
        borderRadius: '0.75rem',
      },
      input: {
        background: { light: '#FFFFFF', dark: '#121212' },
        border: { light: '#E5E7EB', dark: '#2D2D2D' },
        borderFocus: palette.accent,
        placeholder: { light: '#9CA3AF', dark: '#6B7280' },
        paddingX: '1rem',
        paddingY: '0.75rem',
        fontSize: '1rem',
        borderRadius: '0.5rem',
      },
      alert: {
        variants: {
          info: { background: { light: '#EFF6FF', dark: '#1E3A5F' }, border: { light: '#3B82F6', dark: '#3B82F6' }, icon: 'info' },
          success: { background: { light: '#ECFDF5', dark: '#064E3B' }, border: { light: '#10B981', dark: '#10B981' }, icon: 'check' },
          warning: { background: { light: '#FFFBEB', dark: '#78350F' }, border: { light: '#F59E0B', dark: '#F59E0B' }, icon: 'alert' },
          error: { background: { light: '#FEF2F2', dark: '#7F1D1D' }, border: { light: '#EF4444', dark: '#EF4444' }, icon: 'x' },
        },
        padding: '1.5rem',
        borderLeftWidth: '4px',
      },
      table: {
        headerBackground: { light: '#F9FAFB', dark: '#1A1A1A' },
        rowStripe: { light: '#F9FAFB', dark: '#121212' },
        rowHover: { light: '#F3F4F6', dark: '#1E1E1E' },
        borderColor: { light: '#E5E7EB', dark: '#2D2D2D' },
        cellPaddingX: '1rem',
        cellPaddingY: '0.75rem',
      },
      navigation: {
        background: { light: '#FFFFFF', dark: '#0A0A0A' },
        linkColor: { light: '#6B7280', dark: '#9CA3AF' },
        linkHover: { light: '#171717', dark: '#EDEDED' },
        height: '64px',
      },
    },
    borders: {
      radius: borderRadius,
      width: {
        thin: '1px',
        medium: '2px',
        thick: '4px',
      },
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
    },
    motion: {
      duration: {
        instant: '100ms',
        fast: '200ms',
        base: '300ms',
        slow: '500ms',
      },
      easing: {
        default: 'cubic-bezier(0.4, 0, 0.2, 1)',
        in: 'cubic-bezier(0.4, 0, 1, 1)',
        out: 'cubic-bezier(0, 0, 0.2, 1)',
        inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      // v2: Interactions
      interactions: {
        hover: { scale: 1.02, duration: '200ms' },
        fade: { opacity: [0, 1], duration: '300ms' },
        slide: { transform: 'translateY(8px)', duration: '200ms' },
      },
      principles: ['Performance first', 'Purposeful motion', 'Subtle enhancement'],
    },
    // v2: Imagery guidelines
    imagery: {
      styles: [
        `Professional ${inputs.industry.toLowerCase()} photography`,
        'Clean product shots with consistent lighting',
        'Abstract geometric backgrounds',
      ],
      guidelines: {
        do: [
          'Use high-quality, professional images',
          'Maintain consistent color grading',
          'Feature real products and people',
        ],
        dont: [
          'Use generic stock photos',
          'Over-saturate or heavily filter images',
          'Use cluttered or busy compositions',
        ],
      },
      photoTreatment: {
        colorGrading: inputs.colorMood === 'warm' ? 'warm tones' : inputs.colorMood === 'cool' ? 'cool tones' : 'neutral',
        contrast: inputs.colorBrightness === 'vibrant' ? 'high' : 'medium',
        style: inputs.typographyStyle === 'modern' ? 'clean and minimal' : 'rich and detailed',
      },
    },
    voiceAndTone: {
      personality: inputs.personalityAdjectives,
      writingStyle: `${inputs.personalityAdjectives.join(', ')} communication style tailored for ${inputs.targetAudience} in the ${inputs.industry} space.`,
      examples: {
        headlines: [
          `${inputs.companyName}: Where ${inputs.personalityAdjectives[0] || 'innovation'} meets results`,
          `The ${inputs.personalityAdjectives[1] || 'smart'} way to transform your ${inputs.industry.toLowerCase()}`,
          `Built for ${inputs.targetAudience.split(' ')[0]?.toLowerCase() || 'teams'} who demand more`,
        ],
        cta: ctas,
        descriptions: [
          `${inputs.companyName} empowers ${inputs.targetAudience.toLowerCase()} with ${inputs.personalityAdjectives[0] || 'innovative'} solutions.`,
          `Experience the ${inputs.personalityAdjectives[1] || 'modern'} approach to ${inputs.industry.toLowerCase()}.`,
          `Join thousands who trust ${inputs.companyName} for their ${inputs.industry.toLowerCase()} needs.`,
        ],
      },
      // v2: Voice attributes
      attributes: {
        tone: {
          name: inputs.personalityAdjectives[0] || 'Professional',
          description: `Our communication is ${inputs.personalityAdjectives[0]?.toLowerCase() || 'professional'} and resonates with ${inputs.targetAudience.toLowerCase()}.`,
          example: `"${inputs.companyName} delivers ${inputs.personalityAdjectives[0]?.toLowerCase() || 'exceptional'} results."`,
        },
        clarity: {
          name: 'Clear',
          description: 'We communicate complex ideas simply and directly.',
          example: 'We make the complex simple.',
        },
      },
      guidelines: {
        do: [
          'Use active voice',
          'Lead with benefits, not features',
          'Be specific with numbers and metrics',
        ],
        dont: [
          'Use jargon without explanation',
          'Make unsubstantiated claims',
          'Use passive constructions',
        ],
      },
      coreMessage: `${inputs.companyName} is the ${inputs.personalityAdjectives[0]?.toLowerCase() || 'leading'} solution for ${inputs.targetAudience.toLowerCase()} in ${inputs.industry.toLowerCase()}.`,
    },
    // v2: Utility tokens
    zIndex: {
      base: 0,
      raised: 10,
      dropdown: 20,
      sticky: 30,
      fixed: 40,
      modal: 50,
      popover: 60,
      tooltip: 70,
    },
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
  };
}
