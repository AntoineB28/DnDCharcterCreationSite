import type { ClassData } from '../gameData';

export const sepulcral: ClassData = {
  id: 'sepulcral', name: 'Sépulcral', difficulty: '★★', dlc: true,
  description: "Guerrier ayant traversé la frontière entre vie et mort. Champion de Laeth. Utilise la mana pour ses sorts de glace et miracles de Laeth. Résistance froid/nécrotique, vulnérabilité feu/divin.",
  competences: 'Épées longues, épées à deux mains, haches, masses, marteaux, boucliers, armures moyennes et lourdes, sorts de froid (foi), miracles de Laeth (mana)',
  resource: 'mana', startingResource: 2,
  startingArmor: { name: "Armure à l'effigie de Laeth (lourde, AC+5)", ac: 15, type: 'lourde' },
  startingEquipment: ["Armure à l'effigie de Laeth (lourde, AC+5)", "Arme à l'effigie de Laeth au choix", "Mana +2", "Sort Pique de glace (offert)", "Miracle Froid de la tombe (offert)"],
  pvPerLevel: [0, 6, 6, 6, 8, 10, 12, 12, 10, 10, 12, 10, 12, 14, 14, 15, 15, 15, 15, 18],
  resourcePerLevel: [2, 3, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 10, 10, 10, 12, 12, 14, 14, 16],
  specializations: ['Glace brisée', 'Dernier souffle', 'Voix de Laeth'],
  specializationDetails: [
    {
      name: 'Glace brisée',
      summary: "Maître du gel et de la déstabilisation. Tes attaques ralentissent et figent tout.",
      effects: [
        'Attaques avec armes font 1d4 dégâts de froid supplémentaires',
        'Quand un ennemi te touche en mêlée, il doit réussir sav. CON (12) ou subir 1d4 froid',
        'Niveau 14 : Force +1. Maîtrise du gel (2d4 froid) | Frissons paralysants (sav. CON 15 ou paralysé)',
      ],
    },
    {
      name: 'Dernier souffle',
      summary: "Puise dans la nécrose pour guérir et débiliter tes victimes.",
      effects: [
        'Attaques avec armes font 2 dégâts nécrotiques supplémentaires',
        'Chaque fois que tu touches un ennemi, tu récupères 2 PV',
        'Niveau 14 : PV +6. Ressource nécrotique (+2d4 PV/dégâts nécrotiques) | Pacte de la fin (1d8 nécrotiques pour 2 mana)',
      ],
    },
    {
      name: 'Voix de Laeth',
      summary: "Les mots de Laeth amplifient tes sorts et miracles de froid et de nécrose.",
      effects: [
        'Mana +2',
        'Sorts et miracles de froid/nécrotiques font 1d4 de plus',
        'Niveau 14 : Mana +1. Décret implacable (ignore résistances) | Invocation du gouffre (2d6 nécrotiques/tour, 3 tours)',
      ],
    },
  ],
  deityRequired: true, deityType: 'dark',
  requiresDeity: true,
};
