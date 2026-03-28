import type { ClassData } from '../gameData';

/**
 * MAGE - Mage class based on Cahier-du-joueur
 * Level-by-level spell progression with specializations and ultimate spells
 */
export const mage: ClassData = {
  id: 'mage',
  name: 'Mage',
  difficulty: '★★',
  description: 'Les mages sont des érudits qui étudient le voile, la barrière mystique entre la réalité et Kadath, une dimension magique du cosmos.',
  competences: 'Sorts, armure légère, armes simples',
  resource: 'mana',
  startingResource: 4,
  startingArmor: { name: 'Robes de mage', ac: 0, type: 'robes' },
  startingEquipment: [
    'Tempête de mana (niv.2) : Action bonus. Une fois par combat. Récupère 1d6 mana.',
    'Robes de mage (AC protégé)',
    'Une arme simple au choix',
    'Trois sorts niveau 1 au choix',
  ],
  pvPerLevel: [0, 4, 4, 4, 5, 5, 5, 8, 8, 8, 10, 10, 10, 12, 8, 12, 12, 15, 15, 18, 20],
  resourcePerLevel: [4, 8, 10, 12, 14, 14, 14, 14, 14, 16, 18, 18, 18, 20, 20, 20, 22, 22, 22, 24],
  specializations: ['Acolyte', 'Mage guerrier', 'Manavore'],
  specializationDetails: [
    {
      name: 'Acolyte',
      summary: "Érudit studieux. Maximise ta connaissance magique et ton pool de mana.",
      effects: [
        'Niveau 3 : +3 sorts N1 + +2 sorts N2 + Mana +2 + Intelligence +2',
        'Expertise avec arcana',
        'Niveau 14 : +3 sorts N2 + +2 sorts N3 + +1 sort N4 + Mana +2 + Intelligence +1',
      ],
    },
    {
      name: 'Mage guerrier',
      summary: "Alliance magie et combat rapproché. Redoutable au corps-à-corps.",
      effects: [
        'Niveau 3 : PV +10 + Compétence toutes armes rapprochées et armures + Force/Dextérité +2',
        'Robustesse magique',
        'Niveau 14 : PV +10 + Force/Dextérité +2 + Action surge',
      ],
    },
    {
      name: 'Manavore',
      summary: "Sorts dévastateurs mais gourmands. Sacrifie efficacité pour puissance brute.",
      effects: [
        'Niveau 3 : Mana +6 + +1 sort N2 + Tous les sorts coûtent 1 mana de plus mais font 1d10 dégâts magiques supplémentaires',
        'Avidité magique',
        'Niveau 14 : Mana +6 + +1 sort N4',
      ],
    },
  ],
  levelSpecificChoices: [
    {
      level: 3,
      name: 'Spécialisation',
      description: 'Choisis comment tu maîtrises la magie.',
      options: [
        'Acolyte|Tu as passé ta jeunesse dans un collège à étudier le voile. Tes connaissances te permettent d\'approfondir ta connexion avec la magie qui t\'entoure. Gains: +3 sorts N1 + +2 sorts N2 + Mana +2 + Intelligence +2',
        'Mage guerrier|Tu aimes t\'entourer de magie alors que tu extermines tes ennemis grâce à ta prouesse martiale. Tu es un mage, certes, mais te sous-estimer dans un combat rapproché pourrait être fatal. Gains: PV +10 + Compétence toutes armes/armures + Force/Dextérité +2',
        'Manavore|À l\'intérieur de toi, il y a un creux que seule la magie du voile peut combler. Tu es en permanence assaillit par le désir de faire jaillir de tes mains une énergie destructrice. Gains: Mana +6 + +1 sort N2 + Tous les sorts coûtent 1 mana de plus mais +1d10 dégâts magiques',
      ],
      maxChoices: 1,
      displayAsCards: true,
    },
    {
      level: 6,
      name: 'Sort ultime (niveau 3)',
      description: 'Choisis un sort ultime de niveau 3. Utilisable 1x par combat en action bonus sans coût mana.',
      options: [
        'Boule de feu ultime|Un sort de destruction massive',
        'Décharge électrique ultime|Électricité pure',
        'Pique de glace ultime|Pics glaciaux deadly',
      ],
      maxChoices: 1,
    },
    {
      level: 8,
      name: 'Élémentalisme',
      description: 'Choisis un type de dégâts. Tes sorts de ce type ignoreront les résistances et tu auras expertise avec eux.',
      options: [
        'Feu|Sorts de feu ignorent résistance + expertise',
        'Glace|Sorts de glace ignorent résistance + expertise',
        'Électricité|Sorts d\'électricité ignorent résistance + expertise',
        'Acide|Sorts d\'acide ignorent résistance + expertise',
      ],
      maxChoices: 1,
    },
    {
      level: 9,
      name: 'Sort ultime (niveau 4)',
      description: 'Choisis un nouveau sort ultime de niveau 4. Ton ancien devient sort connu. 1x par combat action bonus sans coût.',
      options: [
        'Inferno ultime|Tempête de flammes',
        'Chaîne d\'électricité ultime|Électricité en chaîne',
        'Tempête de glace ultime|Blizzard dévastateur',
      ],
      maxChoices: 1,
    },
    {
      level: 12,
      name: 'Sort ultime (niveau 5)',
      description: 'Choisis un nouveau sort ultime de niveau 5. Ton ancien devient sort connu. 1x par combat action bonus sans coût.',
      options: [
        'Inferno suprême|Cataclysme de feu pur',
        'Tempête électrique suprême|Électricité cataclysmique',
        'Blizzard suprême|Froid absolu destructeur',
      ],
      maxChoices: 1,
    },
    {
      level: 14,
      name: 'Amélioration de spécialisation',
      description: 'Ta spécialisation évolue et se renforce.',
      options: [
        'Acolyte amélioré|Gains: +3 sorts N2 + +2 sorts N3 + +1 sort N4 + Mana +2 + Intelligence +1',
        'Mage guerrier amélioré|Gains: PV +10 + Force/Dextérité +2 + Action surge',
        'Manavore amélioré|Gains: Mana +6 + +1 sort N4',
      ],
      maxChoices: 1,
    },
    {
      level: 18,
      name: 'Sort ultime (niveau 6)',
      description: 'Choisis un nouveau sort ultime de niveau 6. Ton ancien devient sort connu. 1x par combat action bonus sans coût.',
      options: [
        'Cataclysme de feu ultime|Destruction finale par le feu',
        'Tornade électrique ultime|Tempête de force brute',
        'Froid éternel ultime|Gel perpétuel du monde',
      ],
      maxChoices: 1,
    },
  ],
};
