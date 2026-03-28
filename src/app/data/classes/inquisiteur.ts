import type { ClassData } from '../gameData';

export const inquisiteur: ClassData = {
  id: 'inquisiteur', name: 'Inquisiteur', difficulty: '★', dlc: true,
  description: "Guerrier sacré de Moiifhb. Chasse les ennemis de la lumière. Utilise la divinité et la foi pour ses miracles. Possède des promesses (serments) qui lui donnent des pouvoirs spéciaux.",
  competences: 'Armures moyennes et lourdes, épées, haches, masses et marteaux, boucliers, miracles de Moiifhb',
  resource: 'divinite', startingResource: 0,
  startingArmor: { name: "Armure de l'inquisition (moyenne, AC+3)", ac: 3, type: 'moyenne' },
  startingEquipment: ["Armure de l'inquisition (moyenne, AC+3)", "Épée large OU hache de guerre OU masse (1d8) + bouclier OU grande arme (1d12)", "Feat Paladin : Foi +1, accès à Coup Divin", "Coup Divin : Action bonus (1x/LR) – prochain coup +2 attack, +1d8 divins/niveau"],
  pvPerLevel: [0, 6, 8, 8, 10, 10, 12, 10, 10, 12, 10, 10, 14, 15, 15, 16, 18, 18, 20, 22],
  resourcePerLevel: [0, 3, 3, 6, 7, 8, 8, 10, 12, 12, 12, 14, 14, 14, 15, 15, 16, 16, 16, 16],
  specializations: ['Promesse : Amour', 'Promesse : Piété', 'Promesse : Justice'],
  specializationDetails: [
    {
      name: 'Promesse : Amour',
      summary: "Jure d'aimer inconditionnellement ceux qui rendent hommage à Moiifhb.",
      effects: ['PV +8', 'Toujours actif'],
    },
    {
      name: 'Promesse : Piété',
      summary: "Jure de toujours penser à Moiifhb en premier.",
      effects: ['Foi +1', 'Toujours actif'],
    },
    {
      name: 'Promesse : Justice',
      summary: "Jure d'amener les ennemis de Moiifhb à leur jugement.",
      effects: ['Avantage contre créatures des dieux sombres, monstres, vampires et abominations', 'Toujours actif'],
    },
  ],
  deityRequired: true, deityType: 'any',
};
