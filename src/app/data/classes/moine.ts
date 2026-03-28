import type { ClassData } from '../gameData';

export const moine: ClassData = {
  id: 'moine', name: 'Moine', difficulty: '★★', description: "Développe une connexion avec son corps via la méditation. Utilise le ki pour ses mouvements.",
  competences: 'Bâtons, attaques sans arme',
  resource: 'ki', startingResource: 0,
  startingArmor: { name: 'Robes de moine', ac: 0, type: 'robes' },
  startingEquipment: ["Robes de moine", "Bâton (dextérité, 1d8, contondant)", "Arts martiaux : attaques sans arme utilisent force ET dextérité", "Réflexes : bonus dextérité ajouté à l'AC si pas d'armure"],
  pvPerLevel: [0, 8, 8, 8, 10, 10, 10, 12, 14, 14, 14, 14, 12, 12, 16, 16, 18, 20, 22, 24],
  resourcePerLevel: [0, 2, 2, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 6, 6, 7],
  specializations: ['Zen', 'Artiste martial', 'Élémentaliste'],
  specializationDetails: [
    {
      name: 'Zen',
      summary: "Calme intérieur et maîtrise des bâtons. Tu esquives plus que tu n'absorbes.",
      effects: [
        'Expertise bâtons | AC +1',
        'Déviation (1 ki) : lorsque tu es touché, tu peux tenter d\'esquiver l\'attaque',
        'Niveau 14 : Maîtrise bâtons',
      ],
    },
    {
      name: 'Artiste martial',
      summary: "Ton corps est ton arme. Force et efficacité à mains nues.",
      effects: [
        'Expertise attaques sans armes',
        '+2 distribués librement dans Force, Dextérité ou Résistance',
        'Niveau 14 : Maîtrise attaques sans armes',
      ],
    },
    {
      name: 'Élémentaliste',
      summary: "Le ki prend la forme des éléments. Chaque coup peut brûler, geler ou électrocuter.",
      effects: [
        'Poings élémentaires (1 ki, sans action) : choix feu (1d6 brûlant), glace (1d4 froid + saignement), électricité (1d4 électrique + sonné)',
        'Niveau 14 : Ki +2',
      ],
    },
  ],
};
