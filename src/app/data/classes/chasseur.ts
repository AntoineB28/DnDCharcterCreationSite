import type { ClassData } from '../gameData';

export const chasseur: ClassData = {
  id: 'chasseur', name: 'Chasseur', difficulty: '★★', description: "Expert du terrain naturel. Tracker et archer hors pair.",
  competences: "Armes de dextérité, armures légères et moyennes, expertise avec les arcs",
  resource: 'none', startingResource: 0,
  startingArmor: { name: 'Veste de cuir (légère, AC+1)', ac: 1, type: 'legere' },
  startingEquipment: ["Veste de cuir (légère, AC+1)", "Épée courte (dextérité, 1d6 tranchant)", "Arc (dextérité, 1d8 perçant)"],
  pvPerLevel: [0, 6, 6, 8, 8, 8, 10, 10, 12, 12, 12, 12, 14, 12, 14, 16, 16, 18, 20, 20],
  resourcePerLevel: Array(20).fill(0),
  specializations: ['Rôdeur', 'Prédateur', 'Compagnon animal'],
  specializationDetails: [
    {
      name: 'Rôdeur',
      summary: "Ombre dans la forêt. Tu frappes caché et tu disparais avant qu'ils réagissent.",
      effects: [
        'Action bonus supplémentaire par tour',
        'Discrétion (action bonus) : saving throw dextérité (12) pour te cacher, crit sur 18- quand caché',
        'Niveau 14 : saving throw abaissé à 10, +1d4 dégâts avec avantage',
      ],
    },
    {
      name: 'Prédateur',
      summary: "Une proie à la fois. Concentre toute ta puissance sur une seule cible.",
      effects: [
        'Au début du combat : désigne une proie',
        'Contre la proie : attack roll +2, dégâts +1d4',
        'Niveau 14 : +4 attack roll, +1d8 dégâts | Niveau 19 : +6 attack roll, +1d10',
      ],
    },
    {
      name: 'Compagnon animal',
      summary: "Un allié de la nature à tes côtés. Choisis un animal fidèle.",
      effects: [
        'Molosse : PV 26, Force 14, Morsure 1d8 perçant',
        'Sanglier : PV 32, Force 14, Ruée (1d8 contondant + sonné)',
        'Aigle : PV 14, Dextérité 20, Vol, Serres 1d8 tranchant + saignement',
        'Niveau 14 : 2e compagnon + double attaque',
      ],
    },
  ],
};
