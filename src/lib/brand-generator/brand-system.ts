/**
 * Vendored read-only from ps2pdx/nertia `src/types/brand-system.ts` at 7a576f35, 2026-01-20 on main.
 * Byte-faithful apart from imports, which point at the other vendored files.
 */
// Brand System Token Schema v3.0
// Comprehensive brand styleguide structure inspired by Vantage Compute
// 12 sections: Colors, Typography, Grid, Icons, Components, Motion, Imagery, Voice, Utilities, Animation, Data Viz, Logo

// ============================================================================
// Helper Types
// ============================================================================

export interface ColorValue {
  light: string;
  dark: string;
}

export interface TypeScaleEntry {
  size: string;
  weight: number;
  lineHeight: number;
  font: 'display' | 'body' | 'mono';
  letterSpacing?: string;
  textTransform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none';
}

// ============================================================================
// Data Visualization Types (v2.1)
// ============================================================================

export interface StatCardSpec {
  background: ColorValue;
  border: ColorValue;
  labelColor: ColorValue;
  valueColor: ColorValue;
  padding: string;
  borderRadius: string;
}

export interface ProgressSpec {
  track: ColorValue;
  fill: ColorValue;
  height: string;
  borderRadius: string;
}

export interface TimelineSpec {
  lineColor: ColorValue;
  dotColor: ColorValue;
  dotSize: string;
  lineWidth: string;
}

export interface CodeBlockSpec {
  background: ColorValue;
  border: ColorValue;
  textColor: ColorValue;
  padding: string;
  borderRadius: string;
  fontFamily: string;
}

export interface DataVisualization {
  statCard: {
    default: StatCardSpec;
    hero?: StatCardSpec;
  };
  progress: ProgressSpec;
  timeline: TimelineSpec;
  codeBlock: CodeBlockSpec;
}

// ============================================================================
// Logo Types (v2.1)
// ============================================================================

export interface LogoVariant {
  description: string;
  usage: string;
  background: 'light' | 'dark' | 'any';
}

export interface LogoSection {
  variants: {
    primary: LogoVariant;
    light: LogoVariant;
    dark: LogoVariant;
    wordmark?: LogoVariant;
    icon?: LogoVariant;
  };
  clearSpace: {
    unit: string;
    minimum: string;
  };
  sizing: {
    minimum: string;
    recommended: {
      header: string;
      footer: string;
      favicon: string;
      social: string;
    };
  };
  guidelines: {
    do: string[];
    dont: string[];
  };
}

// ============================================================================
// Extended Component Types (v2.1)
// ============================================================================

export interface TagComponent {
  variants: {
    default: { background: ColorValue; foreground: ColorValue; border: ColorValue };
    accent: { background: ColorValue; foreground: ColorValue; border: ColorValue };
    success: { background: ColorValue; foreground: ColorValue; border: ColorValue };
    warning: { background: ColorValue; foreground: ColorValue; border: ColorValue };
    error: { background: ColorValue; foreground: ColorValue; border: ColorValue };
  };
  sizes: {
    sm: { paddingX: string; paddingY: string; fontSize: string };
    md: { paddingX: string; paddingY: string; fontSize: string };
    lg: { paddingX: string; paddingY: string; fontSize: string };
  };
  borderRadius: string;
  fontWeight: number;
}

export interface TabVariant {
  background: ColorValue;
  foreground: ColorValue;
  border: ColorValue;
  activeBackground: ColorValue;
  activeForeground: ColorValue;
  activeBorder: ColorValue;
}

export interface NavigationTabsComponent {
  variants: {
    bordered: TabVariant;
    underline: TabVariant;
    pill: TabVariant;
  };
  gap: string;
  padding: string;
}

export interface FormElements {
  textarea: {
    background: ColorValue;
    border: ColorValue;
    borderFocus: ColorValue;
    minHeight: string;
    padding: string;
    borderRadius: string;
  };
  checkbox: {
    size: string;
    borderRadius: string;
    borderColor: ColorValue;
    checkedBackground: ColorValue;
    checkedBorder: ColorValue;
    checkmarkColor: ColorValue;
  };
  radio: {
    size: string;
    borderColor: ColorValue;
    checkedBackground: ColorValue;
    checkedBorder: ColorValue;
    dotColor: ColorValue;
  };
  toggle: {
    width: string;
    height: string;
    borderRadius: string;
    offBackground: ColorValue;
    onBackground: ColorValue;
    thumbColor: ColorValue;
  };
}

