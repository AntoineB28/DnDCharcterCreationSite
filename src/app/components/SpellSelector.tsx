import { useState, useRef } from 'react';
import { Download, Search, X, CheckSquare, Square } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

// ─────────────────────────── TYPES ───────────────────────────
export interface Spell {
  id: string;
  name: string;
  category: string; // deity name or "Sorts" or "Vampirique"
  subcategory: string; // level or "Base" / "Avancé"
  action: string;
  neverMisses?: boolean;
  ultimate?: boolean; // Mark as ultimate spell (usable 1x/combat bonus action)
  description: string;
  cost?: string;
}

// ─────────────────────────── SORTS ───────────────────────────
export const SORTS: Spell[] = [
  // Niveau 1
  { id: 's-orbe-sombre', name: 'Orbe sombre', category: 'Sorts', subcategory: 'Niveau 1', action: 'Action', neverMisses: true, description: 'Une boule de ténèbres tourbillonnante nécrose la chair de la cible. 2d8 dégâts nécrotiques.' },
  { id: 's-souffle-acide', name: 'Souffle acide', category: 'Sorts', subcategory: 'Niveau 1', action: 'Action', description: 'Un nuage acide fait fondre les muqueuses de la cible. 2d10 dégâts acides.' },
  { id: 's-boule-feu', name: 'Boule de feu', category: 'Sorts', subcategory: 'Niveau 1', action: 'Action', description: 'Une petite boule de feu projetée sur la cible. 3d6 dégâts brûlants.' },
  { id: 's-decharge-electrique', name: 'Décharge électrique', category: 'Sorts', subcategory: 'Niveau 1', action: 'Action', description: 'Deux rayons électriques frappent la cible. 2d8 dégâts électriques. Saving throw résistance (12) ou sonnée.' },
  { id: 's-missiles-arcane', name: "Missiles d'arcane", category: 'Sorts', subcategory: 'Niveau 1', action: 'Action', description: 'Trois rayons arcaniques frappent chacun une cible au choix. 1d4 dégâts magiques par rayon. Attack roll distinct par rayon.' },
  { id: 's-peau-pierre', name: 'Peau de pierre', category: 'Sorts', subcategory: 'Niveau 1', action: 'Réaction', description: 'Utilisé en réaction à une attaque qui touche, avant les dégâts. La peau devient dure comme la pierre. Réduit les dégâts de 1d8.' },
  { id: 's-pique-glace', name: 'Pique de glace', category: 'Sorts', subcategory: 'Niveau 1', action: 'Action', description: 'Une pique de glace magique perce les défenses. La cible a 1 AC de moins contre cette attaque. 2d8 dégâts de froid.' },
  { id: 's-taillade-vent', name: 'Taillade de vent', category: 'Sorts', subcategory: 'Niveau 1', action: 'Action', description: 'Un trait solide fait de vent tranche la cible. Coup critique sur 18 et moins. 2d8 dégâts tranchants.' },
  { id: 's-enchantement-simple', name: 'Enchantement simple', category: 'Sorts', subcategory: 'Niveau 1', action: 'Action bonus', neverMisses: true, description: 'Imbue une arme (sienne ou alliée). La prochaine attaque avec cette arme fait 1d8 dégâts magiques de plus.' },
  { id: 's-clignement', name: 'Clignement', category: 'Sorts', subcategory: 'Niveau 1', action: 'Action bonus', neverMisses: true, description: "Téléporte une personne ou un objet jusqu'à 100 mètres. Si une personne voyage ainsi : saving throw constitution (8) ou 1d4 dégâts psychiques." },
  { id: 's-telekinesie', name: 'Télékinésie', category: 'Sorts', subcategory: 'Niveau 1', action: 'Action', neverMisses: true, description: "Attire ou pousse un objet. Si quelqu'un le tient : saving throw de force (12) pour le conserver." },
  { id: 's-armure-glace', name: 'Armure de glace', category: 'Sorts', subcategory: 'Niveau 1', action: 'Action', description: "8 PV temporaires. Tant que les PV sont actifs, les attaquants rapprochés subissent 1d4 dégâts de froid." },
  { id: 's-armure-mage', name: 'Armure du mage', category: 'Sorts', subcategory: 'Niveau 1', action: 'Action bonus', description: "Seulement si le lanceur ne porte pas d'armure. +3 AC jusqu'à la fin du combat." },
  { id: 's-poids-plume', name: 'Poids plume', category: 'Sorts', subcategory: 'Niveau 1', action: 'Action bonus', description: "Jusqu'à 4 cibles ne prennent aucun dégât de chute pour le reste de la journée." },
  { id: 's-vol', name: 'Vol', category: 'Sorts', subcategory: 'Niveau 1', action: 'Action bonus', description: "Permet à une cible au choix de voler. Les personnages qui volent ont avantage contre les cibles au sol." },
  { id: 's-mouvement-rapide', name: 'Mouvement rapide', category: 'Sorts', subcategory: 'Niveau 1', action: 'Action bonus', neverMisses: true, description: "Le lanceur ou un autre personnage au choix reçoit une action de plus lors de son prochain tour." },
  // Niveau 2
  { id: 's-orbe-malefique', name: 'Orbe maléfique', category: 'Sorts', subcategory: 'Niveau 2', action: 'Action', neverMisses: true, description: 'Une puissante boule de ténèbres nécrose la chair. 3d8 dégâts nécrotiques.' },
  { id: 's-vortex-flammes', name: 'Vortex de flammes', category: 'Sorts', subcategory: 'Niveau 2', action: 'Action', description: "Une vrille de flammes consume la cible. 4d6 dégâts brûlants." },
  { id: 's-foudre', name: 'Foudre', category: 'Sorts', subcategory: 'Niveau 2', action: 'Action', description: "Trois éclairs frappent la cible. 3d8 dégâts électriques. Saving throw résistance (12) ou sonnée." },
  { id: 's-rafale-arcanes', name: "Rafale d'arcanes", category: 'Sorts', subcategory: 'Niveau 2', action: 'Action', description: "Trois rayons arcaniques frappent des cibles au choix. 1d6 dégâts magiques par rayon." },
  { id: 's-peau-fer', name: 'Peau de fer', category: 'Sorts', subcategory: 'Niveau 2', action: 'Réaction', description: "Utilisé en réaction à une attaque qui touche, avant les dégâts. Réduit les dégâts de 1d12." },
  { id: 's-enchantement-avance', name: 'Enchantement avancé', category: 'Sorts', subcategory: 'Niveau 2', action: 'Action bonus', neverMisses: true, description: "Imbue une arme. La prochaine attaque fait 1d12 dégâts magiques de plus." },
  { id: 's-javelot-glace', name: 'Javelot de glace', category: 'Sorts', subcategory: 'Niveau 2', action: 'Action', description: "La cible a 2 AC de moins contre cette attaque. 3d8 dégâts de froid." },
  { id: 's-lame-vent', name: 'Lame de vent', category: 'Sorts', subcategory: 'Niveau 2', action: 'Action', description: "Coup critique sur 18 et moins. 3d8 dégâts tranchants." },
  { id: 's-emprisonnement', name: 'Emprisonnement', category: 'Sorts', subcategory: 'Niveau 2', action: 'Action', neverMisses: true, description: "Barrière d'énergie : la cible ne peut bouger ni agir à son prochain tour. Saving throw constitution (14) pour éviter." },
  { id: 's-represailles', name: 'Représailles calcinées', category: 'Sorts', subcategory: 'Niveau 2', action: 'Réaction', neverMisses: true, description: "Réaction à une attaque rapprochée, après les dégâts. Une vague de flammes frappe l'assaillant. 4d6 dégâts brûlants." },
  { id: 's-stalagmites', name: 'Stalagmites', category: 'Sorts', subcategory: 'Niveau 2', action: 'Action', neverMisses: true, description: "4 piques rocheux fondent sur la cible. Saving throw vitesse (15) pour éviter. 4d10 dégâts perçants." },
  // Niveau 3
  { id: 's-orbe-tenebres', name: 'Orbe des ténèbres', category: 'Sorts', subcategory: 'Niveau 3', action: 'Action', neverMisses: true, description: 'Une boule de ténèbres bouillonnante nécrose la chair. 4d8 dégâts nécrotiques.' },
  { id: 's-incineration', name: 'Incinération', category: 'Sorts', subcategory: 'Niveau 3', action: 'Action', description: "La chair de la cible prend momentanément feu. 6d6 dégâts brûlants." },
  { id: 's-deflagration', name: 'Déflagration électrique', category: 'Sorts', subcategory: 'Niveau 3', action: 'Action', description: "Quatre gigantesques éclairs rougeâtres frappent. 4d8 dégâts électriques. Saving throw résistance (12) ou sonnée." },
  { id: 's-explosion-arcanes', name: "Explosion d'arcanes", category: 'Sorts', subcategory: 'Niveau 3', action: 'Action', description: "Trois puissants rayons arcaniques. 1d10 dégâts magiques par rayon." },
  { id: 's-peau-dragon', name: 'Peau de dragon', category: 'Sorts', subcategory: 'Niveau 3', action: 'Réaction', description: "La peau devient dure comme les écailles d'un dragon. Réduit les dégâts de 1d20." },
  { id: 's-lame-magique', name: 'Lame magique', category: 'Sorts', subcategory: 'Niveau 3', action: 'Action bonus', neverMisses: true, description: "Imbue une arme. La prochaine attaque fait 1d20 dégâts magiques de plus." },
  { id: 's-lance-glace', name: 'Lance de glace', category: 'Sorts', subcategory: 'Niveau 3', action: 'Action', description: "La cible a 3 AC de moins contre cette attaque. 4d8 dégâts de froid." },
  { id: 's-scalpel-vent', name: 'Scalpel de vent', category: 'Sorts', subcategory: 'Niveau 3', action: 'Action', description: "Une fine lame de vent. Coup critique sur 15 et moins. 3d8 dégâts tranchants." },
  { id: 's-bouclier-feu', name: 'Bouclier de feu', category: 'Sorts', subcategory: 'Niveau 3', action: 'Action', description: "Un cercle de flammes entoure le lanceur. AC +5 jusqu'à la fin du combat. Chaque attaquant rapproché subit 1d4 brûlants avant de rouler son attack roll." },
  { id: 's-contre-sort', name: 'Contre-sort', category: 'Sorts', subcategory: 'Niveau 3', action: 'Réaction', description: "Contrecarre un sort lancé par un autre personnage. Une seule fois par combat." },
  { id: 's-regard-petrifiant', name: 'Regard pétrifiant', category: 'Sorts', subcategory: 'Niveau 3', action: 'Action', neverMisses: true, description: "Ne fonctionne pas si la cible est aveugle. Saving throw constitution (15). Réussite : 4d6 psychiques. Échec : 8d6 psychiques. Si PV à 0 : pétrification totale (cible et objets)." },
  // Niveau 4
  { id: 's-orbe-annihilantes', name: 'Orbe de Ténèbres Annihilantes', category: 'Sorts', subcategory: 'Niveau 4', action: 'Action', neverMisses: true, description: "5d8 dégâts nécrotiques. Saving throw constitution (15) ou -3 PV max permanent." },
  { id: 's-souffle-acide-implacable', name: 'Souffle Acide Implacable', category: 'Sorts', subcategory: 'Niveau 4', action: 'Action', description: "6d8 dégâts acides. Saving throw constitution (15) ou une pièce d'armure/équipement détruite." },
  { id: 's-flammes-infernales', name: 'Explosion de Flammes Infernales', category: 'Sorts', subcategory: 'Niveau 4', action: 'Action', description: "7d6 dégâts brûlants en zone." },
  { id: 's-chaine-fulgurante', name: 'Chaîne Fulgurante', category: 'Sorts', subcategory: 'Niveau 4', action: 'Action', description: "5d8 électriques à la cible principale, puis propagation à 2 ennemis proches : 3d8 chacun." },
  { id: 's-rafale-arcanique', name: 'Rafale Arcanique', category: 'Sorts', subcategory: 'Niveau 4', action: 'Action', description: "Trois rayons sur cibles distinctes. 2d10 dégâts magiques par rayon." },
  { id: 's-peau-obsidienne', name: "Peau d'Obsidienne", category: 'Sorts', subcategory: 'Niveau 4', action: 'Réaction', description: "Réduit les dégâts de 3d8. Tout attaquant rapproché subit 2d6 dégâts contondants." },
  { id: 's-glace-tranchante', name: 'Glace tranchante', category: 'Sorts', subcategory: 'Niveau 4', action: 'Action', description: "5d8 dégâts de froid. La cible perd 2 AC contre cette attaque. Saving throw constitution (15) ou immobilisée 1 tour." },
  { id: 's-passe-muraille', name: 'Passe-Muraille Astral', category: 'Sorts', subcategory: 'Niveau 4', action: 'Action', description: "Traverser toute matière solide pendant 1 minute." },
  { id: 's-reconstruction', name: 'Reconstruction Arcanique', category: 'Sorts', subcategory: 'Niveau 4', action: 'Action', description: "Répare ou reconstitue des objets non vivants en une seule action." },
  { id: 's-perception-elem', name: 'Perception Élémentaire', category: 'Sorts', subcategory: 'Niveau 4', action: 'Action', description: "Perçoit les traces élémentaires dans l'environnement, suit des créatures ou objets, détecte chaleur, eau cachée ou fissures." },
  { id: 's-garde-spirituelle', name: 'Garde Spirituelle', category: 'Sorts', subcategory: 'Niveau 4', action: 'Action', description: "Convoque un esprit protecteur sur un lieu ou objet pendant 24h. Avertit si quelqu'un pénètre la zone." },
  { id: 's-camouflage-planar', name: 'Camouflage Planar', category: 'Sorts', subcategory: 'Niveau 4', action: 'Action', description: "Dissimule un objet ou une zone dans un autre plan d'existence, totalement invisible pendant 1 heure." },
  // Niveau 5
  { id: 's-orbe-destruction', name: 'Orbe de Destruction', category: 'Sorts', subcategory: 'Niveau 5', action: 'Action', neverMisses: true, description: "7d8 dégâts nécrotiques. Saving throw constitution (16) ou -6 PV max." },
  { id: 's-souffle-corrosion', name: 'Souffle de Corrosion Profonde', category: 'Sorts', subcategory: 'Niveau 5', action: 'Action', description: "7d10 dégâts acides. Saving throw constitution (16) ou -3 AC jusqu'au prochain tour du lanceur." },
  { id: 's-explosion-magmatique', name: 'Explosion Magmatique', category: 'Sorts', subcategory: 'Niveau 5', action: 'Action', description: "8d6 dégâts brûlants en zone." },
  { id: 's-eclairs-impitoyables', name: "Chaîne d'Éclairs Impitoyables", category: 'Sorts', subcategory: 'Niveau 5', action: 'Action', description: "6d8 électriques à la cible principale, propagation à 2 cibles proches : 4d8 chacune." },
  { id: 's-fleches-arcanes', name: "Flèches d'Arcanes Dévastatrices", category: 'Sorts', subcategory: 'Niveau 5', action: 'Action', description: "Plusieurs rayons, 3d10 chacun, attack roll distinct." },
  { id: 's-peau-diamant', name: 'Peau de Diamant', category: 'Sorts', subcategory: 'Niveau 5', action: 'Réaction', description: "Réduit les dégâts de 4d10. 2d6 dégâts à l'attaquant. Immunité saignement 1 tour." },
  { id: 's-epieu-givre', name: 'Épieu de Givre', category: 'Sorts', subcategory: 'Niveau 5', action: 'Action', description: "5d8 dégâts de froid. -3 AC à la cible. Saving throw constitution (16) ou paralysée 1 tour." },
  { id: 's-communication-elem', name: 'Mots de Communication Élémentaire', category: 'Sorts', subcategory: 'Niveau 5', action: 'Action', description: "Communication télépathique avec une créature ou objet sensible à la magie, quelle que soit la distance." },
  { id: 's-portail-ambiance', name: "Portail d'Ambiance", category: 'Sorts', subcategory: 'Niveau 5', action: 'Action', description: "Crée une petite porte dimensionnelle vers un lieu choisi à l'avance. Espace temporaire pendant 1 heure." },
  // Niveau 6
  { id: 's-orbe-annihilation', name: "Orbe d'Annihilation Total", category: 'Sorts', subcategory: 'Niveau 6', action: 'Action', neverMisses: true, description: "8d8 dégâts nécrotiques. Saving throw constitution (15) ou -10 PV max." },
  { id: 's-devastation-acide', name: 'Souffle de Dévastation Acide', category: 'Sorts', subcategory: 'Niveau 6', action: 'Action', description: "8d10 dégâts acides. Saving throw constitution (17) ou -4 AC jusqu'au prochain tour du lanceur." },
  { id: 's-cauchemar-volcanique', name: 'Cauchemar Volcanique', category: 'Sorts', subcategory: 'Niveau 6', action: 'Action', description: "Une explosion géante de magma. 10d6 dégâts brûlants en zone." },
  { id: 's-tempete-eclairs', name: "Tempête d'Éclairs Cataclysmique", category: 'Sorts', subcategory: 'Niveau 6', action: 'Action', description: "8d8 électriques à la cible, propagation à 3 ennemis : 6d8 chacun." },
  { id: 's-fleches-apocalyptiques', name: 'Flèches Arcanes Apocalyptiques', category: 'Sorts', subcategory: 'Niveau 6', action: 'Action', description: "Pluie de flèches magiques. 5d10 dégâts magiques par rayon, attack roll séparé." },
  { id: 's-peau-roc', name: 'Peau de Roc Primordial', category: 'Sorts', subcategory: 'Niveau 6', action: 'Réaction', description: "Réduit les dégâts de 5d10. 3d6 dégâts à l'attaquant. Immunité contrôle mental et altérations 1 tour." },
  { id: 's-percage-boreal', name: 'Perçage Boréal', category: 'Sorts', subcategory: 'Niveau 6', action: 'Action', description: "7d8 dégâts de froid. -4 AC à la cible. Saving throw constitution (17) ou figée 1 tour." },
  { id: 's-chemin-celeste', name: 'Chemin du Vagabond Céleste', category: 'Sorts', subcategory: 'Niveau 6', action: 'Action', description: "Chemin temporaire permettant de voyager instantanément vers un lieu connu dans un autre plan, pendant 1h." },
  { id: 's-chronomagique', name: 'Manipulation Chronomagique', category: 'Sorts', subcategory: 'Niveau 6', action: 'Action', description: "Manipule la perception du temps dans 20m de rayon pendant 1 minute. Ralentit ou accélère le flux temporel." },
];

