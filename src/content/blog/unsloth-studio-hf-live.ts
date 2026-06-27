import type { BlogPost } from './types'

const COVER = '/blog/unsloth-studio-hf-live.png'

export const unslothStudioHfLive: BlogPost = {
  slug: 'unsloth-studio-hf-live-daniel-hanchen',
  publishedAt: '2026-06-27',
  tags: ['Unsloth', 'Hugging Face', 'Fine-tuning', 'GGUF', 'Local LLM'],
  readingTimeMinutes: 6,
  content: {
    fr: {
      title:
        'Unsloth Studio en live HF — entraîner et faire tourner des LLM en local, sans cloud',
      description:
        'Notes sur la session Hugging Face avec Daniel Hanchen (UnslothAI) : Studio, quants dynamiques, benchmarks et fine-tuning low-VRAM sur Mac/Windows/Linux.',
      blocks: [
        {
          type: 'paragraph',
          text: 'J’ai suivi la session live Hugging Face avec Daniel Hanchen (UnslothAI) autour d’Unsloth Studio. Le pitch est simple : une interface web open-source pour entraîner, exécuter et exporter des modèles open (Gemma, Qwen, DeepSeek, etc.) entièrement en local — Mac, Windows ou Linux — sans passer par un cloud GPU à la minute.',
        },
        {
          type: 'image',
          src: COVER,
          alt: 'Capture de la démo Unsloth Studio pendant le live Hugging Face avec Daniel Hanchen',
          caption:
            'Unsloth Studio — démo live Hugging Face (Daniel Hanchen, UnslothAI).',
          link: {
            href: 'https://x.com/tamsi_besson/status/2070491095373394352',
            label: 'Voir la vidéo complète sur X →',
          },
        },
        {
          type: 'heading',
          level: 2,
          text: 'Pourquoi ça m’intéresse',
        },
        {
          type: 'paragraph',
          text: 'Mon stack tourne déjà autour du local et du self-hosted : Qwen en vLLM sur AWS pour l’agent lourd, Ollama pour le léger, GGUF partout où je peux. Ce qui manquait souvent, c’est la couche « atelier » : préparer un dataset, lancer un fine-tune, comparer des quants, exporter vers Ollama ou llama.cpp — sans enchaîner cinq outils et dix fichiers YAML. Studio vise exactement ce workflow unifié, dans le navigateur, sur la machine.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Ce qu’est Unsloth Studio',
        },
        {
          type: 'paragraph',
          text: 'Unsloth Studio (beta) est l’UI web du projet Unsloth : no-code pour l’essentiel, mais branchée sur les kernels Unsloth qui promettent ~2× plus vite et ~70 % de VRAM en moins sur le fine-tuning, avec des benchmarks officiels (dont vérification Hugging Face) qui montrent des gains réels en vitesse et mémoire par rapport au stack Hugging Face + PEFT classique.',
        },
        {
          type: 'list',
          items: [
            'Chat et inférence locale : GGUF et safetensors, llama.cpp + Hugging Face, multi-GPU et offload automatique.',
            'Fine-tuning : 500+ modèles texte, vision, audio/TTS, embeddings — LoRA, FP8, full fine-tune selon le cas.',
            'Data Recipes : PDF, CSV, DOCX, JSON → datasets synthétiques sans tout coder à la main.',
            'Export : safetensors 16-bit, GGUF (2-bit et au-delà) pour Ollama, LM Studio, vLLM, etc.',
            'Comparaison côte à côte de modèles / quants dans la même UI.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Quants dynamiques et benchmarks',
        },
        {
          type: 'paragraph',
          text: 'Une partie centrale du live : la quantification dynamique — pas seulement du 4-bit « par défaut », mais des quants agressifs (2-bit, GGUF) avec des courbes de qualité / vitesse / VRAM présentées sur des benchmarks officiels. L’idée n’est pas « compresse à tout prix », mais choisir le bon compromis pour ton hardware : un 27B qui ne tient pas en FP16 peut devenir utilisable en inférence locale ou en fine-tune LoRA sur une seule carte consommateur.',
        },
        {
          type: 'paragraph',
          text: 'Daniel insiste sur la reproductibilité : les chiffres ne viennent pas d’un tweet, ils sont documentés et comparés au baseline HF. Pour quelqu’un qui hésite entre AWQ, GPTQ, GGUF Q4_K_M ou plus bas, la démo de comparaison dans Studio évite des heures de tests manuels.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Démo live : chargement, inférence, fine-tuning',
        },
        {
          type: 'paragraph',
          text: 'La session enchaîne des exemples concrets : recherche et téléchargement d’un modèle, lancement du chat avec réglages d’inférence auto (température, top-p, templates), exécution de code en sandbox (Bash + Python) et tool calling « self-healing ». On voit aussi le parcours training — upload de docs, graphe de Data Recipe, lancement d’un fine-tune optimisé VRAM — puis export GGUF pour repartir en offline pur.',
        },
        {
          type: 'code',
          language: 'bash',
          code: `# Lancer Studio en local (doc officielle)
unsloth studio -p 8888
# → http://127.0.0.1:8888`,
        },
        {
          type: 'heading',
          level: 3,
          text: 'Plateformes',
        },
        {
          type: 'list',
          items: [
            'NVIDIA (RTX 30/40/50, Blackwell…) : training + inférence GPU.',
            'macOS : training, MLX et inférence GGUF — aligné avec ma config laptop.',
            'CPU seul : chat + Data Recipes ; le training lourd reste côté GPU NVIDIA pour l’instant.',
            'AMD : chat OK ; training Studio annoncé prochainement (Unsloth Core déjà utilisable).',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Discussion avec l’hôte HF',
        },
        {
          type: 'paragraph',
          text: 'La fin du live repasse en visio avec l’hôte Hugging Face : partenariat HF × NVIDIA, feuille de route multi-GPU et MLX sur Apple Silicon, et surtout la philosophie produit — rendre l’open-source AI aussi simple qu’une app SaaS, mais sans envoyer tes poids et tes données ailleurs. C’est le même fil que mes articles sur Qwen self-hosted : contrôle, coût maîtrisé, offline quand tu en as besoin.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Bilan',
        },
        {
          type: 'paragraph',
          text: 'Unsloth Studio ne remplace pas Cursor ni mon endpoint vLLM pour l’agent quotidien. En revanche, pour tout ce qui est « je veux adapter un Qwen/Gemma à mon cas, le quantifier proprement et le servir en local », c’est aujourd’hui l’une des interfaces les plus complètes — surtout si tu veux éviter le cloud training à la carte. Je garde la vidéo sous la main comme référence ; la doc et le repo Unsloth pour l’installation.',
        },
        {
          type: 'list',
          items: [
            'Doc Studio : unsloth.ai/docs/new/studio',
            'Repo : github.com/unslothai/unsloth',
            'Annonce HF : post Daniel Hanchen sur le Hub',
          ],
        },
      ],
    },
    en: {
      title:
        'Unsloth Studio HF live — train and run LLMs locally, no cloud',
      description:
        'Notes from the Hugging Face live with Daniel Hanchen (UnslothAI): Studio, dynamic quants, benchmarks, and low-VRAM fine-tuning on Mac/Windows/Linux.',
      blocks: [
        {
          type: 'paragraph',
          text: 'I watched the Hugging Face live with Daniel Hanchen (UnslothAI) on Unsloth Studio. The pitch is straightforward: an open-source web UI to train, run, and export open models (Gemma, Qwen, DeepSeek, etc.) entirely on your machine — Mac, Windows, or Linux — without minute-billed cloud GPUs.',
        },
        {
          type: 'image',
          src: COVER,
          alt: 'Unsloth Studio demo screenshot from the Hugging Face live with Daniel Hanchen',
          caption:
            'Unsloth Studio — Hugging Face live demo (Daniel Hanchen, UnslothAI).',
          link: {
            href: 'https://x.com/tamsi_besson/status/2070491095373394352',
            label: 'Watch the full video on X →',
          },
        },
        {
          type: 'heading',
          level: 2,
          text: 'Why I care',
        },
        {
          type: 'paragraph',
          text: 'My stack already revolves around local and self-hosted: Qwen on vLLM/AWS for the heavy agent, Ollama for the light path, GGUF wherever I can. What was often missing is the “workshop” layer: prep a dataset, run a fine-tune, compare quants, export to Ollama or llama.cpp — without chaining five tools and ten YAML files. Studio targets that unified workflow in the browser, on your box.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'What Unsloth Studio is',
        },
        {
          type: 'paragraph',
          text: 'Unsloth Studio (beta) is the web UI for the Unsloth project: no-code for most tasks, backed by Unsloth kernels that claim ~2× faster training and ~70% less VRAM, with official benchmarks (including Hugging Face verification runs) showing real speed and memory wins vs the standard Hugging Face + PEFT stack.',
        },
        {
          type: 'list',
          items: [
            'Local chat and inference: GGUF and safetensors, llama.cpp + Hugging Face, multi-GPU and automatic offload.',
            'Fine-tuning: 500+ text, vision, audio/TTS, and embedding models — LoRA, FP8, full fine-tune as needed.',
            'Data Recipes: PDF, CSV, DOCX, JSON → synthetic datasets without hand-rolling everything.',
            'Export: 16-bit safetensors, GGUF (2-bit and beyond) for Ollama, LM Studio, vLLM, etc.',
            'Side-by-side model / quant comparison in the same UI.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Dynamic quants and benchmarks',
        },
        {
          type: 'paragraph',
          text: 'A core part of the live: dynamic quantization — not just default 4-bit, but aggressive quants (2-bit, GGUF) with quality / speed / VRAM curves on official benchmarks. The goal isn’t “compress at all costs” but pick the right tradeoff for your hardware: a 27B that won’t fit in FP16 can become usable for local inference or LoRA fine-tuning on a single consumer card.',
        },
        {
          type: 'paragraph',
          text: 'Daniel stresses reproducibility: numbers aren’t from a tweet, they’re documented and compared to the HF baseline. If you’re choosing between AWQ, GPTQ, GGUF Q4_K_M, or lower, Studio’s comparison demo saves hours of manual testing.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Live demo: load, infer, fine-tune',
        },
        {
          type: 'paragraph',
          text: 'The session walks through concrete examples: search and download a model, launch chat with auto inference settings (temperature, top-p, templates), sandboxed code execution (Bash + Python), and self-healing tool calling. You also see the training path — upload docs, Data Recipe graph, VRAM-optimized fine-tune — then GGUF export for fully offline use.',
        },
        {
          type: 'code',
          language: 'bash',
          code: `# Run Studio locally (official docs)
unsloth studio -p 8888
# → http://127.0.0.1:8888`,
        },
        {
          type: 'heading',
          level: 3,
          text: 'Platforms',
        },
        {
          type: 'list',
          items: [
            'NVIDIA (RTX 30/40/50, Blackwell…): training + GPU inference.',
            'macOS: training, MLX, and GGUF inference — matches my laptop setup.',
            'CPU only: chat + Data Recipes; heavy training stays on NVIDIA GPUs for now.',
            'AMD: chat works; Studio training coming soon (Unsloth Core already available).',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Q&A with the HF host',
        },
        {
          type: 'paragraph',
          text: 'The live closes with a video chat with the Hugging Face host: HF × NVIDIA partnership, multi-GPU and Apple Silicon MLX roadmap, and the product philosophy — make open-source AI as simple as a SaaS app, without shipping your weights and data elsewhere. Same thread as my Qwen self-hosted posts: control, predictable cost, offline when you need it.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Takeaway',
        },
        {
          type: 'paragraph',
          text: 'Unsloth Studio doesn’t replace Cursor or my vLLM endpoint for daily agent work. But for “I want to adapt a Qwen/Gemma to my use case, quantize it properly, and serve it locally,” it’s one of the most complete interfaces today — especially if you want to skip pay-per-hour cloud training. I’m keeping the recording as reference; Unsloth docs and repo for install.',
        },
        {
          type: 'list',
          items: [
            'Studio docs: unsloth.ai/docs/new/studio',
            'Repo: github.com/unslothai/unsloth',
            'HF announcement: Daniel Hanchen’s post on the Hub',
          ],
        },
      ],
    },
  },
}
