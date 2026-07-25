// iInvest curriculum — 6 units, ~29 core lessons (padded to 15 per unit).
// Unit 1 has detailed content blocks per lesson; units 2-6 use a lightweight
// template (1 paragraph + 1 quiz question) that is still fully playable end to
// end, which is what unlocks every disclosure tier of the asset sheet and
// investment flow.

let globalIndexCounter = 0;

function buildLesson({ id, unitId, title, xp = 10, content, quiz }) {
  globalIndexCounter += 1;
  return { id, unitId, title, xp, globalIndex: globalIndexCounter, content, quiz };
}

function buildUnit({ id, order, title, subtitle, icon, lessonDefs }) {
  return {
    id, order, title, subtitle, icon,
    lessons: lessonDefs.map((def, i) =>
      buildLesson({ id: `${id}-l${i + 1}`, unitId: id, ...def })
    ),
  };
}

// ---------- Unit 1 — detailed content ----------

const unit1 = buildUnit({
  id: 'u1',
  order: 1,
  title: 'Savings basics',
  subtitle: 'Understand your money before growing it',
  icon: 'piggy-bank',
  lessonDefs: [
    {
      title: 'What is money, and why save?',
      content: [
        { heading: 'Money as a tool of exchange', body: "Money is used to trade goods and services without having to barter directly. Its real value lies in what it lets you do: feed yourself, house yourself, plan for the future." },
        { heading: 'Why save?', body: "Saving means setting aside part of what you earn today to protect yourself from unexpected events and fund future projects — a trip, studies, a big purchase, or simply peace of mind." },
      ],
      quiz: {
        question: 'What is the main benefit of saving regularly?',
        options: ['Protecting yourself from surprises and funding future projects', 'Having more paper bills at home', 'Paying more in taxes', "It doesn't really matter"],
        correctIndex: 0,
        explanation: 'Savings build a safety cushion and give you the means to reach your goals without relying on debt.',
      },
    },
    {
      title: 'The budget: tracking income and expenses',
      content: [
        { heading: 'The basics: know where your money goes', body: "A budget is simply the list of what you earn (income) and what you spend (fixed costs, fun, surprises). Without this overview, it's impossible to know how much you can really save." },
        { heading: 'The simple 50/30/20 rule', body: 'A common method: 50% of income for essential needs, 30% for wants, 20% for savings and investments. Not an absolute rule, but a good starting point.' },
      ],
      quiz: {
        question: 'In the 50/30/20 rule, how much goes to savings?',
        options: ['50%', '30%', '20%', '0%'],
        correctIndex: 2,
        explanation: '20% of income is a reasonable target to devote to savings and investing each month.',
      },
    },
    {
      title: 'Emergency savings',
      content: [
        { heading: 'A safety cushion', body: "Emergency savings are money available immediately, reserved for surprises (car repairs, job loss, medical bills). A typical target is 3 to 6 months of expenses." },
        { heading: 'Before investing', body: "It's best to build this emergency fund before you start investing: it prevents you from having to sell investments in a hurry — sometimes at a loss — when trouble hits." },
      ],
      quiz: {
        question: 'What should you generally do before starting to invest?',
        options: ['Borrow as much as possible', 'Build an emergency fund', 'Invest everything immediately', 'Wait until retirement'],
        correctIndex: 1,
        explanation: 'An emergency fund prevents you from having to sell investments in a rush during unexpected events.',
      },
    },
    {
      title: 'Compound interest',
      content: [
        { heading: 'Interest that earns interest', body: "Compound interest means earning interest not only on your starting capital but also on interest already accumulated. Over time, the effect accelerates." },
        { heading: 'A concrete example', body: '$1,000 invested at 5% per year grows to $1,050 after 1 year. In year 2 the 5% applies to $1,050, not to $1,000. Over 20 years, the difference vs simple interest is huge.' },
      ],
      quiz: {
        question: 'What is compound interest?',
        options: ['Interest calculated only on the starting capital', 'Interest that itself earns further interest over time', 'A tax on savings', 'A type of bank account'],
        correctIndex: 1,
        explanation: 'This is the key mechanism behind long-term savings growth: earnings themselves generate more earnings.',
      },
    },
    {
      title: 'Setting a savings goal',
      content: [
        { heading: 'A clear, quantified, dated goal', body: 'Saving "just to save" rarely motivates people for long. A concrete goal — say $3,000 in 2 years for a specific project — gives a clear target and lets you calculate what to set aside each month.' },
        { heading: 'Automate to stay on track', body: "Setting up an automatic transfer right after payday is one of the most effective ways to save without thinking, and without being tempted to spend the money first." },
      ],
      quiz: {
        question: 'Which method helps you stick to a savings goal the most?',
        options: ["Saving whatever is left at month's end, if anything", 'An automatic transfer scheduled right after payday', 'Not setting an amount', 'Saving only once a year'],
        correctIndex: 1,
        explanation: 'Automating savings right after payday removes the need to rely on daily willpower.',
      },
    },
  ],
});

