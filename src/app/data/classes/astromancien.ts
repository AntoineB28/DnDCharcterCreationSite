import type { ClassData } from '../gameData';

export const astromancien: ClassData = {
  id: 'astromancien', name: 'Astromancien', difficulty: '★★', dlc: true,
  description: "Maître des étoiles et des phénomènes cosmiques. Puise dans l'énergie des astres pour manipuler la réalité et le temps. Ses sorts s'appellent sorts cosmiques et utilisent l'intelligence.",
  competences: 'Sorts cosmiques (intelligence), armes simples, armures légères',
  resource: 'none', startingResource: 0,
  startingArmor: { name: 'Armure de cuir (légère, AC+1)', ac: 1, type: 'legere' },
  startingEquipment: ["Armure de cuir (légère, AC+1)", "Sceptre météorique (+1 attack roll sorts cosmiques)", "Dague (1d4 perçant)", "Télékinésie à volonté", "Orbe céleste : 2d8 dégâts de force (5x/long rest)"],
  pvPerLevel: [0, 5, 5, 5, 5, 6, 6, 8, 8, 8, 10, 10, 10, 12, 12, 12, 14, 14, 16, 18],
  resourcePerLevel: Array(20).fill(0),
  specializations: ['Stellamancie', 'Chronomancie', 'Astrophage', 'Cometari', 'Météoricien'],
  specializationDetails: [
    {
      name: 'Stellamancie',
      summary: "Maître de l'astrologie et des cartes du ciel. Tire un grand pouvoir des alignements célestes.",
      effects: [
        'Constellation maudite : Action bonus (1x/LR) – cible vulnérable à tous dégâts jusqu\'à fin de ton tour',
        'Constellation régénératrice : Action bonus (1x/LR) – soigne 3d6 PV à un personnage',
        'Niveau 8 : Constellation de puissance (+4 attack roll, +1d8 dégâts au prochain sort)',
        'Niveau 14 : Alignement cosmique – téléportation réaction (sav. DEX 10)',
        'Niveau 18 : Constellation protectrice – réduit dégâts de Xd6 (X = bonus INT)',
      ],
    },
    {
      name: 'Chronomancie',
      summary: "Manipulateur du temps. Ralentit, accélère ou altère le cours des événements.",
      effects: [
        'Voile temporel : Actions et actions bonus interchangeables pendant 1 tour (1x/LR)',
        'Niveau 8 : Vitesse +2 (manipulation constante du temps)',
        'Niveau 14 : Inversion temporelle – annule ta dernière action (1x/LR)',
        'Niveau 18 : Paralysie temporelle – cible paralysée 1 tour (sav. VIT 15)',
      ],
    },
    {
      name: 'Astrophage',
      summary: "Puise dans les étoiles mourantes. Magie dévastatrice et régénératrice liée à la fin de l'univers.",
      effects: [
        'Rayon dévorant : Action bonus (3x/LR) – 2d4 dégâts magiques, récupère PV = dégâts',
        'Niveau 8 : Récupère 1d4 PV chaque fois que tu utilises un sort cosmique',
        'Niveau 14 : Noyau d\'étoile – Action bonus, récupère 4d6 PV',
        'Niveau 18 : Trou noir – 8d10 dégâts de force (sav. RES 15), les vaincus sont aspirés',
      ],
    },
    {
      name: 'Cometari',
      summary: "Maître de la magie gravitationnelle. Influence des comètes et météorites.",
      effects: [
        'Chute astrale : Action (1x/LR) – jusqu\'à 3 cibles, 1d6 tranchant + 1d8 feu',
        'Niveau 8 : Puits gravitationnel – Action bonus, ennemis jeté au sol (sav. RES 12)',
        'Niveau 14 : Pluie d\'étoiles – tous ennemis, 4d8 brûlants (sav. RES 15) ou 2d6',
        'Niveau 18 : Tempête gravitationnelle – 3 tours, 2d8 force + 2d8 brûlants chaque tour',
      ],
    },
    {
      name: 'Météoricien',
      summary: "Utilise la roche météorique pour augmenter la puissance de ses armes rapprochées.",
      effects: [
        'Compétence avec toutes les armes rapprochées',
        'Arme météorique : Action bonus – +1d10 dégâts de force jusqu\'à fin de combat',
        'Niveau 8 : Armure météorique – Action bonus (1x/LR) – AC 19 pour 3 tours',
        'Niveau 14 : +1d10 brûlants en plus | Niveau 18 : Maîtrise armes rapprochées, +1d10 tranchants en plus',
      ],
    },
  ],
};
