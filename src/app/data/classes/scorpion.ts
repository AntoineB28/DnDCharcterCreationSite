import type { ClassData } from '../gameData';

export const scorpion: ClassData = {
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
};