export interface TableVariants {
  basic: { headerBackground: ColorValue; rowBackground: ColorValue; borderColor: ColorValue };
  striped: { headerBackground: ColorValue; rowEven: ColorValue; rowOdd: ColorValue; borderColor: ColorValue };
  hover: { headerBackground: ColorValue; rowBackground: ColorValue; rowHover: ColorValue; borderColor: ColorValue };
  comparison: { headerBackground: ColorValue; highlightColumn: ColorValue; rowBackground: ColorValue; borderColor: ColorValue };
  bordered: { headerBackground: ColorValue; rowBackground: ColorValue; borderColor: ColorValue; borderWidth: string };
}

// ============================================================================
// Loading States Types (v2.1)
// ============================================================================

export interface LoadingStates {
  spinner: {
    size: { sm: string; md: string; lg: string };
    borderWidth: string;
    color: ColorValue;
    trackColor: ColorValue;
    duration: string;
  };
  skeleton: {
    background: ColorValue;
    shimmer: ColorValue;
    borderRadius: string;
    duration: string;
  };
  pulse: {
    color: ColorValue;
    duration: string;
    scale: [number, number];
  };
  dots: {
    size: string;
    gap: string;
    color: ColorValue;
    duration: string;
  };
}

// ============================================================================
// Animation System Types (v3.0)
// ============================================================================

export interface KeyframeDefinition {
  name: string;
  keyframes: {
    [percentage: string]: {
      [property: string]: string;
    };
  };
}

export interface AnimationPreset {
  name: string;
  duration: string;
  easing: string;
  keyframe: string;
  description: string;
  usage: string[];
}

export interface AnimationSystem {
  // CSS @keyframes definitions
  keyframes: {
    fadeIn: KeyframeDefinition;
    fadeOut: KeyframeDefinition;
    slideInUp: KeyframeDefinition;
    slideInDown: KeyframeDefinition;
    slideInLeft: KeyframeDefinition;
    slideInRight: KeyframeDefinition;
    scaleIn: KeyframeDefinition;
    scaleOut: KeyframeDefinition;
    spin: KeyframeDefinition;
    pulse: KeyframeDefinition;
    bounce: KeyframeDefinition;
    shake: KeyframeDefinition;
    shimmer: KeyframeDefinition;
  };
  // Ready-to-use animation presets
  presets: {
    // Entrance animations
    enter: AnimationPreset;
    enterSubtle: AnimationPreset;
    enterFromLeft: AnimationPreset;
    enterFromRight: AnimationPreset;
    enterFromTop: AnimationPreset;
    enterFromBottom: AnimationPreset;
    // Exit animations
    exit: AnimationPreset;
    exitSubtle: AnimationPreset;
    // Attention/emphasis
    attention: AnimationPreset;
    // Loading states
    loading: AnimationPreset;
    skeleton: AnimationPreset;
  };
  // Reduced motion alternatives
  reducedMotion: {
    respectsUserPreference: boolean;
    fallbackDuration: string;
    disabledAnimations: string[];
    alternativeEffects: {
      [key: string]: string; // e.g., "fadeIn": "opacity transition only"
    };
  };
  // Page transition patterns
  pageTransitions?: {
    enter: AnimationPreset;
    exit: AnimationPreset;
    duration: string;
  };
  // Stagger patterns for lists
  stagger?: {
    baseDelay: string;
    increment: string;
    maxItems: number;
  };
}

// ============================================================================
// Typography Extended Types (v3.0)
// ============================================================================

export interface TypeStyleSpec {
  fontFamily: string;
  fontSize: string;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: string;
  textTransform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none';
  // Usage context
  usage: string[];
  example: string;
}

export interface FontPairing {
  display: {
    family: string;
    weights: number[];
    googleFontsUrl?: string;
    fallback: string;
  };
  body: {
    family: string;
    weights: number[];
    googleFontsUrl?: string;
    fallback: string;
  };
  mono: {
    family: string;
    weights: number[];
    googleFontsUrl?: string;
    fallback: string;
  };
  reasoning: string; // Why these fonts work together
}

