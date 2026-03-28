// ─── TYPES ───────────────────────────────────────────────────────────────────
export type StatKey = 'intelligence' | 'foi' | 'charisme' | 'dexterite' | 'force' | 'vitesse' | 'constitution' | 'resistance';

export interface RaceData {
  id: string;
  name: string;
  description: string;
  statBonuses: Partial<Record<StatKey, number>>;
  abilities: string[];
  manaBonus?: number;
  diviniteBonus?: number;
  subtypes?: SubtypeData[];
  special?: string[];
  dlc?: boolean;
}

export interface SubtypeData {
  id: string;
  name: string;
  statBonuses: Partial<Record<StatKey, number>>;
  abilities: string[];
  manaBonus?: number;
  startingSpell?: string;
}

export interface SpecializationData {
  name: string;
  summary: string;
  effects: string[];
}

export interface ClassData {
  id: string;
  name: string;
  difficulty: string;
  description: string;
  competences: string;
  resource: 'mana' | 'divinite' | 'ki' | 'necromancie' | 'vampirique' | 'pv' | 'melodieux' | 'none';
  startingResource: number;
  startingArmor: { name: string; ac: number; type: 'legere' | 'moyenne' | 'lourde' | 'robes' | 'none' };
  startingEquipment: string[];
  pvPerLevel: number[];
  resourcePerLevel: number[];
  specializations?: string[];
  specializationDetails?: SpecializationData[];
  deityRequired?: boolean;
  deityType?: 'any' | 'dark';
  startingSpells?: number;
  startingSpellLevel?: number;
  startingMiracles?: number;
  requiresDeity?: boolean;
  dlc?: boolean;
  levelSpecificChoices?: {
    level: number;
    name: string;
    description: string;
    options: string[];
    maxChoices?: number;
  }[];
}

// ─── MIRACLE LIMITS ──────────────────────────────────────────────────────────
// Returns per-level slot maps for deity and free miracle picks.
// deitySlots / freeSlots: { [miracleLevel]: maxCount }
// strictByLevel: if true, each level has its own cap (prêtre, sorcier)
//                if false, use totals (sum of all slot values) for flexible classes
// maxLevel: highest miracle level accessible
export function getMiracleLimit(
  classeId: string, niveau: number
): {
  deitySlots: Record<number, number>;
  freeSlots: Record<number, number>;
  maxLevel: number;
  forcedDeity?: string;
  strictByLevel: boolean;
} {
  const empty = { deitySlots: {}, freeSlots: {}, maxLevel: 0, strictByLevel: false };

  if (classeId === 'pretre') {
    // Per-level slots: strict
    let d: Record<number, number> = { 1: 1 };
    let f: Record<number, number> = { 1: 1 };
    let maxLevel = 1;
    if (niveau >= 2) { d = { ...d, 2: 1 }; maxLevel = 2; }
    if (niveau >= 4) { d = { ...d, 2: 2 }; f = { ...f, 2: 1 }; }
    if (niveau >= 5) { d = { ...d, 3: 1 }; maxLevel = 3; }
    if (niveau >= 6) { f = { ...f, 3: 1 }; }
    if (niveau >= 9) { d = { ...d, 3: (d[3] ?? 0) + 1 }; }
    if (niveau >= 12) { maxLevel = 4; }
    if (niveau >= 15) { d = { ...d, 4: 1 }; }
    if (niveau >= 17) { d = { ...d, 4: (d[4] ?? 0) + 1 }; }
    if (niveau >= 18) { maxLevel = 5; }
    if (niveau >= 20) { d = { ...d, 5: 1 }; }
    return { deitySlots: d, freeSlots: f, maxLevel, strictByLevel: true };
  }

  if (classeId === 'sorcier') {
    // Per-level slots: strict, dark deity only, no free
    let d: Record<number, number> = { 1: 1 };
    let maxLevel = 1;
    if (niveau >= 5)  { d = { ...d, 2: 1, 3: 1 }; maxLevel = 3; }
    if (niveau >= 11) { d = { ...d, 3: (d[3] ?? 0) + 1 }; }
    if (niveau >= 14) { d = { ...d, 4: 1 }; maxLevel = 4; }
    if (niveau >= 20) { d = { ...d, 5: 1 }; maxLevel = 5; }
    return { deitySlots: d, freeSlots: {}, maxLevel, strictByLevel: true };
  }

  if (classeId === 'necromancien') {
    // 1–2 slots flexible (up to level 2 then 3) for Laeth only
    let d: Record<number, number> = {};
    let maxLevel = 0;
    if (niveau >= 6) { d = { 2: 1 }; maxLevel = 2; }
    if (niveau >= 9) { d = { 2: 1, 3: 1 }; maxLevel = 3; }
    return { deitySlots: d, freeSlots: {}, maxLevel, forcedDeity: 'Laeth', strictByLevel: false };
  }

  if (classeId === 'druide') {
    let d: Record<number, number> = {};
    let maxLevel = 0;
    if (niveau >= 4)  { d = { 2: 1 }; maxLevel = 2; }
    if (niveau >= 15) { d = { 2: 1, 3: 1 }; maxLevel = 3; }
    if (niveau >= 20) { d = { 2: 1, 3: 1, 4: 1 }; maxLevel = 4; }
    return { deitySlots: d, freeSlots: {}, maxLevel, forcedDeity: 'Arivis', strictByLevel: false };
  }

  if (classeId === 'guerrier') {
    let d: Record<number, number> = {};
    let maxLevel = 0;
    if (niveau >= 6)  { d = { 2: 1 }; maxLevel = 2; }
    if (niveau >= 9)  { d = { 2: 2 }; }
    if (niveau >= 20) { d = { 2: 2, 3: 1 }; maxLevel = 3; }
    return { deitySlots: d, freeSlots: {}, maxLevel, forcedDeity: 'Erkanos', strictByLevel: false };
  }

  return { ...empty, strictByLevel: false };
}

// Helpers to read limit totals
export function slotTotal(slots: Record<number, number>): number {
  return Object.values(slots).reduce((a, b) => a + b, 0);
}

// Returns readable level label
export function miracleLevelLabel(lvl: number): string {
  const labels = ['', 'Niveau 1', 'Niveau 2', 'Niveau 3', 'Suprême', 'Ultime'];
  return labels[lvl] ?? '';
}

