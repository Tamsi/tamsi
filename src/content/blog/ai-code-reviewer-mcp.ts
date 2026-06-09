import type { BlogPost } from './types'

export const aiCodeReviewerMcp: BlogPost = {
  slug: 'ai-code-reviewer-mcp',
  publishedAt: '2026-05-15',
  tags: ['MCP', 'Code review', 'GitHub'],
  readingTimeMinutes: 5,
  content: {
    fr: {
      title: 'Pourquoi un MCP de revue de code — et pas seulement le chat Cursor',
      description:
        'Donner à l’agent des actions concrètes sur GitHub plutôt qu’un gros prompt « regarde mon repo ».',
      blocks: [
        {
          type: 'paragraph',
          text: 'Demander à Cursor « fais une code review » sur un gros diff, c’est pratique une fois. En répétition — PRs open source, projets clients, mes propres repos — tu veux quelque chose de reproductible : mêmes axes (bugs, sécurité, tests manquants), mêmes sorties, sans re-expliquer le contexte à chaque session.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'L’intérêt du MCP ici',
        },
        {
          type: 'paragraph',
          text: 'ai-code-reviewer-mcp n’est pas une « meilleure prompt engineering ». C’est exposer des outils : lire le diff, cibler un fichier, formuler un commentaire PR. L’agent choisit les étapes ; moi je contrôle ce qu’il a le droit de toucher. Ça évite les reviews vague-du-vendredi et ça s’accroche au modèle distant (tokens gratuits) dont je parle dans l’autre article.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Pourquoi c’est utile pour moi',
        },
        {
          type: 'list',
          items: [
            'Open source : feedback structuré avant de merge, sans ouvrir cinq onglets.',
            'Même logique branchée sur mon Qwen distant (vLLM sur AWS) — pas de surcoût Cursor par review.',
            'Démo Gradio sur Hugging Face pour montrer le concept sans installer MCP.',
            'Template pour d’autres intégrations « l’AI agit sur un vrai système ».',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Comment c’est monté (en bref)',
        },
        {
          type: 'paragraph',
          text: 'Serveur MCP TypeScript (stdio) + Octokit pour GitHub + client OpenAI-compatible branché sur le Qwen servi en vLLM sur AWS. Les outils découpent la review : lister les fichiers du diff, récupérer un hunk, analyser avec un prompt ciblé (bug / sécurité / dette / tests).',
        },
        {
          type: 'list',
          items: [
            '`list_changed_files` / `get_file_diff` — contexte minimal, pas le repo entier.',
            '`analyze_snippet` — un focus à la fois, sortie JSON structurée.',
            'Même stack LLM que Cursor (base URL custom) → tokens gratuits, pas de double facturation.',
            'Space Gradio sur Hugging Face : même moteur d’analyse, sans couche MCP, pour démo publique.',
          ],
        },
        {
          type: 'code',
          language: 'typescript',
          code: `// Un outil = une responsabilité
server.tool('analyze_snippet', { path, diffHunk, focus }, async (input) => {
  const findings = await llmReview(input) // → vLLM AWS
  return { content: [{ type: 'text', text: JSON.stringify(findings) }] }
})`,
        },
        {
          type: 'heading',
          level: 2,
          text: 'En bref',
        },
        {
          type: 'paragraph',
          text: 'Je n’ai pas construit ça pour remplacer un humain en review finale. Je l’ai construit pour automatiser la première passe — celle que personne n’a envie de refaire à la main — et pour prouver que MCP + LLM self-hosted, c’est un combo crédible en dehors des demos Twitter.',
        },
      ],
    },
    en: {
      title: 'Why an MCP code reviewer — not just the Cursor chat',
      description:
        'Give the agent concrete GitHub actions instead of one big “look at my repo” prompt.',
      blocks: [
        {
          type: 'paragraph',
          text: 'Asking Cursor to “code review this” on a large diff is fine once. On repeat — open source PRs, client projects, my own repos — you want something reproducible: same angles (bugs, security, missing tests), same outputs, without re-explaining context every session.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Why MCP here',
        },
        {
          type: 'paragraph',
          text: 'ai-code-reviewer-mcp isn’t “better prompt engineering.” It’s exposed tools: read the diff, target a file, draft a PR comment. The agent picks steps; I control what it’s allowed to touch. That kills vague Friday-afternoon reviews and pairs well with the remote model (free tokens) from my other post.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Why it’s useful for me',
        },
        {
          type: 'list',
          items: [
            'Open source: structured feedback before merge, without five tabs open.',
            'Same logic on my remote Qwen (vLLM on AWS) — no extra Cursor cost per review.',
            'Gradio demo on Hugging Face to show the idea without installing MCP.',
            'Template for other “AI acts on a real system” integrations.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'How it’s built (briefly)',
        },
        {
          type: 'paragraph',
          text: 'TypeScript MCP server (stdio) + Octokit for GitHub + OpenAI-compatible client on Qwen served via vLLM on AWS. Tools split the review: list diff files, fetch a hunk, analyze with a focused prompt (bug / security / debt / tests).',
        },
        {
          type: 'list',
          items: [
            '`list_changed_files` / `get_file_diff` — minimal context, not the whole repo.',
            '`analyze_snippet` — one focus at a time, structured JSON output.',
            'Same LLM stack as Cursor (custom base URL) → free tokens, no double billing.',
            'Gradio Space on Hugging Face: same analysis engine, no MCP layer, for public demos.',
          ],
        },
        {
          type: 'code',
          language: 'typescript',
          code: `// One tool = one responsibility
server.tool('analyze_snippet', { path, diffHunk, focus }, async (input) => {
  const findings = await llmReview(input) // → vLLM on AWS
  return { content: [{ type: 'text', text: JSON.stringify(findings) }] }
})`,
        },
        {
          type: 'heading',
          level: 2,
          text: 'In short',
        },
        {
          type: 'paragraph',
          text: 'I didn’t build this to replace a human on final review. I built it to automate the first pass — the one nobody wants to redo by hand — and to show MCP + self-hosted LLM is a credible combo outside Twitter demos.',
        },
      ],
    },
  },
}
