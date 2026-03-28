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
    displayAsCards?: boolean;
  }[];
}

// ─── CLASSES IMPORTS ─────────────────────────────────────────────────────────
import { guerrier, mage, pretre, rogue, druide, barde, sorcier, moine, chasseur, necromancien, vampire, astromancien, fourbesang, sepulcral, venox, shaman, fleau, inquisiteur, valkyrie, scorpion, maraudeur, artificier, ravageur, bastion, vigilant, rapacier, mystique } from './classes';

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

// Get spell learning limits per class/level (similar structure to getMiracleLimit)
export function getSpellLimit(
  classeId: string, niveau: number
): {
  slots: Record<number, number>; // spells per level
  maxLevel: number;
} {
  const empty = { slots: {}, maxLevel: 0 };

  if (classeId === 'mage') {
    // Mage learns spells at specific levels; per-level limits
    let slots: Record<number, number> = { 1: 3 }; // Level 1: 3 spells
    let maxLevel = 1;
    if (niveau >= 2) { slots = { ...slots, 2: 1 }; maxLevel = 2; }
    if (niveau >= 4) { slots[2] = (slots[2] ?? 0) + 1; }
    if (niveau >= 5) { slots = { ...slots, 3: 1 }; maxLevel = 3; }
    if (niveau >= 7) { slots[3] = (slots[3] ?? 0) + 1; }
    if (niveau >= 9) { slots = { ...slots, 4: 1 }; maxLevel = 4; }
    if (niveau >= 11) { slots[4] = (slots[4] ?? 0) + 1; }
    if (niveau >= 14) { slots = { ...slots, 5: 1 }; maxLevel = 5; }
    if (niveau >= 17) { slots[5] = (slots[5] ?? 0) + 1; }
    if (niveau >= 20) { slots = { ...slots, 6: 1 }; maxLevel = 6; }
    return { slots, maxLevel };
  }

  if (classeId === 'druide') {
    // Druide learning spells via Aromates
    let slots: Record<number, number> = {};
    let maxLevel = 0;
    if (niveau >= 4) { slots = { 1: 2 }; maxLevel = 1; }
    if (niveau >= 12) { slots = { ...slots, 2: 1 }; maxLevel = 2; }
    return { slots, maxLevel };
  }

  if (classeId === 'barde') {
    // Barde learning spells
    let slots: Record<number, number> = {};
    let maxLevel = 0;
    if (niveau >= 3) { slots = { 1: 2 }; maxLevel = 1; }
    if (niveau >= 9) { slots = { ...slots, 2: 1 }; maxLevel = 2; }
    return { slots, maxLevel };
  }

  if (classeId === 'rogue') {
    // Rogue via Invisibilité spell
    let slots: Record<number, number> = {};
    let maxLevel = 0;
    if (niveau >= 5) { slots = { 2: 1 }; maxLevel = 2; }
    return { slots, maxLevel };
  }

  if (classeId === 'sorcier') {
    // Sorcier learning spells (dark themed)
    let slots: Record<number, number> = { 1: 2 };
    let maxLevel = 1;
    if (niveau >= 5) { slots = { ...slots, 2: 1 }; maxLevel = 2; }
    if (niveau >= 12) { slots = { ...slots, 3: 1 }; maxLevel = 3; }
    return { slots, maxLevel };
  }

  if (classeId === 'necromancien') {
    // Necromancien learning spells
    let slots: Record<number, number> = { 1: 1 };
    let maxLevel = 1;
    if (niveau >= 6) { slots = { ...slots, 2: 1 }; maxLevel = 2; }
    if (niveau >= 12) { slots = { ...slots, 3: 1 }; maxLevel = 3; }
    return { slots, maxLevel };
  }

  return { ...empty };
}

// Apply specialization bonuses to spell limits
// For Mage: different specializations grant different spell bonuses
export function applySpecializationBonus(
  classId: string,
  niveau: number,
  spellLimits: { slots: Record<number, number>; maxLevel: number },
  specialization?: string
): { slots: Record<number, number>; maxLevel: number } {
  if (classId !== 'mage' || !specialization || niveau < 3) {
    return spellLimits;
  }

  const slots = { ...spellLimits.slots };

  // Extract specialization name (remove " amélioré" suffix if present at level 14+)
  const spec = specialization.replace(' amélioré', '').trim();

  if (spec === 'Acolyte') {
    // Level 3: +3 sorts N1 + +2 sorts N2
    slots[1] = (slots[1] ?? 0) + 3;
    if (niveau >= 2) {
      slots[2] = (slots[2] ?? 0) + 2;
    }
    // Level 14: +3 sorts N2 + +2 sorts N3 + +1 sort N4
    if (niveau >= 14) {
      slots[2] = (slots[2] ?? 0) + 3;
      if (niveau >= 5) {
        slots[3] = (slots[3] ?? 0) + 2;
      }
      if (niveau >= 9) {
        slots[4] = (slots[4] ?? 0) + 1;
      }
    }
  } else if (spec === 'Mage guerrier') {
    // Level 3: No spell bonus
    // Level 14: No spell bonus
  } else if (spec === 'Manavore') {
    // Level 3: +1 sort N2
    if (niveau >= 2) {
      slots[2] = (slots[2] ?? 0) + 1;
    }
    // Level 14: +1 sort N4
    if (niveau >= 14 && niveau >= 9) {
      slots[4] = (slots[4] ?? 0) + 1;
    }
  }

  return { slots, maxLevel: spellLimits.maxLevel };
}

// Get ultimate spell limits per class/level
// Returns how many ultimate spells can be marked at each spell level
export function getUltimateSpellLimit(
  classeId: string, 
  niveau: number
): Record<number, number> {
  // ultimatesByLevel[spellLevel] = count
  // e.g., { 3: 1, 4: 1, 5: 1, 6: 1 } = 1 ultimate per high level

  if (classeId === 'mage') {
    let ultimates: Record<number, number> = {};
    if (niveau >= 6) { ultimates[3] = 1; }  // Level 6+: 1 ultimate Niveau 3
    if (niveau >= 9) { ultimates[4] = 1; }  // Level 9+: 1 ultimate Niveau 4
    if (niveau >= 12) { ultimates[5] = 1; } // Level 12+: 1 ultimate Niveau 5
    if (niveau >= 18) { ultimates[6] = 1; } // Level 18+: 1 ultimate Niveau 6
    return ultimates;
  }

  // Other classes have no ultimate spell limits yet
  return {};
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
  guerrier,
  mage,
  pretre,
  rogue,
  druide,
  barde,
  sorcier,
  moine,
  chasseur,
  necromancien,
  vampire,
  astromancien,
  fourbesang,
  sepulcral,
  venox,
  shaman,
  fleau,
  inquisiteur,
  valkyrie,
  scorpion,
  maraudeur,
  artificier,
  ravageur,
  bastion,
  vigilant,
  rapacier,
  mystique,
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