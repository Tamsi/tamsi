import type { BlogPost } from './types'

const COVER = '/blog/jev-harness.png'
const SOURCE = 'https://www.langchain.com/blog/building-a-harness-with-jev'

export const jevHarness: BlogPost = {
  slug: 'jev-harness',
  publishedAt: '2026-09-18',
  tags: ['Jev', 'TypeSafe', 'LangChain', 'Agents', 'Harness'],
  readingTimeMinutes: 6,
  content: {
    fr: {
      title: 'Jev — classer sans payer un LLM à chaque tour',
      description:
        'TypeSafe sort Jev, un modèle System One : décisions typées, pas de texte. LangChain en fait un classificateur de harness — routing et auto-mode — à une fraction du coût d’un chat.',
      blocks: [
        {
          type: 'paragraph',
          text: 'Un agent, c’est une boucle : le LLM décide, un outil s’exécute, on réévalue, on recommence. Tool calling et structured output ont rendu ça branchable dans du vrai code. Le coût, lui, n’a pas bougé : **chaque micro-décision** — urgent ou pas, modèle cheap ou gros, `bash` dangereux ou non — relance un forward de chat. [Sydney Runkle et Hunter Lovell](https://www.langchain.com/blog/building-a-harness-with-jev) (LangChain, 17 septembre 2026) posent Jev pile là. Pas un LLM de plus. Un classificateur fait pour le harness.',
        },
        {
          type: 'image',
          src: COVER,
          alt: 'Building a Harness with Jev — article LangChain',
          caption:
            'LangChain — Jev (TypeSafe AI) dans la boucle agent : décisions typées, pas une autre complétion chat.',
          link: {
            href: SOURCE,
            label: 'L’article LangChain →',
          },
        },
        {
          type: 'heading',
          level: 2,
          text: 'Pourquoi ça m’intéresse',
        },
        {
          type: 'paragraph',
          text: 'Cursor, Claude Code, Codex : tous ont un classificateur **avant** l’outil dangereux. C’est ce qui rend l’auto-mode vivable. Et c’est resté dans la partie fermée du harness. Dès que tu construis le tien — Hermes, LangGraph, un MCP qui enchaîne — tu paies un LLM pour des oui/non. Jev attaque exactement ça : **décision calibrée**, pas une phrase.',
        },
        {
          type: 'list',
          items: [
            'TypeSafe annonce jusqu’à **~200×** plus vite et **~400×** moins cher que des LLM comparables sur de la classification (leurs benches System One : 193,6× / 444,6×).',
            'Prix affiché : **42 $ le milliard** de tokens d’entrée — 238× sous Claude Fable 5.1 en input.',
            'Ça ne génère **pas de texte**. Ton code lit une proba et un seuil, puis agit.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Ce que Jev est vraiment',
        },
        {
          type: 'paragraph',
          text: 'TypeSafe appelle ça un **System One model** : tu envoies un *state* (texte, JSON, messages LangChain) et des *questions*. Tu reçois des réponses **typées** + une confiance calibrée. Entraînement : RLCD (reinforcement learning for calibrated decisions), pas du RLHF chat. Le modèle n’essaie pas de te plaire. Il estime P(énoncé).',
        },
        {
          type: 'paragraph',
          text: 'Trois types de questions, plusieurs en **parallèle** sur le même state — le temps de réponse bouge à peine, tu paies surtout les tokens des questions :',
        },
        {
          type: 'list',
          items: [
            '**Noul** — oui/non. Renvoie `noul` ∈ [0, 1] : proba que l’énoncé soit vrai.',
            '**Choice** — une option parmi un set. Distribution + score de confiance.',
            '**Score** — un niveau ordonné (low / medium / high). Score continu + distribution.',
          ],
        },
        {
          type: 'paragraph',
          text: 'L’exemple support de leurs docs : un ticket Stripe qui « fail depuis 3 jours, je perds des ventes » → `is_urgent.noul = 0.999`. Ton routeur priorise. Pas de paragraphe, pas de « je pense que ».',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Dans LangChain',
        },
        {
          type: 'paragraph',
          text: 'Le package `langchain-typesafe` n’expose pas un chat model. C’est un **`TypeSafeClassifier`**. Tu `.invoke()` state + questions, tu lis `response.nouls[...]`.',
        },
        {
          type: 'code',
          language: 'python',
          code: `from langchain_typesafe import Noul, TypeSafeClassifier

classifier = TypeSafeClassifier()

response = classifier.invoke(
    state=(
        "The deploy failed twice and customers are seeing 500s. "
        "Can someone look now?"
    ),
    questions={
        "urgent": Noul(
            instructions="Does this need attention right now?"
        ),
    },
)

urgency = response.nouls["urgent"].noul`,
        },
        {
          type: 'paragraph',
          text: 'Deux middlewares expérimentaux collent au harness :',
        },
        {
          type: 'list',
          items: [
            '**`ModelRouterMiddleware`** — Jev lit le dernier message, choisit `fast` vs `powerful` selon tes critères. Le lookup ne paie plus un Sol.',
            '**`AutoModeMiddleware`** — Jev inspecte l’appel d’outil (ex. `bash`) et **bloque avant exécution** si le risque dépasse le seuil. Le pattern Cursor/Claude, en ouvert, sur n’importe quel `create_agent`.',
          ],
        },
        {
          type: 'code',
          language: 'python',
          code: `from langchain.agents import create_agent
from langchain_typesafe.experimental.middleware import AutoModeMiddleware

guardrail = AutoModeMiddleware(tools=["bash"])
agent = create_agent("openai:gpt-5.6-luna", middleware=[guardrail])`,
        },
        {
          type: 'heading',
          level: 2,
          text: 'Où ça se branche chez moi',
        },
        {
          type: 'paragraph',
          text: 'Sur [Hermes](/blog/hermes-automation-cheaper-models), le coût d’une session longue n’est plus le gros raisonnement. C’est les **centaines de classifs** autour : est-ce que ce skill est le bon, est-ce que ce shell est safe, est-ce que je wake un 27B. Jev est le morceau que je mettrais *devant* le modèle — local ou API — pas à la place. LivingColor, revue MCP, triage mail : le LLM écrit et planifie ; Jev dit oui/non assez vite pour ne pas casser la boucle.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Takeaway',
        },
        {
          type: 'paragraph',
          text: 'Jev n’est pas un concurrent de [Qwen 3.8](/blog/qwen-3-8-27b). C’est l’étage que les harness gardaient private : un classificateur calibré, assez cheap pour tourner **à chaque tool call**. TypeSafe pousse le récit System One (machines, pas chat). LangChain le rend pluggable demain matin. Le test concret, c’est un `AutoModeMiddleware` sur un agent qui a déjà le droit à `bash` — et regarder ce qu’il refuse, pas le blog.',
        },
        {
          type: 'list',
          items: [
            'Source : [langchain.com/blog/building-a-harness-with-jev](https://www.langchain.com/blog/building-a-harness-with-jev)',
            'TypeSafe : [typesafe.ai](https://www.typesafe.ai/)',
            'Package : `langchain-typesafe`',
            'Hermes : [/blog/hermes-automation-cheaper-models](/blog/hermes-automation-cheaper-models)',
          ],
        },
      ],
    },
    en: {
      title: 'Jev — classify without paying an LLM every turn',
      description:
        'TypeSafe ships Jev, a System One model: typed decisions, no text. LangChain turns it into a harness classifier — routing and auto-mode — at a fraction of chat cost.',
      blocks: [
        {
          type: 'paragraph',
          text: 'An agent is a loop: the LLM decides, a tool runs, you re-evaluate, repeat. Tool calling and structured output made that pluggable into real software. The cost didn’t move: **every micro-decision** — urgent or not, cheap model or large, dangerous `bash` or not — still fires a chat forward. [Sydney Runkle and Hunter Lovell](https://www.langchain.com/blog/building-a-harness-with-jev) (LangChain, 17 Sep 2026) drop Jev exactly there. Not another LLM. A classifier built for the harness.',
        },
        {
          type: 'image',
          src: COVER,
          alt: 'Building a Harness with Jev — LangChain post',
          caption:
            'LangChain — Jev (TypeSafe AI) in the agent loop: typed decisions, not another chat completion.',
          link: {
            href: SOURCE,
            label: 'The LangChain post →',
          },
        },
        {
          type: 'heading',
          level: 2,
          text: 'Why I care',
        },
        {
          type: 'paragraph',
          text: 'Cursor, Claude Code, Codex: they all classify **before** a dangerous tool. That’s what makes auto-mode livable. And it stayed in the closed part of the harness. The moment you build your own — Hermes, LangGraph, a chaining MCP — you pay an LLM for yes/no. Jev hits that: a **calibrated decision**, not a sentence.',
        },
        {
          type: 'list',
          items: [
            'TypeSafe claims up to **~200×** faster and **~400×** cheaper than comparable LLMs on classification (their System One benches: 193.6× / 444.6×).',
            'List price: **$42 per billion** input tokens — 238× under Claude Fable 5.1 on input.',
            'It **doesn’t generate text**. Your code reads a probability and a threshold, then acts.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'What Jev actually is',
        },
        {
          type: 'paragraph',
          text: 'TypeSafe calls it a **System One model**: you send a *state* (text, JSON, LangChain messages) and *questions*. You get **typed** answers plus calibrated confidence. Training: RLCD (reinforcement learning for calibrated decisions), not chat RLHF. The model isn’t trying to please you. It estimates P(statement).',
        },
        {
          type: 'paragraph',
          text: 'Three question types, several in **parallel** on the same state — latency barely moves, you mostly pay the question tokens:',
        },
        {
          type: 'list',
          items: [
            '**Noul** — yes/no. Returns `noul` ∈ [0, 1]: probability the statement is true.',
            '**Choice** — one option from a set. Distribution plus a confidence score.',
            '**Score** — an ordered level (low / medium / high). Continuous score plus distribution.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Their docs’ support example: a Stripe ticket failing for three days, “I’m losing sales” → `is_urgent.noul = 0.999`. Your router prioritizes. No paragraph. No “I think”.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'In LangChain',
        },
        {
          type: 'paragraph',
          text: '`langchain-typesafe` does not expose a chat model. It’s a **`TypeSafeClassifier`**. You `.invoke()` state + questions, you read `response.nouls[...]`.',
        },
        {
          type: 'code',
          language: 'python',
          code: `from langchain_typesafe import Noul, TypeSafeClassifier

classifier = TypeSafeClassifier()

response = classifier.invoke(
    state=(
        "The deploy failed twice and customers are seeing 500s. "
        "Can someone look now?"
    ),
    questions={
        "urgent": Noul(
            instructions="Does this need attention right now?"
        ),
    },
)

urgency = response.nouls["urgent"].noul`,
        },
        {
          type: 'paragraph',
          text: 'Two experimental middlewares map onto a harness:',
        },
        {
          type: 'list',
          items: [
            '**`ModelRouterMiddleware`** — Jev reads the latest message, picks `fast` vs `powerful` from your criteria. A lookup no longer pays for a Sol.',
            '**`AutoModeMiddleware`** — Jev inspects the tool call (e.g. `bash`) and **blocks before execution** if risk crosses the threshold. The Cursor/Claude pattern, open, on any `create_agent`.',
          ],
        },
        {
          type: 'code',
          language: 'python',
          code: `from langchain.agents import create_agent
from langchain_typesafe.experimental.middleware import AutoModeMiddleware

guardrail = AutoModeMiddleware(tools=["bash"])
agent = create_agent("openai:gpt-5.6-luna", middleware=[guardrail])`,
        },
        {
          type: 'heading',
          level: 2,
          text: 'Where it lands in my stack',
        },
        {
          type: 'paragraph',
          text: 'On [Hermes](/blog/hermes-automation-cheaper-models), a long session’s cost is no longer the big reasoning pass. It’s the **hundreds of classifs** around it: is this the right skill, is this shell safe, do I wake a 27B. Jev is the piece I’d put *in front of* the model — local or API — not instead of it. LivingColor, MCP review, mail triage: the LLM writes and plans; Jev says yes/no fast enough not to stall the loop.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Takeaway',
        },
        {
          type: 'paragraph',
          text: 'Jev is not a rival to [Qwen 3.8](/blog/qwen-3-8-27b). It’s the layer harnesses kept private: a calibrated classifier, cheap enough to run **on every tool call**. TypeSafe sells the System One story (machines, not chat). LangChain makes it pluggable tomorrow morning. The real test is an `AutoModeMiddleware` on an agent that already has `bash` — and watching what it refuses, not the blog.',
        },
        {
          type: 'list',
          items: [
            'Source: [langchain.com/blog/building-a-harness-with-jev](https://www.langchain.com/blog/building-a-harness-with-jev)',
            'TypeSafe: [typesafe.ai](https://www.typesafe.ai/)',
            'Package: `langchain-typesafe`',
            'Hermes: [/blog/hermes-automation-cheaper-models](/blog/hermes-automation-cheaper-models)',
          ],
        },
      ],
    },
  },
}
