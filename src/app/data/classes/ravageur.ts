import type { ClassData } from '../gameData';

export const ravageur: ClassData = {
  id: 'ravageur', name: 'Ravageur', difficulty: '★', dlc: true,
  description: "Machine de guerre nourrie par la rage. Accumule de la fureur en subissant des dégâts. Utilise des dés de violence (1d4 → 1d6 → 1d8 → 1d10 → 1d12). Pas d'armure : ajoute CON à l'AC.",
  competences: 'Toutes armes rapprochées',
  resource: 'none', startingResource: 0,
  startingArmor: { name: 'Vêtements de fourrure (sans armure)', ac: 0, type: 'none' },
  startingEquipment: ["Vêtements de fourrure", "Une arme rapprochée au choix", "Accumulation de fureur : 1 point/tranche de 2 PV perdus", "Exaltation : coût 3 fureur – +2 attack, +1d4 dégâts, immunité peur", "Endurance : sans armure, ajoute CON à l'AC"],
  pvPerLevel: [0, 8, 8, 10, 10, 10, 12, 12, 12, 14, 14, 14, 15, 15, 16, 16, 18, 20, 22, 24],
  resourcePerLevel: Array(20).fill(0),
  specializations: ['Colérique', 'Massacreur', 'Indestructible'],
  specializationDetails: [
    {
      name: 'Colérique',
      summary: "La rage t'envahit naturellement. Génères de la fureur chaque tour.",
      effects: [
        '+1 fureur au début de ton tour',
        'Niveau 14 : +2 fureur au début de ton tour',
      ],
    },
    {
      name: 'Massacreur',
      summary: "Tu adores voir la vie quitter les yeux de tes ennemis.",
      effects: [
        '+1 dé de violence',
        'Niveau 14 : +1 dé de violence supplémentaire',
      ],
    },
    {
      name: 'Indestructible',
      summary: "Rien ne te fait peur, rien ne t'arrête.",
      effects: [
        'PV +8 | Constitution +2',
        'Niveau 14 : Constitution +1, PV +6',
      ],
    },
  ],
};
