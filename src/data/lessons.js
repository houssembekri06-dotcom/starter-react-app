// Curriculum iInvest — 6 unités, 29 leçons au total.
// Unité 1 : contenu rédigé en détail (plusieurs blocs pédagogiques par leçon).
// Unités 2-6 : contenu généré via `buildLesson` à partir d'un gabarit léger
// (1 paragraphe + 1 question de quiz), mais réellement jouable de bout en bout —
// c'est ce qui permet de débloquer tous les paliers de divulgation progressive
// de la fiche actif et du flux d'investissement.

let globalIndexCounter = 0;

function buildLesson({ id, unitId, title, xp = 10, content, quiz }) {
  globalIndexCounter += 1;
  return {
    id,
    unitId,
    title,
    xp,
    globalIndex: globalIndexCounter,
    content,
    quiz,
  };
}

function buildUnit({ id, order, title, subtitle, icon, lessonDefs }) {
  return {
    id,
    order,
    title,
    subtitle,
    icon,
    lessons: lessonDefs.map((def, i) =>
      buildLesson({ id: `${id}-l${i + 1}`, unitId: id, ...def })
    ),
  };
}

// ---------- Unité 1 — rédigée en détail ----------

const unit1 = buildUnit({
  id: 'u1',
  order: 1,
  title: "Les bases de l'épargne",
  subtitle: 'Comprendre son argent avant de le faire fructifier',
  icon: 'piggy-bank',
  lessonDefs: [
    {
      title: "C'est quoi l'argent, et pourquoi épargner ?",
      content: [
        {
          heading: "L'argent, un outil d'échange",
          body: "L'argent sert à échanger des biens et des services sans avoir à troquer directement. Sa vraie valeur, c'est ce qu'il vous permet de faire : vous nourrir, vous loger, vous projeter dans l'avenir.",
        },
        {
          heading: 'Pourquoi épargner ?',
          body: "Épargner, c'est mettre de côté une partie de ce que vous gagnez aujourd'hui pour vous protéger des imprévus et financer vos projets futurs — un voyage, des études, un achat important, ou simplement votre tranquillité d'esprit.",
        },
      ],
      quiz: {
        question: "Quel est le principal intérêt d'épargner régulièrement ?",
        options: [
          'Se protéger des imprévus et financer ses projets futurs',
          'Avoir plus de billets à la maison',
          "Payer plus d'impôts",
          "Ça n'a pas vraiment d'intérêt",
        ],
        correctIndex: 0,
        explanation: "L'épargne crée un coussin de sécurité et vous donne les moyens de réaliser vos projets sans dépendre d'un emprunt.",
      },
    },
    {
      title: 'Le budget : suivre ses revenus et ses dépenses',
      content: [
        {
          heading: 'La base : savoir où va votre argent',
          body: "Un budget, c'est simplement la liste de ce que vous gagnez (revenus) et de ce que vous dépensez (charges fixes, plaisirs, imprévus). Sans cette vue d'ensemble, impossible de savoir combien vous pouvez réellement épargner.",
        },
        {
          heading: 'La règle simple 50/30/20',
          body: 'Une méthode courante : 50 % du revenu pour les besoins essentiels, 30 % pour les envies, 20 % pour l\'épargne et les investissements. Ce n\'est pas une règle absolue, mais un bon point de départ.',
        },
      ],
      quiz: {
        question: 'Dans la règle 50/30/20, quelle part est dédiée à l\'épargne ?',
        options: ['50 %', '30 %', '20 %', '0 %'],
        correctIndex: 2,
        explanation: "20 % du revenu est une cible raisonnable à consacrer à l'épargne et à l'investissement chaque mois.",
      },
    },
    {
      title: "L'épargne de précaution",
      content: [
        {
          heading: 'Un matelas de sécurité',
          body: "L'épargne de précaution est une somme disponible immédiatement, réservée aux imprévus (panne, perte d'emploi, frais médicaux). On recommande généralement 3 à 6 mois de dépenses courantes.",
        },
        {
          heading: 'Avant d\'investir',
          body: "Il est conseillé de constituer cette épargne de précaution avant de commencer à investir : elle évite d'avoir à revendre ses investissements en urgence, parfois à perte, en cas de coup dur.",
        },
      ],
      quiz: {
        question: "Que doit-on faire avant de commencer à investir, en général ?",
        options: [
          'Emprunter le plus possible',
          "Constituer une épargne de précaution",
          'Tout investir immédiatement',
          'Attendre la retraite',
        ],
        correctIndex: 1,
        explanation: "Une épargne de précaution évite de devoir revendre ses investissements en urgence en cas d'imprévu.",
      },
    },
    {
      title: 'Les intérêts composés',
      content: [
        {
          heading: 'Les intérêts qui rapportent des intérêts',
          body: "Les intérêts composés, c'est le fait de gagner des intérêts non seulement sur votre capital de départ, mais aussi sur les intérêts déjà accumulés. Plus le temps passe, plus l'effet s'accélère.",
        },
        {
          heading: 'Un exemple concret',
          body: '1 000 € placés à 5 % par an deviennent 1 050 € après 1 an. La 2ᵉ année, les 5 % s\'appliquent sur 1 050 €, pas sur 1 000 €. Sur 20 ans, la différence avec des intérêts simples devient énorme.',
        },
      ],
      quiz: {
        question: 'Que sont les intérêts composés ?',
        options: [
          'Des intérêts calculés uniquement sur le capital de départ',
          'Des intérêts qui rapportent eux-mêmes des intérêts au fil du temps',
          'Une taxe sur l\'épargne',
          'Un type de compte bancaire',
        ],
        correctIndex: 1,
        explanation: "C'est le mécanisme clé de la croissance de l'épargne sur le long terme : les gains génèrent eux-mêmes des gains.",
      },
    },
    {
      title: "Fixer un objectif d'épargne",
      content: [
        {
          heading: 'Un objectif clair, chiffré, daté',
          body: 'Épargner "pour épargner" motive rarement sur la durée. Un objectif concret — par exemple 3 000 € en 2 ans pour un projet précis — donne un cap clair et permet de calculer combien mettre de côté chaque mois.',
        },
        {
          heading: 'Automatiser pour tenir la distance',
          body: "Mettre en place un virement automatique juste après la réception du salaire est l'une des méthodes les plus efficaces pour épargner sans y penser, et sans être tenté de dépenser cet argent avant.",
        },
      ],
      quiz: {
        question: "Quelle méthode aide le plus à tenir un objectif d'épargne dans la durée ?",
        options: [
          'Épargner ce qu\'il reste en fin de mois, s\'il en reste',
          'Un virement automatique programmé dès la réception du salaire',
          'Ne pas se fixer de montant',
          'Épargner uniquement une fois par an',
        ],
        correctIndex: 1,
        explanation: "Automatiser l'épargne dès le versement du salaire évite de dépendre de la volonté au quotidien.",
      },
    },
  ],
});

