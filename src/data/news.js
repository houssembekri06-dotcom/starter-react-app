export const NEWS_ARTICLES = [
  {
    id: 1,
    source: 'Bloomberg Fiction',
    time: '12 min ago',
    title: 'The Fed keeps rates unchanged, markets breathe again',
    summary: 'Investors welcome the monetary stability expected for the quarter.',
    tag: 'Central banks',
    move: 0.4,
    body: [
      'In this simulated announcement, the Federal Reserve chose to hold its benchmark interest rate steady, citing balanced risks between inflation and employment.',
      'Equity markets reacted positively, with the S&P 500 and Nasdaq both trading higher in early sessions. Bond yields eased as traders scaled back expectations of another hike this year.',
      'For a beginner investor, the takeaway is simple: when borrowing costs stay stable, companies find it easier to plan and grow, which usually supports stock prices in the short term.',
    ],
  },
  {
    id: 2,
    source: 'Reuters Simulated',
    time: '42 min ago',
    title: 'S&P 500 breaks 5,500 points in this scenario',
    summary: 'A rally in tech stocks pushes the index to a new symbolic milestone.',
    tag: 'Indices',
    move: 1.2,
    body: [
      'The S&P 500 crossed the symbolic 5,500 mark for the first time in this fictional scenario, driven by strong earnings from mega-cap technology companies.',
      'Semiconductors and cloud-software names led the rally, while defensive sectors like utilities lagged behind.',
      'Round-number milestones rarely change the underlying fundamentals, but they often attract new flows from momentum-following investors.',
    ],
  },
  {
    id: 3,
    source: 'Crypto Daily',
    time: '1 h ago',
    title: 'Bitcoin: whales accumulate ahead of the halving',
    summary: 'Large holders are increasing positions despite recent volatility.',
    tag: 'Crypto',
    move: -0.8,
    body: [
      'On-chain data in this simulation shows wallets holding more than 1,000 BTC quietly adding to their positions over the past two weeks.',
      'The upcoming halving will cut the block reward in half, mechanically reducing new supply entering the market.',
      'History is not a guarantee, but previous halvings have coincided with heightened volatility in the months that followed.',
    ],
  },
  {
    id: 4,
    source: 'Finance Edu',
    time: '2 h ago',
    title: 'Why inflation is slowing but not disappearing',
    summary: 'A simple breakdown of the mechanisms keeping prices elevated.',
    tag: 'Economy',
    move: 0.1,
    body: [
      'Headline inflation has cooled from its peak, yet core measures — which strip out food and energy — remain stubbornly above central bank targets.',
      'Services inflation, particularly housing and wages, tends to move slowly and keeps overall price growth elevated.',
      'For long-term investors, real returns (after inflation) matter more than nominal ones. Diversifying across asset classes helps preserve purchasing power.',
    ],
  },
  {
    id: 5,
    source: 'MarketWatch Jr',
    time: '3 h ago',
    title: 'Tesla announces a fictional special dividend',
    summary: 'The carmaker rewards shareholders in this simulation exercise.',
    tag: 'Stocks',
    move: 2.4,
    body: [
      'In this made-up scenario, Tesla surprised the market with a one-time special dividend to reward long-term shareholders.',
      'Special dividends differ from regular ones: they are exceptional payouts, often funded by excess cash, and do not commit the company to future payments.',
      'The stock jumped on the announcement, though analysts remind investors that a dividend does not create value — it simply moves cash from the company to its owners.',
    ],
  },
  {
    id: 6,
    source: 'Finimize Learn',
    time: '5 h ago',
    title: 'ETFs: how to diversify with a single click',
    summary: 'A quick guide to understanding index funds and their fees.',
    tag: 'Education',
    move: 0.0,
    body: [
      'An ETF (Exchange-Traded Fund) bundles many stocks or bonds into a single security you can buy like a share.',
      'The main advantages are instant diversification, low fees (often below 0.25% per year), and full transparency about what you own.',
      'For beginners, a broad global equity ETF is often a solid starting point — it spreads risk across hundreds of companies in a single trade.',
    ],
  },
  {
    id: 7,
    source: 'MarketTest',
    time: '6 h ago',
    title: 'Gold climbs back above $2,100 in this scenario',
    summary: 'The yellow metal benefits from a rebound in simulated geopolitical uncertainty.',
    tag: 'Commodities',
    move: 0.6,
    body: [
      'Gold prices moved back above $2,100 per ounce as fictional geopolitical tensions pushed investors toward safe-haven assets.',
      'Unlike stocks or bonds, gold pays no yield — its return depends entirely on price appreciation.',
      'Many portfolios hold a small allocation (typically 5–10%) to gold as a diversifier during periods of market stress.',
    ],
  },
];

export function getArticleById(id) {
  const num = Number(id);
  return NEWS_ARTICLES.find((a) => a.id === num) || null;
}