// ─────────────────────────── MIRACLES ───────────────────────────
export const MIRACLES: Spell[] = [
  // MOIIFHB
  { id: 'm-mo-terre', name: 'Terre consacrée', category: 'Moiifhb', subcategory: 'Niveau 1', action: 'Action bonus', neverMisses: true, description: "La zone brille d'un éclat divin. Alliés récupèrent 1d4 PV, ennemis perdent 1d4 PV (même dé)." },
  { id: 'm-mo-bouclier', name: 'Bouclier de foi', category: 'Moiifhb', subcategory: 'Niveau 1', action: 'Réaction', description: "Réaction à une attaque avant le attack roll. Un bouclier de lumière augmente l'AC de 2 contre cette attaque." },
  { id: 'm-mo-rayon', name: 'Rayon de Soleil', category: 'Moiifhb', subcategory: 'Niveau 1', action: 'Action', description: "Un rayon de lumière brûle la cible. 2d6 dégâts divins. Cible aveuglée jusqu'au prochain tour (+2 aux attack rolls contre elle)." },
  { id: 'm-mo-misericorde', name: 'Miséricorde', category: 'Moiifhb', subcategory: 'Niveau 1', action: 'Réaction', description: "Réaction après les dégâts qui feraient descendre les PV de l'invocateur ou d'un allié à 0. Les PV deviennent 1d10 au lieu de 0." },
  { id: 'm-mo-silence', name: 'Silence', category: 'Moiifhb', subcategory: 'Niveau 2', action: 'Action bonus', neverMisses: true, description: "La cible désignée ne peut plus parler, lancer des sorts ou utiliser des miracles jusqu'au prochain tour. Saving throw foi (14). Si réussi, le miracle s'arrête." },
  { id: 'm-mo-marteau', name: 'Marteau de Moiifhb', category: 'Moiifhb', subcategory: 'Niveau 2', action: 'Action', description: "Un énorme marteau de lumière dorée frappe la cible. 3d8 dégâts divins. Peut aussi être lancé comme projectile." },
  { id: 'm-mo-chatiment', name: 'Châtiment', category: 'Moiifhb', subcategory: 'Niveau 2', action: 'Action', neverMisses: true, description: "Un rayon de lumière descend du ciel. Saving throw foi (14). Réussite : 2d10 divins. Échec : 4d10 divins." },
  { id: 'm-mo-faveur', name: 'Faveur divine', category: 'Moiifhb', subcategory: 'Niveau 3', action: 'Action bonus', description: "Saving throw foi (16). Si réussi : immunité à tous les dégâts jusqu'au prochain tour." },
  { id: 'm-mo-excom', name: 'Excommunication', category: 'Moiifhb', subcategory: 'Niveau 3', action: 'Action', neverMisses: true, description: "Saving throw foi (16). Réussite : rien. Échec : 6d12 dégâts divins. Si PV à 0 : âme envoyée dans le domaine de Sugriok pour l'éternité." },
  { id: 'm-mo-supreme', name: "L'Apocalypse Solaire", category: 'Moiifhb', subcategory: 'Suprême', action: 'Action', cost: '5 charges de foi', description: "Zone énorme. Ennemis : saving throw foi (18) ou 10d10 divins + aveuglés 4 tours. Alliés : récupèrent 5d10 PV + immunité aux dégâts divins 1 tour. L'invocateur perd 2d10 PV divins." },
  { id: 'm-mo-ultime', name: 'Le Jugement Final', category: 'Moiifhb', subcategory: 'Ultime', action: 'Action', cost: '8 charges de foi', description: "Vaste zone. Ennemis : saving throw foi (20) ou 15d10 divins + anéantis (âme dans le domaine de Sugriok). Alliés à 0 PV : résurrection à 50% PV max + immunité totale 1 tour. L'invocateur perd 25% de ses PV max." },
  // MITULIA
  { id: 'm-mi-torrent', name: 'Torrent', category: 'Mitulia', subcategory: 'Niveau 1', action: 'Action', description: "Un mini-geyser d'eau bouillante. 3d6 dégâts brûlants." },
  { id: 'm-mi-source', name: 'Source de vie', category: 'Mitulia', subcategory: 'Niveau 1', action: 'Action bonus', neverMisses: true, description: "Eau calme et rafraîchissante sur la cible. Récupère 2d4 PV." },
  { id: 'm-mi-rapides', name: 'Rapides', category: 'Mitulia', subcategory: 'Niveau 1', action: 'Action bonus', neverMisses: true, description: "Un flot magique sous les pieds de la cible. Gagne une action à son prochain tour." },
  { id: 'm-mi-rayon-lunaire', name: 'Rayon lunaire', category: 'Mitulia', subcategory: 'Niveau 1', action: 'Action', description: "La lumière de la lune fait briller la cible 1 tour. 2d4 dégâts divins. Les attaques contre elle ont avantage jusqu'au prochain tour." },
  { id: 'm-mi-pluie', name: 'Pluie régénératrice', category: 'Mitulia', subcategory: 'Niveau 2', action: 'Action bonus', neverMisses: true, description: "Pluie magique pendant quelques secondes. Les alliés récupèrent 1d8 PV." },
  { id: 'm-mi-ebouillanter', name: 'Ébouillanter', category: 'Mitulia', subcategory: 'Niveau 2', action: 'Action', description: "Geyser d'eau bouillante. 4d6 dégâts brûlants. Saving throw résistance (10) ou jeté au sol et perd l'action bonus au prochain tour." },
  { id: 'm-mi-marque-lunaire', name: 'Marque lunaire', category: 'Mitulia', subcategory: 'Niveau 2', action: 'Action bonus', neverMisses: true, description: "La cible devient brillante. La prochaine attaque contre elle a avantage et si elle réussit, la marque explose : +3d6 dégâts divins." },
  { id: 'm-mi-tourbillon', name: 'Tourbillon', category: 'Mitulia', subcategory: 'Niveau 3', action: 'Action', description: "Saving throw dextérité (16). Réussite : 2d8 froid et fin du miracle. Échec : piégée dans un tourbillon glacial, 3d6 froid. Chaque tour : nouveau saving throw (16) ou encore 3d6 froid et tour passé." },
  { id: 'm-mi-pleine-lune', name: 'Pleine lune', category: 'Mitulia', subcategory: 'Niveau 3', action: 'Action', description: "Seulement la nuit. Un énorme rayon lunaire frappe jusqu'à 3 cibles, 2d10 dégâts divins chacune." },
  { id: 'm-mi-supreme', name: 'Vague de la Lune', category: 'Mitulia', subcategory: 'Suprême', action: 'Action', cost: '5 charges de foi', description: "Zone d'eau magique. Ennemis : saving throw dextérité (18) ou 8d6 froid + projetés 10m. Alliés : 4d8 PV + avantage sur saving throws contre magie 1 tour." },
  { id: 'm-mi-ultime', name: 'Pluie Lunaire', category: 'Mitulia', subcategory: 'Ultime', action: 'Action', cost: '7 charges de foi', description: "Pluie divine. Alliés récupèrent 6d8 PV + bonus +2 en attaque 1 tour. Ennemis dans la zone : 6d6 dégâts de froid." },
  // ARIVIS
  { id: 'm-ar-soins-mineurs', name: 'Soins mineurs', category: 'Arivis', subcategory: 'Niveau 1', action: 'Action bonus', neverMisses: true, description: "Mot de prière. Soigne une cible pour 1d6 PV." },
  { id: 'm-ar-nature', name: 'Nature fleurissante', category: 'Arivis', subcategory: 'Niveau 1', action: 'Action', description: "Branches et ronces assaillissent la cible. 2d8 dégâts tranchants." },
  { id: 'm-ar-regeneration', name: 'Régénération', category: 'Arivis', subcategory: 'Niveau 1', action: 'Action', neverMisses: true, description: "Touche une personne à 0 PV toujours en vie. Elle se relève avec 1d10 PV." },
  { id: 'm-ar-remede', name: 'Remède naturel', category: 'Arivis', subcategory: 'Niveau 1', action: 'Action bonus', neverMisses: true, description: "Met fin à tous les poisons et saignements qui affligent la cible." },
  { id: 'm-ar-ecorce', name: 'Écorce', category: 'Arivis', subcategory: 'Niveau 2', action: 'Action', description: "La peau prend l'aspect de l'écorce d'un vieux chêne. AC +3 jusqu'à la fin du combat si pas d'armure." },
  { id: 'm-ar-soins', name: 'Soins', category: 'Arivis', subcategory: 'Niveau 2', action: 'Action bonus', neverMisses: true, description: "Puissant mot de prière. Soigne une cible pour 2d6 PV." },
  { id: 'm-ar-resurrection', name: 'Résurrection', category: 'Arivis', subcategory: 'Niveau 2', action: 'Action', neverMisses: true, description: "Ramène à la vie un personnage mort (effets précis à confirmer avec le MJ)." },
  { id: 'm-ar-compagnon', name: 'Compagnon animal', category: 'Arivis', subcategory: 'Niveau 3', action: 'Hors combat', description: "Une seule utilisation. La nature fournit l'aide d'un animal. Voir feuille de classe chasseur pour les compagnons disponibles." },
  { id: 'm-ar-soins-masse', name: 'Soins de masse', category: 'Arivis', subcategory: 'Niveau 3', action: 'Action', neverMisses: true, description: "Infuse jusqu'à 4 cibles d'énergie vitale. Elles récupèrent 3d8 PV." },
  { id: 'm-ar-supreme', name: 'Bénédiction de la Terre', category: 'Arivis', subcategory: 'Suprême', action: 'Action', cost: '6 charges de foi', description: "Zone 30m. Alliés récupèrent 4d8 PV + résistance aux dégâts (réduit de 1d10) jusqu'au prochain tour." },
  { id: 'm-ar-ultime', name: 'Lumière du Renouveau', category: 'Arivis', subcategory: 'Ultime', action: 'Action', cost: '8 charges de foi', description: "Zone de lumière chaleureuse. Alliés récupèrent 6d10 PV + toutes conditions supprimées + bonus +2 Dextérité et Force 1 tour. Ennemis : 4d6 dégâts divins." },
  // LAETH
  { id: 'm-la-froid', name: 'Froid de la tombe', category: 'Laeth', subcategory: 'Niveau 1', action: 'Action bonus', description: "Seulement sur une cible qui a déjà perdu des PV ce tour. Un froid glacial s'empare d'elle. Saving throw résistance (12) ou 2d8 dégâts de froid." },
  { id: 'm-la-toucher', name: 'Toucher nécrotique', category: 'Laeth', subcategory: 'Niveau 1', action: 'Action', description: "La main brille de l'énergie verdâtre de la mort. La cible touchée prend 3d4 dégâts nécrotiques." },
  { id: 'm-la-insensibilite', name: 'Insensibilité', category: 'Laeth', subcategory: 'Niveau 1', action: 'Réaction', description: "Réaction à une attaque qui touche, après les dégâts. Utilise la froideur de la tombe. Réduit les dégâts de 1d10." },
  { id: 'm-la-communion', name: 'Communion avec la mort', category: 'Laeth', subcategory: 'Niveau 1', action: 'Hors combat', neverMisses: true, description: "Touche une personne morte et lui donne le souffle artificiel. Peut poser deux questions. Le mort est forcé de dire la vérité." },
  { id: 'm-la-necrose', name: 'Nécrose', category: 'Laeth', subcategory: 'Niveau 2', action: 'Action', neverMisses: true, description: "La chair de la cible meurt et se décompose. Saving throw constitution (14). Réussite : 2d6 nécrotiques. Échec : 5d6 nécrotiques." },
  { id: 'm-la-corps', name: 'Corps spectral', category: 'Laeth', subcategory: 'Niveau 2', action: 'Action bonus', neverMisses: true, description: "Aspect fantomatique jusqu'au prochain tour. Passe à travers les objets, vole. Résistance aux dégâts physiques. Vulnérable aux dégâts divins." },
  { id: 'm-la-putrefaction', name: 'Putréfaction', category: 'Laeth', subcategory: 'Niveau 2', action: 'Action', description: "L'invocateur perd 4 PV. La cible prend 3d8 nécrotiques. Saving throw constitution (12) ou empoisonnée (2)." },
  { id: 'm-la-puits', name: "Puits d'âmes", category: 'Laeth', subcategory: 'Niveau 3', action: 'Passif', description: "Chaque fois que l'invocateur tue une créature, il gagne 1 PV max." },
  { id: 'm-la-condamnation', name: 'Condamnation', category: 'Laeth', subcategory: 'Niveau 3', action: 'Action', description: "L'invocateur devient momentanément Laeth dans sa forme spectrale. Saving throw constitution (12). Si échec : mort instantanée. Seulement sur créatures vivantes de niveau égal ou inférieur." },
  { id: 'm-la-mot-mort', name: 'Mot de la mort', category: 'Laeth', subcategory: 'Niveau 3', action: 'Action', description: "Une seule utilisation. La cible meurt instantanément. Niveau de cible égal ou inférieur à l'invocateur." },
  { id: 'm-la-supreme', name: 'Sombre Bénédiction', category: 'Laeth', subcategory: 'Suprême', action: 'Action', cost: '6 charges de foi', description: "Zone autour de l'invocateur. Ennemis : saving throw constitution (18) ou 4d6 nécrotiques + désavantage en attaque contre alliés. Alliés : protection contre la peur + avantage saving throws mort 1 tour." },
  { id: 'm-la-ultime', name: "Étreinte des Ombres", category: 'Laeth', subcategory: 'Ultime', action: 'Action', cost: '8 charges de foi', description: "Voile d'ombres. Ennemis : saving throw constitution (20) ou 8d6 nécrotiques + ralentis de moitié + -2 bonus d'attaque prochain tour." },
  // KADATH
  { id: 'm-ka-revelation', name: 'Révélation', category: 'Kadath', subcategory: 'Niveau 1', action: 'Action bonus', neverMisses: true, description: "L'invocateur voit des images horribles de Kadath et perd 3 PV. Il gagne +3 à son prochain attack roll ce tour." },
  { id: 'm-ka-portail', name: 'Portail cosmique', category: 'Kadath', subcategory: 'Niveau 1', action: 'Action', neverMisses: true, description: "Ouvre un portail transportant l'invocateur, un allié ou un objet jusqu'à 100m. Les voyageurs doivent avoir les yeux fermés ou risquent de revenir avec un esprit différent." },
  { id: 'm-ka-bouche', name: 'La bouche de Kadath', category: 'Kadath', subcategory: 'Niveau 1', action: 'Action', neverMisses: true, description: "Forme psychique d'une entité de Kadath au-dessus de la cible. Saving throw dextérité (12). Si échec : 2d6 acides + immobilisation jusqu'au prochain tour (avantage contre une personne immobile)." },
  { id: 'm-ka-oeil', name: "L'œil de Kadath", category: 'Kadath', subcategory: 'Niveau 1', action: 'Action bonus', neverMisses: true, description: "L'œil d'une entité de Kadath recouvre le ciel. Révèle les invisibles + avantage sur la prochaine attaque. Seulement à l'extérieur." },
  { id: 'm-ka-tentacules', name: 'Tentacules célestes', category: 'Kadath', subcategory: 'Niveau 2', action: 'Action bonus', neverMisses: true, description: "Jusqu'à la fin du combat, les bras de l'invocateur deviennent des tentacules acides. Attaques : stat de force, 2d8 contondants + 1d4 acides." },
  { id: 'm-ka-connexion', name: 'Connexion avec le voile', category: 'Kadath', subcategory: 'Niveau 2', action: 'Passif', description: "Divinité +2. Apprend un sort niveau 2 pouvant être lancé avec de la divinité." },
  { id: 'm-ka-voyage', name: 'Voyage cosmique', category: 'Kadath', subcategory: 'Niveau 2', action: 'Hors combat', description: "Une seule utilisation. L'esprit voyage à travers Kadath. Gagne +3 distribué dans les stats. Saving throw foi (14) : si échec, perd 8 PV max. Reçoit dans tous les cas la blessure permanente 'visions de Kadath'." },
  { id: 'm-ka-pluie', name: "Pluie d'étoiles", category: 'Kadath', subcategory: 'Niveau 3', action: 'Action', description: "Coûte X divinité. Pour chaque divinité payée : 1 morceau d'étoile, 1d12 brûlants, cible différente possible, attack roll distinct." },
  { id: 'm-ka-trou-noir', name: 'Trou noir', category: 'Kadath', subcategory: 'Niveau 3', action: 'Action', neverMisses: true, description: "Spirale d'énergie sombre. Saving throw dextérité (8). Réussite : 5d6 psychiques. Échec : aspirée dans Kadath." },
  { id: 'm-ka-supreme', name: 'Fracture du Voile', category: 'Kadath', subcategory: 'Suprême', action: 'Action', cost: '6 charges de divinité', description: "Déchire le voile. Ennemis : 3d6 psychiques + confusion 1 tour + désavantage aux saving throws. Alliés : avantage sur les attaques magiques 1 tour." },
  { id: 'm-ka-ultime', name: 'Rupture Astrale', category: 'Kadath', subcategory: 'Ultime', action: 'Action', cost: '8 charges de divinité', description: "Portail géant vers Kadath. Ennemis : saving throw constitution (18) ou 5d6 psychiques + désorientés (-2 AC prochain tour). Alliés : avantage aux jets d'attaque et saving throws magiques/psychiques 1 tour." },
  // SUGRIOK
  { id: 'm-su-pestilence', name: 'Pestilence', category: 'Sugriok', subcategory: 'Niveau 1', action: 'Action', description: "Une vague nauséabonde attaque la cible. Saving throw constitution (12). Si échec : tombe au sol, passe son prochain tour (avantage pour attaques contre elle)." },
  { id: 'm-su-faiblesse', name: 'Faiblesse', category: 'Sugriok', subcategory: 'Niveau 1', action: 'Action bonus', description: "Saving throw constitution (14) ou la prochaine attaque contre la cible fait 1d4 de plus + la prochaine attaque de la cible fait 1d4 de moins." },
  { id: 'm-su-bubon', name: 'Bubon explosif', category: 'Sugriok', subcategory: 'Niveau 1', action: 'Action', description: "Un bubon sous-cutané explose. 1d8 dégâts acides. Saving throw constitution (10) ou empoisonnée (2)." },
  { id: 'm-su-infestation', name: 'Infestation', category: 'Sugriok', subcategory: 'Niveau 1', action: 'Action', neverMisses: true, description: "Des insectes imaginaires envahissent l'esprit. Saving throw intelligence (12) ou 4d6 dégâts psychiques." },
  { id: 'm-su-ame', name: 'Âme tourmentée', category: 'Sugriok', subcategory: 'Niveau 2', action: 'Action', description: "Une âme de l'enfer s'agrippe à la cible : 2d10 froid immédiatement. Début de chaque tour de la cible : saving throw foi (10). Échec : encore 2d10 froid + tour passé. Réussite : fin du miracle." },
  { id: 'm-su-terreur', name: 'Terreur', category: 'Sugriok', subcategory: 'Niveau 2', action: 'Action', neverMisses: true, description: "Saving throw foi (12). Réussite : 2d8 psychiques. Échec : 5d8 psychiques." },
  { id: 'm-su-griffes', name: 'Griffes sombres', category: 'Sugriok', subcategory: 'Niveau 2', action: 'Action', description: "Une main ombreuse avec de longues griffes attaque la cible. 3d10 dégâts tranchants + saignement (2)." },
  { id: 'm-su-contagion', name: 'Contagion', category: 'Sugriok', subcategory: 'Niveau 3', action: 'Action', description: "Vague jaunâtre de maladie. 4d10 dégâts acides. Saving throw constitution (14) ou empoisonnement puissant (4)." },
  { id: 'm-su-yeux', name: 'Les yeux de Sugriok', category: 'Sugriok', subcategory: 'Niveau 3', action: 'Action', neverMisses: true, description: "La cible voit ce qui se cache derrière le voile de Sugriok. Saving throw vitesse (10) pour fermer les yeux à temps. Si échec : 6d12 dégâts psychiques." },
  { id: 'm-su-supreme', name: "Lamentation de l'Enfer", category: 'Sugriok', subcategory: 'Suprême', action: 'Action', cost: '6 charges de divinité', description: "Onde de terreur. Ennemis dans la zone : 6d10 psychiques. Saving throw constitution (15) ou paralysés par la terreur 1 tour + perte de 2 Charisme permanent." },
  { id: 'm-su-ultime', name: 'Regard de Sugriok', category: 'Sugriok', subcategory: 'Ultime', action: 'Action', cost: '8 charges de divinité', description: "Les yeux jaunes du dieu apparaissent. Rayon dévastateur en zone. Ennemis : 8d10 psychiques + 4d6 nécrotiques. Saving throw dextérité (16) ou passent leur prochain tour dans l'agonie." },
  // AKASHA
  { id: 'm-ak-hemorragie', name: 'Hémorragie', category: 'Akasha', subcategory: 'Niveau 1', action: 'Action', neverMisses: true, description: "Seulement sur une cible déjà blessée. Saving throw constitution (13). Si échec : dégâts de saignement égaux aux PV manquants." },
  { id: 'm-ak-sacrifice', name: 'Sacrifice sanguin', category: 'Akasha', subcategory: 'Niveau 1', action: 'Action', description: "L'invocateur sacrifie X fois 5 PV pour envoyer du sang teinté d'Akasha. Fait Xd6 dégâts nécrotiques." },
  { id: 'm-ak-fureur', name: 'Fureur sanguine', category: 'Akasha', subcategory: 'Niveau 1', action: 'Action bonus', neverMisses: true, description: "L'invocateur reçoit saignement (2). Tant qu'il saigne : avantage sur tous ses attack rolls et saving throws. Peut être arrêté n'importe quand." },
  { id: 'm-ak-bain', name: 'Bain de sang', category: 'Akasha', subcategory: 'Niveau 1', action: 'Action', neverMisses: true, description: "Nécessite un cadavre frais. Draine le sang du cadavre pour récupérer 2d6 PV." },
  { id: 'm-ak-pique', name: 'Pique de sang', category: 'Akasha', subcategory: 'Niveau 2', action: 'Action', description: "Seulement si l'invocateur a perdu au moins 10 PV. Lance une lance rougeâtre. 3d10 dégâts nécrotiques." },
  { id: 'm-ak-manipulation', name: 'Manipulation sanguine', category: 'Akasha', subcategory: 'Niveau 2', action: 'Action', description: "Le sang tourbillonne dans le cerveau de la cible. 3d6 psychiques. Saving throw constitution (12) ou sonnée." },
  { id: 'm-ak-saignee', name: 'Saignée', category: 'Akasha', subcategory: 'Niveau 2', action: 'Action', neverMisses: true, description: "Fait éclater une veine. Saving throw résistance (14) ou 3d8 tranchants + saignement (2)." },
  { id: 'm-ak-nécrophagie', name: 'Nécrophagie', category: 'Akasha', subcategory: 'Niveau 3', action: 'Passif', description: "Chaque fois qu'une personne meurt à moins de 100m, son sang vole vers l'invocateur. Rend 4 PV." },
  { id: 'm-ak-bouilloire', name: 'Bouilloire', category: 'Akasha', subcategory: 'Niveau 3', action: 'Action', description: "Le sang de la cible bout dans ses veines et coule de partout. Saving throw constitution (16). Réussite : 3d8 brûlants. Échec : 7d8 brûlants." },
  { id: 'm-ak-supreme', name: 'Cauchemar Sanguin', category: 'Akasha', subcategory: 'Suprême', action: 'Action', cost: '6 charges de divinité', description: "Zone autour de l'invocateur. Ennemis : 5d10 psychiques. Saving throw constitution (16) ou état 'Cauchemar Sanguin' : 2d6 psychiques par tour pendant 3 tours." },
  { id: 'm-ak-ultime', name: "Offre d'Immortalité", category: 'Akasha', subcategory: 'Ultime', action: 'Permanent', description: "L'invocateur devient un vampire. Passe à travers toutes les étapes de level up vampire jusqu'à son niveau (sauf PV et feats). Au prochain level up, peut choisir classe ou vampire." },
  // KATONG
  { id: 'm-kat-hypnose', name: 'Hypnose', category: 'Katong', subcategory: 'Niveau 1', action: 'Action bonus', neverMisses: true, description: "Tourbillon hypnotique dans les pupilles. Saving throw intelligence (14). Si échec : 1d6 psychiques + ne peut pas attaquer l'invocateur à son prochain tour." },
  { id: 'm-kat-invisibilite', name: 'Invisibilité', category: 'Katong', subcategory: 'Niveau 1', action: 'Action bonus', neverMisses: true, description: "L'invocateur devient invisible. Avantage contre les cibles qui ne le voient pas. Se termine si l'invocateur inflige des dégâts." },
  { id: 'm-kat-deverrouiller', name: 'Déverrouiller', category: 'Katong', subcategory: 'Niveau 1', action: 'Action bonus', neverMisses: true, description: "Une énergie puissante débarre tout verrou (porte, coffre, autre objet)." },
  { id: 'm-kat-connaissance', name: 'Connaissance astrale', category: 'Katong', subcategory: 'Niveau 1', action: 'Passif', description: "Visite la bibliothèque de Katong en rêves. Apprend un sort de niveau 1 pouvant être lancé avec de la divinité. Intelligence +1." },
  { id: 'm-kat-confusion', name: 'Confusion', category: 'Katong', subcategory: 'Niveau 2', action: 'Action', neverMisses: true, description: "Attaque l'esprit de la cible. Saving throw intelligence (12). Si échec : sonnée." },
  { id: 'm-kat-guide', name: 'Guide spirituel', category: 'Katong', subcategory: 'Niveau 2', action: 'Action bonus', description: "Désigne une créature. Jusqu'au prochain tour, toutes les attaques contre elle font 1d4 magiques de plus." },
  { id: 'm-kat-traversee', name: 'Traversée érudite', category: 'Katong', subcategory: 'Niveau 2', action: 'Passif', description: "Visite la bibliothèque de Katong en rêves. Apprend un sort de niveau 2 pouvant être lancé avec de la divinité. Intelligence +1." },
  { id: 'm-kat-percer', name: "Percer l'esprit", category: 'Katong', subcategory: 'Niveau 3', action: 'Action', description: "Saving throw intelligence (15). Réussite : 2d12 psychiques. Échec : 2d12 psychiques + l'invocateur contrôle la cible à son prochain tour. Ne fonctionne pas sur les personnages légendaires." },
  { id: 'm-kat-sagesse', name: 'Sagesse extra-dimensionnelle', category: 'Katong', subcategory: 'Niveau 3', action: 'Passif', description: "Visite la bibliothèque de Katong en rêves. Apprend un sort de niveau 3 pouvant être lancé avec de la divinité. Intelligence +1." },
  { id: 'm-kat-supreme', name: 'Manipulation Mentale Supérieure', category: 'Katong', subcategory: 'Suprême', action: 'Action', cost: '5 charges de divinité', description: "Saving throw intelligence (16) ou 4d10 psychiques + incapacité à agir 1 tour + contrôle partiel 4 tours. Cible non légendaire." },
  { id: 'm-kat-ultime', name: "Maîtrise Totale de l'Esprit", category: 'Katong', subcategory: 'Ultime', action: 'Passif', description: "Peut effacer un souvenir précis de façon permanente (saving throw intelligence (18) pour éviter). Peut contrôler des créatures légendaires (dragons, démons anciens, dieux faibles). Contrôle absolu sur les actions." },
  // ERKANOS
  { id: 'm-er-arme', name: 'Arme bénie', category: 'Erkanos', subcategory: 'Niveau 1', action: 'Action bonus', neverMisses: true, description: "L'arme rapprochée brille d'un éclat radiant. La prochaine attaque avec une arme ce tour fait 1d4 dégâts divins de plus." },
  { id: 'm-er-guerrier', name: 'Guerrier divin', category: 'Erkanos', subcategory: 'Niveau 1', action: 'Passif', description: "Le joueur peut utiliser sa foi pour ses attaques avec armes rapprochées au lieu de sa force ou dextérité." },
  { id: 'm-er-metallurgie', name: 'Métallurgie', category: 'Erkanos', subcategory: 'Niveau 1', action: 'Passif', description: "Les armures lourdes donnent +1 AC." },
  { id: 'm-er-defoulement', name: 'Défoulement', category: 'Erkanos', subcategory: 'Niveau 1', action: 'Action', description: "Erkanos souffle son énergie dans les muscles. Attaque une cible avec une arme rapprochée deux fois de suite." },
  { id: 'm-er-coup-sur', name: 'Coup sûr', category: 'Erkanos', subcategory: 'Niveau 2', action: 'Action bonus', neverMisses: true, description: "Jusqu'à la fin du combat, lorsque l'invocateur rate une attaque rapprochée, il a une deuxième chance de réussir." },
  { id: 'm-er-coups-dev', name: 'Coups dévastateurs', category: 'Erkanos', subcategory: 'Niveau 2', action: 'Action bonus', neverMisses: true, description: "Jusqu'à la fin du combat, lorsque l'invocateur réussit une attaque rapprochée, il roule un dé de plus et ignore le plus bas." },
  { id: 'm-er-hache', name: 'Lancer de hache', category: 'Erkanos', subcategory: 'Niveau 2', action: 'Action', description: "Une hache de lumière divine est projetée sur la cible. 4d8 dégâts divins." },
  { id: 'm-er-festin', name: 'Festin des corbeaux', category: 'Erkanos', subcategory: 'Niveau 3', action: 'Passif', description: "Chaque fois que le joueur tue un ennemi : +1 Force, Dextérité, Foi et Résistance jusqu'à la fin du combat." },
  { id: 'm-er-carnage', name: 'Maître du carnage', category: 'Erkanos', subcategory: 'Niveau 3', action: 'Passif', description: "Les attaques avec armes rapprochées font 1d10 de plus." },
  { id: 'm-er-supreme', name: 'Avatar de la Guerre', category: 'Erkanos', subcategory: 'Suprême', action: 'Action', cost: '5 charges de divinité', description: "État divin pendant 1p tours. +2 attaques supplémentaires par tour. Chaque attaque : +1d6 divins, ignore résistances physiques. Si tue une créature : attaque supplémentaire immédiate." },
  { id: 'm-er-ultime', name: 'Cataclysme Guerrier', category: 'Erkanos', subcategory: 'Ultime', action: 'Action', cost: '8 charges de divinité', description: "Touche automatiquement une créature à portée. 6d10 tranchants + 5d8 divins. Onde de choc : repousse les ennemis proches + 3d8 contondants à chacun." },
  // TALKUS
  { id: 'm-ta-lames', name: 'Lames funestes', category: 'Talkus', subcategory: 'Niveau 1', action: 'Action', description: "De petites lames invisibles tranchent la cible. 2d6 dégâts tranchants + saignement (2)." },
  { id: 'm-ta-crachat', name: 'Crachat caustique', category: 'Talkus', subcategory: 'Niveau 1', action: 'Action', description: "Salive transformée en acide. La cible a AC -2 contre cette attaque. 1d12 dégâts acides." },
  { id: 'm-ta-regard', name: 'Regard foudroyant', category: 'Talkus', subcategory: 'Niveau 1', action: 'Action bonus', neverMisses: true, description: "Les yeux prennent la teinte jaune d'un skelt. Saving throw constitution (10) ou 1d6 psychiques. Dans tous les cas : avantage sur la prochaine attaque contre la cible." },
  { id: 'm-ta-exosquelette', name: 'Exosquelette', category: 'Talkus', subcategory: 'Niveau 1', action: 'Action bonus', neverMisses: true, description: "La peau durcit et prend l'aspect d'un skelt. Si pas d'armure lourde ou moyenne : AC +2 jusqu'à la fin du combat." },
  { id: 'm-ta-tube', name: 'Tube de skelt', category: 'Talkus', subcategory: 'Niveau 2', action: 'Action', description: "La bouche se transforme en tube osseux de skelt pour sucer le sang. Si attaque réussie : 2d6 perçants + l'invocateur récupère des PV égaux aux dégâts." },
  { id: 'm-ta-rasoir', name: 'Rasoir invisible', category: 'Talkus', subcategory: 'Niveau 2', action: 'Action', description: "Une lame invisible se plante dans la cible. -1 AC à la cible contre cette attaque. 2d10 dégâts tranchants." },
  { id: 'm-ta-sang-skelt', name: 'Sang de skelt', category: 'Talkus', subcategory: 'Niveau 2', action: 'Réaction', neverMisses: true, description: "Réaction à une attaque rapprochée, après les dégâts. Le sang acide gicle sur l'attaquant. 3d8 dégâts acides." },
  { id: 'm-ta-faveur', name: 'Faveur de Talkus', category: 'Talkus', subcategory: 'Niveau 3', action: 'Passif', description: "Immunité aux dégâts acides. Si l'invocateur inflige des dégâts acides : ils font 1d12 de plus." },
  { id: 'm-ta-compagnon', name: 'Compagnon skelt', category: 'Talkus', subcategory: 'Niveau 3', action: 'Hors combat', description: "Une seule fois. Un skelt rejoint l'invocateur (Résistance 16, AC 13, Constitution 10, PV 22, Force/Dextérité 14, Immunité acide). Attaques : Lames de rasoir (1d8 + saignement 2), Regard hypnotisant, Tube (1d6 perçants + récupère PV)." },
  { id: 'm-ta-supreme', name: 'Invasion du Corps', category: 'Talkus', subcategory: 'Suprême', action: 'Action', cost: '6 charges de divinité', description: "Cible non légendaire. Saving throw constitution (15) ou 6d10 tranchants + immobilisation 1 tour + l'invocateur contrôle les membres 2 tours. La cible peut tenter de se libérer chaque tour (constitution)." },
  { id: 'm-ta-ultime', name: 'Apocalypse Skelt', category: 'Talkus', subcategory: 'Ultime', action: 'Action', cost: '1 charge de divinité par skelt', description: "Invoque une horde de skelts. Chaque skelt coûte 1 charge (hors limite normale). À leur arrivée : 2d6 acides à toutes créatures hostiles proches de l'atmosphère corrosive." },
];