export interface TypographyExtended {
  // Font pairing with full details
  pairing: FontPairing;
  // Complete type styles with usage context
  styles: {
    displayLarge: TypeStyleSpec;  // Hero headlines
    displayMedium: TypeStyleSpec; // Page titles
    displaySmall: TypeStyleSpec;  // Section headers
    headlineLarge: TypeStyleSpec; // H1
    headlineMedium: TypeStyleSpec;// H2
    headlineSmall: TypeStyleSpec; // H3
    titleLarge: TypeStyleSpec;    // Card titles, feature headlines
    titleMedium: TypeStyleSpec;   // Subsection titles
    titleSmall: TypeStyleSpec;    // Component headers
    bodyLarge: TypeStyleSpec;     // Lead paragraphs
    bodyMedium: TypeStyleSpec;    // Default body text
    bodySmall: TypeStyleSpec;     // Secondary text
    labelLarge: TypeStyleSpec;    // Button text, input labels
    labelMedium: TypeStyleSpec;   // Tags, badges
    labelSmall: TypeStyleSpec;    // Captions, timestamps
    code: TypeStyleSpec;          // Code blocks, technical content
  };
  // Responsive scaling
  responsiveScale?: {
    mobile: number;   // e.g., 0.875 (87.5% of base)
    tablet: number;   // e.g., 0.9375
    desktop: number;  // e.g., 1.0
  };
}

// ============================================================================
// Data Visualization Extended Types (v3.0)
// ============================================================================

export interface ChartColorPalette {
  // Sequential palette for single-hue data (low to high)
  sequential: string[];
  // Categorical palette for distinct categories
  categorical: string[];
  // Diverging palette for data with a midpoint
  diverging: {
    negative: string[];
    neutral: string;
    positive: string[];
  };
  // Semantic colors for status
  semantic: {
    positive: string;
    negative: string;
    neutral: string;
    warning: string;
  };
}

export interface ChartLibraryConfig {
  name: 'recharts' | 'chartjs' | 'd3' | 'visx';
  colorConfig: Record<string, string>;
  fontConfig: {
    family: string;
    size: number;
    color: string;
  };
  gridConfig: {
    stroke: string;
    strokeDasharray?: string;
  };
}

export interface DataVizAccessibility {
  colorBlindSafe: boolean;
  patterns: {
    // Pattern fills as SVG for color-blind accessibility
    primary: string;
    secondary: string;
    tertiary: string;
  };
  minimumContrastRatio: number;
  recommendations: string[];
}

export interface DataVisualizationExtended extends DataVisualization {
  // Chart-specific color palettes
  chartColors: ChartColorPalette;
  // Library-specific configurations
  libraryConfigs?: {
    recharts?: ChartLibraryConfig;
    chartjs?: ChartLibraryConfig;
  };
  // Accessibility features
  accessibility: DataVizAccessibility;
  // Grid and axis styling
  gridStyle: {
    stroke: ColorValue;
    strokeWidth: string;
    strokeDasharray?: string;
  };
  axisStyle: {
    stroke: ColorValue;
    tickColor: ColorValue;
    labelColor: ColorValue;
    fontSize: string;
  };
  // Tooltip styling
  tooltip: {
    background: ColorValue;
    border: ColorValue;
    textColor: ColorValue;
    borderRadius: string;
    shadow: string;
  };
}

// ============================================================================
// Decision Logic Types (v3.0)
// ============================================================================

export interface IndustryProfile {
  name: string;
  colorMoodDefault: 'warm' | 'cool' | 'neutral';
  brightnessDefault: 'vibrant' | 'muted' | 'dark';
  typographyDefault: 'modern' | 'classic' | 'playful' | 'technical';
  densityDefault: 'spacious' | 'balanced' | 'compact';
  motionIntensity: 'subtle' | 'moderate' | 'energetic';
  iconStyle: 'outline' | 'solid' | 'duotone';
  suggestedPersonality: string[];
}

export interface PersonalityMapping {
  trait: string;
  designImpact: {
    borderRadius: 'sharp' | 'subtle' | 'rounded' | 'pill';
    spacing: 'tight' | 'balanced' | 'generous';
    contrast: 'low' | 'medium' | 'high';
    motion: 'minimal' | 'subtle' | 'expressive';
    typography: 'geometric' | 'humanist' | 'transitional';
  };
}

// ============================================================================
// Main Brand System Interface
// ============================================================================

export interface BrandSystem {
  // ---- Metadata ----
  metadata: {
    name: string;
    generatedAt: string;
    version: string; // "3.0.0"
  };

