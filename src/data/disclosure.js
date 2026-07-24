// Seuils de déblocage progressif : nombre de leçons complétées requis pour chaque palier.
// Le palier atteint = index (1-based) du dernier seuil <= completedLessonsCount.

export const ASSET_DISCLOSURE_LEVELS = [
  { level: 1, threshold: 0, key: 'price', label: 'Prix & graphique' },
  { level: 2, threshold: 1, key: 'position', label: 'Votre position' },
  { level: 3, threshold: 9, key: 'timeframes', label: 'Périodes & range 52 sem.' },
  { level: 4, threshold: 13, key: 'avgPrice', label: "Prix moyen d'achat & frais" },
  { level: 5, threshold: 14, key: 'composition', label: 'Composition du fonds' },
  { level: 6, threshold: 17, key: 'history', label: "Historique d'achats & conseil" },
  { level: 7, threshold: 19, key: 'marketData', label: 'Données de marché' },
  { level: 8, threshold: 21, key: 'supplyAth', label: 'Offre en circulation & ATH' },
  { level: 9, threshold: 23, key: 'tradingActivity', label: 'Activité de trading & À propos' },
  { level: 10, threshold: 25, key: 'orderBook', label: 'Bougies & carnet d’ordres' },
];

export const INVEST_DISCLOSURE_LEVELS = [
  { level: 1, threshold: 0, key: 'amount', label: 'Montant à investir' },
  { level: 2, threshold: 2, key: 'feesBalance', label: 'Frais & solde disponible' },
  { level: 3, threshold: 12, key: 'preview', label: "Aperçu après achat" },
  { level: 4, threshold: 26, key: 'orderType', label: 'Marché vs Limite' },
  { level: 5, threshold: 27, key: 'protections', label: 'Stop-loss / Take-profit' },
  { level: 6, threshold: 28, key: 'proDetails', label: 'Détails pro (exécution, slippage)' },
];

export function getDisclosureLevel(completedLessonsCount, levels) {
  let current = levels[0].level;
  for (const step of levels) {
    if (completedLessonsCount >= step.threshold) current = step.level;
  }
  return current;
}

export function isUnlocked(completedLessonsCount, levels, levelNumber) {
  return getDisclosureLevel(completedLessonsCount, levels) >= levelNumber;
}

export function nextUnlock(completedLessonsCount, levels, levelNumber) {
  const step = levels.find((l) => l.level === levelNumber);
  if (!step) return null;
  const remaining = step.threshold - completedLessonsCount;
  return remaining > 0 ? remaining : 0;
}
