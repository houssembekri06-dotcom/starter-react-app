import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ALL_LESSONS, getLessonById } from '../data/lessons';
import { getAssetById } from '../data/assets';

const ProgressContext = createContext(null);

const STORAGE_KEY = 'iinvest-progress-v1';
const STARTING_CASH = 1000;
const MAX_HEARTS = 5;
const TRANSACTION_FEE_RATE = 0.005;
const COINS_PER_LESSON = 5;

const LEAGUES = [
  { name: 'Ligue Bronze', minXp: 0 },
  { name: 'Ligue Argent', minXp: 100 },
  { name: 'Ligue Or', minXp: 250 },
  { name: 'Ligue Platine', minXp: 500 },
];

function computeLeague(xpTotal) {
  let current = LEAGUES[0].name;
  for (const l of LEAGUES) if (xpTotal >= l.minXp) current = l.name;
  return current;
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(a, b) {
  return Math.round((new Date(b) - new Date(a)) / 86400000);
}

function defaultState() {
  return {
    onboarded: false,
    userName: '',
    investorProfile: null, // { goal, level }
    xpTotal: 0,
    coins: 0,
    hearts: MAX_HEARTS,
    streakDays: 0,
    lastActiveDate: null,
    completedLessonIds: [],
    lastCompletedLesson: null,
    cashBalance: STARTING_CASH,
    positions: {}, // assetId -> { shares, avgPrice, purchases: [] }
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    return { ...defaultState(), ...JSON.parse(raw) };
  } catch {
    return defaultState();
  }
}

export function ProgressProvider({ children }) {
  const [state, setState] = useState(loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const completedLessonsCount = state.completedLessonIds.length;
  const league = useMemo(() => computeLeague(state.xpTotal), [state.xpTotal]);

  function completeOnboarding() {
    setState((s) => ({ ...s, onboarded: true }));
  }

  function completeSignup({ name, goal, level }) {
    setState((s) => ({
      ...s,
      onboarded: true,
      userName: name || s.userName,
      investorProfile: { goal, level },
    }));
  }

  function bumpStreak(s) {
    const today = todayStr();
    if (s.lastActiveDate === today) return s;
    const gap = s.lastActiveDate ? daysBetween(s.lastActiveDate, today) : null;
    const streakDays = gap === 1 ? s.streakDays + 1 : 1;
    return { ...s, streakDays, lastActiveDate: today };
  }

  function completeLesson(lessonId) {
    const lesson = getLessonById(lessonId);
    if (!lesson) return;
    setState((s) => {
      if (s.completedLessonIds.includes(lessonId)) return s;
      const withStreak = bumpStreak(s);
      return {
        ...withStreak,
        xpTotal: withStreak.xpTotal + lesson.xp,
        coins: withStreak.coins + COINS_PER_LESSON,
        completedLessonIds: [...withStreak.completedLessonIds, lessonId],
        lastCompletedLesson: { id: lesson.id, title: lesson.title, xp: lesson.xp },
      };
    });
  }

  function loseHeart() {
    setState((s) => ({ ...s, hearts: Math.max(0, s.hearts - 1) }));
  }

  function buyAsset({ assetId, amountEUR, orderType = 'market', limitPrice, stopLoss, takeProfit }) {
    const asset = getAssetById(assetId);
    if (!asset || amountEUR <= 0) return null;

    const slippageFactor = 1 + (Math.random() * 0.0015);
    const execPrice = orderType === 'limit' && limitPrice
      ? limitPrice
      : asset.price * slippageFactor;

    const fees = amountEUR * TRANSACTION_FEE_RATE;
    const investedAfterFees = amountEUR - fees;
    const shares = investedAfterFees / execPrice;

    let result = null;
    setState((s) => {
      if (amountEUR > s.cashBalance) return s;
      const existing = s.positions[assetId] || { shares: 0, avgPrice: 0, purchases: [] };
      const newShares = existing.shares + shares;
      const newAvgPrice = (existing.shares * existing.avgPrice + shares * execPrice) / newShares;
      const purchase = {
        date: new Date().toISOString(),
        shares,
        price: execPrice,
        fees,
        orderType,
        stopLoss: stopLoss || null,
        takeProfit: takeProfit || null,
      };
      result = { shares, execPrice, fees, newTotalShares: newShares, newAvgPrice };
      return {
        ...s,
        cashBalance: s.cashBalance - amountEUR,
        positions: {
          ...s.positions,
          [assetId]: {
            shares: newShares,
            avgPrice: newAvgPrice,
            purchases: [...existing.purchases, purchase],
          },
        },
      };
    });
    return result;
  }

  function sellAsset(assetId, sharesToSell) {
    const asset = getAssetById(assetId);
    if (!asset) return null;
    setState((s) => {
      const existing = s.positions[assetId];
      if (!existing || sharesToSell <= 0 || sharesToSell > existing.shares) return s;
      const proceeds = sharesToSell * asset.price;
      const fees = proceeds * TRANSACTION_FEE_RATE;
      const remainingShares = existing.shares - sharesToSell;
      const positions = { ...s.positions };
      if (remainingShares <= 0.000001) {
        delete positions[assetId];
      } else {
        positions[assetId] = { ...existing, shares: remainingShares };
      }
      return { ...s, cashBalance: s.cashBalance + proceeds - fees, positions };
    });
    return true;
  }

  function resetProgress() {
    localStorage.removeItem(STORAGE_KEY);
    setState(defaultState());
  }

  const portfolioValue = useMemo(() => {
    return Object.entries(state.positions).reduce((total, [assetId, pos]) => {
      const asset = getAssetById(assetId);
      return total + (asset ? asset.price * pos.shares : 0);
    }, 0);
  }, [state.positions]);

  const value = {
    ...state,
    completedLessonsCount,
    totalLessons: ALL_LESSONS.length,
    league,
    maxHearts: MAX_HEARTS,
    transactionFeeRate: TRANSACTION_FEE_RATE,
    portfolioValue,
    completeOnboarding,
    completeSignup,
    completeLesson,
    loseHeart,
    buyAsset,
    sellAsset,
    resetProgress,
  };

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
}
