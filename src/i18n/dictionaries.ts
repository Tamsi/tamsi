export const locales = ['fr', 'en'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'fr'

export const dictionaries = {
  fr: {
    meta: {
      title: 'Tamsi Besson — Développeur Web',
      description:
        "Portfolio de Tamsi Besson, développeur web basé à Paris avec ~8 ans d'expérience. React, Next.js, TypeScript, Python.",
    },
    nav: {
      about: 'À propos',
      experience: 'Expérience',
      skills: 'Compétences',
      projects: 'Projets',
      contact: 'Contact',
    },
    hero: {
      subtitle: 'Développeur Web\u00a0|\u00a0Paris, France',
    },
    about: {
      title: 'À propos',
      quote:
        '\u201cControlling complexity is the essence of computer programming.\u201d',
      quoteAuthor: 'Brian Kernighan',
      bio1: 'Développeur web avec <strong class="text-foreground">~8 ans d\'expérience</strong> chez <strong class="text-foreground">Livingcolor</strong>, où j\'interviens en tant que prestataire sur des projets variés pour de grands comptes\u00a0: <strong class="text-foreground">TotalEnergies</strong>, <strong class="text-foreground">France Télévisions</strong>, <strong class="text-foreground">AFP</strong>, <strong class="text-foreground">TV5Monde</strong>, <strong class="text-foreground">Harmonie Mutuelle</strong>, ou encore des maisons <strong class="text-foreground">LVMH</strong> (Krug, Moët, Hennessy).',
      bio2: 'Mon parcours couvre le web dans sa globalité — du <strong class="text-foreground">Drupal</strong> et <strong class="text-foreground">Symfony</strong> au <strong class="text-foreground">React / Next.js</strong>, en passant par du <strong class="text-foreground">React Native</strong> (apps Asmodee &amp; Crédit Agricole), du <strong class="text-foreground">Shopify</strong> et des serveurs <strong class="text-foreground">MCP</strong> pour l\'intégration IA. Formé à <strong class="text-foreground">42</strong>, je mets la rigueur algorithmique au service de projets ambitieux.',
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
      viewCertificate: 'Voir le certificat',
      items: [
        {
          title: 'Développeur Web',
          org: 'Livingcolor',
          period: 'Jan 2018 — Présent',
          location: 'Lieusaint, Île-de-France',
          description:
            "Développement web en prestation pour de grands comptes : sites Drupal (TotalEnergies, AFP, LVMH — Krug, Moët, Hennessy), apps React & Next.js (France TV, Harmonie Mutuelle, TV5Monde), React Native (Asmodee, Crédit Agricole), e-commerce Shopify, et serveurs MCP pour l'IA.",
        },
        {
          title: 'Fundamentals of MCP',
          org: 'Hugging Face',
          period: 'Nov 2025',
          location: 'En ligne',
          description:
            "Certification sur les fondamentaux du Model Context Protocol pour l'intégration d'outils IA.",
        },
        {
          title: 'Machine Learning Specialization',
          org: 'Stanford Online · Coursera',
          period: 'Sep 2024',
          location: 'En ligne',
          description:
            'Spécialisation en 3 cours couvrant le supervised & unsupervised learning, les réseaux de neurones, les systèmes de recommandation et le reinforcement learning.',
        },
        {
          title: 'Certificat Niveau II — Computer Programming',
          org: '42',
          period: '2021',
          location: 'Paris',
          description:
            'Formation intensive en programmation C, algorithmie et projets collaboratifs.',
        },
      ],
    },
    skills: {
      title: 'Compétences',
    },
    projects: {
      title: 'Projets',
      items: [
        {
          description:
            "Plateforme de tests de régression visuelle propulsée par l'IA — compare des captures d'écran avec Pixelmatch, intègre GitLab CI & JIRA, et utilise OpenAI Vision pour l'analyse intelligente des différences.",
        },
        {
          description:
            "Générateur de formulaires propulsé par l'IA — créez des formulaires de notation personnalisés, publiez-les pour vos utilisateurs et laissez l'IA évaluer les réponses avec des analyses détaillées.",
        },
        {
          description:
            "Serveur MCP pour Red Bee Media OTT — permet aux assistants IA d'interagir avec les API de la plateforme de streaming via le Model Context Protocol.",
        },
        {
          description:
            'Cursus complet de 42 — de libft à ft_transcendence (Pong multijoueur avec Django, WebSockets, OAuth2, microservices Docker).',
        },
        {
          description:
            "Module Drupal 8 — permet aux éditeurs de contenu d'épingler et de désépingler des articles en haut des pages de listing.",
        },
        {
          description:
            'Collection de projets de la piscine 42 — exercices de programmation C de shell00 à c09, couvrant les algorithmes et la programmation système.',
        },
      ],
    },
    contact: {
      title: 'Contact',
      subtitle:
        "Envie de collaborer ou simplement d'échanger\u00a0? N'hésitez pas à me contacter.",
      copyright: '© {year} Tamsi Besson. Built with Next.js & Tailwind CSS.',
    },
  },

  en: {
    meta: {
      title: 'Tamsi Besson — Web Developer',
      description:
        'Portfolio of Tamsi Besson, web developer based in Paris with ~8 years of experience. React, Next.js, TypeScript, Python.',
    },
    nav: {
      about: 'About',
      experience: 'Experience',
      skills: 'Skills',
      projects: 'Projects',
      contact: 'Contact',
    },
    hero: {
      subtitle: 'Web Developer\u00a0|\u00a0Paris, France',
    },
    about: {
      title: 'About',
      quote:
        '\u201cControlling complexity is the essence of computer programming.\u201d',
      quoteAuthor: 'Brian Kernighan',
      bio1: 'Web developer with <strong class="text-foreground">~8 years of experience</strong> at <strong class="text-foreground">Livingcolor</strong>, working as a contractor on diverse projects for major clients: <strong class="text-foreground">TotalEnergies</strong>, <strong class="text-foreground">France Télévisions</strong>, <strong class="text-foreground">AFP</strong>, <strong class="text-foreground">TV5Monde</strong>, <strong class="text-foreground">Harmonie Mutuelle</strong>, and <strong class="text-foreground">LVMH</strong> houses (Krug, Moët, Hennessy).',
      bio2: 'My background covers the full web spectrum — from <strong class="text-foreground">Drupal</strong> and <strong class="text-foreground">Symfony</strong> to <strong class="text-foreground">React / Next.js</strong>, including <strong class="text-foreground">React Native</strong> (Asmodee &amp; Crédit Agricole apps), <strong class="text-foreground">Shopify</strong>, and <strong class="text-foreground">MCP</strong> servers for AI integration. Trained at <strong class="text-foreground">42</strong>, I bring algorithmic rigor to ambitious projects.',
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
      viewCertificate: 'View certificate',
      items: [
        {
          title: 'Web Developer',
          org: 'Livingcolor',
          period: 'Jan 2018 — Present',
          location: 'Lieusaint, Île-de-France',
          description:
            'Web development as a contractor for major clients: Drupal sites (TotalEnergies, AFP, LVMH — Krug, Moët, Hennessy), React & Next.js apps (France TV, Harmonie Mutuelle, TV5Monde), React Native (Asmodee, Crédit Agricole), Shopify e-commerce, and MCP servers for AI.',
        },
        {
          title: 'Fundamentals of MCP',
          org: 'Hugging Face',
          period: 'Nov 2025',
          location: 'Online',
          description:
            'Certification on Model Context Protocol fundamentals for AI tool integration.',
        },
        {
          title: 'Machine Learning Specialization',
          org: 'Stanford Online · Coursera',
          period: 'Sep 2024',
          location: 'Online',
          description:
            'Three-course specialization covering supervised & unsupervised learning, neural networks, recommender systems, and reinforcement learning.',
        },
        {
          title: 'Level II Certificate — Computer Programming',
          org: '42',
          period: '2021',
          location: 'Paris',
          description:
            'Intensive training in C programming, algorithms, and collaborative projects.',
        },
      ],
    },
    skills: {
      title: 'Skills',
    },
    projects: {
      title: 'Projects',
      items: [
        {
          description:
            'Visual regression testing platform powered by AI — compares screenshots with Pixelmatch, integrates GitLab CI & JIRA, and uses OpenAI Vision for intelligent diff analysis.',
        },
        {
          description:
            'AI-powered form builder — create custom scoring forms, publish them for your users, and let AI grade the responses with detailed analytics.',
        },
        {
          description:
            'MCP Server for Red Bee Media OTT — lets AI assistants interact with streaming platform APIs via Model Context Protocol.',
        },
        {
          description:
            'Full 42 cursus — from libft to ft_transcendence (multiplayer Pong with Django, WebSockets, OAuth2, Docker microservices).',
        },
        {
          description:
            'Drupal 8 module — allows content editors to pin and unpin articles to the top of listing pages.',
        },
        {
          description:
            'Collection of 42 piscine projects — C programming exercises from shell00 to c09, covering algorithms and system programming.',
        },
      ],
    },
    contact: {
      title: 'Contact',
      subtitle: 'Want to collaborate or just chat? Feel free to reach out.',
      copyright: '© {year} Tamsi Besson. Built with Next.js & Tailwind CSS.',
    },
  },
} as const

export type Dictionary = (typeof dictionaries)[Locale]
