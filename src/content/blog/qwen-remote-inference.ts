import type { BlogPost } from './types'

export const qwenRemoteInference: BlogPost = {
  slug: 'qwen-3-6-27b-remote-server',
  publishedAt: '2026-06-01',
  tags: ['LLM', 'Qwen', 'AWS', 'vLLM', 'Cursor'],
  readingTimeMinutes: 7,
  content: {
    fr: {
      title: 'Pourquoi j’ai monté un serveur Qwen 3.6 27B plutôt que de payer Cursor',
      description:
        'Des tokens gratuits plutôt que les modèles Cursor — Qwen 3.6 27B servi en vLLM sur AWS (4 bits), Ollama en local pour git-mentor.',
      blocks: [
        {
          type: 'paragraph',
          text: 'Cursor est un excellent IDE agentique. En revanche, les modèles qu’il propose en natif m’ont vite frustré : quotas, facturation au token, sessions agent qui s’arrêtent au pire moment, et une qualité/prix difficile à justifier quand on enchaîne les revues de code, les refactors et les essais MCP toute la journée.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Le vrai problème',
        },
        {
          type: 'paragraph',
          text: 'Ce n’était pas « je veux héberger un LLM pour le plaisir ». C’était : je veux utiliser l’agent sans regarder la jauge de tokens toutes les dix minutes. Mes projets (MCP, prototypes Gradio, gros diffs GitHub) consomment beaucoup de contexte. Payer Cursor pour chaque itération, c’est acceptable une fois de temps en temps — pas en boucle sur du travail perso et open source.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Ce que le serveur distant m’apporte',
        },
        {
          type: 'list',
          items: [
            'Tokens gratuits côté inférence : je paie le GPU à l’heure, pas chaque prompt. Je peux relancer l’agent dix fois sur le même bug sans culpabiliser.',
            'Un Qwen 3.6 27B branché en API OpenAI-compatible — Cursor, mes serveurs MCP et mes scripts parlent au même endpoint.',
            'Même workflow qu’avant dans l’IDE ; seul le modèle change. Pas besoin de quitter Cursor.',
            'Indépendance : si demain les tarifs ou les limites bougent encore, mon stack reste le mien.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Comment c’est monté (en bref)',
        },
        {
          type: 'paragraph',
          text: 'Instance GPU sur AWS (48 Go VRAM), vLLM pour servir Qwen 3.6 27B, reverse proxy en TLS + token Bearer devant. vLLM expose l’API OpenAI-compatible (`/v1/chat/completions`) — Cursor, ai-code-reviewer-mcp et redbee-mcp pointent tous vers ce endpoint avec les mêmes `OPENAI_API_BASE` / `OPENAI_API_KEY`.',
        },
        {
          type: 'heading',
          level: 3,
          text: 'Pourquoi vLLM sur AWS (et pas Ollama ici)',
        },
        {
          type: 'paragraph',
          text: 'Pour un 27B en prod agent — gros contexte, requêtes parallèles, uptime — vLLM est plus adapté : throughput, batching, API stable. Ollama brille ailleurs (voir git-mentor ci-dessous). Sur AWS je lance le modèle quantifié une fois ; je paie l’instance GPU, pas les tokens Cursor.',
        },
        {
          type: 'heading',
          level: 3,
          text: 'Pourquoi du 4 bits (AWQ / GPTQ)',
        },
        {
          type: 'paragraph',
          text: 'Un 27B en FP16 demande ~54 Go de VRAM — hors budget sur une seule carte « classique ». En quantification 4 bits (AWQ ou GPTQ, le format que vLLM charge nativement), le poids tombe autour de 16 Go : le modèle tient sur le GPU avec de la marge pour le contexte long et plusieurs requêtes agent. On perd un peu de finesse vs le full precision, mais pour du code review, du refactor et des appels MCP, la différence est rarement bloquante — surtout comparée au coût d’un gros modèle cloud facturé au token.',
        },
        {
          type: 'list',
          items: [
            'FP16 : meilleure qualité, VRAM ×3 — utile si tu as 80 Go+ ou plusieurs GPUs.',
            'AWQ / GPTQ 4 bits : bon compromis qualité / prix / latence pour vLLM au quotidien.',
            'Q8 : milieu si tu veux gratter un peu de qualité sans doubler la facture EC2.',
          ],
        },
        {
          type: 'code',
          language: 'bash',
          code: `# Sur l'instance AWS (exemple vLLM + poids AWQ)
vllm serve Qwen/Qwen3-27B-Instruct-AWQ \\
  --quantization awq \\
  --host 127.0.0.1 --port 8000

# Côté Cursor / MCP (via le proxy TLS)
OPENAI_API_BASE=https://llm.example.com/v1
OPENAI_API_KEY=<token-proxy>
OPENAI_MODEL=Qwen/Qwen3-27B-Instruct-AWQ`,
        },
        {
          type: 'heading',
          level: 3,
          text: 'Ollama en local pour git-mentor',
        },
        {
          type: 'paragraph',
          text: 'git-mentor, c’est un autre cas d’usage : analyse de profil GitHub avec un PAT qui ne doit pas transiter par un serveur distant si je peux l’éviter, sessions courtes, modèle plus petit suffisant. Là j’utilise Ollama sur ma machine — zéro coût cloud, offline possible, `localhost:11434/v1`. Le gros Qwen AWS reste pour Cursor et les MCP ; git-mentor reste local-first par design.',
        },
        {
          type: 'code',
          language: 'bash',
          code: `# Mac / laptop — git-mentor en local
ollama run llama3.2

export OPENAI_API_BASE=http://localhost:11434/v1
export OPENAI_API_KEY=ollama
git-mentor analyze --user Tamsi`,
        },
        {
          type: 'heading',
          level: 2,
          text: 'Le bilan',
        },
        {
          type: 'paragraph',
          text: 'Deux stacks complémentaires : vLLM sur AWS pour l’agent « à fond » (tokens gratuits côté inférence), Ollama en local pour git-mentor. Le setup AWS m’a pris une après-midi ; le gain, c’est surtout mental et économique. Cursor reste mon interface ; le cerveau lourd tourne chez moi sur GPU, le cerveau léger sur le laptop.',
        },
      ],
    },
    en: {
      title: 'Why I run a remote Qwen 3.6 27B server instead of paying Cursor',
      description:
        'Free tokens instead of Cursor models — Qwen 3.6 27B on AWS via vLLM (4-bit), Ollama locally for git-mentor.',
      blocks: [
        {
          type: 'paragraph',
          text: 'Cursor is a great agentic IDE. Its native models, though, got frustrating fast: quotas, per-token billing, agent sessions stopping at the worst time, and a quality/price ratio that’s hard to defend when you chain code reviews, refactors, and MCP experiments all day.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'The actual problem',
        },
        {
          type: 'paragraph',
          text: 'It wasn’t “I want to self-host an LLM for fun.” It was: I want to use the agent without checking the token meter every ten minutes. My projects (MCP, Gradio prototypes, large GitHub diffs) eat a lot of context. Paying Cursor for every iteration is fine occasionally — not on a loop for side projects and open source.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'What the remote server gives me',
        },
        {
          type: 'list',
          items: [
            'Free inference tokens: I pay for GPU hours, not per prompt. I can rerun the agent ten times on the same bug without guilt.',
            'Qwen 3.6 27B on an OpenAI-compatible API — Cursor, my MCP servers, and scripts share one endpoint.',
            'Same IDE workflow; only the model changes. No need to leave Cursor.',
            'Independence: if pricing or limits shift again, my stack stays mine.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'How it’s set up (briefly)',
        },
        {
          type: 'paragraph',
          text: 'GPU instance on AWS (48 GB VRAM), vLLM serving Qwen 3.6 27B, TLS reverse proxy + Bearer token in front. vLLM exposes the OpenAI-compatible API (`/v1/chat/completions`) — Cursor, ai-code-reviewer-mcp, and redbee-mcp all point at the same endpoint with shared `OPENAI_API_BASE` / `OPENAI_API_KEY`.',
        },
        {
          type: 'heading',
          level: 3,
          text: 'Why vLLM on AWS (not Ollama here)',
        },
        {
          type: 'paragraph',
          text: 'For a 27B in agent production — long context, parallel requests, uptime — vLLM fits better: throughput, batching, stable API. Ollama shines elsewhere (see git-mentor below). On AWS I load the quantized model once; I pay for the GPU instance, not Cursor tokens.',
        },
        {
          type: 'heading',
          level: 3,
          text: 'Why 4-bit (AWQ / GPTQ)',
        },
        {
          type: 'paragraph',
          text: 'A 27B in FP16 needs ~54 GB VRAM — out of reach on a single “normal” card. With 4-bit quantization (AWQ or GPTQ, formats vLLM loads natively), weights land around 16 GB: the model fits on GPU with headroom for long context and several agent requests. You lose a bit of nuance vs full precision, but for code review, refactors, and MCP calls the gap is rarely blocking — especially compared to a large cloud model billed per token.',
        },
        {
          type: 'list',
          items: [
            'FP16: best quality, 3× VRAM — makes sense if you have 80 GB+ or multiple GPUs.',
            'AWQ / GPTQ 4-bit: solid quality/price/latency tradeoff for daily vLLM use.',
            'Q8: middle ground if you want a bit more quality without doubling the EC2 bill.',
          ],
        },
        {
          type: 'code',
          language: 'bash',
          code: `# On the AWS instance (vLLM + AWQ weights example)
vllm serve Qwen/Qwen3-27B-Instruct-AWQ \\
  --quantization awq \\
  --host 127.0.0.1 --port 8000

# Cursor / MCP (via TLS proxy)
OPENAI_API_BASE=https://llm.example.com/v1
OPENAI_API_KEY=<proxy-token>
OPENAI_MODEL=Qwen/Qwen3-27B-Instruct-AWQ`,
        },
        {
          type: 'heading',
          level: 3,
          text: 'Local Ollama for git-mentor',
        },
        {
          type: 'paragraph',
          text: 'git-mentor is a different use case: GitHub profile analysis with a PAT that shouldn’t hit a remote server if I can avoid it, short sessions, a smaller model is enough. There I use Ollama on my machine — zero cloud cost, works offline, `localhost:11434/v1`. The big Qwen on AWS stays for Cursor and MCP; git-mentor stays local-first by design.',
        },
        {
          type: 'code',
          language: 'bash',
          code: `# Mac / laptop — git-mentor locally
ollama run llama3.2

export OPENAI_API_BASE=http://localhost:11434/v1
export OPENAI_API_KEY=ollama
git-mentor analyze --user Tamsi`,
        },
        {
          type: 'heading',
          level: 2,
          text: 'Bottom line',
        },
        {
          type: 'paragraph',
          text: 'Two complementary stacks: vLLM on AWS for the “full throttle” agent (free inference tokens), Ollama locally for git-mentor. AWS setup took an afternoon; the real win is mental and economic. Cursor stays my interface; the heavy brain runs on my GPU in the cloud, the light one on the laptop.',
        },
      ],
    },
  },
}
