import type { BlogPost } from './types'

const BENCH = '/blog/qwen-3-8-27b-benchmarks.png'

export const qwen38: BlogPost = {
  slug: 'qwen-3-8-27b',
  publishedAt: '2026-08-18',
  tags: ['Qwen', 'Local LLM', 'Open source', 'Benchmarks'],
  readingTimeMinutes: 6,
  content: {
    fr: {
      title: 'Qwen 3.8 27B — le 27B open qui rapproche le frontier du local',
      description:
        'Caractéristiques de Qwen3.8-27B, scores officiels face à 3.6 et à Opus 4.6 Max, et ce que ça change pour l’IA locale.',
      blocks: [
        {
          type: 'paragraph',
          text: 'Qwen3.8-27B est sorti à la mi-août 2026 : un dense 27B Apache 2.0, multimodal natif, 262k de contexte. Pas un MoE de 2 T de paramètres — un modèle que tu peux télécharger et servir. La model card le place au-dessus de Qwen3.6-27B partout, et au-dessus de Claude Opus 4.6 Max sur plusieurs benches de code et d’agent. Chiffres vendeur, à prendre comme plafond en attendant des reproductions indépendantes — mais le signal pour l’IA locale est clair.',
        },
        {
          type: 'image',
          src: BENCH,
          alt: 'Barres groupées : Qwen3.8-27B, Qwen3.6-27B et Claude Opus 4.6 Max sur six benchmarks officiels',
          caption:
            'Scores de la model card officielle (Qwen/Qwen3.8-27B). SWE-bench Pro et les benches coding utilisent le harness Claude Code.',
          link: {
            href: 'https://huggingface.co/Qwen/Qwen3.8-27B',
            label: 'Model card Hugging Face →',
          },
        },
        {
          type: 'heading',
          level: 2,
          text: 'Caractéristiques',
        },
        {
          type: 'paragraph',
          text: 'Le 27B est le dense compact de la génération Qwen3.8, construit sur l’archi Qwen3.5 : 64 couches, attention hybride (16 blocs Gated Attention, le reste en Gated DeltaNet linéaire), encodeur vision, Multi-Token Prediction. Apache 2.0, poids ouverts, pensé pour le déploiement — pas seulement pour une API cloud.',
        },
        {
          type: 'list',
          items: [
            '27B dense (≈28B avec la tour vision), 64 couches, hidden 5120, vocab 248 320.',
            'Contexte natif 262 144 tokens, extensible à 1 000 000 via YaRN.',
            'Multimodal natif : images et vidéo (docs, schémas STEM, vidéos longues).',
            'Thinking on by default, réglable via `reasoning_effort` (xhigh / medium / low) et `preserve_thinking`.',
            'Servi par vLLM 0.17+, SGLang, Transformers ≥ 5.8 ; quants communautaires MLX / GGUF / NVFP4 / FP8 dès le jour 0.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Ce que disent les benches',
        },
        {
          type: 'paragraph',
          text: 'Sur la carte officielle, le saut vs 3.6 est surtout agentique et coding. DeepSWE 1.1 passe de 13,3 à 42,2. QwenSWEBench de 49,3 à 79,0. SWE-bench Pro 61,7 vs 53,5 (et 53,4 pour Opus 4.6 Max, harness différent pour Opus). LiveCodeBench v6 90,3 vs 83,9. Côté vision / computer use : OSWorld-Verified 84,3 vs 63,9.',
        },
        {
          type: 'list',
          items: [
            'Terminal-Bench 2.1 : 73,0 (3.6 : 63,4 — Opus : 78,2).',
            'SWE-bench Pro : 61,7 (3.6 : 53,5 — Opus : 53,4).',
            'LiveCodeBench v6 : 90,3 (3.6 : 83,9 — Opus : 88,8).',
            'CoWorkBench : 70,7 (3.6 : 61,0 — Opus : 68,2).',
            'IFBench : 79,5 (3.6 : 69,1 — Opus : 62,5).',
            'OSWorld-Verified : 84,3 (3.6 : 63,9 — Opus : 72,7).',
          ],
        },
        {
          type: 'paragraph',
          text: 'Opus reste devant sur Terminal-Bench, GPQA Diamond (91,3 vs 89,2) et Humanity’s Last Exam. Le 27B n’est pas « mieux qu’Opus partout ». Il est assez proche, sur assez de tâches d’ingénierie, pour qu’un poids open de 27B change le calcul local vs API.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Impact sur l’IA locale',
        },
        {
          type: 'paragraph',
          text: 'Jusqu’ici, le local tenait surtout le volume : petits modèles, quants agressifs, tâches courtes. Le frontier agentique (gros diffs, computer use, boucles d’outils) restait facturé au token. Un 27B Apache qui affiche des scores de coding / SWE au niveau d’un Opus cloud, et qui tourne en FP8 sur une 48 Go ou en 4-bit sur laptop, déplace la frontière.',
        },
        {
          type: 'list',
          items: [
            'Plus de licence à négocier, plus de quota qui coupe une session agent au milieu d’un refactor.',
            '262k de contexte natif : un repo, pas un fichier, tient dans une fenêtre locale.',
            'Vision + computer use (OSWorld, WebArena, AndroidWorld) : le local n’est plus « texte only ».',
            'Quants jour 0 (Unsloth, MLX, GGUF, NVFP4) : le même poids va du Mac au serveur vLLM.',
            'Thinking contrôlable : tu paies le raisonnement seulement quand la tâche le justifie.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Ça ne tue pas les APIs. Ça rend défendable de garder le travail quotidien — revue, proto, MCP, Hermes — sur une machine que tu contrôles. Le 3.6 m’avait déjà poussé vers vLLM self-hosted ; le 3.8 rend ce choix moins « compromis qualité ».',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Un essai local',
        },
        {
          type: 'paragraph',
          text: 'Je l’ai fait tourner en MLX 4-bit dans Unsloth Studio sur un MacBook M1 32 Go. Pas un bench : un Tetris HTML, ~11 tok/s, assez fluide pour itérer. Détail ici : x.com/tamsi_besson/status/2089656034449080484',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Bilan',
        },
        {
          type: 'paragraph',
          text: 'Qwen 3.8 27B n’est pas un miracle de taille. C’est un dense open, multimodal, long-contexte, dont les scores officiels de coding et d’agent se rapprochent des flagships cloud. Pour l’IA locale, c’est le palier où « self-host un 27B » cesse d’être un hobby et devient une option d’ingénierie. Les reproductions indépendantes diront si les barres tiennent ; les poids, eux, sont déjà là.',
        },
        {
          type: 'list',
          items: [
            'Model card : huggingface.co/Qwen/Qwen3.8-27B',
            'Essai local : x.com/tamsi_besson/status/2089656034449080484',
            'Studio : /blog/unsloth-studio',
            'Serveur 3.6 : /blog/qwen-3-6-27b-remote-server',
          ],
        },
      ],
    },
    en: {
      title: 'Qwen 3.8 27B — the open 27B that pulls the frontier onto local hardware',
      description:
        'Qwen3.8-27B specs, official scores versus 3.6 and Opus 4.6 Max, and what that changes for local AI.',
      blocks: [
        {
          type: 'paragraph',
          text: 'Qwen3.8-27B shipped mid-August 2026: a dense 27B under Apache 2.0, native multimodal, 262k context. Not a 2T MoE — a model you can download and serve. The model card puts it above Qwen3.6-27B everywhere, and above Claude Opus 4.6 Max on several coding and agent benches. Vendor numbers, treat them as a ceiling until independent labs reproduce them — but the signal for local AI is clear.',
        },
        {
          type: 'image',
          src: BENCH,
          alt: 'Grouped bars: Qwen3.8-27B, Qwen3.6-27B, and Claude Opus 4.6 Max on six official benchmarks',
          caption:
            'Official model-card scores (Qwen/Qwen3.8-27B). SWE-bench Pro and coding benches use the Claude Code harness.',
          link: {
            href: 'https://huggingface.co/Qwen/Qwen3.8-27B',
            label: 'Hugging Face model card →',
          },
        },
        {
          type: 'heading',
          level: 2,
          text: 'Specs',
        },
        {
          type: 'paragraph',
          text: 'The 27B is the compact dense model in the Qwen3.8 generation, built on the Qwen3.5 architecture: 64 layers, hybrid attention (16 Gated Attention blocks, the rest linear Gated DeltaNet), a vision encoder, multi-token prediction. Apache 2.0, open weights, meant for deployment — not only a cloud API.',
        },
        {
          type: 'list',
          items: [
            '27B dense (≈28B with the vision tower), 64 layers, hidden 5120, vocab 248,320.',
            'Native context 262,144 tokens, extensible to 1,000,000 via YaRN.',
            'Native multimodal: images and video (docs, STEM diagrams, long videos).',
            'Thinking on by default, tunable with `reasoning_effort` (xhigh / medium / low) and `preserve_thinking`.',
            'Served by vLLM 0.17+, SGLang, Transformers ≥ 5.8; community MLX / GGUF / NVFP4 / FP8 quants on day zero.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'What the benches say',
        },
        {
          type: 'paragraph',
          text: 'On the official card, the jump versus 3.6 is mostly agentic and coding. DeepSWE 1.1 goes from 13.3 to 42.2. QwenSWEBench from 49.3 to 79.0. SWE-bench Pro 61.7 vs 53.5 (and 53.4 for Opus 4.6 Max, different harness for Opus). LiveCodeBench v6 90.3 vs 83.9. On vision / computer use: OSWorld-Verified 84.3 vs 63.9.',
        },
        {
          type: 'list',
          items: [
            'Terminal-Bench 2.1: 73.0 (3.6: 63.4 — Opus: 78.2).',
            'SWE-bench Pro: 61.7 (3.6: 53.5 — Opus: 53.4).',
            'LiveCodeBench v6: 90.3 (3.6: 83.9 — Opus: 88.8).',
            'CoWorkBench: 70.7 (3.6: 61.0 — Opus: 68.2).',
            'IFBench: 79.5 (3.6: 69.1 — Opus: 62.5).',
            'OSWorld-Verified: 84.3 (3.6: 63.9 — Opus: 72.7).',
          ],
        },
        {
          type: 'paragraph',
          text: 'Opus still leads on Terminal-Bench, GPQA Diamond (91.3 vs 89.2), and Humanity’s Last Exam. The 27B is not “better than Opus everywhere.” It is close enough, on enough engineering tasks, that an open 27B changes the local-versus-API math.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Impact on local AI',
        },
        {
          type: 'paragraph',
          text: 'Until now, local mostly won on volume: small models, aggressive quants, short tasks. Frontier agent work (large diffs, computer use, tool loops) stayed metered. A 27B Apache model posting coding / SWE scores next to a cloud Opus, running FP8 on a 48 GB card or 4-bit on a laptop, moves that line.',
        },
        {
          type: 'list',
          items: [
            'No license to negotiate, no quota cutting an agent session mid-refactor.',
            '262k native context: a repo, not a file, fits in a local window.',
            'Vision + computer use (OSWorld, WebArena, AndroidWorld): local is no longer text-only.',
            'Day-zero quants (Unsloth, MLX, GGUF, NVFP4): the same weights go from a Mac to a vLLM box.',
            'Controllable thinking: you pay for reasoning only when the task justifies it.',
          ],
        },
        {
          type: 'paragraph',
          text: 'That doesn’t kill APIs. It makes it reasonable to keep daily work — review, proto, MCP, Hermes — on a machine you control. 3.6 already pushed me toward self-hosted vLLM; 3.8 makes that choice less of a quality compromise.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'A local run',
        },
        {
          type: 'paragraph',
          text: 'I ran it in MLX 4-bit inside Unsloth Studio on a 32 GB M1 MacBook. Not a bench: an HTML Tetris, ~11 tok/s, fast enough to iterate. Notes here: x.com/tamsi_besson/status/2089656034449080484',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Takeaway',
        },
        {
          type: 'paragraph',
          text: 'Qwen 3.8 27B is not a size miracle. It is an open dense multimodal long-context model whose official coding and agent scores sit next to cloud flagships. For local AI, this is the rung where “self-host a 27B” stops being a hobby and becomes an engineering option. Independent reproductions will say whether the bars hold; the weights are already here.',
        },
        {
          type: 'list',
          items: [
            'Model card: huggingface.co/Qwen/Qwen3.8-27B',
            'Local run: x.com/tamsi_besson/status/2089656034449080484',
            'Studio: /blog/unsloth-studio',
            '3.6 server: /blog/qwen-3-6-27b-remote-server',
          ],
        },
      ],
    },
  },
}