// ---------- Units 2-6 — light template ----------

const unit2 = buildUnit({
  id: 'u2', order: 2, title: 'Discovering the stock market', subtitle: 'How markets work',
  icon: 'chart-candle',
  lessonDefs: [
    {
      title: 'What is a stock price?',
      content: [{ body: "A stock price is what an asset (stock, fund, cryptocurrency…) trades for at a given moment. It moves constantly based on buys and sells from investors in the market." }],
      quiz: {
        question: 'A stock price corresponds to…',
        options: ['A price set once a year', "The trading price of an asset at a given moment", "The CEO's salary", 'A tax on savings'],
        correctIndex: 1,
        explanation: 'The price changes continuously based on supply and demand in the market.',
      },
    },
    {
      title: 'Stocks, bonds, funds: the differences',
      content: [{ body: 'A stock is a share of ownership in a company. A bond is a loan you give to a company or government, repaid with interest. A fund pools several assets to spread risk.' }],
      quiz: {
        question: 'When you buy a stock, you become…',
        options: ["A creditor of the company", 'A part-owner of the company', 'An employee of the company', 'A supplier to the company'],
        correctIndex: 1,
        explanation: "A stock represents a share of the company's capital: you become a shareholder.",
      },
    },
    {
      title: 'Reading a chart over time',
      content: [{ body: "A price chart shows an asset's evolution over a chosen period (1 day, 1 month, 1 year…). A rising line means the price went up, a falling line means it went down — but past performance never guarantees future results." }],
      quiz: {
        question: 'A line chart trending up over 1 year tells you…',
        options: ['The price will definitely keep rising', 'The price has generally increased over that past period', 'You must sell immediately', 'Nothing at all'],
        correctIndex: 1,
        explanation: "Charts describe the past. It's useful information, but not a guaranteed prediction.",
      },
    },
    {
      title: 'Supply and demand',
      content: [{ body: "When more investors want to buy an asset than sell it, the price rises. Conversely, when more people want to sell than buy, the price falls. That's the basic mechanism behind every price move." }],
      quiz: {
        question: 'If demand for an asset far exceeds supply, the price tends to…',
        options: ['Rise', 'Fall', 'Stay frozen by law', 'Depend only on the government'],
        correctIndex: 0,
        explanation: 'More buyers than available sellers pushes the price up.',
      },
    },
  ],
});

