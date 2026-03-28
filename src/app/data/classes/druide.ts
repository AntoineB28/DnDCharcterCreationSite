import type { ClassData } from '../gameData';

export const druide: ClassData = {
  id: 'druide', name: 'Druide', difficulty: '★★★', description: "Connexion profonde avec la nature. Lance des sorts et se transforme en animal.",
  competences: 'Armes simples, toutes armures, boucliers, sorts',
  resource: 'mana', startingResource: 2,
  startingArmor: { name: 'Armure druidique (légère, AC+2)', ac: 2, type: 'legere' },
  startingEquipment: ["Arme simple au choix", "Armure druidique (légère, AC+2)", "Deux sorts niveau 1 au choix", "Mana +2"],
  pvPerLevel: [0, 6, 6, 6, 6, 6, 8, 8, 8, 10, 10, 12, 14, 14, 14, 14, 16, 16, 18, 20],
  resourcePerLevel: [2, 2, 4, 4, 4, 6, 6, 8, 8, 8, 9, 9, 9, 9, 9, 9, 10, 10, 10, 13],
  specializations: ['Jaguar', 'Loup', 'Ours'],
  specializationDetails: [
    {
      name: 'Jaguar',
      summary: "Vitesse et saignement. Griffes précises, coups critiques fréquents.",
      effects: [
        'Forme animale : Résistance 12, AC 12, PV 34, Vitesse 18, Force 14, Dex 16',
        'Griffes (dextérité) : 1d8 tranchant/niveau, saignement (2)',
        'Niveau 6 → Panthère : AC 14, PV 40, Vitesse 20. Crit sur 18-',
        'Niveau 14 → crit sur 16-. Multi-attaque (3 griffes, une fois/combat)',
      ],
    },
    {
      name: 'Loup',
      summary: "Polyvalence et soutien. Morsure combinant force et dextérité, cri de ralliement.",
      effects: [
        'Forme animale : Résistance 10, AC 13, PV 40, Vitesse 16, Force 14, Dex 14',
        'Morsure (force + dextérité) : 1d8 tranchant/niveau',
        'Niveau 6 → Loup blanc : AC 15, Vitesse 18. Cri de meute (alliés +2 au prochain attack roll)',
        'Niveau 14 : Morsure 1d10/niveau, AC 16',
      ],
    },
    {
      name: 'Ours',
      summary: "Tank brutal. PV immenses et coups qui sonnent les ennemis.",
      effects: [
        'Forme animale : Résistance 16, AC 15, PV 52, Vitesse 12, Force 16, Dex 10',
        'Coup de patte (force) : 1d8 contondant/niveau, saving throw résistance (12) ou sonnée',
        'Niveau 6 → Hibours : AC 17, PV 60, Force 20. Rage (action bonus)',
        'Niveau 14 : Force 22. Vol écrasant (2x/combat)',
      ],
    },
  ],
  startingSpells: 2, startingSpellLevel: 1,
};
