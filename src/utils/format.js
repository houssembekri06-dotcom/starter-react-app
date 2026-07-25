const euroFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const euroFormatterCompact = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatEUR(value, { compact = false } = {}) {
  const n = Number(value) || 0;
  return (compact ? euroFormatterCompact : euroFormatter).format(n);
}

export function formatPercent(value, { withSign = true } = {}) {
  const n = Number(value) || 0;
  const sign = withSign && n > 0 ? '+' : '';
  return `${sign}${n.toFixed(2)}%`;
}

export function formatNumber(value, decimals = 0) {
  const n = Number(value) || 0;
  return n.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatShares(value) {
  return formatNumber(value, value < 1 ? 4 : 2);
}

export function formatCompactNumber(value) {
  const n = Number(value) || 0;
  if (n >= 1_000_000_000) return `${formatNumber(n / 1_000_000_000, 2)} B`;
  if (n >= 1_000_000) return `${formatNumber(n / 1_000_000, 1)} M`;
  if (n >= 1_000) return `${formatNumber(n / 1_000, 1)} k`;
  return formatNumber(n, 0);
}

export function formatCompactLarge(value) {
  const n = Number(value) || 0;
  if (n >= 1_000_000_000) return `$${formatNumber(n / 1_000_000_000, 2)}B`;
  if (n >= 1_000_000) return `$${formatNumber(n / 1_000_000, 1)}M`;
  if (n >= 1_000) return `$${formatNumber(n / 1_000, 1)}k`;
  return formatEUR(n);
}

export function formatDate(isoDate) {
  const d = new Date(isoDate);
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}
