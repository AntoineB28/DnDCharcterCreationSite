import type { ClassData } from '../gameData';

export const barde: ClassData = {
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
};