  // ---- 1. Colors ----
  colors: {
    // Core colors (existing, required)
    background: ColorValue;
    foreground: ColorValue;
    muted: ColorValue;
    accent: ColorValue;
    accentHover: ColorValue;
    cardBackground: ColorValue;
    cardBorder: ColorValue;
    success: ColorValue;
    warning: ColorValue;
    error: ColorValue;

    // Interface colors (v2, optional)
    surface?: {
      default: ColorValue;
      elevated: ColorValue;
      sunken: ColorValue;
    };
    border?: {
      default: ColorValue;
      subtle: ColorValue;
      strong: ColorValue;
      focus: ColorValue;
    };
    overlay?: ColorValue; // rgba for modal backdrops

    // Color usage ratios (v2, optional)
    usageRatios?: {
      background: number; // % of interface (e.g., 60)
      surface: number;    // % (e.g., 30)
      accent: number;     // % (e.g., 10)
    };
  };

  // ---- 2. Typography ----
  typography: {
    fontFamily: {
      sans: string;
      mono: string;
      display?: string; // For H1-H3 headings (v2)
      body?: string;    // For body text, labels (v2)
    };
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
      '5xl'?: string; // v2
      '6xl'?: string; // v2
    };
    fontWeight: {
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
    lineHeight: {
      tight: number;
      normal: number;
      relaxed: number;
    };
    letterSpacing?: {
      tight: string;
      normal: string;
      wide: string;
      wider: string;
      widest: string;
    };
    // Type scale with full specs (v2, optional)
    scale?: {
      h1: TypeScaleEntry;
      h2: TypeScaleEntry;
      h3: TypeScaleEntry;
      h4: TypeScaleEntry;
      body: TypeScaleEntry;
      label: TypeScaleEntry;
      small: TypeScaleEntry;
      micro: TypeScaleEntry;
    };
  };

  // ---- 3. Grid System (v2, optional) ----
  grid?: {
    desktop: {
      columns: number;
      gutter: string;
      maxWidth: string;
      margin: string;
    };
    mobile: {
      columns: number;
      gutter: string;
      margin: string;
    };
  };

  // ---- 4. Spacing ----
  spacing: {
    '0': string;
    '1': string;
    '2': string;
    '3': string;
    '4': string;
    '6': string;
    '8': string;
    '12': string;
    '16': string;
    '24': string;
    xs?: string;  // v2 named tokens
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    '2xl'?: string;
    '3xl'?: string;
    '4xl'?: string;
    // Semantic spacing (v2, optional)
    semantic?: {
      section: { paddingX: string; paddingY: string };
      card: { padding: string };
      component: { gap: string };
      text: { gap: string };
      inline: { gap: string };
      container: { maxWidth: string; paddingX: string };
    };
  };

  // ---- 5. Icons (v2, optional) ----
  icons?: {
    sizes: {
      small: string;
      default: string;
      large: string;
      hero: string;
    };
    strokeWeight: string;
    boundingBox: string;
    strokeCaps: 'rounded' | 'square' | 'butt';
    categories?: string[]; // Suggested icon categories based on brand
  };

  // ---- 6. UI Components (v2, optional) ----
  components?: {
    button: {
      primary: {
        background: ColorValue;
        foreground: ColorValue;
        backgroundHover: ColorValue;
        border: ColorValue;
      };
      secondary: {
        background: ColorValue;
        foreground: ColorValue;
        backgroundHover: ColorValue;
        border: ColorValue;
      };
      outline?: {
        background: ColorValue;
        foreground: ColorValue;
        backgroundHover: ColorValue;
        border: ColorValue;
      };
      disabled?: {
        background: ColorValue;
        foreground: ColorValue;
        border: ColorValue;
      };
      paddingX: string;
      paddingY: string;
      fontSize: string;
      fontWeight: number;
      borderRadius: string;
      letterSpacing?: string;
    };
    card?: {
      variants: {
        feature: { background: ColorValue; border: ColorValue; padding: string };
        stat: { background: ColorValue; border: ColorValue; padding: string };
        image: { background: ColorValue; border: ColorValue; padding: string };
      };
      borderRadius: string;
    };
    input?: {
      background: ColorValue;
      border: ColorValue;
      borderFocus: ColorValue;
      placeholder: ColorValue;
      paddingX: string;
      paddingY: string;
      fontSize: string;
      borderRadius: string;
    };
    alert?: {
      variants: {
        info: { background: ColorValue; border: ColorValue; icon: string };
        success: { background: ColorValue; border: ColorValue; icon: string };
        warning: { background: ColorValue; border: ColorValue; icon: string };
        error: { background: ColorValue; border: ColorValue; icon: string };
      };
      padding: string;
      borderLeftWidth: string;
    };
    table?: {
      headerBackground: ColorValue;
      rowStripe: ColorValue;
      rowHover: ColorValue;
      borderColor: ColorValue;
      cellPaddingX: string;
      cellPaddingY: string;
    };
    navigation?: {
      background: ColorValue;
      linkColor: ColorValue;
      linkHover: ColorValue;
      height: string;
    };
    // v2.1 additions
    tag?: TagComponent;
    tabs?: NavigationTabsComponent;
    form?: FormElements;
    tableVariants?: TableVariants;
  };

