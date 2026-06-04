export type InterestMedia = {
  image: string
  imageAlt: string
  link: string
  linkLabel: string
  /** Local muted loop (no YouTube chrome). */
  video: string
}

export const interestMediaById: Record<string, InterestMedia> = {
  cursor: {
    image: '/interests/cursor.jpg',
    imageAlt: 'Cursor — AI code editor',
    link: 'https://cursor.com',
    linkLabel: 'cursor.com',
    video: '/interests/videos/cursor.mp4',
  },
  llm: {
    image: '/interests/ollama.jpg',
    imageAlt: 'Ollama — local open models',
    link: 'https://ollama.com',
    linkLabel: 'ollama.com',
    video: '/interests/videos/ollama.mp4',
  },
  mcp: {
    image: '/interests/mcp.png',
    imageAlt: 'Model Context Protocol',
    link: 'https://modelcontextprotocol.io',
    linkLabel: 'modelcontextprotocol.io',
    video: '/interests/videos/mcp.mp4',
  },
  automation: {
    image: '/interests/playwright.jpg',
    imageAlt: 'Playwright — browser automation',
    link: 'https://playwright.dev',
    linkLabel: 'playwright.dev',
    video: '/interests/videos/playwright.mp4',
  },
  hermes: {
    image: '/interests/hermes.png',
    imageAlt: 'Hermes Agent by Nous Research',
    link: 'https://hermes-agent.nousresearch.com/',
    linkLabel: 'hermes-agent.nousresearch.com',
    video: '/interests/videos/hermes.mp4',
  },
}
