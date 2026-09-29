import type { BlogPost } from './types'

const OPUS = 'https://www.anthropic.com/claude-opus-5-5'
const SONNET = 'https://www.anthropic.com/claude-sonnet-5-5'

export const claudeOpusSonnet55: BlogPost = {
  slug: 'claude-opus-sonnet-5-5',
  publishedAt: '2026-09-29',
  tags: ['Claude', 'Opus', 'Sonnet', 'Anthropic', 'Agents'],
  readingTimeMinutes: 10,
  content: {
    fr: {
      title: 'Opus 5.5 et Sonnet 5.5 — le jugement d’un côté, le débit de l’autre',
      description:
        'Opus 5.5 (22 septembre) au niveau de Fable 5.1, 40 % moins cher qu’Opus 5. Sonnet 5.5 (28 septembre) au tarif de Sonnet 5, 30 % plus rapide, collé à Opus sur le travail cadré.',
      blocks: [
        {
          type: 'paragraph',
          text: 'En six jours, Anthropic a posé les deux premiers modèles de la famille Claude 5.5. [Opus 5.5](https://www.anthropic.com/claude-opus-5-5) le 22 septembre, [Sonnet 5.5](https://www.anthropic.com/claude-sonnet-5-5) le 28. Opus est la première sortie depuis l’appel à ralentir la frontière : le labo le place au niveau de Fable 5.1 sur la plupart du travail, 40 % moins cher à servir qu’Opus 5. Sonnet est le complément — tâches cadrées, bugs, documents, slides, tableurs, et un œil pour le design. Haiku 5.5 est nommé pour les semaines qui viennent, sans prix ni identifiant public. Les marges de bench, à ce niveau, sont un guide fragile : l’annonce Opus dit que l’écart ressenti avec Fable est plus étroit que les scores. Je lis les tableaux comme un plafond vendeur, effort et garde-fous inclus.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Prix et vitesse',
        },
        {
          type: 'paragraph',
          text: 'Par million de tokens. Opus 5.5 : entrée **4 $**, sortie **20 $**, lectures de cache **0,20 $**, écritures **5 $**. Opus 5 était à 5 $ / 25 $ / 0,50 $ / 6,25 $. Le mode rapide d’Opus (jusqu’à 2,5×, Claude Code et la Platform) passe à 8 $ / 40 $. Sonnet 5.5 : entrée **2 $**, sortie **10 $**, lectures de cache **0,20 $**, écritures **2,50 $**. Entrée, sortie et lectures de cache reprennent la grille de Sonnet 5.',
        },
        {
          type: 'list',
          items: [
            'Charge typique : Opus 5.5 coûte 40 % de moins qu’Opus 5 (token moins cher, et moins de tokens par tâche). Sonnet 5.5 coûte jusqu’à 30 % de moins par tâche que Sonnet 5, surtout parce qu’il écrit moins.',
            'Les deux génèrent plus de 30 % plus vite que leur prédécesseur. Sonnet 5.5 est le Sonnet le plus rapide à ce jour.',
            'Les lectures de cache, qui dominent la facture d’un agent de code, sont au même prix : 0,20 $. L’écart qui reste, c’est l’entrée, la sortie, et les écritures de cache (2,50 $ contre 5 $).',
            'Avec Opus, Anthropic relève les plafonds de cinq heures sur Pro, Max, Team, et sur l’Enterprise facturé au siège, plus un reset de rate limit à garder pour plus tard.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Code',
        },
        {
          type: 'paragraph',
          text: 'Sur plusieurs evals, Sonnet 5.5 à effort max se tient à côté d’Opus. Anthropic ajoute que, dans ses tests et ceux des testeurs externes, Opus reste nettement plus fort dès que le travail est ouvert et qu’il faut tenir un jugement. Le défaut dans Claude Code et les apps est Medium ; sur la Platform, c’est High. Sonnet complète Opus surtout aux efforts bas. Aux efforts hauts, scores et coût se rapprochent.',
        },
        {
          type: 'list',
          items: [
            'Terminal-Bench 4.0 : Sonnet 5.5 **70,6 %** · Opus 5.5 xhigh **66,4 %** · Astra high 57,9 % · Fable 55,8 % · Opus 5 52,3 % · Sonnet 5 10,3 %. [The New Stack](https://thenewstack.io/claude-sonnet-55-launch/) rapporte que les mainteneurs du bench ont vu Sonnet 5 buter sur des timeouts et des limites de tokens, ce qui aide à lire le 10,3 %.',
            'FrontierCode v1.1 (le diff serait-il mergé, hors-scope pénalisé) : Opus **54,4 %** max / **54,6 %** medium, au-dessus du meilleur Astra publié (53,3 %) pour environ un cinquième du coût. Sonnet **52,1 %** xhigh / **46,2 %** max · GPT-6 Sol 49,3 % · Sonnet 5 42,4 %. Le max sous le xhigh est documenté : à max, Sonnet lance plus souvent la revue Claude Code en sous-agents. Dans deux cas vus par Cognition, timeout ou edits hors sujet.',
            'CursorBench 4.0 : Opus **57,8 %** max / **52,5 %** medium · Sonnet **55,5 %** · Fable max 51,8 % · Opus 5 max 46,6 % · Sonnet 5 34,1 %.',
            'Coût annoncé : à effort high, Sonnet prend 10 points à Sonnet 5 sur FrontierCode pour environ un quinzième du coût. À effort low sur CursorBench, et à effort medium sur Terminal-Bench, il dépasse le meilleur Sonnet 5 pour moins d’un dixième du coût.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Ordres de grandeur cités par Anthropic, pas des mesures à moi. Migration de 680 000 lignes en moins d’une journée avec Opus 5.5. Audit de 200 000 lignes sous trois heures, là où Opus 5 prenait plus de 20 heures et 2,5× plus de tokens. HAProxy réécrit de C vers Rust : presque toute la non-régression chez Opus 5.5 et Fable, Opus en 9,5 h contre 12 h, 51 % moins cher. Chez Lovable, sur 118 builds, Sonnet 5.5 arrive au niveau d’Opus 5 en 3,6 itérations en moyenne, contre 7,7.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Travail de connaissance',
        },
        {
          type: 'list',
          items: [
            'GDPval-AA v2.1 (44 métiers) : Opus **1846** Elo · Sonnet **1844** · Fable 1735 · Opus 5 1708 · Sonnet 5 1449.',
            'AA-Briefcase v1.1 : Opus **1822** · Sonnet **1811** · Sonnet 5 1359.',
            'Humanity’s Last Exam, avec outils : Opus **67,7 %** · Fable 65,6 % · Sonnet **64,5 %** · Sonnet 5 54,9 %.',
            'OSWorld, partiel : Opus **81,8 %** (2.0 dans son annonce, 2.1 dans le tableau Sonnet) · Sonnet **80,1 %** sur 2.1 · Sonnet 5 57,0 % · Opus 5 74,0 % sur 2.0.',
            'Chartography sans outils : Opus 64,4 % · Sonnet **61,6 %** · Sonnet 5 15,6 %. Avec outils, Opus annonce 89,0 %.',
            'Là où Opus 5.5 n’est pas devant : Terminal-Bench-Science 0.1, Astra **64,6 %** contre Opus 58,7 % (pas de chiffre Sonnet 5.5). AutomationBench, Astra **41,4 %** contre Opus 40,0 % — et ce 40 % est un plancher, une intervention des garde-fous compte comme un échec.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Sonnet 5.5 est aussi le premier Sonnet à finir Pokémon Red à partir des seules captures d’écran. Les deux 5.5 écrivent plus clairement que la génération d’avant : l’info importante d’abord, moins de jargon. Sur une session longue, ça pèse autant que deux points de CursorBench.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Garde-fous',
        },
        {
          type: 'paragraph',
          text: 'Opus 5.5 a le meilleur score à ce jour sur l’audit comportemental d’Anthropic. Moins enclin aux actions difficiles à annuler, plus résistant qu’Opus 5 à l’injection de prompt — à égalité avec Fable chez Gray Swan pour le plus bas taux de succès. Évalué avant la sortie par Frontier Design et METR. Bio et cyber comparables à Mythos 5.1, donc safeguards du calibre de Fable. Life Sciences Verification est ouvert ; Cyber Verification s’élargit dans les semaines qui viennent. Les benches d’Opus tournent avec ces safeguards : s’ils interviennent, le cyber est fini par Opus 4.8, la bio et le développement de LLM frontier par Opus 5. Anthropic dit que ça baisse probablement les scores.',
        },
        {
          type: 'paragraph',
          text: 'Sonnet 5.5 n’avance pas la frontière des capacités du labo. Sur ~1 850 scénarios, il est au niveau ou au-dessus de Sonnet 5 sur la plupart des mesures d’alignement. C’est le modèle Anthropic le moins enclin à sonder son conteneur, et il s’approche d’Opus pour la rareté des sorties de sandbox. Cyber au niveau d’Opus 5 : premier Sonnet avec ces safeguards, et les requêtes à haut risque retombent sur Sonnet 5. La bio reste celle de Sonnet 5. Premier Sonnet aussi avec des classifieurs anti-distillation et un preserved thinking élargi : le raisonnement reste attaché au compte qui l’a produit.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Comment je les répartis',
        },
        {
          type: 'paragraph',
          text: 'Je n’ai pas encore rejoué mes boucles (revue, refactors, MCP) sur les deux identifiants. Le découpage est une lecture des annonces.',
        },
        {
          type: 'list',
          items: [
            'Sonnet 5.5 en low ou medium : bugs cadrés, revue, docs, slides, UI. C’est là que le 2 $ / 10 $ et le débit se voient.',
            'Opus 5.5 : migrations, audits, nuits multi-dépôts, jugement quand la spec est floue.',
            'Si Sonnet est déjà en xhigh ou max et que la facture rejoint Opus, je bascule. Le 70,6 % de Terminal-Bench ne remplace pas cette bascule.',
            'API : `claude-sonnet-5-5`. Si le thinking était coupé, passer à `between_tools` avant de migrer. Les deux sont sur AWS, Google Cloud et Azure, avec zero data retention.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Bilan',
        },
        {
          type: 'paragraph',
          text: 'Un flagship qui redescend en coût, un modèle du quotidien qui monte au score. Opus 5.5 fait le travail de Fable sur la plupart des tâches, plus vite, 40 % moins cher qu’Opus 5, devant sur le coding agentique, le computer use et GDPval — Astra reste devant sur AutomationBench et Terminal-Bench-Science. Sonnet 5.5 garde la grille de Sonnet 5, écrit moins, répond 30 % plus vite, et colle Opus sur GDPval, CursorBench et OSWorld. Le jugement long reste chez Opus. Haiku 5.5 dira si le bas de la gamme suit.',
        },
        {
          type: 'list',
          items: [`Opus 5.5 : ${OPUS}`, `Sonnet 5.5 : ${SONNET}`],
        },
      ],
    },
    en: {
      title: 'Opus 5.5 and Sonnet 5.5 — judgment on one side, throughput on the other',
      description:
        'Opus 5.5 (September 22) at Fable 5.1 level, 40% cheaper to run than Opus 5. Sonnet 5.5 (September 28) at Sonnet 5 prices, 30% faster, level with Opus on scoped work.',
      blocks: [
        {
          type: 'paragraph',
          text: 'In six days Anthropic shipped the first two models in the Claude 5.5 family. [Opus 5.5](https://www.anthropic.com/claude-opus-5-5) on September 22, [Sonnet 5.5](https://www.anthropic.com/claude-sonnet-5-5) on September 28. Opus is the first release since the call to pace the frontier: the lab puts it at Fable 5.1 level on most work, 40% cheaper to serve than Opus 5. Sonnet is the complement — scoped tasks, bugs, documents, slides, spreadsheets, and a sharp eye for design. Haiku 5.5 is named for the coming weeks, with no public price or model id. Benchmark margins at this level are a fragile guide: the Opus post says the felt gap with Fable is narrower than the scores. I read the tables as a vendor ceiling, effort and safeguards included.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Price and speed',
        },
        {
          type: 'paragraph',
          text: 'Per million tokens. Opus 5.5: input **$4**, output **$20**, cache reads **$0.20**, cache writes **$5**. Opus 5 was $5 / $25 / $0.50 / $6.25. Opus fast mode (up to 2.5×, Claude Code and the Platform) is $8 / $40. Sonnet 5.5: input **$2**, output **$10**, cache reads **$0.20**, cache writes **$2.50**. Input, output, and cache reads match the Sonnet 5 rate card.',
        },
        {
          type: 'list',
          items: [
            'On a typical workload, Opus 5.5 costs 40% less than Opus 5 (cheaper tokens, and fewer tokens per task). Sonnet 5.5 costs up to 30% less per task than Sonnet 5, mostly because it writes less.',
            'Both generate more than 30% faster than their predecessor. Sonnet 5.5 is the fastest Sonnet to date.',
            'Cache reads, which dominate a coding agent’s bill, are the same price: $0.20. The remaining gap is input, output, and cache writes ($2.50 versus $5).',
            'With Opus, Anthropic raises five-hour limits on Pro, Max, Team, and seat-based Enterprise, plus a rate-limit reset you can save for later.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Coding',
        },
        {
          type: 'paragraph',
          text: 'On several evals, Sonnet 5.5 at max effort sits next to Opus. Anthropic adds that, in its own testing and with external testers, Opus stays clearly stronger once the work is open-ended and needs judgment held over time. The default in Claude Code and the apps is medium; on the Platform it is high. Sonnet complements Opus best at lower effort. At higher settings, scores and cost move together.',
        },
        {
          type: 'list',
          items: [
            'Terminal-Bench 4.0: Sonnet 5.5 **70.6%** · Opus 5.5 xhigh **66.4%** · Astra high 57.9% · Fable 55.8% · Opus 5 52.3% · Sonnet 5 10.3%. [The New Stack](https://thenewstack.io/claude-sonnet-55-launch/) reports that the benchmark maintainers saw Sonnet 5 hit timeouts and token limits, which helps read the 10.3%.',
            'FrontierCode v1.1 (would the diff merge, out-of-scope penalized): Opus **54.4%** max / **54.6%** medium, above Astra’s published best (53.3%) for about a fifth of the cost. Sonnet **52.1%** xhigh / **46.2%** max · GPT-6 Sol 49.3% · Sonnet 5 42.4%. Max landing under xhigh is documented: at max, Sonnet more often runs Claude Code’s review skill across subagents. In two cases Cognition examined, a timeout or edits past the task’s scope.',
            'CursorBench 4.0: Opus **57.8%** max / **52.5%** medium · Sonnet **55.5%** · Fable max 51.8% · Opus 5 max 46.6% · Sonnet 5 34.1%.',
            'Announced cost: at high effort, Sonnet scores 10 points above Sonnet 5 on FrontierCode for about a fifteenth of the cost. At low effort on CursorBench, and at medium effort on Terminal-Bench, it beats Sonnet 5’s best for less than a tenth of the cost.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Magnitudes cited by Anthropic, not measurements of mine. A 680,000-line migration in under a day with Opus 5.5. A 200,000-line audit in under three hours, where Opus 5 took over 20 hours and 2.5× the tokens. HAProxy rewritten from C to Rust: nearly the full regression suite for both Opus 5.5 and Fable, Opus in 9.5 hours versus 12, 51% cheaper. At Lovable, across 118 builds, Sonnet 5.5 reached Opus 5’s level in 3.6 iterations on average, where Opus 5 took 7.7.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Knowledge work',
        },
        {
          type: 'list',
          items: [
            'GDPval-AA v2.1 (44 occupations): Opus **1846** Elo · Sonnet **1844** · Fable 1735 · Opus 5 1708 · Sonnet 5 1449.',
            'AA-Briefcase v1.1: Opus **1822** · Sonnet **1811** · Sonnet 5 1359.',
            'Humanity’s Last Exam, with tools: Opus **67.7%** · Fable 65.6% · Sonnet **64.5%** · Sonnet 5 54.9%.',
            'OSWorld, partial: Opus **81.8%** (2.0 in its own post, 2.1 in the Sonnet table) · Sonnet **80.1%** on 2.1 · Sonnet 5 57.0% · Opus 5 74.0% on 2.0.',
            'Chartography with no tools: Opus 64.4% · Sonnet **61.6%** · Sonnet 5 15.6%. With tools, Opus reports 89.0%.',
            'Where Opus 5.5 does not lead: Terminal-Bench-Science 0.1, Astra **64.6%** versus Opus 58.7% (no Sonnet 5.5 figure). AutomationBench, Astra **41.4%** versus Opus 40.0% — and that 40% is a floor, because a safeguard intervention counts as a failure.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Sonnet 5.5 is also the first Sonnet to beat Pokémon Red from screenshots alone. Both 5.5 models write more clearly than the previous generation: the important part first, less jargon. On a long session that weighs as much as two points of CursorBench.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Safeguards',
        },
        {
          type: 'paragraph',
          text: 'Opus 5.5 posts the best score to date on Anthropic’s behavioral audit. Less likely to take hard-to-reverse actions, more resistant than Opus 5 to prompt injection — tying Fable at Gray Swan for the lowest success rate. Evaluated before release by Frontier Design and METR. Biology and cyber capabilities comparable to Mythos 5.1, so the safeguards match Fable’s. Life Sciences Verification is open; Cyber Verification expands in the coming weeks. Opus benches run with those safeguards on: when they intervene, cyber tasks are finished by Opus 4.8, and biology plus frontier-LLM development by Opus 5. Anthropic says that likely lowers the scores.',
        },
        {
          type: 'paragraph',
          text: 'Sonnet 5.5 does not push the lab’s capability frontier. Across ~1,850 scenarios it matches or beats Sonnet 5 on most alignment measures. It is the Anthropic model least likely to probe its container, and it comes close to Opus in how rarely it tries to leave the sandbox. Cyber at Opus 5’s level: the first Sonnet shipped with these safeguards, and high-risk requests fall back to Sonnet 5. Biology safeguards stay the Sonnet 5 set. It is also the first Sonnet with distillation-prevention classifiers and expanded preserved thinking: reasoning stays tied to the account that produced it.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'How I split them',
        },
        {
          type: 'paragraph',
          text: 'I have not yet replayed my own loops (review, refactors, MCP) on both model ids. The split is a reading of the announcements.',
        },
        {
          type: 'list',
          items: [
            'Sonnet 5.5 at low or medium: scoped bugs, review, docs, slides, UI. That is where $2 / $10 and the speed show up.',
            'Opus 5.5: migrations, audits, overnight multi-repo runs, judgment when the spec is fuzzy.',
            'If Sonnet is already at xhigh or max and the bill meets Opus, I switch. The 70.6% on Terminal-Bench does not replace that switch.',
            'API: `claude-sonnet-5-5`. If thinking was off, switch to `between_tools` before migrating. Both are on AWS, Google Cloud, and Azure, with zero data retention.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Takeaway',
        },
        {
          type: 'paragraph',
          text: 'A flagship that got cheaper to run, and an everyday model that caught up on the scores. Opus 5.5 does Fable’s work on most tasks, faster, 40% cheaper than Opus 5, ahead on agentic coding, computer use, and GDPval — Astra still leads AutomationBench and Terminal-Bench-Science. Sonnet 5.5 keeps the Sonnet 5 rate card, writes less, answers 30% faster, and sits next to Opus on GDPval, CursorBench, and OSWorld. Long-horizon judgment stays with Opus. Haiku 5.5 will show whether the bottom of the lineup follows.',
        },
        {
          type: 'list',
          items: [`Opus 5.5: ${OPUS}`, `Sonnet 5.5: ${SONNET}`],
        },
      ],
    },
  },
}
