import { useState, useMemo } from 'react';
import { ChevronRight, ChevronLeft, Check, User, Shield, Sword, TrendingUp, Package, Star, Zap, BookOpen, FileText } from 'lucide-react';
import {
  RACES, CLASSES, FEAT_LEVELS, statBonus, ALL_DEITIES, DARK_DEITIES, STAT_LABELS,
  getMiracleLimit, miracleLevelLabel, slotTotal,
  type StatKey,
} from '../data/gameData';
import { FEATS } from './FeatSelector';
import { SORTS, MIRACLES, VAMPIRIQUE } from './SpellSelector';
import { ARMORS } from './data/armorData';
import { WEAPONS } from './data/weaponData';
import { ClassUpgradesStep } from './ClassUpgradesStep';

// ─── CharacterData (matches CharacterSheet) ───────────────────────────────────
export interface CharacterData {
  nom: string; exp: string; pv: string; classe: string; niveau: string; or: string;
  inventaire: string; armorClass: string; maxPV: string;
  force: string; dexterite: string; vitesse: string; constitution: string;
  resistance: string; intelligence: string; foi: string; charisme: string;
  habiletes: string; sorts: string; mana: string; miracles: string; divinite: string;
  pointsMelodieux: string; ki: string; pointsNecromancie: string; chargesVampiriques: string;
  selectedFeats: string[];
}
export interface VisibleSections {
  sorts: boolean; mana: boolean; miracles: boolean; divinite: boolean;
  pointsMelodieux: boolean; ki: boolean; pointsNecromancie: boolean; chargesVampiriques: boolean;
}

// ─── WIZARD STATE ─────────────────────────────────────────────────────────────
interface WizardState {
  step: number;
  nom: string;
  statPoints: Record<StatKey, number>;
  race: string;
  raceSubtype: string;
  classe: string;
  specialization: string;
  niveau: number;
  deity: string;
  selectedFeats: string[];
  selectedSpells: string[];
  selectedDeityMiracles: string[];
  selectedFreeMiracles: string[];
  selectedVampPowers: string[];
  selectedWeapon: string;
  selectedSecondWeapon?: string;
  selectedArmor: string;
  or: string;
  classUpgrades: Record<string, any>;
  weaponChoiceMode?: 'one-two-hand' | 'dual-wield' | 'single';
}

const BASE_STAT = 8;
const TOTAL_POINTS = 28;
const STATS: StatKey[] = ['force', 'dexterite', 'constitution', 'resistance', 'intelligence', 'foi', 'charisme', 'vitesse'];

const STEP_LABELS = [
  { icon: User, label: 'Identité' },
  { icon: TrendingUp, label: 'Statistiques' },
  { icon: Shield, label: 'Race' },
  { icon: Sword, label: 'Classe' },
  { icon: Star, label: 'Niveau' },
  { icon: Package, label: "Équipement" },
  { icon: Sword, label: 'Armes' },
  { icon: Zap, label: 'Feats' },
  { icon: BookOpen, label: 'Sorts & Miracles' },
  { icon: Package, label: 'Class Upgrades' },
  { icon: FileText, label: 'Résumé' },
];

const B = '1px solid #2c2416';

function calcFinalStats(state: WizardState): Record<StatKey, number> {
  const race = RACES.find(r => r.id === state.race);
  const subtype = race?.subtypes?.find(s => s.id === state.raceSubtype);
  const result: Record<StatKey, number> = {} as Record<StatKey, number>;
  for (const s of STATS) {
    let val = BASE_STAT + (state.statPoints[s] || 0);
    val += race?.statBonuses[s] ?? 0;
    val += subtype?.statBonuses[s] ?? 0;
    result[s] = Math.max(1, val);
  }
  
  // Apply stat bonuses from class upgrades (e.g., "Force +2", "Dextérité +1")
  for (const [key, value] of Object.entries(state.classUpgrades)) {
    if (typeof value === 'string') {
      // Parse format like "Force +2", "Dextérité +1", "Force +1, Dextérité +1"
      const parts = value.split(',');
      for (const part of parts) {
        const trimmed = part.trim();
        const statMatch = trimmed.match(/^(\w+)\s*\+(\d+)$/);
        if (statMatch) {
          const statName = statMatch[1].toLowerCase();
          const bonus = parseInt(statMatch[2], 10);
          // Map French stat names to STATS keys
          const statKey: StatKey | null = 
            statName === 'force' ? 'force' :
            statName === 'dextérité' ? 'dexterite' :
            statName === 'constitution' ? 'constitution' :
            statName === 'résistance' ? 'resistance' :
            statName === 'intelligence' ? 'intelligence' :
            statName === 'sagesse' ? 'foi' :
            statName === 'charisme' ? 'charisme' :
            statName === 'vitesse' ? 'vitesse' :
            null;
          if (statKey && result[statKey] !== undefined) {
            result[statKey] += bonus;
          }
        }
      }
    }
  }
  
  return result;
}

function calcMaxPV(state: WizardState, finalStats: Record<StatKey, number>): number {
  const cls = CLASSES.find(c => c.id === state.classe);
  if (!cls) return finalStats.constitution * 2;
  const basePV = finalStats.constitution * 2;
  const level = state.niveau;
  let classBonus = 0;
  for (let i = 1; i <= level; i++) classBonus += cls.pvPerLevel[i] || 0;
  // Feat PV bonuses
  let featPV = 0;
  for (const fid of state.selectedFeats) {
    const feat = FEATS.find(f => f.id === fid);
    if (!feat) continue;
    for (const eff of feat.effects) {
      const m = eff.match(/PV \+(\d+)/);
      if (m) featPV += parseInt(m[1]);
    }
  }
  return basePV + classBonus + featPV;
}

function calcAC(state: WizardState, finalStats: Record<StatKey, number>): number {
  const cls = CLASSES.find(c => c.id === state.classe);
  const resBonus = statBonus(finalStats.resistance);
  let base = 10 + resBonus;
  // Use selected armor if set, otherwise fall back to class default
  const chosenArmor = ARMORS.find(a => a.id === state.selectedArmor);
  if (chosenArmor && chosenArmor.id !== 'none') {
    if (chosenArmor.type === 'lourde') base = chosenArmor.ca;
    else if (chosenArmor.type === 'moyenne') base = chosenArmor.ca + Math.min(resBonus, 2);
    else base = chosenArmor.ca + resBonus; // légère
  } else if (!state.selectedArmor && cls) {
    const armor = cls.startingArmor;
    if (armor.type === 'lourde') base = armor.ac > 0 ? armor.ac : 15;
    else if (armor.type === 'moyenne') base = 10 + armor.ac + Math.min(resBonus, 2);
    else if (armor.type === 'legere') base = 10 + armor.ac + resBonus;
  }
  // Ravageur: sans armure → ajoute CON à l'AC
  if (cls?.id === 'ravageur' && !state.selectedArmor) {
    base = 10 + statBonus(finalStats.constitution) + resBonus;
  }
  // Mystique: sans armure → ajoute INT à l'AC (Réflexes mystiques)
  if (cls?.id === 'mystique' && !state.selectedArmor) {
    base = 10 + statBonus(finalStats.intelligence) + resBonus;
  }
  // Velshaari: AC base 13 sans armure
  const race = RACES.find(r => r.id === state.race);
  if (race?.id === 'velshaari' && !state.selectedArmor && (cls?.startingArmor.type === 'robes' || cls?.startingArmor.type === 'none')) {
    base = Math.max(base, 13 + resBonus);
  }
  // Heritage draconique feat
  if (state.selectedFeats.includes('heritage-draconique')) {
    const dexB = statBonus(finalStats.dexterite);
    const armorType = chosenArmor?.type ?? cls?.startingArmor.type;
    if (armorType === 'robes' || armorType === 'none') base = Math.max(base, 13 + dexB);
  }
  // Feat AC bonuses
  for (const fid of state.selectedFeats) {
    const feat = FEATS.find(f => f.id === fid);
    if (!feat) continue;
    for (const eff of feat.effects) {
      if (eff.includes('AC +1') || eff.includes('AC+1')) base += 1;
    }
  }
  return base;
}

function calcResource(state: WizardState, finalStats: Record<StatKey, number>): number {
  const cls = CLASSES.find(c => c.id === state.classe);
  if (!cls) return 0;
  const level = state.niveau;
  let base = cls.resourcePerLevel[level - 1] ?? cls.startingResource;
  const race = RACES.find(r => r.id === state.race);
  const subtype = race?.subtypes?.find(s => s.id === state.raceSubtype);
  if (cls.resource === 'mana') {
    base += race?.manaBonus ?? 0;
    base += subtype?.manaBonus ?? 0;
  }
  // Feat resource bonuses
  for (const fid of state.selectedFeats) {
    const feat = FEATS.find(f => f.id === fid);
    if (!feat) continue;
    for (const eff of feat.effects) {
      if (cls.resource === 'mana' && eff.includes('Mana +')) {
        const m = eff.match(/Mana \+(\d+)/);
        if (m) base += parseInt(m[1]);
      }
      if (cls.resource === 'divinite' && eff.includes('Divinité +')) {
        const m = eff.match(/Divinité \+(\d+)/);
        if (m) base += parseInt(m[1]);
      }
      if (cls.resource === 'ki' && eff.includes('Ki +')) {
        const m = eff.match(/Ki \+(\d+)/);
        if (m) base += parseInt(m[1]);
      }
    }
  }
  return base;
}

