import type { BlogPost } from './types'

const COVER = '/blog/dflash2.png'
const SOURCE = 'https://inco.ai/blog/dflash2/'

export const dflash2: BlogPost = {
  slug: 'dflash2',
  publishedAt: '2026-08-21',
  tags: ['DFlash', 'Speculative decoding', 'Qwen', 'Inference', 'SGLang'],
  readingTimeMinutes: 6,
  content: {
    fr: {
      title: 'DFlash 2 — 3× plus de tokens sur Qwen3.8-27B, même sortie',
      description:
        'Inco AI pousse un drafter parallèle pour Qwen3.8-27B : +20 % d’acceptation vs DFlash, 2,7–3,4× le débit autoregressif, sortie identique. Pourquoi ça compte dès qu’un agent boucle.',
      blocks: [
        {
          type: 'paragraph',
          text: 'J’ai écrit [Qwen 3.8 27B](/blog/qwen-3-8-27b) parce que le modèle est enfin assez bon pour rester en local. Le plafond suivant n’est plus la qualité — c’est le **débit**. Un agent qui lit, planifie et appelle des outils pendant des heures consomme des tokens à un rythme que le chat n’a jamais atteint. Chaque token, en décodage classique, coûte un forward pass complet. [DFlash 2](https://inco.ai/blog/dflash2/) (Inco AI, 18 août 2026) attaque exactement ça : **draft parallèle + vérif en un pass**, sortie **prouvée identique** au modèle cible.',
        },
        {
          type: 'image',
          src: COVER,
          alt: 'DFlash 2 : Keep Drafting Parallel — Inco AI',
          caption:
            'Inco AI — DFlash 2 : close to 3× vs autoregressif, même output. Drafters Qwen3.8-27B et Muse Glimmer.',
          link: {
            href: SOURCE,
            label: 'L’article Inco AI →',
          },
        },
        {
          type: 'heading',
          level: 2,
          text: 'Pourquoi ça m’intéresse',
        },
        {
          type: 'paragraph',
          text: 'Sur un 27B, le bottleneck n’est plus « est-ce que le modèle est assez fort » — c’est « est-ce que je peux le servir assez vite pour un agent ». DFlash 1 (janvier 2026) est déjà dans SGLang, vLLM, TensorRT-LLM et llama.cpp : NVIDIA a mesuré jusqu’à **15×** de throughput sur Blackwell, Google **3×** de tok/s sur TPU, et le endpoint CoreWeave Kimi K2.7 Code — le plus rapide du modèle sur Artificial Analysis — tourne DFlash par défaut. **3,5 M** de downloads Hugging Face. DFlash 2 n’invente pas un nouveau stack : il **récupère le slack** encore dans le draft parallèle.',
        },
        {
          type: 'list',
          items: [
            'Le draft n’est plus autoregressif : tout le bloc, toutes les positions, en un pass.',
            'DFlash 2 : **+16–25 %** d’acceptance length vs DFlash, **~1 %** de latence de cycle en plus.',
            'Sur Qwen3.8-27B : **2,7–3,4×** le throughput autoregressif (batch 1), **même texte**.',
            'Deux drafters le jour J : [incoai/Qwen3.8-27B-DFlash2](https://huggingface.co/incoai/Qwen3.8-27B-DFlash2) et Muse Glimmer.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'L’idée, sans le papier',
        },
        {
          type: 'paragraph',
          text: 'Le **speculative decoding** classique : un petit modèle **devine** un bloc, le gros **vérifie** le bloc en un forward. Bonnes guesses → plusieurs tokens pour un pass. Mauvaises → on jette. Pendant des années le draft lui-même restait **un token à la fois**. DFlash a rendu le draft **one-pass**. DFlash 2 corrige les deux fuites qui restaient : **mauvais choix parmi de bons candidats**, et **suffix decay** (la fin du bloc pourrit).',
        },
        {
          type: 'paragraph',
          text: 'Chiffre qui m’a convaincu : sur un DFlash 5 couches (Qwen3-4B, GSM8K), le top-1 est juste **85,4 %** du temps en position 0 — mais le bon token est dans le **top 16 à 99,5 %**. Le problème n’est pas « le drafter ne sait pas ». C’est **sélectionner un chemin cohérent** dans des listes déjà bonnes. Un oracle top-16 ferait passer l’acceptance de **4,27 → 6,79**. DFlash 2 pose un **sélecteur de paires** (+2 M params, +0,6 % latence) plutôt qu’une tête autoregressive type DSpark (+77,8 M, +9,6 %). *Choosing is cheaper than predicting.*',
        },
        {
          type: 'paragraph',
          text: 'Le suffix decay, eux le traitent comme un **problème local** : une conv deux taps (style Canon / short conv) avant/après chaque attention et MLP. **+3 %** de params, **+0,7 %** de latence, et un 5 couches rattrape presque un 15 couches. Ensemble, sélecteur + conv = **+1,3 %** de cycle pour **+1 token** accepté par pass en moyenne.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Les chiffres qui comptent sur Qwen3.8-27B',
        },
        {
          type: 'paragraph',
          text: 'C’est le drafter que je viserais. Comparé au **MTP natif** du modèle et à un DSpark communautaire, sur les benches Inco (block 8, sampling officiel Qwen) :',
        },
        {
          type: 'list',
          items: [
            'Acceptance mean : MTP **4,28** · DSpark **3,62** · **DFlash 2 4,80**.',
            'GSM8K : 5,46 vs MTP 5,02. MATH-500 : 5,28 vs 4,72. MBPP : 4,79 vs 3,99.',
            'Throughput batch 1 (H200, SGLang, model card) : **2,67–3,43×** vs autoregressif — 184 à 236 tok/s là où l’AR plafonne ~69.',
            'Concurrency 8 : encore **2,3–2,8×**. À 32, le gain se tasse (1,0–1,45×) — normal : le batch remplit déjà le GPU.',
            'Muse Glimmer : **3,1–4,6×**, mean 5,70 vs DFlash officiel 4,44.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Lossless : greedy = exactement le target ; sampling via rejection sampling = **même distribution**. Tu n’échanges pas de la qualité contre du débit. Tu paies ~1 % de cycle pour un token de plus par vérif.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Le lancer',
        },
        {
          type: 'paragraph',
          text: 'Déjà branché dans SGLang, vLLM (PR), llama.cpp (PR), Ollama (PR) et oMLX. Le chemin le plus court aujourd’hui, c’est SGLang + le drafter Hub :',
        },
        {
          type: 'code',
          language: 'bash',
          code: `pip install "sglang[all] @ git+https://github.com/sgl-project/sglang.git#subdirectory=python"

python -m sglang.launch_server \\
  --model-path Qwen/Qwen3.8-27B \\
  --speculative-algorithm DFLASH \\
  --speculative-draft-model-path incoai/Qwen3.8-27B-DFlash2 \\
  --speculative-num-draft-tokens 8`,
        },
        {
          type: 'list',
          items: [
            'vLLM : `method: dflash`, `num_speculative_tokens: 7` — encore sur une PR (`vllm#52816`).',
            'llama.cpp : `--spec-type draft-dflash` + GGUF `incoai/Qwen3.8-27B-DFlash2-GGUF`.',
            'Mac : oMLX (prebuilt) ou Ollama expérimental, draft `incoai/Qwen3.8-27B-DFlash2` sur un target MLX 4-bit.',
            'Le drafter **n’est pas un LLM autonome** (~2B). Il ne sert que dans un serveur speculatif.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Où ça se branche chez moi',
        },
        {
          type: 'paragraph',
          text: 'Sur le [serveur Qwen 3.6](/blog/qwen-3-6-27b-remote-server) et le 3.8 en [Studio / MLX](/blog/unsloth-studio), le coût réel d’un agent c’est le **tok/s × durée de boucle**. 3× en batch 1, c’est une session Hermes / MCP qui tient dans la même fenêtre au lieu de timeout. À haute concurrence le gain fond — si tu sers déjà un batch plein, DFlash 2 n’est pas magique. Si tu sers **un agent à la fois** (le cas local / une carte), c’est le levier.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Takeaway',
        },
        {
          type: 'paragraph',
          text: 'DFlash 2 n’est pas un nouveau modèle. C’est un **drafter** qui rend le 27B que tu as déjà **utilisable en agent** sans changer une ligne de prompt ni la distribution de sortie. Inco le dit clairement : l’inférence n’a pas encore touché le plancher. Pour moi le test concret, c’est brancher `incoai/Qwen3.8-27B-DFlash2` sur le même Qwen3.8 que je sers déjà — et mesurer le tok/s, pas le blog.',
        },
        {
          type: 'list',
          items: [
            'Source : inco.ai/blog/dflash2/',
            'Drafter : huggingface.co/incoai/Qwen3.8-27B-DFlash2',
            'Qwen 3.8 : /blog/qwen-3-8-27b',
            'Local Studio : /blog/unsloth-studio',
          ],
        },
      ],
    },
    en: {
      title: 'DFlash 2 — 3× more tokens on Qwen3.8-27B, same output',
      description:
        'Inco AI’s parallel drafter for Qwen3.8-27B: +20% acceptance vs DFlash, 2.7–3.4× autoregressive throughput, identical output. Why it matters as soon as an agent loops.',
      blocks: [
        {
          type: 'paragraph',
          text: 'I wrote [Qwen 3.8 27B](/blog/qwen-3-8-27b) because the model is finally good enough to stay local. The next ceiling isn’t quality — it’s **throughput**. An agent that reads, plans, and calls tools for hours burns tokens at a rate chat never did. Every token, in classic decoding, costs a full forward pass. [DFlash 2](https://inco.ai/blog/dflash2/) (Inco AI, 18 Aug 2026) hits exactly that: **parallel draft + one-pass verify**, output **provably unchanged** vs the target.',
        },
        {
          type: 'image',
          src: COVER,
          alt: 'DFlash 2: Keep Drafting Parallel — Inco AI',
          caption:
            'Inco AI — DFlash 2: close to 3× vs autoregressive, same output. Drafters for Qwen3.8-27B and Muse Glimmer.',
          link: {
            href: SOURCE,
            label: 'The Inco AI post →',
          },
        },
        {
          type: 'heading',
          level: 2,
          text: 'Why I care',
        },
        {
          type: 'paragraph',
          text: 'On a 27B the bottleneck is no longer “is the model strong enough” — it’s “can I serve it fast enough for an agent”. DFlash 1 (Jan 2026) already ships in SGLang, vLLM, TensorRT-LLM, and llama.cpp: NVIDIA measured up to **15×** throughput on Blackwell, Google **3×** tok/s on TPUs, and CoreWeave’s Kimi K2.7 Code endpoint — fastest for that model on Artificial Analysis — runs DFlash by default. **3.5M** Hugging Face downloads. DFlash 2 doesn’t invent a new stack: it **recovers the slack** still left in parallel drafting.',
        },
        {
          type: 'list',
          items: [
            'The draft is no longer autoregressive: the whole block, every position, in one pass.',
            'DFlash 2: **+16–25%** acceptance length vs DFlash, **~1%** extra cycle latency.',
            'On Qwen3.8-27B: **2.7–3.4×** autoregressive throughput (batch 1), **same text**.',
            'Two day-one drafters: [incoai/Qwen3.8-27B-DFlash2](https://huggingface.co/incoai/Qwen3.8-27B-DFlash2) and Muse Glimmer.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'The idea, without the paper',
        },
        {
          type: 'paragraph',
          text: 'Classic **speculative decoding**: a small model **guesses** a block, the large one **verifies** it in one forward. Good guesses → several tokens per pass. Bad ones get dropped. For years the draft itself stayed **one token at a time**. DFlash made drafting **one-pass**. DFlash 2 plugs the two leaks that remained: **wrong pick among good candidates**, and **suffix decay** (the tail of the block dies).',
        },
        {
          type: 'paragraph',
          text: 'The number that sold me: on a 5-layer DFlash (Qwen3-4B, GSM8K), top-1 is right **85.4%** of the time at position 0 — but the right token is in the **top 16 99.5%** of the time. The drafter already knows. You just need a **coherent path** through those lists. A top-16 oracle would lift acceptance from **4.27 → 6.79**. DFlash 2 adds a **pairwise path selector** (+2M params, +0.6% latency) instead of an autoregressive correction head like DSpark (+77.8M, +9.6%). *Choosing is cheaper than predicting.*',
        },
        {
          type: 'paragraph',
          text: 'Suffix decay they treat as a **local** problem: a two-tap conv (Canon / short-conv style) before and after every attention and MLP. **+3%** params, **+0.7%** latency, and a 5-layer almost matches a 15-layer. Selector + conv together: **+1.3%** cycle for **+1 accepted token** per pass on average.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'The numbers that matter on Qwen3.8-27B',
        },
        {
          type: 'paragraph',
          text: 'That’s the drafter I’d actually plug in. Versus the model’s native **MTP** and a community DSpark, on Inco’s benches (block 8, official Qwen sampling):',
        },
        {
          type: 'list',
          items: [
            'Mean acceptance: MTP **4.28** · DSpark **3.62** · **DFlash 2 4.80**.',
            'GSM8K: 5.46 vs MTP 5.02. MATH-500: 5.28 vs 4.72. MBPP: 4.79 vs 3.99.',
            'Batch-1 throughput (H200, SGLang, model card): **2.67–3.43×** vs AR — 184–236 tok/s where AR sits at ~69.',
            'Concurrency 8: still **2.3–2.8×**. At 32 the gain collapses (1.0–1.45×) — expected: the batch already fills the GPU.',
            'Muse Glimmer: **3.1–4.6×**, mean 5.70 vs official DFlash 4.44.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Lossless: greedy matches the target exactly; sampling via rejection sampling keeps the **same distribution**. You’re not trading quality for speed. You pay ~1% cycle for one extra token per verify.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Run it',
        },
        {
          type: 'paragraph',
          text: 'Already wired into SGLang, vLLM (PR), llama.cpp (PR), Ollama (PR), and oMLX. Shortest path today: SGLang + the Hub drafter:',
        },
        {
          type: 'code',
          language: 'bash',
          code: `pip install "sglang[all] @ git+https://github.com/sgl-project/sglang.git#subdirectory=python"

python -m sglang.launch_server \\
  --model-path Qwen/Qwen3.8-27B \\
  --speculative-algorithm DFLASH \\
  --speculative-draft-model-path incoai/Qwen3.8-27B-DFlash2 \\
  --speculative-num-draft-tokens 8`,
        },
        {
          type: 'list',
          items: [
            'vLLM: `method: dflash`, `num_speculative_tokens: 7` — still on a PR (`vllm#52816`).',
            'llama.cpp: `--spec-type draft-dflash` + GGUF `incoai/Qwen3.8-27B-DFlash2-GGUF`.',
            'Mac: oMLX (prebuilt) or experimental Ollama, draft `incoai/Qwen3.8-27B-DFlash2` on an MLX 4-bit target.',
            'The drafter is **not a standalone LLM** (~2B). It only runs inside a speculative server.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Where it lands in my stack',
        },
        {
          type: 'paragraph',
          text: 'On the [Qwen 3.6 server](/blog/qwen-3-6-27b-remote-server) and 3.8 in [Studio / MLX](/blog/unsloth-studio), an agent’s real cost is **tok/s × loop time**. 3× at batch 1 is a Hermes / MCP session that fits the window instead of timing out. At high concurrency the gain melts — if you already serve a full batch, DFlash 2 isn’t magic. If you serve **one agent at a time** (local / one card), that’s the lever.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Takeaway',
        },
        {
          type: 'paragraph',
          text: 'DFlash 2 isn’t a new model. It’s a **drafter** that makes the 27B you already run **usable for agents** without changing a prompt or the output distribution. Inco is blunt: inference hasn’t hit the floor. For me the real test is wiring `incoai/Qwen3.8-27B-DFlash2` onto the Qwen3.8 I already serve — and measuring tok/s, not the blog.',
        },
        {
          type: 'list',
          items: [
            'Source: inco.ai/blog/dflash2/',
            'Drafter: huggingface.co/incoai/Qwen3.8-27B-DFlash2',
            'Qwen 3.8: /blog/qwen-3-8-27b',
            'Local Studio: /blog/unsloth-studio',
          ],
        },
      ],
    },
  },
}
