import type { BlogPost } from './types'

export const huggimon: BlogPost = {
  slug: 'huggimon-ai-trainer-card',
  publishedAt: '2026-07-09',
  tags: ['Hugging Face', 'Gradio', 'Open source', 'Side project'],
  readingTimeMinutes: 5,
  content: {
    fr: {
      title: 'HuggiMon — ta carte de dresseur IA depuis ton profil Hugging Face',
      description:
        'Un Space Gradio qui transforme l’activité publique du Hub (modèles, datasets, spaces, likes, followers) en carte collectible partageable — stats, type, rareté et attaques inclus.',
      blocks: [
        {
          type: 'paragraph',
          text: 'Sur Hugging Face, ton profil public raconte déjà une histoire : les modèles que tu publies, les Spaces que tu maintiens, les datasets que tu partages, les likes et les téléchargements qui s’accumulent. HuggiMon prend ces signaux — uniquement des données publiques — et les convertit en **carte de dresseur IA** : un objet visuel, partageable, un peu Pokémon, un peu GitHub README flair.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Pourquoi ce projet',
        },
        {
          type: 'paragraph',
          text: 'Le Hub est excellent pour héberger du ML, moins pour « montrer qui tu es » en un coup d’œil. Les README listent des repos ; les stats sont dispersées entre models, datasets et spaces. J’avais envie d’un résumé ludique — pas un leaderboard sérieux, mais une carte que tu peux coller dans ton README, comparer avec un collègue, ou envoyer sur X sans exporter dix captures d’écran.',
        },
        {
          type: 'list',
          items: [
            'Zéro auth : un username suffit, tout est lu via l’API publique `huggingface_hub`.',
            'PNG téléchargeable + snippet Markdown prêt à coller.',
            'Mode comparaison : deux profils, deux cartes côte à côte.',
            'Endpoints HTTP pour intégrer la carte ailleurs (README, site, bot).',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Comment ça marche',
        },
        {
          type: 'paragraph',
          text: 'Le flux est volontairement linéaire : fetch → score → render. Tu entres un username ; HuggiMon récupère l’overview utilisateur et jusqu’à 200 modèles, datasets et spaces publics. Un module de scoring calcule six stats (0–100), déduit un type, une rareté, un niveau, des attaques et un chemin d’évolution. Le rendu passe par du HTML (preview Gradio) et Pillow (export PNG).',
        },
        {
          type: 'code',
          language: 'text',
          code: `username → fetch_hf_profile() → build_card() → render_card_html() / render_png()
                ↳ HfApi: get_user_overview, list_models, list_datasets, list_spaces`,
        },
        {
          type: 'heading',
          level: 3,
          text: 'Les six stats',
        },
        {
          type: 'list',
          items: [
            '**MODEL** — modèles publiés, likes et downloads (échelle logarithmique pour l’impact).',
            '**DATA** — datasets et leur traction.',
            '**SPACE** — Spaces publiés et likes associés.',
            '**IMPACT** — likes + downloads agrégés sur tout le travail public.',
            '**COMMUNITY** — followers et discussions.',
            '**DOCS** — part des repos avec une description (qualité perçue des cards Hub).',
          ],
        },
        {
          type: 'heading',
          level: 3,
          text: 'Type, rareté et moves',
        },
        {
          type: 'paragraph',
          text: 'Le **type** (`Code`, `Vision`, `Audio`, `NLP`, `Multimodal`, `Agent`, `Dataset`) vient du tagging des repos : on compte les mots-clés dans les tags HF. Si tu publies surtout des datasets, tu bascules en type Dataset. La **rareté** suit la moyenne des stats : Common &lt; 55, Rare ≥ 55, Epic ≥ 75, Legendary ≥ 90. Les **attaques** (`Fine-tune Blast`, `Dataset Tsunami`, `Space Storm`, etc.) et le **passif** (`Token Mastery`, `Toolformer Soul`…) dépendent du type et des stats dominantes.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Styles de carte',
        },
        {
          type: 'paragraph',
          text: 'Six thèmes visuels au choix : Starter (propre et accessible), Legendary (or et impact), Dark Mode (néon sur noir), Researcher (labo et papers), Builder (code et outils), Esport (arène et vitesse). Même données, habillage différent — utile pour matcher ton README ou ton mood du moment.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Partager et intégrer',
        },
        {
          type: 'paragraph',
          text: 'Chaque génération produit une URL d’image stable et un snippet Markdown. Tu peux aussi appeler l’API directement :',
        },
        {
          type: 'code',
          language: 'markdown',
          code: `[![HuggiMon](https://imtamsi-huggimon.hf.space/api/card/ImTamsi.png)](https://huggingface.co/spaces/ImTamsi/huggimon)`,
        },
        {
          type: 'list',
          items: [
            '`GET /api/card/{username}` — métadonnées JSON (stats, type, rareté, attaques).',
            '`GET /api/card/{username}.png?style=Legendary` — image PNG (cache 5 min).',
            '`/card/{username}` — page dédiée avec preview plein écran.',
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
            '**Gradio 6** — UI (génération + comparaison) montée sur un `gr.Server` FastAPI.',
            '**huggingface_hub** — lecture seule du profil public.',
            '**Pillow** — rasterisation de la carte en PNG.',
            '**MIT** — fork, self-host ou contribution bienvenues.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Essayer',
        },
        {
          type: 'paragraph',
          text: 'Le Space tourne sur Hugging Face — entre ton username, choisis un style, télécharge le PNG ou copie le snippet. Si le Space dort (inactivité HF), un clic « Restart » le réveille. C’est un side project du Build Small Hackathon : fun d’abord, mais le scoring est transparent et rejouable — ouvre `scoring.py` si tu veux challenger la formule.',
        },
        {
          type: 'list',
          items: [
            'Space : huggingface.co/spaces/ImTamsi/huggimon',
            'Repo : github.com/Tamsi/huggimon (si publié) ou fichiers du Space',
          ],
        },
      ],
    },
    en: {
      title: 'HuggiMon — your AI trainer card from your Hugging Face profile',
      description:
        'A Gradio Space that turns public Hub activity (models, datasets, spaces, likes, followers) into a shareable collectible card — stats, type, rarity, and moves included.',
      blocks: [
        {
          type: 'paragraph',
          text: 'On Hugging Face, your public profile already tells a story: models you ship, Spaces you maintain, datasets you share, likes and downloads that add up. HuggiMon takes those signals — public data only — and turns them into an **AI trainer card**: a visual, shareable object, part Pokémon, part GitHub README flair.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Why I built it',
        },
        {
          type: 'paragraph',
          text: 'The Hub is great at hosting ML, less at showing “who you are” at a glance. READMEs list repos; stats are split across models, datasets, and spaces. I wanted a playful summary — not a serious leaderboard, but a card you can drop in your README, compare with a colleague, or post on X without stitching ten screenshots.',
        },
        {
          type: 'list',
          items: [
            'No auth: a username is enough; everything is read via the public `huggingface_hub` API.',
            'Downloadable PNG + ready-to-paste Markdown snippet.',
            'Compare mode: two profiles, two cards side by side.',
            'HTTP endpoints to embed the card elsewhere (README, site, bot).',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'How it works',
        },
        {
          type: 'paragraph',
          text: 'The flow is deliberately linear: fetch → score → render. You enter a username; HuggiMon pulls the user overview and up to 200 public models, datasets, and spaces. A scoring module computes six stats (0–100), infers type, rarity, level, attacks, and an evolution path. Rendering goes through HTML (Gradio preview) and Pillow (PNG export).',
        },
        {
          type: 'code',
          language: 'text',
          code: `username → fetch_hf_profile() → build_card() → render_card_html() / render_png()
                ↳ HfApi: get_user_overview, list_models, list_datasets, list_spaces`,
        },
        {
          type: 'heading',
          level: 3,
          text: 'The six stats',
        },
        {
          type: 'list',
          items: [
            '**MODEL** — published models, likes, and downloads (log scale for impact).',
            '**DATA** — datasets and their traction.',
            '**SPACE** — published Spaces and associated likes.',
            '**IMPACT** — aggregate likes + downloads across public work.',
            '**COMMUNITY** — followers and discussions.',
            '**DOCS** — share of repos with a description (perceived Hub card quality).',
          ],
        },
        {
          type: 'heading',
          level: 3,
          text: 'Type, rarity, and moves',
        },
        {
          type: 'paragraph',
          text: '**Type** (`Code`, `Vision`, `Audio`, `NLP`, `Multimodal`, `Agent`, `Dataset`) comes from repo tags: keyword hits across HF tags. If you mostly publish datasets, you flip to Dataset type. **Rarity** follows the stat average: Common &lt; 55, Rare ≥ 55, Epic ≥ 75, Legendary ≥ 90. **Attacks** (`Fine-tune Blast`, `Dataset Tsunami`, `Space Storm`, etc.) and **passive** (`Token Mastery`, `Toolformer Soul`…) depend on type and dominant stats.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Card styles',
        },
        {
          type: 'paragraph',
          text: 'Six visual themes: Starter (clean and accessible), Legendary (gold and impact), Dark Mode (neon on black), Researcher (lab and papers), Builder (code and tools), Esport (arena and speed). Same data, different skin — handy to match your README or current vibe.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Share and embed',
        },
        {
          type: 'paragraph',
          text: 'Each generation yields a stable image URL and a Markdown snippet. You can also hit the API directly:',
        },
        {
          type: 'code',
          language: 'markdown',
          code: `[![HuggiMon](https://imtamsi-huggimon.hf.space/api/card/ImTamsi.png)](https://huggingface.co/spaces/ImTamsi/huggimon)`,
        },
        {
          type: 'list',
          items: [
            '`GET /api/card/{username}` — JSON metadata (stats, type, rarity, attacks).',
            '`GET /api/card/{username}.png?style=Legendary` — PNG image (5 min cache).',
            '`/card/{username}` — dedicated full-screen preview page.',
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
            '**Gradio 6** — UI (generate + compare) on a FastAPI `gr.Server`.',
            '**huggingface_hub** — read-only public profile access.',
            '**Pillow** — card rasterization to PNG.',
            '**MIT** — fork, self-host, or contribute welcome.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Try it',
        },
        {
          type: 'paragraph',
          text: 'The Space runs on Hugging Face — enter your username, pick a style, download the PNG or copy the snippet. If the Space is sleeping (HF inactivity), hit Restart to wake it. It’s a Build Small Hackathon side project: fun first, but scoring is transparent and replayable — open `scoring.py` if you want to challenge the formula.',
        },
        {
          type: 'list',
          items: [
            'Space: huggingface.co/spaces/ImTamsi/huggimon',
            'Source: Space files on the Hub',
          ],
        },
      ],
    },
  },
}
