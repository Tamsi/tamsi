import type { BlogPost } from './types'

export const redbeeMcp: BlogPost = {
  slug: 'redbee-mcp',
  publishedAt: '2026-05-01',
  tags: ['MCP', 'Red Bee', 'API', 'Travail'],
  readingTimeMinutes: 5,
  content: {
    fr: {
      title: 'redbee-mcp : tester les APIs OTT au quotidien avec mon AI',
      description:
        'Monté très vite quand MCP est sorti — pour que Cursor appelle les vraies APIs Red Bee Media dont j’ai besoin au travail.',
      blocks: [
        {
          type: 'paragraph',
          text: 'Quand le Model Context Protocol est arrivé, l’intérêt m’a paru évident : enfin un moyen standard de brancher l’IDE sur des outils réels, pas seulement sur le code du repo. Je travaille avec les APIs Red Bee Media (OTT, streaming). Doc, Postman, copier-coller de tokens — ça fonctionne, mais ça casse le flow quand tu veux juste vérifier un endpoint pendant une feature.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Pourquoi je l’ai fait si vite',
        },
        {
          type: 'paragraph',
          text: 'Pas pour publier un projet GitHub stylé. Parce que le jour où MCP est devenu utilisable dans Cursor, j’ai vu le cas d’usage immédiat : « demain matin, je veux demander à l’agent de lister les assets, lancer un playback test, ou debug une réponse 403 » sans quitter la conversation. redbee-mcp, c’est ce pont — Python, quelques outils MCP, les endpoints que j’utilise déjà en prod chez des clients.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Ce que ça change au quotidien',
        },
        {
          type: 'list',
          items: [
            'L’AI ne devine plus la forme des APIs : elle les appelle, voit la vraie réponse JSON, adapte le code ensuite.',
            'Moins de aller-retour doc ↔ IDE ↔ Postman ; surtout sur des plateformes avec beaucoup de surfaces (catalogue, DRM, analytics…).',
            'Tests exploratoires en langage naturel : « essaie cette série avec tel customer token » — utile en debug, pas seulement en démo.',
            'Base réutilisable : même pattern pour d’autres APIs métier derrière MCP.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Comment c’est monté (en bref)',
        },
        {
          type: 'paragraph',
          text: 'Serveur MCP Python en stdio — le pattern le plus simple pour Cursor. Chaque outil correspond à un appel HTTP que je faisais déjà à la main : catalogue, métadonnées asset, session playback, etc. Les credentials restent en variables d’environnement côté serveur ; l’agent ne voit que les réponses JSON.',
        },
        {
          type: 'list',
          items: [
            'SDK MCP Python + `httpx` pour les requêtes Red Bee.',
            'Un outil = un endpoint documenté (params typés, erreurs remontées telles quelles).',
            'Config dans `.cursor/mcp.json` : commande `uv run` ou `python -m redbee_mcp`.',
            'Première version en quelques heures : copier les headers auth existants, pas réinventer l’API.',
          ],
        },
        {
          type: 'code',
          language: 'json',
          code: `{
  "mcpServers": {
    "redbee": {
      "command": "uv",
      "args": ["run", "redbee-mcp"],
      "env": {
        "REDBEE_BASE_URL": "https://…",
        "REDBEE_API_KEY": "…"
      }
    }
  }
}`,
        },
        {
          type: 'heading',
          level: 2,
          text: 'L’idée à retenir',
        },
        {
          type: 'paragraph',
          text: 'MCP n’est pas qu’un buzzword open source. Pour moi c’était le premier protocole où ça valait le coup de coder un serveur en urgence parce que le ROI était visible le lundi suivant. redbee-mcp est modeste en taille ; l’intérêt, c’est le temps gagné à chaque sprint quand l’agent parle enfin la langue de la plateforme sur laquelle je facture.',
        },
      ],
    },
    en: {
      title: 'redbee-mcp: testing OTT APIs day-to-day with my AI',
      description:
        'Built in a hurry when MCP landed — so Cursor could call the real Red Bee Media APIs I need at work.',
      blocks: [
        {
          type: 'paragraph',
          text: 'When the Model Context Protocol showed up, the point felt obvious: finally a standard way to plug the IDE into real tools, not just repo code. I work with Red Bee Media APIs (OTT, streaming). Docs, Postman, copy-pasting tokens — it works, but it breaks flow when you only want to sanity-check an endpoint mid-feature.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Why I shipped it so fast',
        },
        {
          type: 'paragraph',
          text: 'Not to publish a polished GitHub project. Because the day MCP became usable in Cursor, I saw the immediate use case: “tomorrow morning I want to ask the agent to list assets, run a playback test, or debug a 403” without leaving the chat. redbee-mcp is that bridge — Python, a few MCP tools, the endpoints I already use in production for clients.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'What it changes day-to-day',
        },
        {
          type: 'list',
          items: [
            'The AI stops guessing API shapes: it calls them, sees real JSON, then adjusts code.',
            'Fewer doc ↔ IDE ↔ Postman loops — especially on platforms with many surfaces (catalog, DRM, analytics…).',
            'Exploratory tests in plain language: “try this series with that customer token” — handy in debug, not just demos.',
            'Reusable pattern for other business APIs behind MCP.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'How it’s built (briefly)',
        },
        {
          type: 'paragraph',
          text: 'Python MCP server over stdio — the simplest pattern for Cursor. Each tool maps to an HTTP call I was already making by hand: catalog, asset metadata, playback session, etc. Credentials stay in server-side env vars; the agent only sees JSON responses.',
        },
        {
          type: 'list',
          items: [
            'Python MCP SDK + `httpx` for Red Bee requests.',
            'One tool = one documented endpoint (typed params, errors surfaced as-is).',
            'Config in `.cursor/mcp.json`: `uv run` or `python -m redbee_mcp` command.',
            'First version in a few hours: reuse existing auth headers, don’t reinvent the API.',
          ],
        },
        {
          type: 'code',
          language: 'json',
          code: `{
  "mcpServers": {
    "redbee": {
      "command": "uv",
      "args": ["run", "redbee-mcp"],
      "env": {
        "REDBEE_BASE_URL": "https://…",
        "REDBEE_API_KEY": "…"
      }
    }
  }
}`,
        },
        {
          type: 'heading',
          level: 2,
          text: 'Takeaway',
        },
        {
          type: 'paragraph',
          text: 'MCP isn’t just open source hype. For me it was the first protocol worth hacking a server over a weekend because the ROI showed up the following Monday. redbee-mcp is small; the value is time saved every sprint when the agent finally speaks the language of the platform I bill on.',
        },
      ],
    },
  },
}