function buildCharacterData(state: WizardState): { data: CharacterData; vis: VisibleSections } {
  const finalStats = calcFinalStats(state);
  const maxPV = calcMaxPV(state, finalStats);
  const ac = calcAC(state, finalStats);
  const cls = CLASSES.find(c => c.id === state.classe);
  const resource = calcResource(state, finalStats);
  const level = state.niveau;

  // Spells text
  const spellNames = state.selectedSpells.map(id => SORTS.find(s => s.id === id)?.name ?? id);
  const allMiracleIds = [...state.selectedDeityMiracles, ...state.selectedFreeMiracles];
  const miracleNames = allMiracleIds.map(id => MIRACLES.find(m => m.id === id)?.name ?? id);
  const vampNames = state.selectedVampPowers.map(id => VAMPIRIQUE.find(v => v.id === id)?.name ?? id);

  // Abilities text - filter out generic stat text like "Force +1", "miracle niveau 1", etc.
  // But KEEP important class abilities like "Spécialisation au choix", "Arme à deux mains", "compétence aux armes"
  const GENERIC_ABILITY_RX = /(force|dexterité|constitution|resistance|intelligence|foi|charisme|vitesse)\s*\+\d+|miracle\s+(niveau|choix)|points?\s+(mélodieux|necromancie|vampirique|ki)|mana\s*\+|divinité\s*\+|vision|survivance|d[eé]couvert|langue(?!\s)|malédiction|marque/i;
  
  const classAbilitiesArray = cls?.startingEquipment
    ?.filter(e => !e.includes('AC') && !e.includes('Armure') && !e.includes('sort') && !e.includes('Sort') && !GENERIC_ABILITY_RX.test(e)) ?? [];
  
  // Level-specific upgrades (dynamically built from class levelSpecificChoices)
  const levelUpgrades: string[] = [];
  
  // Helper to generate consistent choice keys (same as ClassUpgradesStep)
  const getChoiceKey = (classId: string, level: number, choiceName: string): string => {
    return `${classId}_lvl${level}_${choiceName.toLowerCase().replace(/\s+/g, '_')}`;
  };
  
  // Build levelUpgrades from class data
  if (cls?.levelSpecificChoices && cls.levelSpecificChoices.length > 0) {
    for (const choice of cls.levelSpecificChoices) {
      if (choice.level <= level) {
        const key = getChoiceKey(cls.id, choice.level, choice.name);
        const chosenValue = state.classUpgrades[key];
        if (chosenValue && typeof chosenValue === 'string' && chosenValue !== 'false') {
          levelUpgrades.push(`${choice.name} : ${chosenValue} (niveau ${choice.level})`);
        }
      }
    }
  }
  
  // Abilities now contains only class features + level upgrades (NOT feats anymore - they stay in Feats step)
  const habiletes = [...classAbilitiesArray, ...levelUpgrades].filter(Boolean).join('\n\n');

  // Inventory text — only physical, non-choice items
  // Important: exclude items that already went to classAbilities (habiletes)
  const NON_PHYSICAL_RX = /miracle|mana \+|divinit[eé] \+|\d+ sort|sorts? niveau|sorts? au choix|sort :|sorts et miracles|points? (de )?n[eé]cromancie|charges? vampirique|survie vampirique|vision nocturne|vitesse \+|points? m[eé]lodieux|ki \+|arts martiaux|r[eé]flexes|combattant squelettique/i;
  const isPhysEq = (s: string) => !NON_PHYSICAL_RX.test(s);
  const isWeaponChoiceItem = (s: string) => /arme[s]?.*(au choix)/i.test(s);
  const isArmorChoiceItem = (s: string) => / OU /i.test(s) && /(armure|robe)/i.test(s);
  
  // Build list of items that went to abilities to exclude them from inventory
  const abilityItems = classAbilitiesArray;
  
  let equipLines = (cls?.startingEquipment ?? []).filter(e => {
    // Exclude abilities
    if (abilityItems.includes(e)) return false;
    // Exclude non-physical items
    if (!isPhysEq(e)) return false;
    // Exclude weapon/armor choices
    if (isWeaponChoiceItem(e)) return false;
    if (isArmorChoiceItem(e)) return false;
    return true;
  });
  
  // Apply class upgrades
  if (cls?.id === 'artificier' && state.niveau >= 8 && state.classUpgrades['artificier_armor'] === 'arcanotech') {
    // Remove "Robes d'artificier" and add "Armure arcano-mécanique"
    equipLines = equipLines.filter(e => !e.includes("Robes d'artificier"));
    equipLines.push("Armure arcano-mécanique (AC +3, résistance électrique)");
  }
  
  const chosenWeapon = WEAPONS.find(w => w.id === state.selectedWeapon);
  const chosenSecondWeapon = state.selectedSecondWeapon ? WEAPONS.find(w => w.id === state.selectedSecondWeapon) : null;
  const chosenArmorItem = ARMORS.find(a => a.id === state.selectedArmor);
  const extraEquip: string[] = [];
  
  // Add weapon(s) to inventory
  if (chosenWeapon) {
    if (chosenSecondWeapon) {
      // Dual-wield: show both weapons
      extraEquip.push(`${chosenWeapon.name} + ${chosenSecondWeapon.name}`);
    } else {
      // Single weapon: show just the main weapon
      extraEquip.push(`${chosenWeapon.name} (${chosenWeapon.dmg})`);
    }
  }
  
  if (chosenArmorItem && chosenArmorItem.id !== 'none') extraEquip.push(`${chosenArmorItem.name} (CA ${chosenArmorItem.ca})`);
  const inventaire = [...equipLines, ...extraEquip].join('\n');

  // Resource fields
  const mana = cls?.resource === 'mana' ? String(resource) : '';
  const divinite = cls?.resource === 'divinite' ? String(resource) : '';
  const ki = cls?.resource === 'ki' ? String(resource) : '';
  const pointsNecromancie = cls?.resource === 'necromancie' ? String(resource) : '';
  const chargesVampiriques = cls?.resource === 'vampirique' ? String(resource) : '';
  const pointsMelodieux = cls?.resource === 'melodieux' ? String(resource) : '';

  // Sorts + miracles text
  const sortsText = spellNames.join(', ');
  const miraclesText = [...miracleNames, ...vampNames].join(', ');

  const vis: VisibleSections = {
    sorts: spellNames.length > 0 || cls?.resource === 'mana',
    mana: cls?.resource === 'mana',
    miracles: miracleNames.length > 0 || cls?.resource === 'divinite',
    divinite: cls?.resource === 'divinite',
    pointsMelodieux: cls?.resource === 'melodieux',
    ki: cls?.resource === 'ki',
    pointsNecromancie: cls?.resource === 'necromancie',
    chargesVampiriques: cls?.resource === 'vampirique' || vampNames.length > 0,
  };

  const data: CharacterData = {
    nom: state.nom,
    exp: '0',
    pv: String(maxPV),
    classe: cls?.name ?? state.classe,
    niveau: String(level),
    or: state.or || '0',
    inventaire,
    armorClass: String(ac),
    maxPV: String(maxPV),
    force: String(finalStats.force),
    dexterite: String(finalStats.dexterite),
    vitesse: String(finalStats.vitesse),
    constitution: String(finalStats.constitution),
    resistance: String(finalStats.resistance),
    intelligence: String(finalStats.intelligence),
    foi: String(finalStats.foi),
    charisme: String(finalStats.charisme),
    habiletes,
    sorts: sortsText,
    mana,
    miracles: miraclesText,
    divinite,
    pointsMelodieux,
    ki,
    pointsNecromancie,
    chargesVampiriques,
    selectedFeats: state.selectedFeats,
  };

  return { data, vis };
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: '20px', fontWeight: 700, color: '#2c2416', borderBottom: '2px solid #c0392b', paddingBottom: '8px', marginBottom: '16px' }}>
      {children}
    </div>
  );
}

function Card({ children, selected, onClick, style }: { children: React.ReactNode; selected?: boolean; onClick?: () => void; style?: React.CSSProperties }) {
  return (
    <div onClick={onClick} style={{
      border: selected ? '2px solid #c0392b' : '1px solid #ccc',
      borderRadius: '8px',
      background: selected ? '#fff5f5' : '#fff',
      padding: '12px',
      cursor: onClick ? 'pointer' : 'default',
      boxShadow: selected ? '0 2px 12px #c0392b33' : '0 1px 4px rgba(0,0,0,0.07)',
      transition: 'all 0.15s',
      ...style,
    }}>
      {children}
    </div>
  );
}

