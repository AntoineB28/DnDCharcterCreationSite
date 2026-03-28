import type { ClassData } from '../gameData';

export const maraudeur: ClassData = {
  id: 'maraudeur', name: 'Maraudeur', difficulty: '★', dlc: true,
  description: "Guerrier des terres froides de Gloisil. Ses tatouages runiques sacrés canalisent une magie ancestrale. Plus respecté, plus de runes. Les runes utilisent la constitution.",
  competences: 'Haches, épées, boucliers, armures légères et moyennes, runes',
  resource: 'none', startingResource: 0,
  startingArmor: { name: 'Armure de maraudeur (moyenne, AC+3)', ac: 3, type: 'moyenne' },
  startingEquipment: ["Armure de maraudeur (moyenne, AC+3)", "Bottes de marin (+2 sav. DEX/CON)", "Épée de maraudeur (1d8) + bouclier renforcé (AC+2) OU hache danoise (1d12, deux mains)", "Rune du tonnerre : Action bonus (1x/LR) – 1d6 électriques", "Rune de la rage : (1x/LR) – prochain coup +3 attack, +1d10 force (coût 1d6 PV)", "Rune de la mère : Action bonus (1x/LR) – récupère 2d4 PV"],
  pvPerLevel: [0, 10, 8, 8, 10, 12, 14, 12, 12, 12, 10, 12, 14, 15, 15, 18, 18, 20, 22, 24],
  resourcePerLevel: Array(20).fill(0),
  specializations: ['Rune de l\'ours', 'Rune du loup', 'Rune de l\'aigle', 'Rune du caribou'],
  specializationDetails: [
    {
      name: 'Rune de l\'ours',
      summary: "Force et résilience colossales. Rage ursine redoutable.",
      effects: [
        'Force +2 | Résistance +1 | Rage ursine (1x/LR) : résistance physique + 2x bonus force',
        'Niveau 14 : Force +2, Résistance +1',
      ],
    },
    {
      name: 'Rune du loup',
      summary: "Intelligence et tactiques de meute. Guide tes alliés au combat.",
      effects: [
        'Intelligence +3 | Tactiques de meute (1x/LR) : bonus INT aux attack rolls + crit réduit de 1',
        'Niveau 14 : Intelligence +2',
      ],
    },
    {
      name: 'Rune de l\'aigle',
      summary: "Vitesse et dextérité surhumaines. Serres aveuglantes précises.",
      effects: [
        'Vitesse +2 | Dextérité +2 | Serre aveuglante : Action bonus – 1d4 tranchants + désavantage (sav. CON 12)',
        'Niveau 14 : Dextérité +2, Vitesse +2, 2d4 tranchants (sav. 14)',
      ],
    },
    {
      name: 'Rune du caribou',
      summary: "Constitution et force de charge brute.",
      effects: [
        'Constitution +2 | Force +1 | Ruée écrasante : 2d10 force + projection (sav. RES 14)',
        'Niveau 14 : Constitution +1, Force +1, Ruée 4d10/2d10 (sav. 16)',
      ],
    },
  ],
};
