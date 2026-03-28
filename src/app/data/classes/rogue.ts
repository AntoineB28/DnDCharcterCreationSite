import type { ClassData } from '../gameData';

export const rogue: ClassData = {
  id: 'rogue', name: 'Rogue', difficulty: '★★', description: "Expert en discrétion et tricherie. Utilise ses talents pour tourner les situations à son avantage.",
  competences: 'Armes de dextérité, armes de jet, armures légères et moyennes',
  resource: 'none', startingResource: 0,
  startingArmor: { name: 'Veste de cuir (légère, AC+1)', ac: 1, type: 'legere' },
  startingEquipment: ["Deux armes de dextérité au choix", "5 couteaux de lancer (1d4 tranchant)", "Veste de cuir (légère, AC+1)", "Vitesse +2 (classe)"],
  pvPerLevel: [0, 5, 5, 6, 6, 6, 8, 8, 10, 10, 12, 10, 12, 12, 14, 14, 16, 16, 18, 20],
  resourcePerLevel: Array(20).fill(0),
  specializations: ['Assassin', 'Voleur arcaniste', "Tireur d'élite", 'Duelliste'],
  specializationDetails: [
    {
      name: 'Assassin',
      summary: "Tuer vite et sans bruit. Spécialiste des dagues et des coups critiques.",
      effects: [
        'Saving throw pour se cacher abaissé à 10 (puis 8 au niv.10)',
        'Coup critique = +1d10 perçant (avant doublement)',
        'Coup critique sur 18+ avec les dagues | Expertise dagues',
        'Niveau 14 : Maîtrise dagues, crit sur 16+',
      ],
    },
    {
      name: 'Voleur arcaniste',
      summary: "Subtilise des artefacts magiques pour canaliser leur pouvoir. Mage et rogue à la fois.",
      effects: [
        'Intelligence +2 | Mana +2',
        '2 sorts niveau 1 au choix | Compétence sorts',
        'Couteaux de lancer : +1d4 dégâts magiques',
        'Niveau 10 : Mana+2, sort niv.2',
      ],
    },
    {
      name: "Tireur d'élite",
      summary: "L'arc comme extension de soi. Précision et cadence de tir implacables.",
      effects: [
        'Expertise arcs | Coup critique sur 18+ avec les arcs',
        'Après un coup critique : réattaque en action bonus',
        'Arcs font +1d4 dégâts perçants',
        'Niveau 10 : arcs font +1d8 | Niveau 14 : Maîtrise arcs',
      ],
    },
    {
      name: 'Duelliste',
      summary: "Un seul sabre, une seule cible, un seul résultat. Duel à la rapière.",
      effects: [
        'Expertise sabres et rapières',
        'Si seul sabre/rapière sans bouclier : +1d6 dégâts (tranchant ou perçant)',
        'Armures légères donnent AC +3',
        'Niveau 10 : +2d6 dégâts | Niveau 14 : riposte quand attaque mêlée rate',
      ],
    },
  ],
};
