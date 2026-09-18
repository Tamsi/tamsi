import type { BlogPost } from './types'

const COVER = '/blog/ternary-bonsai-2.png'
const SOURCE = 'https://huggingface.co/prism-ml/Ternary-Bonsai-2-27B-gguf'

export const ternaryBonsai2: BlogPost = {
  slug: 'ternary-bonsai-2-27b',
  publishedAt: '2026-09-18',
  tags: ['Bonsai', 'Qwen', 'Local LLM', 'Ternary', 'Quantization'],
  readingTimeMinutes: 7,
  content: {
    fr: {
      title: 'Ternary Bonsai 2 27B — un Qwen3.8 dans 6 Go, 98 % du FP16',
      description:
        'PrismML recompresse Qwen3.8-27B en poids ternaires vrais (1,72 bit). 5,95 Go, 98,2 % du FP16, ~47 tok/s sur M5 Max. Le catch : ça ne tourne pas dans llama.cpp stock.',
      blocks: [
        {
          type: 'paragraph',
          text: 'J’ai écrit [Qwen 3.8 27B](/blog/qwen-3-8-27b) parce que le dense open est enfin assez bon pour rester en local, et [DFlash 2](/blog/dflash2) parce que le plafond suivant c’est le débit. Le 17 septembre 2026, [PrismML](https://prismml.com) pousse **Ternary Bonsai 2 27B** : le même Qwen3.8-27B, poids `{−1, 0, +1}`, **5,95 Go** au lieu de ~54 Go FP16. Pas un « 2-bit » marketing à 9 Go. Un ternaire **vrai** à 1,72 bit/poids, qui tient 98,2 % de la moyenne thinking du FP16.',
        },
        {
          type: 'image',
          src: COVER,
          alt: 'PrismML — Bonsai, intelligence density for local models',
          caption:
            'PrismML — Bonsai 2 27B : Qwen3.8-27B en ternaire g128, Apache 2.0, 16–17 septembre 2026.',
          link: {
            href: SOURCE,
            label: 'La model card GGUF →',
          },
        },
        {
          type: 'heading',
          level: 2,
          text: 'Pourquoi ça m’intéresse',
        },
        {
          type: 'paragraph',
          text: 'Le 3.8 en MLX 4-bit tenait déjà sur un laptop. Bonsai 2 change l’équation **mémoire** : un 27B reasoning + 262k de contexte dans l’enveloppe d’un petit 7B. Le premier Bonsai 27B (juillet, base Qwen3.6) gardait ~95 % du FP16. Celui-ci annonce **98,2 %** — et surtout, il ne s’écroule pas là où les quants 2-bit classiques meurent (AIME, LiveCodeBench).',
        },
        {
          type: 'list',
          items: [
            '**5,95 Go** (PTQ1_0) ou **7,21 Go** (PQ2_0) pour le language model. Vision en mmproj Q8_0 optionnel (~0,63 Go).',
            'MLX : [prism-ml/Ternary-Bonsai-2-27B-mlx-2bit](https://huggingface.co/prism-ml/Ternary-Bonsai-2-27B-mlx-2bit) — 8,60 Go disque, tour vision incluse.',
            'Apache 2.0, archi inchangée : hybrid attention ~75 % linéaire, 27,36B, thinking `xhigh` par défaut.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Ternaire, pas « 2-bit »',
        },
        {
          type: 'paragraph',
          text: 'Chaque poids ∈ `{−1, 0, +1}`, un scale FP16 par groupe de 128. Information : log₂3 ≈ 1,585 bit, plus le scale amorti → **~1,71**, **1,72** en comptant les quelques tenseurs laissés plus haut (norme + état récurrent du linear attention, 0,1 % du modèle). Les embeddings, l’attention, les MLP **et** la LM head sont ternaires. Pas de tour de passe-passe « 2-bit sur le papier, 2,8 en moyenne ».',
        },
        {
          type: 'paragraph',
          text: 'Le détail qui bloque les runtimes stock : une **rotation de Hadamard** par bloc de 1024, pliée dans les poids. Au load, le runtime applique la transformée miroir sur les activations — ou refuse le fichier. `llama.cpp` upstream ne connaît ni `PTQ1_0` ni `PQ2_0`. Pire : un `Q2_0` Bonsai 1 chargé sans Hadamard **sort du garbage sans warning**.',
        },
        {
          type: 'list',
          items: [
            '**PTQ1_0** — trits denses, 1,75 bpw, 5,95 Go. Plus rapide en decode sur Ada / L4 (moins de poids à bouger).',
            '**PQ2_0** — un trit dans un slot 2-bit, 2,13 bpw, 7,21 Go. Gagne le prefill partout, et le decode sur H100 / A100 / Blackwell.',
            'Ni l’un ni l’autre n’est « le plus rapide ». Tu choisis selon la carte, pas selon le label.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Les benches qui comptent',
        },
        {
          type: 'paragraph',
          text: 'EvalScope + vLLM, H100, **thinking mode**, 14 benches, même infra. Chiffres vendeur — plafond, pas une repro indépendante — mais le protocole est au moins aligné entre les variantes :',
        },
        {
          type: 'list',
          items: [
            'Qwen3.8-27B FP16 : 86,32 avg · 54 Go · 16 bpw',
            'UD-Q4_K_XL (« 4-bit ») : 85,18 · 17,6 Go · **5,2** bpw réels',
            'IQ2_XXS (« 2-bit ») : 72,59 · 9,4 Go · **2,8** bpw réels',
            '**Bonsai 2** : **84,78** · **5,9 Go** · **1,72** bpw → **98,2 %** du FP16',
          ],
        },
        {
          type: 'paragraph',
          text: 'L’IQ2_XXS a l’air correct sur MMLU-Redux (88,9) et s’effondre dès que la chaîne de raisonnement s’allonge : AIME26 **57,5**, LiveCodeBench **56,4**. Bonsai 2 tient **95,83** et **90,07**. Math 96,57 vs 97,06 FP16. Coding **au niveau** du baseline (89,42 vs 89,07). Le trou restant est surtout knowledge / vision. C’est pour ça qu’un smoke test « ça a l’air 2-bit » rate le collapse.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Le débit, une fois que ça tient en RAM',
        },
        {
          type: 'paragraph',
          text: 'Mesures Prism, `llama-bench`, batch 1, pas de tour vision. PQ2_0 sauf mention :',
        },
        {
          type: 'list',
          items: [
            'RTX 5090 : **130 tok/s** decode · ~1,95 J/tok',
            'RTX 4090 : 81 (PQ2_0) / **91** (PTQ1_0)',
            'L4 72 W : ~30 tok/s',
            'M5 Max (mesure pre-rotation, à refaire) : **~47 tok/s** · M5 Pro ~28 · M4 Pro ~18',
            'M5 Pro : **27,5 W** rail GPU — le 27B qui ne rentre même pas en FP16',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Le lancer — et le catch',
        },
        {
          type: 'paragraph',
          text: 'Source of truth : [PrismML-Eng/Bonsai-demo](https://github.com/PrismML-Eng/Bonsai-demo). Binaries du [fork llama.cpp](https://github.com/PrismML-Eng/llama.cpp). **Ollama / llama.cpp stock / MLX ordinaire : non.** Un loader MLX sans le runtime bundlé (`model_type: prism_hadamard_qwen35`) ne throw pas — il **répond faux**.',
        },
        {
          type: 'code',
          language: 'bash',
          code: `hf download prism-ml/Ternary-Bonsai-2-27B-gguf \\
  Ternary-Bonsai-2-27B-PQ2_0.gguf --local-dir .

./bin/llama-cli -m Ternary-Bonsai-2-27B-PQ2_0.gguf \\
  -ngl 99 -fa on -c 32768 \\
  --temp 1.0 --top-p 0.95 --top-k 20 \\
  -p "Explain quantum computing in simple terms." -n 256`,
        },
        {
          type: 'list',
          items: [
            'Thinking : `temp=1.0`, `top_p=0.95`, `top_k=20`. Instruct : `temp=0.7`, `top_p=0.8`, `presence_penalty=1.5`.',
            '`reasoning_effort=low` n’est **pas** supporté — ça se comporte comme `xhigh`. Utilise `medium` pour raccourcir.',
            'Déjà des packs communautaires [DFlash 2](/blog/dflash2) (GGUF / MLX) le jour J — le drafter sur un ternaire, à mesurer, pas à croire.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Où ça se branche chez moi',
        },
        {
          type: 'paragraph',
          text: 'Sur le Mac 32 Go, le 3.8 en 4-bit était déjà le daily. Bonsai 2 est le cran où **le 27B n’est plus un compromis VRAM** : tu gardes de la RAM pour le contexte, un second modèle, ou le drafter. Le jour où le fork Prism (ou l’upstream) est dans Studio / Ollama, c’est le poids que je tenterais en premier pour un agent local. Tant que le runtime est un fork, c’est un outil, pas encore le défaut.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Takeaway',
        },
        {
          type: 'paragraph',
          text: 'Bonsai 2 n’invente pas un 27B. Il **rend le 3.8 déployable** là où le FP16 ne rentre pas, sans le collapse des vrais 2-bit. 98 % du thinking avg à 6 Go, c’est le chiffre. Le contrat, c’est le runtime : Hadamard + types `PTQ1_0` / `PQ2_0`, ou tu n’as pas le modèle. Chiffres Prism, à prendre comme plafond. Les poids, eux, sont déjà sur le Hub.',
        },
        {
          type: 'list',
          items: [
            'GGUF : [prism-ml/Ternary-Bonsai-2-27B-gguf](https://huggingface.co/prism-ml/Ternary-Bonsai-2-27B-gguf)',
            'MLX : [prism-ml/Ternary-Bonsai-2-27B-mlx-2bit](https://huggingface.co/prism-ml/Ternary-Bonsai-2-27B-mlx-2bit)',
            'Demo : [PrismML-Eng/Bonsai-demo](https://github.com/PrismML-Eng/Bonsai-demo)',
            'Qwen 3.8 : [/blog/qwen-3-8-27b](/blog/qwen-3-8-27b) · DFlash 2 : [/blog/dflash2](/blog/dflash2)',
          ],
        },
      ],
    },
    en: {
      title: 'Ternary Bonsai 2 27B — Qwen3.8 in 6 GB, 98% of FP16',
      description:
        'PrismML recompresses Qwen3.8-27B into true ternary weights (1.72 bits). 5.95 GB, 98.2% of FP16, ~47 tok/s on an M5 Max. The catch: it will not run in stock llama.cpp.',
      blocks: [
        {
          type: 'paragraph',
          text: 'I wrote [Qwen 3.8 27B](/blog/qwen-3-8-27b) because the open dense model is finally good enough to stay local, and [DFlash 2](/blog/dflash2) because the next ceiling is throughput. On 17 Sep 2026, [PrismML](https://prismml.com) ships **Ternary Bonsai 2 27B**: the same Qwen3.8-27B, weights in `{−1, 0, +1}`, **5.95 GB** instead of ~54 GB FP16. Not a marketing “2-bit” at 9 GB. True ternary at 1.72 bits/weight, holding 98.2% of the FP16 thinking average.',
        },
        {
          type: 'image',
          src: COVER,
          alt: 'PrismML — Bonsai, intelligence density for local models',
          caption:
            'PrismML — Bonsai 2 27B: Qwen3.8-27B in ternary g128, Apache 2.0, 16–17 Sep 2026.',
          link: {
            href: SOURCE,
            label: 'The GGUF model card →',
          },
        },
        {
          type: 'heading',
          level: 2,
          text: 'Why I care',
        },
        {
          type: 'paragraph',
          text: '3.8 in MLX 4-bit already fit a laptop. Bonsai 2 changes the **memory** math: 27B-class reasoning + 262k context in a small-7B envelope. The first Bonsai 27B (July, Qwen3.6 base) kept ~95% of FP16. This one claims **98.2%** — and, more important, it does not collapse where classic 2-bit quants die (AIME, LiveCodeBench).',
        },
        {
          type: 'list',
          items: [
            '**5.95 GB** (PTQ1_0) or **7.21 GB** (PQ2_0) for the language model. Optional Q8_0 vision mmproj (~0.63 GB).',
            'MLX: [prism-ml/Ternary-Bonsai-2-27B-mlx-2bit](https://huggingface.co/prism-ml/Ternary-Bonsai-2-27B-mlx-2bit) — 8.60 GB on disk, vision tower included.',
            'Apache 2.0, architecture unchanged: ~75% linear hybrid attention, 27.36B, thinking `xhigh` by default.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Ternary, not “2-bit”',
        },
        {
          type: 'paragraph',
          text: 'Each weight ∈ `{−1, 0, +1}`, one FP16 scale per group of 128. Information: log₂3 ≈ 1.585 bits plus the amortized scale → **~1.71**, **1.72** once you count the few tensors left higher (norms + linear-attention recurrent state, 0.1% of the model). Embeddings, attention, MLPs, **and** the LM head are ternary. No “2-bit on the label, 2.8 on average” sleight of hand.',
        },
        {
          type: 'paragraph',
          text: 'The detail that breaks stock runtimes: a **Hadamard rotation** per 1024-wide block, folded into the stored weights. At load, the runtime applies the matching activation transform — or refuses the file. Upstream `llama.cpp` knows neither `PTQ1_0` nor `PQ2_0`. Worse: a Bonsai 1 `Q2_0` loaded without Hadamard **emits garbage with no warning**.',
        },
        {
          type: 'list',
          items: [
            '**PTQ1_0** — dense trits, 1.75 bpw, 5.95 GB. Faster decode on Ada / L4 (less weight traffic).',
            '**PQ2_0** — one trit in a 2-bit slot, 2.13 bpw, 7.21 GB. Wins prefill everywhere, and decode on H100 / A100 / Blackwell.',
            'Neither is “the fastest”. You pick by card, not by label.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'The benches that matter',
        },
        {
          type: 'paragraph',
          text: 'EvalScope + vLLM, H100, **thinking mode**, 14 benches, same infra. Vendor numbers — a ceiling, not an independent repro — but the protocol is at least aligned across variants:',
        },
        {
          type: 'list',
          items: [
            'Qwen3.8-27B FP16: 86.32 avg · 54 GB · 16 bpw',
            'UD-Q4_K_XL (“4-bit”): 85.18 · 17.6 GB · **5.2** true bpw',
            'IQ2_XXS (“2-bit”): 72.59 · 9.4 GB · **2.8** true bpw',
            '**Bonsai 2**: **84.78** · **5.9 GB** · **1.72** bpw → **98.2%** of FP16',
          ],
        },
        {
          type: 'paragraph',
          text: 'IQ2_XXS looks fine on MMLU-Redux (88.9) and falls over as soon as the reasoning chain gets long: AIME26 **57.5**, LiveCodeBench **56.4**. Bonsai 2 holds **95.83** and **90.07**. Math 96.57 vs 97.06 FP16. Coding **level** with the baseline (89.42 vs 89.07). The remaining gap is mostly knowledge / vision. That’s why a “feels like 2-bit” smoke test misses the collapse.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Throughput, once it fits in RAM',
        },
        {
          type: 'paragraph',
          text: 'Prism numbers, `llama-bench`, batch 1, no vision tower. PQ2_0 unless noted:',
        },
        {
          type: 'list',
          items: [
            'RTX 5090: **130 tok/s** decode · ~1.95 J/tok',
            'RTX 4090: 81 (PQ2_0) / **91** (PTQ1_0)',
            'L4 72 W: ~30 tok/s',
            'M5 Max (pre-rotation figure, pending re-measure): **~47 tok/s** · M5 Pro ~28 · M4 Pro ~18',
            'M5 Pro: **27.5 W** GPU rail — the 27B that does not fit in FP16 at all',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Run it — and the catch',
        },
        {
          type: 'paragraph',
          text: 'Source of truth: [PrismML-Eng/Bonsai-demo](https://github.com/PrismML-Eng/Bonsai-demo). Binaries from the [llama.cpp fork](https://github.com/PrismML-Eng/llama.cpp). **Ollama / stock llama.cpp / ordinary MLX: no.** An MLX loader without the bundled runtime (`model_type: prism_hadamard_qwen35`) does not throw — it **answers wrong**.',
        },
        {
          type: 'code',
          language: 'bash',
          code: `hf download prism-ml/Ternary-Bonsai-2-27B-gguf \\
  Ternary-Bonsai-2-27B-PQ2_0.gguf --local-dir .

./bin/llama-cli -m Ternary-Bonsai-2-27B-PQ2_0.gguf \\
  -ngl 99 -fa on -c 32768 \\
  --temp 1.0 --top-p 0.95 --top-k 20 \\
  -p "Explain quantum computing in simple terms." -n 256`,
        },
        {
          type: 'list',
          items: [
            'Thinking: `temp=1.0`, `top_p=0.95`, `top_k=20`. Instruct: `temp=0.7`, `top_p=0.8`, `presence_penalty=1.5`.',
            '`reasoning_effort=low` is **not** supported — it behaves like `xhigh`. Use `medium` to shorten.',
            'Community [DFlash 2](/blog/dflash2) packs (GGUF / MLX) already exist on day one — a drafter on ternary, to measure, not to believe.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Where it lands in my stack',
        },
        {
          type: 'paragraph',
          text: 'On a 32 GB Mac, 3.8 in 4-bit was already the daily driver. Bonsai 2 is the rung where **the 27B is no longer a VRAM compromise**: you keep RAM for context, a second model, or the drafter. The day the Prism fork (or upstream) lands in Studio / Ollama, it’s the weight I’d try first for a local agent. Until the runtime is a fork, it’s a tool, not the default.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Takeaway',
        },
        {
          type: 'paragraph',
          text: 'Bonsai 2 does not invent a 27B. It **makes 3.8 deployable** where FP16 does not fit, without the collapse of real 2-bit quants. 98% of the thinking average at 6 GB is the number. The contract is the runtime: Hadamard + `PTQ1_0` / `PQ2_0`, or you do not have the model. Prism figures, treat them as a ceiling. The weights are already on the Hub.',
        },
        {
          type: 'list',
          items: [
            'GGUF: [prism-ml/Ternary-Bonsai-2-27B-gguf](https://huggingface.co/prism-ml/Ternary-Bonsai-2-27B-gguf)',
            'MLX: [prism-ml/Ternary-Bonsai-2-27B-mlx-2bit](https://huggingface.co/prism-ml/Ternary-Bonsai-2-27B-mlx-2bit)',
            'Demo: [PrismML-Eng/Bonsai-demo](https://github.com/PrismML-Eng/Bonsai-demo)',
            'Qwen 3.8: [/blog/qwen-3-8-27b](/blog/qwen-3-8-27b) · DFlash 2: [/blog/dflash2](/blog/dflash2)',
          ],
        },
      ],
    },
  },
}
