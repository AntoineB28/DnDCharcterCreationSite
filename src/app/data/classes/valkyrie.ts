import type { ClassData } from '../gameData';

export const valkyrie: ClassData = {
  id: 'valkyrie', name: 'Valkyrie', difficulty: '★★', dlc: true,
  description: "Guerrière sacrée d'Erkanos. Maîtrise des lances, hallebardes et haches. Personnage obligatoirement féminin. Vénère Erkanos. Accumulez des points de supériorité (max 3 → 5 → 7) pour des effets puissants.",
  competences: 'Armures légères et moyennes, boucliers, lances, hallebardes et haches',
  resource: 'none', startingResource: 0,
  startingArmor: { name: 'Cotte de mailles (moyenne, AC+2, résistance tranchants)', ac: 2, type: 'moyenne' },
  startingEquipment: ["Cotte de mailles (moyenne, AC+2, résistance tranchants)", "Casque ailé (initiative +1)", "Lance (1d8) + bouclier (AC+2) OU hache barbue (1d10) + buckler (AC+1) OU hallebarde (2 mains, 1d12)", "Ailes divines : 1x/LR – vol 1 tour | Rage d'Erkanos : 1x/LR – 2d10 force + projection (sav. DEX 14)"],
  pvPerLevel: [0, 6, 8, 8, 10, 12, 12, 10, 12, 10, 10, 10, 12, 12, 15, 15, 18, 18, 20, 22],
  resourcePerLevel: Array(20).fill(0),
  specializations: ['Céleste', 'Gardienne', 'Triomphante'],
  specializationDetails: [
    {
      name: 'Céleste',
      summary: "Rapidité du vent et fureur du ciel. Attaques chargées de foudre divine.",
      effects: [
        'Ailes divines 3x/LR | Vitesse +1',
        'Coup de foudre : Action bonus (1x/LR) – 1d8 électriques + sonné (sav. RES 10)',
        'Niveau 8 : 2d8 électriques (sav. 14)',
        'Niveau 14 : 3d8 électriques | Tempête argentée – éclair argenté en volant (1d10 électrique + 1d10 divin)',
      ],
    },
    {
      name: 'Gardienne',
      summary: "Guide des âmes. Puise dans les défunts pour soigner ses alliés.",
      effects: [
        'Résistance +1 | Réconfort (2x/LR) : soigne 1d6 + modificateur force/dextérité',
        'Protection des âmes : Réaction, +2 saving throw pour soi ou allié',
        'Niveau 8 : Réconfort 2d6, +3 saving throw',
        'Niveau 14 : Réconfort 3d6, +4 saving throw | Aura de soins (3 tours, alliés récupèrent 2d4 PV/tour)',
      ],
    },
    {
      name: 'Triomphante',
      summary: "Guerrière implacable. Force et technique au corps-à-corps.",
      effects: [
        'Force ou Dextérité +2 | Bénédiction militaire : +1d4 divins sur attaques',
        'Niveau 8 : +1d6 divins',
        'Niveau 14 : +1d8 divins | Coup de maître (1x/LR) – prochain coup est un critique',
      ],
    },
  ],
  deityRequired: true, deityType: 'any',
};
