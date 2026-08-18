import type { BlogPost } from './types'

const COVER = '/blog/qwen-3-8-27b-tetris-mlx.jpg'
const X_POST = 'https://x.com/tamsi_besson/status/2089656034449080484'

export const qwen38: BlogPost = {
  slug: 'qwen-3-8-27b-local-mlx',
  publishedAt: '2026-08-18',
  tags: ['Qwen', 'Unsloth', 'MLX', 'Local LLM', 'Apple Silicon'],
  readingTimeMinutes: 5,
  content: {
    fr: {
      title: 'Qwen 3.8 27B en local — Tetris à 11 tok/s sur un Mac M1',
      description:
        'Qwen3.8-27B en MLX 4-bit dans Unsloth Studio, sur un MacBook M1 32 Go : un Tetris jouable à ~11 tokens/s, sans GPU cloud.',
      blocks: [
        {
          type: 'paragraph',
          text: 'En juin j’avais monté un Qwen 3.6 27B en vLLM sur AWS pour arrêter de payer les tokens Cursor. Qwen 3.8 27B, sorti en août, change la donne d’un autre côté : le même gabarit 27B tient sur le laptop. J’ai lancé le checkpoint MLX 4-bit dans Unsloth Studio, sur un MacBook M1 32 Go, et demandé un Tetris. Résultat : ~11 tok/s, un jeu vraiment jouable, zéro GPU cloud.',
        },
        {
          type: 'image',
          src: COVER,
          alt: 'Unsloth Studio : Qwen 3.8 27B génère un Tetris HTML, preview à droite, 10.5 tok/s',
          caption:
            'Unsloth Studio — Tetris servi en local (hold, next, ghost piece). 10,5 tok/s en bas du message.',
          link: {
            href: X_POST,
            label: 'Le test sur X →',
          },
        },
        {
          type: 'heading',
          level: 2,
          text: 'Ce que 3.8 change par rapport à 3.6',
        },
        {
          type: 'paragraph',
          text: 'Qwen3.8-27B (Apache 2.0) est un dense multimodal : texte + images + vidéo, 262k de contexte natif (extensible à 1M via YaRN), attention hybride (Gated DeltaNet + Gated Attention). C’est le petit frère dense de la génération 3.8, pensé pour tourner chez toi plutôt que derrière une API.',
        },
        {
          type: 'list',
          items: [
            'Même classe 27B que mon serveur AWS, mais servi en local via MLX 4-bit.',
            'Unsloth publie des quants dynamiques / MLX dès le jour 0 — c’est ce que Studio charge.',
            'vLLM 0.17+ le sert aussi (FP8, NVFP4) si je veux le coller sur l’instance 48 Go à la place du 3.6.',
            'Multimodal natif : utile pour des diffs, des captures, pas seulement du texte.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Le test : un Tetris, pas un hello-world',
        },
        {
          type: 'paragraph',
          text: 'Le prompt n’était pas « écris une fonction add ». Studio a généré une page HTML, l’a servie sur `http://127.0.0.1:8642/tetris.html`, et ouvert la preview à côté du chat. Le jeu a un hold, une pièce suivante, un ghost, un score, un niveau, et les contrôles classiques (←/→, rotation, soft/hard drop, C, P). Ce n’est pas un proto cassé : on peut y jouer.',
        },
        {
          type: 'list',
          items: [
            'Machine : MacBook M1, 32 Go de RAM.',
            'Runtime : Unsloth Studio, Qwen3.8-27B, MLX 4-bit.',
            'Débit : ~11 tok/s (10,5 affichés sous la réponse).',
            'Livrable : Tetris HTML local, pas un gist théorique.',
          ],
        },
        {
          type: 'paragraph',
          text: '11 tok/s, ce n’est pas du streaming cloud. C’est assez pour une session de proto : tu vois le code arriver, tu relances, tu corriges. Sur un 27B en 4-bit, sur une puce 2020, je m’attendais à plus de galère. Ça tient.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Laptop vs serveur : qui fait quoi',
        },
        {
          type: 'paragraph',
          text: 'Je ne jette pas l’instance AWS. Le 3.6 en vLLM reste le cerveau lourd : gros diffs, plusieurs MCP en parallèle, sessions agent qui durent. Le 3.8 en MLX, c’est l’atelier sur les genoux — Unsloth Studio, un modèle chargé, un brief, un livrable. Même philosophie que l’article Studio : le cloud pour le débit, le local pour le contrôle.',
        },
        {
          type: 'list',
          items: [
            'AWS / vLLM / 3.6 (et bientôt 3.8 FP8 si je swap) — Cursor + MCP, tokens « gratuits » à l’heure GPU.',
            'M1 / Unsloth Studio / 3.8 MLX 4-bit — essais, UI, petits jeux, lecture de captures.',
            'Ollama — git-mentor et le chemin offline court.',
          ],
        },
        {
          type: 'heading',
          level: 3,
          text: 'Si je le sers comme le 3.6',
        },
        {
          type: 'paragraph',
          text: 'Le checkpoint officiel se lance en vLLM (0.17+, transformers ≥ 5.8). Sur une 48 Go, FP8 est le palier raisonnable ; BF16 demande plutôt 80 Go. Recette minimale :',
        },
        {
          type: 'code',
          language: 'bash',
          code: `vllm serve Qwen/Qwen3.8-27B \\
  --max-model-len 262144

# Laptop (ce que j’ai réellement testé)
# Unsloth Studio → charger Qwen3.8-27B MLX 4-bit
# → http://127.0.0.1:8888`,
        },
        {
          type: 'heading',
          level: 2,
          text: 'Bilan',
        },
        {
          type: 'paragraph',
          text: 'Le 3.6 m’avait convaincu de self-hoster. Le 3.8 me convainc que le 27B n’est plus réservé à la carte cloud : un M1 32 Go + MLX 4-bit + Studio suffit pour un vrai livrable. Tetris n’est pas un benchmark, c’est un test de « est-ce que je peux m’en servir ». Oui.',
        },
        {
          type: 'list',
          items: [
            'Test X : x.com/tamsi_besson/status/2089656034449080484',
            'Poids : huggingface.co/Qwen/Qwen3.8-27B',
            'Studio : /blog/unsloth-studio',
            'Serveur 3.6 : /blog/qwen-3-6-27b-remote-server',
          ],
        },
      ],
    },
    en: {
      title: 'Qwen 3.8 27B locally — Tetris at 11 tok/s on an M1 Mac',
      description:
        'Qwen3.8-27B in MLX 4-bit inside Unsloth Studio, on a 32 GB M1 MacBook: a playable Tetris at ~11 tokens/s, no cloud GPU.',
      blocks: [
        {
          type: 'paragraph',
          text: 'In June I stood up Qwen 3.6 27B on vLLM/AWS to stop paying Cursor tokens. Qwen 3.8 27B, released in August, flips another switch: the same 27B class now fits on the laptop. I loaded the MLX 4-bit checkpoint in Unsloth Studio on a 32 GB M1 MacBook and asked for Tetris. Result: ~11 tok/s, a game you can actually play, zero cloud GPU.',
        },
        {
          type: 'image',
          src: COVER,
          alt: 'Unsloth Studio: Qwen 3.8 27B generates an HTML Tetris, preview on the right, 10.5 tok/s',
          caption:
            'Unsloth Studio — Tetris served locally (hold, next, ghost piece). 10.5 tok/s under the reply.',
          link: {
            href: X_POST,
            label: 'The test on X →',
          },
        },
        {
          type: 'heading',
          level: 2,
          text: 'What 3.8 changes versus 3.6',
        },
        {
          type: 'paragraph',
          text: 'Qwen3.8-27B (Apache 2.0) is a dense multimodal model: text + images + video, 262k native context (extendable to 1M via YaRN), hybrid attention (Gated DeltaNet + Gated Attention). It’s the dense little sibling of the 3.8 generation, built to run on your machine instead of behind an API.',
        },
        {
          type: 'list',
          items: [
            'Same 27B class as my AWS box, served locally via MLX 4-bit.',
            'Unsloth ships dynamic / MLX quants on day zero — that’s what Studio loads.',
            'vLLM 0.17+ serves it too (FP8, NVFP4) if I swap it onto the 48 GB instance instead of 3.6.',
            'Native multimodal: useful for diffs and screenshots, not just text.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'The test: Tetris, not hello-world',
        },
        {
          type: 'paragraph',
          text: 'The prompt wasn’t “write an add function.” Studio generated an HTML page, served it at `http://127.0.0.1:8642/tetris.html`, and opened the preview next to the chat. The game has hold, next piece, ghost, score, level, and the usual controls (←/→, rotate, soft/hard drop, C, P). Not a broken prototype: you can play it.',
        },
        {
          type: 'list',
          items: [
            'Machine: M1 MacBook, 32 GB RAM.',
            'Runtime: Unsloth Studio, Qwen3.8-27B, MLX 4-bit.',
            'Throughput: ~11 tok/s (10.5 shown under the reply).',
            'Deliverable: local HTML Tetris, not a theoretical gist.',
          ],
        },
        {
          type: 'paragraph',
          text: '11 tok/s isn’t cloud streaming. It’s enough for a proto session: you watch the code land, rerun, fix. On a 4-bit 27B, on a 2020 chip, I expected more pain. It holds.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Laptop vs server: who does what',
        },
        {
          type: 'paragraph',
          text: 'I’m not killing the AWS instance. 3.6 on vLLM stays the heavy brain: large diffs, several MCP clients in parallel, long agent sessions. 3.8 on MLX is the lap workshop — Unsloth Studio, one loaded model, a brief, a deliverable. Same split as the Studio post: cloud for throughput, local for control.',
        },
        {
          type: 'list',
          items: [
            'AWS / vLLM / 3.6 (and 3.8 FP8 if I swap) — Cursor + MCP, “free” tokens billed as GPU hours.',
            'M1 / Unsloth Studio / 3.8 MLX 4-bit — trials, UI, small games, reading screenshots.',
            'Ollama — git-mentor and the short offline path.',
          ],
        },
        {
          type: 'heading',
          level: 3,
          text: 'If I serve it like 3.6',
        },
        {
          type: 'paragraph',
          text: 'The official checkpoint runs on vLLM (0.17+, transformers ≥ 5.8). On a 48 GB card, FP8 is the sane tier; BF16 wants closer to 80 GB. Minimal recipe:',
        },
        {
          type: 'code',
          language: 'bash',
          code: `vllm serve Qwen/Qwen3.8-27B \\
  --max-model-len 262144

# Laptop (what I actually tested)
# Unsloth Studio → load Qwen3.8-27B MLX 4-bit
# → http://127.0.0.1:8888`,
        },
        {
          type: 'heading',
          level: 2,
          text: 'Takeaway',
        },
        {
          type: 'paragraph',
          text: '3.6 convinced me to self-host. 3.8 convinces me the 27B is no longer cloud-card-only: a 32 GB M1 + MLX 4-bit + Studio is enough for a real deliverable. Tetris isn’t a benchmark — it’s a “can I actually use this” test. Yes.',
        },
        {
          type: 'list',
          items: [
            'X test: x.com/tamsi_besson/status/2089656034449080484',
            'Weights: huggingface.co/Qwen/Qwen3.8-27B',
            'Studio: /blog/unsloth-studio',
            '3.6 server: /blog/qwen-3-6-27b-remote-server',
          ],
        },
      ],
    },
  },
}