// ─── RACES ───────────────────────────────────────────────────────────────────
export const RACES: RaceData[] = [
  {
    id: 'humain', name: 'Humain', description: "La race la plus nombreuse de Midian. Les humains s'adaptent à toutes situations et ont une résistance naturelle.",
    statBonuses: { constitution: 1 },
    abilities: ['Compétence avec toutes les armes', 'Compétence armures légères et moyennes', '1 équipement de niveau 1 supplémentaire au choix'],
    special: ['equipmentBonus'],
  },
  {
    id: 'elfe', name: 'Elfe', description: "Êtres magiques descendants du dieu Arivis. Grands, minces, immortels à Alfheim.",
    statBonuses: { intelligence: 2, vitesse: 1 },
    abilities: ['Compétence armes de dextérité', 'Compétence sorts'],
    manaBonus: 2,
    special: ['startSpell1'],
  },
  {
    id: 'orc', name: 'Orc', description: "Descendants de Mitulia. Marins et guerriers hors pairs organisés en tribus.",
    statBonuses: { force: 2, constitution: 2 },
    abilities: ['Compétence armes de force', 'Compétence toutes armures'],
  },
  {
    id: 'nain', name: 'Nain', description: "Issus d'Erkanos le forgeron. Robustes montagnards bons vivants.",
    statBonuses: { resistance: 1, constitution: 1 },
    abilities: ['Compétence armes de force', 'Compétence boucliers', 'Compétence toutes armures'],
  },
  {
    id: 'gnome', name: 'Gnome', description: "Cousins des nains croisés avec des elfes. Charmeurs et rapides.",
    statBonuses: { vitesse: 2, charisme: 2, dexterite: 1 },
    abilities: [],
  },
  {
    id: 'gobelin', name: 'Gobelin', description: "Cousins des nains croisés avec des orcs. Vifs mais mal vus.",
    statBonuses: { vitesse: 2, dexterite: 2, resistance: 1, charisme: -2, intelligence: -2 },
    abilities: ['Compétence armes de dextérité'],
  },
  {
    id: 'drow', name: 'Drow', description: "Cousins des elfes vivant dans les terres sombres. Vénèrent Laeth.",
    statBonuses: { foi: 2, constitution: 1, dexterite: 1 },
    abilities: ['Compétence armes de dextérité', 'Vision nocturne'],
  },
  {
    id: 'kenku', name: 'Kenku', description: "Mi-humains mi-oiseaux descendants de Katong. Pacifiques et discrets.",
    statBonuses: { vitesse: 2, dexterite: 4, constitution: -2, force: -2 },
    abilities: ['Vol (avantage contre les cibles au sol)'],
  },
  {
    id: 'kobalos', name: 'Kobalos', description: "Hommes-loups du nord. Élitistes et violents. Ne peuvent pas être vampires.",
    statBonuses: {},
    abilities: ['Résistance au poison', 'Morsure : Action, 1d6/niveau'],
    subtypes: [
      { id: 'shaiksa', name: 'Kobalos de Shaiksa', statBonuses: { dexterite: 2 }, abilities: ['Malédiction Shaiksa : À la mort, projette une image mentale du tueur à tous ses frères'] },
      { id: 'haizda', name: 'Kobalos de Haizda', statBonuses: { constitution: 2 }, manaBonus: 2, abilities: ['Mana +2'], startingSpell: 'Souffle acide' },
      { id: 'triumvirat', name: 'Kobalos de Triumvirat', statBonuses: { intelligence: 2 }, manaBonus: 2, abilities: ['Mana +2'], startingSpell: 'Taillade de vent' },
    ],
  },
  {
    id: 'gorgone', name: 'Gorgone', description: "Femmes immortelles aux yeux mortels et serpents pour cheveux. Enfants de Sugriok et Laeth.",
    statBonuses: { charisme: 2, vitesse: 1 },
    abilities: ['Regard pétrifiant gratuit 1x/combat'],
    special: ['regardPetrifiant'],
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // DLC : Les Étoiles et les Cendres — Races
  // ══════════════════════════════════════════════════════════════════════════════
  {
    id: 'sythrak', name: 'Sythrak', description: "Créatures amphibiennes descendant de Mitulia. Peau serpentine, crocs acérés. Froids et calculateurs, loyaux à leur clan mais avares.", dlc: true,
    statBonuses: { resistance: 1, dexterite: 2 },
    abilities: ['Résistance aux dégâts acides', 'Peut respirer sous l\'eau', 'Crocs perçants : Action bonus (1x/combat) – 1d4 perçants/niveau (max 6), ignore 1 AC'],
  },
  {
    id: 'bugbear', name: 'Bugbear', description: "Imposantes créatures bestiales, cousins des kobalos. Solitaires, silencieux mais d'une violence extrême. Tempérament imprévisible, oscillant entre calme et colère explosive.", dlc: true,
    statBonuses: { force: 2, dexterite: 1, constitution: 1, charisme: -1 },
    abilities: ['Compétence avec armes simples'],
  },
  {
    id: 'ivrak', name: 'Ivrak', description: "Descendants de Sugriok, tous mâles, à la peau translucide bleutée et aux cornes noires. Rares sur Midian, souvent confondus avec des démons. Peuvent vivre éternellement sans mort violente.", dlc: true,
    statBonuses: { vitesse: 1 },
    abilities: ['Résistance au froid', 'Cœur de glace : Réaction (1x/long rest) – ignore 1d6 dégâts'],
  },
  {
    id: 'velshaari', name: 'Velshaari', description: "Créatures draconiques descendant des dragons anciens. Peau écailleuse colorée. Manipulateurs du temps et de l'espace, souvent solitaires et mystérieux. Vivent jusqu'à 500 ans.", dlc: true,
    statBonuses: { intelligence: 1, constitution: 1 },
    abilities: ['AC de base 13 sans armure'],
    subtypes: [
      {
        id: 'velshaari-rouge', name: 'Velshaari rouge',
        statBonuses: {},
        abilities: ['Résistance au feu', 'Souffle de feu : Action (1x/LR) – 3d6 brûlants', 'Morsure : Action bonus (1x/LR) – 1d6 tranchant + 1d6 brûlant'],
      },
      {
        id: 'velshaari-jaune', name: 'Velshaari jaune',
        statBonuses: {},
        abilities: ['Résistance à l\'électricité', 'Souffle de foudre : Action (1x/LR) – 2d6 électriques (sav. CON 12 ou sonné)', 'Morsure : Action bonus (1x/LR) – 1d6 tranchant + 1d6 électrique'],
      },
      {
        id: 'velshaari-bleu', name: 'Velshaari bleu',
        statBonuses: {},
        abilities: ['Résistance au froid', 'Souffle de glace : Action (1x/LR) – 2d6 froids (sav. CON 12 ou engelure -2 AC)', 'Morsure : Action bonus (1x/LR) – 1d6 tranchant + 1d6 froid'],
      },
    ],
  },
  {
    id: 'carnog', name: 'Carnog', description: "Race cannibale pâle et déformée, anciens elfes ayant vécu des millénaires sous terre. Peau translucide, yeux blancs sans pupilles, oreilles longues et pointues. Vision parfaite dans le noir.", dlc: true,
    statBonuses: { intelligence: -1, charisme: -2, vitesse: 2, constitution: 2 },
    abilities: ['Vision parfaite dans le noir', 'Résilience souterraine : récupère 1d4 PV au début de son tour en combat'],
  },
  {
    id: 'tharocZar', name: "Tharoc'zar", description: "Géants de 8 à 11 pieds à la peau grise marbrée de veines lumineuses. Nés de l'acier et de la pierre par la foudre. Mystérieux et solitaires, suivent des shamans ésotériques. Vivent jusqu'à un millénaire.", dlc: true,
    statBonuses: { resistance: 2, force: 1 },
    abilities: [],
  },
  {
    id: 'nyxian', name: 'Nyxian', description: "Race énigmatique des vestiges météoriques. Peau noire absorbante avec constellations scintillantes. Seule culture où la magie du sang est acceptée. Espérance de vie similaire aux humains.", dlc: true,
    statBonuses: { vitesse: 1, dexterite: 1 },
    abilities: ['Vision parfaite dans le noir', 'Fondre dans les ombres : Action bonus (1x/LR) – en zone obscure, sav. DEX 10 pour disparaître'],
  },
  {
    id: 'qharaku', name: 'Qharaku', description: "Êtres élégants ressemblant aux oiseaux tropicaux des Îles d'Émeraude. Plumes colorées, crête vive, queue de paon. L'une des cultures les plus anciennes de Midian. Vivent jusqu'à 300 ans.", dlc: true,
    statBonuses: { dexterite: 2, charisme: 2, constitution: -1, resistance: -1 },
    abilities: ['Vol (avantage contre les cibles au sol)'],
  },
  {
    id: 'pandai', name: 'Pandai', description: "Petits ursidés noirs et blancs (3 pieds). Vénèrent une hydre plumée appelée Cwak. Langue incompréhensible, prénoms absurdes de 11-16 syllabes, utilisent des pseudonymes comiques. Civilization la plus avancée scientifiquement.", dlc: true,
    statBonuses: { force: -1, dexterite: -1, constitution: -1, intelligence: 2, vitesse: 1, charisme: 1 },
    abilities: ['Résistance aux dégâts psychiques', 'Déni : Réaction (1x/LR) – ignore jusqu\'à 1d10 dégâts d\'une attaque qui touche'],
  },
];

// ─── CLASSES ─────────────────────────────────────────────────────────────────
export const CLASSES: ClassData[] = [
  {
    id: 'guerrier', name: 'Guerrier', difficulty: '★', description: "Adepte du combat rapproché. Excel dans le maniement des armes sans magie.",
    competences: 'Toutes armes rapprochées, toutes armures, boucliers',
    resource: 'none', startingResource: 0,
    startingArmor: { name: "Armure d'acier (lourde)", ac: 15, type: 'lourde' },
    startingEquipment: [
      "Attaque supplémentaire : une attaque bonus chaque tour en combat",
      "Second souffle (Action bonus) : récupère 1d10 + niveau PV, une fois par repos court",
      "Légende du combat : augmente ta compétence aux armes",
      "Arme à deux mains OU deux armes à une main OU arme + bouclier (AC+2)",
      "Armure d'acier (lourde, AC 15)",
      "Spécialisation au choix : Barbare (armes fortes), Défenseur (bouclier), Double-maniement (deux armes rapides)"
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
    ],
  },
  {
    id: 'mage', name: 'Mage', difficulty: '★★', description: "Érudit qui étudie le voile pour lancer des sorts en utilisant la mana.",
    competences: 'Sorts, armure légère, armes simples',
    resource: 'mana', startingResource: 4,
    startingArmor: { name: 'Robes de mage', ac: 0, type: 'robes' },
    startingEquipment: ['Lancement de sorts : utilise intelligence pour attaque, constitution pour saves', 'Connaissance arcanique : bonus intelligence aux checks de magie', 'Trois sorts niveau 1 au choix', 'Robes de mage', 'Une arme simple au choix', 'Mana +4'],
    pvPerLevel: [0, 4, 4, 5, 5, 5, 8, 8, 8, 10, 10, 10, 12, 8, 12, 12, 15, 15, 18, 20],
    resourcePerLevel: [4, 6, 6, 8, 8, 8, 8, 8, 10, 12, 12, 12, 12, 12, 12, 14, 14, 14, 14, 16],
    specializations: ['Acolyte', 'Mage guerrier', 'Manavore'],
    specializationDetails: [
      {
        name: 'Acolyte',
        summary: "Érudit studieux. Maximise ta connaissance magique et ton pool de mana.",
        effects: [
          '+3 sorts niveau 1 au choix',
          '+2 sorts niveau 2 au choix',
          'Mana +2 | Intelligence +2',
          'Niveau 14 : encore plus de sorts et Intelligence+1',
        ],
      },
      {
        name: 'Mage guerrier',
        summary: "Alliance magie et combat rapproché. Redoutable au corps-à-corps.",
        effects: [
          'PV +10',
          'Compétence toutes armes rapprochées et toutes armures',
          'Force ou Dextérité +2',
          'Niveau 14 : PV+10, Force/Dex+2, Action surge',
        ],
      },
      {
        name: 'Manavore',
        summary: "Sorts dévastateurs mais gourmands. Sacrifie l'efficacité pour la puissance brute.",
        effects: [
          'Mana +6',
          'Un sort niveau 2 au choix',
          'Tous les sorts coûtent 1 mana de plus, mais font 1d10 de dégâts magiques supplémentaires',
          'Niveau 14 : Mana+6, sort niv.4',
        ],
      },
    ],
    startingSpells: 3, startingSpellLevel: 1,
  },
  {
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
  },
  {
    id: 'rogue', name: 'Rogue', difficulty: '★★', description: "Expert en discrétion et tricherie. Utilise ses talents pour tourner les situations à son avantage.",
    competences: 'Armes de dextérité, armes de jet, armures légères et moyennes',
    resource: 'none', startingResource: 0,
    startingArmor: { name: 'Veste de cuir (légère, AC+1)', ac: 1, type: 'legere' },
    startingEquipment: ["Deux armes de dextérité au choix", "5 couteaux de lancer (1d4 tranchant)", "Veste de cuir (légère, AC+1)", "Vitesse +2 (classe)"],
    pvPerLevel: [0, 5, 5, 6, 6, 6, 8, 8, 10, 10, 12, 10, 12, 12, 14, 14, 16, 16, 18, 20],
    resourcePerLevel: Array(20).fill(0),
    specializations: ['Assassin', 'Voleur arcaniste', "Tireur d'élite", 'Duelliste'],
    specializationDetails: [
      {
        name: 'Assassin',
        summary: "Tuer vite et sans bruit. Spécialiste des dagues et des coups critiques.",
        effects: [
          'Saving throw pour se cacher abaissé à 10 (puis 8 au niv.10)',
          'Coup critique = +1d10 perçant (avant doublement)',
          'Coup critique sur 18+ avec les dagues | Expertise dagues',
          'Niveau 14 : Maîtrise dagues, crit sur 16+',
        ],
      },
      {
        name: 'Voleur arcaniste',
        summary: "Subtilise des artefacts magiques pour canaliser leur pouvoir. Mage et rogue à la fois.",
        effects: [
          'Intelligence +2 | Mana +2',
          '2 sorts niveau 1 au choix | Compétence sorts',
          'Couteaux de lancer : +1d4 dégâts magiques',
          'Niveau 10 : Mana+2, sort niv.2',
        ],
      },
      {
        name: "Tireur d'élite",
        summary: "L'arc comme extension de soi. Précision et cadence de tir implacables.",
        effects: [
          'Expertise arcs | Coup critique sur 18+ avec les arcs',
          'Après un coup critique : réattaque en action bonus',
          'Arcs font +1d4 dégâts perçants',
          'Niveau 10 : arcs font +1d8 | Niveau 14 : Maîtrise arcs',
        ],
      },
      {
        name: 'Duelliste',
        summary: "Un seul sabre, une seule cible, un seul résultat. Duel à la rapière.",
        effects: [
          'Expertise sabres et rapières',
          'Si seul sabre/rapière sans bouclier : +1d6 dégâts (tranchant ou perçant)',
          'Armures légères donnent AC +3',
          'Niveau 10 : +2d6 dégâts | Niveau 14 : riposte quand attaque mêlée rate',
        ],
      },
    ],
  },
  {
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
  },
  {
    id: 'barde', name: 'Barde', difficulty: '★★', description: "Musicien utilisant sa musique pour inspirer, soigner et attaquer. Légèrement connecté au voile.",
    competences: 'Sorts, instruments musicaux, rapières, mélodies',
    resource: 'melodieux', startingResource: 3,
    startingArmor: { name: 'Armure de cuir (légère, AC+1)', ac: 1, type: 'legere' },
    startingEquipment: ["Un sort niveau 1 au choix", "Mana +2", "Instrument de musique au choix", "Armure de cuir (légère, AC+1)", "Rapière", "Points mélodieux +3"],
    pvPerLevel: [0, 6, 6, 6, 8, 8, 8, 8, 10, 10, 12, 12, 15, 15, 12, 16, 16, 16, 18, 20],
    resourcePerLevel: [3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    specializations: ['Musique magique', 'Virtuose', 'Barde combattant', 'Musique de Kadath'],
    specializationDetails: [
      {
        name: 'Musique magique',
        summary: "Alliance de la magie et de l'art. Approfondit ta connexion au voile.",
        effects: [
          'Mana +2 | Sort niveau 2 au choix',
          'Niveau 14 : Mana+2, Expertise sorts',
          'Niveau 18 : Mana+3, sort niveau 4',
        ],
      },
      {
        name: 'Virtuose',
        summary: "L'instrument est une extension de toi. Tes mélodies font des ravages.",
        effects: [
          'Points mélodieux +1',
          'Chaque mélodie roule un dé de dégâts supplémentaire',
          'Niveau 14 : +2 dés supplémentaires | Niveau 16 : +1 point mélodieux',
        ],
      },
      {
        name: 'Barde combattant',
        summary: "La musique en fond sonore de tes exploits à la rapière.",
        effects: [
          'Expertise rapières | PV +4 | Dextérité +2',
          'Niveau 14 : PV+8, Dextérité+2',
          'Niveau 18 : attaque à la rapière en action bonus une fois/tour',
        ],
      },
      {
        name: 'Musique de Kadath',
        summary: "La terreur cosmique accompagne ta musique. Les notes de Kadath brisent les esprits.",
        effects: [
          'Un miracle de Kadath niveau 2 (1 point mélodieux)',
          'Foi +2',
          'Niveau 14 : miracle Kadath niveau 3 (2 points mélodieux), Foi+2',
          'Niveau 18 : Miracle suprême de Kadath (5 points mélodieux), Foi+2',
        ],
      },
    ],
    startingSpells: 1, startingSpellLevel: 1,
  },
  {
    id: 'sorcier', name: 'Sorcier', difficulty: '★★★', description: "Forge un pacte avec un dieu sombre (Talkus, Sugriok ou Laeth). Utilise ses PV pour lancer sorts et miracles.",
    competences: 'Sorts, miracles, armures légères',
    resource: 'pv', startingResource: 0,
    startingArmor: { name: 'Robes de sorcier', ac: 0, type: 'robes' },
    startingEquipment: ["Deux sorts niveau 1 au choix", "Un miracle niveau 1 du dieu choisi", "Robes de sorcier", "Grimoire", "Sorts et miracles coûtent 2x niveau en PV"],
    pvPerLevel: [0, 5, 5, 6, 8, 8, 8, 10, 10, 12, 12, 14, 14, 16, 18, 18, 20, 20, 20, 22],
    resourcePerLevel: Array(20).fill(0),
    specializations: ['Dévot', 'Profiteur', 'Abomination'],
    specializationDetails: [
      {
        name: 'Dévot',
        summary: "Foi sincère en ton dieu sombre. Tu invoques ses miracles avec maestria.",
        effects: [
          'Foi +2 | Un miracle niveau 2 du dieu choisi',
          'Niveau 14 : Expertise miracles',
          'Niveau 18 : Maîtrise miracles, Foi+1',
        ],
      },
      {
        name: 'Profiteur',
        summary: "Le pouvoir t'intéresse, pas les dieux. Tu maximises ta maîtrise des sorts.",
        effects: [
          'Intelligence +2 | Un sort niveau 2 au choix',
          'Niveau 14 : Expertise sorts',
          'Niveau 18 : Maîtrise sorts, Intelligence+1',
        ],
      },
      {
        name: 'Abomination',
        summary: "Le dieu sombre te transforme physiquement. Pure puissance de miracles, mais plus de sorts.",
        effects: [
          'Deux miracles niveau 1 + un miracle niveau 2 du dieu choisi',
          'Foi +4 | Ne peut plus utiliser de sorts',
          'Niveau 14 : Résistance+1, Vitesse+1, PV+4',
          'Niveau 18 : Expertise miracles, PV+8',
        ],
      },
    ],
    deityRequired: true, deityType: 'dark',
    startingSpells: 2, startingSpellLevel: 1,
    startingMiracles: 1,
  },
  {
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
  },
  {
    id: 'chasseur', name: 'Chasseur', difficulty: '★★', description: "Expert du terrain naturel. Tracker et archer hors pair.",
    competences: "Armes de dextérité, armures légères et moyennes, expertise avec les arcs",
    resource: 'none', startingResource: 0,
    startingArmor: { name: 'Veste de cuir (légère, AC+1)', ac: 1, type: 'legere' },
    startingEquipment: ["Veste de cuir (légère, AC+1)", "Épée courte (dextérité, 1d6 tranchant)", "Arc (dextérité, 1d8 perçant)"],
    pvPerLevel: [0, 6, 6, 8, 8, 8, 10, 10, 12, 12, 12, 12, 14, 12, 14, 16, 16, 18, 20, 20],
    resourcePerLevel: Array(20).fill(0),
    specializations: ['Rôdeur', 'Prédateur', 'Compagnon animal'],
    specializationDetails: [
      {
        name: 'Rôdeur',
        summary: "Ombre dans la forêt. Tu frappes caché et tu disparais avant qu'ils réagissent.",
        effects: [
          'Action bonus supplémentaire par tour',
          'Discrétion (action bonus) : saving throw dextérité (12) pour te cacher, crit sur 18- quand caché',
          'Niveau 14 : saving throw abaissé à 10, +1d4 dégâts avec avantage',
        ],
      },
      {
        name: 'Prédateur',
        summary: "Une proie à la fois. Concentre toute ta puissance sur une seule cible.",
        effects: [
          'Au début du combat : désigne une proie',
          'Contre la proie : attack roll +2, dégâts +1d4',
          'Niveau 14 : +4 attack roll, +1d8 dégâts | Niveau 19 : +6 attack roll, +1d10',
        ],
      },
      {
        name: 'Compagnon animal',
        summary: "Un allié de la nature à tes côtés. Choisis un animal fidèle.",
        effects: [
          'Molosse : PV 26, Force 14, Morsure 1d8 perçant',
          'Sanglier : PV 32, Force 14, Ruée (1d8 contondant + sonné)',
          'Aigle : PV 14, Dextérité 20, Vol, Serres 1d8 tranchant + saignement',
          'Niveau 14 : 2e compagnon + double attaque',
        ],
      },
    ],
  },
  {
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
  },
  {
    id: 'vampire', name: 'Vampire', difficulty: '★★★', description: "Classe unique. Ne peut pas faire de multi-classe. Possède des pouvoirs vampiriques.",
    competences: 'Armes de dextérité, armures légères et moyennes',
    resource: 'vampirique', startingResource: 3,
    startingArmor: { name: 'Armure de cuir (légère, AC+1)', ac: 1, type: 'legere' },
    startingEquipment: ["Armure de cuir (légère, AC+1)", "Arme de dextérité au choix", "Charges vampiriques : 3", "Survie vampirique (1x)", "Vision nocturne"],
    pvPerLevel: [0, 6, 6, 8, 8, 8, 10, 10, 12, 12, 12, 14, 14, 14, 16, 18, 18, 20, 20, 22],
    resourcePerLevel: [3, 3, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 12],
    specializations: [],
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // DLC : Les Étoiles et les Cendres — Classes
  // ══════════════════════════════════════════════════════════════════════════════
  {
    id: 'astromancien', name: 'Astromancien', difficulty: '★★', dlc: true,
    description: "Maître des étoiles et des phénomènes cosmiques. Puise dans l'énergie des astres pour manipuler la réalité et le temps. Ses sorts s'appellent sorts cosmiques et utilisent l'intelligence.",
    competences: 'Sorts cosmiques (intelligence), armes simples, armures légères',
    resource: 'none', startingResource: 0,
    startingArmor: { name: 'Armure de cuir (légère, AC+1)', ac: 1, type: 'legere' },
    startingEquipment: ["Armure de cuir (légère, AC+1)", "Sceptre météorique (+1 attack roll sorts cosmiques)", "Dague (1d4 perçant)", "Télékinésie à volonté", "Orbe céleste : 2d8 dégâts de force (5x/long rest)"],
    pvPerLevel: [0, 5, 5, 5, 5, 6, 6, 8, 8, 8, 10, 10, 10, 12, 12, 12, 14, 14, 16, 18],
    resourcePerLevel: Array(20).fill(0),
    specializations: ['Stellamancie', 'Chronomancie', 'Astrophage', 'Cometari', 'Météoricien'],
    specializationDetails: [
      {
        name: 'Stellamancie',
        summary: "Maître de l'astrologie et des cartes du ciel. Tire un grand pouvoir des alignements célestes.",
        effects: [
          'Constellation maudite : Action bonus (1x/LR) – cible vulnérable à tous dégâts jusqu\'à fin de ton tour',
          'Constellation régénératrice : Action bonus (1x/LR) – soigne 3d6 PV à un personnage',
          'Niveau 8 : Constellation de puissance (+4 attack roll, +1d8 dégâts au prochain sort)',
          'Niveau 14 : Alignement cosmique – téléportation réaction (sav. DEX 10)',
          'Niveau 18 : Constellation protectrice – réduit dégâts de Xd6 (X = bonus INT)',
        ],
      },
      {
        name: 'Chronomancie',
        summary: "Manipulateur du temps. Ralentit, accélère ou altère le cours des événements.",
        effects: [
          'Voile temporel : Actions et actions bonus interchangeables pendant 1 tour (1x/LR)',
          'Niveau 8 : Vitesse +2 (manipulation constante du temps)',
          'Niveau 14 : Inversion temporelle – annule ta dernière action (1x/LR)',
          'Niveau 18 : Paralysie temporelle – cible paralysée 1 tour (sav. VIT 15)',
        ],
      },
      {
        name: 'Astrophage',
        summary: "Puise dans les étoiles mourantes. Magie dévastatrice et régénératrice liée à la fin de l'univers.",
        effects: [
          'Rayon dévorant : Action bonus (3x/LR) – 2d4 dégâts magiques, récupère PV = dégâts',
          'Niveau 8 : Récupère 1d4 PV chaque fois que tu utilises un sort cosmique',
          'Niveau 14 : Noyau d\'étoile – Action bonus, récupère 4d6 PV',
          'Niveau 18 : Trou noir – 8d10 dégâts de force (sav. RES 15), les vaincus sont aspirés',
        ],
      },
      {
        name: 'Cometari',
        summary: "Maître de la magie gravitationnelle. Influence des comètes et météorites.",
        effects: [
          'Chute astrale : Action (1x/LR) – jusqu\'à 3 cibles, 1d6 tranchant + 1d8 feu',
          'Niveau 8 : Puits gravitationnel – Action bonus, ennemis jeté au sol (sav. RES 12)',
          'Niveau 14 : Pluie d\'étoiles – tous ennemis, 4d8 brûlants (sav. RES 15) ou 2d6',
          'Niveau 18 : Tempête gravitationnelle – 3 tours, 2d8 force + 2d8 brûlants chaque tour',
        ],
      },
      {
        name: 'Météoricien',
        summary: "Utilise la roche météorique pour augmenter la puissance de ses armes rapprochées.",
        effects: [
          'Compétence avec toutes les armes rapprochées',
          'Arme météorique : Action bonus – +1d10 dégâts de force jusqu\'à fin de combat',
          'Niveau 8 : Armure météorique – Action bonus (1x/LR) – AC 19 pour 3 tours',
          'Niveau 14 : +1d10 brûlants en plus | Niveau 18 : Maîtrise armes rapprochées, +1d10 tranchants en plus',
        ],
      },
    ],
  },
  {
    id: 'fourbesang', name: 'Fourbesang', difficulty: '★★★★', dlc: true,
    description: "Maître de la corruption vitale. Manipule son propre corps et celui de ses ennemis. Ses pouvoirs s'appellent des corruptions et coûtent des PV. Craint de tous.",
    competences: 'Toutes armes rapprochées, corruptions',
    resource: 'pv', startingResource: 0,
    startingArmor: { name: 'Vêtements déchirés', ac: 0, type: 'none' },
    startingEquipment: ["Vêtements déchirés", "Une arme rapprochée au choix", "Profanation : coût 4 PV, +2 attack roll, +1d4 nécrotiques", "Mutation génétique disponible au niveau 5"],
    pvPerLevel: [0, 8, 8, 8, 10, 10, 12, 12, 12, 14, 14, 15, 15, 15, 15, 18, 18, 20, 22, 24],
    resourcePerLevel: Array(20).fill(0),
    specializations: ['Écorcheur', 'Sanguinier', 'Tisseur d\'os'],
    specializationDetails: [
      {
        name: 'Écorcheur',
        summary: "Maître de la chair. Inflige des mutilations brutales qui rendent les ennemis vulnérables.",
        effects: [
          'Déformation : Action bonus (1x/LR, coût 5 PV) – cible -2 AC, -2 attack/saving throws 1 tour (sav. CON 18)',
          'Carnophagie : récupère 2 PV chaque fois que tu touches un ennemi',
          'Niveau 14 : Dextérité +1. Peste de Chair : 2d6 nécrotiques + douleur chronique (sav. CON 16)',
        ],
      },
      {
        name: 'Sanguinier',
        summary: "Manipule le sang pour guérir et affaiblir. La vie dans ses veines est une arme.",
        effects: [
          'Drain de sang : Action bonus (1x/LR) – 1d8 tranchants, récupère PV = dégâts',
          'Armure coagulée : Réaction (coût 2 PV) – +2 AC contre une attaque',
          'Niveau 14 : PV +4. Rituel sanguinolant – sacrifie jusqu\'à 10 PV → allié récupère 1d4 PV/PV sacrifié',
        ],
      },
      {
        name: 'Tisseur d\'os',
        summary: "Déforme les structures corporelles. Renforce ses os et crée des armes de son propre squelette.",
        effects: [
          'Carapace osseuse : AC base 13 sans armure, résistance contondant et force',
          'Pique d\'ivoire : Action bonus (coût 4 PV) – 2d6 dégâts perçants',
          'Niveau 14 : Résistance +1. Enveloppe macabre – résistance au type de dégât choisi (réaction)',
        ],
      },
    ],
  },
  {
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
  },
  {
    id: 'venox', name: 'Venox', difficulty: '★★★', dlc: true,
    description: "Maître des poisons et toxines. Immunisé au poison. Produit ses toxines depuis son propre corps. Utilise dextérité pour ses toxines. Trois types de poisons : mortels, incapacitants, déstabilisants.",
    competences: 'Armure légère, dagues, toxines (dextérité)',
    resource: 'none', startingResource: 0,
    startingArmor: { name: 'Veste de cuir (légère, AC+1)', ac: 1, type: 'legere' },
    startingEquipment: ["Veste de cuir (légère, AC+1)", "Deux dagues recourbées (1d4 + DEX perçant)", "1 poison mortel (La mort pourpre : 3 charges, 1d10 nécrotiques)", "1 poison incapacitant (Foudre cinglante : 2 charges, paralysie sav. CON 12)", "Crachat de cobra : Action bonus (1x/LR), 2d8 acides"],
    pvPerLevel: [0, 5, 5, 6, 6, 6, 8, 8, 10, 10, 10, 12, 12, 12, 14, 14, 16, 16, 18, 20],
    resourcePerLevel: Array(20).fill(0),
    specializations: ['Basilisk', 'Venimeux', 'Miasma', 'Sulfureux'],
    specializationDetails: [
      {
        name: 'Basilisk',
        summary: "Dagues comme crocs de vipère. Finesse et précision dévastatrice.",
        effects: [
          'Sang froid : Réaction (1x/combat) – contre-attaque avec dague avant l\'attaque ennemie',
          'Dagues font 2 dégâts perçants de plus',
          'Niveau 14 : Dagues font 5 dégâts perçants de plus',
        ],
      },
      {
        name: 'Venimeux',
        summary: "Tes sécrétions empoisonnées sont particulièrement dévastatrices.",
        effects: [
          'Crachat de cobra 2x/LR (sav. 14 au lieu de 10)',
          'Sueur acide : Action bonus (1x/LR) – jusqu\'à fin de combat, 2 dégâts acides aux attaquants mêlée',
          'Niveau 14 : Sueur acide toujours active',
        ],
      },
      {
        name: 'Miasma',
        summary: "Crée des nuages pestilents depuis tes poisons pour toucher plusieurs ennemis.",
        effects: [
          'Nuage empoissonné : dépense 1 utilisation de poison, jusqu\'à 3 cibles (1x/LR)',
          'Niveau 14 : Nuage empoissonné en action bonus',
        ],
      },
      {
        name: 'Sulfureux',
        summary: "Crée plus de doses à partir des mêmes ressources. Poisons plus efficaces.",
        effects: [
          '+1 charge d\'un poison au choix chaque jour',
          'Saving throws de tes poisons +2 de difficulté',
          'Niveau 14 : +4 de difficulté total',
        ],
      },
    ],
  },
  {
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
  },
  {
    id: 'fleau', name: 'Fléau', difficulty: '★★★★★', dlc: true,
    description: "Instrument de Sugriok. Utilise la malice (0-30) comme ressource et stat. Le bonus d'attack roll/dégâts de ses malédictions = (malice-10)/2 arrondi. Gagne de la malice en tuant et en commettant des actes mauvais.",
    competences: 'Épées, armures légères et moyennes, malédictions',
    resource: 'none', startingResource: 0,
    startingArmor: { name: 'Cotte de mailles (moyenne, AC+3)', ac: 3, type: 'moyenne' },
    startingEquipment: ["Cotte de mailles (moyenne, AC+3)", "Épée longue (1d8 tranchant)", "Malédiction simple (coût 1-3 malice, 2d8/1d8 psy, sav. FOI 14/18)", "La marque des enfers : récupère 5 malice au réveil", "Gagne malice en tuant créatures et serviteurs de Moiifhb"],
    pvPerLevel: [0, 6, 0, 8, 8, 10, 10, 8, 10, 12, 12, 14, 14, 12, 14, 16, 18, 18, 20, 22],
    resourcePerLevel: Array(20).fill(0),
    specializations: ['Légionnaire infernal', 'Vicier de l\'excès', 'Maléficier des lamentations', 'Syphon'],
    specializationDetails: [
      {
        name: 'Légionnaire infernal',
        summary: "Disciple de Vindessia. Soif de violence infernale. Maître des flammes.",
        effects: [
          'Force +2 | PV +4 | Lame de Vindessia 3x/LR (+bonus malice, +1d6 brûlants)',
          'Flammes infernales : ennemis ne récupèrent pas de PV si dégâts brûlants',
          'Niveau 14 : Force +2, PV +8, Lame 5x/LR',
          'Niveau 19 : Lame de Vindessia toujours active',
        ],
      },
      {
        name: 'Vicier de l\'excès',
        summary: "Tortionnaire au palais des plaisirs d'Axel. La souffrance des autres te nourrit.",
        effects: [
          'Charisme +2',
          'Débauche d\'extase : Action bonus (1 malice) – cible marque +1d6 psychiques/dégât, tu récupères PV = ce 1d6',
          'Niveau 14 : Charisme +2 | Récupère 2 PV quand ennemi échoue saving throw',
          'Niveau 19 : Récupère 4 PV + 1 malice quand ennemi échoue',
        ],
      },
      {
        name: 'Maléficier des lamentations',
        summary: "Au côté de Sugriok lui-même. Larmes glaciales et malédictions de peine.",
        effects: [
          'Résistance au froid | Larmes de Sugriok : 3 malice, 3d8 froids + vulnérabilité (sav. FOI 12)',
          'Niveau 14 : Immunité au froid. Résistance +1, Constitution +1',
          'Niveau 19 : Résistance aux nécrotiques. Constitution +1',
        ],
      },
      {
        name: 'Syphon',
        summary: "Âme vouée au néant primordial. Tes malédictions sont irrésistibles.",
        effects: [
          'Saving throws de malédictions +2 de difficulté | Collecte éthérée : +1 malice/mort (max 10/LR)',
          'Niveau 14 : +4 difficulté | Collecte 2 malice/mort (max 14/LR)',
          'Niveau 19 : Plus de limite par long rest à la collecte',
        ],
      },
    ],
    deityRequired: true, deityType: 'dark',
  },
  {
    id: 'inquisiteur', name: 'Inquisiteur', difficulty: '★', dlc: true,
    description: "Guerrier sacré de Moiifhb. Chasse les ennemis de la lumière. Utilise la divinité et la foi pour ses miracles. Possède des promesses (serments) qui lui donnent des pouvoirs spéciaux.",
    competences: 'Armures moyennes et lourdes, épées, haches, masses et marteaux, boucliers, miracles de Moiifhb',
    resource: 'divinite', startingResource: 0,
    startingArmor: { name: "Armure de l'inquisition (moyenne, AC+3)", ac: 3, type: 'moyenne' },
    startingEquipment: ["Armure de l'inquisition (moyenne, AC+3)", "Épée large OU hache de guerre OU masse (1d8) + bouclier OU grande arme (1d12)", "Feat Paladin : Foi +1, accès à Coup Divin", "Coup Divin : Action bonus (1x/LR) – prochain coup +2 attack, +1d8 divins/niveau"],
    pvPerLevel: [0, 6, 8, 8, 10, 10, 12, 10, 10, 12, 10, 10, 14, 15, 15, 16, 18, 18, 20, 22],
    resourcePerLevel: [0, 3, 3, 6, 7, 8, 8, 10, 12, 12, 12, 14, 14, 14, 15, 15, 16, 16, 16, 16],
    specializations: ['Promesse : Amour', 'Promesse : Piété', 'Promesse : Justice'],
    specializationDetails: [
      {
        name: 'Promesse : Amour',
        summary: "Jure d'aimer inconditionnellement ceux qui rendent hommage à Moiifhb.",
        effects: ['PV +8', 'Toujours actif'],
      },
      {
        name: 'Promesse : Piété',
        summary: "Jure de toujours penser à Moiifhb en premier.",
        effects: ['Foi +1', 'Toujours actif'],
      },
      {
        name: 'Promesse : Justice',
        summary: "Jure d'amener les ennemis de Moiifhb à leur jugement.",
        effects: ['Avantage contre créatures des dieux sombres, monstres, vampires et abominations', 'Toujours actif'],
      },
    ],
    deityRequired: true, deityType: 'any',
  },
  {
    id: 'valkyrie', name: 'Valkyrie', difficulty: '★★', dlc: true,
    description: "Guerrière sacrée d'Erkanos. Maîtrise des lances, hallebardes et haches. Personnage obligatoirement féminin. Vénère Erkanos. Accumulez des points de supériorité (max 3 → 5 → 7) pour des effets puissants.",
    competences: 'Armures légères et moyennes, boucliers, lances, hallebardes et haches',
    resource: 'none', startingResource: 0,
    startingArmor: { name: 'Cotte de mailles (moyenne, AC+2, résistance tranchants)', ac: 2, type: 'moyenne' },
    startingEquipment: ["Cotte de mailles (moyenne, AC+2, résistance tranchants)", "Casque ailé (initiative +1)", "Lance (1d8) + bouclier (AC+2) OU hache barbue (1d10) + buckler (AC+1) OU hallebarde (2 mains, 1d12)", "Ailes divines : 1x/LR – vol 1 tour | Rage d'Erkanos : 1x/LR – 2d10 force + projection (sav. DEX 14)"],
    pvPerLevel: [0, 6, 8, 8, 10, 12, 12, 10, 12, 10, 10, 10, 12, 12, 15, 15, 18, 18, 20, 22],
    resourcePerLevel: Array(20).fill(0),
    specializations: ['Céleste', 'Gardienne', 'Triomphante'],
    specializationDetails: [
      {
        name: 'Céleste',
        summary: "Rapidité du vent et fureur du ciel. Attaques chargées de foudre divine.",
        effects: [
          'Ailes divines 3x/LR | Vitesse +1',
          'Coup de foudre : Action bonus (1x/LR) – 1d8 électriques + sonné (sav. RES 10)',
          'Niveau 8 : 2d8 électriques (sav. 14)',
          'Niveau 14 : 3d8 électriques | Tempête argentée – éclair argenté en volant (1d10 électrique + 1d10 divin)',
        ],
      },
      {
        name: 'Gardienne',
        summary: "Guide des âmes. Puise dans les défunts pour soigner ses alliés.",
        effects: [
          'Résistance +1 | Réconfort (2x/LR) : soigne 1d6 + modificateur force/dextérité',
          'Protection des âmes : Réaction, +2 saving throw pour soi ou allié',
          'Niveau 8 : Réconfort 2d6, +3 saving throw',
          'Niveau 14 : Réconfort 3d6, +4 saving throw | Aura de soins (3 tours, alliés récupèrent 2d4 PV/tour)',
        ],
      },
      {
        name: 'Triomphante',
        summary: "Guerrière implacable. Force et technique au corps-à-corps.",
        effects: [
          'Force ou Dextérité +2 | Bénédiction militaire : +1d4 divins sur attaques',
          'Niveau 8 : +1d6 divins',
          'Niveau 14 : +1d8 divins | Coup de maître (1x/LR) – prochain coup est un critique',
        ],
      },
    ],
    deityRequired: true, deityType: 'any',
  },
  {
    id: 'scorpion', name: 'Scorpion', difficulty: '★★', dlc: true,
    description: "Combattant agile maîtrisant l'aiguillon (lame à corde, portée 3m). Utilise aussi des aiguilles (max 10, régénérées par rests). Frappe des points vitaux avec une précision létale.",
    competences: 'Aiguillons, aiguilles, armes simples, armures légères et moyennes',
    resource: 'none', startingResource: 0,
    startingArmor: { name: 'Veste de cuir bouilli (légère, AC+2)', ac: 2, type: 'legere' },
    startingEquipment: ["Veste de cuir bouilli (légère, AC+2)", "Aiguillon (portée 3m, 1d8 perçant)", "10 aiguilles (1d4 perçants)", "Sac de retailles (+2 aiguilles/short rest, +5/long rest)", "Tourbillon de lames : Action bonus – lance jusqu'à 5 aiguilles sur cibles différentes"],
    pvPerLevel: [0, 5, 5, 5, 5, 6, 8, 8, 10, 8, 10, 12, 12, 12, 14, 15, 15, 16, 18, 18],
    resourcePerLevel: Array(20).fill(0),
    specializations: ['Perceur d\'organes', 'Constrictor', 'Acupuncteur'],
    specializationDetails: [
      {
        name: 'Perceur d\'organes',
        summary: "Frappe les points vitaux. Coups critiques fréquents avec l'aiguillon.",
        effects: [
          'Aiguillon crit sur 18+ | Dextérité +2 | Coup au foie 2x/LR',
          'Niveau 14 : Dextérité +1 | Aiguillon crit sur 17 et moins',
        ],
      },
      {
        name: 'Constrictor',
        summary: "Utilise la corde de ton aiguillon pour piéger et étrangler tes ennemis.",
        effects: [
          'Force +2 | Cordage : Action bonus, ennemi jeté au sol (sav. DEX 14)',
          'Étranglement : 1d10 force + check de force continu',
          'Niveau 14 : Force +2 | 2d10 force, sav. DEX 16',
        ],
      },
      {
        name: 'Acupuncteur',
        summary: "Maîtrise de l'anatomie pour soulager ou accentuer la douleur avec précision.",
        effects: [
          '+1 aiguille/short rest, +2/long rest | Soulagement musculaire : soigne 1d4 + DEX',
          'Accentuation douloureuse : 1d4/tranche de 4 PV perdus',
          'Niveau 14 : 1d6 au lieu de 1d4 pour les deux capacités',
        ],
      },
    ],
  },
  {
    id: 'maraudeur', name: 'Maraudeur', difficulty: '★', dlc: true,
    description: "Guerrier des terres froides de Gloisil. Ses tatouages runiques sacrés canalisent une magie ancestrale. Plus respecté, plus de runes. Les runes utilisent la constitution.",
    competences: 'Haches, épées, boucliers, armures légères et moyennes, runes',
    resource: 'none', startingResource: 0,
    startingArmor: { name: 'Armure de maraudeur (moyenne, AC+3)', ac: 3, type: 'moyenne' },
    startingEquipment: ["Armure de maraudeur (moyenne, AC+3)", "Bottes de marin (+2 sav. DEX/CON)", "Épée de maraudeur (1d8) + bouclier renforcé (AC+2) OU hache danoise (1d12, deux mains)", "Rune du tonnerre : Action bonus (1x/LR) – 1d6 électriques", "Rune de la rage : (1x/LR) – prochain coup +3 attack, +1d10 force (coût 1d6 PV)", "Rune de la mère : Action bonus (1x/LR) – récupère 2d4 PV"],
    pvPerLevel: [0, 10, 8, 8, 10, 12, 14, 12, 12, 12, 10, 12, 14, 15, 15, 18, 18, 20, 22, 24],
    resourcePerLevel: Array(20).fill(0),
    specializations: ['Rune de l\'ours', 'Rune du loup', 'Rune de l\'aigle', 'Rune du caribou'],
    specializationDetails: [
      {
        name: 'Rune de l\'ours',
        summary: "Force et résilience colossales. Rage ursine redoutable.",
        effects: [
          'Force +2 | Résistance +1 | Rage ursine (1x/LR) : résistance physique + 2x bonus force',
          'Niveau 14 : Force +2, Résistance +1',
        ],
      },
      {
        name: 'Rune du loup',
        summary: "Intelligence et tactiques de meute. Guide tes alliés au combat.",
        effects: [
          'Intelligence +3 | Tactiques de meute (1x/LR) : bonus INT aux attack rolls + crit réduit de 1',
          'Niveau 14 : Intelligence +2',
        ],
      },
      {
        name: 'Rune de l\'aigle',
        summary: "Vitesse et dextérité surhumaines. Serres aveuglantes précises.",
        effects: [
          'Vitesse +2 | Dextérité +2 | Serre aveuglante : Action bonus – 1d4 tranchants + désavantage (sav. CON 12)',
          'Niveau 14 : Dextérité +2, Vitesse +2, 2d4 tranchants (sav. 14)',
        ],
      },
      {
        name: 'Rune du caribou',
        summary: "Constitution et force de charge brute.",
        effects: [
          'Constitution +2 | Force +1 | Ruée écrasante : 2d10 force + projection (sav. RES 14)',
          'Niveau 14 : Constitution +1, Force +1, Ruée 4d10/2d10 (sav. 16)',
        ],
      },
    ],
  },
  {
    id: 'artificier', name: 'Artificier', difficulty: '★★★', dlc: true,
    description: "Expert des objets magiques et armes arcano-mécaniques. Lance des fioles explosives comme grenades. Peut s'octroyer des augmentations biomécaniques. Utilise l'intelligence pour ses attaques.",
    competences: 'Armes arcano-mécaniques, armures légères (puis moyennes et lourdes)',
    resource: 'none', startingResource: 0,
    startingArmor: { name: 'Robes d\'artificier rembourrées de cuir (légère, AC+1)', ac: 1, type: 'legere' },
    startingEquipment: ["Robes d'artificier (légère, AC+1)", "Arme arcano-mécanique au choix (arbalètes auto, marteau explosif, rapière rétractable, fléau électrifié, gants à pistons, carabine arcanique)", "Fiole infernale : Action bonus (2 charges) – 1d8 brûlants", "Batterie vivante au niveau 5 : accumule de l'énergie pour des effets variés"],
    pvPerLevel: [0, 4, 4, 4, 5, 5, 6, 6, 6, 8, 8, 8, 10, 12, 10, 12, 15, 15, 16, 16],
    resourcePerLevel: Array(20).fill(0),
    specializations: ['Implant cervical', 'Bras mécanisé', 'Plaque d\'acier au cœur'],
    specializationDetails: [
      {
        name: 'Implant cervical',
        summary: "Améliore l'intelligence et les capacités cognitives par voie mécanique.",
        effects: ['Intelligence +1', 'Augmentation biomécanique (niveau 6)'],
      },
      {
        name: 'Bras mécanisé',
        summary: "Un bras mécanique sur l'épaule offre une action bonus supplémentaire.",
        effects: ['Une action bonus supplémentaire par tour', 'Augmentation biomécanique (niveau 6)'],
      },
      {
        name: 'Plaque d\'acier au cœur',
        summary: "Plaque d'acier protège le cœur, augmentant l'AC.",
        effects: ['AC +2', 'Augmentation biomécanique (niveau 6)'],
      },
    ],
  },
  {
    id: 'ravageur', name: 'Ravageur', difficulty: '★', dlc: true,
    description: "Machine de guerre nourrie par la rage. Accumule de la fureur en subissant des dégâts. Utilise des dés de violence (1d4 → 1d6 → 1d8 → 1d10 → 1d12). Pas d'armure : ajoute CON à l'AC.",
    competences: 'Toutes armes rapprochées',
    resource: 'none', startingResource: 0,
    startingArmor: { name: 'Vêtements de fourrure (sans armure)', ac: 0, type: 'none' },
    startingEquipment: ["Vêtements de fourrure", "Une arme rapprochée au choix", "Accumulation de fureur : 1 point/tranche de 2 PV perdus", "Exaltation : coût 3 fureur – +2 attack, +1d4 dégâts, immunité peur", "Endurance : sans armure, ajoute CON à l'AC"],
    pvPerLevel: [0, 8, 8, 10, 10, 10, 12, 12, 12, 14, 14, 14, 15, 15, 16, 16, 18, 20, 22, 24],
    resourcePerLevel: Array(20).fill(0),
    specializations: ['Colérique', 'Massacreur', 'Indestructible'],
    specializationDetails: [
      {
        name: 'Colérique',
        summary: "La rage t'envahit naturellement. Génères de la fureur chaque tour.",
        effects: [
          '+1 fureur au début de ton tour',
          'Niveau 14 : +2 fureur au début de ton tour',
        ],
      },
      {
        name: 'Massacreur',
        summary: "Tu adores voir la vie quitter les yeux de tes ennemis.",
        effects: [
          '+1 dé de violence',
          'Niveau 14 : +1 dé de violence supplémentaire',
        ],
      },
      {
        name: 'Indestructible',
        summary: "Rien ne te fait peur, rien ne t'arrête.",
        effects: [
          'PV +8 | Constitution +2',
          'Niveau 14 : Constitution +1, PV +6',
        ],
      },
    ],
  },
  {
    id: 'bastion', name: 'Bastion', difficulty: '★', dlc: true,
    description: "Rempart vivant sur le champ de bataille. Attire les attaques ennemies grâce à sa présence imposante et riposte aux coups reçus. Maîtrise de la provocation et du contrôle du terrain.",
    competences: 'Épées, masses et haches, attaques non armées, boucliers, toutes armures',
    resource: 'none', startingResource: 0,
    startingArmor: { name: 'Plaque d\'acier complète (lourde, AC+5)', ac: 20, type: 'lourde' },
    startingEquipment: ["Plaque d'acier complète (lourde, AC+5)", "Cotte de mailles (dégâts tranchants -2)", "Bouclier tour (AC+3)", "Grand heaume (+2 sav. RES/CON)", "Gants d'acier (+1 sav. FOR)", "Bottes d'acier (+1 sav. DEX)", "Épée large OU hache de guerre OU masse flangée (1d6)", "Provocation (5x/LR) | Réplique fracassante (2x/LR) | Poing de golem (2x/LR)"],
    pvPerLevel: [0, 8, 8, 10, 10, 12, 12, 12, 14, 12, 14, 14, 15, 15, 16, 18, 20, 22, 24, 24],
    resourcePerLevel: Array(20).fill(0),
    specializations: ['Le titan', 'Le taureau', 'Le porc-épic'],
    specializationDetails: [
      {
        name: 'Le titan',
        summary: "Forgé dans le magma primordial. Défenses impénétrables.",
        effects: ['Résistance +1', 'Niveau 14 : Résistance +1'],
      },
      {
        name: 'Le taureau',
        summary: "Fonce sur ses ennemis et les écrase sous le poids de ses armements.",
        effects: [
          'Coups de bouclier font 1d4 supplémentaires',
          'Niveau 14 : Coups de bouclier font 1d6 supplémentaires',
        ],
      },
      {
        name: 'Le porc-épic',
        summary: "Se frapper te cause des dommages en retour.",
        effects: [
          'Chaque attaque mêlée contre toi inflige 1d4 perçants à l\'attaquant',
          'Niveau 14 : 1d6 perçants si l\'ennemi réussit l\'attaque',
        ],
      },
    ],
  },
  {
    id: 'vigilant', name: 'Vigilant', difficulty: '★★', dlc: true,
    description: "Prêtre d'Arivis spécialisé dans la traque et destruction des entités maléfiques. Exorciste solitaire armé de foi et de rituels anciens. Utilise la divinité pour ses miracles d'Arivis.",
    competences: 'Miracles d\'Arivis, armes simples, armures légères et moyennes',
    resource: 'divinite', startingResource: 0,
    startingArmor: { name: 'Capuche de vigilant (moyenne, AC+3, saving throws +2)', ac: 3, type: 'moyenne' },
    startingEquipment: ["Capuche de vigilant (moyenne, AC+3, +2 saving throws)", "Bâton de sorbier avec lame rétractable (1d8 perçant, DEX)", "Arbalète lourde (1d10 perçant, DEX)", "Chaîne d'argent (1d4 divins, bloque mouvement, donne avantage)", "Bestiaire : pose des questions oui/non sur les ennemis (-3 initiative/question)", "Sel et limaille : Action bonus (3x/LR) – 1d8 brûlants + désavantage"],
    pvPerLevel: [0, 6, 6, 8, 8, 10, 10, 10, 10, 12, 12, 12, 14, 14, 15, 15, 18, 20, 22, 24],
    resourcePerLevel: [0, 2, 2, 4, 4, 4, 6, 7, 8, 8, 8, 8, 8, 8, 8, 12, 12, 14, 14, 16],
    specializations: ['Consécrateur', 'Exorciste', 'Revigorant'],
    specializationDetails: [
      {
        name: 'Consécrateur',
        summary: "Ta foi protège tes alliés avec un bouclier divin.",
        effects: [
          'Protection d\'Arivis (1x/LR, sans action) : +2 AC et +3 saving throws à un allié',
          'Niveau 14 : +4 AC et +5 saving throws',
        ],
      },
      {
        name: 'Exorciste',
        summary: "Expert des faiblesses des créatures du mal.",
        effects: [
          '+2 attack roll + 1d4 divins contre créatures malignes',
          'Niveau 14 : +3 attack roll + 1d6 divins',
        ],
      },
      {
        name: 'Revigorant',
        summary: "Expert à guider des esprits. Réconforte et renforce tes alliés.",
        effects: [
          'Quand tu soignes avec un miracle : +2 PV bonus + avantage au prochain tour de l\'allié',
          'Niveau 14 : +5 PV bonus',
        ],
      },
    ],
    deityRequired: true, deityType: 'any',
  },
  {
    id: 'rapacier', name: 'Rapacier', difficulty: '★★', dlc: true,
    description: "Maître de la stratégie et de la mobilité. Combat avec rapière/sabre et arbalète à main. Partage ses PV avec son oiseau de guerre (lien mental). Valse du duelliste : ajoute DEX à l'AC sans bouclier.",
    competences: 'Sabres, rapières, armes simples, armures légères',
    resource: 'none', startingResource: 0,
    startingArmor: { name: 'Veste de cuir (légère, AC+1)', ac: 1, type: 'legere' },
    startingEquipment: ["Veste de cuir (légère, AC+1)", "Rapière (1d8 perçant) OU Sabre (1d8 tranchant)", "Arbalète à main (1d4 perçant, action bonus)", "Valse du duelliste : sans bouclier, ajoute DEX à l'AC", "Oiseau de proie au choix (partage les PV, AC 15, DEX 18, VIT 20)"],
    pvPerLevel: [0, 5, 5, 6, 6, 6, 8, 8, 10, 10, 12, 12, 12, 14, 14, 15, 15, 15, 16, 18],
    resourcePerLevel: Array(20).fill(0),
    specializations: ['Œil de rapace', 'Lame volante', 'Tempête d\'ailes'],
    specializationDetails: [
      {
        name: 'Œil de rapace',
        summary: "Expert à l'arbalète. Désigne une cible prioritaire et tire avec avantage.",
        effects: [
          'Dextérité +1 | Avantage avec arbalète sur la cible prioritaire',
          'Nouvelle cible quand la précédente meurt',
        ],
      },
      {
        name: 'Lame volante',
        summary: "Travaille de concert avec ton oiseau pour anéantir tes adversaires.",
        effects: [
          'Dextérité +1 | Quand tu touches en mêlée, l\'oiseau attaque immédiatement la même cible',
        ],
      },
      {
        name: 'Tempête d\'ailes',
        summary: "Ton oiseau est le centre de ton style de combat.",
        effects: [
          'L\'oiseau peut attaquer deux fois par action',
          'Quand l\'oiseau réussit, tu peux tirer avec arbalète (avec avantage) sans coût d\'action',
        ],
      },
    ],
  },
  {
    id: 'mystique', name: 'Mystique', difficulty: '★★', dlc: true,
    description: "Guerrier spirituel maîtrisant l'Essence (ki). Son arme est enchantée et utilise intelligence. Réflexes mystiques : ajoute INT à l'AC sans armure. Choisit une philosophie (Lumière ou Néant) au niveau 1.",
    competences: 'Armes rapprochées, pouvoirs mystiques (intelligence)',
    resource: 'ki', startingResource: 2,
    startingArmor: { name: 'Robes de mystique', ac: 0, type: 'robes' },
    startingEquipment: ["Robes de mystique", "Épée longue (1d8 tranchant)", "Ki +2", "Arme magique : attack roll utilise DEX+INT, dégâts 1d8 magiques (INT)", "Réflexes mystiques : ajoute INT à l'AC sans armure", "Philosophie au choix : Lumière ou Néant"],
    pvPerLevel: [0, 8, 8, 8, 10, 10, 10, 12, 12, 14, 14, 14, 14, 14, 15, 15, 16, 18, 20, 22],
    resourcePerLevel: [2, 4, 5, 5, 7, 7, 7, 8, 8, 9, 9, 9, 9, 9, 10, 10, 10, 12, 12, 12],
    specializations: ['La Lumière', 'Le Néant'],
    specializationDetails: [
      {
        name: 'La Lumière',
        summary: "Gardien de la paix. Protège et soigne. Le calme est ta vertu principale.",
        effects: [
          'Essence revitalisante (niv.4) : soigne 2d10 PV à un allié (coût 2 ki)',
          'Bouclier d\'Essence (niv.6) : +2 AC pour soi ou allié (coût 1 ki)',
          'Flamme purifiante (niv.11) : 4d6 brûlants en cône (coût 4 ki)',
          'Projection astrale (niv.15) : désavantage sur ennemi (1 ki)',
          'Un seul coup (niv.19) : tue instantanément si touche',
        ],
      },
      {
        name: 'Le Néant',
        summary: "Incarnation de la domination. La puissance est ton but et ton outil.",
        effects: [
          'Drain d\'Essence (niv.4) : +2 attack, récupère PV (coût 2 ki)',
          'Foudre maligne (niv.6) : 2d6 magiques + soins (coût 2 ki)',
          'Ombre engloutissante (niv.11) : 4d8 magiques + perd action bonus (coût 3 ki)',
          'Sape d\'Essence (niv.15) : 1d10 dégâts + récupère PV (1 ki)',
          'Écrasement des faibles (niv.19) : mort instantanée (sav. CON 22)',
        ],
      },
    ],
  },
];

// ─── FEAT LEVELS ─────────────────────────────────────────────────────────────
export const FEAT_LEVELS = [2, 5, 8, 12, 15, 18, 20];

// ─── STAT BONUS ──────────────────────────────────────────────────────────────
export function statBonus(val: number): number {
  return Math.floor((val - 10) / 2);
}

// ─── DEITIES ─────────────────────────────────────────────────────────────────
export const ALL_DEITIES = ['Moiifhb', 'Mitulia', 'Arivis', 'Laeth', 'Kadath', 'Sugriok', 'Akasha', 'Katong', 'Erkanos', 'Talkus'];
export const DARK_DEITIES = ['Talkus', 'Sugriok', 'Laeth'];

// ─── STAT NAMES ──────────────────────────────────────────────────────────────
export const STAT_LABELS: Record<StatKey, string> = {
  intelligence: 'Intelligence',
  foi: 'Foi',
  charisme: 'Charisme',
  dexterite: 'Dextérité',
  force: 'Force',
  vitesse: 'Vitesse',
  constitution: 'Constitution',
  resistance: 'Résistance',
};