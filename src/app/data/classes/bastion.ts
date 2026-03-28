import type { ClassData } from '../gameData';

export const bastion: ClassData = {
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
};