// ---------- Unités 2-6 — gabarit léger (1 paragraphe + 1 quiz) ----------

const unit2 = buildUnit({
  id: 'u2',
  order: 2,
  title: 'Découvrir la bourse',
  subtitle: 'Comprendre comment les marchés fonctionnent',
  icon: 'chart-candle',
  lessonDefs: [
    {
      title: "Qu'est-ce qu'un cours boursier ?",
      content: [{ body: "Le cours boursier est le prix auquel un actif (action, fonds, cryptomonnaie…) s'échange à un instant donné. Il évolue en continu selon les achats et les ventes des investisseurs sur le marché." }],
      quiz: {
        question: 'Le cours boursier correspond à…',
        options: ['Le prix fixé une fois par an', "Le prix d'échange d'un actif à un instant donné", 'Le salaire du dirigeant', "Un impôt sur l'épargne"],
        correctIndex: 1,
        explanation: 'Le cours change en permanence selon l\'offre et la demande sur le marché.',
      },
    },
    {
      title: 'Actions, obligations, fonds : les différences',
      content: [{ body: 'Une action est une part de propriété d\'une entreprise. Une obligation est un prêt que vous faites à une entreprise ou un État, remboursé avec intérêt. Un fonds regroupe plusieurs actifs pour mutualiser le risque.' }],
      quiz: {
        question: "Quand vous achetez une action, vous devenez…",
        options: ['Créancier de l\'entreprise', 'Propriétaire d\'une part de l\'entreprise', 'Salarié de l\'entreprise', 'Fournisseur de l\'entreprise'],
        correctIndex: 1,
        explanation: "L'action représente une part du capital de l'entreprise : vous en devenez actionnaire.",
      },
    },
    {
      title: 'Lire un graphique dans le temps',
      content: [{ body: "Un graphique de prix montre l'évolution d'un actif sur une période choisie (1 jour, 1 mois, 1 an…). Une ligne montante signale une hausse du cours, une ligne descendante une baisse — mais le passé ne garantit jamais l'avenir." }],
      quiz: {
        question: "Un graphique en ligne montrant une courbe montante sur 1 an indique…",
        options: ["Que le prix va forcément continuer à monter", "Que le prix a globalement augmenté sur cette période passée", "Qu'il faut vendre immédiatement", 'Rien du tout'],
        correctIndex: 1,
        explanation: "Le graphique décrit le passé. C'est une information utile, mais pas une prédiction garantie.",
      },
    },
    {
      title: 'Offre et demande',
      content: [{ body: "Quand plus d'investisseurs veulent acheter un actif que le vendre, le prix monte. À l'inverse, quand plus de monde veut vendre qu'acheter, le prix baisse. C'est le mécanisme de base derrière chaque variation de cours." }],
      quiz: {
        question: "Si la demande pour un actif dépasse largement l'offre, le prix a tendance à…",
        options: ['Monter', 'Baisser', 'Rester figé par la loi', "Ne dépendre que de l'État"],
        correctIndex: 0,
        explanation: "Plus d'acheteurs que de vendeurs disponibles pousse le prix à la hausse.",
      },
    },
  ],
});