// ─────────────────────────── POUVOIRS VAMPIRIQUES ───────────────────────────
export const VAMPIRIQUE: Spell[] = [
  // Base
  { id: 'v-survie', name: 'Survie vampirique', category: 'Vampirique', subcategory: 'Base', action: 'Passif', cost: 'Aucun coût. Une fois.', description: "Lorsque le vampire devrait mourir, il revient à la vie avec la moitié de ses PV max." },
  { id: 'v-vision', name: 'Vision nocturne', category: 'Vampirique', subcategory: 'Base', action: 'Passif', cost: 'Aucun coût.', description: "Le vampire peut voir dans le noir comme en pleine lumière. Permet de voir des détails cachés." },
  { id: 'v-autophagie', name: 'Autophagie', category: 'Vampirique', subcategory: 'Base', action: 'Action bonus', cost: '1 charge vampirique', description: "Le vampire se mord le poignet et boit son propre sang recyclé. Récupère 1d6 PV par niveau." },
  { id: 'v-griffes', name: 'Griffes sanguines', category: 'Vampirique', subcategory: 'Base', action: 'Action bonus', cost: '1 charge vampirique', description: "Des griffes rouges de sang coagulé apparaissent. Compétence pour la prochaine attaque à mains nues. Fait 1d8 dégâts tranchants par niveau." },
  { id: 'v-transfusion', name: 'Transfusion', category: 'Vampirique', subcategory: 'Base', action: 'Action', cost: '1 charge vampirique', description: "Soutire du sang à distance. Saving throw constitution (12) ou 1d10 dégâts de saignement par niveau. Le vampire récupère 1d4 PV par niveau." },
  { id: 'v-vol', name: 'Vol vampirique', category: 'Vampirique', subcategory: 'Base', action: 'Action bonus', cost: '1 charge vampirique', description: "Permet au vampire de voler par magie pour quelques minutes ou jusqu'à la fin du combat." },
  { id: 'v-charme', name: 'Charme', category: 'Vampirique', subcategory: 'Base', action: 'Action bonus', cost: '1 charge vampirique', description: "Saving throw intelligence (14) ou la cible est charmée et ne peut plus attaquer le vampire jusqu'à ce qu'il l'attaque. Ne fonctionne pas sur les personnages légendaires." },
  { id: 'v-paralysie', name: 'Paralysie sanguine', category: 'Vampirique', subcategory: 'Base', action: 'Action', cost: '1 charge vampirique', description: "Le sang de la cible devient glacial. Saving throw constitution (12) ou passe son prochain tour." },
  { id: 'v-subjugation', name: 'Subjugation', category: 'Vampirique', subcategory: 'Base', action: 'Action bonus', cost: 'Aucun coût. Une fois par combat.', description: "Le vampire hypnotise la cible. Action Morsure automatique sans saving throw (comme sur un cadavre)." },
  { id: 'v-panique', name: 'Panique hémoglobine', category: 'Vampirique', subcategory: 'Base', action: 'Action', cost: '2 charges vampiriques', description: "La cible croit être couverte de son propre sang. Saving throw intelligence (16) ou 4d10 dégâts psychiques." },
  // Avancé
  { id: 'v-sang-ancien', name: "Sang de l'Ancien", category: 'Vampirique', subcategory: 'Avancé', action: 'Action bonus', cost: '3 charges vampiriques', description: "+2 Force, Constitution et Dextérité pendant 4 tours + immunité aux effets de contrôle mental pendant la durée. Coût : 1d6 psychiques au début de chaque tour." },
  { id: 'v-tempete-sanguine', name: 'Tempête Sanguine', category: 'Vampirique', subcategory: 'Avancé', action: 'Action', cost: '4 charges vampiriques', description: "Zone autour du vampire. Ennemis : saving throw constitution (14) ou 4d6 tranchants + 2 dégâts saignement persistants. Le vampire récupère 1d6 PV par créature ayant échoué." },
  { id: 'v-frenesie', name: 'Frénésie Sanglante', category: 'Vampirique', subcategory: 'Avancé', action: 'Passif', cost: '5 charges vampiriques', description: "Active les griffes sanguines si pas déjà actives. Pendant 3 tours : attaque supplémentaire par tour + 1d10 tranchants par attaque réussie. Doit attaquer la créature la plus proche (ami ou ennemi)." },
  { id: 'v-metamorphose', name: 'Métamorphose Sanguine', category: 'Vampirique', subcategory: 'Avancé', action: 'Action bonus', cost: '3 charges vampiriques', description: "Forme semi-substantielle jusqu'à 6 tours : traverse murs et petites ouvertures. Invulnérable aux dégâts physiques mais ne peut pas attaquer. 2d6 dégâts par tour (épuisement)." },
  { id: 'v-voile', name: "Voile de l'Abysse", category: 'Vampirique', subcategory: 'Avancé', action: 'Action', cost: '4 charges vampiriques', description: "Zone de brume sanguine et d'obscurité. Ennemis : saving throw intelligence (16) ou aveuglés + désavantagés en attaque. Alliés : visibilité totale. Dure 4 tours. Le vampire perd 1d6 PV par tour." },
  { id: 'v-chimie', name: 'Chimie du Sang', category: 'Vampirique', subcategory: 'Avancé', action: 'Action bonus', cost: '4 charges vampiriques', description: "Saving throw constitution (16) ou altération du sang pendant 6 tours : 1d8 dégâts par tour + -2 Force et Dextérité. Si la cible meurt sous l'effet : le vampire gagne 1d10 PV." },
  { id: 'v-eclipse', name: "Sang d'Éclipse", category: 'Vampirique', subcategory: 'Avancé', action: 'Action', cost: '5 charges vampiriques', description: "Explosion de sang et d'ombre. Ennemis : saving throw constitution (18) ou 5d6 nécrose + 2d6 sang + confusion totale (désavantage sur toutes les actions) prochain tour. Alliés : +2 AC prochain tour." },
];

