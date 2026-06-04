export const locales = ['fr', 'en'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'fr'

export type BioSegment = { text: string; highlight?: boolean }

export type ProjectItem = {
  title: string
  language: string
  url: string
  source: 'github' | 'gitlab' | 'huggingface'
  description: string
  featured?: boolean
}

export type InterestGroup = {
  id: string
  title: string
  description: string
  items: string[]
}

export const dictionaries = {
  fr: {
    meta: {
      title: 'Tamsi Besson — Full-stack · MCP & AI devtools',
      description:
        'Développeur full-stack à Paris. Serveurs MCP, revue de code IA, Next.js, TypeScript, Python. Portfolio et projets open source sur GitHub.',
      machineTitle: 'Tamsi Besson — Portfolio lisible par machine',
      machineDescription:
        'Portfolio structuré pour agents IA et crawlers : expérience, projets open source, stack MCP/LLM. Version visuelle sur tamsi.dev.',
    },
    nav: {
      about: 'À propos',
      experience: 'Expérience',
      interests: 'Intérêts',
      projects: 'Projets',
      contact: 'Contact',
    },
    audience: {
      label: 'Mode d’affichage',
      human: 'Humain',
      machine: 'Machine',
      machineHint:
        'Vue structurée pour agents et crawlers — liens explicites, sans interface marketing.',
    },
    hero: {
      badgeNew: '2026',
      badge: 'MCP & AI devtools',
      title: 'Développeur full-stack',
      titleAccent: 'MCP, IA & produits web',
      subtitle:
        'Basé à Paris — je construis des serveurs MCP, des workflows LLM et des apps Next.js pour les équipes produit et les grands comptes.',
      ctaPrimary: 'Voir les projets',
      ctaSecondary: 'Me contacter',
    },
    about: {
      title: 'À propos',
      sectionBadge: 'Profil',
      quote:
        '\u201cControlling complexity is the essence of computer programming.\u201d',
      quoteAuthor: 'Brian Kernighan',
      focusTitle: 'Ce sur quoi je me concentre',
      focusSubtitle:
        'Aligné avec mon profil GitHub et mes projets récents en open source.',
      focusItems: [
        {
          title: 'MCP',
          description:
            'Serveurs Model Context Protocol pour Cursor, Claude Desktop et les IDE — ponts vers APIs métier et outils de revue de code.',
        },
        {
          title: 'IA & qualité code',
          description:
            'Revue automatisée, analyse de dette technique, sécurité et tests — workflows LLM (OpenAI-compatible, Ollama, Hugging Face).',
        },
        {
          title: 'Produit web',
          description:
            'Next.js, TypeScript, Firebase, Playwright — du CMS enterprise (Drupal) aux apps React Native et plateformes SaaS.',
        },
      ],
      bio1: [
        { text: 'Développeur full-stack à ' },
        { text: 'Paris', highlight: true },
        { text: ', avec ' },
        { text: "~8 ans d'expérience", highlight: true },
        { text: ' chez ' },
        { text: 'Livingcolor', highlight: true },
        {
          text: " en prestation pour TotalEnergies, France Télévisions, AFP, TV5Monde, Harmonie Mutuelle et des maisons ",
        },
        { text: 'LVMH', highlight: true },
        { text: ' (Krug, Moët, Hennessy).' },
      ] satisfies BioSegment[],
      bio2: [
        { text: 'En parallèle, je publie des ' },
        { text: 'outils open source', highlight: true },
        { text: ' sur GitHub — ' },
        { text: 'ai-code-reviewer-mcp', highlight: true },
        { text: ', ' },
        { text: 'git-mentor', highlight: true },
        { text: ', ' },
        { text: 'redbee-mcp', highlight: true },
        { text: ' — et contribue à des produits comme ' },
        { text: 'VisualQ', highlight: true },
        { text: ' (tests de régression visuelle). Formé à ' },
        { text: '42', highlight: true },
        { text: ', certifié MCP (Hugging Face) et spécialisation ML (Coursera).' },
      ] satisfies BioSegment[],
      location: 'Paris, France',
      company: 'Livingcolor',
      companyUrl: 'https://www.livingcolor.fr/',
      school: '42',
      schoolUrl: 'https://42.fr/',
      languagesTitle: 'Langues',
      languages: [
        { name: 'Français', level: 'Natif' },
        { name: 'Anglais', level: 'Professionnel' },
        { name: 'Espagnol', level: 'Élémentaire' },
      ],
    },
    experience: {
      title: 'Expérience & Formation',
      sectionBadge: 'Parcours',
      viewCertificate: 'Voir le certificat',
      items: [
        {
          title: 'Développeur Web',
          org: 'Livingcolor',
          period: 'Jan 2018 — Présent',
          location: 'Lieusaint, Île-de-France',
          description:
            "Sites Drupal & Symfony, apps React / Next.js (France TV, Harmonie Mutuelle, TV5Monde), React Native (Asmodee, Crédit Agricole), Shopify, et intégrations IA (MCP, Playwright, Firebase) pour les workflows d'équipe.",
        },
        {
          title: 'Fundamentals of MCP',
          org: 'Hugging Face',
          period: 'Nov 2025',
          location: 'En ligne',
          description:
            "Certification sur le Model Context Protocol — intégration d'outils IA dans les IDE et agents.",
        },
        {
          title: 'Machine Learning Specialization',
          org: 'Stanford Online · Coursera',
          period: 'Sep 2024',
          location: 'En ligne',
          description:
            'Supervised & unsupervised learning, réseaux de neurones, systèmes de recommandation, reinforcement learning.',
        },
        {
          title: 'Certificat Niveau II — Computer Programming',
          org: '42',
          period: '2021',
          location: 'Paris',
          description:
            'Programmation C, algorithmie et projets collaboratifs intensifs.',
        },
      ],
    },
    interests: {
      title: 'Intérêts & environnement',
      sectionBadge: 'Workflow',
      subtitle:
        "Ce qui structure mon quotidien de dev — IDE agentiques, LLM locaux, MCP, plugins et automatisation.",
      groups: [
        {
          id: 'cursor',
          title: 'Cursor & agents',
          description:
            "IDE principal — règles, plugins, skills et sessions agent pour coder, revoir et itérer plus vite.",
          items: ['Cursor', 'Rules', 'Plugins', 'Agent skills', 'Composer'],
        },
        {
          id: 'llm',
          title: 'LLM & inference',
          description:
            "Modèles locaux et distants — prototypage offline, démos Hugging Face, endpoints compatibles OpenAI.",
          items: ['Ollama', 'Hugging Face', 'OpenAI-compatible', 'Qwen', 'Gradio'],
        },
        {
          id: 'mcp',
          title: 'MCP & protocoles',
          description:
            "Model Context Protocol — serveurs maison qui exposent GitHub, APIs métier et revue de code aux assistants.",
          items: ['MCP', 'MCP servers', 'Tool calling', 'Claude Desktop', 'Cursor MCP'],
        },
        {
          id: 'automation',
          title: 'Automatisation',
          description:
            "Réduire le travail répétitif — CI, tests visuels, scripts et pipelines autour des dépôts.",
          items: ['Playwright', 'GitHub Actions', 'GitLab CI', 'Scripts & hooks', 'Vercel'],
        },
        {
          id: 'hermes',
          title: 'Hermes Agent',
          description:
            "Agent open source (Nous Research) à boucle d'apprentissage — skills persistantes, mémoire et automatisation multi-plateforme.",
          items: ['Hermes Agent', 'Skills', 'Mémoire persistante', 'Webhooks', 'Firebase'],
        },
      ] satisfies InterestGroup[],
    },
    projects: {
      title: 'Projets',
      sectionBadge: 'Open source',
      sectionSubtitle: 'Sélection alignée sur mon GitHub — démos live quand disponibles.',
      featuredLabel: 'À la une',
      items: [
        {
          title: 'ai-code-reviewer-mcp',
          language: 'TypeScript · MCP',
          url: 'https://github.com/Tamsi/ai-code-reviewer-mcp',
          source: 'github',
          featured: true,
          description:
            'Serveur MCP de revue de code GitHub — bugs, sécurité, dette technique, tests manquants via un LLM compatible OpenAI. Démo Gradio sur Hugging Face.',
        },
        {
          title: 'git-mentor',
          language: 'TypeScript · CLI',
          url: 'https://github.com/Tamsi/git-mentor',
          source: 'github',
          featured: true,
          description:
            'Coach de carrière GitHub local-first — TUI Ink, Ollama, preuves et recommandations basées sur ton historique de dépôts.',
        },
        {
          title: 'redbee-mcp',
          language: 'Python · MCP',
          url: 'https://github.com/Tamsi/redbee-mcp',
          source: 'github',
          featured: true,
          description:
            'Pont MCP vers les API Red Bee Media OTT — pour Cursor, Claude et les clients MCP qui automatisent la plateforme streaming.',
        },
        {
          title: 'VisualQ',
          language: 'Next.js · TypeScript',
          url: 'https://github.com/abecms/visualq',
          source: 'github',
          description:
            "Plateforme VRT — captures, comparaisons pixel-perfect, multi-viewports, CI/CD GitLab, Coach IA et analyse Vision pour les régressions visuelles.",
        },
        {
          title: 'dream-defender',
          language: 'C · WebAssembly',
          url: 'https://github.com/Tamsi/dream-defender',
          source: 'github',
          description:
            'Jeu navigateur compilé en WebAssembly — démo jouable sur Vercel.',
        },
        {
          title: 'ScoreJamAi',
          language: 'Next.js · TypeScript',
          url: 'https://github.com/abecms/ScoreJamAi',
          source: 'github',
          description:
            "Générateur de formulaires de notation propulsé par l'IA — publication, collecte et évaluation automatique des réponses.",
        },
      ] satisfies ProjectItem[],
    },
    contact: {
      title: 'Contact',
      sectionBadge: 'Échange',
      subtitle:
        "Envie de collaborer sur du MCP, de l'IA ou un produit web\u00a0? Écrivez-moi.",
      copyright: '© {year} Tamsi Besson · tamsi.dev',
    },
  },

  en: {
    meta: {
      title: 'Tamsi Besson — Full-stack · MCP & AI devtools',
      description:
        'Full-stack developer in Paris. MCP servers, AI code review, Next.js, TypeScript, Python. Portfolio and open source on GitHub.',
      machineTitle: 'Tamsi Besson — Machine-readable portfolio',
      machineDescription:
        'Structured portfolio for AI agents and crawlers: experience, open source, MCP/LLM stack. Visual site at tamsi.dev.',
    },
    nav: {
      about: 'About',
      experience: 'Experience',
      interests: 'Interests',
      projects: 'Projects',
      contact: 'Contact',
    },
    audience: {
      label: 'Display mode',
      human: 'Human',
      machine: 'Machine',
      machineHint:
        'Structured view for agents and crawlers — explicit links, no marketing chrome.',
    },
    hero: {
      badgeNew: '2026',
      badge: 'MCP & AI devtools',
      title: 'Full-stack developer',
      titleAccent: 'MCP servers & AI workflows',
      subtitle:
        'Based in Paris — I build MCP servers, LLM workflows, and Next.js apps for product teams and enterprise clients.',
      ctaPrimary: 'View projects',
      ctaSecondary: 'Get in touch',
    },
    about: {
      title: 'About',
      sectionBadge: 'Profile',
      quote:
        '\u201cControlling complexity is the essence of computer programming.\u201d',
      quoteAuthor: 'Brian Kernighan',
      focusTitle: 'What I focus on',
      focusSubtitle: 'Aligned with my GitHub profile and recent open source work.',
      focusItems: [
        {
          title: 'MCP',
          description:
            'Model Context Protocol servers for Cursor, Claude Desktop, and IDEs — bridges to business APIs and code review tools.',
        },
        {
          title: 'AI & code quality',
          description:
            'Automated review, tech debt, security, and test gaps — LLM workflows (OpenAI-compatible, Ollama, Hugging Face).',
        },
        {
          title: 'Web product',
          description:
            'Next.js, TypeScript, Firebase, Playwright — from enterprise CMS (Drupal) to React Native apps and SaaS platforms.',
        },
      ],
      bio1: [
        { text: 'Full-stack developer in ' },
        { text: 'Paris', highlight: true },
        { text: ' with ' },
        { text: '~8 years of experience', highlight: true },
        { text: ' at ' },
        { text: 'Livingcolor', highlight: true },
        {
          text: ', contracting for TotalEnergies, France Télévisions, AFP, TV5Monde, Harmonie Mutuelle, and ',
        },
        { text: 'LVMH', highlight: true },
        { text: ' houses (Krug, Moët, Hennessy).' },
      ] satisfies BioSegment[],
      bio2: [
        { text: 'On the side I ship ' },
        { text: 'open source tools', highlight: true },
        { text: ' on GitHub — ' },
        { text: 'ai-code-reviewer-mcp', highlight: true },
        { text: ', ' },
        { text: 'git-mentor', highlight: true },
        { text: ', ' },
        { text: 'redbee-mcp', highlight: true },
        { text: ' — and contribute to products like ' },
        { text: 'VisualQ', highlight: true },
        { text: ' (visual regression testing). Trained at ' },
        { text: '42', highlight: true },
        { text: ', MCP certified (Hugging Face) and ML specialization (Coursera).' },
      ] satisfies BioSegment[],
      location: 'Paris, France',
      company: 'Livingcolor',
      companyUrl: 'https://www.livingcolor.fr/',
      school: '42',
      schoolUrl: 'https://42.fr/en/homepage/',
      languagesTitle: 'Languages',
      languages: [
        { name: 'French', level: 'Native' },
        { name: 'English', level: 'Professional' },
        { name: 'Spanish', level: 'Elementary' },
      ],
    },
    experience: {
      title: 'Experience & Education',
      sectionBadge: 'Journey',
      viewCertificate: 'View certificate',
      items: [
        {
          title: 'Web Developer',
          org: 'Livingcolor',
          period: 'Jan 2018 — Present',
          location: 'Lieusaint, Île-de-France',
          description:
            'Drupal & Symfony sites, React / Next.js apps (France TV, Harmonie Mutuelle, TV5Monde), React Native (Asmodee, Crédit Agricole), Shopify, and AI integrations (MCP, Playwright, Firebase) for team workflows.',
        },
        {
          title: 'Fundamentals of MCP',
          org: 'Hugging Face',
          period: 'Nov 2025',
          location: 'Online',
          description:
            'Certification on the Model Context Protocol — wiring AI tools into IDEs and agents.',
        },
        {
          title: 'Machine Learning Specialization',
          org: 'Stanford Online · Coursera',
          period: 'Sep 2024',
          location: 'Online',
          description:
            'Supervised & unsupervised learning, neural networks, recommender systems, reinforcement learning.',
        },
        {
          title: 'Level II Certificate — Computer Programming',
          org: '42',
          period: '2021',
          location: 'Paris',
          description:
            'Intensive C programming, algorithms, and collaborative projects.',
        },
      ],
    },
    interests: {
      title: 'Interests & tooling',
      sectionBadge: 'Workflow',
      subtitle:
        'What shapes my day-to-day — agentic IDEs, local LLMs, MCP, plugins, and automation.',
      groups: [
        {
          id: 'cursor',
          title: 'Cursor & agents',
          description:
            'Primary IDE — rules, plugins, skills, and agent sessions to code, review, and iterate faster.',
          items: ['Cursor', 'Rules', 'Plugins', 'Agent skills', 'Composer'],
        },
        {
          id: 'llm',
          title: 'LLM & inference',
          description:
            'Local and remote models — offline prototyping, Hugging Face demos, OpenAI-compatible endpoints.',
          items: ['Ollama', 'Hugging Face', 'OpenAI-compatible', 'Qwen', 'Gradio'],
        },
        {
          id: 'mcp',
          title: 'MCP & protocols',
          description:
            'Model Context Protocol — custom servers exposing GitHub, business APIs, and code review to assistants.',
          items: ['MCP', 'MCP servers', 'Tool calling', 'Claude Desktop', 'Cursor MCP'],
        },
        {
          id: 'automation',
          title: 'Automation',
          description:
            'Cutting repetitive work — CI, visual testing, scripts, and pipelines around repos.',
          items: ['Playwright', 'GitHub Actions', 'GitLab CI', 'Scripts & hooks', 'Vercel'],
        },
        {
          id: 'hermes',
          title: 'Hermes Agent',
          description:
            'Open-source agent (Nous Research) with a learning loop — persistent skills, memory, and cross-platform automation.',
          items: ['Hermes Agent', 'Skills', 'Persistent memory', 'Webhooks', 'Firebase'],
        },
      ] satisfies InterestGroup[],
    },
    projects: {
      title: 'Projects',
      sectionBadge: 'Open source',
      sectionSubtitle: 'Curated from my GitHub — live demos when available.',
      featuredLabel: 'Featured',
      items: [
        {
          title: 'ai-code-reviewer-mcp',
          language: 'TypeScript · MCP',
          url: 'https://github.com/Tamsi/ai-code-reviewer-mcp',
          source: 'github',
          featured: true,
          description:
            'MCP server for GitHub code review — bugs, security, tech debt, missing tests via an OpenAI-compatible LLM. Gradio demo on Hugging Face.',
        },
        {
          title: 'git-mentor',
          language: 'TypeScript · CLI',
          url: 'https://github.com/Tamsi/git-mentor',
          source: 'github',
          featured: true,
          description:
            'Local-first GitHub career coach — Ink TUI, Ollama, evidence-backed recommendations from your repo history.',
        },
        {
          title: 'redbee-mcp',
          language: 'Python · MCP',
          url: 'https://github.com/Tamsi/redbee-mcp',
          source: 'github',
          featured: true,
          description:
            'MCP bridge to Red Bee Media OTT APIs — for Cursor, Claude, and MCP clients automating the streaming platform.',
        },
        {
          title: 'VisualQ',
          language: 'Next.js · TypeScript',
          url: 'https://github.com/abecms/visualq',
          source: 'github',
          description:
            'VRT platform — screenshots, pixel-perfect diffs, multi-viewport runs, GitLab CI, AI Coach, and Vision analysis for visual regressions.',
        },
        {
          title: 'dream-defender',
          language: 'C · WebAssembly',
          url: 'https://github.com/Tamsi/dream-defender',
          source: 'github',
          description:
            'Browser game compiled to WebAssembly — playable demo on Vercel.',
        },
        {
          title: 'ScoreJamAi',
          language: 'Next.js · TypeScript',
          url: 'https://github.com/abecms/ScoreJamAi',
          source: 'github',
          description:
            'AI-powered scoring form builder — publish forms and let AI grade responses with detailed analytics.',
        },
      ] satisfies ProjectItem[],
    },
    contact: {
      title: 'Contact',
      sectionBadge: 'Connect',
      subtitle:
        'Interested in MCP, AI tooling, or a web product? Drop me a line.',
      copyright: '© {year} Tamsi Besson · tamsi.dev',
    },
  },
} as const

export type Dictionary = (typeof dictionaries)[Locale]