const unit3 = buildUnit({
  id: 'u3',
  order: 3,
  title: 'Devenir actionnaire',
  subtitle: 'Vos premiers pas dans un ordre d\'achat',
  icon: 'building-bank',
  lessonDefs: [
    {
      title: 'Comment acheter une action ou un fonds',
      content: [{ body: "Pour acheter un actif, vous passez un ordre via une plateforme de courtage : vous choisissez l'actif, le montant ou le nombre de parts, puis vous validez. L'actif apparaît ensuite dans votre portefeuille." }],
      quiz: {
        question: 'Pour acheter une action, il faut…',
        options: ['Contacter directement l\'entreprise', 'Passer un ordre via une plateforme de courtage', 'Attendre un tirage au sort', 'Aucune de ces réponses'],
        correctIndex: 1,
        explanation: 'Les plateformes de courtage (ou "brokers") sont l\'intermédiaire standard pour acheter des actifs financiers.',
      },
    },
    {
      title: 'Plus-value et moins-value',
      content: [{ body: "La plus-value est le gain réalisé quand vous revendez un actif plus cher que son prix d'achat. La moins-value est la perte quand vous le revendez moins cher. Tant que vous n'avez pas vendu, le gain ou la perte est seulement 'latent'." }],
      quiz: {
        question: "Vous achetez une part à 100 € et la revendez à 120 €. Vous réalisez…",
        options: ['Une moins-value de 20 €', 'Une plus-value de 20 €', 'Aucun gain ni perte', 'Une plus-value de 100 €'],
        correctIndex: 1,
        explanation: 'La différence entre le prix de vente et le prix d\'achat, ici positive, est une plus-value de 20 €.',
      },
    },
    {
      title: 'Le prix moyen d\'achat',
      content: [{ body: "Si vous achetez le même actif plusieurs fois à des prix différents, le prix moyen d'achat est la moyenne pondérée de tous vos achats. C'est ce prix, et non le tout premier, qui sert de référence pour calculer votre gain ou votre perte." }],
      quiz: {
        question: 'Le prix moyen d\'achat sert à…',
        options: ["Fixer le prix futur de l'actif", "Calculer votre gain ou perte réel sur l'ensemble de vos achats", "Payer moins de frais", "Rien de particulier"],
        correctIndex: 1,
        explanation: "C'est la référence pour savoir si votre position est globalement gagnante ou perdante.",
      },
    },
    {
      title: 'Les frais et leur impact',
      content: [{ body: "Chaque achat ou vente peut engendrer des frais (frais de transaction, frais de gestion annuels pour les fonds). Même faibles en apparence, ils réduisent votre rendement réel, surtout s'ils s'appliquent chaque année sur le long terme." }],
      quiz: {
        question: 'Des frais de gestion annuels de 2 % au lieu de 0,2 % sur 20 ans…',
        options: ['N\'ont aucun impact notable', 'Peuvent réduire significativement le rendement final', 'Augmentent automatiquement vos gains', 'Ne concernent que les obligations'],
        correctIndex: 1,
        explanation: "Des frais plus élevés, répétés chaque année, rognent une part importante des gains composés sur le long terme.",
      },
    },
  ],
});

