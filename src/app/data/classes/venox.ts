import type { ClassData } from '../gameData';

export const venox: ClassData = {
  id: 'venox', name: 'Venox', difficulty: '★★★', dlc: true,
  description: "Maître des poisons et toxines. Immunisé au poison. Produit ses toxines depuis son propre corps. Utilise dextérité pour ses toxines. Trois types de poisons : mortels, incapacitants, déstabilisants.",
  competences: 'Armure légère, dagues, toxines (dextérité)',
  resource: 'none', startingResource: 0,
  startingArmor: { name: 'Veste de cuir (légère, AC+1)', ac: 1, type: 'legere' },
  startingEquipment: ["Veste de cuir (légère, AC+1)", "Deux dagues recourbées (1d4 + DEX perçant)", "1 poison mortel (La mort pourpre : 3 charges, 1d10 nécrotiques)", "1 poison incapacitant (Foudre cinglante : 2 charges, paralysie sav. CON 12)", "Crachat de cobra : Action bonus (1x/LR), 2d8 acides"],
  pvPerLevel: [0, 5, 5, 6, 6, 6, 8, 8, 10, 10, 10, 12, 12, 12, 14, 14, 16, 16, 18, 20],
  resourcePerLevel: Array(20).fill(0),
  specializations: ['Basilisk', 'Venimeux', 'Miasma', 'Sulfureux'],
  specializationDetails: [
    {
      name: 'Basilisk',
      summary: "Dagues comme crocs de vipère. Finesse et précision dévastatrice.",
      effects: [
        'Sang froid : Réaction (1x/combat) – contre-attaque avec dague avant l\'attaque ennemie',
        'Dagues font 2 dégâts perçants de plus',
        'Niveau 14 : Dagues font 5 dégâts perçants de plus',
      ],
    },
    {
      name: 'Venimeux',
      summary: "Tes sécrétions empoisonnées sont particulièrement dévastatrices.",
      effects: [
        'Crachat de cobra 2x/LR (sav. 14 au lieu de 10)',
        'Sueur acide : Action bonus (1x/LR) – jusqu\'à fin de combat, 2 dégâts acides aux attaquants mêlée',
        'Niveau 14 : Sueur acide toujours active',
      ],
    },
    {
      name: 'Miasma',
      summary: "Crée des nuages pestilents depuis tes poisons pour toucher plusieurs ennemis.",
      effects: [
        'Nuage empoissonné : dépense 1 utilisation de poison, jusqu\'à 3 cibles (1x/LR)',
        'Niveau 14 : Nuage empoissonné en action bonus',
      ],
    },
    {
      name: 'Sulfureux',
      summary: "Crée plus de doses à partir des mêmes ressources. Poisons plus efficaces.",
      effects: [
        '+1 charge d\'un poison au choix chaque jour',
        'Saving throws de tes poisons +2 de difficulté',
        'Niveau 14 : +4 de difficulté total',
      ],
    },
  ],
};
