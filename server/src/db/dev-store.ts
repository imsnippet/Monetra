import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";
import type { UserApi, UserWithSecrets } from "./mappers/user.mapper";
import type { TransactionApi } from "./mappers/transaction.mapper";
import type { CategoryApi, ReportSettingApi } from "./mappers/misc.mapper";
import type { BudgetApi } from "./mappers/budget.mapper";
import { ReportFrequencyEnum } from "../enums/domain.enum";

const DEV_DATA_FILE = path.resolve(__dirname, "..", "..", ".dev-data.json");

let activeDevMode = false;

export const isDevFallbackMode = (): boolean => activeDevMode;
export const setDevFallbackMode = (active: boolean): void => {
  activeDevMode = active;
};

interface DevStoredUser {
  _id: string;
  name: string;
  email: string;
  password: string | null;
  isVerified: boolean;
  baseCurrency: string;
  profilePicture: string | null;
  provider: "local" | "google";
  providerId: string | null;
  tokenVersion: number;
  emailVerificationOtpHash: string | null;
  emailVerificationOtpExpiresAt: string | null;
  passwordResetOtpHash: string | null;
  passwordResetOtpExpiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface DevStoredReportSetting {
  _id: string;
  userId: string;
  frequency: string;
  isEnabled: boolean;
  nextReportDate: string | null;
  lastSentDate: string | null;
  createdAt: string;
  updatedAt: string;
}

interface DevStoredCategory {
  _id: string;
  userId: string;
  name: string;
  color: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DevStoredTransaction {
  _id: string;
  id: string;
  userId: string;
  title: string;
  type: string;
  amount: number;
  originalAmount: number | null;
  originalCurrency: string | null;
  baseCurrencyAtTime: string | null;
  exchangeRate: number | null;
  rateSource: string | null;
  exchangeRateFetchedAt: string | null;
  description?: string;
  category: string;
  receiptUrl?: string;
  date: string;
  isRecurring: boolean;
  recurringInterval: string | null;
  nextRecurringDate: string | null;
  lastProcessed: string | null;
  status: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

interface DevDataFile {
  users: DevStoredUser[];
  reportSettings: DevStoredReportSetting[];
  categories: DevStoredCategory[];
  transactions: DevStoredTransaction[];
}

const DEFAULT_HASH = bcrypt.hashSync("Password123!", 10);
const nowIso = new Date().toISOString();

const INITIAL_DATA: DevDataFile = {
  users: [
    {
      _id: "652f9f9f9f9f9f9f9f9f9f91",
      name: "Demo User",
      email: "demo@monetra.com",
      password: DEFAULT_HASH,
      isVerified: true,
      baseCurrency: "USD",
      profilePicture: null,
      provider: "local",
      providerId: null,
      tokenVersion: 1,
      emailVerificationOtpHash: null,
      emailVerificationOtpExpiresAt: null,
      passwordResetOtpHash: null,
      passwordResetOtpExpiresAt: null,
      createdAt: nowIso,
      updatedAt: nowIso,
    },
  ],
  reportSettings: [
    {
      _id: "652f9f9f9f9f9f9f9f9f9f92",
      userId: "652f9f9f9f9f9f9f9f9f9f91",
      frequency: ReportFrequencyEnum.MONTHLY,
      isEnabled: true,
      nextReportDate: new Date(Date.now() + 30 * 86400000).toISOString(),
      lastSentDate: null,
      createdAt: nowIso,
      updatedAt: nowIso,
    },
  ],
  categories: [
    { _id: "cat_1", name: "Groceries", userId: "652f9f9f9f9f9f9f9f9f9f91", isDefault: true, color: "#10b981", createdAt: nowIso, updatedAt: nowIso },
    { _id: "cat_2", name: "Housing & Rent", userId: "652f9f9f9f9f9f9f9f9f9f91", isDefault: true, color: "#6366f1", createdAt: nowIso, updatedAt: nowIso },
    { _id: "cat_3", name: "Utilities", userId: "652f9f9f9f9f9f9f9f9f9f91", isDefault: true, color: "#f59e0b", createdAt: nowIso, updatedAt: nowIso },
    { _id: "cat_4", name: "Dining & Drinks", userId: "652f9f9f9f9f9f9f9f9f9f91", isDefault: true, color: "#ec4899", createdAt: nowIso, updatedAt: nowIso },
    { _id: "cat_5", name: "Transport", userId: "652f9f9f9f9f9f9f9f9f9f91", isDefault: true, color: "#06b6d4", createdAt: nowIso, updatedAt: nowIso },
    { _id: "cat_6", name: "Salary", userId: "652f9f9f9f9f9f9f9f9f9f91", isDefault: true, color: "#22c55e", createdAt: nowIso, updatedAt: nowIso },
  ],
  transactions: [
    {
      _id: "tx_1",
      id: "tx_1",
      userId: "652f9f9f9f9f9f9f9f9f9f91",
      title: "Monthly Salary",
      description: "Direct deposit tech salary",
      amount: 4500,
      type: "INCOME",
      category: "Salary",
      date: new Date(Date.now() - 5 * 86400000).toISOString(),
      paymentMethod: "BANK_TRANSFER",
      isRecurring: true,
      recurringInterval: "MONTHLY",
      nextRecurringDate: null,
      lastProcessed: null,
      status: "COMPLETED",
      originalAmount: null,
      originalCurrency: null,
      baseCurrencyAtTime: null,
      exchangeRate: null,
      rateSource: null,
      exchangeRateFetchedAt: null,
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    },
    {
      _id: "tx_2",
      id: "tx_2",
      userId: "652f9f9f9f9f9f9f9f9f9f91",
      title: "Apartment Rent",
      description: "Monthly apartment payment",
      amount: 1450,
      type: "EXPENSE",
      category: "Housing & Rent",
      date: new Date(Date.now() - 4 * 86400000).toISOString(),
      paymentMethod: "BANK_TRANSFER",
      isRecurring: true,
      recurringInterval: "MONTHLY",
      nextRecurringDate: null,
      lastProcessed: null,
      status: "COMPLETED",
      originalAmount: null,
      originalCurrency: null,
      baseCurrencyAtTime: null,
      exchangeRate: null,
      rateSource: null,
      exchangeRateFetchedAt: null,
      createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    },
    {
      _id: "tx_3",
      id: "tx_3",
      userId: "652f9f9f9f9f9f9f9f9f9f91",
      title: "Whole Foods Market",
      description: "Organic groceries & produce",
      amount: 135.5,
      type: "EXPENSE",
      category: "Groceries",
      date: new Date(Date.now() - 2 * 86400000).toISOString(),
      paymentMethod: "DEBIT_CARD",
      isRecurring: false,
      recurringInterval: null,
      nextRecurringDate: null,
      lastProcessed: null,
      status: "COMPLETED",
      originalAmount: null,
      originalCurrency: null,
      baseCurrencyAtTime: null,
      exchangeRate: null,
      rateSource: null,
      exchangeRateFetchedAt: null,
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
    {
      _id: "tx_4",
      id: "tx_4",
      userId: "652f9f9f9f9f9f9f9f9f9f91",
      title: "Electricity & Gas",
      description: "Municipal utility bill",
      amount: 88.2,
      type: "EXPENSE",
      category: "Utilities",
      date: new Date(Date.now() - 1 * 86400000).toISOString(),
      paymentMethod: "DEBIT_CARD",
      isRecurring: true,
      recurringInterval: "MONTHLY",
      nextRecurringDate: null,
      lastProcessed: null,
      status: "COMPLETED",
      originalAmount: null,
      originalCurrency: null,
      baseCurrencyAtTime: null,
      exchangeRate: null,
      rateSource: null,
      exchangeRateFetchedAt: null,
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
  ],
};

let memoryData: DevDataFile = loadFromDisk();

function loadFromDisk(): DevDataFile {
  try {
    if (fs.existsSync(DEV_DATA_FILE)) {
      const raw = fs.readFileSync(DEV_DATA_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Failed to load dev data from disk:", err);
  }
  return JSON.parse(JSON.stringify(INITIAL_DATA));
}

function persistToDisk() {
  try {
    fs.writeFileSync(DEV_DATA_FILE, JSON.stringify(memoryData, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to persist dev data to disk:", err);
  }
}

function toUserApiObj(u: DevStoredUser): UserApi {
  return {
    _id: u._id,
    name: u.name,
    email: u.email,
    profilePicture: u.profilePicture,
    baseCurrency: u.baseCurrency,
    isVerified: u.isVerified,
    provider: u.provider,
    providerId: u.providerId,
    customCategories: [],
    createdAt: new Date(u.createdAt),
    updatedAt: new Date(u.updatedAt),
  };
}

function toUserWithSecretsObj(u: DevStoredUser): UserWithSecrets {
  return {
    _id: u._id,
    name: u.name,
    email: u.email,
    profilePicture: u.profilePicture,
    baseCurrency: u.baseCurrency,
    isVerified: u.isVerified,
    provider: u.provider,
    providerId: u.providerId,
    customCategories: [],
    password: u.password,
    tokenVersion: u.tokenVersion,
    emailVerificationOtpHash: u.emailVerificationOtpHash,
    emailVerificationOtpExpiresAt: u.emailVerificationOtpExpiresAt ? new Date(u.emailVerificationOtpExpiresAt) : null,
    passwordResetOtpHash: u.passwordResetOtpHash,
    passwordResetOtpExpiresAt: u.passwordResetOtpExpiresAt ? new Date(u.passwordResetOtpExpiresAt) : null,
    lastOtpResentAt: null,
    createdAt: new Date(u.createdAt),
    updatedAt: new Date(u.updatedAt),
  };
}

// ─── USER REPO FALLBACK ──────────────────────────────────────────────────────
export const devUserRepo = {
  async findById(id: string): Promise<UserApi | null> {
    const user = memoryData.users.find((u) => u._id === id);
    return user ? toUserApiObj(user) : null;
  },

  async findByIdWithSecrets(id: string): Promise<UserWithSecrets | null> {
    const user = memoryData.users.find((u) => u._id === id);
    return user ? toUserWithSecretsObj(user) : null;
  },

  async findByEmailWithSecrets(email: string): Promise<UserWithSecrets | null> {
    const norm = email.toLowerCase().trim();
    const user = memoryData.users.find((u) => u.email.toLowerCase().trim() === norm);
    return user ? toUserWithSecretsObj(user) : null;
  },

  async findByProviderId(provider: string, providerId: string): Promise<UserWithSecrets | null> {
    const user = memoryData.users.find((u) => u.provider === provider && u.providerId === providerId);
    return user ? toUserWithSecretsObj(user) : null;
  },

  async create(input: any): Promise<UserWithSecrets> {
    const newId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const hashedPassword = input.password ? (input.password.startsWith("$2b$") ? input.password : await bcrypt.hash(input.password, 10)) : null;

    const newUser: DevStoredUser = {
      _id: newId,
      name: input.name,
      email: input.email.toLowerCase().trim(),
      password: hashedPassword,
      isVerified: input.isVerified ?? false,
      baseCurrency: input.baseCurrency || "USD",
      profilePicture: input.profilePicture || null,
      provider: input.provider || "local",
      providerId: input.providerId || null,
      tokenVersion: 1,
      emailVerificationOtpHash: input.emailVerificationOtpHash || null,
      emailVerificationOtpExpiresAt: input.emailVerificationOtpExpiresAt ? new Date(input.emailVerificationOtpExpiresAt).toISOString() : null,
      passwordResetOtpHash: null,
      passwordResetOtpExpiresAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    memoryData.users.push(newUser);
    persistToDisk();
    return toUserWithSecretsObj(newUser);
  },

  async update(id: string, patch: any): Promise<UserApi | null> {
    const index = memoryData.users.findIndex((u) => u._id === id);
    if (index === -1) return null;

    const cur = memoryData.users[index];
    const updated: DevStoredUser = {
      ...cur,
      ...patch,
      emailVerificationOtpExpiresAt: patch.emailVerificationOtpExpiresAt ? new Date(patch.emailVerificationOtpExpiresAt).toISOString() : patch.emailVerificationOtpExpiresAt === null ? null : cur.emailVerificationOtpExpiresAt,
      passwordResetOtpExpiresAt: patch.passwordResetOtpExpiresAt ? new Date(patch.passwordResetOtpExpiresAt).toISOString() : patch.passwordResetOtpExpiresAt === null ? null : cur.passwordResetOtpExpiresAt,
      updatedAt: new Date().toISOString(),
    };

    memoryData.users[index] = updated;
    persistToDisk();
    return toUserApiObj(updated);
  },

  async setPassword(id: string, plainPassword: string): Promise<UserApi | null> {
    const index = memoryData.users.findIndex((u) => u._id === id);
    if (index === -1) return null;

    const hash = await bcrypt.hash(plainPassword, 10);
    memoryData.users[index].password = hash;
    memoryData.users[index].updatedAt = new Date().toISOString();
    persistToDisk();
    return toUserApiObj(memoryData.users[index]);
  },

  async bumpTokenVersion(id: string): Promise<number | null> {
    const user = memoryData.users.find((u) => u._id === id);
    if (!user) return null;
    user.tokenVersion = (user.tokenVersion ?? 0) + 1;
    persistToDisk();
    return user.tokenVersion;
  },

  async remove(id: string): Promise<UserApi | null> {
    const index = memoryData.users.findIndex((u) => u._id === id);
    if (index === -1) return null;
    const [removed] = memoryData.users.splice(index, 1);
    persistToDisk();
    return toUserApiObj(removed);
  },
};

// ─── REPORT REPO FALLBACK ────────────────────────────────────────────────────
export const devReportRepo = {
  async findSettingByUser(userId: string): Promise<ReportSettingApi | null> {
    const found = memoryData.reportSettings.find((r) => r.userId === userId);
    if (!found) return null;
    return {
      _id: found._id,
      userId: found.userId,
      frequency: found.frequency,
      isEnabled: found.isEnabled,
      nextReportDate: found.nextReportDate ? new Date(found.nextReportDate) : null,
      lastSentDate: found.lastSentDate ? new Date(found.lastSentDate) : null,
      createdAt: new Date(found.createdAt),
      updatedAt: new Date(found.updatedAt),
    };
  },

  async createSetting(input: any): Promise<ReportSettingApi> {
    const now = new Date();
    const newSetting: DevStoredReportSetting = {
      _id: `rep_${Date.now()}`,
      userId: input.userId,
      frequency: input.frequency || ReportFrequencyEnum.MONTHLY,
      isEnabled: input.isEnabled ?? true,
      nextReportDate: input.nextReportDate ? new Date(input.nextReportDate).toISOString() : new Date(Date.now() + 30 * 86400000).toISOString(),
      lastSentDate: null,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };
    memoryData.reportSettings.push(newSetting);
    persistToDisk();
    return {
      _id: newSetting._id,
      userId: newSetting.userId,
      frequency: newSetting.frequency,
      isEnabled: newSetting.isEnabled,
      nextReportDate: newSetting.nextReportDate ? new Date(newSetting.nextReportDate) : null,
      lastSentDate: null,
      createdAt: now,
      updatedAt: now,
    };
  },
};

// ─── CATEGORY REPO FALLBACK ──────────────────────────────────────────────────
export const devCategoryRepo = {
  async listByUser(userId: string): Promise<CategoryApi[]> {
    return memoryData.categories
      .filter((c) => c.userId === userId || c.isDefault)
      .map((c) => ({
        _id: c._id,
        userId: c.userId,
        name: c.name,
        color: c.color,
        isDefault: c.isDefault,
        createdAt: new Date(c.createdAt),
        updatedAt: new Date(c.updatedAt),
      }));
  },
};

// ─── TRANSACTION REPO FALLBACK ───────────────────────────────────────────────
export const devTransactionRepo = {
  async listByUser(userId: string, filter?: any): Promise<{ transactions: TransactionApi[]; totalCount: number }> {
    let txs = memoryData.transactions.filter((t) => t.userId === userId);
    if (filter?.type) {
      txs = txs.filter((t) => t.type === filter.type);
    }
    if (filter?.category) {
      txs = txs.filter((t) => t.category === filter.category);
    }
    if (filter?.keyword) {
      const kw = filter.keyword.toLowerCase();
      txs = txs.filter((t) => t.title?.toLowerCase().includes(kw) || t.description?.toLowerCase().includes(kw));
    }
    const mapped: TransactionApi[] = txs.map((t) => ({
      _id: t._id,
      id: t.id,
      userId: t.userId,
      title: t.title,
      type: t.type,
      amount: t.amount,
      originalAmount: t.originalAmount,
      originalCurrency: t.originalCurrency,
      baseCurrencyAtTime: t.baseCurrencyAtTime,
      exchangeRate: t.exchangeRate,
      rateSource: t.rateSource,
      exchangeRateFetchedAt: t.exchangeRateFetchedAt ? new Date(t.exchangeRateFetchedAt) : null,
      description: t.description,
      category: t.category,
      receiptUrl: t.receiptUrl,
      date: new Date(t.date),
      isRecurring: t.isRecurring,
      recurringInterval: t.recurringInterval,
      nextRecurringDate: t.nextRecurringDate ? new Date(t.nextRecurringDate) : null,
      lastProcessed: t.lastProcessed ? new Date(t.lastProcessed) : null,
      status: t.status,
      paymentMethod: t.paymentMethod,
      createdAt: new Date(t.createdAt),
      updatedAt: new Date(t.updatedAt),
    }));
    return { transactions: mapped, totalCount: mapped.length };
  },

  async findById(id: string): Promise<TransactionApi | null> {
    const t = memoryData.transactions.find((tx) => tx._id === id || tx.id === id);
    if (!t) return null;
    return {
      _id: t._id,
      id: t.id,
      userId: t.userId,
      title: t.title,
      type: t.type,
      amount: t.amount,
      originalAmount: t.originalAmount,
      originalCurrency: t.originalCurrency,
      baseCurrencyAtTime: t.baseCurrencyAtTime,
      exchangeRate: t.exchangeRate,
      rateSource: t.rateSource,
      exchangeRateFetchedAt: t.exchangeRateFetchedAt ? new Date(t.exchangeRateFetchedAt) : null,
      description: t.description,
      category: t.category,
      receiptUrl: t.receiptUrl,
      date: new Date(t.date),
      isRecurring: t.isRecurring,
      recurringInterval: t.recurringInterval,
      nextRecurringDate: t.nextRecurringDate ? new Date(t.nextRecurringDate) : null,
      lastProcessed: t.lastProcessed ? new Date(t.lastProcessed) : null,
      status: t.status,
      paymentMethod: t.paymentMethod,
      createdAt: new Date(t.createdAt),
      updatedAt: new Date(t.updatedAt),
    };
  },

  async create(input: any): Promise<TransactionApi> {
    const newId = `tx_${Date.now()}`;
    const now = new Date();
    const stored: DevStoredTransaction = {
      _id: newId,
      id: newId,
      userId: input.userId,
      title: input.title,
      description: input.description,
      amount: input.amount,
      type: input.type,
      category: input.category,
      date: input.date ? new Date(input.date).toISOString() : now.toISOString(),
      paymentMethod: input.paymentMethod || "CASH",
      isRecurring: input.recurringStatus === "RECURRING" || input.isRecurring === true,
      recurringInterval: input.recurringInterval || null,
      nextRecurringDate: null,
      lastProcessed: null,
      status: "COMPLETED",
      originalAmount: null,
      originalCurrency: null,
      baseCurrencyAtTime: null,
      exchangeRate: null,
      rateSource: null,
      exchangeRateFetchedAt: null,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };
    memoryData.transactions.unshift(stored);
    persistToDisk();

    return {
      _id: stored._id,
      id: stored.id,
      userId: stored.userId,
      title: stored.title,
      type: stored.type,
      amount: stored.amount,
      originalAmount: null,
      originalCurrency: null,
      baseCurrencyAtTime: null,
      exchangeRate: null,
      rateSource: null,
      exchangeRateFetchedAt: null,
      description: stored.description,
      category: stored.category,
      receiptUrl: stored.receiptUrl,
      date: new Date(stored.date),
      isRecurring: stored.isRecurring,
      recurringInterval: stored.recurringInterval,
      nextRecurringDate: null,
      lastProcessed: null,
      status: stored.status,
      paymentMethod: stored.paymentMethod,
      createdAt: now,
      updatedAt: now,
    };
  },

  async update(id: string, patch: any, userId?: string): Promise<TransactionApi | null> {
    const tx = memoryData.transactions.find((t) => (t._id === id || t.id === id) && (!userId || t.userId === userId));
    if (!tx) return null;

    if (patch.title !== undefined) tx.title = patch.title;
    if (patch.amount !== undefined) tx.amount = Number(patch.amount);
    if (patch.type !== undefined) tx.type = patch.type;
    if (patch.category !== undefined) tx.category = patch.category;
    if (patch.description !== undefined) tx.description = patch.description;
    if (patch.paymentMethod !== undefined) tx.paymentMethod = patch.paymentMethod;
    if (patch.date !== undefined) tx.date = new Date(patch.date).toISOString();
    if (patch.isRecurring !== undefined) tx.isRecurring = Boolean(patch.isRecurring);
    if (patch.recurringInterval !== undefined) tx.recurringInterval = patch.recurringInterval;
    tx.updatedAt = new Date().toISOString();

    persistToDisk();
    return toTransactionApiObj(tx);
  },

  async remove(id: string, userId?: string): Promise<TransactionApi | null> {
    const idx = memoryData.transactions.findIndex((t) => (t._id === id || t.id === id) && (!userId || t.userId === userId));
    if (idx === -1) return null;
    const [removed] = memoryData.transactions.splice(idx, 1);
    persistToDisk();
    return toTransactionApiObj(removed);
  },

  async removeMany(filter: any): Promise<number> {
    const before = memoryData.transactions.length;
    if (filter?.ids && Array.isArray(filter.ids)) {
      const idSet = new Set(filter.ids);
      memoryData.transactions = memoryData.transactions.filter((t) => !idSet.has(t._id) && !idSet.has(t.id));
    }
    const removedCount = before - memoryData.transactions.length;
    if (removedCount > 0) persistToDisk();
    return removedCount;
  },

  async chartAggregate(userId: string, from?: Date | null, to?: Date | null): Promise<any[]> {
    const userTxs = memoryData.transactions.filter((t) => {
      if (t.userId !== userId) return false;
      if (from && to) {
        const d = new Date(t.date).getTime();
        return d >= new Date(from).getTime() && d <= new Date(to).getTime();
      }
      return true;
    });

    const dayMap = new Map<string, { income: number; expenses: number; incomeCount: number; expenseCount: number }>();

    for (const tx of userTxs) {
      const d = new Date(tx.date);
      const dateKey = d.toISOString().split("T")[0];
      const cur = dayMap.get(dateKey) || { income: 0, expenses: 0, incomeCount: 0, expenseCount: 0 };
      const cents = Math.round(Number(tx.amount || 0) * 100);

      if (tx.type === "INCOME") {
        cur.income += cents;
        cur.incomeCount += 1;
      } else if (tx.type === "EXPENSE") {
        cur.expenses += cents;
        cur.expenseCount += 1;
      }
      dayMap.set(dateKey, cur);
    }

    const sortedDates = Array.from(dayMap.keys()).sort();
    return sortedDates.map((date) => ({
      date,
      ...dayMap.get(date)!,
    }));
  },

  async summaryAggregate(userId: string, from?: Date | null, to?: Date | null): Promise<{ totalIncome: number; totalExpenses: number; transactionCount: number } | null> {
    const userTxs = memoryData.transactions.filter((t) => {
      if (t.userId !== userId) return false;
      if (from && to) {
        const d = new Date(t.date).getTime();
        return d >= new Date(from).getTime() && d <= new Date(to).getTime();
      }
      return true;
    });

    if (userTxs.length === 0) return null;

    let totalIncome = 0;
    let totalExpenses = 0;

    for (const tx of userTxs) {
      const cents = Math.round(Number(tx.amount || 0) * 100);
      if (tx.type === "INCOME") {
        totalIncome += cents;
      } else if (tx.type === "EXPENSE") {
        totalExpenses += cents;
      }
    }

    return {
      totalIncome,
      totalExpenses,
      transactionCount: userTxs.length,
    };
  },

  async expenseByCategory(userId: string, from?: Date | null, to?: Date | null): Promise<{ name: string; value: number }[]> {
    const userTxs = memoryData.transactions.filter((t) => {
      if (t.userId !== userId || t.type !== "EXPENSE") return false;
      if (from && to) {
        const d = new Date(t.date).getTime();
        return d >= new Date(from).getTime() && d <= new Date(to).getTime();
      }
      return true;
    });

    const catMap = new Map<string, number>();
    for (const tx of userTxs) {
      const cat = (tx.category || "uncategorized").toLowerCase().trim();
      const cents = Math.round(Number(tx.amount || 0) * 100);
      catMap.set(cat, (catMap.get(cat) || 0) + cents);
    }

    return Array.from(catMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  },
};

function toTransactionApiObj(stored: DevStoredTransaction): TransactionApi {
  return {
    _id: stored._id,
    id: stored.id,
    userId: stored.userId,
    title: stored.title,
    type: stored.type,
    amount: stored.amount,
    originalAmount: stored.originalAmount || null,
    originalCurrency: stored.originalCurrency || null,
    baseCurrencyAtTime: stored.baseCurrencyAtTime || null,
    exchangeRate: stored.exchangeRate || null,
    rateSource: stored.rateSource || null,
    exchangeRateFetchedAt: stored.exchangeRateFetchedAt ? new Date(stored.exchangeRateFetchedAt) : null,
    description: stored.description,
    category: stored.category,
    receiptUrl: stored.receiptUrl,
    date: new Date(stored.date),
    isRecurring: stored.isRecurring,
    recurringInterval: stored.recurringInterval || null,
    nextRecurringDate: stored.nextRecurringDate ? new Date(stored.nextRecurringDate) : null,
    lastProcessed: stored.lastProcessed ? new Date(stored.lastProcessed) : null,
    status: stored.status,
    paymentMethod: stored.paymentMethod,
    createdAt: new Date(stored.createdAt),
    updatedAt: new Date(stored.updatedAt),
  };
}

// ─── BUDGET REPO FALLBACK ─────────────────────────────────────────────────────
export const devBudgetRepo = {
  async findByMonth(userId: string, month: number, year: number): Promise<BudgetApi | null> {
    const budgets: any[] = (memoryData as any).budgets || [];
    const b = budgets.find((item: any) => item.userId === userId && item.month === month && item.year === year);
    if (!b) return null;
    return {
      _id: b._id,
      id: b.id || b._id,
      userId: b.userId,
      month: b.month,
      year: b.year,
      totalBudget: b.totalBudget,
      categoryLimits: b.categoryLimits || [],
      createdAt: new Date(b.createdAt),
      updatedAt: new Date(b.updatedAt),
    };
  },

  async listByUser(userId: string): Promise<BudgetApi[]> {
    const budgets: any[] = (memoryData as any).budgets || [];
    return budgets.filter((item: any) => item.userId === userId).map((b: any) => ({
      _id: b._id,
      id: b.id || b._id,
      userId: b.userId,
      month: b.month,
      year: b.year,
      totalBudget: b.totalBudget,
      categoryLimits: b.categoryLimits || [],
      createdAt: new Date(b.createdAt),
      updatedAt: new Date(b.updatedAt),
    }));
  },

  async upsert(input: any): Promise<BudgetApi> {
    if (!(memoryData as any).budgets) (memoryData as any).budgets = [];
    const budgets: any[] = (memoryData as any).budgets;
    const now = new Date();
    const idx = budgets.findIndex((b: any) => b.userId === input.userId && b.month === input.month && b.year === input.year);
    if (idx !== -1) {
      budgets[idx] = {
        ...budgets[idx],
        totalBudget: input.totalBudget,
        categoryLimits: input.categoryLimits || [],
        updatedAt: now.toISOString(),
      };
      persistToDisk();
      return {
        _id: budgets[idx]._id,
        id: budgets[idx].id || budgets[idx]._id,
        userId: budgets[idx].userId,
        month: budgets[idx].month,
        year: budgets[idx].year,
        totalBudget: budgets[idx].totalBudget,
        categoryLimits: budgets[idx].categoryLimits || [],
        createdAt: new Date(budgets[idx].createdAt),
        updatedAt: now,
      };
    }
    const newBudget = {
      _id: `b_${Date.now()}`,
      id: `b_${Date.now()}`,
      userId: input.userId,
      month: input.month,
      year: input.year,
      totalBudget: input.totalBudget,
      categoryLimits: input.categoryLimits || [],
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };
    budgets.push(newBudget);
    persistToDisk();
    return {
      _id: newBudget._id,
      id: newBudget.id,
      userId: newBudget.userId,
      month: newBudget.month,
      year: newBudget.year,
      totalBudget: newBudget.totalBudget,
      categoryLimits: newBudget.categoryLimits,
      createdAt: now,
      updatedAt: now,
    };
  },

  async update(userId: string, month: number, year: number, patch: any): Promise<BudgetApi | null> {
    const budgets: any[] = (memoryData as any).budgets || [];
    const b = budgets.find((item: any) => item.userId === userId && item.month === month && item.year === year);
    if (!b) return null;
    if (patch.totalBudget !== undefined) b.totalBudget = patch.totalBudget;
    if (patch.categoryLimits !== undefined) b.categoryLimits = patch.categoryLimits;
    b.updatedAt = new Date().toISOString();
    persistToDisk();
    return {
      _id: b._id,
      id: b.id || b._id,
      userId: b.userId,
      month: b.month,
      year: b.year,
      totalBudget: b.totalBudget,
      categoryLimits: b.categoryLimits || [],
      createdAt: new Date(b.createdAt),
      updatedAt: new Date(b.updatedAt),
    };
  },

  async remove(userId: string, month: number, year: number): Promise<BudgetApi | null> {
    const budgets: any[] = (memoryData as any).budgets || [];
    const idx = budgets.findIndex((item: any) => item.userId === userId && item.month === month && item.year === year);
    if (idx === -1) return null;
    const [removed] = budgets.splice(idx, 1);
    persistToDisk();
    return {
      _id: removed._id,
      id: removed.id || removed._id,
      userId: removed.userId,
      month: removed.month,
      year: removed.year,
      totalBudget: removed.totalBudget,
      categoryLimits: removed.categoryLimits || [],
      createdAt: new Date(removed.createdAt),
      updatedAt: new Date(removed.updatedAt),
    };
  },
};
