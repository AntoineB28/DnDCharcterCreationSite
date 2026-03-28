// Armor definitions for the character creation wizard
export const ARMORS = [
  { id: 'none',       name: 'Sans armure',              ca: 10, type: 'none'    as const, category: 'Aucune' },
  { id: 'padded',     name: 'Matelassée',               ca: 11, type: 'legere'  as const, category: 'Légère' },
  { id: 'leather',    name: 'Cuir',                     ca: 11, type: 'legere'  as const, category: 'Légère' },
  { id: 'studded',    name: 'Cuir clouté',              ca: 12, type: 'legere'  as const, category: 'Légère' },
  { id: 'hide',       name: 'Peau',                     ca: 12, type: 'moyenne' as const, category: 'Moyenne' },
  { id: 'chainshirt', name: 'Chemise de mailles',       ca: 13, type: 'moyenne' as const, category: 'Moyenne' },
  { id: 'scalemail',  name: "Cotte d'écailles",         ca: 14, type: 'moyenne' as const, category: 'Moyenne' },
  { id: 'breastplate',name: 'Cuirasse',                 ca: 14, type: 'moyenne' as const, category: 'Moyenne' },
  { id: 'halfplate',  name: 'Demi-plate',               ca: 15, type: 'moyenne' as const, category: 'Moyenne' },
  { id: 'ringmail',   name: 'Cotte de pierres',         ca: 14, type: 'lourde'  as const, category: 'Lourde' },
  { id: 'chainmail',  name: 'Cotte de mailles',         ca: 16, type: 'lourde'  as const, category: 'Lourde' },
  { id: 'splint',     name: 'Broigne',                  ca: 17, type: 'lourde'  as const, category: 'Lourde' },
  { id: 'plate',      name: 'Harnois',                  ca: 18, type: 'lourde'  as const, category: 'Lourde' },
  // Class-specific armor choices
  { id: 'pretre-robe', name: 'Robes de prêtre',         ca: 10, type: 'robes'  as const, category: 'Prêtre' },
  { id: 'pretre-fer',  name: 'Armure de fer',            ca: 13, type: 'moyenne' as const, category: 'Prêtre' },
];

export type ArmorType = typeof ARMORS[0];
export const getArmorAC = (armorId: string, baseResistance: number): number => {
  const armor = ARMORS.find((a) => a.id === armorId);
  if (!armor) return baseResistance;
  if (armor.type === 'legere') return armor.ca + Math.floor((baseResistance - 10) / 2);
  if (armor.type === 'moyenne') return armor.ca + Math.floor((baseResistance - 10) / 2);
  return armor.ca;
};
