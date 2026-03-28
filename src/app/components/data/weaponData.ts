// Weapon definitions for the character creation wizard
export const WEAPONS = [
  // Simple Melee - One hand
  { id: 'club',         name: 'Gourdin',              dmg: '1d4 contondant',  props: 'Légère',                          category: 'Armes simples de mêlée', hand: 'one' as const },
  { id: 'dagger',       name: 'Dague',                dmg: '1d4 perçant',     props: 'Finesse, légère, lancer (20/60)', category: 'Armes simples de mêlée', hand: 'one' as const },
  { id: 'handaxe',      name: 'Hachette',             dmg: '1d6 tranchant',   props: 'Légère, lancer (20/60)',          category: 'Armes simples de mêlée', hand: 'one' as const },
  { id: 'javelin',      name: 'Javeline',             dmg: '1d6 perçant',     props: 'Lancer (30/120)',                 category: 'Armes simples de mêlée', hand: 'one' as const },
  { id: 'lighthammer',  name: 'Marteau léger',        dmg: '1d4 contondant',  props: 'Légère, lancer (20/60)',          category: 'Armes simples de mêlée', hand: 'one' as const },
  { id: 'mace',         name: 'Masse d\'armes',       dmg: '1d6 contondant',  props: '—',                               category: 'Armes simples de mêlée', hand: 'one' as const },
  { id: 'sickle',       name: 'Faucille',             dmg: '1d4 tranchant',   props: 'Légère',                          category: 'Armes simples de mêlée', hand: 'one' as const },
  { id: 'spear',        name: 'Lance',                dmg: '1d6 perçant',     props: 'Lancer, polyvalente (1d8)',       category: 'Armes simples de mêlée', hand: 'one' as const },
  // Simple Melee - Two hands
  { id: 'greatclub',    name: 'Massue',               dmg: '1d8 contondant',  props: 'Deux mains',                      category: 'Armes simples de mêlée', hand: 'two' as const },
  { id: 'quarterstaff', name: 'Bâton',                dmg: '1d6 contondant',  props: 'Polyvalente (1d8)',               category: 'Armes simples de mêlée', hand: 'one' as const },
  // Simple Ranged
  { id: 'dart',         name: 'Fléchette',            dmg: '1d4 perçant',     props: 'Finesse, lancer (20/60)',         category: 'Armes simples à distance', hand: 'one' as const },
  { id: 'lxbow',        name: 'Arbalète légère',      dmg: '1d8 perçant',     props: 'Munitions (80/320), deux mains', category: 'Armes simples à distance', hand: 'two' as const },
  { id: 'shortbow',     name: 'Arc court',            dmg: '1d6 perçant',     props: 'Munitions (80/320), deux mains', category: 'Armes simples à distance', hand: 'two' as const },
  { id: 'sling',        name: 'Fronde',               dmg: '1d4 contondant',  props: 'Munitions (30/120)',              category: 'Armes simples à distance', hand: 'one' as const },
  // Martial Melee - One hand
  { id: 'flail',        name: 'Fléau',                dmg: '1d8 contondant',  props: '—',                               category: 'Armes de guerre de mêlée', hand: 'one' as const },
  { id: 'longsword',    name: 'Épée longue',          dmg: '1d8 tranchant',   props: 'Polyvalente (1d10)',              category: 'Armes de guerre de mêlée', hand: 'one' as const },
  { id: 'morningstar',  name: 'Morgenstern',          dmg: '1d8 perçant',     props: '—',                               category: 'Armes de guerre de mêlée', hand: 'one' as const },
  { id: 'rapier',       name: 'Rapière',              dmg: '1d8 perçant',     props: 'Finesse',                         category: 'Armes de guerre de mêlée', hand: 'one' as const },
  { id: 'scimitar',     name: 'Cimeterre',            dmg: '1d6 tranchant',   props: 'Finesse, légère',                 category: 'Armes de guerre de mêlée', hand: 'one' as const },
  { id: 'shortsword',   name: 'Épée courte',          dmg: '1d6 perçant',     props: 'Finesse, légère',                 category: 'Armes de guerre de mêlée', hand: 'one' as const },
  { id: 'warhammer',    name: 'Marteau de guerre',    dmg: '1d8 contondant',  props: 'Polyvalente (1d8)',               category: 'Armes de guerre de mêlée', hand: 'one' as const },
  { id: 'whip',         name: 'Fouet',                dmg: '1d4 tranchant',   props: 'Finesse, allonge',                category: 'Armes de guerre de mêlée', hand: 'one' as const },
  // Martial Melee - Two hands
  { id: 'battleaxe',    name: 'Hache de bataille',    dmg: '1d8 tranchant',   props: 'Polyvalente (1d10)',              category: 'Armes de guerre de mêlée', hand: 'one' as const },
  { id: 'glaive',       name: 'Coutille',             dmg: '1d10 tranchant',  props: 'Lourde, allonge, deux mains',    category: 'Armes de guerre de mêlée', hand: 'two' as const },
  { id: 'greataxe',     name: 'Grande hache',         dmg: '1d12 tranchant',  props: 'Lourde, deux mains',             category: 'Armes de guerre de mêlée', hand: 'two' as const },
  { id: 'greatsword',   name: 'Épée à deux mains',    dmg: '2d6 tranchant',   props: 'Lourde, deux mains',             category: 'Armes de guerre de mêlée', hand: 'two' as const },
  { id: 'halberd',      name: 'Hallebarde',           dmg: '1d10 tranchant',  props: 'Lourde, allonge, deux mains',    category: 'Armes de guerre de mêlée', hand: 'two' as const },
  { id: 'maul',         name: 'Maillet de guerre',    dmg: '2d6 contondant',  props: 'Lourde, deux mains',             category: 'Armes de guerre de mêlée', hand: 'two' as const },
  { id: 'pike',         name: 'Pique',                dmg: '1d10 perçant',    props: 'Lourde, allonge, deux mains',    category: 'Armes de guerre de mêlée', hand: 'two' as const },
  // Martial Ranged
  { id: 'hxbow',        name: 'Arbalète de poing',    dmg: '1d6 perçant',     props: 'Munitions (30/120), légère',     category: 'Armes de guerre à distance', hand: 'one' as const },
  { id: 'hxbow2',       name: 'Arbalète lourde',      dmg: '1d10 perçant',    props: 'Munitions (100/400), deux mains',category: 'Armes de guerre à distance', hand: 'two' as const },
  { id: 'longbow',      name: 'Arc long',             dmg: '1d8 perçant',     props: 'Munitions (150/600), deux mains',category: 'Armes de guerre à distance', hand: 'two' as const },
  // Arcanotech weapons (Artificier)
  { id: 'arbaletes-auto',     name: 'Arbalètes auto',       dmg: '2d6 perçant',     props: 'Arcano-mécanique, munitions automatiques', category: 'Armes arcano-mécaniques', hand: 'two' as const },
  { id: 'marteau-explosif',   name: 'Marteau explosif',     dmg: '1d10 contondant', props: 'Arcano-mécanique, explosion (1d6 feu)', category: 'Armes arcano-mécaniques', hand: 'one' as const },
  { id: 'rapiere-retractable', name: 'Rapière rétractable', dmg: '1d8 perçant',     props: 'Arcano-mécanique, finesse',          category: 'Armes arcano-mécaniques', hand: 'one' as const },
  { id: 'fleau-electrifie',   name: 'Fléau électrifié',     dmg: '2d4 contondant',  props: 'Arcano-mécanique, 1d4 électrique',    category: 'Armes arcano-mécaniques', hand: 'one' as const },
  { id: 'gants-pistons',      name: 'Gants à pistons',      dmg: '1d6 contondant',  props: 'Arcano-mécanique, allonge +5ft',     category: 'Armes arcano-mécaniques', hand: 'one' as const },
  { id: 'carabine-arcanique', name: 'Carabine arcanique',   dmg: '1d12 magique',    props: 'Arcano-mécanique, munitions magiques', category: 'Armes arcano-mécaniques', hand: 'two' as const },
];

export type WeaponType = typeof WEAPONS[0];
export const getWeapon = (id: string): WeaponType | undefined => WEAPONS.find((w) => w.id === id);
