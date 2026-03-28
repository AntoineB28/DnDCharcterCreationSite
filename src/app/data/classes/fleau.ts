import type { ClassData } from '../gameData';

export const fleau: ClassData = {
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
};
