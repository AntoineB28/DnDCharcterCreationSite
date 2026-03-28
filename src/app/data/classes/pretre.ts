import type { ClassData } from '../gameData';

export const pretre: ClassData = {
  id: 'pretre', name: 'Prêtre', difficulty: '★★', description: "Vénère un dieu. Sa piété lui donne des points de divinité pour des miracles.",
  competences: 'Miracles, toutes armures, boucliers, armes simples',
  resource: 'divinite', startingResource: 4,
  startingArmor: { name: "Robes de prêtre ou Armure de fer (moyenne, AC+3)", ac: 3, type: 'moyenne' },
  startingEquipment: ["Robes de prêtre OU Armure de fer (moyenne, AC+3)", "Arme simple au choix", "1 miracle niveau 1 au choix + 1 miracle niveau 1 du dieu choisi", "Divinité +4"],
  pvPerLevel: [0, 6, 6, 8, 8, 10, 10, 8, 10, 12, 12, 14, 14, 12, 14, 16, 18, 18, 20, 22],
  resourcePerLevel: [4, 4, 4, 6, 6, 6, 6, 6, 7, 8, 8, 9, 9, 9, 9, 9, 9, 9, 9, 11],
  specializations: ['Chevalier templier', 'Pénitent', 'Fanatique'],
  specializationDetails: [
    {
      name: 'Chevalier templier',
      summary: "Foi convertie en puissance martiale. Frappe tes ennemis au nom de ton dieu.",
      effects: [
        'Compétence avec les armes de force',
        'Ton bonus de foi s\'ajoute aux attaques de force (en plus de la force)',
        'Contrer l\'hérésie (action bonus) : si la cible ne vénère pas ton dieu, +1d8 dégâts divins ce tour',
        'Niveau 14 : Contrer l\'hérésie devient permanent (2d8). Peut payer 3 divinité pour attaque sup.',
      ],
    },
    {
      name: 'Pénitent',
      summary: "La douleur te rapproche de ton dieu. Plus tu souffres, plus tu es puissant.",
      effects: [
        'Constitution +2',
        'Récupères 1 divinité chaque fois que tu reçois 8+ dégâts en un seul coup',
        'Sans armure : attack rolls des miracles +2 et saving throws +2 de difficulté',
        'Niveau 14 : Constitution+1, bonus portés à +3',
      ],
    },
    {
      name: 'Fanatique',
      summary: "Dévotion totale. Puissance divine maximale au prix de tout le reste.",
      effects: [
        'Foi +2 | Divinité +4',
        'Un miracle niveau 3 du dieu choisi (accès anticipé)',
        'Niveau 14 : Foi+1, Divinité+2',
      ],
    },
  ],
  deityRequired: true, deityType: 'any',
  startingMiracles: 2,
};