// ─────────────────────────── CONFIG ───────────────────────────
const SORT_LEVELS = ['Niveau 1', 'Niveau 2', 'Niveau 3', 'Niveau 4', 'Niveau 5', 'Niveau 6'];

const DEITIES = ['Moiifhb', 'Mitulia', 'Arivis', 'Laeth', 'Kadath', 'Sugriok', 'Akasha', 'Katong', 'Erkanos', 'Talkus'];

const DEITY_COLORS: Record<string, { bg: string; border: string; badge: string; text: string }> = {
  Moiifhb: { bg: '#fffbeb', border: '#d4a017', badge: '#d4a017', text: '#7c5a00' },
  Mitulia:  { bg: '#eff6ff', border: '#3b82f6', badge: '#3b82f6', text: '#1e3a8a' },
  Arivis:   { bg: '#f0fdf4', border: '#16a34a', badge: '#16a34a', text: '#14532d' },
  Laeth:    { bg: '#faf5ff', border: '#7c3aed', badge: '#7c3aed', text: '#4b1d96' },
  Kadath:   { bg: '#f5f0ff', border: '#6d28d9', badge: '#6d28d9', text: '#3b0764' },
  Sugriok:  { bg: '#f1f5f9', border: '#64748b', badge: '#64748b', text: '#1e293b' },
  Akasha:   { bg: '#fff1f0', border: '#c0392b', badge: '#c0392b', text: '#7a1a10' },
  Katong:   { bg: '#ecfeff', border: '#0e7490', badge: '#0e7490', text: '#083344' },
  Erkanos:  { bg: '#fff7ed', border: '#c2410c', badge: '#c2410c', text: '#7c2d12' },
  Talkus:   { bg: '#f0fdf4', border: '#16a34a', badge: '#4d7c0f', text: '#1a3a00' },
  Sorts:    { bg: '#f5f0ff', border: '#7c3aed', badge: '#7c3aed', text: '#4b1d96' },
  Vampirique: { bg: '#fff1f0', border: '#991b1b', badge: '#991b1b', text: '#450a0a' },
};

