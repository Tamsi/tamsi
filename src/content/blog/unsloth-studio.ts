import type { BlogPost } from './types'

const COVER = '/blog/unsloth-qwen38-gguf.jpg'
const UNSLOTH_TWEET = 'https://x.com/UnslothAI/status/2088627177655050362'

export const unslothStudio: BlogPost = {
  slug: 'unsloth-studio',
  publishedAt: '2026-08-12',
  tags: ['Unsloth', 'Local LLM', 'GGUF', 'Qwen', 'Fine-tuning'],
  readingTimeMinutes: 6,
  content: {
    fr: {
      title: 'Unsloth Studio — faire tourner et entraîner des LLM en local',
      description:
        'Studio, le Desktop et les kernels Unsloth : GGUF / MLX, fine-tune low-VRAM, Data Recipes — et pourquoi le GGUF Qwen3.8-27B tient en 17 Go.',
      blocks: [
        {
          type: 'paragraph',
          text: 'Mi-août, Unsloth a poussé un GGUF de Qwen3.8-27B. En moins de 24 heures : 1 000 likes, 3e modèle trending sur Hugging Face, 1 M de downloads. Leur phrase utile n’est pas le compteur — c’est « Run on 17GB RAM/VRAM setups via Unsloth ». Un 27B frontier-adjacent qui tient sur une machine que tu possèdes, c’est exactement le job de Studio.',
        },
        {
          type: 'image',
          src: COVER,
          alt: 'Annonce Unsloth : Qwen3.8-27B GGUF, 1000 likes en 24 h, exécutable en 17 Go via Unsloth',
          caption:
            'UnslothAI — Qwen3.8-27B GGUF : 1 000 likes en 24 h, #3 trending, 1 M de downloads, 17 Go RAM/VRAM.',
          link: {
            href: UNSLOTH_TWEET,
            label: 'Le post UnslothAI →',
          },
        },
        {
          type: 'heading',
          level: 2,
          text: 'Ce qu’est Unsloth',
        },
        {
          type: 'paragraph',
          text: 'Unsloth (github.com/unslothai/unsloth) est d’abord une lib de training : kernels custom, ~2× plus vite, ~70 % de VRAM en moins vs le stack Transformers + PEFT, sans perte de qualité annoncée. Studio est l’UI locale par-dessus : une app Desktop (Mac, Windows, Linux) ou un `unsloth studio` dans le navigateur. Même moteur, plus de notebook.',
        },
        {
          type: 'list',
          items: [
            'Inférence locale : GGUF, safetensors, MLX sur Mac, diffusion image/vidéo.',
            'Training no-code : 500+ modèles texte, vision, TTS, embeddings — QLoRA, LoRA, FP8, full.',
            'Data Recipes : PDF, CSV, JSON, DOCX, TXT → dataset (NVIDIA NeMo Data Designer).',
            'Export : GGUF, safetensors 16-bit, adaptateur LoRA — vers llama.cpp, Ollama, vLLM, LM Studio.',
            'Agents : endpoint OpenAI-compatible + `unsloth start` (Claude Code, Codex, Hermes, OpenCode).',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Pourquoi 17 Go changent le calcul',
        },
        {
          type: 'paragraph',
          text: 'Le GGUF Unsloth de Qwen3.8-27B (huggingface.co/unsloth/Qwen3.8-27B-GGUF) est le cas d’école. Le même modèle en BF16 pèse ~55 Go. En quant Unsloth, il rentre dans 17 Go — RTX 4070, Mac 32 Go en MLX, petite instance cloud. Tu ne loues plus une H100 pour « juste essayer ». Tu charges, tu chats, tu compares, tu exportes.',
        },
        {
          type: 'list',
          items: [
            'Pas besoin de fine-tuner pour s’en servir : Studio charge un GGUF et c’est tout.',
            'Tool calling self-healing, web search privé, exécution Bash/Python sandboxée.',
            'Arena : deux modèles / quants côte à côte dans la même UI.',
            'Offline : pas de télémétrie d’usage ; hardware minimal pour la compat.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Le parcours Studio',
        },
        {
          type: 'paragraph',
          text: 'La doc (unsloth.ai/docs/new/studio) décrit une boucle unique. Tu n’enchaînes plus Transformers, un quantizer, Ollama et un YAML.',
        },
        {
          type: 'list',
          items: [
            'Lancer Desktop ou `unsloth studio` — chercher un modèle Hub ou un GGUF local.',
            'Optionnel : Data Recipes pour fabriquer le set à partir de tes fichiers.',
            'Fine-tune QLoRA (défaut low-VRAM) / LoRA / full, métriques et VRAM en temps réel.',
            'Comparer le checkpoint au baseline dans le chat.',
            'Exporter vers le runtime que tu as déjà.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Installer',
        },
        {
          type: 'paragraph',
          text: 'Desktop : unsloth.ai/download/mac (aussi Windows et Linux). CLI :',
        },
        {
          type: 'code',
          language: 'bash',
          code: `# macOS / Linux / WSL
curl -fsSL https://unsloth.ai/install.sh | sh

unsloth studio -H 0.0.0.0 -p 8888
# → http://127.0.0.1:8888

# Tunnel HTTPS Cloudflare (optionnel)
unsloth studio --secure`,
        },
        {
          type: 'paragraph',
          text: 'NVIDIA : training + inférence GPU. Mac : training, MLX et GGUF. CPU : chat et Data Recipes. Le training lourd reste côté GPU NVIDIA. Une fois un modèle chargé :',
        },
        {
          type: 'code',
          language: 'bash',
          code: `unsloth start hermes
# aussi : claude, codex, opencode, openclaw`,
        },
        {
          type: 'heading',
          level: 2,
          text: 'Dans mon stack',
        },
        {
          type: 'paragraph',
          text: 'vLLM sur AWS garde l’agent quotidien. Studio est là où j’essaie un GGUF du jour — Qwen3.8-27B en 4-bit sur le M1, par exemple — et où je fine-tunerais un corpus qui ne doit pas sortir de la machine. Détail sur le 27B : /blog/qwen-3-8-27b',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Bilan',
        },
        {
          type: 'paragraph',
          text: 'Unsloth n’est plus seulement une lib de LoRA rapide. Studio en fait l’endroit où tu cours, compares et exportes les modèles open du moment — y compris un 27B qui rentre en 17 Go. Le tweet Qwen3.8 n’est pas du marketing vide : c’est la preuve que le local a rattrapé le rythme des sorties.',
        },
        {
          type: 'list',
          items: [
            'Doc Studio : unsloth.ai/docs/new/studio',
            'Repo : github.com/unslothai/unsloth',
            'GGUF Qwen3.8-27B : huggingface.co/unsloth/Qwen3.8-27B-GGUF',
            'Annonce : x.com/UnslothAI/status/2088627177655050362',
            'Qwen 3.8 27B : /blog/qwen-3-8-27b',
          ],
        },
      ],
    },
    en: {
      title: 'Unsloth Studio — run and train LLMs locally',
      description:
        'Studio, Desktop, and Unsloth kernels: GGUF / MLX, low-VRAM fine-tunes, Data Recipes — and why the Qwen3.8-27B GGUF fits in 17 GB.',
      blocks: [
        {
          type: 'paragraph',
          text: 'In mid-August Unsloth shipped a Qwen3.8-27B GGUF. In under 24 hours: 1,000 likes, #3 trending model on Hugging Face, 1M downloads. The useful line isn’t the counter — it’s “Run on 17GB RAM/VRAM setups via Unsloth.” A frontier-adjacent 27B that fits on hardware you own is exactly what Studio is for.',
        },
        {
          type: 'image',
          src: COVER,
          alt: 'Unsloth announcement: Qwen3.8-27B GGUF, 1000 likes in 24h, runnable in 17 GB via Unsloth',
          caption:
            'UnslothAI — Qwen3.8-27B GGUF: 1,000 likes in 24h, #3 trending, 1M downloads, 17 GB RAM/VRAM.',
          link: {
            href: UNSLOTH_TWEET,
            label: 'The UnslothAI post →',
          },
        },
        {
          type: 'heading',
          level: 2,
          text: 'What Unsloth is',
        },
        {
          type: 'paragraph',
          text: 'Unsloth (github.com/unslothai/unsloth) started as a training library: custom kernels, ~2× faster, ~70% less VRAM than Transformers + PEFT, with no claimed quality loss. Studio is the local UI on top: a Desktop app (Mac, Windows, Linux) or `unsloth studio` in the browser. Same engine, no notebook.',
        },
        {
          type: 'list',
          items: [
            'Local inference: GGUF, safetensors, MLX on Mac, image/video diffusion.',
            'No-code training: 500+ text, vision, TTS, embedding models — QLoRA, LoRA, FP8, full.',
            'Data Recipes: PDF, CSV, JSON, DOCX, TXT → dataset (NVIDIA NeMo Data Designer).',
            'Export: GGUF, 16-bit safetensors, LoRA adapter — to llama.cpp, Ollama, vLLM, LM Studio.',
            'Agents: OpenAI-compatible endpoint + `unsloth start` (Claude Code, Codex, Hermes, OpenCode).',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Why 17 GB changes the math',
        },
        {
          type: 'paragraph',
          text: 'Unsloth’s Qwen3.8-27B GGUF (huggingface.co/unsloth/Qwen3.8-27B-GGUF) is the textbook case. The same model in BF16 is ~55 GB. Unsloth’s quant fits in 17 GB — RTX 4070, 32 GB Mac on MLX, a small cloud box. You don’t rent an H100 to “just try it.” You load, chat, compare, export.',
        },
        {
          type: 'list',
          items: [
            'No need to fine-tune to use it: Studio loads a GGUF and you’re in.',
            'Self-healing tool calling, private web search, sandboxed Bash/Python.',
            'Arena: two models / quants side by side in the same UI.',
            'Offline: no usage telemetry; minimal hardware info for compatibility.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'The Studio loop',
        },
        {
          type: 'paragraph',
          text: 'The docs (unsloth.ai/docs/new/studio) describe one loop. You no longer chain Transformers, a quantizer, Ollama, and a YAML file.',
        },
        {
          type: 'list',
          items: [
            'Launch Desktop or `unsloth studio` — search a Hub model or a local GGUF.',
            'Optional: Data Recipes to build the set from your files.',
            'Fine-tune QLoRA (low-VRAM default) / LoRA / full, metrics and VRAM in real time.',
            'Compare the checkpoint to the baseline in chat.',
            'Export to the runtime you already run.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Install',
        },
        {
          type: 'paragraph',
          text: 'Desktop: unsloth.ai/download/mac (Windows and Linux too). CLI:',
        },
        {
          type: 'code',
          language: 'bash',
          code: `# macOS / Linux / WSL
curl -fsSL https://unsloth.ai/install.sh | sh

unsloth studio -H 0.0.0.0 -p 8888
# → http://127.0.0.1:8888

# Cloudflare HTTPS tunnel (optional)
unsloth studio --secure`,
        },
        {
          type: 'paragraph',
          text: 'NVIDIA: GPU training + inference. Mac: training, MLX, and GGUF. CPU: chat and Data Recipes. Heavy training stays on NVIDIA GPUs. Once a model is loaded:',
        },
        {
          type: 'code',
          language: 'bash',
          code: `unsloth start hermes
# also: claude, codex, opencode, openclaw`,
        },
        {
          type: 'heading',
          level: 2,
          text: 'In my stack',
        },
        {
          type: 'paragraph',
          text: 'vLLM on AWS still owns the daily agent. Studio is where I try the GGUF of the day — Qwen3.8-27B in 4-bit on the M1, for instance — and where I’d fine-tune a corpus that shouldn’t leave the machine. More on the 27B: /blog/qwen-3-8-27b',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Takeaway',
        },
        {
          type: 'paragraph',
          text: 'Unsloth is no longer just a fast LoRA library. Studio is where you run, compare, and export the open models of the week — including a 27B that fits in 17 GB. The Qwen3.8 tweet isn’t empty marketing: it’s proof local caught up to the release cadence.',
        },
        {
          type: 'list',
          items: [
            'Studio docs: unsloth.ai/docs/new/studio',
            'Repo: github.com/unslothai/unsloth',
            'Qwen3.8-27B GGUF: huggingface.co/unsloth/Qwen3.8-27B-GGUF',
            'Announcement: x.com/UnslothAI/status/2088627177655050362',
            'Qwen 3.8 27B: /blog/qwen-3-8-27b',
          ],
        },
      ],
    },
  },
}