const unit3 = buildUnit({
  id: 'u3', order: 3, title: 'Becoming a shareholder', subtitle: 'Your first steps placing a buy order',
  icon: 'building-bank',
  lessonDefs: [
    {
      title: 'How to buy a stock or a fund',
      content: [{ body: "To buy an asset, you place an order through a brokerage platform: pick the asset, the amount or number of shares, then confirm. The asset then appears in your portfolio." }],
      quiz: {
        question: 'To buy a stock, you have to…',
        options: ['Contact the company directly', 'Place an order through a brokerage platform', 'Wait for a lottery', 'None of the above'],
        correctIndex: 1,
        explanation: 'Brokerage platforms ("brokers") are the standard intermediary to buy financial assets.',
      },
    },
    {
      title: 'Gains and losses',
      content: [{ body: "A gain is realized when you sell an asset for more than you paid. A loss is when you sell it for less. As long as you have not sold, the gain or loss is only 'unrealized'." }],
      quiz: {
        question: 'You buy a share at $100 and sell it at $120. You realize…',
        options: ['A $20 loss', 'A $20 gain', 'No gain or loss', 'A $100 gain'],
        correctIndex: 1,
        explanation: 'The difference between sale price and purchase price — positive here — is a $20 gain.',
      },
    },
    {
      title: 'Average purchase price',
      content: [{ body: "If you buy the same asset several times at different prices, the average purchase price is the weighted average of all your purchases. That price, not the very first, is the reference for your gain or loss." }],
      quiz: {
        question: 'The average purchase price is used to…',
        options: ["Set the asset's future price", 'Calculate your real gain or loss across all your purchases', 'Pay less in fees', 'Nothing in particular'],
        correctIndex: 1,
        explanation: "It's the reference for knowing whether your position is overall a win or a loss.",
      },
    },
    {
      title: 'Fees and their impact',
      content: [{ body: "Each buy or sell can generate fees (transaction fees, annual management fees for funds). Even if they look small, they reduce your real return — especially when applied every year over the long term." }],
      quiz: {
        question: 'Annual management fees of 2% instead of 0.2% over 20 years…',
        options: ["Have no notable impact", 'Can significantly reduce final returns', 'Automatically increase your gains', 'Only concern bonds'],
        correctIndex: 1,
        explanation: 'Higher fees, repeated every year, eat away a large share of compounded gains over the long term.',
      },
    },
  ],
});

const unit4 = buildUnit({
  id: 'u4', order: 4, title: 'Building a solid portfolio', subtitle: 'Spread out to weather the storms',
  icon: 'chart-pie',
  lessonDefs: [
    {
      title: 'Diversification',
      content: [{ body: "Diversifying means spreading your money across several different assets (sectors, regions, asset types) instead of betting everything on one. If one asset drops, the others can offset it." }],
      quiz: {
        question: 'Diversifying your portfolio mainly helps to…',
        options: ['Guarantee gains', "Reduce risk by not depending on a single asset", 'Pay lower fees', 'Avoid any loss'],
        correctIndex: 1,
        explanation: 'Diversification reduces overall risk without ever guaranteeing gains or fully eliminating risk.',
      },
    },
    {
      title: 'Risk and return',
      content: [{ body: "In general, the higher an asset's potential return, the higher its potential loss. A 'risk-free' investment offers a low return; a volatile asset can gain — or lose — a lot." }],
      quiz: {
        question: 'The usual relationship between risk and potential return is…',
        options: ['No relationship', 'More potential risk often goes with more potential return', 'High risk guarantees a high return', 'Risk only exists for bonds'],
        correctIndex: 1,
        explanation: 'This is a central principle of investing, though a high return is never guaranteed.',
      },
    },
    {
      title: 'Index funds and ETFs',
      content: [{ body: "An ETF (exchange-traded fund) automatically replicates the performance of an index (for example the 500 largest US companies). It offers instant diversification with generally low fees." }],
      quiz: {
        question: 'An ETF tracking an index lets you…',
        options: ['Invest in a single company at a time', 'Instantly diversify across many companies', 'Avoid all fees', 'Guarantee a fixed return'],
        correctIndex: 1,
        explanation: 'By replicating a broad index, an ETF automatically diversifies your investment.',
      },
    },
    {
      title: 'Investing regularly',
      content: [{ body: "Investing a fixed amount each month (rather than a lump sum at once) smooths your average purchase price and reduces the impact of bad timing. This is called dollar-cost averaging." }],
      quiz: {
        question: 'One benefit of investing a fixed amount each month is…',
        options: ['Guaranteeing you always buy at the lowest price', 'Smoothing your average purchase price over time', 'Eliminating all risk', 'Paying no fees'],
        correctIndex: 1,
        explanation: 'Dollar-cost averaging reduces the impact of a single mistimed buy.',
      },
    },
  ],
});

