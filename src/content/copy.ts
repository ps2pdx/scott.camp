export type TranscriptRow = { when: string; who: string; text: string };
export type IndexRow = { no: string; name: string; description: string; year: string; struck: boolean };
export type Sheet = { title: string; fields: Record<string, string>; body?: string; href?: string; label?: string; placeholder?: boolean };
export type TechSheetData = { sheet: string; view: string; stack: string; src: string; date: string; sections: string[] };

export const VANTAGE_CASE_STUDY_URL = 'https://vantagecompute.nertia.ai';
export const SOURCE_URL = 'https://github.com/ps2pdx/scott.camp';

export const SECTIONS = [
  { id: 'hero', label: 'Hero' }, { id: 'vantage', label: 'Vantage' }, { id: 'nertia', label: 'Nertia' },
  { id: 'terpscout', label: 'TerpScout' }, { id: 'work', label: 'Work' }, { id: 'practice', label: 'Practice' }, { id: 'contact', label: 'Contact' },
] as const;

export const COPY = {
  hero: {
    eyebrow: 'I design systems agents ship.',
    runningHead: 'Portland, Oregon',
    headline: "Something Click'd",
    lead: 'I built the product marketing function at an early-stage AI/HPC orchestration company: positioning, competitive intelligence, and the sales enablement behind enterprise briefings. Then I built a product of my own, because a marketer who can ship argues from evidence instead of opinion.',
    actions: { email: { label: 'Email me', href: 'mailto:ps2pdx@gmail.com' }, resume: { label: 'Resume', bracket: 'PDF', href: '/Scott_Campbell_Resume.pdf' } },
    facts: [
      { when: 'Vantage', who: '', text: 'Early-stage AI/HPC platform' },
      { when: 'Vantage', who: '', text: '50+ competitors mapped' },
      { when: 'Work', who: '', text: '5 live client sites' },
      { when: 'TerpScout', who: '', text: '$10M sold, 2020 to 2022, regulated CPG' },
    ] as TranscriptRow[],
  },
  vantage: {
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
    eyebrow: 'Nertia', runningHead: 'Nertia', title: "A product designed from the buyer's side",
    lead: 'An agent-native site builder, shipped as a web application and as an MCP server. I designed it, built it, and took it to market.',
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
      { sheet: 'NERTIA EDITOR', view: 'DESKTOP, 1280', stack: 'NEXT.JS, SHADCN', src: 'RENDERED FROM APP STRUCTURE', date: '2026', sections: ['TOP BAR', 'SITE PREVIEW, LIVE', 'INSERT DOCK', 'ELEMENT PANEL', 'CHAT ISLAND'] },
      { sheet: 'NERTIA MCP SERVER', view: 'TOOLS', stack: 'MCP, CLAUDE CONNECTOR', src: 'RENDERED FROM TOOL LIST', date: '2026', sections: ['CREATE_SITE', 'SET_SECTION_LAYOUT', 'UPDATE_COPY', 'UPDATE_SEO', 'PUBLISH_SITE', 'PUBLISH_FROM_GITHUB'] },
      { sheet: 'NERTIA HOSTED RUNTIME', view: 'SITE', stack: '@NERSH/RENDER, WORKER', src: 'RENDERED FROM RUNTIME', date: '2026', sections: ['SITE SURFACE', 'TOKENS, OKLCH', 'SECTIONS', '*.NERTIA.AI ROUTING', 'STATIC EXPORT'] },
      { sheet: 'NERTIA DESIGN SYSTEMS', view: 'SKIN CONTRACT', stack: 'OKLCH TOKENS', src: 'RENDERED FROM CONTRACT', date: '2026', sections: ['ONE ACCENT', 'SURFACE + TEXT + LINE', 'RADIUS, SHADOW, MOTION', 'TYPE SCALE, FLUID', '26 PRESETS'] },
    ] as TechSheetData[],
    codeSiteLine: 'This page is a code site published by an agent.',
    source: { label: 'Source on GitHub', href: SOURCE_URL },
  },
  terpscout: {
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
      shown: [
        { src: '/evidence/terpscout-wordmark.webp', width: 600, height: 90, caption: 'Terpscout wordmark', alt: 'Terpscout, set in red with a trademark sign.' },
      ],
      gated: {
        summary: 'Cannabis product work, 21 and over',
        spin: { src: '/evidence/terpscout-spin.mp4', poster: '/evidence/terpscout-spin-poster.webp', width: 720, height: 1280, caption: 'Product turntable, TerpScout studio, 2022', alt: 'A purple and green cola turns slowly on a turntable against a black ground, every trichome lit.' },
        stills: [
          { src: '/evidence/martian-fruit-print.webp', width: 1000, height: 1404, caption: 'Strain print, Martian Fruit, for a TerpScout client, 2022', alt: 'Strain print: a Martian Fruit cola on black framed by torn white paper, MARTIAN FRUIT set in black over yellow, and a yellow credit block reading Modified Bananas x Pineapple Pez, breeder Ronin Seeds, cultivator Boring Glory, photography Terpscouting.' },
          { src: '/evidence/martian-fruit-detail.webp', width: 320, height: 320, caption: 'Detail, Martian Fruit print', alt: 'Detail of the Martian Fruit print at full size: frosted trichomes, orange pistils and purple sugar leaves.' },
          { src: '/evidence/terp-scouts-per-image-pricing.webp', width: 1600, height: 900, caption: 'Per image pricing, Terp-Scouts cannabis photography, summer 2022', alt: 'Pricing page headed PER IMAGE PRICING: five photographs on black, priced Full bud $100 (3 minimum), Portrait $200, Macro $300, Concentrate $75 (3 minimum), Flower $75 (3 minimum).' },
        ],
      },
    },
  },
  work: {
    eyebrow: 'Work', runningHead: 'Work', title: 'Five live sites, five different positioning problems',
    index: [
      { no: '01', name: 'Ali Sharifi Rugs', description: 'Site built by hand, photography, later moved to WordPress', year: '2010s', struck: true },
      { no: '02', name: 'KAL Contracting', description: 'Masonry and general contractor, Portland; site now on Webflow', year: '2025', struck: true },
      { no: '03', name: 'Rogue River Botanicals', description: 'Brand, website, kraft and wax seal packaging', year: '2016', struck: true },
      { no: '04', name: 'TerpScout, dba ScoutCamp', description: 'OLCC-regulated distribution consultancy, then a cannabis photography studio, $10M', year: '2020 to 2022', struck: true },
      { no: '05', name: 'Vantage Compute', description: 'Founding product marketing, AI/HPC orchestration', year: '2024 to 2026', struck: true },
      { no: '06', name: 'Nertia', description: 'Agent-native site builder, web app and MCP server', year: '2025', struck: true },
      { no: '07', name: 'Plotswitch', description: 'Productized agency brand, the pricing experiment', year: '2026', struck: true },
      { no: '08', name: 'Pharm to Body', description: 'Family mushroom farm, Shopify, 12-week CSA program', year: '2026', struck: false },
      { no: '09', name: 'Pure Zero Photography', description: 'Documentary photography, two tiers, published entry pricing', year: '2026', struck: false },
      { no: '10', name: 'Bend Cleaning', description: 'Cascade Cleaning renamed, booking and review capture', year: '2026', struck: false },
      { no: '11', name: 'Full Scope Supply', description: 'Commercial general contractor, lead generation', year: '2026', struck: false },
      { no: '12', name: 'Typeshit', description: 'Developer streetwear, print on demand through Printful', year: '2026', struck: false },
      { no: '13', name: 'Zen Holo', description: 'Blender animation plus AI music', year: '2026', struck: true },
      { no: '14', name: 'Purple Scott', description: 'DJ identity', year: '2012', struck: true },
    ] as IndexRow[],
    sheets: [
      { title: 'Pharm to Body', fields: { Sheet: 'pharmtobody.com', Role: 'Design, build', Stack: 'Shopify' }, body: 'A family mushroom farm with no ecommerce history and a subscription product to sell. Shopify build carrying a 12-week CSA program, fresh and dried catalog, grow kits, and a workshop calendar.', href: 'https://pharmtobody.com', label: 'pharmtobody.com' },
      { title: 'Pure Zero', fields: { Sheet: 'purezerophotography.com', Role: 'Design, build', Stack: 'Nertia' }, body: 'High-ticket creative services, where the usual failure is hiding the price. Packaged into two tiers with published entry pricing, a documentary-only niche stated up front, and client stories doing the work of case studies.', href: 'https://purezerophotography.com', label: 'purezerophotography.com' },
      { title: 'Bend Cleaning', fields: { Sheet: 'bend.cleaning', Role: 'Design, build', Stack: 'Nertia' }, body: 'Renaming an established business without losing the referral base it was built on. Cascade Cleaning became Bend Cleaning, with the rename announced on the site rather than quietly absorbed, plus booking and review capture.', href: 'https://bend.cleaning', label: 'bend.cleaning' },
      { title: 'Full Scope Supply', fields: { Sheet: 'fullscopesupply.com', Role: 'Design, build', Stack: 'Nertia' }, body: 'A commercial general contractor whose pipeline ran entirely on word of mouth. Lead generation built around self-performed trades and single-point accountability, the actual differentiator, not the license number.', href: 'https://fullscopesupply.com', label: 'fullscopesupply.com' },
      { title: 'Typeshit', fields: { Sheet: 'typeshit.shop', Role: 'Design, build', Stack: 'Nertia, Printful' }, body: 'A developer streetwear brand selling print on demand through Printful. Heavyweight cotton for people whose builds pass locally. The site carries the voice and hands the cart to the fulfilment house without the seam showing.', href: 'https://typeshit.shop', label: 'typeshit.shop' },
    ] as Sheet[],
    tech: [
      { sheet: 'PHARMTOBODY.COM', view: 'PHONE, 390', stack: 'SHOPIFY', src: 'RENDERED FROM SITE STRUCTURE', date: '2026', sections: ['NAV, ONE ACTION', 'HERO, CSA SIGNUP', '12-WEEK CSA PROGRAM', 'FRESH / DRIED CATALOG', 'GROW KITS', 'WORKSHOP CALENDAR'] },
      { sheet: 'PUREZEROPHOTOGRAPHY.COM', view: 'PHONE, 390', stack: 'NERTIA', src: 'RENDERED FROM SITE STRUCTURE', date: '2026', sections: ['NAV', 'HERO, DOCUMENTARY ONLY', 'TWO TIERS, ENTRY PRICING', 'CLIENT STORIES', 'CONTACT'] },
      { sheet: 'BEND.CLEANING', view: 'PHONE, 390', stack: 'NERTIA', src: 'RENDERED FROM SITE STRUCTURE', date: '2026', sections: ['NAV', 'HERO, THE RENAME NOTICE', 'SERVICES', 'BOOKING', 'REVIEW CAPTURE', 'CONTACT'] },
      { sheet: 'FULLSCOPESUPPLY.COM', view: 'PHONE, 390', stack: 'NERTIA', src: 'RENDERED FROM SITE STRUCTURE', date: '2026', sections: ['NAV', 'HERO', 'SELF-PERFORMED TRADES', 'SINGLE-POINT ACCOUNTABILITY', 'PROJECTS', 'LEAD FORM'] },
    ] as TechSheetData[],
  },
  practice: {
    eyebrow: 'Creative practice', runningHead: 'Practice', title: 'Beyond the day job',
    sheets: [
      { title: 'Zen Holo', fields: { Sheet: 'Zen Holo', Role: 'Animation, music', Stack: 'Blender' }, placeholder: true },
      { title: 'Purple Scott', fields: { Sheet: 'Purple Scott', Role: 'DJ', Stack: 'Ableton' }, placeholder: true, href: 'https://purplescott.com', label: 'purplescott.com' },
    ] as Sheet[],
    rows: [
      { when: '2017', who: 'Scott', text: 'Marquee Mondays, District, 2017: seventeen weekly nights of curated live DJs, residents Purple Scott, Dirty Deeds and Token, ending 5 June 2017. Virgil Abloh played Euphoria, Portland, the room that is 45 East now. He dapped me up in the crowd. We exchanged pleasantries, as far as club sound at 1 AM allows.' },
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