const unit4 = buildUnit({
  id: 'u4',
  order: 4,
  title: 'Construire un portefeuille solide',
  subtitle: 'Répartir pour mieux résister aux aléas',
  icon: 'chart-pie',
  lessonDefs: [
    {
      title: 'La diversification',
      content: [{ body: "Diversifier, c'est répartir son argent entre plusieurs actifs différents (secteurs, zones géographiques, types d'actifs) plutôt que tout miser sur un seul. Si un actif baisse, les autres peuvent compenser." }],
      quiz: {
        question: 'Diversifier son portefeuille permet surtout de…',
        options: ["Garantir des gains", "Réduire le risque en ne dépendant pas d'un seul actif", "Payer moins de frais", "Éviter toute perte"],
        correctIndex: 1,
        explanation: "La diversification réduit le risque global, sans jamais garantir des gains ni éliminer totalement le risque.",
      },
    },
    {
      title: 'Risque et rendement',
      content: [{ body: "En général, plus le rendement potentiel d'un actif est élevé, plus son risque de perte l'est aussi. Un placement 'sans risque' offre un rendement faible ; un actif volatil peut rapporter beaucoup, ou faire perdre beaucoup." }],
      quiz: {
        question: 'La relation habituelle entre risque et rendement potentiel est…',
        options: ['Aucune relation', 'Plus de risque potentiel va souvent avec plus de rendement potentiel', 'Le risque élevé garantit un rendement élevé', 'Le risque n\'existe que pour les obligations'],
        correctIndex: 1,
        explanation: "C'est un principe central de l'investissement, même si un rendement élevé n'est jamais garanti.",
      },
    },
    {
      title: 'Les fonds indiciels et ETF',
      content: [{ body: "Un ETF (fonds indiciel coté) réplique automatiquement la performance d'un indice (par exemple les 500 plus grandes entreprises américaines). Il offre une diversification instantanée avec des frais généralement bas." }],
      quiz: {
        question: 'Un ETF qui suit un indice permet de…',
        options: ["Investir dans une seule entreprise à la fois", "Se diversifier instantanément sur de nombreuses entreprises", "Éviter tous les frais", "Garantir un rendement fixe"],
        correctIndex: 1,
        explanation: "En répliquant un indice large, un ETF diversifie automatiquement votre investissement.",
      },
    },
    {
      title: 'Investir régulièrement',
      content: [{ body: "Investir une somme fixe chaque mois (plutôt qu'un gros montant en une fois) lisse le prix d'achat moyen dans le temps et réduit l'impact du mauvais timing. C'est ce qu'on appelle l'investissement programmé." }],
      quiz: {
        question: "L'un des avantages d'investir une somme fixe chaque mois est…",
        options: ["De garantir de toujours acheter au prix le plus bas", "De lisser le prix moyen d'achat dans le temps", "D'éliminer tout risque", "De ne payer aucun frais"],
        correctIndex: 1,
        explanation: 'Cette méthode ("dollar-cost averaging") réduit l\'impact d\'un mauvais moment d\'achat isolé.',
      },
    },
  ],
});

