import type { ClassData } from '../gameData';

export const artificier: ClassData = {
  id: 'artificier', name: 'Artificier', difficulty: '★★★', dlc: true,
  description: "Expert des objets magiques et armes arcano-mécaniques. Lance des fioles explosives comme grenades. Peut s'octroyer des augmentations biomécaniques. Utilise l'intelligence pour ses attaques.",
  competences: 'Armes arcano-mécaniques, armures légères (puis moyennes et lourdes)',
  resource: 'none', startingResource: 0,
  startingArmor: { name: 'Robes d\'artificier rembourrées de cuir (légère, AC+1)', ac: 1, type: 'legere' },
  startingEquipment: ["Robes d'artificier (légère, AC+1)", "Arme arcano-mécanique au choix (arbalètes auto, marteau explosif, rapière rétractable, fléau électrifié, gants à pistons, carabine arcanique)", "Fiole infernale : Action bonus (2 charges) – 1d8 brûlants", "Batterie vivante au niveau 5 : accumule de l'énergie pour des effets variés"],
  pvPerLevel: [0, 4, 4, 4, 5, 5, 6, 6, 6, 8, 8, 8, 10, 12, 10, 12, 15, 15, 16, 16],
  resourcePerLevel: Array(20).fill(0),
  specializations: ['Implant cervical', 'Bras mécanisé', 'Plaque d\'acier au cœur'],
  specializationDetails: [
    {
      name: 'Implant cervical',
      summary: "Améliore l'intelligence et les capacités cognitives par voie mécanique.",
      effects: ['Intelligence +1', 'Augmentation biomécanique (niveau 6)'],
    },
    {
      name: 'Bras mécanisé',
      summary: "Un bras mécanique sur l'épaule offre une action bonus supplémentaire.",
      effects: ['Une action bonus supplémentaire par tour', 'Augmentation biomécanique (niveau 6)'],
    },
    {
      name: 'Plaque d\'acier au cœur',
      summary: "Plaque d'acier protège le cœur, augmentant l'AC.",
      effects: ['AC +2', 'Augmentation biomécanique (niveau 6)'],
    },
  ],
};
