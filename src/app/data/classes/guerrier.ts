import type { ClassData } from '../gameData';

/**
 * GUERRIER - Warrior class based on Cahier-du-joueur
 * Level-by-level progression with fixed abilities and stat choices
 */
export const guerrier: ClassData = {
  id: 'guerrier',
  name: 'Guerrier',
  difficulty: '★',
  description: "Adepte du combat rapproché. Excel dans le maniement des armes sans magie. Les guerriers sont des combattants efficaces qui gagnent par leur seule détermination et leur prouesse au combat.",
  competences: 'Toutes armes rapprochées, toutes armures, boucliers',
  resource: 'none',
  startingResource: 0,
  startingArmor: { name: "Armure d'acier (lourde)", ac: 15, type: 'lourde' },
  // Level 1 starting abilities only
  startingEquipment: [
    "Second souffle : Action bonus. Une fois par combat. Récupère 1d8 par niveau PV.",
    "Arme au choix : Une arme à deux mains, deux armes à une main, ou une arme + bouclier (AC +2)",
    "Armure d'acier (lourde, AC 15)",
  ],
  pvPerLevel: [0, 8, 8, 10, 10, 12, 12, 12, 12, 10, 10, 10, 12, 15, 15, 18, 18, 18, 20, 22],
  resourcePerLevel: Array(20).fill(0),
  specializations: ['Barbare', 'Défenseur', 'Double-maniement'],
  specializationDetails: [
    {
      name: 'Barbare',
      summary: "Violence brute et rage. Tu priorises l'offensive et frappes fort.",
      effects: [
        'Les armes à deux mains font 2 dégâts de plus',
        'Rage : Action bonus. Peut seulement être utilisé s\'il te manque au moins 10 PV. La prochaine attaque avec une arme fait 1d8 de plus.',
        'Niveau 14 : Les armes à deux mains font 4 dégâts de plus au total',
      ],
    },
    {
      name: 'Défenseur',
      summary: "Maître du bouclier. Grande résilience pour les combats longs.",
      effects: [
        'AC +1, PV +6',
        'Coup de bouclier : Une fois par combat. Action bonus. Fait 1d6 contondant. La cible doit réussir un saving throw de résistance (12) ou être sonnée et passer son prochain tour.',
        'Niveau 14 : PV +5 et AC +1 supplémentaires',
      ],
    },
    {
      name: 'Double-maniement',
      summary: "Deux armes comme deux poings. Attaques combinées ultra-rapides.",
      effects: [
        'Lorsque tu as une arme dans chaque main et que tu attaques avec ton arme principale, tu peux immédiatement attaquer avec ton arme secondaire sans utiliser ton action bonus.',
        'Niveau 14 : Lorsque tu attaques avec ton arme secondaire immédiatement après avoir utilisé ton arme principale, tu as +2 à ton attack roll',
      ],
    },
  ],
  levelSpecificChoices: [
    {
      level: 3,
      name: 'Spécialisation',
      description: 'Choisis ta spécialisation martiale.',
      options: [
        'Barbare|Violence brute et rage. Tu priorises l\'offensive et frappes fort. Les armes à deux mains font 2 dégâts de plus. Rage : Action bonus. Peut seulement être utilisé s\'il te manque au moins 10 PV. La prochaine attaque avec une arme fait 1d8 de plus. Niveau 14 : Les armes à deux mains font 4 dégâts de plus au total',
        'Défenseur|Maître du bouclier. Grande résilience pour les combats longs. AC +1, PV +6. Coup de bouclier : Une fois par combat. Action bonus. Fait 1d6 contondant. La cible doit réussir un saving throw de résistance (12) ou être sonnée et passer son prochain tour. Niveau 14 : PV +5 et AC +1 supplémentaires',
        'Double-maniement|Deux armes comme deux poings. Attaques combinées ultra-rapides. Lorsque tu as une arme dans chaque main et que tu attaques avec ton arme principale, tu peux immédiatement attaquer avec ton arme secondaire sans utiliser ton action bonus. Niveau 14 : Lorsque tu attaques avec ton arme secondaire immédiatement après avoir utilisé ton arme principale, tu as +2 à ton attack roll'
      ],
      maxChoices: 1,
      displayAsCards: true,
    },
    {
      level: 4,
      name: 'Expertise avec un type d\'armes',
      description: 'Tu maîtrises maintenant un type d\'armes spécifique. Écris le type d\'armes de ton choix.',
      options: [],
      maxChoices: 1,
    },
    {
      level: 5,
      name: 'Gain de score de capacité',
      description: 'Tu t\'entraînes intensément. Augmente Force ou Dextérité de +2.',
      options: ['Force +2', 'Dextérité +2'],
      maxChoices: 1,
    },
    {
      level: 7,
      name: 'Style de combat',
      description: 'Tu développes ton propre style qui te permet d\'être plus efficace dans tes actions.',
      options: [
        'Protection : AC +1',
        'Champion : Les armes donnent des coups critiques sur 19 et plus',
        'Athlète : Vitesse +1. Tu peux rerouler ton initiative une fois au début du combat',
        'Double tranchant : Avantage sur tes attaques avec armes, mais les attaques ennemies ont avantage contre toi',
        'Contreur : Lorsqu\'un ennemi rate une attaque mêlée contre toi, tu peux riposter. Une fois par combat.',
        'Conquérant : Tu as une attaque extra à ton premier tour durant un combat',
        'Longue haleine : Chaque tour, tu récupères 1d4 PV',
        'Presseur : Lorsque tu rates une attaque, tu peux accepter de recevoir une riposte et rerouler ton attaque',
      ],
      maxChoices: 1,
    },
    {
      level: 10,
      name: 'Gain de Force ou Dextérité',
      description: 'Ton corps devient de plus en plus robuste. Augmente Force ou Dextérité de +1.',
      options: ['Force +1', 'Dextérité +1'],
      maxChoices: 1,
    },
    {
      level: 10,
      name: 'Gain de Vitesse ou Résistance',
      description: 'Tu affûtes aussi ta rapidité ou ta défense. Augmente Vitesse ou Résistance de +1.',
      options: ['Vitesse +1', 'Résistance +1'],
      maxChoices: 1,
    },
    {
      level: 12,
      name: 'Maîtrise d\'une arme',
      description: 'Ta compréhension des armes et des techniques martiales est inégalée. Tu gagnes Maîtrise (+6 au attack roll) avec un type d\'arme au choix. Écris le type d\'armes.',
      options: [],
      maxChoices: 1,
    },
    {
      level: 16,
      name: 'Deuxième style de combat',
      description: 'Tu maîtrises maintenant un second style de combat parmi ceux disponibles au niveau 7.',
      options: [
        'Protection : AC +1',
        'Champion : Les armes donnent des coups critiques sur 19 et plus',
        'Athlète : Vitesse +1. Tu peux rerouler ton initiative une fois au début du combat',
        'Double tranchant : Avantage sur tes attaques avec armes, mais les attaques ennemies ont avantage contre toi',
        'Contreur : Lorsqu\'un ennemi rate une attaque mêlée contre toi, tu peux riposter. Une fois par combat.',
        'Conquérant : Tu as une attaque extra à ton premier tour durant un combat',
        'Longue haleine : Chaque tour, tu récupères 1d4 PV',
        'Presseur : Lorsque tu rates une attaque, tu peux accepter de recevoir une riposte et rerouler ton attaque',
      ],
      maxChoices: 1,
    },
    {
      level: 18,
      name: 'Maîtrise totale et amélioration de statistique',
      description: 'Tu gagnes Maîtrise avec tous les types d\'armes et tu peux améliorer une autre statistique.',
      options: ['Force +2', 'Dextérité +2', 'Vitesse +2'],
      maxChoices: 1,
    },
  ],
};