const unit5 = buildUnit({
  id: 'u5', order: 5, title: 'Analyzing an asset like a pro', subtitle: 'The data to know before investing',
  icon: 'report-analytics',
  lessonDefs: [
    {
      title: 'Rank and market capitalization',
      content: [{ body: "Market capitalization is the total value of an asset (price × circulating supply). It's used to rank assets by size and gives a sense of their weight in the market." }],
      quiz: {
        question: 'Market capitalization is calculated as…',
        options: ['The price alone', 'The price times the circulating supply', 'Annual revenue', 'The number of investors'],
        correctIndex: 1,
        explanation: "It's the standard measure to compare the size of two different assets.",
      },
    },
    {
      title: 'Return and volume',
      content: [{ body: "The average annual return shows an asset's historical performance over several years. Volume (often measured over 24h) shows how many shares were traded: high volume signals a liquid asset, easy to buy or sell quickly." }],
      quiz: {
        question: 'High trading volume over 24h generally indicates…',
        options: ['The asset is hard to buy or sell', 'The asset is liquid, easy to trade quickly', "The price won't move anymore", 'The asset is only for professionals'],
        correctIndex: 1,
        explanation: 'The higher the volume, the easier it is to find a counterparty to buy or sell.',
      },
    },
    {
      title: 'Circulating supply',
      content: [{ body: "Circulating supply is the total number of shares or tokens in existence and available on the market. It directly influences the market cap and gives a sense of an asset's relative scarcity." }],
      quiz: {
        question: 'Circulating supply corresponds to…',
        options: ['The number of shares available on the market', 'The number of active investors', 'The management fees', 'The listing currency'],
        correctIndex: 0,
        explanation: "It's a key piece of data — combined with price — to compute market cap.",
      },
    },
    {
      title: 'All-time high and price ranges',
      content: [{ body: "The all-time high (ATH) is the highest price an asset ever reached. A price range over a period (e.g. 52 weeks) shows the gap between the recent low and high — useful to place the current price in context." }],
      quiz: {
        question: 'The ATH ("all-time high") refers to…',
        options: ['The average price over 1 year', 'The lowest price ever reached', 'The highest price ever reached', "Tomorrow's expected price"],
        correctIndex: 2,
        explanation: 'The ATH is a historical marker, not a prediction of future price.',
      },
    },
    {
      title: 'Trading activity',
      content: [{ body: "The buy/sell ratio (buying vs selling pressure) indicates the short-term dynamic on an asset: more active buyers than sellers can precede a rise, and vice versa." }],
      quiz: {
        question: 'Strong buying pressure on an asset signals…',
        options: ['No more trades are possible', 'A dynamic where buyers temporarily dominate sellers', 'The asset will definitely fall', 'Fees will increase'],
        correctIndex: 1,
        explanation: "It's a short-term market dynamic indicator, not a guarantee of future trend.",
      },
    },
    {
      title: 'Understanding what you buy',
      content: [{ body: "Before investing in an asset, it helps to read its description ('About'): what project, company or index sits behind it? Understanding what you own helps you invest with more peace of mind for the long run." }],
      quiz: {
        question: "Why read the 'About' section of an asset before investing?",
        options: ['To find the account password', 'To understand what you actually own', "It's never useful", 'To avoid fees'],
        correctIndex: 1,
        explanation: 'Understanding what the asset represents helps you invest more thoughtfully and calmly.',
      },
    },
  ],
});

