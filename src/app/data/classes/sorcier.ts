import type { ClassData } from '../gameData';

export const sorcier: ClassData = {
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
};
