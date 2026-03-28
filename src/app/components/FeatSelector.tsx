import { useState, useRef } from 'react';
import { Download, Search, X, CheckSquare, Square } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export interface Feat {
  id: string;
  name: string;
  category: string;
  restriction?: string;
  description: string;
  effects: string[];
  requires?: string;
}

export const FEATS: Feat[] = [
  // ── DIVIN ──
  {
    id: 'devotion', name: 'Dévotion', category: 'Divin',
    description: "Ta croyance en la suprématie de Moiifhb est le centre de ta vie. Le Seigneur sourit en regardant vers toi de son trône doré dans le ciel et t'octroie sa bénédiction.",
    effects: ["Foi +1.", "Un miracle de Moiifhb niveau 1 au choix utilisable une fois par long rest sans ressources."],
  },
  {
    id: 'communion-lunaire', name: 'Communion lunaire', category: 'Divin',
    description: "La lumière de la Lune te revigore et guide ton chemin. Tu sens une connexion aux marées et à l'océan.",
    effects: ["PV +5.", "Un miracle de Mitulia niveau 1 au choix utilisable une fois par long rest sans ressources."],
  },
  {
    id: 'defenseur-vie', name: 'Défenseur de la vie', category: 'Divin',
    description: "Tu crois que préserver la vie est une valeur noble pour laquelle il faut se battre. Tu ressens une connexion à tous les autres êtres vivants.",
    effects: ["Résistance +1.", "Un miracle d'Arivis niveau 1 au choix utilisable une fois par long rest sans ressources."],
  },
  {
    id: 'ombre-mort', name: 'Ombre de la mort', category: 'Divin',
    description: "Ton passage est comme celui d'une envolée de corbeaux, un présage de mort. Rien ne te satisfait plus que d'enlever la vie.",
    effects: ["Les miracles de Laeth qui affectent des créatures hostiles font 1d4 dégâts nécrotiques en plus."],
  },
  {
    id: 'erudit', name: 'Érudit', category: 'Divin',
    description: "Tu es un être particulièrement intelligent qui écoute la balance de l'univers. Tes méditations t'ont amené à une compréhension plus profonde de ta connexion à la magie.",
    effects: ["Intelligence +1.", "Un miracle de Katong niveau 1 au choix utilisable une fois par long rest sans ressources."],
  },
  {
    id: 'influence-cosmique', name: 'Influence cosmique', category: 'Divin',
    description: "Des visions inexplicables et horrifiantes s'emparent de ton esprit. Tu vois des dimensions et des couleurs inaccessibles à la psyché d'un mortel.",
    effects: ["Trauma permanent : cauchemars avec visions de Kadath.", "Un miracle de Kadath niveau 2 au choix, une fois par long rest. Chaque utilisation : 1d6 dégâts psychiques."],
  },
  {
    id: 'touche-enfer', name: "Touché de l'enfer", category: 'Divin',
    description: "Tu vois le domaine de Sugriok momentanément. Une marque gelée couvre ta joue.",
    effects: ["Marque de Sugriok sur la joue.", "Foi +2.", "Miracle de Sugriok niveau 1 au choix, une fois par long rest sans ressources."],
  },
  {
    id: 'faveur-akasha', name: "Faveur d'Akasha", category: 'Divin',
    description: "La déesse Akasha s'est amourachée de toi. Quelque chose change dans ton sang.",
    effects: ["Un pouvoir vampirique au choix utilisable une fois par long rest sans ressources."],
  },
  {
    id: 'paladin', name: 'Paladin', category: 'Divin', restriction: 'Prêtre ou guerrier uniquement.',
    description: "Tu combines ta prouesse au combat avec ta croyance. Cela te permet de donner des propriétés mystiques à ton arme.",
    effects: ["Foi +1.", "Coup divin : Action bonus, une fois par long rest. Prochaine attaque +2 attack roll et 1d8 dégâts divins de plus par niveau."],
  },
  {
    id: 'soigneur', name: 'Soigneur', category: 'Divin',
    restriction: 'Prêtre, sorcier, druide, moine, mage, astromancien, mystique, shaman ou barde.',
    description: "Ton esprit entre en relation avec la nature ou le monde divin pour te permettre de prodiguer des soins magiques.",
    effects: ["Foi ou constitution +1.", "Soins magiques : Action bonus, une fois par long rest. Soigne 1d6 par niveau. Peut être utilisé à distance."],
  },
  {
    id: 'choisi-laeth', name: 'Choisi de Laeth', category: 'Divin', restriction: 'Nécromancien seulement.',
    description: "Ta déesse t'octroie sa faveur et te guide dans ton contrôle sur le royaume des morts.",
    effects: ["Points de nécromancie +1.", "Un miracle de Laeth niveau 1 utilisable gratuitement une fois par long rest."],
  },
  {
    id: 'devoue-mal', name: 'Dévoué au mal', category: 'Divin', restriction: 'Sorcier seulement.',
    description: "Ta connexion à ton dieu sombre est la base de ta personnalité. Tu adores les pouvoirs destructeurs auxquels tu as accès.",
    effects: ["Foi +1.", "Un miracle niveau 1 du dieu choisi utilisable une fois par long rest sans payer de points de vie."],
  },
  {
    id: 'fervent', name: 'Fervent', category: 'Divin', restriction: 'Prêtre seulement.',
    description: "Tu es soumis à ton dieu. Tu tentes continuellement de trouver des signes de sa présence dans le monde.",
    effects: ["Foi +1.", "Divinité +2."],
  },
  {
    id: 'cercle-protection', name: 'Cercle de protection', category: 'Divin',
    description: "Ton énergie divine forme un bouclier autour de toi et de tes alliés.",
    effects: ["Foi +1.", "Une fois par long rest. Action bonus. Zone de protection : tous les alliés proches reçoivent -2 dégâts de toutes les sources jusqu'à ton prochain tour."],
  },
  {
    id: 'cercle-douleur', name: 'Cercle de douleur', category: 'Divin',
    description: "Ton énergie divine s'acharne sur les ennemis qui t'entourent et les rend plus vulnérables.",
    effects: ["Foi +1.", "Une fois par long rest. Action bonus. Zone de malheur : tous les ennemis proches reçoivent +2 dégâts de toutes les sources jusqu'à ton prochain tour."],
  },
  {
    id: 'premonition', name: 'Prémonition', category: 'Divin',
    description: "Ton esprit capte les flux du temps avant qu'ils ne se réalisent. Tu sais anticiper les actions ennemies.",
    effects: ["Foi ou intelligence +1.", "Une fois par combat, tu peux te donner +2 à un saving throw après avoir roulé."],
  },
  {
    id: 'vieille-ame', name: 'Vieille âme', category: 'Divin',
    description: "Tu as déjà vécu de nombreuses vies. Chacune de tes itérations t'habite et te guide.",
    effects: ["Intelligence ou foi +1.", "À chaque long rest, tu peux contacter un ancêtre pour une conversation enrichissante."],
  },

  // ── COMBAT ──
  {
    id: 'ecraseur-cranes', name: 'Écraseur de crânes', category: 'Combat',
    description: "Ta force physique hors du commun te permet de livrer des coups dévastateurs qui fracassent les os.",
    effects: ["Force +1.", "Avec un marteau, une masse ou un fléau : tu ajoutes deux fois ton bonus de force au attack roll et aux dégâts."],
  },
  {
    id: 'bourreau', name: 'Bourreau', category: 'Combat',
    description: "Tu manies une hache comme un bourreau manie un couperet, séparant la chair des os avec brutalité.",
    effects: ["Force +1.", "Les attaques avec des haches font 1d10 de plus aux cibles à moins de la moitié de leurs PV."],
  },
  {
    id: 'chevalier', name: 'Chevalier', category: 'Combat',
    description: "L'épée, noble et efficace, est ton arme de choix. Tu la manies comme une extension de ton corps.",
    effects: ["Force ou dextérité +1.", "Lorsque tu touches avec une épée, tu roules les dégâts deux fois et choisis le plus élevé."],
  },
  {
    id: 'sabreur', name: 'Sabreur', category: 'Combat',
    description: "Le sabre, rapide et affilé, a ta faveur. Tu l'utilises pour causer des coupures douloureuses.",
    effects: ["Dextérité +1.", "Lorsque tu touches avec un sabre, roule 1d4. La cible subit le résultat en saignement."],
  },
  {
    id: 'escrimeur', name: 'Escrimeur', category: 'Combat',
    description: "Un entraînement acharné t'a mené à une grande connaissance des armes d'estoc.",
    effects: ["Dextérité +1.", "Les rapières te donnent des coups critiques sur un jet de 18 ou plus."],
  },
  {
    id: 'alerte', name: 'Alerte', category: 'Combat',
    description: "Tu guettes constamment tes environs, prêt à affronter n'importe quel danger. Il devient difficile de te surprendre.",
    effects: ["+5 au jet d'initiative."],
  },
  {
    id: 'tir-precision', name: 'Tir de précision', category: 'Combat',
    description: "Ton arme de choix est l'arc ou l'arbalète. Tu as une grande facilité à attaquer une cible à distance.",
    effects: ["+2 au attack roll avec un arc ou une arbalète.", "Les arcs et arbalètes font 1d4 dégâts perçants de plus."],
  },
  {
    id: 'duelliste-defenseur', name: 'Duelliste défenseur', category: 'Combat',
    description: "Tu as développé une défense efficace utilisant ton arme, capable de parades spectaculaires.",
    effects: ["Si tu as une rapière, un sabre, une épée ou une dague en main principale sans autre arme ni bouclier en seconde main : tu ajoutes ton bonus de dextérité à ton AC."],
  },
  {
    id: 'ambidextrie', name: 'Ambidextrie', category: 'Combat',
    description: "Tu aimes avoir une arme dans chaque main et te laisser emporter dans un tourbillon de furie.",
    effects: ["Force ou dextérité +1.", "Si tu as une arme du même type dans chaque main : AC +1."],
  },
  {
    id: 'colere-destructrice', name: 'Colère destructrice', category: 'Combat',
    description: "Lorsque tu te bats, tes émotions t'emportent totalement dans une colère violente.",
    effects: ["Rage : Utilisable seulement s'il te manque au moins 10 PV. Action bonus. La prochaine attaque fait 1d8 de plus."],
  },
  {
    id: 'artiste-martial', name: 'Artiste martial', category: 'Combat',
    description: "À la manière d'un moine, tu utilises tes mains et tes pieds comme des armes.",
    effects: ["Lorsque tu attaques sans arme (1d4), tu ajoutes à la fois ton bonus de dextérité et de force au attack roll et aux dégâts."],
  },
  {
    id: 'bagarreur', name: 'Bagarreur', category: 'Combat',
    description: "Tout le temps passé à te battre commence finalement à porter fruit.",
    effects: ["Force ou dextérité +1.", "Les attaques non armées font 1d4 de plus.", "PV +6."],
  },
  {
    id: 'attaques-sauvages', name: 'Attaques sauvages', category: 'Combat',
    description: "Tu attaques sans souci pour ta propre sécurité. Tout ce qui compte est que ton adversaire soit détruit.",
    effects: ["Une fois par long rest, tu peux faire une attaque supplémentaire sans utiliser d'action ou d'action bonus."],
  },
  {
    id: 'frappe-acier', name: "Frappe d'acier", category: 'Combat',
    description: "Tu as maîtrisé l'art de renforcer tes coups avec une puissance brutale.",
    effects: ["Force +1.", "Avec une arme à une main : tu peux dépenser une action bonus pour augmenter les dégâts de la prochaine attaque de 1d6 dégâts contondants."],
  },
  {
    id: 'berserk', name: 'Berserk', category: 'Combat',
    description: "Tu puises dans une colère irrationnelle, décuplant ta force pendant un court instant.",
    effects: ["Une fois par long rest. Aucun coût d'action. +4 force jusqu'à la fin de ton tour."],
  },
  {
    id: 'sang-froid', name: 'Sang-froid', category: 'Combat',
    description: "Tu as appris à tuer sans pitié, sans hésitation. Ta précision devient mortelle.",
    effects: ["Dextérité +1.", "Une fois par long rest. Au coût de ton action et action bonus, tu fais une attaque. Si elle touche, c'est un coup critique (annoncer avant de rouler)."],
  },
  {
    id: 'aura-devastation', name: 'Aura de dévastation', category: 'Combat',
    description: "Ta seule présence est suffisante pour déstabiliser les adversaires. Ta volonté impose le respect et la peur.",
    effects: ["Charisme +1.", "Les saving throws que tu fais subir à des ennemis ont +2 de difficulté."],
  },
  {
    id: 'prevot-arme', name: "Prévôt d'arme", category: 'Combat',
    description: "Tu as développé une maîtrise exceptionnelle avec un type d'arme spécifique.",
    effects: ["Tu gagnes expertise avec un type d'arme au choix."],
  },
  {
    id: 'arme-maudite', name: 'Arme maudite', category: 'Combat',
    description: "Tu forges un pacte avec un dieu sombre. En échange d'un peu de ta vitalité, une arme devient maudite.",
    effects: ["−6 PV.", "Une arme devient légendaire : inflige 1d6 dégâts nécrotiques (Laeth), froids (Sugriok) ou acides (Talkus) par niveau.", "Foi +1."],
  },

  // ── ARMURES & DÉFENSE ──
  {
    id: 'blinde', name: 'Blindé', category: 'Armures & Défense',
    description: "Ton corps est habitué à subir les douleurs les plus intenses. Tu as développé une résistance naturelle.",
    effects: ["Résistance +1.", "PV +8."],
  },
  {
    id: 'heritier-sanguin', name: 'Héritier sanguin', category: 'Armures & Défense', restriction: 'Vampire seulement.',
    description: "Ta force vampirique s'accroît. Ton héritage te donne des pouvoirs insoupçonnés.",
    effects: ["Un pouvoir vampirique au choix.", "Charges vampiriques +1."],
  },
  {
    id: 'heritage-draconique', name: 'Héritage draconique', category: 'Armures & Défense',
    description: "Ta peau développe une dureté, une robustesse. Des écailles colorées apparaissent sur ton corps.",
    effects: ["Sans armure, AC de base = 13 au lieu de 10.", "Résistance à un élément au choix."],
  },
  {
    id: 'armure-legere', name: 'Armure légère', category: 'Armures & Défense',
    description: "Ton entraînement te permet de porter des armures légères de manière efficace.",
    effects: ["Compétence avec les armures légères."],
  },
  {
    id: 'armure-moyenne', name: 'Armure moyenne', category: 'Armures & Défense',
    requires: 'Armure légère',
    description: "Ton entraînement te permet de porter des armures moyennes de manière efficace.",
    effects: ["Compétence avec les armures moyennes."],
  },
  {
    id: 'armure-lourde', name: 'Armure lourde', category: 'Armures & Défense',
    requires: 'Armure moyenne',
    description: "Ton entraînement te permet de porter des armures lourdes de manière efficace.",
    effects: ["Compétence avec les armures lourdes."],
  },
  {
    id: 'maitrise-armure-legere', name: "Maîtrise de l'armure légère", category: 'Armures & Défense',
    requires: 'Armure légère',
    description: "Tu portes l'armure légère comme une seconde peau, te permettant de mieux te défendre.",
    effects: ["En armure légère : ajoute ton bonus de dextérité à ton AC."],
  },
  {
    id: 'maitrise-armure-moyenne', name: "Maîtrise de l'armure moyenne", category: 'Armures & Défense',
    requires: 'Armure moyenne',
    description: "Expert des armures moyennes, tu trouves la parfaite balance entre mobilité et défense.",
    effects: ["Les armures moyennes donnent 1 AC de plus que leur valeur de base.", "Vitesse +1."],
  },
  {
    id: 'maitrise-armure-lourde', name: "Maîtrise de l'armure lourde", category: 'Armures & Défense',
    requires: 'Armure lourde',
    description: "Porter une armure lourde est une seconde nature, le poids ne te restreignant en rien.",
    effects: ["Force +1.", "En armure lourde : tous les dégâts physiques sont réduits de 3."],
  },
  {
    id: 'maitrise-bouclier', name: 'Maîtrise du bouclier', category: 'Armures & Défense',
    description: "Le maniement du bouclier n'a pas de secrets pour toi.",
    effects: ["Les boucliers fournissent 1 AC de plus."],
  },
  {
    id: 'rempart', name: 'Rempart', category: 'Armures & Défense',
    requires: 'Maîtrise du bouclier',
    description: "Tu es comme un mur infranchissable. Rares sont ceux qui passent tes défenses.",
    effects: ["Avec un bouclier : résistance à tous les dégâts physiques."],
  },
  {
    id: 'heurt-bouclier', name: 'Heurt de bouclier', category: 'Armures & Défense',
    requires: 'Maîtrise du bouclier',
    description: "Tu as constaté que le bouclier peut également servir d'arme.",
    effects: ["Action bonus, une fois par combat : frappe avec le bouclier (1d8 + force). La cible doit réussir un saving throw résistance (10) ou être sonnée un tour."],
  },
  {
    id: 'durable', name: 'Durable', category: 'Armures & Défense',
    description: "Tu es habité d'une grande vitalité qui t'aide à résister aux difficultés.",
    effects: ["Constitution +1.", "Second souffle : une fois par combat. Action bonus. Récupère 1d8 par niveau PV."],
  },
  {
    id: 'inebranlable', name: 'Inébranlable', category: 'Armures & Défense',
    description: "Ta concentration et ta maîtrise de soi sont hors du commun. Rien ne peut te déstabiliser.",
    effects: ["Constitution +1.", "Avantage sur les saving throws qui te jetteraient au sol ou te rendraient stun."],
  },
  {
    id: 'atronach', name: 'Atronach', category: 'Armures & Défense',
    description: "Tu te sens lié à l'énergie magique qui habite le monde. Tu accueilles la magie avec paix.",
    effects: ["Résistance aux dégâts magiques."],
  },
  {
    id: 'sentinelle-nature', name: 'Sentinelle de la nature', category: 'Armures & Défense',
    description: "Tu te sens lié aux forces primordiales de la nature. Le monde naturel te protège et te guide.",
    effects: ["Constitution +1.", "Une fois par long rest. Action bonus. Tu invoques un esprit de la nature, augmentant ton AC de 2 jusqu'à ton prochain tour."],
  },
  {
    id: 'regeneration-rapide', name: 'Régénération rapide', category: 'Armures & Défense',
    description: "Ton corps récupère de ses blessures en plein combat, comme s'il s'alimentait de l'effort physique.",
    effects: ["Au début de ton tour en combat : récupère 2 PV.", "À la fin d'un combat : récupère automatiquement 10 PV."],
  },

  // ── MAGIE ARCANIQUE ──
  {
    id: 'precision-arcanique', name: 'Précision arcanique', category: 'Magie Arcanique',
    restriction: 'Mage, astromancien, sorcier, barde ou nécromancien.',
    description: "Jeter des sorts est comme une seconde nature pour toi. Il est rare que tu rates une cible.",
    effects: ["Intelligence +1.", "+2 aux attack rolls avec des sorts."],
  },
  {
    id: 'sorts-jumeaux', name: 'Sorts jumeaux', category: 'Magie Arcanique',
    restriction: 'Mage, astromancien ou sorcier.',
    description: "Tu es capable de manipuler le voile pour produire deux sortilèges avec une seule incantation.",
    effects: ["Une fois par long rest : un sort à cible unique peut être dédoublé sans coût additionnel."],
  },
  {
    id: 'metamagie', name: 'Métamagie', category: 'Magie Arcanique', restriction: 'Mage seulement.',
    description: "Les fondations de la magie n'ont pas de secrets pour toi.",
    effects: ["Intelligence +1.", "Mana +2."],
  },
  {
    id: 'adepte-elementaire', name: 'Adepte élémentaire', category: 'Magie Arcanique',
    restriction: 'Mage, sorcier ou druide.',
    description: "Tu as une connexion approfondie avec la magie élémentaire.",
    effects: ["Tu apprends : Boule de feu, Décharge électrique ou Pique de glace (au choix).", "Mana +1.", "Tes sorts de feu, glace et électricité ignorent les résistances."],
  },
  {
    id: 'lien-mystique', name: 'Lien mystique', category: 'Magie Arcanique',
    description: "Ton esprit est connecté à une force mystique. Tu peux puiser dans cette énergie pour protéger tes alliés.",
    effects: ["Intelligence ou charisme +1.", "Une fois par long rest. Action bonus. Tu accordes à un allié un bouclier magique (résistance à un type de dégâts) jusqu'à la fin de ton prochain tour."],
  },
  {
    id: 'volonte-fer', name: 'Volonté de fer', category: 'Magie Arcanique',
    description: "Tu possèdes une force mentale à toute épreuve. Aucun charme ne parvient à t'atteindre.",
    effects: ["Intelligence +1.", "Avantage contre les effets magiques qui tentent de manipuler ton esprit ou de te charmer."],
  },
  {
    id: 'lien-naturel', name: 'Lien naturel', category: 'Magie Arcanique',
    description: "Tu as une affinité avec un élément particulier de la nature, t'accordant des pouvoirs exceptionnels.",
    effects: ["Résistance à un élément au choix (feu, glace, électricité).", "Une fois par long rest. Action bonus. Décharge élémentaire : 1d6 par niveau (max 6) de l'élément choisi."],
  },

  // ── COMPÉTENCES & ARTISANAT ──
  {
    id: 'criminel', name: 'Criminel', category: 'Compétences & Artisanat',
    restriction: 'Rogue ou chasseur.',
    description: "Ton passé de malfrat t'a permis de développer une grande compétence à te trouver dans des endroits interdits.",
    effects: ["+3 au saving throw pour se cacher.", "Vitesse +1."],
  },
  {
    id: 'musicien', name: 'Musicien', category: 'Compétences & Artisanat',
    description: "Tu t'es pratiqué à jouer d'un instrument. Tu es capable de captiver l'attention des autres.",
    effects: ["Compétence avec instruments de musique.", "Points mélodieux +1.", "Tu apprends une mélodie de base au choix (Inspiration, Berceuse ou Distortion)."],
  },
  {
    id: 'performeur', name: 'Performeur', category: 'Compétences & Artisanat', restriction: 'Barde seulement.',
    description: "Tu es un entertainer dans l'âme. Tu es capable de livrer performance après performance sans t'épuiser.",
    effects: ["Vitesse ou dextérité +1.", "Points mélodieux +1."],
  },
  {
    id: 'presence-esprit', name: "Présence d'esprit", category: 'Compétences & Artisanat',
    restriction: 'Moine ou mystique seulement.',
    description: "Tu es en paix avec la vie, la nature et les énergies qui flottent autour de toi. Ton corps devient plus fort.",
    effects: ["Force, dextérité, constitution, résistance ou vitesse +1.", "Ki +1."],
  },
  {
    id: 'forgeron', name: 'Forgeron', category: 'Compétences & Artisanat',
    description: "Tu as appris à travailler le métal pour forger des objets, des armes et des armures.",
    effects: ["Peut forger objets simples, armes simples et armures de base."],
  },
  {
    id: 'maitre-forge', name: 'Maître de la forge', category: 'Compétences & Artisanat',
    requires: 'Forgeron',
    description: "Ton expérience dans la forge t'a amené au sommet de ton art.",
    effects: ["Peut forger tous types d'arme et armures avancées."],
  },
  {
    id: 'concocteur', name: 'Concocteur', category: 'Compétences & Artisanat',
    description: "Tu as appris à mixer des ingrédients pour obtenir des fioles avec des propriétés intéressantes.",
    effects: ["Peut mixer des ingrédients pour faire potions et poisons de base."],
  },
  {
    id: 'alchimiste', name: 'Alchimiste', category: 'Compétences & Artisanat',
    requires: 'Concocteur',
    description: "Tu as développé tes talents d'alchimiste, atteignant un niveau élevé de compréhension de tes ingrédients.",
    effects: ["Peut mixer des ingrédients pour faire potions et poisons avancés."],
  },
  {
    id: 'vipere', name: 'Vipère', category: 'Compétences & Artisanat',
    description: "Tel un serpent, tu profites de la vulnérabilité biologique de tes cibles pour les anéantir subtilement.",
    effects: ["Les saving throws des poisons que tu utilises ont +4 de difficulté.", "Les effets des poisons que tu utilises sont doublés."],
  },
  {
    id: 'initie-enchanteur', name: 'Initié enchanteur', category: 'Compétences & Artisanat',
    description: "Tu as développé une capacité à donner des propriétés magiques à certains objets.",
    effects: ["Peut faire des enchantements de base sur des objets, armes et armures."],
  },
  {
    id: 'maitre-arcanes', name: 'Maître des arcanes', category: 'Compétences & Artisanat',
    requires: 'Initié enchanteur',
    description: "Tu as poussé ta compréhension des propriétés magiques, augmentant la force de tes enchantements.",
    effects: ["Peut faire des enchantements avancés sur des objets, armes et armures."],
  },

  // ── SOCIAL & UTILITAIRE ──
  {
    id: 'leader-inspirant', name: 'Leader inspirant', category: 'Social & Utilitaire',
    description: "Tu es une personne charismatique et admirée. Tes mots suffisent à inspirer le courage à tes alliés.",
    effects: ["Charisme +1.", "Discours passionné : une fois par combat, sans action. Trois effets possibles : 1) Alliés heal 1d4/niveau. 2) Alliés ont avantage sur leur prochaine attaque. 3) Alliés crit sur 18 ou moins pour leur prochaine attaque."],
  },
  {
    id: 'oeil-aigle', name: "Œil de l'aigle", category: 'Social & Utilitaire',
    description: "Tu as une acuité visuelle surhumaine, capable de repérer la moindre anomalie à distance.",
    effects: ["Tu peux discerner des détails fins jusqu'à 100 mètres.", "Perception +4. Lorsque tu réussis un test de perception pour détecter un ennemi caché, il est révélé à tous tes alliés."],
  },
  {
    id: 'ailes-nuit', name: 'Ailes de la nuit', category: 'Social & Utilitaire',
    description: "Tu peux invoquer des ailes d'ombre, te permettant de voler sur de courtes distances.",
    effects: ["Dextérité +1.", "Une fois par combat. Action bonus. Vol pendant un tour : déplacement sans attaques d'opportunité + avantage contre les cibles atteintes avec des projectiles."],
  },
  {
    id: 'vitesse-spectrale', name: 'Vitesse spectrale', category: 'Social & Utilitaire',
    description: "Ton corps devient presque intangible, te permettant de glisser dans l'ombre avec une rapidité fantomatique.",
    effects: ["Vitesse +1.", "Une fois par long rest : tu peux te désengager d'un ennemi et bouger sans subir d'attaques d'opportunité."],
  },
  {
    id: 'necrologie', name: 'Nécrologie', category: 'Social & Utilitaire',
    description: "Tu as une capacité innée à entrer en contact avec les morts comme s'ils étaient là, devant toi.",
    effects: ["Tu peux utiliser communion avec la mort une fois par long rest sans coût."],
  },
  {
    id: 'illusion-sonore', name: 'Illusion sonore', category: 'Social & Utilitaire',
    description: "Tu as le pouvoir de faire apparaître des sons à une distance allant jusqu'à une centaine de mètres.",
    effects: ["Charisme +1.", "Une fois par long rest : tu peux créer un son précis (cri, voix, claquement, etc.)."],
  },
  {
    id: 'chef-cuisinier', name: 'Chef cuisinier', category: 'Social & Utilitaire',
    description: "Tu as un talent pour concocter des repas nutritifs et réconfortants.",
    effects: ["Dextérité +1.", "Lorsque tu prépares un repas : chaque membre du groupe reçoit +3 PV maximum temporaires pendant 24h (restauré à chaque repas)."],
  },
  {
    id: 'raconteur', name: 'Raconteur', category: 'Social & Utilitaire',
    description: "Tu es doué pour raconter des histoires qui ravivent les esprits.",
    effects: ["Charisme +1.", "Une fois par long rest, en marche ou au camp : tu peux octroyer +2 au prochain attack roll ou saving throw de tes alliés."],
  },
];