const unit6 = buildUnit({
  id: 'u6', order: 6, title: 'Reading and using the market like a pro', subtitle: 'The tools of a real investment platform',
  icon: 'stack-2',
  lessonDefs: [
    {
      title: 'The order book and spread',
      content: [{ body: "The order book lists open buy orders (bids) and sell orders (asks) with their prices. The spread is the gap between the best bid and best ask: the smaller it is, the more liquid the asset." }],
      quiz: {
        question: 'The bid-ask spread refers to…',
        options: ['Total management fees', 'The gap between the best bid and best ask', '24h change', 'The number of pending orders'],
        correctIndex: 1,
        explanation: 'A tight spread generally signals a liquid market with lots of buyers and sellers close in price.',
      },
    },
    {
      title: 'Japanese candlesticks',
      content: [{ body: "Each candle summarizes the price move over a period: open, close, high and low. A teal candle signals a rise over the period, a rose candle a fall." }],
      quiz: {
        question: 'A candlestick represents…',
        options: ['A single instant price', 'The open, close, high and low over a period', 'Only traded volume', 'The number of investors'],
        correctIndex: 1,
        explanation: 'A candlestick chart packs more information than a simple price line.',
      },
    },
    {
      title: 'Market order vs limit order',
      content: [{ body: "A market order executes immediately at the best available price. A limit order only executes at the price you set (or better) — more control over the price, but execution is not guaranteed." }],
      quiz: {
        question: 'What is the main difference between a market order and a limit order?',
        options: ['No difference', 'A market order executes immediately at the current price; a limit order waits for the chosen price', 'A limit order is always faster', 'A market order requires a preset price'],
        correctIndex: 1,
        explanation: 'A market order prioritizes speed; a limit order prioritizes price control.',
      },
    },
    {
      title: 'Stop-loss and take-profit',
      content: [{ body: "A stop-loss automatically sells if the price falls below a defined threshold, to cap a loss. A take-profit automatically sells if the price reaches a preset gain target." }],
      quiz: {
        question: 'A stop-loss is used to…',
        options: ['Guarantee a minimum gain', 'Automatically cap a loss at a defined threshold', 'Increase the number of shares purchased', 'Reduce management fees'],
        correctIndex: 1,
        explanation: "It's an automatic safety net against a large price drop.",
      },
    },
    {
      title: 'Maker/taker fees and slippage',
      content: [{ body: "'Maker' fees (you add liquidity, e.g. a pending limit order) are often lower than 'taker' fees (you take existing liquidity, e.g. a market order). Slippage is the gap between the expected price and the actually executed price." }],
      quiz: {
        question: 'Slippage refers to…',
        options: ['A type of fixed fee', 'The gap between the expected price and the actually executed price', 'The bid-ask spread', 'A welcome bonus'],
        correctIndex: 1,
        explanation: 'In a fast-moving or illiquid market, the executed price can differ from the displayed price when the order was placed.',
      },
    },
    {
      title: 'Building your personal investment plan',
      content: [{ body: "A good investment plan reflects your goals, your time horizon, and your risk tolerance. It combines diversification, regularity, and discipline — far more useful than trying to guess the best moment to buy." }],
      quiz: {
        question: 'A solid personal investment plan is built above all on…',
        options: ['Perfectly guessing the best moment to invest', 'Your goals, your time horizon, and steady discipline', 'Investing everything at once in a single asset', 'Ignoring risk completely'],
        correctIndex: 1,
        explanation: 'Consistency and alignment with your goals matter far more than perfect timing.',
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
        title: `Practice ${n} — ${unit.title}`,
        xp: 8,
        content: [
          { heading: 'Quick review', body: `A short exercise to reinforce what you saw in the "${unit.title}" unit. Answer the question below to complete this step.` },
        ],
        quiz: source.quiz,
      })
    );
  }
  return { ...unit, lessons: [...unit.lessons, ...extras] };
}

export const UNITS = [unit1, unit2, unit3, unit4, unit5, unit6].map((u) => padUnit(u));
export const ALL_LESSONS = UNITS.flatMap((u) => u.lessons);
export function getLessonById(lessonId) { return ALL_LESSONS.find((l) => l.id === lessonId) || null; }
export function getUnitById(unitId) { return UNITS.find((u) => u.id === unitId) || null; }
export function getNextLesson(lessonId) {
  const idx = ALL_LESSONS.findIndex((l) => l.id === lessonId);
  if (idx === -1 || idx === ALL_LESSONS.length - 1) return null;
  return ALL_LESSONS[idx + 1];
}
export const TOTAL_LESSONS = ALL_LESSONS.length;
