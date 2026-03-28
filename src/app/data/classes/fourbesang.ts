import type { ClassData } from '../gameData';

export const fourbesang: ClassData = {
  id: 'fourbesang', name: 'Fourbesang', difficulty: '★★★★', dlc: true,
  description: "Maître de la corruption vitale. Manipule son propre corps et celui de ses ennemis. Ses pouvoirs s'appellent des corruptions et coûtent des PV. Craint de tous.",
  competences: 'Toutes armes rapprochées, corruptions',
  resource: 'pv', startingResource: 0,
  startingArmor: { name: 'Vêtements déchirés', ac: 0, type: 'none' },
  startingEquipment: ["Vêtements déchirés", "Une arme rapprochée au choix", "Profanation : coût 4 PV, +2 attack roll, +1d4 nécrotiques", "Mutation génétique disponible au niveau 5"],
  pvPerLevel: [0, 8, 8, 8, 10, 10, 12, 12, 12, 14, 14, 15, 15, 15, 15, 18, 18, 20, 22, 24],
  resourcePerLevel: Array(20).fill(0),
  specializations: ['Écorcheur', 'Sanguinier', 'Tisseur d\'os'],
  specializationDetails: [
    {
      name: 'Écorcheur',
      summary: "Maître de la chair. Inflige des mutilations brutales qui rendent les ennemis vulnérables.",
      effects: [
        'Déformation : Action bonus (1x/LR, coût 5 PV) – cible -2 AC, -2 attack/saving throws 1 tour (sav. CON 18)',
        'Carnophagie : récupère 2 PV chaque fois que tu touches un ennemi',
        'Niveau 14 : Dextérité +1. Peste de Chair : 2d6 nécrotiques + douleur chronique (sav. CON 16)',
      ],
    },
    {
      name: 'Sanguinier',
      summary: "Manipule le sang pour guérir et affaiblir. La vie dans ses veines est une arme.",
      effects: [
        'Drain de sang : Action bonus (1x/LR) – 1d8 tranchants, récupère PV = dégâts',
        'Armure coagulée : Réaction (coût 2 PV) – +2 AC contre une attaque',
        'Niveau 14 : PV +4. Rituel sanguinolant – sacrifie jusqu\'à 10 PV → allié récupère 1d4 PV/PV sacrifié',
      ],
    },
    {
      name: 'Tisseur d\'os',
      summary: "Déforme les structures corporelles. Renforce ses os et crée des armes de son propre squelette.",
      effects: [
        'Carapace osseuse : AC base 13 sans armure, résistance contondant et force',
        'Pique d\'ivoire : Action bonus (coût 4 PV) – 2d6 dégâts perçants',
        'Niveau 14 : Résistance +1. Enveloppe macabre – résistance au type de dégât choisi (réaction)',
      ],
    },
  ],
};