const CATEGORIES = ['Divin', 'Combat', 'Armures & Défense', 'Magie Arcanique', 'Compétences & Artisanat', 'Social & Utilitaire'];

const CATEGORY_COLORS: Record<string, { bg: string; border: string; badge: string; text: string }> = {
  'Divin':                  { bg: '#fffbeb', border: '#d4a017', badge: '#d4a017', text: '#7c5a00' },
  'Combat':                 { bg: '#fff1f0', border: '#c0392b', badge: '#c0392b', text: '#7a1a10' },
  'Armures & Défense':      { bg: '#f0f4ff', border: '#2c5fa5', badge: '#2c5fa5', text: '#1a3a6e' },
  'Magie Arcanique':        { bg: '#f5f0ff', border: '#7c3aed', badge: '#7c3aed', text: '#4b1d96' },
  'Compétences & Artisanat':{ bg: '#f0fdf4', border: '#16a34a', badge: '#16a34a', text: '#14532d' },
  'Social & Utilitaire':    { bg: '#fff7ed', border: '#c2410c', badge: '#c2410c', text: '#7c2d12' },
};

const B = '1px solid #000';

export function FeatSelector() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Tous');
  const [view, setView] = useState<'select' | 'summary'>('select');
  const summaryRef = useRef<HTMLDivElement>(null);

  const toggle = (id: string) => setSelected(prev => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  const filtered = FEATS.filter(f => {
    const matchCat = activeCategory === 'Tous' || f.category === activeCategory;
    const q = search.toLowerCase();
    const matchSearch = !q || f.name.toLowerCase().includes(q) || f.description.toLowerCase().includes(q) || f.effects.some(e => e.toLowerCase().includes(q));
    return matchCat && matchSearch;
  });

  const selectedFeats = FEATS.filter(f => selected.has(f.id));

  const exportSummaryPDF = async () => {
    if (!summaryRef.current) return;
    const el = summaryRef.current;

    // Override oklch CSS variables not supported by html2canvas
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
      const canvas = await html2canvas(clone, {
        scale: 2, backgroundColor: '#fff', logging: false, useCORS: true,
        width: el.offsetWidth,
      });
      // Restore CSS variables
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
          const ctx = sliceCanvas.getContext('2d')!;
          ctx.drawImage(canvas, 0, y, canvas.width, sliceH, 0, 0, canvas.width, sliceH);
          pdf.addImage(sliceCanvas.toDataURL('image/png'), 'PNG', 0, 0, imgW, sliceH / scale);
          y += sliceH;
          pageNum++;
        }
      }
      pdf.save('feats-selection.pdf');
    } catch (e) {
      console.error(e);
      // Restore CSS variables on error too
      for (const [p, v] of Object.entries(saved)) {
        if (v) root.style.setProperty(p, v); else root.style.removeProperty(p);
      }
      alert("Erreur lors de l'export PDF.");
    } finally {
      document.body.removeChild(clone);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#e8e4dc', fontFamily: 'serif', color: '#000' }}>
      {/* Header */}
      <div style={{ background: '#2c2416', color: '#f5e6c0', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <div style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '1px' }}>Feats — Campagne D&D</div>
          <div style={{ fontSize: '12px', opacity: 0.7 }}>Niveaux 2 · 5 · 8 · 12 · 15 · 18 · 20</div>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ fontSize: '13px', background: '#c0392b', color: '#fff', borderRadius: '20px', padding: '3px 12px', fontWeight: 700 }}>
            {selected.size} feat{selected.size > 1 ? 's' : ''} choisie{selected.size > 1 ? 's' : ''}
          </div>
          <button onClick={() => setView(view === 'select' ? 'summary' : 'select')}
            style={{ background: '#c0392b', color: '#fff', border: 'none', borderRadius: '4px', padding: '7px 16px', cursor: 'pointer', fontSize: '13px', fontWeight: 700 }}>
            {view === 'select' ? 'Voir le résumé →' : '← Retour à la liste'}
          </button>
          {view === 'summary' && (
            <button onClick={exportSummaryPDF}
              style={{ background: '#555', color: '#fff', border: 'none', borderRadius: '4px', padding: '7px 14px', cursor: 'pointer', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Download size={14} /> PDF
            </button>
          )}
        </div>
      </div>

      {view === 'select' ? (
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px 16px' }}>
          {/* Search + Filter */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher une feat..."
                style={{ width: '100%', padding: '8px 8px 8px 32px', border: B, borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box', background: '#fff', outline: 'none' }} />
              {search && <X size={14} onClick={() => setSearch('')} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#888' }} />}
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {['Tous', ...CATEGORIES].map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: '5px 12px', border: B, borderRadius: '20px', cursor: 'pointer', fontSize: '12px', fontWeight: activeCategory === cat ? 700 : 400,
                    background: activeCategory === cat ? '#2c2416' : '#fff', color: activeCategory === cat ? '#f5e6c0' : '#333',
                  }}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '10px' }}>
            {filtered.map(feat => {
              const isSelected = selected.has(feat.id);
              const col = CATEGORY_COLORS[feat.category];
              return (
                <div key={feat.id} onClick={() => toggle(feat.id)}
                  style={{
                    border: isSelected ? `2px solid ${col.border}` : '1px solid #ccc',
                    borderRadius: '6px', background: isSelected ? col.bg : '#fff',
                    padding: '10px 12px', cursor: 'pointer', transition: 'all 0.15s',
                    boxShadow: isSelected ? `0 2px 8px ${col.border}33` : '0 1px 3px rgba(0,0,0,0.07)',
                    display: 'flex', flexDirection: 'column', gap: '4px',
                    position: 'relative',
                  }}>
                  {/* Top row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
                      {isSelected
                        ? <CheckSquare size={16} color={col.border} style={{ flexShrink: 0 }} />
                        : <Square size={16} color="#aaa" style={{ flexShrink: 0 }} />
                      }
                      <span style={{ fontWeight: 700, fontSize: '14px', color: isSelected ? col.text : '#1a1a1a' }}>{feat.name}</span>
                    </div>
                    <span style={{ fontSize: '10px', background: col.badge, color: '#fff', borderRadius: '10px', padding: '2px 8px', whiteSpace: 'nowrap', flexShrink: 0 }}>
                      {feat.category}
                    </span>
                  </div>
                  {feat.restriction && (
                    <div style={{ fontSize: '10px', color: '#888', fontStyle: 'italic' }}>{feat.restriction}</div>
                  )}
                  {feat.requires && (
                    <div style={{ fontSize: '10px', color: col.text, background: col.bg, border: `1px solid ${col.border}`, borderRadius: '4px', padding: '1px 6px', display: 'inline-block', alignSelf: 'flex-start' }}>
                      Nécessite : {feat.requires}
                    </div>
                  )}
                  <div style={{ fontSize: '12px', color: '#555', lineHeight: '1.4' }}>{feat.description}</div>
                  <div style={{ borderTop: '1px solid #eee', paddingTop: '4px', marginTop: '2px' }}>
                    {feat.effects.map((eff, i) => (
                      <div key={i} style={{ fontSize: '12px', color: '#222', display: 'flex', gap: '4px', lineHeight: '1.4' }}>
                        <span style={{ color: col.border, flexShrink: 0 }}>▸</span>
                        <span>{eff}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#888', padding: '40px', fontSize: '14px' }}>
                Aucune feat trouvée.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Summary view */
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px 16px' }}>
          <div ref={summaryRef} style={{ background: '#fff', border: B, boxShadow: '0 2px 20px rgba(0,0,0,0.15)' }}>
            {/* Summary header */}
            <div style={{ background: '#2c2416', color: '#f5e6c0', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 700 }}>Résumé des Feats</div>
                <div style={{ fontSize: '12px', opacity: 0.75 }}>Feats (niveaux 2-5-8-12-15-18-20)</div>
              </div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#d4a017' }}>{selected.size}</div>
            </div>

            {selected.size === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#888', fontSize: '14px' }}>
                Aucune feat sélectionnée. Retourne à la liste pour en choisir.
              </div>
            ) : (
              <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '0' }}>
                {CATEGORIES.map(cat => {
                  const catFeats = selectedFeats.filter(f => f.category === cat);
                  if (catFeats.length === 0) return null;
                  const col = CATEGORY_COLORS[cat];
                  return (
                    <div key={cat} style={{ marginBottom: '16px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: col.text, background: col.bg, border: `1px solid ${col.border}`, borderRadius: '4px', padding: '4px 12px', marginBottom: '8px', display: 'inline-block' }}>
                        {cat}
                      </div>
                      {catFeats.map((feat, idx) => (
                        <div key={feat.id} style={{
                          borderLeft: `3px solid ${col.border}`, paddingLeft: '12px',
                          marginBottom: idx < catFeats.length - 1 ? '10px' : '0',
                        }}>
                          <div style={{ fontWeight: 700, fontSize: '14px', color: '#1a1a1a', marginBottom: '2px' }}>{feat.name}</div>
                          {feat.restriction && <div style={{ fontSize: '11px', color: '#888', fontStyle: 'italic', marginBottom: '2px' }}>{feat.restriction}</div>}
                          {feat.requires && <div style={{ fontSize: '11px', color: col.text, marginBottom: '2px' }}>Nécessite : {feat.requires}</div>}
                          <div style={{ fontSize: '12px', color: '#555', marginBottom: '4px', lineHeight: '1.4' }}>{feat.description}</div>
                          <div>
                            {feat.effects.map((eff, i) => (
                              <div key={i} style={{ fontSize: '12px', color: '#222', display: 'flex', gap: '4px', lineHeight: '1.4' }}>
                                <span style={{ color: col.border, flexShrink: 0 }}>▸</span>
                                <span>{eff}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}