const unit5 = buildUnit({
  id: 'u5',
  order: 5,
  title: 'Analyser un actif comme un pro',
  subtitle: 'Les données à connaître avant d\'investir',
  icon: 'report-analytics',
  lessonDefs: [
    {
      title: 'Classement et capitalisation boursière',
      content: [{ body: "La capitalisation boursière est la valeur totale d'un actif (prix × quantité en circulation). Elle sert à classer les actifs par taille et donne une idée de leur poids sur le marché." }],
      quiz: {
        question: 'La capitalisation boursière se calcule comme…',
        options: ['Le prix seul', "Le prix multiplié par la quantité en circulation", "Le chiffre d'affaires annuel", "Le nombre d'investisseurs"],
        correctIndex: 1,
        explanation: "C'est la mesure standard pour comparer la taille de deux actifs différents.",
      },
    },
    {
      title: 'Rendement et volume',
      content: [{ body: "Le rendement annuel moyen indique la performance historique d'un actif sur plusieurs années. Le volume (souvent mesuré sur 24h) indique combien de parts ont été échangées : un volume élevé signale un actif liquide, facile à acheter ou vendre rapidement." }],
      quiz: {
        question: 'Un volume d\'échange élevé sur 24h indique généralement…',
        options: ["Que l'actif est difficile à acheter ou vendre", "Que l'actif est liquide, facile à échanger rapidement", "Que le prix ne bougera plus", "Que l'actif est réservé aux professionnels"],
        correctIndex: 1,
        explanation: "Plus le volume est élevé, plus il est facile de trouver une contrepartie pour acheter ou vendre.",
      },
    },
    {
      title: "L'offre en circulation",
      content: [{ body: "L'offre en circulation est le nombre total de parts ou de jetons existants et disponibles sur le marché. Elle influence directement la capitalisation boursière et donne un repère sur la rareté relative d'un actif." }],
      quiz: {
        question: "L'offre en circulation correspond à…",
        options: ['Le nombre de parts existantes disponibles sur le marché', 'Le nombre d\'investisseurs actifs', 'Le montant des frais de gestion', 'La devise de cotation'],
        correctIndex: 0,
        explanation: 'C\'est une donnée clé, combinée au prix, pour calculer la capitalisation boursière.',
      },
    },
    {
      title: 'Le plus haut historique et les ranges de prix',
      content: [{ body: "Le plus haut historique (ATH, 'all-time high') est le prix le plus élevé jamais atteint par un actif. Le range de prix sur une période (par ex. 52 semaines) montre l'écart entre le plus bas et le plus haut récent, utile pour situer le prix actuel." }],
      quiz: {
        question: "L'ATH ('all-time high') désigne…",
        options: ['Le prix moyen sur 1 an', 'Le prix le plus bas jamais atteint', 'Le prix le plus haut jamais atteint', 'Le prix prévu pour demain'],
        correctIndex: 2,
        explanation: "L'ATH est un repère historique, pas une prédiction du prix futur.",
      },
    },
    {
      title: "L'activité de trading",
      content: [{ body: "Le ratio achats/ventes (pression acheteuse vs vendeuse) donne une indication de la dynamique à court terme du marché sur un actif : plus d'acheteurs actifs que de vendeurs peut précéder une hausse, et inversement." }],
      quiz: {
        question: 'Une forte pression acheteuse sur un actif signale…',
        options: ["Qu'il n'y a plus d'échanges possibles", "Une dynamique où les acheteurs dominent temporairement les vendeurs", "Que l'actif va forcément chuter", "Que les frais vont augmenter"],
        correctIndex: 1,
        explanation: "C'est un indicateur de dynamique de marché à court terme, pas une garantie de tendance future.",
      },
    },
    {
      title: 'Comprendre ce qu\'on achète',
      content: [{ body: "Avant d'investir dans un actif, il est utile de lire sa description ('À propos') : quel projet, quelle entreprise ou quel indice se cache derrière ? Comprendre ce qu'on possède aide à investir avec plus de sérénité sur le long terme." }],
      quiz: {
        question: "Pourquoi lire la section 'À propos' d'un actif avant d'investir ?",
        options: ["Pour connaître le mot de passe du compte", "Pour comprendre ce que l'on possède réellement", "Ce n'est jamais utile", "Pour éviter de payer des frais"],
        correctIndex: 1,
        explanation: "Comprendre ce que représente l'actif aide à investir de façon plus réfléchie et sereine.",
      },
    },
  ],
});

