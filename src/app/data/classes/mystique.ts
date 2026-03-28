import type { ClassData } from '../gameData';

export const mystique: ClassData = {
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
};
