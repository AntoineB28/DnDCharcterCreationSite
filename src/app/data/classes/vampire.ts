import type { ClassData } from '../gameData';

export const vampire: ClassData = {
  id: 'vampire', name: 'Vampire', difficulty: '★★★', description: "Classe unique. Ne peut pas faire de multi-classe. Possède des pouvoirs vampiriques.",
  competences: 'Armes de dextérité, armures légères et moyennes',
  resource: 'vampirique', startingResource: 3,
  startingArmor: { name: 'Armure de cuir (légère, AC+1)', ac: 1, type: 'legere' },
  startingEquipment: ["Armure de cuir (légère, AC+1)", "Arme de dextérité au choix", "Charges vampiriques : 3", "Survie vampirique (1x)", "Vision nocturne"],
  pvPerLevel: [0, 6, 6, 8, 8, 8, 10, 10, 12, 12, 12, 14, 14, 14, 16, 18, 18, 20, 20, 22],
  resourcePerLevel: [3, 3, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 12],
  specializations: [],
};