const unit6 = buildUnit({
  id: 'u6',
  order: 6,
  title: 'Lire et utiliser le marché comme un pro',
  subtitle: 'Les outils d\'une vraie plateforme d\'investissement',
  icon: 'stack-2',
  lessonDefs: [
    {
      title: 'Le carnet d\'ordres et le spread',
      content: [{ body: "Le carnet d'ordres liste les ordres d'achat (bids) et de vente (asks) en attente, avec leur prix. Le spread est l'écart entre le meilleur prix d'achat et le meilleur prix de vente : plus il est faible, plus l'actif est liquide." }],
      quiz: {
        question: 'Le spread bid-ask désigne…',
        options: ["Le total des frais de gestion", "L'écart entre le meilleur prix d'achat et le meilleur prix de vente", "La variation sur 24h", "Le nombre d'ordres en attente"],
        correctIndex: 1,
        explanation: "Un spread étroit signale généralement un marché liquide, avec beaucoup d'acheteurs et de vendeurs proches en prix.",
      },
    },
    {
      title: 'Les bougies japonaises',
      content: [{ body: "Chaque bougie ('candlestick') résume l'évolution du prix sur une période : ouverture, clôture, plus haut et plus bas. Une bougie teal signale une hausse sur la période, une bougie rose une baisse." }],
      quiz: {
        question: "Une bougie japonaise représente…",
        options: ["Un seul prix instantané", "L'ouverture, la clôture, le plus haut et le plus bas sur une période", "Uniquement le volume échangé", "Le nombre d'investisseurs"],
        correctIndex: 1,
        explanation: 'Le graphique en bougies condense plus d\'information que la simple ligne de prix.',
      },
    },
    {
      title: 'Ordre au marché vs ordre limite',
      content: [{ body: "Un ordre au marché s'exécute immédiatement, au meilleur prix disponible. Un ordre limite ne s'exécute qu'au prix que vous fixez (ou mieux) — plus de contrôle sur le prix, mais l'exécution n'est pas garantie." }],
      quiz: {
        question: "Quelle est la différence principale entre un ordre au marché et un ordre limite ?",
        options: [
          "Aucune différence",
          "L'ordre au marché s'exécute immédiatement au prix courant, l'ordre limite attend le prix choisi",
          "L'ordre limite est toujours plus rapide",
          "L'ordre au marché nécessite un prix fixé à l'avance",
        ],
        correctIndex: 1,
        explanation: "L'ordre au marché privilégie la vitesse, l'ordre limite privilégie le contrôle du prix.",
      },
    },
    {
      title: 'Stop-loss et take-profit',
      content: [{ body: "Un stop-loss vend automatiquement si le prix descend sous un seuil défini, pour limiter une perte. Un take-profit vend automatiquement si le prix atteint un objectif de gain fixé à l'avance." }],
      quiz: {
        question: 'Un stop-loss sert à…',
        options: ["Garantir un gain minimum", "Limiter automatiquement une perte à un seuil défini", "Augmenter le nombre de parts achetées", "Réduire les frais de gestion"],
        correctIndex: 1,
        explanation: "C'est un filet de sécurité automatique contre une baisse trop importante du prix.",
      },
    },
    {
      title: 'Frais maker/taker et slippage',
      content: [{ body: "Les frais 'maker' (vous ajoutez de la liquidité, ex. ordre limite en attente) sont souvent plus bas que les frais 'taker' (vous prenez la liquidité existante, ex. ordre au marché). Le slippage est l'écart entre le prix attendu et le prix réellement exécuté." }],
      quiz: {
        question: 'Le slippage correspond à…',
        options: ["Un type de frais fixe", "L'écart entre le prix attendu et le prix réellement exécuté", "Le spread bid-ask", "Un bonus de bienvenue"],
        correctIndex: 1,
        explanation: "Sur un marché qui bouge vite ou peu liquide, le prix exécuté peut différer du prix affiché au moment de l'ordre.",
      },
    },
    {
      title: 'Construire son plan d\'investissement personnel',
      content: [{ body: "Un bon plan d'investissement tient compte de vos objectifs, de votre horizon de temps et de votre tolérance au risque. Il combine diversification, régularité et discipline — bien plus utile qu'essayer de deviner le meilleur moment pour acheter." }],
      quiz: {
        question: 'Un plan d\'investissement personnel solide repose avant tout sur…',
        options: [
          "Deviner parfaitement le meilleur moment pour investir",
          "Vos objectifs, votre horizon de temps et une discipline régulière",
          "Investir tout d'un coup dans un seul actif",
          "Ignorer totalement le risque",
        ],
        correctIndex: 1,
        explanation: "La régularité et la cohérence avec ses objectifs comptent bien plus que le timing parfait.",
      },
    },
  ],
});

