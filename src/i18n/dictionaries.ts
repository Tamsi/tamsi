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
        'AI Engineer à Paris. Serveurs MCP, revue de code IA, Next.js, TypeScript, Python. Portfolio et projets open source sur GitHub.',
      machineTitle: 'Tamsi Besson — Portfolio lisible par machine',
      machineDescription:
        'Portfolio structuré pour agents IA et crawlers : expérience, projets open source, stack MCP/LLM. Version visuelle sur tamsi.dev.',
      blogTitle: 'Blog — Tamsi Besson',
      blogDescription:
        'Pourquoi j’ai monté ces outils : tokens LLM gratuits, MCP pour le travail quotidien, revue de code sans surcoût Cursor.',
      adventureTitle: 'Aventure isométrique · Tamsi Besson',
      adventureDescription:
        'Mini-jeu style Dofus : terrain herbeux, déplacement au clic.',
    },
    nav: {
      about: 'À propos',
      experience: 'Expérience',
      interests: 'Intérêts',
      projects: 'Projets',
      blog: 'Blog',
      contact: 'Contact',
    },
    audience: {
      label: 'Mode d’affichage',
      human: 'Humain',
      machine: 'Machine',
      machineHint:
        'Vue structurée pour agents et crawlers — liens explicites, sans interface marketing.',
    },
    welcome: {
      line1: 'Bienvenue',
      line2: 'chez',
      line3: 'Tamsi',
    },
    hero: {
      badgeNew: '2026',
      badge: 'MCP & AI devtools',
      title: 'AI Engineer',
      titleAccent: 'MCP, agents & produits web',
      subtitle:
        'Basé à Paris — je construis des serveurs MCP, des workflows LLM et des apps Next.js pour les équipes produit et les grands comptes.',
      ctaPrimary: 'Lire le blog',
      ctaSecondary: 'Voir les projets',
      adventureTeaser: {
        kicker: 'Side quest',
        title: 'Aventure isométrique',
        hint: 'Clique sur l’herbe pour explorer',
      },
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
        { text: 'AI Engineer à ' },
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
        { text: ', certifié AI Agents & MCP (Hugging Face) et spécialisation ML (Coursera).' },
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
          title: 'AI & Web Engineer',
          org: 'Livingcolor',
          period: 'Jan 2018 — Présent',
          location: 'Lieusaint, Île-de-France',
          description:
            "Sites Drupal & Symfony, apps React / Next.js (France TV, Harmonie Mutuelle, TV5Monde), React Native (Asmodee, Crédit Agricole), Shopify, et intégrations IA (MCP, Playwright, Firebase) pour les workflows d'équipe.",
        },
        {
          title: 'AI Agents Fundamentals',
          org: 'Hugging Face',
          period: 'Jun 2026',
          location: 'En ligne',
          description:
            "Certification sur les fondamentaux des agents IA — tool calling, mémoire, orchestration et déploiement d'agents autonomes.",
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
          period: 'May 2024',
          location: 'En ligne',
          description:
            'Supervised & unsupervised learning, réseaux de neurones, systèmes de recommandation, reinforcement learning.',
        },
        {
          title: 'Certificat Niveau 11 — Computer Programming',
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
          title: 'livingcolor-plugin',
          language: 'Python · Hermes Agent',
          url: 'https://github.com/abecms/livingcolor-plugin',
          source: 'github',
          description:
            'Plugin Hermes Agent pour la livraison autonome — work orders, gates Jira et déploiements validés par l\'humain.',
        },
        {
          title: 'livingcolor-skills',
          language: 'TypeScript · Hermes',
          url: 'https://github.com/Tamsi/livingcolor-skills',
          source: 'github',
          description:
            'Skills Hermes versionnées et portables — comportements experts réutilisables pour agents IA.',
        },
        {
          title: 'livingcolor-evolution',
          language: 'TypeScript · Hermes',
          url: 'https://github.com/Tamsi/livingcolor-evolution',
          source: 'github',
          description:
            'Auto-évolution des skills Hermes depuis le web — audit et mise à jour continue des comportements agents.',
        },
        {
          title: 'VisualQ',
          language: 'Next.js · TypeScript',
          url: 'https://github.com/abecms/visualq',
          source: 'github',
          description:
            'Plateforme QA web — régressions visuelles, performance, SEO, accessibilité et tracking analytics. AI Coach, multi-viewports, surveillance à chaque deploy.',
        },
        {
          title: 'visualq-mcp',
          language: 'TypeScript · MCP',
          url: 'https://github.com/abecms/visualq-mcp',
          source: 'github',
          description:
            'Serveur MCP pour VisualQ — lancer des runs VRT, interroger les échecs et approuver les baselines depuis Cursor ou Claude.',
        },
      ] satisfies ProjectItem[],
    },
    blog: {
      title: 'Blog',
      sectionBadge: 'Articles',
      subtitle:
        'Le pourquoi d’abord — puis l’essentiel du comment (stack, quantification, MCP).',
      homeSubtitle: 'Intérêt et mise en place légère derrière mes projets récents.',
      allPosts: 'Tous les articles',
      backToBlog: 'Retour au blog',
      readingTime: '{minutes} min de lecture',
    },
    contact: {
      title: 'Contact',
      sectionBadge: 'Échange',
      subtitle:
        "Envie de collaborer sur du MCP, de l'IA ou un produit web\u00a0? Écrivez-moi.",
      copyright: '© {year} Tamsi Besson · tamsi.dev',
    },
    adventure: {
      kicker: 'Side quest',
      title: 'Aventure isométrique',
      back: 'Retour au portfolio',
      controls:
        'Clique pour te déplacer. Parle à Tamsi à l\'entrée. ▶/◀ changent de salle. I = inventaire.',
      credit:
        'Guerrier & mage par 2D!PIXX (CC BY 4.0) · opengameart.org/content/warrior-animated-character-isometric',
      npc: {
        name: 'Tamsi Besson',
      },
      combat: {
        title: 'Arène de combat',
        hint: 'Déplace-toi (3 cases max), lance un sort ou termine ton tour. Clic sur l\'ennemi = attaque de mêlée.',
        endTurn: 'Fin du tour',
        movesLeft: 'Déplacements restants',
        playerHp: 'Tes PV',
        enemyHp: 'PV ennemi',
        selectTarget: 'Clique sur l\'ennemi pour viser.',
        selectRangedTarget: 'Clique sur l\'ennemi (portée jusqu\'à 3 cases).',
        victory: 'Victoire ! Le parchemin est à toi.',
        defeat: 'Défaite… retour à l\'entrée.',
      },
      spells: {
        strike: 'Frappe',
        fireball: 'Boule de feu',
        ward: 'Protection',
        mend: 'Soin',
        chainbolt: 'Éclair en chaîne',
        bastion: 'Bastion',
      },
      spellBar: {
        combatOnly: 'Disponible en combat',
      },
      transitionLocked: 'Termine la quête de Tamsi pour débloquer le donjon.',
      dialog: {
        continue: 'Continuer',
        acceptQuest: 'Accepter la quête',
        turnInQuest: 'Rendre le parchemin',
        close: 'Fermer',
        introTitle: 'Rencontre',
        questTitle: 'Quête principale',
        completeTitle: 'Quête accomplie',
        allDoneTitle: 'Donjon exploré',
        intro: [
          'Salut ! Moi c\'est Tamsi Besson — oui, le mage au centre, c\'est moi.',
          'AI Engineer à Paris. J\'ai transformé mon portfolio en donjon isométrique.',
          'Chaque salle cache un parchemin : mes articles de blog. Bat les gardes, lis les écrits, reviens me voir pour apprendre de nouveaux sorts.',
        ],
        mainQuest: {
          body: 'Première quête : trouve le parchemin d\'initiation caché dans l\'entrée, puis rends-le-moi pour débloquer le donjon.',
          reminder:
            'Un parchemin d\'initiation brille dans l\'entrée. Ramasse-le et reviens me le rendre.',
          dungeonOffer:
            'Va plus loin dans le donjon (flèche ▶). Un garde protège un parchemin — bats-le, lis l\'article, puis reviens me le rendre pour un nouveau sort.',
          turnIn:
            'Tu as le parchemin ! Garde-le dans ton inventaire pour le relire, mais rends-le-moi pour valider la quête et apprendre un sort.',
          complete: 'Quête validée !',
          spellLearned: 'Nouveau sort appris : {spell}.',
          allDone: 'Tu as récupéré tous mes écrits du donjon. Le blog t\'attend aussi sur la surface !',
        },
      },
      inventory: {
        title: 'Inventaire',
        empty: 'Aucun parchemin pour l\'instant.',
        hint: 'Touche I',
        read: 'Lire',
        close: 'Fermer',
        pickup: 'Parchemin récupéré !',
      },
      scrollReader: {
        close: 'Fermer',
        readFull: 'Lire l\'article complet →',
      },
      scrolls: {
        tutoWelcome: {
          title: 'Parchemin d\'initiation',
          excerpt: 'Comment explorer ce monde et lire mes écrits.',
          paragraphs: [
            'Tu te déplaces en cliquant sur le sol.',
            'Les parchemins se ramassent en marchant dessus ou en cliquant dessus.',
            'Appuie sur I pour ouvrir l\'inventaire et lire tes trouvailles.',
            'Rends le parchemin à Tamsi à l\'entrée, puis explore le donjon avec ▶.',
          ],
        },
        blog: {
          'unsloth-studio-hf-live-daniel-hanchen': {
            title: 'Unsloth Studio HF Live',
            excerpt: 'Fine-tuning et démo live avec Daniel Hanchen.',
          },
          'hermes-automation-cheaper-models': {
            title: 'Hermes Automation',
            excerpt: 'Automatiser avec des modèles moins chers.',
          },
          'qwen-3-6-27b-remote-server': {
            title: 'Qwen 3.6 27B Remote',
            excerpt: 'Inférence distante sur serveur GPU.',
          },
          'redbee-mcp': {
            title: 'Redbee MCP',
            excerpt: 'Serveur MCP pour Red Bee Media.',
          },
          'ai-code-reviewer-mcp': {
            title: 'AI Code Reviewer MCP',
            excerpt: 'Revue de code via MCP sans surcoût Cursor.',
          },
        },
      },
    },
  },

  en: {
    meta: {
      title: 'Tamsi Besson — Full-stack · MCP & AI devtools',
      description:
        'AI Engineer in Paris. MCP servers, AI code review, Next.js, TypeScript, Python. Portfolio and open source on GitHub.',
      machineTitle: 'Tamsi Besson — Machine-readable portfolio',
      machineDescription:
        'Structured portfolio for AI agents and crawlers: experience, open source, MCP/LLM stack. Visual site at tamsi.dev.',
      blogTitle: 'Blog — Tamsi Besson',
      blogDescription:
        'Why I built these tools: free LLM tokens, MCP for daily work, code review without extra Cursor cost.',
      adventureTitle: 'Isometric adventure · Tamsi Besson',
      adventureDescription:
        'Dofus-style mini-game: grassy field, click to move.',
    },
    nav: {
      about: 'About',
      experience: 'Experience',
      interests: 'Interests',
      projects: 'Projects',
      blog: 'Blog',
      contact: 'Contact',
    },
    audience: {
      label: 'Display mode',
      human: 'Human',
      machine: 'Machine',
      machineHint:
        'Structured view for agents and crawlers — explicit links, no marketing chrome.',
    },
    welcome: {
      line1: 'Welcome',
      line2: 'to',
      line3: 'Tamsi',
    },
    hero: {
      badgeNew: '2026',
      badge: 'MCP & AI devtools',
      title: 'AI Engineer',
      titleAccent: 'MCP agents & AI workflows',
      subtitle:
        'Based in Paris — I build MCP servers, LLM workflows, and Next.js apps for product teams and enterprise clients.',
      ctaPrimary: 'Read the blog',
      ctaSecondary: 'View projects',
      adventureTeaser: {
        kicker: 'Side quest',
        title: 'Isometric adventure',
        hint: 'Click the grass to explore',
      },
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
        { text: 'AI Engineer in ' },
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
        { text: ', MCP & AI Agents certified (Hugging Face) and ML specialization (Coursera).' },
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
          title: 'AI & Web Engineer',
          org: 'Livingcolor',
          period: 'Jan 2018 — Present',
          location: 'Lieusaint, Île-de-France',
          description:
            'Drupal & Symfony sites, React / Next.js apps (France TV, Harmonie Mutuelle, TV5Monde), React Native (Asmodee, Crédit Agricole), Shopify, and AI integrations (MCP, Playwright, Firebase) for team workflows.',
        },
        {
          title: 'AI Agents Fundamentals',
          org: 'Hugging Face',
          period: 'Jun 2026',
          location: 'Online',
          description:
            'Certification on AI agent fundamentals — tool calling, memory, orchestration, and deploying autonomous agents.',
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
          period: 'May 2024',
          location: 'Online',
          description:
            'Supervised & unsupervised learning, neural networks, recommender systems, reinforcement learning.',
        },
        {
          title: 'Level 11 Certificate — Computer Programming',
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
          title: 'livingcolor-plugin',
          language: 'Python · Hermes Agent',
          url: 'https://github.com/abecms/livingcolor-plugin',
          source: 'github',
          description:
            'Hermes Agent plugin for autonomous delivery — work orders, Jira gates, and human-approved deploys.',
        },
        {
          title: 'livingcolor-skills',
          language: 'TypeScript · Hermes',
          url: 'https://github.com/Tamsi/livingcolor-skills',
          source: 'github',
          description:
            'Portable, versioned Hermes skills — reusable expert behaviors for AI agents.',
        },
        {
          title: 'livingcolor-evolution',
          language: 'TypeScript · Hermes',
          url: 'https://github.com/Tamsi/livingcolor-evolution',
          source: 'github',
          description:
            'Auto-evolution of Hermes skills from the web — continuous audit and refresh of agent behaviors.',
        },
        {
          title: 'VisualQ',
          language: 'Next.js · TypeScript',
          url: 'https://github.com/abecms/visualq',
          source: 'github',
          description:
            'Web QA platform — visual regressions, performance, SEO, accessibility, and analytics tracking. AI Coach, multi-viewport runs, continuous monitoring on every deploy.',
        },
        {
          title: 'visualq-mcp',
          language: 'TypeScript · MCP',
          url: 'https://github.com/abecms/visualq-mcp',
          source: 'github',
          description:
            'MCP server for VisualQ — run VRT, poll failures, and approve baselines from Cursor or Claude.',
        },
      ] satisfies ProjectItem[],
    },
    blog: {
      title: 'Blog',
      sectionBadge: 'Articles',
      subtitle:
        'Why first — then the essentials of how (stack, quantization, MCP).',
      homeSubtitle: 'Motivation and a light technical setup behind recent projects.',
      allPosts: 'All posts',
      backToBlog: 'Back to blog',
      readingTime: '{minutes} min read',
    },
    contact: {
      title: 'Contact',
      sectionBadge: 'Connect',
      subtitle:
        'Interested in MCP, AI tooling, or a web product? Drop me a line.',
      copyright: '© {year} Tamsi Besson · tamsi.dev',
    },
    adventure: {
      kicker: 'Side quest',
      title: 'Isometric adventure',
      back: 'Back to portfolio',
      controls:
        'Click to move. Talk to Tamsi at the entrance. ▶/◀ change rooms. I = inventory.',
      credit:
        'Warrior & wizard by 2D!PIXX (CC BY 4.0) · opengameart.org/content/warrior-animated-character-isometric',
      npc: {
        name: 'Tamsi Besson',
      },
      combat: {
        title: 'Combat arena',
        hint: 'Move (3 cells max), cast a spell, or end turn. Click enemy = melee attack.',
        endTurn: 'End turn',
        movesLeft: 'Moves left',
        playerHp: 'Your HP',
        enemyHp: 'Enemy HP',
        selectTarget: 'Click the enemy to target.',
        selectRangedTarget: 'Click the enemy (range up to 3 cells).',
        victory: 'Victory! The scroll is yours.',
        defeat: 'Defeat… back to the entrance.',
      },
      spells: {
        strike: 'Strike',
        fireball: 'Fireball',
        ward: 'Ward',
        mend: 'Mend',
        chainbolt: 'Chain bolt',
        bastion: 'Bastion',
      },
      spellBar: {
        combatOnly: 'Available in combat',
      },
      transitionLocked: 'Complete Tamsi\'s quest to unlock the dungeon.',
      dialog: {
        continue: 'Continue',
        acceptQuest: 'Accept quest',
        turnInQuest: 'Turn in scroll',
        close: 'Close',
        introTitle: 'Encounter',
        questTitle: 'Main quest',
        completeTitle: 'Quest complete',
        allDoneTitle: 'Dungeon cleared',
        intro: [
          'Hey! I\'m Tamsi Besson — yes, the wizard at the entrance is me.',
          'AI Engineer in Paris. I turned my portfolio into an isometric dungeon.',
          'Each room hides a scroll: my blog posts. Defeat guards, read the writing, come back to learn new spells.',
        ],
        mainQuest: {
          body: 'First quest: find the initiation scroll hidden in the entrance, then turn it in to unlock the dungeon.',
          reminder:
            'An initiation scroll glows in the entrance. Pick it up and bring it back to me.',
          dungeonOffer:
            'Go deeper into the dungeon (▶ arrow). A guard protects a scroll — defeat it, read the article, then turn the scroll in for a new spell.',
          turnIn:
            'You have the scroll! Keep it in your inventory to re-read, but turn it in to complete the quest and learn a spell.',
          complete: 'Quest complete!',
          spellLearned: 'New spell learned: {spell}.',
          allDone: 'You\'ve recovered every scroll in the dungeon. The blog also awaits on the surface!',
        },
      },
      inventory: {
        title: 'Inventory',
        empty: 'No scrolls yet.',
        hint: 'Press I',
        read: 'Read',
        close: 'Close',
        pickup: 'Scroll collected!',
      },
      scrollReader: {
        close: 'Close',
        readFull: 'Read full article →',
      },
      scrolls: {
        tutoWelcome: {
          title: 'Initiation scroll',
          excerpt: 'How to explore this world and read my writing.',
          paragraphs: [
            'Move by clicking the floor.',
            'Scrolls can be picked up by walking onto them or clicking them.',
            'Press I to open your inventory and read your finds.',
            'Turn the scroll in to Tamsi at the entrance, then explore the dungeon with ▶.',
          ],
        },
        blog: {
          'unsloth-studio-hf-live-daniel-hanchen': {
            title: 'Unsloth Studio HF Live',
            excerpt: 'Fine-tuning and live demo with Daniel Hanchen.',
          },
          'hermes-automation-cheaper-models': {
            title: 'Hermes Automation',
            excerpt: 'Automating with cheaper models.',
          },
          'qwen-3-6-27b-remote-server': {
            title: 'Qwen 3.6 27B Remote',
            excerpt: 'Remote inference on a GPU server.',
          },
          'redbee-mcp': {
            title: 'Redbee MCP',
            excerpt: 'MCP server for Red Bee Media.',
          },
          'ai-code-reviewer-mcp': {
            title: 'AI Code Reviewer MCP',
            excerpt: 'Code review via MCP without extra Cursor cost.',
          },
        },
      },
    },
  },
} as const

export type Dictionary = (typeof dictionaries)[Locale]