type TabType = 'sorts' | 'miracles' | 'vampirique';

const B = '1px solid #000';

function SpellCard({ spell, isSelected, onToggle }: { spell: Spell; isSelected: boolean; onToggle: () => void }) {
  const col = DEITY_COLORS[spell.category] ?? DEITY_COLORS['Sorts'];
  return (
    <div onClick={onToggle} style={{
      border: isSelected ? `2px solid ${col.border}` : '1px solid #ccc',
      borderRadius: '6px',
      background: isSelected ? col.bg : '#fff',
      padding: '10px 12px',
      cursor: 'pointer',
      transition: 'all 0.15s',
      boxShadow: isSelected ? `0 2px 8px ${col.border}33` : '0 1px 3px rgba(0,0,0,0.07)',
      display: 'flex', flexDirection: 'column', gap: '4px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
          {isSelected
            ? <CheckSquare size={15} color={col.border} style={{ flexShrink: 0 }} />
            : <Square size={15} color="#aaa" style={{ flexShrink: 0 }} />
          }
          <span style={{ fontWeight: 700, fontSize: '13px', color: isSelected ? col.text : '#1a1a1a' }}>{spell.name}</span>
        </div>
        <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
          {spell.neverMisses && (
            <span style={{ fontSize: '9px', background: '#16a34a', color: '#fff', borderRadius: '8px', padding: '1px 6px' }}>Ne rate jamais</span>
          )}
          <span style={{ fontSize: '9px', background: col.badge, color: '#fff', borderRadius: '8px', padding: '1px 6px' }}>{spell.action}</span>
        </div>
      </div>
      {spell.cost && <div style={{ fontSize: '10px', color: col.text, fontWeight: 700 }}>Coût : {spell.cost}</div>}
      <div style={{ fontSize: '11px', color: '#444', lineHeight: '1.4' }}>{spell.description}</div>
    </div>
  );
}

export function SpellSelector() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<TabType>('sorts');
  const [sortLevel, setSortLevel] = useState<string>('Tous');
  const [deity, setDeity] = useState<string>('Tous');
  const [miracleLevel, setMiracleLevel] = useState<string>('Tous');
  const [vampSubcat, setVampSubcat] = useState<string>('Tous');
  const [view, setView] = useState<'select' | 'summary'>('select');
  const summaryRef = useRef<HTMLDivElement>(null);

  const toggle = (id: string) => setSelected(prev => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  const getFiltered = (): Spell[] => {
    const q = search.toLowerCase();
    const matchSearch = (s: Spell) => !q || s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q);
    if (tab === 'sorts') {
      return SORTS.filter(s => (sortLevel === 'Tous' || s.subcategory === sortLevel) && matchSearch(s));
    }
    if (tab === 'miracles') {
      return MIRACLES.filter(s => (deity === 'Tous' || s.category === deity) && (miracleLevel === 'Tous' || s.subcategory === miracleLevel) && matchSearch(s));
    }
    return VAMPIRIQUE.filter(s => (vampSubcat === 'Tous' || s.subcategory === vampSubcat) && matchSearch(s));
  };

  const filtered = getFiltered();
  const selectedAll = [...SORTS, ...MIRACLES, ...VAMPIRIQUE].filter(s => selected.has(s.id));
  const selectedSorts = SORTS.filter(s => selected.has(s.id));
  const selectedMiracles = MIRACLES.filter(s => selected.has(s.id));
  const selectedVamp = VAMPIRIQUE.filter(s => selected.has(s.id));

  const miracleLevels = ['Tous', 'Niveau 1', 'Niveau 2', 'Niveau 3', 'Suprême', 'Ultime'];

  const exportSummaryPDF = async () => {
    if (!summaryRef.current) return;
    const el = summaryRef.current;
    const root = document.documentElement;
    const overrides: Record<string, string> = {
      '--foreground': '#111', '--card-foreground': '#111', '--popover': '#fff',
      '--popover-foreground': '#111', '--primary-foreground': '#fff',
      '--secondary': '#f1f0f8', '--secondary-foreground': '#111', '--ring': '#aaa',
      '--background': '#ffffff', '--card': '#ffffff', '--muted': '#f1f0f8',
      '--muted-foreground': '#666666', '--border': '#e2e2e2', '--input': '#e2e2e2',
      '--primary': '#111111', '--accent': '#f1f0f8', '--accent-foreground': '#111111',
    };
    const saved: Record<string, string> = {};
    for (const p of Object.keys(overrides)) saved[p] = root.style.getPropertyValue(p);
    for (const [p, v] of Object.entries(overrides)) root.style.setProperty(p, v);

    const clone = el.cloneNode(true) as HTMLElement;
    clone.style.position = 'fixed';
    clone.style.top = '0';
    clone.style.left = '-9999px';
    clone.style.width = el.offsetWidth + 'px';
    clone.style.background = '#fff';
    clone.style.zIndex = '-1';
    document.body.appendChild(clone);
    try {
      const canvas = await html2canvas(clone, { scale: 2, backgroundColor: '#fff', logging: false, useCORS: true });
      for (const [p, v] of Object.entries(saved)) {
        if (v) root.style.setProperty(p, v); else root.style.removeProperty(p);
      }
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageW = 210, pageH = 297;
      const imgW = pageW;
      const imgH = (canvas.height * pageW) / canvas.width;
      let y = 0;
      if (imgH <= pageH) {
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgW, imgH);
      } else {
        const scale = canvas.width / imgW;
        let pageNum = 0;
        while (y < canvas.height) {
          if (pageNum > 0) pdf.addPage();
          const sliceH = Math.min(pageH * scale, canvas.height - y);
          const sliceCanvas = document.createElement('canvas');
          sliceCanvas.width = canvas.width;
          sliceCanvas.height = sliceH;
          sliceCanvas.getContext('2d')!.drawImage(canvas, 0, y, canvas.width, sliceH, 0, 0, canvas.width, sliceH);
          pdf.addImage(sliceCanvas.toDataURL('image/png'), 'PNG', 0, 0, imgW, sliceH / scale);
          y += sliceH;
          pageNum++;
        }
      }
      pdf.save('sorts-miracles.pdf');
    } catch (e) {
      console.error(e);
      for (const [p, v] of Object.entries(saved)) {
        if (v) root.style.setProperty(p, v); else root.style.removeProperty(p);
      }
      alert("Erreur lors de l'export PDF.");
    } finally {
      document.body.removeChild(clone);
    }
  };

  const FilterBtn = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
    <button onClick={onClick} style={{
      padding: '4px 10px', border: B, borderRadius: '16px', cursor: 'pointer', fontSize: '11px',
      fontWeight: active ? 700 : 400, background: active ? '#2c2416' : '#fff', color: active ? '#f5e6c0' : '#333',
    }}>{label}</button>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#e8e4dc', fontFamily: 'serif', color: '#000' }}>
      {/* Header */}
      <div style={{ background: '#1a0a2e', color: '#e8d5ff', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '1px' }}>Sorts, Miracles & Pouvoirs</div>
          <div style={{ fontSize: '11px', opacity: 0.7 }}>Campagne D&D — Niveaux 1 à 6</div>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ fontSize: '12px', background: '#7c3aed', color: '#fff', borderRadius: '20px', padding: '3px 12px', fontWeight: 700 }}>
            {selected.size} sélectionné{selected.size > 1 ? 's' : ''}
          </div>
          <button onClick={() => setView(view === 'select' ? 'summary' : 'select')} style={{ background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '4px', padding: '6px 14px', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }}>
            {view === 'select' ? 'Voir le résumé →' : '← Retour à la liste'}
          </button>
          {view === 'summary' && (
            <button onClick={exportSummaryPDF} style={{ background: '#444', color: '#fff', border: 'none', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Download size={13} /> PDF
            </button>
          )}
        </div>
      </div>

      {view === 'select' ? (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '0', marginBottom: '14px', borderBottom: B }}>
            {([['sorts', 'Sorts (Niv. 1-6)'], ['miracles', 'Miracles'], ['vampirique', 'Pouvoirs vampiriques']] as [TabType, string][]).map(([t, label]) => (
              <button key={t} onClick={() => { setTab(t); setSearch(''); }} style={{
                padding: '8px 18px', border: 'none', borderBottom: tab === t ? '3px solid #7c3aed' : '3px solid transparent',
                background: 'transparent', cursor: 'pointer', fontSize: '13px', fontWeight: tab === t ? 700 : 400, color: tab === t ? '#7c3aed' : '#555',
              }}>{label}</button>
            ))}
          </div>

          {/* Search */}
          <div style={{ position: 'relative', marginBottom: '12px' }}>
            <Search size={13} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..." style={{ width: '100%', padding: '7px 7px 7px 30px', border: B, borderRadius: '4px', fontSize: '12px', boxSizing: 'border-box', background: '#fff', outline: 'none' }} />
            {search && <X size={13} onClick={() => setSearch('')} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#888' }} />}
          </div>

          {/* Sub-filters */}
          {tab === 'sorts' && (
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
              {['Tous', ...SORT_LEVELS].map(lv => <FilterBtn key={lv} label={lv} active={sortLevel === lv} onClick={() => setSortLevel(lv)} />)}
            </div>
          )}
          {tab === 'miracles' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {['Tous', ...DEITIES].map(d => <FilterBtn key={d} label={d} active={deity === d} onClick={() => setDeity(d)} />)}
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {miracleLevels.map(lv => <FilterBtn key={lv} label={lv} active={miracleLevel === lv} onClick={() => setMiracleLevel(lv)} />)}
              </div>
            </div>
          )}
          {tab === 'vampirique' && (
            <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
              {['Tous', 'Base', 'Avancé'].map(s => <FilterBtn key={s} label={s} active={vampSubcat === s} onClick={() => setVampSubcat(s)} />)}
            </div>
          )}

          {/* Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '8px' }}>
            {filtered.map(spell => (
              <SpellCard key={spell.id} spell={spell} isSelected={selected.has(spell.id)} onToggle={() => toggle(spell.id)} />
            ))}
            {filtered.length === 0 && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#888', padding: '40px', fontSize: '13px' }}>
                Aucun résultat trouvé.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Summary */
        <div style={{ maxWidth: '820px', margin: '0 auto', padding: '16px' }}>
          <div ref={summaryRef} style={{ background: '#fff', border: B, boxShadow: '0 2px 20px rgba(0,0,0,0.15)' }}>
            <div style={{ background: '#1a0a2e', color: '#e8d5ff', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '17px', fontWeight: 700 }}>Résumé — Sorts, Miracles & Pouvoirs</div>
                <div style={{ fontSize: '11px', opacity: 0.7 }}>Campagne D&D</div>
              </div>
              <div style={{ fontSize: '26px', fontWeight: 700, color: '#c4b5fd' }}>{selected.size}</div>
            </div>
            {selected.size === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#888', fontSize: '13px' }}>Aucune sélection. Retourne à la liste pour en choisir.</div>
            ) : (
              <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '0' }}>
                {/* Sorts */}
                {selectedSorts.length > 0 && (() => {
                  const col = DEITY_COLORS['Sorts'];
                  return (
                    <div style={{ marginBottom: '18px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: col.text, background: col.bg, border: `1px solid ${col.border}`, borderRadius: '4px', padding: '4px 12px', marginBottom: '8px', display: 'inline-block' }}>Sorts</div>
                      {SORT_LEVELS.map(lv => {
                        const spells = selectedSorts.filter(s => s.subcategory === lv);
                        if (!spells.length) return null;
                        return (
                          <div key={lv} style={{ marginBottom: '8px' }}>
                            <div style={{ fontSize: '11px', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>{lv}</div>
                            {spells.map((s, i) => (
                              <div key={s.id} style={{ borderLeft: `3px solid ${col.border}`, paddingLeft: '10px', marginBottom: i < spells.length - 1 ? '6px' : '0' }}>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                  <span style={{ fontWeight: 700, fontSize: '13px' }}>{s.name}</span>
                                  <span style={{ fontSize: '10px', background: col.badge, color: '#fff', borderRadius: '8px', padding: '1px 6px' }}>{s.action}</span>
                                  {s.neverMisses && <span style={{ fontSize: '10px', background: '#16a34a', color: '#fff', borderRadius: '8px', padding: '1px 6px' }}>Ne rate jamais</span>}
                                </div>
                                <div style={{ fontSize: '11px', color: '#444', lineHeight: '1.4' }}>{s.description}</div>
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
                {/* Miracles par divinité */}
                {selectedMiracles.length > 0 && DEITIES.map(d => {
                  const spells = selectedMiracles.filter(s => s.category === d);
                  if (!spells.length) return null;
                  const col = DEITY_COLORS[d];
                  return (
                    <div key={d} style={{ marginBottom: '16px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: col.text, background: col.bg, border: `1px solid ${col.border}`, borderRadius: '4px', padding: '4px 12px', marginBottom: '8px', display: 'inline-block' }}>{d}</div>
                      {['Niveau 1', 'Niveau 2', 'Niveau 3', 'Suprême', 'Ultime'].map(lv => {
                        const lvSpells = spells.filter(s => s.subcategory === lv);
                        if (!lvSpells.length) return null;
                        return (
                          <div key={lv} style={{ marginBottom: '6px' }}>
                            <div style={{ fontSize: '10px', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>{lv}</div>
                            {lvSpells.map((s, i) => (
                              <div key={s.id} style={{ borderLeft: `3px solid ${col.border}`, paddingLeft: '10px', marginBottom: i < lvSpells.length - 1 ? '6px' : '0' }}>
                                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                                  <span style={{ fontWeight: 700, fontSize: '12px' }}>{s.name}</span>
                                  <span style={{ fontSize: '9px', background: col.badge, color: '#fff', borderRadius: '8px', padding: '1px 5px' }}>{s.action}</span>
                                  {s.neverMisses && <span style={{ fontSize: '9px', background: '#16a34a', color: '#fff', borderRadius: '8px', padding: '1px 5px' }}>Ne rate jamais</span>}
                                  {s.cost && <span style={{ fontSize: '9px', color: col.text, fontWeight: 700 }}>— {s.cost}</span>}
                                </div>
                                <div style={{ fontSize: '11px', color: '#444', lineHeight: '1.4' }}>{s.description}</div>
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
                {/* Vampirique */}
                {selectedVamp.length > 0 && (() => {
                  const col = DEITY_COLORS['Vampirique'];
                  return (
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: col.text, background: col.bg, border: `1px solid ${col.border}`, borderRadius: '4px', padding: '4px 12px', marginBottom: '8px', display: 'inline-block' }}>Pouvoirs Vampiriques</div>
                      {['Base', 'Avancé'].map(sub => {
                        const spells = selectedVamp.filter(s => s.subcategory === sub);
                        if (!spells.length) return null;
                        return (
                          <div key={sub} style={{ marginBottom: '8px' }}>
                            <div style={{ fontSize: '10px', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>{sub}</div>
                            {spells.map((s, i) => (
                              <div key={s.id} style={{ borderLeft: `3px solid ${col.border}`, paddingLeft: '10px', marginBottom: i < spells.length - 1 ? '6px' : '0' }}>
                                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                                  <span style={{ fontWeight: 700, fontSize: '12px' }}>{s.name}</span>
                                  <span style={{ fontSize: '9px', background: col.badge, color: '#fff', borderRadius: '8px', padding: '1px 5px' }}>{s.action}</span>
                                  {s.cost && <span style={{ fontSize: '9px', color: col.text, fontWeight: 700 }}>— {s.cost}</span>}
                                </div>
                                <div style={{ fontSize: '11px', color: '#444', lineHeight: '1.4' }}>{s.description}</div>
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
