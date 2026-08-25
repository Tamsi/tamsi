/** Spell icon paths under /public/adventure/spells/. */
export const SPELL_ICON_PATHS: Record<string, string> = {
  strike: '/adventure/spells/strike.svg',
  fireball: '/adventure/spells/fireball.svg',
  ward: '/adventure/spells/ward.svg',
  mend: '/adventure/spells/mend.svg',
  chainbolt: '/adventure/spells/chainbolt.svg',
  bastion: '/adventure/spells/bastion.svg',
  prism: '/adventure/spells/prism.svg',
  temper: '/adventure/spells/temper.svg',
  aether: '/adventure/spells/aether.svg',
  surge: '/adventure/spells/surge.svg',
  veil: '/adventure/spells/veil.svg',
}

export function spellIconPath(spellId: string): string | undefined {
  return SPELL_ICON_PATHS[spellId]
}