  // ---- 6b. Data Visualization (v2.1, optional) ----
  dataVisualization?: DataVisualization;

  // ---- 6c. Logo (v2.1, optional) ----
  logo?: LogoSection;

  // ---- 6d. Animation System (v3.0, optional) ----
  animation?: AnimationSystem;

  // ---- 6e. Typography Extended (v3.0, optional) ----
  typographyExtended?: TypographyExtended;

  // ---- 6f. Data Visualization Extended (v3.0, optional) ----
  dataVisualizationExtended?: DataVisualizationExtended;

  // ---- 7. Borders ----
  borders: {
    radius: {
      none: string;
      sm: string;
      md: string;
      lg: string;
      xl?: string;   // v2
      '2xl'?: string; // v2
      full: string;
    };
    width: {
      thin: string;
      medium: string;
      thick: string;
    };
  };

  // ---- 8. Shadows ----
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };

  // ---- 9. Motion & Interaction ----
  motion: {
    duration: {
      instant?: string; // v2 - hover states, toggles
      fast: string;
      normal?: string;  // v2 renamed from 'normal' to 'base' in some places
      base?: string;    // v2
      slow: string;
    };
    easing: {
      default: string;
      in: string;
      out: string;
      inOut: string;
    };
    // v2 additions
    interactions?: {
      hover?: { scale: number; duration: string };
      fade?: { opacity: [number, number]; duration: string };
      slide?: { transform: string; duration: string };
    };
    principles?: string[]; // e.g., ["Performance first", "Purposeful motion"]
    // v2.1 additions
    loading?: LoadingStates;
  };

  // ---- 10. Imagery Guidelines (v2, optional) ----
  imagery?: {
    styles: string[]; // e.g., ["data centers", "hardware close-ups", "abstract tech"]
    guidelines: {
      do: string[];   // e.g., ["Use symmetrical compositions", "Feature technical details"]
      dont: string[]; // e.g., ["Use stock photos of people", "Over-saturate colors"]
    };
    photoTreatment: {
      colorGrading: string; // e.g., "violet tint"
      contrast: string;     // e.g., "high"
      style: string;        // e.g., "dramatic lighting"
    };
  };

  // ---- 11. Voice & Tone ----
  voiceAndTone: {
    personality: string[];
    writingStyle: string;
    examples: {
      headlines: string[];
      cta: string[];
      descriptions: string[];
    };
    // v2 additions
    attributes?: {
      [key: string]: {
        name: string;
        description: string;
        example: string;
      };
    };
    guidelines?: {
      do: string[];
      dont: string[];
    };
    coreMessage?: string;
  };

  // ---- 12. Utility Tokens (v2, optional) ----
  zIndex?: {
    base: number;
    raised: number;
    dropdown: number;
    sticky: number;
    fixed: number;
    modal: number;
    popover: number;
    tooltip: number;
  };

  breakpoints?: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
}

// ============================================================================
// Discovery Inputs (unchanged)
// ============================================================================

export interface DiscoveryInputs {
  companyName: string;
  industry: string;
  targetAudience: string;
  personalityAdjectives: string[]; // 3-5 words like "bold", "trustworthy", "innovative"
  colorMood: 'warm' | 'cool' | 'neutral';
  colorBrightness: 'vibrant' | 'muted' | 'dark';
  typographyStyle: 'modern' | 'classic' | 'playful' | 'technical';
  densityPreference: 'spacious' | 'balanced' | 'compact';
  existingBrandColor?: string; // Optional hex if they have one
}

// ============================================================================
// Generation Result (unchanged)
// ============================================================================

export interface GenerationResult extends BrandSystem {
  _generationId?: string;
}
