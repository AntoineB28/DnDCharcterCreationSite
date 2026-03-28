import type { ClassData } from '../gameData';

/**
 * MAGE - Mage class based on Cahier-du-joueur (lines 296-450)
 * Strictly following rulebook - no invented features
 */
export const mage: ClassData = {
  id: 'mage',
  name: 'Mage',
  difficulty: '★★',
  description: 'Les mages sont des érudits qui étudient le voile, la barrière mystique entre la réalité et Kadath. Leur compréhension de la fabrique du voile permet aux mages de jeter des sorts en utilisant la mana.',
  competences: 'Sorts, armure légère, armes simples (épée courte, massue, bâton, couteau, hachette, pique)',
  resource: 'mana',
  startingResource: 4,
  startingArmor: { name: 'Robes de mage', ac: 0, type: 'robes' },
  startingEquipment: [
    'Trois sorts niveau 1 au choix',
    'Une arme simple au choix',
  ],
  pvPerLevel: [0, 4, 4, 4, 5, 5, 5, 8, 8, 8, 10, 10, 10, 12, 8, 12, 12, 15, 15, 18, 20],
  resourcePerLevel: [4, 8, 10, 12, 14, 14, 14, 14, 14, 16, 18, 18, 18, 20, 20, 20, 22, 22, 22, 24],
  specializations: ['Acolyte', 'Mage guerrier', 'Manavore'],
  specializationDetails: [
    {
      name: 'Acolyte',
      summary: "Passé ta jeunesse dans un collège à étudier le voile. Connaissances approfondies.",
      effects: [
        'Niveau 3 : +3 sorts N1 + +2 sorts N2 + Mana +2 + Intelligence +2',
      ],
    },
    {
      name: 'Mage guerrier',
      summary: "Alliance magie et combat rapproché.",
      effects: [
        'Niveau 3 : PV +10 + Compétence toutes armes/armures + Force/Dextérité +2',
      ],
    },
    {
      name: 'Manavore',
      summary: "Soif de magie insatiable. Sorts plus puissants mais coûtent plus cher.",
      effects: [
        'Niveau 3 : Mana +6 + +1 sort N2 + Tous les sorts coûtent 1 mana de plus mais +1d10 dégâts magiques',
      ],
    },
  ],
  levelSpecificChoices: [
    {
      level: 3,
      name: 'Spécialisation',
      description: 'Choisis comment tu maîtrises la magie.',
      options: [
        'Acolyte|Tu as passé ta jeunesse dans un collège à étudier le voile. Tes connaissances te permettent d\'approfondir ta connexion avec la magie. Gains: +3 sorts N1 + +2 sorts N2 + Mana +2 + Intelligence +2',
        'Mage guerrier|Tu aimes t\'entourer de magie alors que tu extermines tes ennemis grâce à ta prouesse martiale. Te sous-estimer au combat rapproché serait fatal. Gains: PV +10 + Compétence toutes armes/armures + Force/Dextérité +2',
        'Manavore|À l\'intérieur de toi, un creux que seule la magie du voile peut combler. Tu es assailli par le désir de faire jaillir une énergie destructrice. Gains: Mana +6 + +1 sort N2 + Sortes coûtent 1 mana de plus mais +1d10 dégâts magiques',
      ],
      maxChoices: 1,
      displayAsCards: true,
    },
    {
      level: 8,
      name: 'Élémentalisme',
      description: 'Choisis un type de dégâts. Tes sorts de ce type ignorent les résistances et tu as expertise avec eux.',
      options: [
        'Feu|Tes sorts de feu ignorent résistance + expertise',
        'Froid|Tes sorts de froid ignorent résistance + expertise',
        'Foudre|Tes sorts de foudre ignorent résistance + expertise',
        'Acide|Tes sorts d\'acide ignorent résistance + expertise',
        'Nécromancie|Tes sorts nécrotiques ignorent résistance + expertise',
        'Psychique|Tes sorts psychiques ignorent résistance + expertise',
      ],
      maxChoices: 1,
    },
  ],
};
