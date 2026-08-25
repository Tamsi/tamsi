import type { BlogPost } from './types'

const COVER = '/blog/hermes-hud.jpg'
const SOURCE = 'https://x.com/imbabybrooklyn/status/2091725936311910909'

export const hermesHud: BlogPost = {
  slug: 'hermes-hud-wow',
  publishedAt: '2026-08-25',
  tags: ['Hermes', 'Nous', 'Desktop', 'HUD', 'Agents'],
  readingTimeMinutes: 5,
  content: {
    fr: {
      title: 'Hermes HUD — jouer à WoW et prompt en même temps',
      description:
        'Brooklyn (Nous Research) pose l’agent en overlay sur une session WoW. Le HUD n’est plus une fenêtre à alt-tab : c’est une couche, et sa position devient le contexte.',
      blocks: [
        {
          type: 'paragraph',
          text: 'J’ai écrit [pourquoi je passe sur Hermes](/blog/hermes-automation-cheaper-models) pour les workflows qui doivent vivre plus longtemps qu’un chat Cursor. Le 24 août, [Brooklyn](https://x.com/imbabybrooklyn) ([@NousResearch](https://x.com/NousResearch)) pousse le cran d’après : **jouer à WoW et prompt dans la même session**. Pas un deuxième moniteur. Un overlay.',
        },
        {
          type: 'image',
          src: COVER,
          alt: 'Hermes HUD en overlay sur une session World of Warcraft — démo Brooklyn / Nous Research',
          caption:
            'Brooklyn — Hermes HUD mode au-dessus de WoW : overlay, pas une fenêtre à côté.',
          link: {
            href: SOURCE,
            label: 'La démo sur X →',
          },
        },
        {
          type: 'heading',
          level: 2,
          text: 'Pourquoi ça m’intéresse',
        },
        {
          type: 'paragraph',
          text: 'Le goulot d’un agent desktop, ce n’est plus seulement le modèle. C’est **l’attention**. Hermes dans sa fenêtre, c’est encore un alt-tab : tu quittes le jeu, le terminal, Figma, le ticket. Le HUD inverse ça — l’agent vient **sur** le travail, pas à côté. Brooklyn le dit clairement : *a seamless overlay where you can keep an eye on things or ask questions about a game during your session.*',
        },
        {
          type: 'list',
          items: [
            'La démo WoW est le meme. Le produit, c’est **un buddy agent** que tu poses n’importe où.',
            'La barre n’est pas décorative : **là où tu la parks, c’est le contexte**. « this », « here », « that page » pointent ce qu’il y a **dessous**.',
            'Même agent que le CLI / la gateway — mêmes skills, même mémoire, mêmes sessions. Juste une autre surface.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Ce que le HUD est vraiment',
        },
        {
          type: 'paragraph',
          text: 'Dans [Hermes Desktop](https://hermes-agent.nousresearch.com/docs/user-guide/desktop), `⌘/Ctrl+Shift+H` (ou le bouton de titlebar) **détache** le chat : plus de chrome, always-on-top, conversation live + composer. La fenêtre principale s’écarte. Tu déplaces la barre (press-and-hold sur le composer), tu la redimensionnes, `⌘/Ctrl+Shift+G` la **snap** sous le curseur depuis n’importe quelle app.',
        },
        {
          type: 'paragraph',
          text: 'Ce n’est pas nouveau en août. Le HUD « buddy » existe déjà — lire un post X, un chart TradingView, une page Figma, sans quitter l’app. Le tweet WoW, c’est le **mode jeu** par-dessus : quand une app fullscreen **possède** l’écran, le HUD devient un **chat in-game**.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Le mode overlay jeu',
        },
        {
          type: 'paragraph',
          text: 'Brooklyn a mergé [HUD game-overlay](https://github.com/NousResearch/hermes-agent/pull/93484) le jour du tweet — vérifié live sur **Windows 11, WoW fullscreen**. Le détecteur ne prend pas une fenêtre maximisée : il veut un process **edge-to-edge**. Explorer / Finder / Dock ne comptent pas. Hystérésis volontaire : entrer, le jeu doit être ce que tu regardes ; **rester**, le jeu doit juste encore exister — sinon cliquer le HUD pour taper te ferait sortir du mode au moment où tu t’en sers.',
        },
        {
          type: 'list',
          items: [
            'Barre idle en **opacité glanceable** — tu surveilles, tu ne lis pas un log qui fade au mauvais moment.',
            'Le **transcript reste ouvert** tant que le jeu est là, au lieu de disparaître sur un timer.',
            'Encre **light-on-dark** forcée : un thème clair sur une cave WoW, c’est illisible. Tes lignes à toi en **or** — le bleu/violet des UI de jeu les mangerait.',
            '**Borderless fullscreen** (le défaut moderne) + Spaces macOS : l’overlay tient. **Exclusive fullscreen** bypass le compositor — le HUD revient à l’alt-tab, pas de magie.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'En pratique',
        },
        {
          type: 'paragraph',
          text: 'Si tu as déjà `hermes` en CLI, `hermes desktop` ouvre la même config. HUD :',
        },
        {
          type: 'list',
          items: [
            '`⌘/Ctrl+Shift+H` — entrer / sortir. Session intacte au retour.',
            '`⌘/Ctrl+Shift+G` — snap au pointeur (global). No-op sur Wayland natif : le compositor place la fenêtre.',
            'Linux : Hyprland pinne le HUD via IPC. COSMIC ignore souvent `always-on-top` — XWayland si tu en as besoin, au prix du click-through.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Où ça se branche chez moi',
        },
        {
          type: 'paragraph',
          text: 'Je n’ai pas besoin de WoW pour que ça compte. Un agent LivingColor / MCP qui tourne **pendant** que je suis dans Jira, un MR GitLab, ou un replay VisualQ — sans quitter la surface — c’est exactement le contrat du HUD. Cursor reste l’éditeur. Hermes reste l’automatisation longue. Le HUD est la couche qui **cesse de voler le focus**.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Takeaway',
        },
        {
          type: 'paragraph',
          text: 'Le tweet est un clip WoW. Le changement, c’est que Hermes Desktop arrête d’être une app que tu ouvres et devient **une couche que tu poses**. Position = contexte. Fullscreen = chat in-game, pas une fenêtre fantôme. Exclusive fullscreen reste un mur (normal). Pour moi le test, c’est `Shift+H` sur un vrai workflow — pas sur un loading screen.',
        },
        {
          type: 'list',
          items: [
            'Démo : [tweet de Brooklyn](https://x.com/imbabybrooklyn/status/2091725936311910909)',
            'Docs : [Hermes Desktop](https://hermes-agent.nousresearch.com/docs/user-guide/desktop)',
            'PR overlay jeu : [hermes-agent#93484](https://github.com/NousResearch/hermes-agent/pull/93484)',
            'Pourquoi Hermes : [l’article](/blog/hermes-automation-cheaper-models)',
          ],
        },
      ],
    },
    en: {
      title: 'Hermes HUD — play WoW and prompt at the same time',
      description:
        'Brooklyn (Nous Research) drops the agent as an overlay on a WoW session. The HUD is no longer a window you alt-tab to: it’s a layer, and its position is the context.',
      blocks: [
        {
          type: 'paragraph',
          text: 'I wrote [why I’m moving to Hermes](/blog/hermes-automation-cheaper-models) for workflows that should outlive a Cursor chat. On 24 Aug, [Brooklyn](https://x.com/imbabybrooklyn) ([@NousResearch](https://x.com/NousResearch)) ships the next notch: **play WoW and prompt in the same session**. Not a second monitor. An overlay.',
        },
        {
          type: 'image',
          src: COVER,
          alt: 'Hermes HUD overlaid on a World of Warcraft session — demo by Brooklyn / Nous Research',
          caption:
            'Brooklyn — Hermes HUD mode over WoW: overlay, not a window beside the game.',
          link: {
            href: SOURCE,
            label: 'The demo on X →',
          },
        },
        {
          type: 'heading',
          level: 2,
          text: 'Why I care',
        },
        {
          type: 'paragraph',
          text: 'A desktop agent’s bottleneck isn’t only the model. It’s **attention**. Hermes in its own window is still an alt-tab: you leave the game, the terminal, Figma, the ticket. The HUD flips that — the agent comes **onto** the work, not beside it. Brooklyn’s line: *a seamless overlay where you can keep an eye on things or ask questions about a game during your session.*',
        },
        {
          type: 'list',
          items: [
            'The WoW clip is the meme. The product is a **buddy agent** you drop anywhere.',
            'The bar isn’t decoration: **where you park it is context**. “this”, “here”, “that page” resolve to what’s **underneath**.',
            'Same agent as the CLI / gateway — same skills, memory, sessions. Just another surface.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'What the HUD actually is',
        },
        {
          type: 'paragraph',
          text: 'In [Hermes Desktop](https://hermes-agent.nousresearch.com/docs/user-guide/desktop), `⌘/Ctrl+Shift+H` (or the titlebar button) **detaches** chat: chrome-free, always-on-top, live transcript + composer. The main window steps aside. You move the bar (press-and-hold the composer), resize it, and `⌘/Ctrl+Shift+G` **snaps** it to the cursor from any app.',
        },
        {
          type: 'paragraph',
          text: 'That part isn’t new in August. The “buddy” HUD already reads an X post, a TradingView chart, a Figma page without leaving the app. The WoW tweet is the **game mode** on top: when a fullscreen app **owns** the screen, the HUD becomes an **in-game chat frame**.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Game overlay mode',
        },
        {
          type: 'paragraph',
          text: 'Brooklyn merged [HUD game-overlay](https://github.com/NousResearch/hermes-agent/pull/93484) the day of the tweet — verified live on **Windows 11, fullscreen WoW**. The detector ignores a maximized window: it wants another process **edge-to-edge**. Explorer / Finder / Dock never count. Deliberate hysteresis: entering, the game must be what you’re looking at; **staying**, the game just has to still exist — otherwise clicking the HUD to type would drop overlay mode the moment you used it.',
        },
        {
          type: 'list',
          items: [
            'Idle bar at a **glanceable opacity** — you watch, you don’t chase a log that fades at the wrong time.',
            'The **transcript stays open** while the game is there, instead of dying on a timer.',
            '**Light-on-dark ink** is forced: a light theme over a WoW cave is unreadable. Your own lines are **gold** — game-UI blue/purple would vanish.',
            '**Borderless fullscreen** (the modern default) + macOS Spaces: the overlay holds. **Exclusive fullscreen** bypasses the compositor — the HUD comes back on alt-tab. No magic.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'In practice',
        },
        {
          type: 'paragraph',
          text: 'If you already run `hermes` in a CLI, `hermes desktop` opens the same config. HUD:',
        },
        {
          type: 'list',
          items: [
            '`⌘/Ctrl+Shift+H` — enter / exit. Session intact when you come back.',
            '`⌘/Ctrl+Shift+G` — snap to pointer (global). No-op on native Wayland: the compositor owns placement.',
            'Linux: Hyprland pins the HUD via IPC. COSMIC often ignores `always-on-top` — XWayland if you need it, at the cost of click-through.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Where it lands in my stack',
        },
        {
          type: 'paragraph',
          text: 'I don’t need WoW for this to matter. A LivingColor / MCP agent running **while** I’m in Jira, a GitLab MR, or a VisualQ replay — without leaving the surface — is the HUD contract. Cursor stays the editor. Hermes stays the long automation. The HUD is the layer that **stops stealing focus**.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Takeaway',
        },
        {
          type: 'paragraph',
          text: 'The tweet is a WoW clip. The change is that Hermes Desktop stops being an app you open and becomes **a layer you park**. Position = context. Fullscreen = in-game chat, not a ghost window. Exclusive fullscreen is still a wall (fair). For me the test is `Shift+H` on a real workflow — not a loading screen.',
        },
        {
          type: 'list',
          items: [
            'Demo: [Brooklyn’s tweet](https://x.com/imbabybrooklyn/status/2091725936311910909)',
            'Docs: [Hermes Desktop](https://hermes-agent.nousresearch.com/docs/user-guide/desktop)',
            'Game overlay PR: [hermes-agent#93484](https://github.com/NousResearch/hermes-agent/pull/93484)',
            'Why Hermes: [the earlier post](/blog/hermes-automation-cheaper-models)',
          ],
        },
      ],
    },
  },
}
