import type { ClassData } from '../gameData';

export const vigilant: ClassData = {
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
};
