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
}

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
      bio1: [
        { text: "Développeur web avec " },
        { text: "~8 ans d'expérience", highlight: true },
        { text: ' chez ' },
        { text: 'Livingcolor', highlight: true },
        {
          text: ", où j'interviens en tant que prestataire sur des projets variés pour de grands comptes\u00a0: ",
        },
        { text: 'TotalEnergies', highlight: true },
        { text: ', ' },
        { text: 'France Télévisions', highlight: true },
        { text: ', ' },
        { text: 'AFP', highlight: true },
        { text: ', ' },
        { text: 'TV5Monde', highlight: true },
        { text: ', ' },
        { text: 'Harmonie Mutuelle', highlight: true },
        { text: ', ou encore des maisons ' },
        { text: 'LVMH', highlight: true },
        { text: ' (Krug, Moët, Hennessy).' },
      ] satisfies BioSegment[],
      bio2: [
        { text: 'Mon parcours couvre le web dans sa globalité — du ' },
        { text: 'Drupal', highlight: true },
        { text: ' et ' },
        { text: 'Symfony', highlight: true },
        { text: ' au ' },
        { text: 'React / Next.js', highlight: true },
        { text: ', en passant par du ' },
        { text: 'React Native', highlight: true },
        { text: ' (apps Asmodee &amp; Crédit Agricole), du ' },
        { text: 'Shopify', highlight: true },
        { text: ' et des serveurs ' },
        { text: 'MCP', highlight: true },
        {
          text: " pour l'intégration IA. Formé à ",
        },
        { text: '42', highlight: true },
        {
          text: ', je mets la rigueur algorithmique au service de projets ambitieux.',
        },
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
          title: 'AI Code Reviewer',
          language: 'Gradio / MCP',
          url: 'https://huggingface.co/spaces/ImTamsi/ai-code-reviewer',
          source: 'huggingface',
          description:
            "Démo Gradio en ligne pour analyser un dépôt GitHub (revue de code, bugs, dette technique, sécurité, performance, tests manquants) via Qwen3.6-27B — serveur MCP et modèle sur GitHub / le Hub.",
        },
        {
          title: 'redbee-mcp',
          language: 'Python',
          url: 'https://github.com/Tamsi/redbee-mcp',
          source: 'github',
          description:
            "Serveur MCP pour Red Bee Media OTT — permet aux assistants IA d'interagir avec les API de la plateforme de streaming via le Model Context Protocol.",
        },
        {
          title: 'VisualQ',
          language: 'Next.js / TypeScript',
          url: 'https://github.com/abecms/visualq',
          source: 'github',
          description:
            "Plateforme de tests de régression visuelle propulsée par l'IA — compare des captures d'écran avec Pixelmatch, intègre GitLab CI & JIRA, et utilise OpenAI Vision pour l'analyse intelligente des différences.",
        },
        {
          title: 'ScoreJamAi',
          language: 'Next.js / TypeScript',
          url: 'https://github.com/abecms/ScoreJamAi',
          source: 'github',
          description:
            "Générateur de formulaires propulsé par l'IA — créez des formulaires de notation personnalisés, publiez-les pour vos utilisateurs et laissez l'IA évaluer les réponses avec des analyses détaillées.",
        },
        {
          title: 'pin_article',
          language: 'PHP',
          url: 'https://github.com/Tamsi/pin_article',
          source: 'github',
          description:
            "Module Drupal 8 — permet aux éditeurs de contenu d'épingler et de désépingler des articles en haut des pages de listing.",
        },
        {
          title: 'piscine-42',
          language: 'C',
          url: 'https://github.com/Tamsi/piscine-42',
          source: 'github',
          description:
            'Collection de projets de la piscine 42 — exercices de programmation C de shell00 à c09, couvrant les algorithmes et la programmation système.',
        },
      ] satisfies ProjectItem[],
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
      bio1: [
        { text: 'Web developer with ' },
        { text: '~8 years of experience', highlight: true },
        { text: ' at ' },
        { text: 'Livingcolor', highlight: true },
        {
          text: ', working as a contractor on diverse projects for major clients: ',
        },
        { text: 'TotalEnergies', highlight: true },
        { text: ', ' },
        { text: 'France Télévisions', highlight: true },
        { text: ', ' },
        { text: 'AFP', highlight: true },
        { text: ', ' },
        { text: 'TV5Monde', highlight: true },
        { text: ', ' },
        { text: 'Harmonie Mutuelle', highlight: true },
        { text: ', and ' },
        { text: 'LVMH', highlight: true },
        { text: ' houses (Krug, Moët, Hennessy).' },
      ] satisfies BioSegment[],
      bio2: [
        { text: 'My background covers the full web spectrum — from ' },
        { text: 'Drupal', highlight: true },
        { text: ' and ' },
        { text: 'Symfony', highlight: true },
        { text: ' to ' },
        { text: 'React / Next.js', highlight: true },
        { text: ', including ' },
        { text: 'React Native', highlight: true },
        { text: ' (Asmodee &amp; Crédit Agricole apps), ' },
        { text: 'Shopify', highlight: true },
        { text: ', and ' },
        { text: 'MCP', highlight: true },
        { text: ' servers for AI integration. Trained at ' },
        { text: '42', highlight: true },
        { text: ', I bring algorithmic rigor to ambitious projects.' },
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
          title: 'AI Code Reviewer',
          language: 'Gradio / MCP',
          url: 'https://huggingface.co/spaces/ImTamsi/ai-code-reviewer',
          source: 'huggingface',
          description:
            'Live Gradio demo to analyze a GitHub repo (code review, bugs, tech debt, security, performance, missing tests) via Qwen3.6-27B — MCP server and model on GitHub / the Hub.',
        },
        {
          title: 'redbee-mcp',
          language: 'Python',
          url: 'https://github.com/Tamsi/redbee-mcp',
          source: 'github',
          description:
            'MCP Server for Red Bee Media OTT — lets AI assistants interact with streaming platform APIs via Model Context Protocol.',
        },
        {
          title: 'VisualQ',
          language: 'Next.js / TypeScript',
          url: 'https://github.com/abecms/visualq',
          source: 'github',
          description:
            'Visual regression testing platform powered by AI — compares screenshots with Pixelmatch, integrates GitLab CI & JIRA, and uses OpenAI Vision for intelligent diff analysis.',
        },
        {
          title: 'ScoreJamAi',
          language: 'Next.js / TypeScript',
          url: 'https://github.com/abecms/ScoreJamAi',
          source: 'github',
          description:
            'AI-powered form builder — create custom scoring forms, publish them for your users, and let AI grade the responses with detailed analytics.',
        },
        {
          title: 'pin_article',
          language: 'PHP',
          url: 'https://github.com/Tamsi/pin_article',
          source: 'github',
          description:
            'Drupal 8 module — allows content editors to pin and unpin articles to the top of listing pages.',
        },
        {
          title: 'piscine-42',
          language: 'C',
          url: 'https://github.com/Tamsi/piscine-42',
          source: 'github',
          description:
            'Collection of 42 piscine projects — C programming exercises from shell00 to c09, covering algorithms and system programming.',
        },
      ] satisfies ProjectItem[],
    },
    contact: {
      title: 'Contact',
      subtitle: 'Want to collaborate or just chat? Feel free to reach out.',
      copyright: '© {year} Tamsi Besson. Built with Next.js & Tailwind CSS.',
    },
  },
} as const

export type Dictionary = (typeof dictionaries)[Locale]
