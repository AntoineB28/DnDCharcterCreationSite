import type { ClassData } from '../gameData';

export const shaman: ClassData = {
  id: 'shaman', name: 'Shaman', difficulty: '★★', dlc: true,
  description: "Conjurateur mystique connecté aux esprits et aux forces élémentaires. Utilise foi pour attack rolls (sorts et miracles). Mana pour sorts et miracles. Ne peut apprendre que des sorts liés aux éléments naturels.",
  competences: 'Armures légères et moyennes, armes simples, sorts élémentaires, miracles',
  resource: 'mana', startingResource: 3,
  startingArmor: { name: 'Robe shamanique (légère, AC+1) ou Armure shamanique (moyenne, AC+3)', ac: 1, type: 'legere' },
  startingEquipment: ["Robe shamanique (légère, AC+1) OU Armure shamanique (moyenne, AC+3)", "Deux armes simples au choix", "Deux sorts niveau 1 au choix (liste élémentaire)", "Mana +3", "Mercie de la nature : Action bonus (coût 1 mana) – soigne 1d8 PV + 1 resource"],
  pvPerLevel: [0, 5, 5, 6, 6, 8, 8, 8, 8, 10, 12, 12, 12, 10, 12, 14, 15, 15, 18, 22],
  resourcePerLevel: [3, 4, 5, 6, 7, 9, 9, 9, 9, 10, 10, 11, 11, 11, 13, 13, 14, 14, 14, 16],
  specializations: ['Shaman de la vie', 'Shaman de la lune', 'Shaman combattant', 'Shaman de la tempête'],
  specializationDetails: [
    {
      name: 'Shaman de la vie',
      summary: "Connexion à Arivis. Spécialiste du soin et de la protection de la vie naturelle.",
      effects: [
        'Apprend un miracle d\'Arivis niveau 1 | Soins +2 PV bonus',
        'Niveau 9 : Miracle d\'Arivis niveau 2 | Niveau 14 : Miracle niveau 3',
        'Niveau 17 : Miracle suprême d\'Arivis',
      ],
    },
    {
      name: 'Shaman de la lune',
      summary: "Béni par Mitulia. Récupère des PV en infligeant des dégâts.",
      effects: [
        'Apprend un miracle de Mitulia niveau 1 | Récupère 2 PV en faisant des dégâts',
        'Niveau 9 : Miracle de Mitulia niveau 2 | Niveau 14 : Miracle niveau 3',
        'Niveau 17 : Miracle suprême de Mitulia',
      ],
    },
    {
      name: 'Shaman combattant',
      summary: "Guerrier né inspiré de ses ancêtres. Force brute et endurance.",
      effects: [
        'Compétence haches, masses et marteaux | PV +10 | Force +2',
        'Niveau 9 : Expertise armes, PV +6, Force +1, 2 attaques/action',
        'Niveau 14 : Maîtrise armes, PV +8, Force +1',
        'Niveau 17 : 3 attaques/action, PV +10, Force +1',
      ],
    },
    {
      name: 'Shaman de la tempête',
      summary: "Connexion aux orages, aux vents et aux éclairs. Sorts électriques dévastateurs.",
      effects: [
        'Mana +1 | Sorts électriques +1d4 dégâts, sav. +1 difficulté',
        'Niveau 9 : Mana +1 | Action bonus 1x/LR pour sort électrique',
        'Niveau 14 : Mana +2 | Sorts électriques +1d8, sav. +2 difficulté',
        'Niveau 17 : Mana +2 | Dédoubler un sort électrique 1x/LR',
      ],
    },
  ],
  startingSpells: 2, startingSpellLevel: 1,
};
