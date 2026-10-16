export type TranscriptRow = { when: string; who: string; text: string };
export type IndexRow = { no: string; name: string; description: string; year: string; struck: boolean };
export type Sheet = { title: string; fields: Record<string, string>; body?: string; href?: string; label?: string; placeholder?: boolean };
export type TechFigure = 'editor' | 'mcp' | 'runtime' | 'tokens' | 'phone';
export type TechSheetData = { sheet: string; figure: TechFigure; view: string; stack: string; src: string; date: string; sections: string[] };

export const VANTAGE_CASE_STUDY_URL = 'https://vantagecompute.nertia.ai';
export const SOURCE_URL = 'https://github.com/ps2pdx/scott.camp';

export const SECTIONS = [
  { id: 'hero', label: 'Cover' }, { id: 'design-system', label: 'Design system' }, { id: 'vantage', label: 'Vantage' }, { id: 'nertia', label: 'Nertia' },
  { id: 'work', label: 'Work' }, { id: 'terpscout', label: 'TerpScout' }, { id: 'practice', label: 'Practice' }, { id: 'contact', label: 'Contact' },
] as const;

export const COPY = {
  hero: {
    eyebrow: 'I design systems agents ship.',
    titleLine: 'Scott Campbell, c/o Nertia.ai, Portland, Oregon',
    links: [
      { label: 'Zero-Point story', href: '#nertia' },
      { label: 'Contact', href: '#contact' },
      { label: 'Resume', href: '/Scott_Campbell_Resume.pdf', newTab: true },
    ],
    headline: "Something Click'd",
    lead: 'Around last year, when I was building my portfolio, it pivoted into a design system generator, which is now Nertia: an agentic wormhole out of the corporate web.',
    facts: [
      { when: 'Nertia', who: '', text: 'Shipped as a web app and an MCP server' },
      { when: 'Vantage', who: '', text: '2 trademarked phrases authored, brand system shipped for enablement, pitch and report' },
      { when: 'TerpScout', who: '', text: '$10M sold, 2020 to 2022, regulated CPG' },
      { when: 'Work', who: '', text: '5 live client sites, 4 on the Nertia platform' },
    ] as TranscriptRow[],
  },
  endpapers: {
    name: 'Scott Campbell, c/o Nertia.ai',
    portrait: { src: '/evidence/portrait.webp', srcSet: '/evidence/portrait-240.webp 240w, /evidence/portrait.webp 480w', width: 480, height: 720, alt: 'Scott Campbell', caption: 'SNY00127, 2024' },
    virgil: { when: '2015 to 2016', who: 'Virgil', text: 'I met Virgil once. He dapped me up at 45 East, Euphoria at the time, after playing a cool set.' } as TranscriptRow,
  },
  vantage: {
    mark: { src: '/evidence/vantage-mark.svg', width: 175, height: 40, name: 'Vantage Compute', wide: true },
    tools: ["Product positioning", "Competitive intelligence", "Sales enablement", "Technical messaging", "Naming and trademark", "Investor communications", "SEO/GEO", "Figma", "HubSpot", "Zoho", "GA4", "Slurm", "Kubernetes", "NVIDIA GPU architecture", "Docker"] as string[],
    eyebrow: 'Vantage Compute', runningHead: 'Vantage [2024 to 2026]', title: 'Founding product marketing',
    lead: 'Early-stage orchestration platform: one chip-agnostic control plane over Slurm and Kubernetes for AI/ML training, inference, simulation, and life sciences workloads, running across public cloud, private cloud, and on-prem. I was the first marketing hire and built the function from nothing, July 2024 to August 2026.',
    rows: [
      { when: '2024', who: 'Positioning', text: 'Translated Slurm orchestration, NVIDIA GPU architecture (H100, A100, L40S), and hybrid cloud into value propositions that survived contact with ML engineers and CTOs. Adopted across enterprise sales, product documentation, and seed-round investor materials.' },
      { when: '2024', who: 'Competitive', text: 'Mapped positioning, pricing, and go-to-market across 50+ infrastructure competitors: CoreWeave, Lambda Labs, Together AI, Nebius. The map became the differentiation strategy and the objection-handling script sales actually used.' },
      { when: '2025', who: 'Verticals', text: 'Four target markets, four distinct stories: AI/ML training, R&D simulation, advanced manufacturing, life sciences. Each mapped platform capability to a buyer problem rather than restating the spec sheet.' },
      { when: '2025', who: 'Enablement', text: 'Battle cards, technical one-pagers, demo narratives, and Figma asset libraries used in enterprise briefings including Traton Group (Volkswagen/Scania). Trademarked the brand position: VirtuallyLimitless, Future Compute Layer. A technical content program built for AI search drove 35% of qualified pipeline inside six months.' },
    ] as TranscriptRow[],
    caseStudy: { label: 'Case study', href: VANTAGE_CASE_STUDY_URL },
  },
  nertia: {
    tools: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Firebase", "Claude API", "MCP server development", "LLM tool schema design", "Agent-native product design", "CSS token systems", "Brand system design", "Git/GitHub", "Core Web Vitals"] as string[],
    eyebrow: 'Nertia', runningHead: 'Nertia', title: "A product designed from the buyer's side",
    lead: 'An agent-native site builder, shipped as a web application and as an MCP server. I designed it, built it, and took it to market.',
    mark: { src: '/evidence/nertia-mark.svg', width: 240, height: 199, name: 'Nertia' },
    rows: [
      { when: '12/2025', who: 'Origin', text: 'It started as a design system generator: a brand schema, tokens, typography, animation, decision logic. The site builder came later. Ten months on, the design system is the part every site inherits.' },
      { when: '04/16/26', who: 'Evidence', text: 'Launched as an AI brand generator. Research said the durable need was shipping and maintaining live sites, not generating identity assets. Changed the product rather than the messaging.' },
      { when: '04/2026', who: 'Identity', text: 'Named the tiers from physics: Zero-Point, Particle, Wave. The voice moved from quantum to motion. Built the brand and the design system the product ships with, so every site it makes inherits the contract.' },
      { when: '08/2026', who: 'Default', text: "Everything is included by default instead of unbundled into add-ons. Hosting and domains pass through at cost. Export stays open, no contract, domains live in the client's own account. The bet: we monetize the product, not the exit. If someone leaves, the product wasn't good enough. That is the correct signal, and lock-in only hides it." },
      { when: '08/2026', who: 'Plotswitch', text: 'A productized agency brand running on the platform, built to test the positioning against real buyers with published tiers and a stated competitive frame against Squarespace, Wix, Webflow, and WordPress. Pricing you can read is pricing you can be argued with about, which is the point.' },
      { when: '08/2026', who: 'Distribution', text: 'The MCP server exposes site creation, layout, copy, SEO, and publishing as tools an agent invokes directly. The product is fully operable by Claude without a UI. That is a channel choice, not a technical flourish: meet the buyer inside the surface they already work in.' },
    ] as TranscriptRow[],
    sheets: [
      { title: 'Editor', fields: { Sheet: 'Editor', Role: 'Design, build', Stack: 'Next.js' }, body: 'Tap to edit on a phone, side panel on a desktop. The preview is the site.' },
      { title: 'MCP server', fields: { Sheet: 'MCP server', Role: 'Design, build', Stack: 'MCP' }, body: 'Every builder action is a tool. An agent runs the product without the UI.' },
      { title: 'Hosted runtime', fields: { Sheet: 'Hosted runtime', Role: 'Design, build', Stack: 'Render, Worker' }, body: 'One site.json renders the same in the app, in the export and on the open-source package.' },
      { title: 'Design systems', fields: { Sheet: 'Design systems', Role: 'Design, build', Stack: 'oklch' }, body: 'About twenty variables and a single accent. Any skin on any layout is a coherent site, by contract, not by review.' },
    ] as Sheet[],
    tech: [
      { sheet: 'NERTIA EDITOR', figure: 'editor', view: 'DESKTOP, 1280', stack: 'NEXT.JS, SHADCN', src: 'DRAWN FROM APP STRUCTURE', date: '2026', sections: ['TOP BAR', 'SITE PREVIEW, LIVE', 'INSERT DOCK', 'ELEMENT PANEL', 'CHAT ISLAND'] },
      { sheet: 'NERTIA MCP SERVER', figure: 'mcp', view: 'TOOLS', stack: 'MCP, CLAUDE CONNECTOR', src: 'DRAWN FROM TOOL LIST', date: '2026', sections: ['CREATE_SITE', 'SET_SECTION_LAYOUT', 'UPDATE_COPY', 'UPDATE_SEO', 'PUBLISH_SITE', 'PUBLISH_FROM_GITHUB'] },
      { sheet: 'NERTIA HOSTED RUNTIME', figure: 'runtime', view: 'SITE', stack: '@NERSH/RENDER, WORKER', src: 'DRAWN FROM RUNTIME', date: '2026', sections: ['SITE SURFACE', 'TOKENS, OKLCH', 'SECTIONS', '*.NERTIA.AI ROUTING', 'STATIC EXPORT'] },
      { sheet: 'NERTIA DESIGN SYSTEMS', figure: 'tokens', view: 'SKIN CONTRACT', stack: 'OKLCH TOKENS', src: 'DRAWN FROM CONTRACT', date: '2026', sections: ['ONE ACCENT', 'SURFACE + TEXT + LINE', 'RADIUS, SHADOW, MOTION', 'TYPE SCALE, FLUID', '26 PRESETS'] },
    ] as TechSheetData[],
    codeSiteLine: 'This page is a code site published by an agent.',
    source: { label: 'Source on GitHub', href: SOURCE_URL },
    evolution: {
      title: 'Zero-Point evolution',
      steps: [
        'January 2026: Brand System v3.0, nine answers in, a brand system out. Where Nertia started. Source nertia 7a576f35.',
        'May 2026: Zero-Point design system v1, an exporter and logger, not a generator. Archived 23 May 2026 when the site builder took over. Source nertia f1a3cf56.',
        'May 2026 to today: the builder. Every site inherits one skin contract.',
      ],
      frameCaption: 'Zero-Point design system v1, 4 May 2026, running read-only: the sidebar, the token drawer and the CSS and JSON export work. Archivo is not loaded on this page, so the display face falls back to the system stack.',
    },
    contract: {
      lead: 'Every nertia site inherits one skin contract: about twenty CSS variables and a single brand colour, --accent. An agent switches the skin through the MCP tool switch_site_skin, with no UI.',
      tiers: [
        ['Surface', '--background, --muted, --card, --card-bg, --card-border, --card-foreground', 'Page and section surface, subtle fill, the card surface system'],
        ['Text', '--foreground, --muted-fg', 'Body and heading text, secondary text'],
        ['Line', '--border, --border-width-hairline, --border-width-default, --border-width-strong', 'Hairlines and dividers, and their stroke weight'],
        ['Accent', '--accent, --accent-fg', 'The single brand colour and its text'],
        ['Radius', '--radius, --radius-sm, --radius-lg, --radius-pill', 'Base corner for cards, buttons and inputs; chips, large surfaces, pills'],
        ['Shadow', '--shadow-sm, --shadow-md, --shadow-lg, --btn-shadow', 'The elevation ramp and button elevation'],
        ['Motion', '--motion-duration-fast, --motion-duration-normal, --motion-ease', 'Hover, expand and collapse, easing'],
        ['Type', '--font-sans, --font-heading, --font-body', 'Base, display and running text families; sizes are a shared fluid scale'],
      ] as string[][],
      tools: [
        ['switch_site_skin', 'Switch the active skin preset; stored tokens clear so the new skin renders live'],
        ['set_node_style', 'Set CSS on a node; presets store design system variables, so the node follows a skin change'],
        ['set_card_hover', 'Set how every card answers a hover: lift, flat or none'],
        ['set_section_frame', 'Run a section edge to edge, or make it fill the screen'],
        ['update_copy', 'Patch the site copy slots'],
        ['publish_site', 'Publish the draft to staging or production'],
        ['publish_from_github', "Start a code site's own GitHub Action to build and upload the export"],
        ['rollback_release', 'Put an earlier release live'],
      ] as string[][],
      link: { label: 'Contract on GitHub', href: 'https://github.com/ps2pdx/nertia/blob/main/docs/design-system-contract.md' },
    },
  },
  terpscout: {
    mark: { src: '/evidence/terpscout-mark.webp', width: 240, height: 240, name: 'TerpScout' },
    tools: ["P&L", "Sales and distribution", "Territory strategy", "Compliance", "Cannabis photography", "Adobe Premiere Pro", "Print design"] as string[],
    eyebrow: 'TerpScout', runningHead: 'TerpScout [2016 to 2022]', title: 'Proof of positioning',
    lead: 'A brand I built became a network I sold through, at half the going rate. TerpScout, dba of ScoutCamp, was an OLCC-regulated recreational cannabis distribution consultancy: it facilitated product-to-cash transfers and rented space from established wholesale licenses. The site is gone. The sales logs are not.',
    rows: [
      { when: '2016', who: 'Brand', text: 'Rogue River Botanicals: full brand and website, kraft paper and wax seal packaging. Then sales for them, on the strength of the brand.' },
      { when: '2017 to 2020', who: 'Network', text: 'Sales at Sweet Life Distribution and LTRMN Distribution. Four years compiling a network of producers and shops, then out on my own.' },
      { when: '2019', who: 'Price', text: 'Distributors took 10%. I cut the middleman out and charged 5%. Ten percent is a lot when the work is gas and the drive.' },
      { when: '2020 to 2022', who: 'Volume', text: '$10M across three wholesale locations and about 30 vendors.' },
      { when: '2020 to 2022', who: 'Delivery', text: 'I drove every delivery to the shop and every payment to the producer.' },
    ] as TranscriptRow[],
    evidence: {
      gated: {
        summary: 'Cannabis product work, 21 and over',
        spin: { src: '/evidence/terpscout-spin.mp4', poster: '/evidence/terpscout-spin-poster.webp', width: 720, height: 1280, caption: 'Product turntable, TerpScout studio, 2022', alt: 'A purple and green cola turns slowly on a turntable against a black ground, every trichome lit.' },
        reel: { src: '/evidence/rosin-press-reel.mp4', poster: '/evidence/rosin-press-reel-poster.webp', width: 720, height: 1280, caption: 'Rosin press reel, slow motion, 2024', alt: 'Slow motion close-up: gloved fingers fold a white mesh press bag with an orange edge, and golden rosin spreads glossy and stringy across it.' },
        stills: [
          { src: '/evidence/martian-fruit-print.webp', width: 1000, height: 1404, caption: 'Strain print, Martian Fruit, for a TerpScout client, 2022', alt: 'Strain print: a Martian Fruit cola on black framed by torn white paper, MARTIAN FRUIT set in black over yellow, and a yellow credit block reading Modified Bananas x Pineapple Pez, breeder Ronin Seeds, cultivator Boring Glory, photography Terpscouting.' },
          { src: '/evidence/terp-scouts-per-image-pricing.webp', width: 1600, height: 900, caption: 'Per image pricing, Terp-Scouts cannabis photography, summer 2022', alt: 'Pricing page headed PER IMAGE PRICING: five photographs on black, priced Full bud $100 (3 minimum), Portrait $200, Macro $300, Concentrate $75 (3 minimum), Flower $75 (3 minimum).' },
        ],
      },
    },
  },
  designSystem: {
    runningHead: 'Design system [2026]', title: 'A book about icons, so the site is a book',
    lead: 'The system comes from one physical object: my copy of ICONS, the book Zak Group made for Virgil Abloh and Nike (Taschen, 2021). It is one layer removed: I took the object, its cloth, paper, board and spine, not its page layouts. A book about icons, so the site is a book too.',
    surfaces: [
      { key: 'cloth', name: 'Volt cloth, the cover', value: '#2bf52b' },
      { key: 'endpaper', name: 'Endpaper, the yellow pages', value: '#f2dc46, #f5e04a light' },
      { key: 'eggshell', name: 'Eggshell, the sheet', value: '#f3f1ea' },
      { key: 'white', name: 'White, punch holes and tiles', value: '#ffffff' },
      { key: 'dark', name: 'Dark mode, ink and board', value: '#000000, #1c1b19' },
    ],
    texturesLine: 'Every texture is cut from a photograph I shot of the book on my desk, with an iPhone.',
    textures: [
      { file: 'cloth', name: 'Cloth weave', cut: 'one 3024 px square, lit to the cover, 597 by 646 px, drawn at 189 by 204' },
      { file: 'spine', name: 'Spine', cut: 'turned 0.56 degrees upright, recut at 320 px wide, 320 by 1459, 64 px seam' },
      { file: 'paper', name: 'Paper, the page and endpaper grain', cut: 'a blank page, high-pass, mirrored, 512 and 1024 px' },
      { file: 'board', name: 'Board', cut: 'the uncovered board, high-pass, mirrored, 512 and 1024 px' },
      { file: 'chip', name: 'Chip, the button corner', cut: 'bottom-right corner, straightened 3 degrees, 228 px', retired: 'replaced by the cloth weave on buttons, kept on /specimen' },
    ],
    type: [
      { role: 'Display', sample: 'Icons', meta: 'Helvetica Neue Bold, uppercase, fluid, the cover headline only', cls: 'display t-display' },
      { role: 'Title', sample: 'One layer removed', meta: 'Helvetica Neue Bold, uppercase, 28 px, 20 px on phones', cls: 'display t-title' },
      { role: 'Text', sample: 'Lead paragraphs and card bodies. One idea per sentence.', meta: 'Courier New Bold, 18 px, 16 px on tablets, 14 px on phones', cls: 'text' },
      { role: 'Meta', sample: 'Eyebrows, nav, captions, tables, buttons', meta: 'Courier New, uppercase, 13 px, 11 px on phones', cls: 'meta' },
      { role: 'Watermark', sample: 'Claude Design · Pillow', meta: 'Courier New Bold, 72 to 160 px at 10 percent, behind each section', cls: 'watermark t-title' },
    ],
    typeLine: 'Distinct font declarations reduced from 34 to 19.',
    signature: [
      { when: 'Punch nav', who: '', text: 'Eight punched cells, 01 to 08, numbers only. Each name lives in the aria-label: a store without price tags.' },
      { when: 'Spine rail', who: '', text: 'A fixed spine layer sits under the page. Every section starts on a 2 px transparent cut, so the spine shows through between them.' },
    ] as TranscriptRow[],
    figures: [
      { src: '/evidence/specimen-designed.webp', width: 720, height: 1000, caption: 'Designed: the Claude Design canvas export, light half', alt: 'The canvas specimen in light mode: five surface swatches, four texture tiles, the type ramp from Display 700 down to Transcript, and the punch nav cells.' },
      { src: '/evidence/specimen-built.webp', width: 720, height: 1000, caption: 'Built: the live /specimen page, light mode', alt: 'The live specimen page in light mode on eggshell: surface swatches for dark and light, the volt cloth cover reading Something Click\'d, and the start of the type group.' },
    ],
    closing: { line: 'Designed on a canvas, exported, implemented by agents from that export, documented live on this page.', label: 'Documentation', href: '/specimen' },
    tiers: [
      ['Primitive', '--s-ink, --s-page, --s-white, --s-board, --s-endpaper, --s-cloth', 'The surfaces as raw values'],
      ['Semantic', '--bg, --fg, --fg-muted, --line, --line-strong, --accent, --accent-fg, --focus, --halo', 'Roles that change between dark and light'],
      ['Component', '--sheet, --tech, --tech-ink, --hole, --grain, --strike', 'Spec sheet, tech sheet, punch holes, grain strength, the struck line'],
      ['Scale', '--s-1 to --s-8, --gutter, --max, --rail, --nav-h', 'Spacing and layout'],
      ['Type', '--t-display, --t-title, --t-text, --t-meta', 'Four sizes for three roles'],
      ['Motion', '--motion-fast, --motion-theme, --motion-chip', 'Hover, theme change, the chip; zero under reduced motion'],
    ] as string[][],
    watermark: ['Claude Design', 'iPhone photography', 'Pillow', 'CSS custom properties', 'React', 'Vite', 'Playwright'],
  },
  work: {
    tools: ["Shopify", "Webflow", "Nertia", "Printful", "SEO/GEO", "Naming and rebrand", "Pricing and packaging"] as string[],
    eyebrow: 'Work', runningHead: 'Work', title: 'Five live sites, five different positioning problems',
    index: [
      { no: '01', name: 'Ali Sharifi Rugs', description: 'Site built by hand, photography, later moved to WordPress', year: '2010s', struck: false },
      { no: '02', name: 'Rogue River Botanicals', description: 'Brand, website, kraft and wax seal packaging', year: '2016', struck: false },
      { no: '03', name: 'TerpScout, dba ScoutCamp', description: 'OLCC-regulated distribution consultancy, then a cannabis photography studio, $10M', year: '2020 to 2022', struck: false },
      { no: '04', name: 'Vantage Compute', description: 'Founding product marketing, AI/HPC orchestration', year: '2024 to 2026', struck: false },
      { no: '05', name: 'Nertia', description: 'Agent-native site builder, web app and MCP server', year: '2025', struck: false },
      { no: '06', name: 'Plotswitch', description: 'Productized agency brand, the pricing experiment', year: '2026', struck: false },
      { no: '07', name: 'Pharm to Body', description: 'Family mushroom farm, Shopify, 12-week CSA program', year: '2026', struck: false },
      { no: '08', name: 'Pure Zero Photography', description: 'Documentary photography, two tiers, published entry pricing', year: '2026', struck: false },
      { no: '09', name: 'Bend Cleaning', description: 'Cascade Cleaning renamed, booking and review capture', year: '2026', struck: false },
      { no: '10', name: 'Full Scope Supply', description: 'Commercial general contractor, lead generation', year: '2026', struck: false },
      { no: '11', name: 'Typeshit', description: 'Developer streetwear, print on demand through Printful', year: '2026', struck: false },
      { no: '12', name: 'Zen Holo', description: 'Blender animation plus AI music', year: '2026', struck: false },
      { no: '13', name: 'Purple Scott', description: 'DJ identity', year: '2012', struck: false },
    ] as IndexRow[],
    sheets: [
      { title: 'Pharm to Body', fields: { Sheet: 'pharmtobody.com', Role: 'Design, build', Stack: 'Shopify' }, body: 'A family mushroom farm with no ecommerce history and a subscription product to sell. Shopify build carrying a 12-week CSA program, fresh and dried catalog, grow kits, and a workshop calendar.', href: 'https://pharmtobody.com', label: 'pharmtobody.com' },
      { title: 'Pure Zero', fields: { Sheet: 'purezerophotography.com', Role: 'Design, build', Stack: 'Nertia' }, body: 'High-ticket creative services, where the usual failure is hiding the price. Packaged into two tiers with published entry pricing, a documentary-only niche stated up front, and client stories doing the work of case studies.', href: 'https://purezerophotography.com', label: 'purezerophotography.com' },
      { title: 'Bend Cleaning', fields: { Sheet: 'bend.cleaning', Role: 'Design, build', Stack: 'Nertia' }, body: 'Renaming an established business without losing the referral base it was built on. Cascade Cleaning became Bend Cleaning, with the rename announced on the site rather than quietly absorbed, plus booking and review capture.', href: 'https://bend.cleaning', label: 'bend.cleaning' },
      { title: 'Full Scope Supply', fields: { Sheet: 'fullscopesupply.com', Role: 'Design, build', Stack: 'Nertia' }, body: 'A commercial general contractor whose pipeline ran entirely on word of mouth. Lead generation built around self-performed trades and single-point accountability, the actual differentiator, not the license number.', href: 'https://fullscopesupply.com', label: 'fullscopesupply.com' },
      { title: 'Typeshit', fields: { Sheet: 'typeshit.shop', Role: 'Design, build', Stack: 'Nertia, Printful' }, body: 'A developer streetwear brand selling print on demand through Printful. Heavyweight cotton for people whose builds pass locally. The site carries the voice and hands the cart to the fulfilment house without the seam showing.', href: 'https://typeshit.shop', label: 'typeshit.shop' },
    ] as Sheet[],
    tech: [
      { sheet: 'PHARMTOBODY.COM', figure: 'phone', view: 'PHONE, 390', stack: 'SHOPIFY', src: 'DRAWN FROM SITE STRUCTURE', date: '2026', sections: ['NAV, ONE ACTION', 'HERO, CSA SIGNUP', '12-WEEK CSA PROGRAM', 'FRESH / DRIED CATALOG', 'GROW KITS', 'WORKSHOP CALENDAR'] },
      { sheet: 'PUREZEROPHOTOGRAPHY.COM', figure: 'phone', view: 'PHONE, 390', stack: 'NERTIA', src: 'DRAWN FROM SITE STRUCTURE', date: '2026', sections: ['NAV', 'HERO, DOCUMENTARY ONLY', 'TWO TIERS, ENTRY PRICING', 'CLIENT STORIES', 'CONTACT'] },
      { sheet: 'BEND.CLEANING', figure: 'phone', view: 'PHONE, 390', stack: 'NERTIA', src: 'DRAWN FROM SITE STRUCTURE', date: '2026', sections: ['NAV', 'HERO, THE RENAME NOTICE', 'SERVICES', 'BOOKING', 'REVIEW CAPTURE', 'CONTACT'] },
      { sheet: 'FULLSCOPESUPPLY.COM', figure: 'phone', view: 'PHONE, 390', stack: 'NERTIA', src: 'DRAWN FROM SITE STRUCTURE', date: '2026', sections: ['NAV', 'HERO', 'SELF-PERFORMED TRADES', 'SINGLE-POINT ACCOUNTABILITY', 'PROJECTS', 'LEAD FORM'] },
      { sheet: 'TYPESHIT.SHOP', figure: 'phone', view: 'PHONE, 390', stack: 'NERTIA, PRINTFUL', src: 'DRAWN FROM SITE STRUCTURE', date: '2026', sections: ['HEADER, BRAND', 'NAV, ABOUT, HELP, CART', 'SHOP, PRODUCT GRID', 'ADD TO CART', 'FOOTER, LINK GROUP', 'COPYRIGHT'] },
    ] as TechSheetData[],
  },
  practice: {
    tools: ["Blender", "Ableton", "Animation", "DJing"] as string[],
    eyebrow: 'Creative practice', runningHead: 'Practice', title: 'Beyond the day job',
    sheets: [
      { title: 'Zen Holo', fields: { Sheet: 'Zen Holo', Role: 'Animation, music', Stack: 'Blender' }, placeholder: true },
      { title: 'Purple Scott', fields: { Sheet: 'Purple Scott', Role: 'DJ', Stack: 'Ableton' }, placeholder: true, href: 'https://purplescott.com', label: 'purplescott.com' },
    ] as Sheet[],
    rows: [
      { when: '2017', who: 'Scott', text: 'Marquee Mondays, District, 2017: seventeen weekly nights of curated live DJs, residents Purple Scott, Dirty Deeds and Token, ending 5 June 2017.' },
    ] as TranscriptRow[],
    evidence: [
      { src: '/evidence/marquee-mondays-017.webp', width: 1600, height: 1066, caption: 'Event banner, Marquee Mondays 017, District, 5 June 2017', alt: 'Black event banner: [Marquee Mondays] 017, 06 05 17, Bad Technique, Everettz, Residents (Purple Scott, Dirty Deeds, Token), District est. 2014, 220 SW Ankeny St, 9 PM, no cover, beside a crushed can in glitch colours.' },
      { src: '/evidence/marquee-mondays-series.webp', width: 1535, height: 460, caption: 'Series banner, Marquee Mondays, District, 2017', alt: 'Series banner photographed in the room: the Marquee Mondays, Purple Scott and District marks over a brick wall with a painted portrait, purple chandeliers and people at the balcony rail.' },
    ],
  },
  contact: {
    eyebrow: 'Contact', runningHead: 'Contact', title: "Let's talk",
    lead: "I'm looking for a senior role where design systems, product marketing and agents meet: AI infrastructure, developer platforms, or something equally hard to explain. Portland-based, remote-friendly, happy to travel.",
    rows: [
      { when: 'Email', who: '', text: 'ps2pdx@gmail.com' },
      { when: 'Phone', who: '', text: '(503) 806-4457' },
    ] as TranscriptRow[],
    links: { email: 'mailto:ps2pdx@gmail.com', phone: 'tel:+15038064457' },
    resume: { label: 'Download resume', bracket: 'PDF', href: '/Scott_Campbell_Resume.pdf' },
    booking: [
      { slug: 'observation', calLink: 'scott-campbell/observation', caption: 'Intro, 20 minutes, free' },
      { slug: 'consulting', calLink: 'scott-campbell/consulting', caption: 'Consulting, $300 retainer' },
    ],
  },
  footer: {
    links: [
      { label: 'LinkedIn', href: 'https://linkedin.com/in/scottsuper' },
      { label: 'Nertia', href: 'https://nertia.ai' },
      { label: 'Plotswitch', href: 'https://plotswitch.com' },
      { label: 'Source on GitHub', href: SOURCE_URL },
    ],
    tagline: 'Built on Nertia. Of course it is.',
  },
  volumes: { hero: { no: '0', name: "Something Click'd", year: '2026' } },
} as const;
