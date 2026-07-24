// Actifs fictifs pour le simulateur de portefeuille. Toutes les données (prix,
// historiques, carnet d'ordres…) sont générées de façon déterministe (PRNG à graine)
// à partir d'un prix de base par actif — aucune connexion à une vraie API financière.

function mulberry32(seed) {
  let a = seed;
  return function rand() {
    a |= 0;
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seedFromString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return h;
}

function randomWalk(seedStr, basePrice, steps, volatility) {
  const rand = mulberry32(seedFromString(seedStr));
  const points = [basePrice];
  let price = basePrice;
  for (let i = 1; i < steps; i++) {
    const change = (rand() - 0.48) * volatility * price;
    price = Math.max(price * 0.15, price + change);
    points.push(price);
  }
  return points;
}

function buildCandles(seedStr, basePrice, count, volatility) {
  const rand = mulberry32(seedFromString(seedStr + '-candles'));
  const candles = [];
  let price = basePrice;
  const now = new Date('2026-07-23T00:00:00Z').getTime();
  const dayMs = 24 * 60 * 60 * 1000;
  for (let i = count - 1; i >= 0; i--) {
    const open = price;
    const change = (rand() - 0.48) * volatility * price;
    const close = Math.max(open * 0.2, open + change);
    const high = Math.max(open, close) * (1 + rand() * volatility * 0.5);
    const low = Math.min(open, close) * (1 - rand() * volatility * 0.5);
    candles.push({
      date: new Date(now - i * dayMs).toISOString().slice(0, 10),
      open,
      high,
      low,
      close,
    });
    price = close;
  }
  return candles;
}

function buildOrderBook(seedStr, price, depth = 6) {
  const rand = mulberry32(seedFromString(seedStr + '-book'));
  const tick = price * 0.0015;
  const bids = Array.from({ length: depth }, (_, i) => ({
    price: price - tick * (i + 1),
    qty: Math.round((rand() * 800 + 40) * (depth - i)) / 10,
  }));
  const asks = Array.from({ length: depth }, (_, i) => ({
    price: price + tick * (i + 1),
    qty: Math.round((rand() * 800 + 40) * (depth - i)) / 10,
  }));
  return { bids, asks };
}

const RAW_ASSETS = [
  {
    id: 'wrld',
    symbol: 'WRLD',
    name: 'iInvest Monde',
    type: 'etf',
    basePrice: 187.42,
    volatility: 0.012,
    managementFeePct: 0.22,
    rank: 1,
    avgAnnualReturnPct: 7.8,
    about: "Un fonds indiciel qui réplique la performance des plus grandes entreprises mondiales, tous secteurs confondus. Une manière simple de se diversifier en un seul achat.",
    composition: [
      { name: 'CloudCore Systems', pct: 8.4 },
      { name: 'NovaTech', pct: 7.1 },
      { name: 'QuantumLeap Semi', pct: 6.2 },
      { name: 'UrbanMobility', pct: 5.5 },
      { name: 'MedInnov', pct: 4.8 },
      { name: 'Autres (495 entreprises)', pct: 68.0 },
    ],
  },
  {
    id: 'nvtc',
    symbol: 'NVTC',
    name: 'NovaTech',
    type: 'action',
    basePrice: 412.9,
    volatility: 0.028,
    managementFeePct: 0,
    rank: 4,
    avgAnnualReturnPct: 14.2,
    about: "NovaTech conçoit des logiciels professionnels utilisés par des entreprises dans le monde entier. Une valeur technologique reconnue pour sa croissance régulière.",
    composition: null,
  },
  {
    id: 'oblig',
    symbol: 'OBLI10',
    name: 'Obligations État 10 ans',
    type: 'obligation',
    basePrice: 101.35,
    volatility: 0.004,
    managementFeePct: 0.12,
    rank: 12,
    avgAnnualReturnPct: 3.1,
    about: "Un fonds d'obligations d'État à échéance 10 ans. Un placement réputé plus stable, avec un rendement modéré mais régulier.",
    composition: [
      { name: 'Obligations France', pct: 40 },
      { name: 'Obligations Allemagne', pct: 30 },
      { name: 'Obligations Italie', pct: 15 },
      { name: 'Obligations Espagne', pct: 15 },
    ],
  },
  {
    id: 'cryl',
    symbol: 'CRYL',
    name: 'CryptoLeader',
    type: 'crypto',
    basePrice: 52340,
    volatility: 0.045,
    managementFeePct: 0,
    rank: 1,
    avgAnnualReturnPct: 28.5,
    about: "La cryptomonnaie de référence par capitalisation. Très suivie, elle reste aussi la plus volatile des familles d'actifs de cette liste.",
    composition: null,
  },
  {
    id: 'grim',
    symbol: 'GRIM',
    name: 'GreenBuild Immo',
    type: 'etf',
    basePrice: 245.6,
    volatility: 0.008,
    managementFeePct: 0.85,
    rank: 18,
    avgAnnualReturnPct: 4.6,
    about: "Un fonds qui investit dans des bureaux et commerces à travers l'Europe, avec pour objectif de reverser des loyers réguliers aux porteurs de parts.",
    composition: [
      { name: 'Bureaux Paris & IDF', pct: 34 },
      { name: 'Commerces grandes villes', pct: 28 },
      { name: 'Logistique & entrepôts', pct: 22 },
      { name: 'Autres actifs européens', pct: 16 },
    ],
  },
  {
    id: 'qls',
    symbol: 'QLS',
    name: 'QuantumLeap Semi',
    type: 'action',
    basePrice: 891.2,
    volatility: 0.033,
    managementFeePct: 0,
    rank: 6,
    avgAnnualReturnPct: 19.7,
    about: "QuantumLeap Semi conçoit des composants électroniques utilisés dans l'intelligence artificielle et l'automobile. Une valeur de croissance à forte volatilité.",
    composition: null,
  },
  {
    id: 'slwv',
    symbol: 'SLWV',
    name: 'SolarWave Energy',
    type: 'action',
    basePrice: 58.75,
    volatility: 0.021,
    managementFeePct: 0,
    rank: 22,
    avgAnnualReturnPct: 9.4,
    about: "SolarWave Energy développe des fermes solaires et éoliennes en Europe. Un pari sur la transition énergétique, avec un rendement plus modéré.",
    composition: null,
  },
];

function enrichAsset(raw) {
  const seed = raw.id;
  const sparkline = randomWalk(seed + '-spark', raw.basePrice, 24, raw.volatility);
  const price = sparkline[sparkline.length - 1];
  const prevClose = sparkline[sparkline.length - 2];
  const dayChangePct = ((price - prevClose) / prevClose) * 100;

  const ranges = {
    '1J': randomWalk(seed + '-1J', price * 0.995, 24, raw.volatility * 0.3),
    '1S': randomWalk(seed + '-1S', price * 0.97, 28, raw.volatility * 0.5),
    '1M': randomWalk(seed + '-1M', price * 0.9, 30, raw.volatility * 0.7),
    '1A': randomWalk(seed + '-1A', price * 0.65, 52, raw.volatility),
    'Tout': randomWalk(seed + '-Tout', price * 0.35, 60, raw.volatility * 1.1),
  };

  const all52w = ranges['1A'];
  const range52w = { low: Math.min(...all52w), high: Math.max(...all52w) };

  const candles = buildCandles(seed, price * 0.92, 30, raw.volatility);
  const athCandidate = Math.max(...ranges['Tout'], ...candles.map((c) => c.high), price);
  const ath = athCandidate * 1.08;
  const athDate = '2026-02-14';

  const range24h = {
    low: Math.min(...candles[candles.length - 1] ? [candles[candles.length - 1].low] : [price * 0.98]),
    high: Math.max(...candles[candles.length - 1] ? [candles[candles.length - 1].high] : [price * 1.02]),
  };

  const rand = mulberry32(seedFromString(seed + '-misc'));
  const buyPct = Math.round(40 + rand() * 30);

  return {
    ...raw,
    price,
    dayChangePct,
    sparkline,
    ranges,
    range52w,
    candles,
    ath,
    athDate,
    range24h,
    marketCapEUR: price * (raw.type === 'crypto' ? 19_400_000 : raw.type === 'etf' ? 42_000_000 : 3_100_000),
    volume24hEUR: price * (500_000 + rand() * 2_000_000),
    circulatingSupply: raw.type === 'crypto' ? 19_400_000 : raw.type === 'etf' ? 42_000_000 : 3_100_000,
    dominancePct: raw.type === 'crypto' ? 48.2 : null,
    buySellRatio: { buyPct, sellPct: 100 - buyPct },
    orderBook: buildOrderBook(seed, price),
  };
}

export const ASSETS = RAW_ASSETS.map(enrichAsset);

export function getAssetById(id) {
  return ASSETS.find((a) => a.id === id) || null;
}

export const ASSET_TYPE_LABELS = {
  etf: 'Fonds indiciel (ETF)',
  action: 'Action',
  obligation: 'Obligation',
  crypto: 'Cryptomonnaie',
};
