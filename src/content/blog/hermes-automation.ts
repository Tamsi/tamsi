import type { BlogPost } from './types'

const BENCH_CHART = '/blog/cursorbench-fable5-cost.png'

export const hermesAutomation: BlogPost = {
  slug: 'hermes-automation-cheaper-models',
  publishedAt: '2026-06-09',
  tags: ['Hermes', 'Cursor', 'Coût', 'Automation'],
  readingTimeMinutes: 4,
  content: {
    fr: {
      title: 'Pourquoi je passe sur Hermes — automatiser avec des modèles moins chers',
      description:
        'Fable 5 vient de sortir et flambe sur le benchmark Cursor : je déporte l’agentique vers Hermes et des modèles abordables.',
      blocks: [
        {
          type: 'paragraph',
          text: 'J’aime Cursor comme IDE. En revanche, la facture agentique devient difficile à défendre : chaque session longue, chaque refactor, chaque boucle MCP coûte cher — surtout quand Anthropic sort Fable 5 et que Cursor le met en avant comme modèle par défaut haut de gamme.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Fable 5 : très bon, très cher',
        },
        {
          type: 'paragraph',
          text: 'Le graphique CursorBench 3.1 est parlant : Fable 5 high (default) est en haut à gauche — meilleur score (~71 %), mais autour de 12 $ par tâche. Composer 2.5 ou GPT-5.5 medium font ~60 % pour 1 à 3 $. Sur une journée de dev, la différence n’est pas théorique.',
        },
        {
          type: 'image',
          src: BENCH_CHART,
          alt: 'CursorBench 3.1 : score vs coût par tâche — Fable 5 high en haut à gauche, modèles moins chers à droite',
          caption: 'CursorBench 3.1 — performance vs coût moyen par tâche (axe X inversé : moins cher à droite).',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Pourquoi Hermes entre dans la boucle',
        },
        {
          type: 'paragraph',
          text: 'Hermes Agent (Nous Research) n’est pas un remplacement de Cursor — c’est la couche qui automatise en dehors de l’IDE : skills persistantes, mémoire, webhooks, tâches récurrentes. Je l’utilise pour ce qui doit tourner sans cliquer « Continue » toutes les deux minutes, branché sur des modèles que je contrôle (Qwen en vLLM sur AWS, Ollama en local) plutôt que sur Fable 5 à chaque prompt.',
        },
        {
          type: 'list',
          items: [
            'Tâches répétitives (veille repo, checks API, scripts de validation) → Hermes + petit modèle.',
            'Sessions agent lourdes dans Cursor → mon endpoint Qwen, pas le modèle premium intégré.',
            'MCP pour le métier (redbee, code review) → même stack OpenAI-compatible, coût GPU fixe.',
            'Hermes pour enchaîner plusieurs outils sans payer la taxe « modèle flagship » à chaque étape.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'En pratique',
        },
        {
          type: 'paragraph',
          text: 'Cursor reste mon éditeur. Hermes prend les workflows qui doivent vivre plus longtemps qu’un chat : pipelines, rappels, intégrations Firebase/Slack, skills apprises une fois et réutilisées. Le déclencheur aujourd’hui, c’est Fable 5 : excellent benchmark, prix qui pousse à sortir l’intelligence agentique des modèles les plus chers du marketplace Cursor.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Bilan',
        },
        {
          type: 'paragraph',
          text: 'Ce n’est pas « anti-Cursor » ni « anti-Anthropic ». C’est : utiliser le bon modèle au bon endroit. Flagship dans Cursor pour un coup ponctuel si besoin ; Hermes + modèles cheap pour l’automatisation du quotidien. Mon portefeuille tokens remercie, et je garde la main sur la stack.',
        },
      ],
    },
    en: {
      title: 'Why I’m moving to Hermes — automate with cheaper models',
      description:
        'Fable 5 just landed and tops the Cursor benchmark at a steep price: I’m shifting agentic work to Hermes and affordable models.',
      blocks: [
        {
          type: 'paragraph',
          text: 'I like Cursor as an IDE. Agent billing is harder to justify: every long session, refactor, or MCP loop adds up — especially now that Anthropic shipped Fable 5 and Cursor pushes it as the default high-end model.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Fable 5: great scores, steep cost',
        },
        {
          type: 'paragraph',
          text: 'The CursorBench 3.1 chart says it all: Fable 5 high (default) sits top-left — best score (~71%), around $12 per task. Composer 2.5 or GPT-5.5 medium land near ~60% for $1–3. Over a full dev day, that gap is real money.',
        },
        {
          type: 'image',
          src: BENCH_CHART,
          alt: 'CursorBench 3.1: score vs cost per task — Fable 5 high top-left, cheaper models on the right',
          caption: 'CursorBench 3.1 — performance vs average cost per task (X axis reversed: cheaper to the right).',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Why Hermes joins the loop',
        },
        {
          type: 'paragraph',
          text: 'Hermes Agent (Nous Research) isn’t a Cursor replacement — it’s the layer that automates outside the IDE: persistent skills, memory, webhooks, recurring jobs. I use it for work that shouldn’t need a “Continue” click every two minutes, wired to models I control (Qwen on vLLM/AWS, Ollama locally) instead of Fable 5 on every prompt.',
        },
        {
          type: 'list',
          items: [
            'Repeat tasks (repo watch, API checks, validation scripts) → Hermes + smaller model.',
            'Heavy agent sessions in Cursor → my Qwen endpoint, not the built-in premium model.',
            'MCP for day job (redbee, code review) → same OpenAI-compatible stack, fixed GPU cost.',
            'Hermes to chain tools without paying the “flagship model” tax at every step.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'In practice',
        },
        {
          type: 'paragraph',
          text: 'Cursor stays my editor. Hermes owns workflows that outlive a chat: pipelines, reminders, Firebase/Slack hooks, skills learned once and reused. Today’s trigger is Fable 5: great benchmark, pricing that pushes agentic work off Cursor’s most expensive marketplace models.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Bottom line',
        },
        {
          type: 'paragraph',
          text: 'This isn’t “anti-Cursor” or “anti-Anthropic.” It’s using the right model in the right place. Flagship in Cursor for a one-off if needed; Hermes + cheap models for daily automation. My token budget is happier, and I keep control of the stack.',
        },
      ],
    },
  },
}
