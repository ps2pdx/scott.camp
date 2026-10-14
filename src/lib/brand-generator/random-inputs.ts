/**
 * Vendored read-only from ps2pdx/nertia `src/utils/random-inputs.ts` at 24a80c74, 2026-04-19 on main.
 * Byte-faithful apart from imports, which point at the other vendored files.
 */
import { DiscoveryInputs } from './brand-system';

const COMPANY_PREFIXES = [
  'Nova', 'Apex', 'Flux', 'Pulse', 'Atlas', 'Vertex', 'Helix', 'Prism',
  'Nexus', 'Orbit', 'Cipher', 'Quantum', 'Forge', 'Spark', 'Signal', 'Vector',
  'Aura', 'Echo', 'Zenith', 'Nimbus', 'Stratos', 'Terra', 'Vega', 'Lunar',
];

const COMPANY_SUFFIXES = [
  'Labs', 'AI', 'Tech', 'Systems', 'Cloud', 'HQ', 'io', 'Hub',
  'Base', 'Studio', 'Works', 'Logic', 'Flow', 'Sync', 'Stack', 'Data',
  '', // Allow standalone names
];

const AUDIENCE_TEMPLATES = [
  'Enterprise developers and DevOps teams building scalable infrastructure',
  'Small business owners and entrepreneurs looking to grow their online presence',
  'Healthcare professionals and administrators managing patient care systems',
  'Financial analysts and traders seeking data-driven insights',
  'Marketing teams and content creators optimizing campaign performance',
  'Product managers and startup founders launching new products',
  'Data scientists and ML engineers building intelligent applications',
  'Remote teams and distributed organizations improving collaboration',
  'E-commerce merchants scaling their online stores',
  'Security professionals protecting critical infrastructure',
  'Educators and students in technology-focused learning environments',
  'Creative professionals and designers streamlining their workflow',
];

const INDUSTRIES = [
  'AI/ML Infrastructure',
  'Developer Tools',
  'B2B SaaS',
  'Fintech',
  'Healthcare Tech',
  'E-commerce',
  'Consumer Apps',
  'Climate Tech',
] as const;

const PERSONALITIES = [
  'innovative',
  'trustworthy',
  'bold',
  'friendly',
  'premium',
  'technical',
  'playful',
  'minimal',
  'sophisticated',
  'approachable',
] as const;

const COLOR_MOODS = ['warm', 'cool', 'neutral'] as const;
const COLOR_BRIGHTNESS = ['vibrant', 'muted', 'dark'] as const;
const TYPOGRAPHY_STYLES = ['modern', 'classic', 'playful', 'technical'] as const;
const DENSITY_PREFERENCES = ['spacious', 'balanced', 'compact'] as const;

function randomFrom<T>(array: readonly T[] | T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function randomHexColor(): string {
  // Generate pleasant brand colors (avoiding too dark or too light)
  const hue = Math.floor(Math.random() * 360);
  const saturation = 50 + Math.floor(Math.random() * 40); // 50-90%
  const lightness = 40 + Math.floor(Math.random() * 25); // 40-65%

  // Convert HSL to Hex
  const h = hue / 360;
  const s = saturation / 100;
  const l = lightness / 100;

  const hueToRgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  const r = Math.round(hueToRgb(p, q, h + 1/3) * 255);
  const g = Math.round(hueToRgb(p, q, h) * 255);
  const b = Math.round(hueToRgb(p, q, h - 1/3) * 255);

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();
}

function generateCompanyName(): string {
  const prefix = randomFrom(COMPANY_PREFIXES);
  const suffix = randomFrom(COMPANY_SUFFIXES);

  // Sometimes add a space between prefix and suffix for variety
  if (suffix && Math.random() > 0.7) {
    return `${prefix} ${suffix}`;
  }

  return `${prefix}${suffix}`;
}

export function generateRandomInputs(): DiscoveryInputs {
  // Pick 3-5 random personalities
  const shuffledPersonalities = shuffleArray([...PERSONALITIES]);
  const personalityCount = Math.floor(Math.random() * 3) + 3; // 3-5

  return {
    companyName: generateCompanyName(),
    industry: randomFrom(INDUSTRIES),
    targetAudience: randomFrom(AUDIENCE_TEMPLATES),
    personalityAdjectives: shuffledPersonalities.slice(0, personalityCount),
    colorMood: randomFrom(COLOR_MOODS),
    colorBrightness: randomFrom(COLOR_BRIGHTNESS),
    typographyStyle: randomFrom(TYPOGRAPHY_STYLES),
    densityPreference: randomFrom(DENSITY_PREFERENCES),
    // Include existing brand color ~30% of the time
    existingBrandColor: Math.random() > 0.7 ? randomHexColor() : undefined,
  };
}

// Export constants for potential reuse
export {
  INDUSTRIES,
  PERSONALITIES,
  COLOR_MOODS,
  COLOR_BRIGHTNESS,
  TYPOGRAPHY_STYLES,
  DENSITY_PREFERENCES,
};