const TARGET_LESSONS_PER_UNIT = 15;

function padUnit(unit, target = TARGET_LESSONS_PER_UNIT) {
  const existing = unit.lessons.length;
  if (existing >= target) return unit;
  const extras = [];
  for (let i = existing; i < target; i++) {
    const source = unit.lessons[i % existing];
    const n = i - existing + 1;
    extras.push(
      buildLesson({
        id: `${unit.id}-l${i + 1}`,
        unitId: unit.id,
        title: `Entraînement ${n} — ${unit.title}`,
        xp: 8,
        content: [
          {
            heading: 'Révision rapide',
            body: `Petit exercice pour consolider ce que vous avez vu dans l'unité « ${unit.title} ». Répondez à la question suivante pour valider ce palier.`,
          },
        ],
        quiz: source.quiz,
      })
    );
  }
  return { ...unit, lessons: [...unit.lessons, ...extras] };
}

export const UNITS = [unit1, unit2, unit3, unit4, unit5, unit6].map((u) => padUnit(u));

export const ALL_LESSONS = UNITS.flatMap((u) => u.lessons);

export function getLessonById(lessonId) {
  return ALL_LESSONS.find((l) => l.id === lessonId) || null;
}

export function getUnitById(unitId) {
  return UNITS.find((u) => u.id === unitId) || null;
}

export function getNextLesson(lessonId) {
  const idx = ALL_LESSONS.findIndex((l) => l.id === lessonId);
  if (idx === -1 || idx === ALL_LESSONS.length - 1) return null;
  return ALL_LESSONS[idx + 1];
}

export const TOTAL_LESSONS = ALL_LESSONS.length;
