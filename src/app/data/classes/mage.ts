import type { ClassData } from '../gameData';

export const mage: ClassData = {
  id: 'mage', name: 'Mage', difficulty: '★★', description: "Érudit qui étudie le voile pour lancer des sorts en utilisant la mana.",
  competences: 'Sorts, armure légère, armes simples',
  resource: 'mana', startingResource: 4,
  startingArmor: { name: 'Robes de mage', ac: 0, type: 'robes' },
  startingEquipment: ['Lancement de sorts : utilise intelligence pour attaque, constitution pour saves', 'Connaissance arcanique : bonus intelligence aux checks de magie', 'Trois sorts niveau 1 au choix', 'Robes de mage', 'Une arme simple au choix', 'Mana +4'],
  pvPerLevel: [0, 4, 4, 5, 5, 5, 8, 8, 8, 10, 10, 10, 12, 8, 12, 12, 15, 15, 18, 20],
  resourcePerLevel: [4, 6, 6, 8, 8, 8, 8, 8, 10, 12, 12, 12, 12, 12, 12, 14, 14, 14, 14, 16],
  specializations: ['Acolyte', 'Mage guerrier', 'Manavore'],
  specializationDetails: [
    {
      name: 'Acolyte',
      summary: "Érudit studieux. Maximise ta connaissance magique et ton pool de mana.",
      effects: [
        '+3 sorts niveau 1 au choix',
        '+2 sorts niveau 2 au choix',
        'Mana +2 | Intelligence +2',
        'Niveau 14 : encore plus de sorts et Intelligence+1',
      ],
    },
    {
      name: 'Mage guerrier',
      summary: "Alliance magie et combat rapproché. Redoutable au corps-à-corps.",
      effects: [
        'PV +10',
        'Compétence toutes armes rapprochées et toutes armures',
        'Force ou Dextérité +2',
        'Niveau 14 : PV+10, Force/Dex+2, Action surge',
      ],
    },
    {
      name: 'Manavore',
      summary: "Sorts dévastateurs mais gourmands. Sacrifie l'efficacité pour la puissance brute.",
      effects: [
        'Mana +6',
        'Un sort niveau 2 au choix',
        'Tous les sorts coûtent 1 mana de plus, mais font 1d10 de dégâts magiques supplémentaires',
        'Niveau 14 : Mana+6, sort niv.4',
      ],
    },
  ],
  startingSpells: 3, startingSpellLevel: 1,
};