function StatRow({ label, value, bonus, onChange, pointsLeft }: {
  label: string; value: number; bonus: number; onChange: (delta: number) => void; pointsLeft: number;
}) {
  const canIncrease = pointsLeft > 0 && (value - BASE_STAT) < 8;
  const canDecrease = value > BASE_STAT;
  const bonusStr = bonus >= 0 ? `+${bonus}` : String(bonus);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 12px', background: '#fff', border: B, borderRadius: '6px', marginBottom: '6px' }}>
      <div style={{ flex: 1, fontWeight: 600, fontSize: '14px' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button onClick={() => onChange(-1)} disabled={!canDecrease}
          style={{ width: '28px', height: '28px', border: B, borderRadius: '4px', background: canDecrease ? '#fff' : '#f5f5f5', cursor: canDecrease ? 'pointer' : 'not-allowed', fontWeight: 700, fontSize: '16px' }}>−</button>
        <div style={{ width: '36px', textAlign: 'center', fontWeight: 700, fontSize: '18px' }}>{value}</div>
        <button onClick={() => onChange(1)} disabled={!canIncrease}
          style={{ width: '28px', height: '28px', border: B, borderRadius: '4px', background: canIncrease ? '#fff' : '#f5f5f5', cursor: canIncrease ? 'pointer' : 'not-allowed', fontWeight: 700, fontSize: '16px' }}>+</button>
      </div>
      <div style={{ width: '44px', textAlign: 'right', fontSize: '13px', color: bonus >= 0 ? '#16a34a' : '#c0392b', fontWeight: 700 }}>{bonusStr}</div>
    </div>
  );
}

export interface SpellSelection {
  spells: string[];
  deityMiracles: string[];
  freeMiracles: string[];
  vampPowers: string[];
  deity: string;
  classe: string;
  nom: string;
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export function CharacterWizard({ onComplete }: { onComplete: (data: CharacterData, vis: VisibleSections, spells: SpellSelection) => void }) {
  const [state, setState] = useState<WizardState>({
    step: 0,
    nom: '',
    statPoints: { intelligence: 0, foi: 0, charisme: 0, dexterite: 0, force: 0, vitesse: 0, constitution: 0, resistance: 0 },
    race: '',
    raceSubtype: '',
    classe: '',
    specialization: '',
    niveau: 1,
    deity: '',
    selectedFeats: [],
    selectedSpells: [],
    selectedDeityMiracles: [],
    selectedFreeMiracles: [],
    selectedVampPowers: [],
    selectedWeapon: '',
    selectedSecondWeapon: '',
    selectedArmor: '',
    or: '0',
    classUpgrades: {},
    weaponChoiceMode: 'single',
  });

  const set = <K extends keyof WizardState>(k: K, v: WizardState[K]) => setState(p => ({ ...p, [k]: v }));

  const pointsUsed = useMemo(() => Object.values(state.statPoints).reduce((a, b) => a + b, 0), [state.statPoints]);
  const pointsLeft = TOTAL_POINTS - pointsUsed;

  const race = RACES.find(r => r.id === state.race);
  const subtype = race?.subtypes?.find(s => s.id === state.raceSubtype);
  const cls = CLASSES.find(c => c.id === state.classe);
  const finalStats = useMemo(() => calcFinalStats(state), [state]);
  const maxPV = useMemo(() => calcMaxPV(state, finalStats), [state, finalStats]);
  const ac = useMemo(() => calcAC(state, finalStats), [state, finalStats]);
  const resource = useMemo(() => calcResource(state, finalStats), [state, finalStats]);

  const adjustStat = (key: StatKey, delta: number) => {
    const cur = state.statPoints[key];
    const newVal = cur + delta;
    if (newVal < 0 || newVal > 8) return;
    if (delta > 0 && pointsLeft <= 0) return;
    setState(p => ({ ...p, statPoints: { ...p.statPoints, [key]: newVal } }));
  };

  // How many feats at this level
  const featCount = FEAT_LEVELS.filter(l => l <= state.niveau).length;

  // Helper: Check if any selected feat grants miracles (with feat list as param)
  const hasFeatGrantingMiraclesFor = (feats: string[]): boolean => {
    const miracleFeatIds = ['devotion', 'communion-lunaire', 'defenseur-vie', 'erudit', 'influence-cosmique', 'touche-enfer', 'choisi-laeth', 'devoue-mal'];
    return miracleFeatIds.some(id => feats.includes(id));
  };

  // Helper: Check if any selected feat grants spells
  const hasFeatGrantingSpells = (): boolean => {
    // Feats that grant spells: 'helomancien' grants elemental spells
    return state.selectedFeats.includes('helomancien');
  };

  // Helper: Check if any selected feat grants miracles
  const hasFeatGrantingMiracles = (): boolean => {
    return hasFeatGrantingMiraclesFor(state.selectedFeats);
  };

  // Available spells based on class or feats
  const hasSpells = (cls && ['mage', 'druide', 'barde', 'rogue', 'sorcier', 'necromancien'].includes(cls.id)) || hasFeatGrantingSpells();
  const hasMiracles = (cls && ['pretre', 'sorcier', 'necromancien', 'druide', 'guerrier'].includes(cls.id)) || hasFeatGrantingMiracles();
  const hasVampPowers = cls?.id === 'vampire' || state.selectedFeats.includes('faveur-akasha') || state.selectedFeats.includes('heritier-sanguin');

  // Helper: Check if current class meets feat restriction
  const meetsClassRestriction = (restriction: string | undefined): boolean => {
    if (!restriction) return true; // No restriction = always allowed
    if (!cls) return false; // No class selected = can't meet any restriction
    
    // Normalize accents in class names
    const removeAccents = (s: string) => {
      return s.toLowerCase()
        .replace(/é|ê|è/g, 'e')
        .replace(/à/g, 'a')
        .replace(/ù|û/g, 'u')
        .replace(/ç/g, 'c')
        .replace(/î|ï/g, 'i')
        .replace(/ô|ö/g, 'o');
    };
    
    // Parse restriction string to extract class names
    // Examples: "Prêtre ou guerrier uniquement." -> ["pretre", "guerrier"]
    //           "Prêtre seulement." -> ["pretre"]
    const cleaned = restriction
      .replace(/\s+(seulement|uniquement)\.?$/gi, '')
      .replace(/\s+ou\s+/gi, ',');
    
    const classNames = cleaned.split(',')
      .map(s => removeAccents(s.trim()))
      .filter(s => s);
    
    // Check if current class ID matches any allowed class
    return classNames.some(name => cls.id.includes(name) || name.includes(cls.id));
  };

  // Helper: Check if all prerequisites are met for a feat
  const canSelectFeat = (featId: string, currentSelected: string[]): boolean => {
    const feat = FEATS.find(f => f.id === featId);
    if (!feat || !feat.requires) return true;
    // Find prerequisite feat by name (requires field is a name string)
    const prereqFeat = FEATS.find(f => f.name === feat.requires);
    if (!prereqFeat) return true;
    return currentSelected.includes(prereqFeat.id);
  };

  const toggleFeat = (id: string) => {
    setState(p => {
      const cur = p.selectedFeats;
      if (cur.includes(id)) return { ...p, selectedFeats: cur.filter(f => f !== id) };
      if (cur.length >= featCount) return p;
      // Check prerequisites before adding
      if (!canSelectFeat(id, cur)) return p;
      return { ...p, selectedFeats: [...cur, id] };
    });
  };

  const toggleSpell = (id: string) => {
    setState(p => {
      const cur = p.selectedSpells;
      return { ...p, selectedSpells: cur.includes(id) ? cur.filter(s => s !== id) : [...cur, id] };
    });
  };

  // Per-level lock helper: returns true if a miracle of given level can still be added
  const canAddMiracle = (
    miracleId: string,
    currentSelected: string[],
    slots: Record<number, number>,
    strictByLevel: boolean,
  ): boolean => {
    const miracle = MIRACLES.find(m => m.id === miracleId);
    if (!miracle) return false;
    const LVL_MAP: Record<string, number> = { 'Niveau 1': 1, 'Niveau 2': 2, 'Niveau 3': 3, 'Suprême': 4, 'Ultime': 5 };
    const lvl = LVL_MAP[miracle.subcategory] ?? 1;
    if (strictByLevel) {
      // Count already selected at this exact level
      const countAtLevel = currentSelected.filter(id => {
        const m2 = MIRACLES.find(m => m.id === id);
        return m2 && (LVL_MAP[m2.subcategory] ?? 1) === lvl;
      }).length;
      return countAtLevel < (slots[lvl] ?? 0);
    } else {
      // Flexible: can use any slot >= miracle level
      const totalSlots = slotTotal(slots);
      // Check total first
      if (currentSelected.length >= totalSlots) return false;
      // Then check max level
      const maxSlotLevel = Math.max(0, ...Object.keys(slots).map(Number));
      return lvl <= maxSlotLevel;
    }
  };

  // Returns lock state for a miracle card (considering per-level slots)
  const isMiracleLocked = (
    miracleId: string,
    currentSelected: string[],
    slots: Record<number, number>,
    strictByLevel: boolean,
  ): boolean => {
    if (currentSelected.includes(miracleId)) return false;
    return !canAddMiracle(miracleId, currentSelected, slots, strictByLevel);
  };

  const toggleDeityMiracle = (id: string) => {
    setState(p => {
      const cur = p.selectedDeityMiracles;
      if (cur.includes(id)) return { ...p, selectedDeityMiracles: cur.filter(s => s !== id) };
      const baseLimit = getMiracleLimit(p.classe, p.niveau);
      
      // If no miracles from class but feat grants them, allow 1 miracle
      const deitySlots = baseLimit.deitySlots && Object.keys(baseLimit.deitySlots).length > 0
        ? baseLimit.deitySlots
        : (hasFeatGrantingMiraclesFor(p.selectedFeats) ? { 1: 1 } : {});
      
      if (!canAddMiracle(id, cur, deitySlots, baseLimit.strictByLevel)) return p;
      return { ...p, selectedDeityMiracles: [...cur, id] };
    });
  };

  const toggleFreeMiracle = (id: string) => {
    setState(p => {
      const cur = p.selectedFreeMiracles;
      if (cur.includes(id)) return { ...p, selectedFreeMiracles: cur.filter(s => s !== id) };
      const baseLimit = getMiracleLimit(p.classe, p.niveau);
      
      // If no miracles from class but feat grants them, allow 1 miracle
      const freeSlots = baseLimit.freeSlots && Object.keys(baseLimit.freeSlots).length > 0
        ? baseLimit.freeSlots
        : (hasFeatGrantingMiraclesFor(p.selectedFeats) ? { 1: 1 } : {});
      
      if (!canAddMiracle(id, cur, freeSlots, baseLimit.strictByLevel)) return p;
      return { ...p, selectedFreeMiracles: [...cur, id] };
    });
  };

  const toggleVamp = (id: string) => {
    setState(p => {
      const cur = p.selectedVampPowers;
      return { ...p, selectedVampPowers: cur.includes(id) ? cur.filter(s => s !== id) : [...cur, id] };
    });
  };



  // Check if all mandatory class upgrades are completed
  const areAllUpgradesComplete = (): boolean => {
    const cls = CLASSES.find(c => c.id === state.classe);
    if (!cls?.levelSpecificChoices) return true;
    
    const availableChoices = cls.levelSpecificChoices.filter(choice => choice.level <= state.niveau);
    
    for (const choice of availableChoices) {
      // Only validate non-toggle choices (toggles are optional)
      const isToggleChoice = choice.options.length === 1 && choice.options[0].toLowerCase().includes('débloquer');
      if (isToggleChoice) continue;
      
      // Check if this choice has been made
      const key = `${cls.id}_lvl${choice.level}_${choice.name.toLowerCase().replace(/\s+/g, '_')}`;
      const chosenValue = state.classUpgrades[key];
      
      if (!chosenValue || (typeof chosenValue === 'string' && chosenValue.trim() === '')) {
        return false; // Required choice not made
      }
    }
    
    return true;
  };

  const canProceed = () => {
    if (state.step === 0) return state.nom.trim().length > 0;
    if (state.step === 1) return pointsLeft === 0;
    if (state.step === 2) return state.race !== '' && (!race?.subtypes || state.raceSubtype !== '');
    if (state.step === 3) return state.classe !== '';
    if (state.step === 9) return areAllUpgradesComplete();
    return true;
  };

  const go = (delta: number) => setState(p => ({ ...p, step: Math.max(0, Math.min(STEP_LABELS.length - 1, p.step + delta)) }));

  const finish = () => {
    const { data, vis } = buildCharacterData(state);
    const spells: SpellSelection = {
      spells: state.selectedSpells,
      deityMiracles: state.selectedDeityMiracles,
      freeMiracles: state.selectedFreeMiracles,
      vampPowers: state.selectedVampPowers,
      deity: state.deity,
      classe: state.classe,
      nom: state.nom,
    };
    onComplete(data, vis, spells);
  };

  // ── STEP RENDERS ────────────────────────────────────────────────────────────
  const renderStep = () => {
    switch (state.step) {
      // ── Step 0: Identity ──
      case 0: return (
        <div>
          <SectionTitle>Identité du personnage</SectionTitle>
          <div style={{ maxWidth: '480px', margin: '0 auto' }}>
            <label style={{ display: 'block', fontWeight: 700, marginBottom: '6px' }}>Nom du personnage</label>
            <input value={state.nom} onChange={e => set('nom', e.target.value)}
              placeholder="Entre le nom de ton personnage..."
              style={{ width: '100%', padding: '10px 14px', border: B, borderRadius: '6px', fontSize: '15px', boxSizing: 'border-box', fontFamily: 'serif' }} />
            <div style={{ marginTop: '20px' }}>
              <label style={{ display: 'block', fontWeight: 700, marginBottom: '6px' }}>Or de départ</label>
              <input value={state.or} onChange={e => set('or', e.target.value)}
                placeholder="0" type="number" min="0"
                style={{ width: '160px', padding: '10px 14px', border: B, borderRadius: '6px', fontSize: '15px', fontFamily: 'serif' }} />
            </div>
            <div style={{ marginTop: '24px', padding: '16px', background: '#fffbeb', border: '1px solid #d4a017', borderRadius: '8px', fontSize: '13px', color: '#7c5a00' }}>
              <strong>Bienvenue dans l'assistant de création de personnage pour Midian !</strong><br /><br />
              Tu vas passer à travers 9 étapes pour créer ton personnage. À la fin, la fiche sera remplie automatiquement. Tu pourras toujours modifier les détails manuellement ensuite.
            </div>
          </div>
        </div>
      );

      // ── Step 1: Stats ──
      case 1: return (
        <div>
          <SectionTitle>Attribution des statistiques</SectionTitle>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ padding: '10px 20px', background: pointsLeft === 0 ? '#f0fdf4' : '#fff5f5', border: `2px solid ${pointsLeft === 0 ? '#16a34a' : '#c0392b'}`, borderRadius: '8px', fontWeight: 700, fontSize: '16px', color: pointsLeft === 0 ? '#16a34a' : '#c0392b' }}>
              Points restants : {pointsLeft} / {TOTAL_POINTS}
            </div>
            <div style={{ fontSize: '12px', color: '#888' }}>Toutes les stats commencent à 8. Maximum +8 par stat.</div>
          </div>

          {/* Presets */}
          <div style={{ marginBottom: '16px', padding: '12px', background: '#f9f6f0', border: '1px solid #d4a017', borderRadius: '6px' }}>
            <div style={{ fontWeight: 700, fontSize: '13px', marginBottom: '8px', color: '#8b6914' }}>Presets rapides :</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button onClick={() => {
                setState(p => ({ ...p, statPoints: { force: 7, dexterite: 6, constitution: 5, resistance: 4, intelligence: 3, foi: 2, charisme: 1, vitesse: 0 } }));
              }} style={{ padding: '6px 12px', background: '#fff', border: '1px solid #d4a017', borderRadius: '4px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', color: '#8b6914' }}>
                Standard [15,14,13,12,11,10,9,8]
              </button>
              <button onClick={() => {
                setState(p => ({ ...p, statPoints: { force: 5, dexterite: 5, constitution: 5, resistance: 4, intelligence: 4, foi: 3, charisme: 2, vitesse: 0 } }));
              }} style={{ padding: '6px 12px', background: '#fff', border: '1px solid #d4a017', borderRadius: '4px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', color: '#8b6914' }}>
                Équilibré [13,13,13,12,12,11,10,8]
              </button>
              <button onClick={() => {
                setState(p => ({ ...p, statPoints: { force: 7, dexterite: 6, constitution: 5, resistance: 5, intelligence: 4, foi: 1, charisme: 0, vitesse: 0 } }));
              }} style={{ padding: '6px 12px', background: '#fff', border: '1px solid #d4a017', borderRadius: '4px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', color: '#8b6914' }}>
                Élevé [15,14,13,13,12,9,8,8]
              </button>
              <button onClick={() => {
                setState(p => ({ ...p, statPoints: { force: 0, dexterite: 0, constitution: 0, resistance: 0, intelligence: 0, foi: 0, charisme: 0, vitesse: 0 } }));
              }} style={{ padding: '6px 12px', background: '#fff', border: '1px solid #ccc', borderRadius: '4px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', color: '#666' }}>
                Réinitialiser
              </button>
            </div>
          </div>

          <div style={{ maxWidth: '560px' }}>
            {STATS.map(key => (
              <StatRow key={key} label={STAT_LABELS[key]} value={BASE_STAT + (state.statPoints[key] || 0)}
                bonus={statBonus(BASE_STAT + (state.statPoints[key] || 0))}
                onChange={d => adjustStat(key, d)} pointsLeft={pointsLeft} />
            ))}
          </div>
          <div style={{ marginTop: '16px', padding: '12px', background: '#f0f4ff', border: '1px solid #2c5fa5', borderRadius: '6px', fontSize: '12px', color: '#1a3a6e' }}>
            <strong>Rappel :</strong> PV de base = Constitution × 2 | AC de base = 10 + bonus Résistance<br />
            Bonus = (stat − 10) ÷ 2 (arrondi vers le bas)
          </div>
        </div>
      );

      // ── Step 2: Race ──
      case 2: return (
        <div>
          <SectionTitle>Choix de la race</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '10px' }}>
            {RACES.map(r => (
              <Card key={r.id} selected={state.race === r.id} onClick={() => { set('race', r.id); set('raceSubtype', ''); }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <div style={{ fontWeight: 700, fontSize: '15px', color: state.race === r.id ? '#c0392b' : '#1a1a1a' }}>{r.name}</div>
                  {r.dlc && <span style={{ fontSize: '9px', padding: '1px 5px', background: '#1a1a2e', color: '#c9a227', border: '1px solid #c9a227', borderRadius: '8px', fontWeight: 700, letterSpacing: '0.5px' }}>DLC</span>}
                </div>
                <div style={{ fontSize: '11px', color: '#666', marginBottom: '8px', lineHeight: '1.4' }}>{r.description}</div>
                <div style={{ fontSize: '11px' }}>
                  {Object.entries(r.statBonuses).filter(([, v]) => v !== 0).map(([k, v]) => (
                    <span key={k} style={{ display: 'inline-block', margin: '2px 3px 2px 0', padding: '1px 6px', background: (v ?? 0) > 0 ? '#f0fdf4' : '#fff1f0', color: (v ?? 0) > 0 ? '#16a34a' : '#c0392b', border: `1px solid ${(v ?? 0) > 0 ? '#16a34a' : '#c0392b'}`, borderRadius: '10px', fontWeight: 700 }}>
                      {STAT_LABELS[k as StatKey]} {(v ?? 0) > 0 ? '+' : ''}{v}
                    </span>
                  ))}
                  {r.manaBonus ? <span style={{ display: 'inline-block', margin: '2px 3px 2px 0', padding: '1px 6px', background: '#f5f0ff', color: '#7c3aed', border: '1px solid #7c3aed', borderRadius: '10px', fontWeight: 700 }}>Mana +{r.manaBonus}</span> : null}
                </div>
                {r.abilities.length > 0 && (
                  <div style={{ marginTop: '6px', fontSize: '11px', color: '#555' }}>
                    {r.abilities.map((a, i) => <div key={i}>• {a}</div>)}
                  </div>
                )}
              </Card>
            ))}
          </div>
          {race?.subtypes && (
            <div style={{ marginTop: '20px' }}>
              <div style={{ fontWeight: 700, marginBottom: '10px', fontSize: '15px' }}>Sous-type de {race.name}</div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {race.subtypes.map(sub => (
                  <Card key={sub.id} selected={state.raceSubtype === sub.id} onClick={() => set('raceSubtype', sub.id)} style={{ minWidth: '220px', flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>{sub.name}</div>
                    <div style={{ fontSize: '11px' }}>
                      {Object.entries(sub.statBonuses).filter(([, v]) => v !== 0).map(([k, v]) => (
                        <span key={k} style={{ display: 'inline-block', margin: '2px 2px 2px 0', padding: '1px 5px', background: '#f0fdf4', color: '#16a34a', border: '1px solid #16a34a', borderRadius: '8px', fontWeight: 700 }}>
                          {STAT_LABELS[k as StatKey]} {(v ?? 0) > 0 ? '+' : ''}{v}
                        </span>
                      ))}
                    </div>
                    {sub.startingSpell && <div style={{ fontSize: '11px', marginTop: '4px', color: '#7c3aed' }}>Sort de départ : {sub.startingSpell}</div>}
                    {sub.abilities.map((a, i) => <div key={i} style={{ fontSize: '11px', color: '#555', marginTop: '2px' }}>• {a}</div>)}
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      );

      // ── Step 3: Class ──
      case 3: return (
        <div>
          <SectionTitle>Choix de la classe</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '10px' }}>
            {CLASSES.map(c => (
              <Card key={c.id} selected={state.classe === c.id} onClick={() => set('classe', c.id)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                  <div style={{ fontWeight: 700, fontSize: '15px', color: state.classe === c.id ? '#c0392b' : '#1a1a1a' }}>{c.name}</div>
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    {c.dlc && <span style={{ fontSize: '9px', padding: '1px 5px', background: '#1a1a2e', color: '#c9a227', border: '1px solid #c9a227', borderRadius: '8px', fontWeight: 700, letterSpacing: '0.5px' }}>DLC</span>}
                    <div style={{ fontSize: '13px', color: '#d4a017' }}>{c.difficulty}</div>
                  </div>
                </div>
                <div style={{ fontSize: '11px', color: '#666', lineHeight: '1.4', marginBottom: '8px' }}>{c.description}</div>
                <div style={{ fontSize: '11px', color: '#555' }}>
                  <span style={{ fontWeight: 700 }}>Compétences : </span>{c.competences}
                </div>
                <div style={{ marginTop: '6px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {c.resource !== 'none' && (
                    <span style={{ fontSize: '10px', padding: '2px 7px', background: '#f5f0ff', color: '#7c3aed', border: '1px solid #7c3aed', borderRadius: '8px', fontWeight: 700 }}>
                      {c.resource === 'mana' ? `Mana +${c.startingResource}` : c.resource === 'divinite' ? `Divinité +${c.startingResource}` : c.resource === 'ki' ? 'Ki' : c.resource === 'necromancie' ? `Nécromancie +${c.startingResource}` : c.resource === 'vampirique' ? 'Pouvoirs vampiriques' : c.resource === 'melodieux' ? `Mélodieux +${c.startingResource}` : 'PV'}
                    </span>
                  )}
                  {c.deityRequired && (
                    <span style={{ fontSize: '10px', padding: '2px 7px', background: '#fffbeb', color: '#d4a017', border: '1px solid #d4a017', borderRadius: '8px', fontWeight: 700 }}>
                      Divinité {c.deityType === 'dark' ? 'sombre' : 'requise'}
                    </span>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Deity selector for Prêtre / Sorcier */}
          {cls?.deityRequired && (
            <div style={{ marginTop: '20px' }}>
              <div style={{ fontWeight: 700, marginBottom: '10px', fontSize: '15px' }}>
                Choix de {cls.deityType === 'dark' ? 'ton dieu sombre' : 'ta divinité'}
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {(cls.deityType === 'dark' ? DARK_DEITIES : ALL_DEITIES).map(d => (
                  <button key={d} onClick={() => set('deity', d)} style={{
                    padding: '6px 14px', border: B, borderRadius: '20px', cursor: 'pointer', fontSize: '13px',
                    fontWeight: state.deity === d ? 700 : 400, fontFamily: 'serif',
                    background: state.deity === d ? '#2c2416' : '#fff', color: state.deity === d ? '#f5e6c0' : '#333',
                  }}>{d}</button>
                ))}
              </div>
            </div>
          )}
        </div>
      );

      // ── Step 4: Level ──
      case 4: return (
        <div>
          <SectionTitle>Choix du niveau</SectionTitle>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
            {/* Level slider */}
            <div style={{ flex: 1, minWidth: '280px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: 700 }}>Niveau</span>
                <span style={{ fontWeight: 700, fontSize: '24px', color: '#c0392b' }}>{state.niveau}</span>
              </div>
              <input type="range" min={1} max={20} value={state.niveau} onChange={e => set('niveau', parseInt(e.target.value))}
                style={{ width: '100%', accentColor: '#c0392b', cursor: 'pointer' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#888' }}>
                <span>1</span><span>5</span><span>10</span><span>15</span><span>20</span>
              </div>
              {/* Level grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '4px', marginTop: '12px' }}>
                {Array.from({ length: 20 }, (_, i) => i + 1).map(l => (
                  <button key={l} onClick={() => set('niveau', l)} style={{
                    padding: '6px', border: B, borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: l === state.niveau ? 700 : 400,
                    background: l === state.niveau ? '#c0392b' : l <= state.niveau ? '#fff5f5' : '#fff', color: l === state.niveau ? '#fff' : '#333',
                  }}>{l}</button>
                ))}
              </div>
            </div>
            {/* Summary panel */}
            <div style={{ flex: 1, minWidth: '260px' }}>
              <Card style={{ background: '#f9f6f0' }}>
                <div style={{ fontWeight: 700, marginBottom: '10px', fontSize: '14px' }}>Résumé à niveau {state.niveau}</div>
                {cls && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>PV max estimés</span>
                      <strong style={{ color: '#c0392b' }}>{maxPV}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Armor Class</span>
                      <strong>{ac}</strong>
                    </div>
                    {cls.resource !== 'none' && (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{cls.resource === 'mana' ? 'Mana' : cls.resource === 'divinite' ? 'Divinité' : cls.resource === 'ki' ? 'Ki' : cls.resource === 'necromancie' ? 'Nécromancie' : cls.resource === 'vampirique' ? 'Charges vampiriques' : cls.resource === 'melodieux' ? 'Points mélodieux' : 'Ressource'}</span>
                        <strong style={{ color: '#7c3aed' }}>{resource}</strong>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Feats disponibles</span>
                      <strong style={{ color: '#d4a017' }}>{FEAT_LEVELS.filter(l => l <= state.niveau).length}</strong>
                    </div>
                  </div>
                )}
                {!cls && <div style={{ fontSize: '13px', color: '#888' }}>Choisis une classe à l'étape précédente.</div>}
              </Card>
              <div style={{ marginTop: '12px', fontSize: '12px', color: '#888' }}>
                Les feats sont disponibles aux niveaux : {FEAT_LEVELS.join(', ')}
              </div>
            </div>
          </div>

          {/* Note: Class specialization is now handled in Step 9 (ClassUpgradesStep) at level 3 */}
        </div>
      );

      // ── Step 5: Equipment ──
      case 5: return (() => {
        // ── Helpers ──────────────────────────────────────────────────────────
        const NON_PHYS = /miracle|mana \+|divinit[eé] \+|\d+ sort|sorts? niveau|sorts? au choix|sort :|sorts et miracles|points? (de )?n[eé]cromancie|charges? vampirique|survie vampirique|vision nocturne|vitesse \+|points? m[eé]lodieux|ki \+|arts martiaux|r[eé]flexes|combattant squelettique/i;
        const isPhys      = (s: string) => !NON_PHYS.test(s);
        const isArmChoice = (s: string) => / OU /i.test(s) && /(armure|robe)/i.test(s);

        // Does this class have an armor choice?
        const armorChoices: typeof ARMORS | null = (() => {
          if (cls?.id === 'pretre') return ARMORS.filter(a => a.id === 'pretre-robe' || a.id === 'pretre-fer');
          if (cls?.id === 'shaman') return [
            { id: 'shaman-robe', name: 'Robe shamanique', ca: 11, type: 'legere' as const, category: 'Shaman' },
            { id: 'shaman-armure', name: 'Armure shamanique', ca: 13, type: 'moyenne' as const, category: 'Shaman' },
          ];
          return null;
        })();

        // Physical fixed items (no magic/resource bonuses, no "choice" lines)
        const physicalItems = (cls?.startingEquipment ?? []).filter(
          e => isPhys(e) && !isArmChoice(e)
        );

        const selA = ARMORS.find(x => x.id === state.selectedArmor);

        return (
        <div>
          <SectionTitle>Équipement de départ</SectionTitle>
          {cls ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <div style={{ fontWeight: 700, marginBottom: '10px', fontSize: '14px' }}>Équipement inclus avec ta classe</div>
                {physicalItems.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', padding: '8px 12px', background: '#fff', border: B, borderRadius: '6px', marginBottom: '6px' }}>
                    <span style={{ color: '#c0392b', flexShrink: 0, marginTop: '2px' }}>▸</span>
                    <span style={{ fontSize: '13px' }}>{item}</span>
                  </div>
                ))}

                {/* ── Armor: choice dropdown OR fixed armor display ── */}
                {armorChoices ? (
                  <div style={{ marginTop: '14px' }}>
                    <label style={{ display: 'block', fontWeight: 700, marginBottom: '6px', fontSize: '13px' }}>
                      Armure au choix
                    </label>
                    <select
                      value={state.selectedArmor}
                      onChange={e => set('selectedArmor', e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', border: B, borderRadius: '6px', fontSize: '13px', fontFamily: 'serif', background: '#fff', cursor: 'pointer' }}
                    >
                      <option value="">— Choisir —</option>
                      {armorChoices.map(a => (
                        <option key={a.id} value={a.id}>
                          {a.name}{a.ca > 10 ? ` (CA ${a.ca}, AC+${a.ca - 10})` : ' (robes)'}
                        </option>
                      ))}
                    </select>
                    {selA && (
                      <div style={{ marginTop: '6px', padding: '7px 10px', background: selA.type === 'moyenne' ? '#fffbeb' : '#f9f9f9', border: `1px solid ${selA.type === 'moyenne' ? '#d4a017' : '#bbb'}`, borderRadius: '5px', fontSize: '12px', color: '#444' }}>
                        <strong>{selA.name}</strong> · CA {selA.ca} · {selA.type === 'robes' ? 'Robes' : selA.category}
                      </div>
                    )}
                  </div>
                ) : (
                  cls.startingArmor.type !== 'robes' && cls.startingArmor.type !== 'none' && (
                    <div style={{ marginTop: '14px', padding: '8px 12px', background: '#f9f9f9', border: B, borderRadius: '6px', fontSize: '12px', color: '#555' }}>
                      <span style={{ fontWeight: 700, fontSize: '13px', display: 'block', marginBottom: '2px' }}>Armure de classe (fixe)</span>
                      {cls.startingArmor.name} — CA {10 + cls.startingArmor.ac}
                    </div>
                  )
                )}
                {race && race.abilities.length > 0 && (
                  <>
                    <div style={{ fontWeight: 700, margin: '14px 0 8px', fontSize: '14px' }}>Bonus de race ({race.name}{subtype ? ` — ${subtype.name}` : ''})</div>
                    {race.abilities.map((a, i) => (
                      <div key={i} style={{ padding: '6px 12px', background: '#fffbeb', border: '1px solid #d4a017', borderRadius: '6px', fontSize: '13px', marginBottom: '4px' }}>• {a}</div>
                    ))}
                  </>
                )}
              </div>
              <div>
                <Card style={{ background: '#f9f6f0' }}>
                  <div style={{ fontWeight: 700, marginBottom: '10px', fontSize: '14px' }}>Statistiques finales</div>
                  {STATS.map(s => {
                    const val = finalStats[s];
                    const b = statBonus(val);
                    return (
                      <div key={s} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #eee', fontSize: '13px' }}>
                        <span>{STAT_LABELS[s]}</span>
                        <span><strong>{val}</strong> <span style={{ color: b >= 0 ? '#16a34a' : '#c0392b' }}>({b >= 0 ? '+' : ''}{b})</span></span>
                      </div>
                    );
                  })}
                  <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #ccc' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700 }}>
                      <span>PV max</span><span style={{ color: '#c0392b' }}>{maxPV}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, marginTop: '4px' }}>
                      <span>AC</span><span>{ac}</span>
                    </div>
                  </div>
                </Card>
                {cls.deityRequired && (
                  <div style={{ marginTop: '12px', padding: '10px', background: '#fffbeb', border: '1px solid #d4a017', borderRadius: '6px', fontSize: '13px' }}>
                    <strong>Divinité vénérée :</strong> {state.deity || '(non choisi)'}
                  </div>
                )}
                {state.specialization && (
                  <div style={{ marginTop: '8px', padding: '10px', background: '#f0f4ff', border: '1px solid #2c5fa5', borderRadius: '6px', fontSize: '13px' }}>
                    <strong>Spécialisation :</strong> {state.specialization}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ color: '#888' }}>Aucune classe sélectionnée.</div>
          )}
        </div>
        );
      })();

      // ── Step 6: Weapons ──
      case 6: return (() => {
        const cls = CLASSES.find(c => c.id === state.classe);
        if (!cls) return <div style={{ color: '#888' }}>Sélectionne une classe d'abord</div>;

        // Guerrier: Can choose 1 two-hand OR 2 one-hand OR 1 + shield
        if (cls.id === 'guerrier') {
          return (
            <div>
              <SectionTitle>Choix d'armes</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Option A: Two-hand weapon */}
                <div style={{ padding: '14px', border: state.weaponChoiceMode === 'one-two-hand' ? '2px solid #c0392b' : '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', background: state.weaponChoiceMode === 'one-two-hand' ? '#fff5f5' : '#fff' }} onClick={() => setState(p => ({ ...p, weaponChoiceMode: 'one-two-hand', selectedSecondWeapon: '' }))}>
                  <div style={{ fontWeight: 700, marginBottom: '8px', fontSize: '13px', color: state.weaponChoiceMode === 'one-two-hand' ? '#c0392b' : '#1a1a1a' }}>
                    ⚔️ Une arme à deux mains
                  </div>
                  <div style={{ fontSize: '11px', color: '#666', marginBottom: '10px' }}>
                    Puissance maximale avec une épée à deux mains, une grande hache ou un maillet.
                  </div>
                  {state.weaponChoiceMode === 'one-two-hand' && (
                    <select value={state.selectedWeapon} onChange={e => setState(p => ({ ...p, selectedWeapon: e.target.value }))} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #bbb', fontSize: '12px' }}>
                      <option value="">— Choisir une arme —</option>
                      {WEAPONS.filter(w => w.hand === 'two' && w.category.includes('mêlée')).map(w => (
                        <option key={w.id} value={w.id}>{w.name} — {w.dmg} ({w.props})</option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Option B: Dual-wield */}
                <div style={{ padding: '14px', border: state.weaponChoiceMode === 'dual-wield' ? '2px solid #c0392b' : '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', background: state.weaponChoiceMode === 'dual-wield' ? '#fff5f5' : '#fff' }} onClick={() => setState(p => ({ ...p, weaponChoiceMode: 'dual-wield' }))}>
                  <div style={{ fontWeight: 700, marginBottom: '8px', fontSize: '13px', color: state.weaponChoiceMode === 'dual-wield' ? '#c0392b' : '#1a1a1a' }}>
                    ⚔️⚔️ Deux armes à une main
                  </div>
                  <div style={{ fontSize: '11px', color: '#666', marginBottom: '10px' }}>
                    Double attaque rapide avec deux épées courtes, deux haches ou une hache et une épée.
                  </div>
                  {state.weaponChoiceMode === 'dual-wield' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ fontSize: '10px', fontWeight: 600, marginBottom: '4px', display: 'block' }}>Arme principale</label>
                        <select value={state.selectedWeapon} onChange={e => setState(p => ({ ...p, selectedWeapon: e.target.value }))} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #bbb', fontSize: '11px' }}>
                          <option value="">— Choisir —</option>
                          {WEAPONS.filter(w => w.hand === 'one' && w.category.includes('mêlée')).map(w => (
                            <option key={w.id} value={w.id}>{w.name} — {w.dmg} ({w.props})</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: '10px', fontWeight: 600, marginBottom: '4px', display: 'block' }}>Arme secondaire</label>
                        <select value={state.selectedSecondWeapon || ''} onChange={e => setState(p => ({ ...p, selectedSecondWeapon: e.target.value }))} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #bbb', fontSize: '11px' }}>
                          <option value="">— Choisir —</option>
                          {WEAPONS.filter(w => w.hand === 'one' && w.category.includes('mêlée')).map(w => (
                            <option key={w.id} value={w.id}>{w.name} — {w.dmg} ({w.props})</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* Option C: Weapon + Shield */}
                <div style={{ padding: '14px', border: state.weaponChoiceMode === 'single' ? '2px solid #c0392b' : '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', background: state.weaponChoiceMode === 'single' ? '#fff5f5' : '#fff' }} onClick={() => setState(p => ({ ...p, weaponChoiceMode: 'single', selectedSecondWeapon: '' }))}>
                  <div style={{ fontWeight: 700, marginBottom: '8px', fontSize: '13px', color: state.weaponChoiceMode === 'single' ? '#c0392b' : '#1a1a1a' }}>
                    🛡️ Une arme + Bouclier
                  </div>
                  <div style={{ fontSize: '11px', color: '#666', marginBottom: '10px' }}>
                    Équilibre parfait: défense renforcée (AC+2) avec une arme pour les dégâts.
                  </div>
                  {state.weaponChoiceMode === 'single' && (
                    <select value={state.selectedWeapon} onChange={e => setState(p => ({ ...p, selectedWeapon: e.target.value }))} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #bbb', fontSize: '12px' }}>
                      <option value="">— Choisir une arme —</option>
                      {WEAPONS.filter(w => (w.hand === 'one' || w.hand === 'two') && w.category.includes('mêlée')).map(w => (
                        <option key={w.id} value={w.id}>{w.name} — {w.dmg} ({w.props})</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            </div>
          );
        }

        // Default for other classes: simple weapon selection
        return (
          <div>
            <SectionTitle>Choix d'arme</SectionTitle>
            <div style={{ color: '#888', fontSize: '13px' }}>Ta classe a un équipement d'arme par défaut.</div>
          </div>
        );
      })();

      // ── Step 7: Feats ──
      case 7: return (
        <div>
          <SectionTitle>Feats</SectionTitle>
          {featCount === 0 ? (
            <div style={{ padding: '24px', background: '#f5f5f5', border: B, borderRadius: '8px', textAlign: 'center', color: '#888', fontSize: '14px' }}>
              Aucun feat disponible au niveau {state.niveau}.<br />
              <span style={{ fontSize: '12px' }}>Les feats sont accordés aux niveaux : {FEAT_LEVELS.join(', ')}</span>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ padding: '8px 16px', background: state.selectedFeats.length === featCount ? '#f0fdf4' : '#fff5f5', border: `2px solid ${state.selectedFeats.length === featCount ? '#16a34a' : '#c0392b'}`, borderRadius: '8px', fontWeight: 700, fontSize: '14px', color: state.selectedFeats.length === featCount ? '#16a34a' : '#c0392b' }}>
                  {state.selectedFeats.length} / {featCount} feats choisis
                </div>
                <div style={{ fontSize: '12px', color: '#888' }}>Niveaux accordant des feats atteints : {FEAT_LEVELS.filter(l => l <= state.niveau).join(', ')}</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '8px' }}>
                {FEATS.map(feat => {
                  const isSelected = state.selectedFeats.includes(feat.id);
                  const hasPrereq = feat.requires ? !canSelectFeat(feat.id, state.selectedFeats) : false;
                  const meetsRestriction = meetsClassRestriction(feat.restriction);
                  const slotAvailable = state.selectedFeats.length < featCount;
                  const canSelect = isSelected || (slotAvailable && !hasPrereq && meetsRestriction);
                  return (
                    <div key={feat.id} onClick={() => canSelect && toggleFeat(feat.id)} style={{
                      border: isSelected ? '2px solid #c0392b' : !meetsRestriction ? '1px solid #d4a017' : hasPrereq ? '1px solid #f97316' : '1px solid #ccc',
                      borderRadius: '6px', background: isSelected ? '#fff5f5' : !meetsRestriction ? '#fffbeb' : hasPrereq ? '#fff7ed' : canSelect ? '#fff' : '#f9f9f9',
                      padding: '10px 12px', cursor: canSelect ? 'pointer' : 'not-allowed', opacity: !canSelect ? 0.6 : 1,
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ fontWeight: 700, fontSize: '13px', color: isSelected ? '#c0392b' : !meetsRestriction ? '#d4a017' : hasPrereq ? '#f97316' : '#1a1a1a' }}>{feat.name}</div>
                        <span style={{ fontSize: '9px', background: isSelected ? '#c0392b' : !meetsRestriction ? '#d4a017' : hasPrereq ? '#f97316' : '#888', color: '#fff', borderRadius: '8px', padding: '1px 6px', flexShrink: 0, marginLeft: '4px' }}>{feat.category}</span>
                      </div>
                      {feat.restriction && <div style={{ fontSize: '10px', color: !meetsRestriction ? '#d4a017' : '#888', fontStyle: 'italic', fontWeight: !meetsRestriction ? 600 : 400 }}>{feat.restriction}</div>}
                      {!meetsRestriction && <div style={{ fontSize: '11px', color: '#d4a017', fontWeight: 600, marginTop: '4px' }}>🔒 Réservé aux: {feat.restriction}</div>}
                      {hasPrereq && <div style={{ fontSize: '11px', color: '#f97316', fontWeight: 600, marginTop: '4px' }}>🔒 Requires: {feat.requires}</div>}
                      <div style={{ fontSize: '11px', color: '#555', marginTop: '4px', lineHeight: '1.3' }}>{feat.description}</div>
                      <div style={{ marginTop: '4px' }}>
                        {feat.effects.map((e, i) => <div key={i} style={{ fontSize: '11px', color: '#222' }}>▸ {e}</div>)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      );

      // ── Step 8: Spells & Miracles ──
      case 8: return (
        <div>
          <SectionTitle>Sorts, Miracles & Pouvoirs</SectionTitle>
          {!hasSpells && !hasMiracles && !hasVampPowers ? (
            <div style={{ padding: '24px', background: '#f5f5f5', border: B, borderRadius: '8px', textAlign: 'center', color: '#888', fontSize: '14px' }}>
              Ta classe ({cls?.name || '—'}) n'utilise pas de sorts, miracles ou pouvoirs spéciaux.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {hasSpells && (
                <div>
                  <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '10px', color: '#7c3aed' }}>
                    ✦ Sorts ({state.selectedSpells.length} sélectionnés)
                  </div>
                  {['Niveau 1', 'Niveau 2', 'Niveau 3'].map(lv => {
                    const spells = SORTS.filter(s => s.subcategory === lv);
                    return (
                      <div key={lv} style={{ marginBottom: '12px' }}>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#7c3aed', marginBottom: '6px', textTransform: 'uppercase', borderBottom: '1px solid #e9d5ff', paddingBottom: '4px' }}>{lv}</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '6px' }}>
                          {spells.map(s => {
                            const sel = state.selectedSpells.includes(s.id);
                            return (
                              <div key={s.id} onClick={() => toggleSpell(s.id)} style={{
                                padding: '8px 10px', border: sel ? '2px solid #7c3aed' : '1px solid #ddd', borderRadius: '6px',
                                background: sel ? '#f5f0ff' : '#fff', cursor: 'pointer', fontSize: '12px',
                                transition: 'border-color 0.1s',
                              }}>
                                <div style={{ fontWeight: 700, color: sel ? '#7c3aed' : '#1a1a1a' }}>{s.name}</div>
                                <div style={{ color: '#666', fontSize: '10px', marginTop: '1px' }}>{s.action}{s.neverMisses ? ' · Ne rate jamais' : ''}</div>
                                <div style={{ color: '#444', fontSize: '11px', lineHeight: '1.5', marginTop: '5px', padding: '5px 8px', background: sel ? '#ede9fe' : '#f9f9f9', borderRadius: '4px', borderLeft: '2px solid #7c3aed' }}>
                                  {s.description}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {hasMiracles && (() => {
                const baseLimit = getMiracleLimit(state.classe, state.niveau);
                
                // If class has no miracle slots but feat grants them, allow 1 deity slot
                const deitySlots = baseLimit.deitySlots && Object.keys(baseLimit.deitySlots).length > 0
                  ? baseLimit.deitySlots
                  : (hasFeatGrantingMiraclesFor(state.selectedFeats) ? { 1: 1 } : {});
                
                const freeSlots = baseLimit.freeSlots && Object.keys(baseLimit.freeSlots).length > 0
                  ? baseLimit.freeSlots
                  : {};
                
                const { maxLevel: baseMiracleMaxLvl, forcedDeity, strictByLevel } = baseLimit;
                // If feat grants miracles but class doesn't have them, allow level 1
                const miracleMaxLvl = (baseLimit.maxLevel === 0 && hasFeatGrantingMiraclesFor(state.selectedFeats)) ? 1 : baseMiracleMaxLvl;
                const deityName = forcedDeity ?? state.deity;
                const LVL_MAP: Record<string, number> = { 'Niveau 1': 1, 'Niveau 2': 2, 'Niveau 3': 3, 'Suprême': 4, 'Ultime': 5 };
                const deityTot = slotTotal(deitySlots);
                const freeTot = slotTotal(freeSlots);
                const totalAll = deityTot + freeTot;

                // Per-level counter for selected miracles
                const countByLevel = (selected: string[]) =>
                  selected.reduce((acc, id) => {
                    const m = MIRACLES.find(x => x.id === id);
                    const lvl = LVL_MAP[m?.subcategory ?? ''] ?? 1;
                    acc[lvl] = (acc[lvl] ?? 0) + 1;
                    return acc;
                  }, {} as Record<number, number>);

                // Render slot badges for a section
                const SlotBadges = ({ slots, selected }: { slots: Record<number, number>; selected: string[] }) => {
                  const counts = countByLevel(selected);
                  const levels = Object.keys(slots).map(Number).sort();
                  if (!strictByLevel) {
                    const total = slotTotal(slots);
                    const used = selected.length;
                    const full = used >= total;
                    return (
                      <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 700,
                        background: full ? '#f0fdf4' : '#fffbeb', color: full ? '#16a34a' : '#7c5a00',
                        border: `1px solid ${full ? '#16a34a' : '#d4a017'}` }}>
                        {used} / {total} (max {miracleLevelLabel(miracleMaxLvl)})
                      </span>
                    );
                  }
                  return (
                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                      {levels.map(lvl => {
                        const max = slots[lvl];
                        const used = counts[lvl] ?? 0;
                        const full = used >= max;
                        return (
                          <span key={lvl} style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 700,
                            background: full ? '#f0fdf4' : '#fffbeb', color: full ? '#16a34a' : '#7c5a00',
                            border: `1px solid ${full ? '#16a34a' : '#d4a017'}` }}>
                            {miracleLevelLabel(lvl)}: {used}/{max}
                          </span>
                        );
                      })}
                    </div>
                  );
                };

                // Miracle card component
                const MCard = ({ m, sel, locked, onToggle, accentColor }: {
                  m: typeof MIRACLES[0]; sel: boolean; locked: boolean; onToggle: () => void; accentColor: string;
                }) => (
                  <div onClick={() => !locked && onToggle()} style={{
                    padding: '8px 10px', border: sel ? `2px solid ${accentColor}` : '1px solid #ddd', borderRadius: '6px',
                    background: sel ? '#fffbeb' : locked ? '#f5f5f5' : '#fff',
                    cursor: locked ? 'not-allowed' : 'pointer', fontSize: '12px', opacity: locked ? 0.5 : 1,
                    transition: 'border-color 0.1s',
                  }}>
                    <div style={{ marginBottom: '5px' }}>
                      <span style={{ fontWeight: 700, color: sel ? '#7c5a00' : '#1a1a1a' }}>{m.name}</span>
                      <span style={{ marginLeft: '6px', fontSize: '9px', background: sel ? accentColor : '#eee', color: sel ? '#fff' : '#666', borderRadius: '8px', padding: '1px 5px' }}>{m.subcategory}</span>
                    </div>
                    <div style={{ color: '#333', fontSize: '11px', lineHeight: '1.5', padding: '5px 8px', background: sel ? '#fef9c3' : '#f9f9f9', borderRadius: '4px', borderLeft: `2px solid ${accentColor}` }}>
                      {m.description}
                      {m.cost && <div style={{ marginTop: '4px', fontWeight: 700, color: accentColor }}>Coût : {m.cost}</div>}
                    </div>
                  </div>
                );

                // Group miracles by level for a given deity list
                const MiraclesByLevel = ({ deities, selected, slots, onToggle, accentColor }: {
                  deities: string[]; selected: string[]; slots: Record<number, number>; onToggle: (id: string) => void; accentColor: string;
                }) => {
                  const levels = strictByLevel
                    ? Object.keys(slots).map(Number).sort()
                    : Array.from({ length: miracleMaxLvl }, (_, i) => i + 1);
                  return (
                    <>
                      {levels.map(lvl => {
                        const lvlLabel = miracleLevelLabel(lvl);
                        const miracles = MIRACLES.filter(m =>
                          deities.includes(m.category) && (LVL_MAP[m.subcategory] ?? 1) === lvl
                        );
                        if (miracles.length === 0) return null;
                        const maxAtLevel = strictByLevel ? (slots[lvl] ?? 0) : slotTotal(slots);
                        const usedAtLevel = strictByLevel
                          ? countByLevel(selected)[lvl] ?? 0
                          : selected.length;
                        return (
                          <div key={lvl} style={{ marginBottom: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                              <span style={{ fontSize: '11px', fontWeight: 700, color: accentColor, textTransform: 'uppercase' }}>{lvlLabel}</span>
                              {strictByLevel && (
                                <span style={{ fontSize: '10px', fontWeight: 700, padding: '1px 7px', borderRadius: '10px',
                                  background: usedAtLevel >= maxAtLevel ? '#f0fdf4' : '#f9f9f9',
                                  color: usedAtLevel >= maxAtLevel ? '#16a34a' : '#888',
                                  border: `1px solid ${usedAtLevel >= maxAtLevel ? '#16a34a' : '#ddd'}` }}>
                                  {usedAtLevel}/{maxAtLevel}
                                </span>
                              )}
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '5px' }}>
                              {miracles.map(m => {
                                const sel = selected.includes(m.id);
                                const locked = isMiracleLocked(m.id, selected, slots, strictByLevel);
                                return <MCard key={m.id} m={m} sel={sel} locked={locked} onToggle={() => onToggle(m.id)} accentColor={accentColor} />;
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </>
                  );
                };

                return (
                  <div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '14px' }}>
                      <div style={{ fontWeight: 700, fontSize: '15px', color: '#d4a017' }}>✦ Miracles</div>
                      <div style={{ fontSize: '11px', color: '#888' }}>Niveau max accessible : <strong>{miracleLevelLabel(miracleMaxLvl) || 'Aucun'}</strong></div>
                    </div>

                    {totalAll === 0 ? (
                      <div style={{ padding: '12px 16px', background: '#f5f5f5', border: '1px solid #ccc', borderRadius: '6px', fontSize: '13px', color: '#888' }}>
                        Aucun miracle disponible à ce niveau.
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        {/* ── Section 1 : Miracles de ta divinité ── */}
                        {deityTot > 0 && (
                          <div style={{ border: '2px solid #d4a017', borderRadius: '8px', padding: '14px', background: '#fffdf5' }}>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '12px' }}>
                              <span style={{ fontWeight: 700, fontSize: '13px', color: '#7c5a00' }}>
                                Miracles de {deityName || 'ta divinité'}
                              </span>
                              <SlotBadges slots={deitySlots} selected={state.selectedDeityMiracles} />
                              {deityName && <span style={{ fontSize: '10px', color: '#888', fontStyle: 'italic' }}>Uniquement {deityName}</span>}
                            </div>
                            {(deityName ? [deityName] : ALL_DEITIES).map(d => {
                              const deityMiracles = MIRACLES.filter(m => m.category === d && (LVL_MAP[m.subcategory] ?? 1) <= miracleMaxLvl);
                              if (deityMiracles.length === 0) return null;
                              return (
                                <div key={d}>
                                  {!forcedDeity && <div style={{ fontSize: '11px', fontWeight: 700, color: '#888', marginBottom: '6px', borderBottom: '1px solid #f0e0a0', paddingBottom: '3px' }}>{d}</div>}
                                  <MiraclesByLevel
                                    deities={[d]}
                                    selected={state.selectedDeityMiracles}
                                    slots={deitySlots}
                                    onToggle={toggleDeityMiracle}
                                    accentColor="#d4a017"
                                  />
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* ── Section 2 : Miracles libres ── */}
                        {freeTot > 0 && (
                          <div style={{ border: '2px solid #7c3aed', borderRadius: '8px', padding: '14px', background: '#fdf9ff' }}>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '12px' }}>
                              <span style={{ fontWeight: 700, fontSize: '13px', color: '#5b21b6' }}>Miracles libres — toutes divinités</span>
                              <SlotBadges slots={freeSlots} selected={state.selectedFreeMiracles} />
                              <span style={{ fontSize: '10px', color: '#888', fontStyle: 'italic' }}>Toute divinité</span>
                            </div>
                            {ALL_DEITIES.filter(d => !deityName || d !== deityName).map(d => {
                              const hasMir = MIRACLES.some(m => m.category === d && (LVL_MAP[m.subcategory] ?? 1) <= miracleMaxLvl);
                              if (!hasMir) return null;
                              return (
                                <div key={d} style={{ marginBottom: '12px' }}>
                                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#888', marginBottom: '6px', borderBottom: '1px solid #ede9fe', paddingBottom: '3px' }}>
                                    {d}
                                  </div>
                                  <MiraclesByLevel
                                    deities={[d]}
                                    selected={state.selectedFreeMiracles}
                                    slots={freeSlots}
                                    onToggle={toggleFreeMiracle}
                                    accentColor="#7c3aed"
                                  />
                                </div>
                              );
                            })}
                          </div>
                        )}

                      </div>
                    )}
                  </div>
                );
              })()}
              {hasVampPowers && (
                <div>
                  <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '10px', color: '#991b1b' }}>
                    ✦ Pouvoirs vampiriques ({state.selectedVampPowers.length} sélectionnés)
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '6px' }}>
                    {VAMPIRIQUE.map(v => {
                      const sel = state.selectedVampPowers.includes(v.id);
                      return (
                        <div key={v.id} onClick={() => toggleVamp(v.id)} style={{
                          padding: '8px 10px', border: sel ? '2px solid #991b1b' : '1px solid #ddd', borderRadius: '6px',
                          background: sel ? '#fff1f0' : '#fff', cursor: 'pointer', fontSize: '12px',
                        }}>
                          <div style={{ marginBottom: '5px' }}>
                            <span style={{ fontWeight: 700, color: sel ? '#7a1a10' : '#1a1a1a' }}>{v.name}</span>
                            <span style={{ marginLeft: '6px', fontSize: '9px', color: '#888' }}>{v.subcategory}</span>
                            {v.cost && <span style={{ marginLeft: '6px', fontSize: '10px', color: '#991b1b', fontWeight: 700 }}>{v.cost}</span>}
                          </div>
                          <div style={{ color: '#333', fontSize: '11px', lineHeight: '1.5', padding: '5px 8px', background: sel ? '#ffeae9' : '#f9f9f9', borderRadius: '4px', borderLeft: '2px solid #991b1b' }}>
                            {v.description}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      );

      // ── Step 9: Class Upgrades ──
      case 9: return (
        <ClassUpgradesStep
          classe={CLASSES.find(c => c.id === state.classe) || null}
          niveau={state.niveau}
          classUpgrades={state.classUpgrades}
          onUpgradeChange={(key: string, value: string | boolean) => {
            setState(p => ({
              ...p,
              classUpgrades: {
                ...p.classUpgrades,
                [key]: value
              }
            }));
          }}
        />
      );

      // ── Step 10: Summary ──
      case 10: return (
        <div>
          <SectionTitle>Résumé du personnage</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Left column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Card style={{ background: '#2c2416', color: '#f5e6c0' }}>
                <div style={{ fontSize: '22px', fontWeight: 700, marginBottom: '4px' }}>{state.nom || '(sans nom)'}</div>
                <div style={{ fontSize: '14px', opacity: 0.8 }}>{cls?.name || '—'} — Niveau {state.niveau}</div>
                {race && <div style={{ fontSize: '13px', opacity: 0.7 }}>{race.name}{subtype ? ` (${subtype.name})` : ''}</div>}
                {state.deity && <div style={{ fontSize: '12px', opacity: 0.6 }}>Divinité : {state.deity}</div>}
                {state.specialization && <div style={{ fontSize: '12px', opacity: 0.6 }}>Spécialisation : {state.specialization}</div>}
              </Card>
              <Card>
                <div style={{ fontWeight: 700, marginBottom: '8px', fontSize: '14px' }}>Combat</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {[['PV max', maxPV, '#c0392b'], ['Armor Class', ac, '#2c5fa5']].map(([l, v, c]) => (
                    <div key={String(l)} style={{ textAlign: 'center', padding: '10px', background: '#f9f6f0', borderRadius: '6px' }}>
                      <div style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase' }}>{l}</div>
                      <div style={{ fontSize: '24px', fontWeight: 700, color: String(c) }}>{v}</div>
                    </div>
                  ))}
                  {cls && cls.resource !== 'none' && (
                    <div style={{ textAlign: 'center', padding: '10px', background: '#f5f0ff', borderRadius: '6px' }}>
                      <div style={{ fontSize: '10px', color: '#7c3aed', textTransform: 'uppercase' }}>
                        {cls.resource === 'mana' ? 'Mana' : cls.resource === 'divinite' ? 'Divinité' : cls.resource === 'ki' ? 'Ki' : cls.resource === 'necromancie' ? 'Nécromancie' : cls.resource === 'vampirique' ? 'V. Vampiriques' : cls.resource === 'melodieux' ? 'Mélodieux' : 'Res.'}
                      </div>
                      <div style={{ fontSize: '24px', fontWeight: 700, color: '#7c3aed' }}>{resource}</div>
                    </div>
                  )}
                </div>
              </Card>
              <Card>
                <div style={{ fontWeight: 700, marginBottom: '8px', fontSize: '14px' }}>Statistiques</div>
                {STATS.map(s => {
                  const val = finalStats[s];
                  const b = statBonus(val);
                  return (
                    <div key={s} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #eee', fontSize: '13px' }}>
                      <span>{STAT_LABELS[s]}</span>
                      <span><strong>{val}</strong> <span style={{ color: b >= 0 ? '#16a34a' : '#c0392b', fontSize: '12px' }}>({b >= 0 ? '+' : ''}{b})</span></span>
                    </div>
                  );
                })}
              </Card>
            </div>
            {/* Right column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {state.selectedFeats.length > 0 && (
                <Card>
                  <div style={{ fontWeight: 700, marginBottom: '8px', fontSize: '14px', color: '#d4a017' }}>Feats ({state.selectedFeats.length})</div>
                  {state.selectedFeats.map(id => {
                    const feat = FEATS.find(f => f.id === id);
                    return feat ? <div key={id} style={{ fontSize: '12px', padding: '4px 0', borderBottom: '1px solid #eee' }}>• {feat.name}</div> : null;
                  })}
                </Card>
              )}
              {state.selectedSpells.length > 0 && (
                <Card>
                  <div style={{ fontWeight: 700, marginBottom: '8px', fontSize: '14px', color: '#7c3aed' }}>Sorts ({state.selectedSpells.length})</div>
                  {state.selectedSpells.map(id => {
                    const spell = SORTS.find(s => s.id === id);
                    return spell ? <div key={id} style={{ fontSize: '12px', padding: '3px 0', borderBottom: '1px solid #eee' }}>• {spell.name} <span style={{ color: '#888', fontSize: '10px' }}>({spell.subcategory})</span></div> : null;
                  })}
                </Card>
              )}
              {(state.selectedDeityMiracles.length > 0 || state.selectedFreeMiracles.length > 0) && (
                <Card>
                  <div style={{ fontWeight: 700, marginBottom: '8px', fontSize: '14px', color: '#d4a017' }}>
                    Miracles ({state.selectedDeityMiracles.length + state.selectedFreeMiracles.length})
                  </div>
                  {state.selectedDeityMiracles.length > 0 && (
                    <div style={{ marginBottom: '6px' }}>
                      <div style={{ fontSize: '10px', color: '#888', marginBottom: '3px', fontWeight: 700, textTransform: 'uppercase' }}>Divinité</div>
                      {state.selectedDeityMiracles.map(id => {
                        const m = MIRACLES.find(m => m.id === id);
                        return m ? <div key={id} style={{ fontSize: '12px', padding: '2px 0', borderBottom: '1px solid #f5f5f5' }}>• {m.name} <span style={{ color: '#888', fontSize: '10px' }}>({m.category})</span></div> : null;
                      })}
                    </div>
                  )}
                  {state.selectedFreeMiracles.length > 0 && (
                    <div>
                      <div style={{ fontSize: '10px', color: '#7c3aed', marginBottom: '3px', fontWeight: 700, textTransform: 'uppercase' }}>Libres</div>
                      {state.selectedFreeMiracles.map(id => {
                        const m = MIRACLES.find(m => m.id === id);
                        return m ? <div key={id} style={{ fontSize: '12px', padding: '2px 0', borderBottom: '1px solid #f5f5f5' }}>• {m.name} <span style={{ color: '#888', fontSize: '10px' }}>({m.category})</span></div> : null;
                      })}
                    </div>
                  )}
                </Card>
              )}
              {state.selectedVampPowers.length > 0 && (
                <Card>
                  <div style={{ fontWeight: 700, marginBottom: '8px', fontSize: '14px', color: '#991b1b' }}>Pouvoirs vampiriques ({state.selectedVampPowers.length})</div>
                  {state.selectedVampPowers.map(id => {
                    const v = VAMPIRIQUE.find(v => v.id === id);
                    return v ? <div key={id} style={{ fontSize: '12px', padding: '3px 0', borderBottom: '1px solid #eee' }}>• {v.name}</div> : null;
                  })}
                </Card>
              )}
              <Card style={{ background: '#f0fdf4', border: '2px solid #16a34a' }}>
                <div style={{ fontWeight: 700, marginBottom: '8px', fontSize: '14px', color: '#14532d' }}>
                  Prêt à remplir la fiche !
                </div>
                <div style={{ fontSize: '12px', color: '#444', lineHeight: '1.5' }}>
                  Clique sur <strong>"Remplir la fiche"</strong> pour transférer toutes ces données automatiquement dans ta fiche de personnage.<br /><br />
                  Tu pourras ensuite modifier les détails manuellement dans l'onglet <em>Fiche de personnage</em>.
                </div>
              </Card>
            </div>
          </div>
        </div>
      );

      default: return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#e8e4dc', fontFamily: 'serif' }}>
      {/* Progress bar */}
      <div style={{ background: '#2c2416', padding: '12px 20px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', gap: '0', justifyContent: 'space-between' }}>
          {STEP_LABELS.map((s, i) => {
            const Icon = s.icon;
            const active = i === state.step;
            const done = i < state.step;
            return (
              <div key={i} onClick={() => i < state.step && setState(p => ({ ...p, step: i }))}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flex: 1, cursor: i < state.step ? 'pointer' : 'default', opacity: active ? 1 : done ? 0.85 : 0.45 }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: active ? '#c0392b' : done ? '#16a34a' : '#555', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  {done ? <Check size={14} color="#fff" /> : <Icon size={14} color="#fff" />}
                </div>
                <div style={{ fontSize: '9px', color: active ? '#f5e6c0' : done ? '#88cc88' : '#888', textAlign: 'center', maxWidth: '60px' }}>{s.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px 16px 120px 16px' }}>
        <div style={{ background: '#fff', border: B, borderRadius: '8px', padding: '24px', minHeight: '400px', boxShadow: '0 2px 20px rgba(0,0,0,0.1)' }}>
          {renderStep()}
        </div>
      </div>

      {/* Fixed Navigation */}
      <div style={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        background: '#e8e4dc', 
        borderTop: '1px solid #ccc',
        padding: '16px 20px',
        display: 'flex',
        justifyContent: 'center',
        zIndex: 100,
        boxShadow: '0 -2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{ maxWidth: '1000px', width: '100%', display: 'flex', justifyContent: 'space-between' }}>
          <button onClick={() => go(-1)} disabled={state.step === 0}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px', border: B, borderRadius: '6px', background: '#fff', cursor: state.step === 0 ? 'not-allowed' : 'pointer', opacity: state.step === 0 ? 0.4 : 1, fontFamily: 'serif', fontSize: '14px' }}>
            <ChevronLeft size={16} /> Précédent
          </button>

          {state.step < STEP_LABELS.length - 1 ? (
            <button onClick={() => canProceed() && go(1)} disabled={!canProceed()}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 24px', border: 'none', borderRadius: '6px', background: canProceed() ? '#c0392b' : '#ccc', color: '#fff', cursor: canProceed() ? 'pointer' : 'not-allowed', fontFamily: 'serif', fontSize: '14px', fontWeight: 700 }}>
              Suivant <ChevronRight size={16} />
            </button>
          ) : (
            <button onClick={finish}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '12px 28px', border: 'none', borderRadius: '6px', background: '#16a34a', color: '#fff', cursor: 'pointer', fontFamily: 'serif', fontSize: '15px', fontWeight: 700 }}>
              <Check size={18} /> Remplir la fiche automatiquement
            </button>
          )}
        </div>
      </div>
    </div>
  );
}