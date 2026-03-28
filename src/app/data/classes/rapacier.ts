import type { ClassData } from '../gameData';

export const rapacier: ClassData = {
  id: 'rapacier', name: 'Rapacier', difficulty: '★★', dlc: true,
  description: "Maître de la stratégie et de la mobilité. Combat avec rapière/sabre et arbalète à main. Partage ses PV avec son oiseau de guerre (lien mental). Valse du duelliste : ajoute DEX à l'AC sans bouclier.",
  competences: 'Sabres, rapières, armes simples, armures légères',
  resource: 'none', startingResource: 0,
  startingArmor: { name: 'Veste de cuir (légère, AC+1)', ac: 1, type: 'legere' },
  startingEquipment: ["Veste de cuir (légère, AC+1)", "Rapière (1d8 perçant) OU Sabre (1d8 tranchant)", "Arbalète à main (1d4 perçant, action bonus)", "Valse du duelliste : sans bouclier, ajoute DEX à l'AC", "Oiseau de proie au choix (partage les PV, AC 15, DEX 18, VIT 20)"],
  pvPerLevel: [0, 5, 5, 6, 6, 6, 8, 8, 10, 10, 12, 12, 12, 14, 14, 15, 15, 15, 16, 18],
  resourcePerLevel: Array(20).fill(0),
  specializations: ['Œil de rapace', 'Lame volante', 'Tempête d\'ailes'],
  specializationDetails: [
    {
      name: 'Œil de rapace',
      summary: "Expert à l'arbalète. Désigne une cible prioritaire et tire avec avantage.",
      effects: [
        'Dextérité +1 | Avantage avec arbalète sur la cible prioritaire',
        'Nouvelle cible quand la précédente meurt',
      ],
    },
    {
      name: 'Lame volante',
      summary: "Travaille de concert avec ton oiseau pour anéantir tes adversaires.",
      effects: [
        'Dextérité +1 | Quand tu touches en mêlée, l\'oiseau attaque immédiatement la même cible',
      ],
    },
    {
      name: 'Tempête d\'ailes',
      summary: "Ton oiseau est le centre de ton style de combat.",
      effects: [
        'L\'oiseau peut attaquer deux fois par action',
        'Quand l\'oiseau réussit, tu peux tirer avec arbalète (avec avantage) sans coût d\'action',
      ],
    },
  ],
};
