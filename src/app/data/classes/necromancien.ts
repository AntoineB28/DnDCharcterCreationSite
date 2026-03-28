import type { ClassData } from '../gameData';

export const necromancien: ClassData = {
  id: 'necromancien', name: 'Nécromancien', difficulty: '★★★★', description: "Manipule la mort comme ressource. Contrôle des entités mortes-vivantes grâce à Laeth.",
  competences: 'Armes simples, armures légères et moyennes, sorts, miracles de Laeth',
  resource: 'necromancie', startingResource: 3,
  startingArmor: { name: 'Robes de nécromancien', ac: 0, type: 'robes' },
  startingEquipment: ["Robes de nécromancien", "Une arme simple au choix", "Points de nécromancie +3", "Sort : Orbe sombre (offert)", "Combattant squelettique : Action, invoque un squelette"],
  pvPerLevel: [0, 5, 5, 5, 5, 5, 6, 8, 10, 12, 12, 12, 12, 12, 12, 12, 14, 16, 18, 20],
  resourcePerLevel: [3, 4, 4, 5, 6, 6, 6, 6, 6, 6, 7, 7, 8, 8, 8, 8, 8, 8, 8, 8],
  specializations: ['Maître des marionnettes', 'Maître des morts', 'Maître de la nuit', 'Maître du mal'],
  specializationDetails: [
    {
      name: 'Maître des marionnettes',
      summary: "Tes squelettes sont la précision incarnée. Deux à la fois pour 2 points.",
      effects: [
        'Combattant squelettique peut invoquer 2 squelettes pour 2 pts de nécromancie',
        'Squelettes : +2 aux attack rolls',
        'Les squelettes comptent comme 0.5 entité (jusqu\'à 4 contrôlés)',
        'Niveau 8 : Squelettes +2 à l\'initiative',
      ],
    },
    {
      name: 'Maître des morts',
      summary: "Des zombies robustes et agressifs. Ils encaissent les coups pour toi.",
      effects: [
        'Zombies : +10 PV',
        'Zombies : +2 aux attack rolls',
        'Niveau 8 : Zombies +10 PV supplémentaires',
      ],
    },
    {
      name: 'Maître de la nuit',
      summary: "Les fantômes te coûtent peu et frappent fort. La terreur psychique incarnée.",
      effects: [
        'Outre-tombe coûte seulement 1 point de nécromancie',
        'Fantômes : +2 aux attack rolls',
        'Niveau 8 : Fantômes +2 aux attack rolls supplémentaires',
      ],
    },
    {
      name: 'Maître du mal',
      summary: "Tu préfères faire le sale boulot toi-même. Orbe maléfique à prix réduit.",
      effects: [
        'Apprend le sort Orbe maléfique',
        'Orbe maléfique coûte seulement 1 point de nécromancie',
        'Niveau 8 : Apprend Orbe des ténèbres (1 pt de nécromancie)',
      ],
    },
  ],
  requiresDeity: true,
};
