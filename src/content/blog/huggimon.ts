import type { BlogPost } from './types'

export const huggimon: BlogPost = {
  slug: 'huggimon-ai-trainer-card',
  publishedAt: '2026-07-09',
  tags: ['Hugging Face', 'Next.js', 'Open source', 'Side project'],
  readingTimeMinutes: 5,
  content: {
    fr: {
      title: 'HuggiMon — ta carte de dresseur IA depuis ton profil Hugging Face',
      description:
        'Un site Next.js qui transforme l’activité publique du Hub en carte Pokémon TCG interactive — holo shaders, binder de followers, PNG et page partageable.',
      blocks: [
        {
          type: 'paragraph',
          text: 'Sur Hugging Face, ton profil public raconte déjà une histoire : les modèles que tu publies, les Spaces que tu maintiens, les datasets que tu partages, les likes et les téléchargements qui s’accumulent. **HuggiMon** ([huggimon.co](https://huggimon.co)) prend ces signaux — uniquement des données publiques — et les convertit en **carte de dresseur IA** façon Pokémon TCG : tilt 3D, shaders holo, binder de followers, page dédiée par username.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Pourquoi ce projet',
        },
        {
          type: 'paragraph',
          text: 'Le Hub est excellent pour héberger du ML, moins pour « montrer qui tu es » en un coup d’œil. Les README listent des repos ; les stats sont dispersées entre models, datasets et spaces. J’avais envie d’un résumé ludique — pas un leaderboard sérieux, mais une carte que tu peux ouvrir sur `huggimon.co/ton-username`, partager sur X, ou coller dans ton README Hub.',
        },
        {
          type: 'list',
          items: [
            'Zéro auth : un username suffit, tout est lu via l’API publique Hugging Face.',
            'Carte interactive avec 14 paliers holo selon ton niveau HF.',
            'Binder 3×3 : tes followers deviennent des mini-cartes à feuilleter.',
            'PNG téléchargeable + snippet Markdown pour ton README.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Comment ça marche',
        },
        {
          type: 'paragraph',
          text: 'Le flux est linéaire : fetch → score → render. Tu ouvres `/{username}` ; HuggiMon récupère l’overview utilisateur et les repos publics (modèles, datasets, spaces). Un module de scoring calcule six stats (0–100), déduit un type, une rareté, un niveau, des attaques et une énergie (basée sur les likes). Le rendu côté client repose sur les shaders holo de [pokemon-cards-css](https://github.com/simeydotme/pokemon-cards-css) ; le serveur compose le visage de la carte en PNG 660×921.',
        },
        {
          type: 'code',
          language: 'text',
          code: `/{username} → hf-fetcher → scoring → PokemonCard (holo + tilt)
                      ↳ /api/card/{username}/face → PNG partageable`,
        },
        {
          type: 'heading',
          level: 3,
          text: 'Les six stats',
        },
        {
          type: 'list',
          items: [
            '**MODEL** — modèles publiés, likes et downloads.',
            '**DATA** — datasets et leur traction.',
            '**SPACE** — Spaces publiés et likes associés.',
            '**IMPACT** — likes + downloads agrégés sur tout le travail public.',
            '**COMMUNITY** — followers et discussions.',
            '**DOCS** — part des repos avec une description.',
          ],
        },
        {
          type: 'heading',
          level: 3,
          text: 'Holo, énergie et binder',
        },
        {
          type: 'paragraph',
          text: 'Ton niveau HF détermine un **palier holo** parmi 14 (reverse holo → Secret Gold). Les likes sur ton travail deviennent des **énergies** sur la carte. Tes **followers** remplissent un binder paginé 3×3 avec animation de feuilletage — clique sur une mini-carte pour l’inspecter en grand.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Partager et intégrer',
        },
        {
          type: 'paragraph',
          text: 'Chaque profil a une URL publique et un snippet README prêt à coller :',
        },
        {
          type: 'code',
          language: 'markdown',
          code: `[![HuggiMon](https://huggimon.co/api/card/ImTamsi/face)](https://huggimon.co/ImTamsi)`,
        },
        {
          type: 'list',
          items: [
            '`GET /{username}` — page profil (carte + binder + partage).',
            '`GET /api/card/{username}` — métadonnées JSON (stats, type, rareté, énergie).',
            '`GET /api/card/{username}/face` — PNG composé 660×921.',
            '`GET /api/binder/{username}` — page binder des followers (`?page=` optionnel).',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Stack technique',
        },
        {
          type: 'list',
          items: [
            '**Next.js** — app dans `web/`, déployée sur Vercel ([huggimon.co](https://huggimon.co)).',
            '**pokemon-cards-css** — effets holo 3D (tilt, glare, shaders par rareté), port React via `@react-spring/web`.',
            '**gitfut** — inspiration pour le pattern `/{username}` et l’embed README (appliqué au Hub HF plutôt qu’à GitHub).',
            '**MIT** — code ouvert sur [github.com/Tamsi/huggimon](https://github.com/Tamsi/huggimon).',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Essayer',
        },
        {
          type: 'paragraph',
          text: 'Va sur [huggimon.co](https://huggimon.co), entre un @username HF, ou ouvre directement [huggimon.co/ImTamsi](https://huggimon.co/ImTamsi). C’est un side project du Build Small Hackathon : fun d’abord, mais le scoring est transparent — le repo est sur GitHub si tu veux challenger la formule ou contribuer.',
        },
        {
          type: 'list',
          items: [
            'Site : huggimon.co',
            'Repo : github.com/Tamsi/huggimon',
          ],
        },
      ],
    },
    en: {
      title: 'HuggiMon — your AI trainer card from your Hugging Face profile',
      description:
        'A Next.js site that turns public Hub activity into an interactive Pokémon TCG card — holo shaders, follower binder, PNG export, and a shareable profile page.',
      blocks: [
        {
          type: 'paragraph',
          text: 'On Hugging Face, your public profile already tells a story: models you ship, Spaces you maintain, datasets you share, likes and downloads that add up. **HuggiMon** ([huggimon.co](https://huggimon.co)) takes those signals — public data only — and turns them into a **Pokémon TCG-style trainer card**: 3D tilt, holo shaders, a follower binder, and a dedicated page per username.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Why I built it',
        },
        {
          type: 'paragraph',
          text: 'The Hub is great at hosting ML, less at showing “who you are” at a glance. READMEs list repos; stats are split across models, datasets, and spaces. I wanted a playful summary — not a serious leaderboard, but a card you can open at `huggimon.co/your-username`, share on X, or drop in your Hub README.',
        },
        {
          type: 'list',
          items: [
            'No auth: a username is enough; everything is read via the public Hugging Face API.',
            'Interactive card with 14 holo tiers based on your HF level.',
            '3×3 binder: your followers become mini-cards to flip through.',
            'Downloadable PNG + Markdown snippet for your README.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'How it works',
        },
        {
          type: 'paragraph',
          text: 'The flow is linear: fetch → score → render. You open `/{username}`; HuggiMon pulls the user overview and public repos (models, datasets, spaces). A scoring module computes six stats (0–100), infers type, rarity, level, attacks, and energy (from likes). Client rendering uses [pokemon-cards-css](https://github.com/simeydotme/pokemon-cards-css) holo shaders; the server composes the card face as a 660×921 PNG.',
        },
        {
          type: 'code',
          language: 'text',
          code: `/{username} → hf-fetcher → scoring → PokemonCard (holo + tilt)
                      ↳ /api/card/{username}/face → shareable PNG`,
        },
        {
          type: 'heading',
          level: 3,
          text: 'The six stats',
        },
        {
          type: 'list',
          items: [
            '**MODEL** — published models, likes, and downloads.',
            '**DATA** — datasets and their traction.',
            '**SPACE** — published Spaces and associated likes.',
            '**IMPACT** — aggregate likes + downloads across public work.',
            '**COMMUNITY** — followers and discussions.',
            '**DOCS** — share of repos with a description.',
          ],
        },
        {
          type: 'heading',
          level: 3,
          text: 'Holo, energy, and binder',
        },
        {
          type: 'paragraph',
          text: 'Your HF level picks a **holo tier** among 14 (reverse holo → Secret Gold). Likes on your work become **energy** on the card. Your **followers** fill a paginated 3×3 binder with a page-flip animation — click any mini-card to inspect it enlarged.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Share and embed',
        },
        {
          type: 'paragraph',
          text: 'Each profile has a public URL and a ready-to-paste README snippet:',
        },
        {
          type: 'code',
          language: 'markdown',
          code: `[![HuggiMon](https://huggimon.co/api/card/ImTamsi/face)](https://huggimon.co/ImTamsi)`,
        },
        {
          type: 'list',
          items: [
            '`GET /{username}` — profile page (card + binder + share).',
            '`GET /api/card/{username}` — JSON metadata (stats, type, rarity, energy).',
            '`GET /api/card/{username}/face` — composed 660×921 PNG.',
            '`GET /api/binder/{username}` — follower binder page (`?page=` optional).',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Tech stack',
        },
        {
          type: 'list',
          items: [
            '**Next.js** — app in `web/`, deployed on Vercel ([huggimon.co](https://huggimon.co)).',
            '**pokemon-cards-css** — 3D holo effects (tilt, glare, rarity shaders), React port via `@react-spring/web`.',
            '**gitfut** — inspiration for the `/{username}` pattern and README embed (applied to the HF Hub instead of GitHub).',
            '**MIT** — open source at [github.com/Tamsi/huggimon](https://github.com/Tamsi/huggimon).',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Try it',
        },
        {
          type: 'paragraph',
          text: 'Go to [huggimon.co](https://huggimon.co), enter an HF @username, or open [huggimon.co/ImTamsi](https://huggimon.co/ImTamsi) directly. It’s a Build Small Hackathon side project: fun first, but scoring is transparent — the repo is on GitHub if you want to challenge the formula or contribute.',
        },
        {
          type: 'list',
          items: [
            'Site: huggimon.co',
            'Repo: github.com/Tamsi/huggimon',
          ],
        },
      ],
    },
  },
}
