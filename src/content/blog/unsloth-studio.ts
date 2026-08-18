import type { BlogPost } from './types'

const COVER = '/blog/unsloth-studio-hf-live.png'

export const unslothStudio: BlogPost = {
  slug: 'unsloth-studio',
  publishedAt: '2026-08-18',
  tags: ['Unsloth', 'Fine-tuning', 'Local LLM', 'GGUF', 'Hermes'],
  readingTimeMinutes: 6,
  content: {
    fr: {
      title: 'Unsloth Studio — l’atelier local pour fine-tuner et servir des LLM',
      description:
        'Pourquoi j’utilise Unsloth Studio comme couche atelier : chat, Data Recipes, QLoRA et export GGUF — sans notebook ni GPU cloud à la minute.',
      blocks: [
        {
          type: 'paragraph',
          text: 'J’ai déjà un endpoint Qwen en vLLM pour l’agent lourd, Ollama pour le léger, et Hermes pour ce qui doit tourner sans moi. Ce qui manquait, c’est l’atelier : préparer un dataset, fine-tuner un modèle open, comparer le résultat au baseline, l’exporter en GGUF — sans enchaîner un notebook, trois YAML et un compte RunPod. Unsloth Studio est cette couche.',
        },
        {
          type: 'image',
          src: COVER,
          alt: 'Interface Unsloth Studio pendant une démo Hugging Face',
          caption:
            'Unsloth Studio — UI locale pour chat, training et export (démo Hugging Face).',
          link: {
            href: '/blog/unsloth-studio-hf-live-daniel-hanchen',
            label: 'Notes du live HF avec Daniel Hanchen →',
          },
        },
        {
          type: 'heading',
          level: 2,
          text: 'Le vrai problème',
        },
        {
          type: 'paragraph',
          text: 'Fine-tuner un Qwen ou un Gemma n’est plus réservé aux labs. En revanche, le parcours reste cassé : Hugging Face Transformers + PEFT pour le training, un autre outil pour la quant, Ollama ou llama.cpp pour servir, et tes données qui passent souvent par un GPU cloud facturé à la minute. Dès que le dataset contient du métier (tickets, docs internes, transcripts), je ne veux plus envoyer les poids ni les fichiers ailleurs.',
        },
        {
          type: 'list',
          items: [
            'Une UI locale, pas une collection de notebooks.',
            'Tes docs restent sur la machine — PDF, CSV, JSON, DOCX.',
            'Les kernels Unsloth : environ 2× plus vite, ~70 % de VRAM en moins vs le stack HF + PEFT classique.',
            'Un export vers le stack que j’utilise déjà : GGUF, safetensors, LoRA, vLLM, Ollama.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Ce qu’est Unsloth Studio',
        },
        {
          type: 'paragraph',
          text: 'Unsloth Studio (beta) est l’UI web du projet Unsloth. No-code pour l’essentiel, branchée sur les mêmes kernels que la lib Python. Tu l’installes en app Desktop (Mac, Windows, Linux) ou en CLI. Elle tourne en local — chat, training, export — et peut exposer un endpoint OpenAI-compatible pour Claude Code, Codex ou Hermes.',
        },
        {
          type: 'list',
          items: [
            'Chat : GGUF, safetensors, MLX sur Mac, comparaison côte à côte, tool calling self-healing, exécution Bash/Python sandboxée.',
            'Training : texte, vision, audio/TTS, embeddings — QLoRA, LoRA ou full fine-tune.',
            'Data Recipes : tes fichiers bruts deviennent un dataset via un graphe de nœuds (NVIDIA NeMo Data Designer).',
            'Export : 16-bit mergé, adaptateur LoRA seul, ou GGUF pour llama.cpp / Ollama / LM Studio / vLLM.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Le parcours que je retiens',
        },
        {
          type: 'paragraph',
          text: 'Je ne m’en sers pas comme chat du quotidien — Cursor et vLLM restent là. Studio, c’est la boucle « adapter un modèle à un cas », une fois le dataset sous la main.',
        },
        {
          type: 'list',
          items: [
            'Charger un modèle Hub ou local (Qwen, Gemma, Nemotron…), souvent en QLoRA 4-bit.',
            'Importer des PDF / CSV / JSON, ou construire le set dans Data Recipes.',
            'Lancer le run : loss, norme de gradient, VRAM et température en live.',
            'Comparer le checkpoint au baseline dans le chat (arena).',
            'Exporter en GGUF (Q4_K_M par défaut) ou safetensors 16-bit selon que ça part sur Ollama ou vLLM.',
          ],
        },
        {
          type: 'heading',
          level: 3,
          text: 'QLoRA, LoRA, full',
        },
        {
          type: 'list',
          items: [
            'QLoRA — base 4-bit + adaptateur. Le moins de VRAM, le bon défaut sur une carte consommateur.',
            'LoRA — base 16-bit + adaptateur. Plus de marge qualité, plus de mémoire.',
            'Full fine-tune — tous les poids. Utile si tu as la VRAM ; sinon c’est du gaspillage.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Lancer Studio',
        },
        {
          type: 'paragraph',
          text: 'Le plus simple : l’app Desktop (unsloth.ai/download/mac sur mon laptop). En CLI :',
        },
        {
          type: 'code',
          language: 'bash',
          code: `# Install (macOS / Linux / WSL)
curl -fsSL https://unsloth.ai/install.sh | sh

# UI locale
unsloth studio -H 0.0.0.0 -p 8888
# → http://127.0.0.1:8888

# HTTPS via tunnel Cloudflare (optionnel)
unsloth studio --secure`,
        },
        {
          type: 'paragraph',
          text: 'Sur NVIDIA, training + inférence GPU. Sur Mac : training, MLX et GGUF — suffisant pour itérer sur laptop. CPU seul : chat et Data Recipes, pas le gros fine-tune. AMD : le chat marche ; le training Studio arrive (Unsloth Core existe déjà).',
        },
        {
          type: 'heading',
          level: 3,
          text: 'Brancher Hermes (et les autres agents)',
        },
        {
          type: 'paragraph',
          text: 'Une fois un modèle chargé dans Studio, `unsloth start` le pose derrière un agent. Pour mon stack LivingColor / Hermes :',
        },
        {
          type: 'code',
          language: 'bash',
          code: `unsloth start hermes
# aussi : claude, codex, opencode, openclaw`,
        },
        {
          type: 'paragraph',
          text: 'Ça ferme la boucle avec l’article Hermes : l’agent tourne sur un modèle que je contrôle, pas sur un flagship facturé à la tâche. Même idée que le serveur Qwen distant — sauf que là, le modèle peut être un fine-tune à moi, servi depuis la machine.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Où ça se place dans mon stack',
        },
        {
          type: 'list',
          items: [
            'Cursor — IDE. L’inférence lourde pointe vers vLLM, pas vers le modèle premium intégré.',
            'Qwen 27B / vLLM sur AWS — agent quotidien, gros contexte, plusieurs clients MCP.',
            'Unsloth Studio — atelier : dataset, fine-tune, quant, comparaison, export.',
            'Ollama / llama.cpp — servir un GGUF exporté (git-mentor, essais laptop).',
            'Hermes — automatisation hors IDE, éventuellement via `unsloth start hermes`.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Bilan',
        },
        {
          type: 'paragraph',
          text: 'Studio ne remplace ni Cursor ni mon endpoint distant. Il remplace le bricolage notebook + cloud GPU dès que je veux adapter un modèle open à un corpus local. Open-source, offline, et assez complet pour aller jusqu’à l’export. Les notes du live HF restent la meilleure intro visuelle ; la doc Unsloth pour l’install.',
        },
        {
          type: 'list',
          items: [
            'Doc Studio : unsloth.ai/docs/new/studio',
            'Desktop : unsloth.ai/download/mac',
            'Repo : github.com/unslothai/unsloth',
            'Live HF : /blog/unsloth-studio-hf-live-daniel-hanchen',
            'Qwen 3.8 sur M1 : /blog/qwen-3-8-27b-local-mlx',
            'Qwen self-hosted : /blog/qwen-3-6-27b-remote-server',
            'Hermes : /blog/hermes-automation-cheaper-models',
          ],
        },
      ],
    },
    en: {
      title: 'Unsloth Studio — the local workshop to fine-tune and serve LLMs',
      description:
        'Why I use Unsloth Studio as the workshop layer: chat, Data Recipes, QLoRA, and GGUF export — no notebook, no minute-billed cloud GPU.',
      blocks: [
        {
          type: 'paragraph',
          text: 'I already have a Qwen endpoint on vLLM for the heavy agent, Ollama for the light path, and Hermes for work that should run without me. What was missing is the workshop: prep a dataset, fine-tune an open model, compare it to the baseline, export GGUF — without chaining a notebook, three YAML files, and a RunPod tab. Unsloth Studio is that layer.',
        },
        {
          type: 'image',
          src: COVER,
          alt: 'Unsloth Studio UI during a Hugging Face demo',
          caption:
            'Unsloth Studio — local UI for chat, training, and export (Hugging Face demo).',
          link: {
            href: '/blog/unsloth-studio-hf-live-daniel-hanchen',
            label: 'Notes from the HF live with Daniel Hanchen →',
          },
        },
        {
          type: 'heading',
          level: 2,
          text: 'The actual problem',
        },
        {
          type: 'paragraph',
          text: 'Fine-tuning a Qwen or Gemma is no longer lab-only. The path is still broken, though: Hugging Face Transformers + PEFT for training, another tool for quant, Ollama or llama.cpp to serve, and your data often crossing a minute-billed cloud GPU. As soon as the dataset is work-shaped (tickets, internal docs, transcripts), I don’t want weights or files leaving the machine.',
        },
        {
          type: 'list',
          items: [
            'A local UI, not a pile of notebooks.',
            'Your docs stay on the box — PDF, CSV, JSON, DOCX.',
            'Unsloth kernels: about 2× faster, ~70% less VRAM vs the classic HF + PEFT stack.',
            'Export into the stack I already run: GGUF, safetensors, LoRA, vLLM, Ollama.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'What Unsloth Studio is',
        },
        {
          type: 'paragraph',
          text: 'Unsloth Studio (beta) is the web UI for the Unsloth project. No-code for most of it, backed by the same kernels as the Python library. Install it as a Desktop app (Mac, Windows, Linux) or via CLI. It runs locally — chat, training, export — and can expose an OpenAI-compatible endpoint for Claude Code, Codex, or Hermes.',
        },
        {
          type: 'list',
          items: [
            'Chat: GGUF, safetensors, MLX on Mac, side-by-side comparison, self-healing tool calling, sandboxed Bash/Python.',
            'Training: text, vision, audio/TTS, embeddings — QLoRA, LoRA, or full fine-tune.',
            'Data Recipes: raw files become a dataset through a node graph (NVIDIA NeMo Data Designer).',
            'Export: merged 16-bit, LoRA adapter only, or GGUF for llama.cpp / Ollama / LM Studio / vLLM.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'The loop I actually use',
        },
        {
          type: 'paragraph',
          text: 'I don’t use it as daily chat — Cursor and vLLM stay. Studio is the “adapt a model to a case” loop, once the dataset is in hand.',
        },
        {
          type: 'list',
          items: [
            'Load a Hub or local model (Qwen, Gemma, Nemotron…), usually QLoRA 4-bit.',
            'Import PDFs / CSVs / JSON, or build the set in Data Recipes.',
            'Start the run: live loss, gradient norm, VRAM, and temperature.',
            'Compare the checkpoint to the baseline in chat (arena).',
            'Export GGUF (Q4_K_M by default) or 16-bit safetensors depending on Ollama vs vLLM.',
          ],
        },
        {
          type: 'heading',
          level: 3,
          text: 'QLoRA, LoRA, full',
        },
        {
          type: 'list',
          items: [
            'QLoRA — 4-bit base + adapter. Lowest VRAM, the right default on a consumer card.',
            'LoRA — 16-bit base + adapter. More quality headroom, more memory.',
            'Full fine-tune — every weight. Fine if you have the VRAM; otherwise waste.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Launching Studio',
        },
        {
          type: 'paragraph',
          text: 'Easiest path: the Desktop app (unsloth.ai/download/mac on my laptop). CLI:',
        },
        {
          type: 'code',
          language: 'bash',
          code: `# Install (macOS / Linux / WSL)
curl -fsSL https://unsloth.ai/install.sh | sh

# Local UI
unsloth studio -H 0.0.0.0 -p 8888
# → http://127.0.0.1:8888

# HTTPS via Cloudflare tunnel (optional)
unsloth studio --secure`,
        },
        {
          type: 'paragraph',
          text: 'On NVIDIA: GPU training + inference. On Mac: training, MLX, and GGUF — enough to iterate on a laptop. CPU only: chat and Data Recipes, not the heavy fine-tune. AMD: chat works; Studio training is coming (Unsloth Core already exists).',
        },
        {
          type: 'heading',
          level: 3,
          text: 'Wiring Hermes (and other agents)',
        },
        {
          type: 'paragraph',
          text: 'Once a model is loaded in Studio, `unsloth start` puts it behind an agent. For my LivingColor / Hermes stack:',
        },
        {
          type: 'code',
          language: 'bash',
          code: `unsloth start hermes
# also: claude, codex, opencode, openclaw`,
        },
        {
          type: 'paragraph',
          text: 'That closes the loop with the Hermes post: the agent runs on a model I control, not a flagship billed per task. Same idea as the remote Qwen server — except here the model can be a fine-tune of mine, served from the machine.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Where it sits in my stack',
        },
        {
          type: 'list',
          items: [
            'Cursor — IDE. Heavy inference points at vLLM, not the built-in premium model.',
            'Qwen 27B / vLLM on AWS — daily agent, long context, several MCP clients.',
            'Unsloth Studio — workshop: dataset, fine-tune, quant, compare, export.',
            'Ollama / llama.cpp — serve an exported GGUF (git-mentor, laptop trials).',
            'Hermes — out-of-IDE automation, optionally via `unsloth start hermes`.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Takeaway',
        },
        {
          type: 'paragraph',
          text: 'Studio doesn’t replace Cursor or my remote endpoint. It replaces the notebook + cloud-GPU scramble whenever I want to adapt an open model to a local corpus. Open source, offline, and complete enough to reach export. The HF live notes remain the best visual intro; Unsloth docs for install.',
        },
        {
          type: 'list',
          items: [
            'Studio docs: unsloth.ai/docs/new/studio',
            'Desktop: unsloth.ai/download/mac',
            'Repo: github.com/unslothai/unsloth',
            'HF live: /blog/unsloth-studio-hf-live-daniel-hanchen',
            'Qwen 3.8 on M1: /blog/qwen-3-8-27b-local-mlx',
            'Qwen self-hosted: /blog/qwen-3-6-27b-remote-server',
            'Hermes: /blog/hermes-automation-cheaper-models',
          ],
        },
      ],
    },
  },
}
