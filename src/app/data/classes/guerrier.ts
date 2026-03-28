import type { ClassData } from '../gameData';

export const guerrier: ClassData = {
  id: 'guerrier', name: 'Guerrier', difficulty: '★', description: "Adepte du combat rapproché. Excel dans le maniement des armes sans magie.",
  competences: 'Toutes armes rapprochées, toutes armures, boucliers',
  resource: 'none', startingResource: 0,
  startingArmor: { name: "Armure d'acier (lourde)", ac: 15, type: 'lourde' },
  startingEquipment: [
    "Attaque supplémentaire : une attaque bonus chaque tour en combat",
    "Second souffle (Action bonus) : récupère 1d10 + niveau PV, une fois par repos court",
    "Légende du combat : augmente ta compétence aux armes",
    "Expertise avec tous les types d'armes : tu ajoutes ton bonus de maîtrise à chacune de tes attaques",
    "Parade préparée (Réaction) : quand une créature que tu peux voir attaque un allié à 5ft, tu peux interposer ton arme et ajouter ta maîtrise à la CA de l'allié",
    "Maître d'Armes : tu maîtrises une catégorie d'armes et fais +6 au jet d'attaque",
    "Spécialisation au choix : Barbare (armes fortes), Défenseur (bouclier), Double-maniement (deux armes rapides)",
    "Arme à deux mains OU deux armes à une main OU arme + bouclier (AC+2)",
    "Armure d'acier (lourde, AC 15)"
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
        'Rage (action bonus) : si tu as perdu 10+ PV, la prochaine attaque fait 1d8 de plus',
        "Niveau 14 : armes à deux mains font 4 dégâts de plus total",
      ],
    },
    {
      name: 'Défenseur',
      summary: "Maître du bouclier. Grande résilience pour les combats longs.",
      effects: [
        'AC +1, PV +6',
        'Coup de bouclier (une fois/combat, action bonus) : 1d6 contondant, saving throw résistance (12) ou sonnée',
        'Niveau 14 : PV+5 et AC+1 supplémentaires',
      ],
    },
    {
      name: 'Double-maniement',
      summary: "Deux armes comme deux poings. Attaques combinées ultra-rapides.",
      effects: [
        'Avec une arme dans chaque main, après avoir attaqué avec l\'arme principale, attaque secondaire gratuite (pas d\'action bonus)',
        'Niveau 14 : +2 au attack roll de l\'arme secondaire',
      ],
    },
  ],
  levelSpecificChoices: [
    {
      level: 5,
      name: 'Gain de score de capacité',
      description: 'Tu t\'entraînes intensément et tes capacités augmentent.',
      options: [
        'Force +2',
        'Dextérité +2',
        'Constitution +2',
        'Force +1, Dextérité +1',
      ],
      maxChoices: 1,
    },
    {
      level: 7,
      name: 'Style de combat',
      description: 'Développe ton propre style de combat qui te rend plus efficace.',
      options: [
        'Protection : AC +1',
        'Champion : Les armes donnent des coups critiques sur 19 et plus',
        'Athlète : Vitesse +1. Tu peux rerouler ton initiative une fois au début du combat',
        'Double tranchant : Avantage sur tes attaques avec armes, mais les attaques ennemies ont avantage contre toi',
        'Contreur : Quand un ennemi rate une attaque mêlée contre toi, tu peux riposter (1x/combat)',
        'Conquérant : Tu as une attaque extra à ton premier tour en combat',
        'Longue haleine : Chaque tour, tu récupères 1d4 PV',
        'Presseur : Quand tu rates une attaque, tu peux accepter de recevoir une riposte et rerouler ton attaque',
      ],
      maxChoices: 1,
    },
    {
      level: 10,
      name: 'Gain de score de capacité',
      description: 'Tu t\'entraînes au-delà de tes limites.',
      options: [
        'Force +2',
        'Dextérité +2',
        'Constitution +2',
        'Sagesse +2',
        'Force +1, Dextérité +1',
        'Force +1, Constitution +1',
        'Dextérité +1, Constitution +1',
      ],
      maxChoices: 1,
    },
    {
      level: 11,
      name: 'Action surcharge améliorée',
      description: 'Tu peux maintenant utiliser ton action Surcharge sans utiliser ton action bonus.',
      options: [
        'Débloquer (confirmer pour activer)',
      ],
      maxChoices: 1,
    },
    {
      level: 15,
      name: 'Gain de score de capacité',
      description: 'Tu atteins le summum de ta force martiale.',
      options: [
        'Force +2',
        'Dextérité +2',
        'Constitution +2',
        'Sagesse +2',
        'Force +1, Dextérité +1',
        'Force +1, Constitution +1',
        'Dextérité +1, Constitution +1',
      ],
      maxChoices: 1,
    },
    {
      level: 16,
      name: 'Deuxième style de combat',
      description: 'Choisis un deuxième style de combat parmi ceux disponibles.',
      options: [
        'Protection : AC +1',
        'Champion : Les armes donnent des coups critiques sur 19 et plus',
        'Athlète : Vitesse +1. Tu peux rerouler ton initiative une fois au début du combat',
        'Double tranchant : Avantage sur tes attaques avec armes, mais les attaques ennemies ont avantage contre toi',
        'Contreur : Quand un ennemi rate une attaque mêlée contre toi, tu peux riposter (1x/combat)',
        'Conquérant : Tu as une attaque extra à ton premier tour en combat',
        'Longue haleine : Chaque tour, tu récupères 1d4 PV',
        'Presseur : Quand tu rates une attaque, tu peux accepter de recevoir une riposte et rerouler ton attaque',
      ],
      maxChoices: 1,
    },
    {
      level: 20,
      name: 'Attaques légendaires',
      description: 'Tu peux effectuer des attaques extraordinaires et des mouvements impossibles.',
      options: [
        'Débloquer (confirmer pour activer)',
      ],
      maxChoices: 1,
    },
  ],
};
