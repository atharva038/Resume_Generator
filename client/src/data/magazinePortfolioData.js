/**
 * SmartNShine Graphic Designer Magazine Portfolio - Funky Editorial Data
 * Art Direction: 032c × Ray Gun × It's Nice That × Swiss Punk Editorial
 * Monograph Issue 01 // 2026 Edition
 */

export const magazineData = {
  issue: {
    number: "ISSUE // 01",
    subNumber: "VOL. 26 / 2026",
    code: "SN—MAG-026",
    title: "GRAPHIC MONOGRAPH",
    tagline: "A curated survey of contemporary graphic design, kinetic typography & visual culture.",
    specs: "FORMAT: 12-COL ASYMMETRIC • 300DPI VECTOR • EDITION: DAY / NIGHT STUDIO",
    publisher: "SMARTNSHINE PUBLISHING GROUP",
  },
  profile: {
    name: "Alex Vance",
    displayName: "ALEX VANCE",
    pronouns: "He / Him",
    role: "GRAPHIC DESIGNER × ART DIRECTOR × CREATIVE TECHNOLOGIST",
    professionalTitle: "Art Director & Typographic Designer",
    tagline: "Crafting noisy typography, radical brand identities & tactile digital publications.",
    location: "Berlin • Stockholm • New York",
    email: "alex@vance.studio",
    phone: "+49 (0) 30 9876 5432",
    availabilityStatus: "OPEN FOR COMMISSIONED ART DIRECTION & BRAND REBOOTS",
    editorialQuote:
      "Design without tension is just interior decoration. We make typography loud, structures un-boring, and digital objects unforgettable.",
    biography: [
      "I run an independent visual research and art direction practice operating at the noisy collision of print editorial, kinetic type engines, and radical brand systems.",
      "Over the past 8 years, I've designed identities for subversive fashion labels, kinetic type systems for global music festivals, and editorial publications that defy the bland minimalism of corporate SaaS.",
    ],
    metadata: {
      basedIn: "Berlin (Kreuzberg) & Stockholm",
      focus: "Brand Identity • Kinetic Typography • Editorial Design • 3D/WebGL",
      currently: "Founder & Creative Director at STUDIO VANCE",
      interests: "Swiss Punk, Risograph Printing, Noise Synthesizers, Brutalist Posters",
      education: "Master of Visual Communication — Universität der Künste Berlin",
    },
    heroImage:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1400&auto=format&fit=crop",
    portraitImage:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop",
  },
  tickerItems: [
    "★ GRAPHIC DESIGN",
    "★ KINETIC TYPOGRAPHY",
    "★ ART DIRECTION",
    "★ BRAND IDENTITIES",
    "★ EDITORIAL MONOGRAPHS",
    "★ CREATIVE CODE",
    "★ SWISS PUNK POSTERS",
    "★ 3D & MOTION",
    "★ SMARTNSHINE STUDIO // 2026",
  ],
  stats: [
    {
      number: "38+",
      label: "IDENTITIES DESIGNED",
      caption: "From cult record labels to avant-garde fashion houses.",
    },
    {
      number: "16",
      label: "EDITORIAL ISSUES",
      caption: "Printed and digital magazines art-directed and typeset.",
    },
    {
      number: "04",
      label: "AWWWARDS SITE OF THE DAY",
      caption: "Recognizing radical digital typography and interactive design.",
    },
    {
      number: "2026",
      label: "CURRENT MONOGRAPH",
      caption: "SmartNShine Graphic Arts Edition.",
    },
  ],
  featureProjects: [
    {
      id: "feature-01",
      number: "01",
      featureLabel: "MONOGRAPH 01 • BRAND IDENTITY & POSTER SERIES",
      title: "NEO-SWISS BRUTALISM // VOLT IDENTITY",
      subtitle: "Dynamic visual identity and screenprinted poster campaign for an experimental electronic festival.",
      category: "BRAND IDENTITY / POSTER DESIGN",
      year: "2026",
      image:
        "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1400&auto=format&fit=crop",
      liveUrl: "https://volt-festival.example.com",
      githubUrl: "https://github.com/alexvance/volt-visual-system",
      idea: "Electronic music festivals often rely on cliché neon gradients. We designed an unapologetic, black-and-acid-chartreuse Swiss brutalist poster system that mutates based on audio bpm.",
      build:
        "Custom grotesque typeface designed in Glyphs, generative poster engine coded with p5.js & WebGL, paired with a 7-color spot Pantone screenprint run on recycled cotton paper.",
      result:
        "Sold out all 15,000 passes in 4 minutes; the visual identity was featured on It's Nice That, Eye Magazine, and AIGA Eye on Design.",
      technologies: ["Typography Design", "Custom Typeface", "p5.js", "Silkscreen Print", "Art Direction"],
      specs: ["100% Vector Type", "Pantone 809C + Pitch Black", "300 DPI Offset"],
    },
    {
      id: "feature-02",
      number: "02",
      featureLabel: "MONOGRAPH 02 • 320-PAGE EDITORIAL JOURNAL",
      title: "032-V MAGAZINE // THE FRICTION ISSUE",
      subtitle: "Editorial art direction, bespoke typography, and physical magazine curation.",
      category: "EDITORIAL / PUBLICATION DESIGN",
      year: "2025",
      image:
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1400&auto=format&fit=crop",
      liveUrl: "https://032v-magazine.example.com",
      githubUrl: "https://github.com/alexvance/032v-editorial",
      idea: "Print magazines must offer tactile experiences no phone scroll can replicate. We created a 320-page monograph with exposed French fold bindings and metallic foil typography.",
      build:
        "Designed in InDesign with custom type pairing (high-contrast Didone serifs + harsh industrial monospaces). Digital companion site built with React & fluid View Transitions.",
      result:
        "Printed 8,000 copies distributed across London, Tokyo, Berlin, and NYC bookstores. Nominated for D&AD Yellow Pencil in Magazine Design.",
      technologies: ["Publication Design", "Editorial Grid", "Foil Stamping", "Next.js", "Creative Direction"],
      specs: ["320 Pages", "Exposed Binding", "Cold-Foil Silver Cover"],
    },
    {
      id: "feature-03",
      number: "03",
      featureLabel: "MONOGRAPH 03 • GENERATIVE KINETIC TYPE LAB",
      title: "VARIABLE GLYPH ENGINE // REALTIME TYPE",
      subtitle: "Interactive browser-based kinetic typography experiment reacting to user cursor velocity and microphone input.",
      category: "KINETIC TYPOGRAPHY / CREATIVE CODE",
      year: "2025",
      image:
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1400&auto=format&fit=crop",
      liveUrl: "https://type-engine.example.com",
      githubUrl: "https://github.com/alexvance/kinetic-type-engine",
      idea: "Typography shouldn't stay static on modern screens. We explored how letterforms warp, stretch, and fragment when treated like fluid physics particles.",
      build:
        "Engineered with Three.js, GLSL custom fragment shaders, and OpenType variable font axes driven by Web Audio API frequency analysis.",
      result:
        "Over 250,000 unique typography posters generated by designers worldwide; awarded FWA of the Day and Site of the Month.",
      technologies: ["Three.js", "GLSL Shaders", "Variable Fonts", "Web Audio API", "Creative Coding"],
      specs: ["60 FPS Realtime", "Audio Reactive", "SVG / PNG Poster Export"],
    },
  ],
  archiveProjects: [
    {
      id: "arc-01",
      number: "01",
      title: "Kult Discs Record Sleeves",
      category: "Vinyl Packaging & Typography",
      year: "2026",
      tags: ["Vinyl Sleeve", "Letterpress", "Branding"],
      image:
        "https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=1000&auto=format&fit=crop",
      link: "https://example.com/kult",
    },
    {
      id: "arc-02",
      number: "02",
      title: "Berlin Biennial Exhibition Catalogue",
      category: "Exhibition Monograph",
      year: "2025",
      tags: ["Book Design", "Editorial Grid", "Curation"],
      image:
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1000&auto=format&fit=crop",
      link: "https://example.com/biennial",
    },
    {
      id: "arc-03",
      number: "03",
      title: "Aura Noise Modular Synthesizer UI",
      category: "Hardware Frontplate & Graphic UI",
      year: "2025",
      tags: ["Industrial Graphics", "Eurorack", "Vector"],
      image:
        "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1000&auto=format&fit=crop",
      link: "https://example.com/modular-ui",
    },
    {
      id: "arc-04",
      number: "04",
      title: "Svenska Arkitektur Monograph",
      category: "Architecture Identity",
      year: "2024",
      tags: ["Minimalist Layout", "Identity", "Signage"],
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop",
      link: "https://example.com/svenska",
    },
    {
      id: "arc-05",
      number: "05",
      title: "Acid Glitch Fashion Lookbook",
      category: "Creative Direction & Photo Curation",
      year: "2024",
      tags: ["Art Direction", "Lookbook", "Styling"],
      image:
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop",
      link: "https://example.com/lookbook",
    },
  ],
  experience: [
    {
      period: "2023 — PRESENT",
      year: "2026",
      role: "FOUNDER & CREATIVE DIRECTOR",
      company: "STUDIO VANCE",
      location: "Berlin & Stockholm",
      description:
        "Leading independent visual identity, editorial publication design, and experimental interactive typography projects for global cultural institutions and disruptive brands.",
      contributions: [
        "Art-directed 12 international brand overhauls generating over $40M in collective rebrand valuation.",
        "Commissioned by Centre Pompidou and Barbican Centre for interactive exhibition identities.",
      ],
    },
    {
      period: "2020 — 2023",
      year: "2023",
      role: "SENIOR ART DIRECTOR",
      company: "KINETIC CULTURE AGENCY",
      location: "London, UK",
      description:
        "Spearheaded digital campaign art direction, kinetic typography systems, and physical festival environmental graphics across Europe.",
      contributions: [
        "Won 3 D&AD Pencils and 2 Tokyo TDC Annual Book inclusions for innovative poster design.",
        "Managed a multidisciplinary team of 8 designers, 3D artists, and creative coders.",
      ],
    },
    {
      period: "2018 — 2020",
      year: "2020",
      role: "EDITORIAL DESIGNER & TYPOGRAPHER",
      company: "RADIKAL PUBLISHING HOUSE",
      location: "Berlin, Germany",
      description:
        "Designed quarterly print magazines, custom display typefaces, and experimental book bindings for contemporary art and architecture monographs.",
      contributions: [
        "Authored custom display typeface 'Vance Grotesk' used across 20+ printed issues.",
      ],
    },
  ],
  toolbox: {
    brandIdentity: [
      { name: "Visual Identity Systems", spec: "Full Guidelines & Tokens" },
      { name: "Custom Typeface Design", spec: "Glyphs & FontLab" },
      { name: "Brand Strategy & Positioning", spec: "Art Direction" },
      { name: "Logotypes & Monograms", spec: "Precision Geometry" },
      { name: "Spatial & Exhibition Signage", spec: "Architectural Graphics" },
    ],
    editorialPrint: [
      { name: "Magazine & Book Layout", spec: "Adobe InDesign Mastery" },
      { name: "Editorial Typography & Grids", spec: "Modular & Asymmetric" },
      { name: "Pre-Press & Color Separation", spec: "CMYK & Spot Pantones" },
      { name: "Specialty Finishes & Foils", spec: "Embossing & French Fold" },
      { name: "Risograph & Silkscreen", spec: "Analog Printmaking" },
    ],
    creativeTech: [
      { name: "Kinetic & Variable Typography", spec: "CSS & WebGL" },
      { name: "Generative Poster Engines", spec: "p5.js & Canvas" },
      { name: "Interactive Web Experiences", spec: "React, Next.js, Framer" },
      { name: "3D Motion & Packaging Renders", spec: "Blender & Cinema 4D" },
      { name: "Shader Graphics & Visual FX", spec: "GLSL & Three.js" },
    ],
  },
  journalNotes: [
    {
      id: "note-01",
      date: "SEP 2026",
      tag: "CRITICAL ESSAY",
      title: "The Death of Corporate Blandness: Why Design Needs More Noise",
      excerpt:
        "How 10 years of geometric SaaS sans-serifs sucked the soul out of visual culture, and why brutalist typography is reclaiming human intent.",
      content:
        "When every tech company adopted the exact same circular sans-serif, corporate design achieved peak efficiency and zero emotional resonance. In our studio, we practice purposeful dissonance: typography that stops your eye, breaks predictable grids, and forces the viewer to actually read rather than skim.",
    },
    {
      id: "note-02",
      date: "JUL 2026",
      tag: "TECHNICAL NOTE",
      title: "Variable Fonts as Living Organic Material on the Web",
      excerpt:
        "Treating OpenType variable font axes as physics engines connected to audio input, scroll speed, and cursor kinetic energy.",
      content:
        "Print design treats ink as a static crystallization of thought. Digital typography should behave like liquid mercury. By hooking OpenType weight, optical size, and slant axes to real-time browser telemetry, letterforms become expressive kinetic actors rather than inert glyphs.",
    },
    {
      id: "note-03",
      date: "MAY 2026",
      tag: "MANIFESTO",
      title: "Print Is Dead. Long Live Physical Tactility.",
      excerpt:
        "Why printing a physical book in 2026 is the ultimate radical luxury, and how digital experiences must borrow the tactile weight of paper.",
      content:
        "Because everything digital can be deleted with a keystroke, physical books have become sacred artifacts. When we design websites, we don't imitate skeuomorphism — we replicate the deliberate pacing, the monumental scale, and the unhurried confidence of a 300-page monograph.",
    },
  ],
  socials: [
    { name: "INSTAGRAM", url: "https://instagram.com", handle: "@vance.studio" },
    { name: "ARE.NA", url: "https://are.na", handle: "alex-vance-visuals" },
    { name: "BEHANCE", url: "https://behance.net", handle: "alexvancedesign" },
    { name: "GITHUB", url: "https://github.com", handle: "@alexvance" },
    { name: "LINKEDIN", url: "https://linkedin.com", handle: "alex-vance-design" },
  ],
  seoConfig: {
    title: "Alex Vance — Graphic Designer & Art Director Magazine Monograph | SmartNShine",
    description:
      "A bold, funky, avant-garde magazine portfolio for graphic designers, art directors, and creative technologists.",
    keywords: [
      "graphic designer portfolio",
      "art director",
      "typography",
      "editorial magazine portfolio",
      "032c",
      "Ray Gun",
      "SmartNShine",
    ],
    ogImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1400&auto=format&fit=crop",
  },
};
