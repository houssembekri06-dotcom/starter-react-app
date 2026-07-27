// Seuils de déblocage progressif : nombre de leçons complétées requis pour chaque palier.
// Le palier atteint = index (1-based) du dernier seuil <= completedLessonsCount.

export const ASSET_DISCLOSURE_LEVELS = [
  { level: 1, threshold: 0, key: 'price', label: 'Price & chart' },
  { level: 2, threshold: 1, key: 'position', label: 'Your position' },
  { level: 3, threshold: 9, key: 'timeframes', label: 'Timeframes & 52-week range' },
  { level: 4, threshold: 13, key: 'avgPrice', label: 'Average purchase price & fees' },
  { level: 5, threshold: 14, key: 'composition', label: 'Fund composition' },
  { level: 6, threshold: 17, key: 'history', label: 'Purchase history & tips' },
  { level: 7, threshold: 19, key: 'marketData', label: 'Market data' },
  { level: 8, threshold: 21, key: 'supplyAth', label: 'Supply & ATH' },
  { level: 9, threshold: 23, key: 'tradingActivity', label: 'Trading activity & About' },
  { level: 10, threshold: 25, key: 'orderBook', label: 'Candles & order book' },
];

export const INVEST_DISCLOSURE_LEVELS = [
  { level: 1, threshold: 0, key: 'amount', label: 'Amount to invest' },
  { level: 2, threshold: 2, key: 'feesBalance', label: 'Fees & available balance' },
  { level: 3, threshold: 12, key: 'preview', label: 'Preview after purchase' },
  { level: 4, threshold: 26, key: 'orderType', label: 'Market vs Limit' },
  { level: 5, threshold: 27, key: 'protections', label: 'Stop-loss / Take-profit' },
  { level: 6, threshold: 28, key: 'proDetails', label: 'Pro details (execution, slippage)' },
];

export function getDisclosureLevel(completedLessonsCount, levels) {
  return levels[levels.length - 1].level;
}

export function isUnlocked(completedLessonsCount, levels, levelNumber) {
  return true;
}

export function nextUnlock(completedLessonsCount, levels, levelNumber) {
  return 0;
}
