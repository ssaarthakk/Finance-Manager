import { Transaction } from '../types/transaction';
import { Category } from '../types/category';

export const getTotalIncome = (transactions: Transaction[]): number => {
  return transactions
    .filter((t) => t.type === 'income')
    .reduce((total, t) => total + t.amount, 0);
};

export const getTotalExpenses = (transactions: Transaction[]): number => {
  return transactions
    .filter((t) => t.type === 'expense')
    .reduce((total, t) => total + t.amount, 0);
};

export const getBalance = (transactions: Transaction[]): number => {
  return getTotalIncome(transactions) - getTotalExpenses(transactions);
};

export interface CategoryBreakdown {
  categoryId: string;
  categoryName?: string; // Optional, can be populated if Category models are provided
  total: number;
  percentage: number;
}

/**
 * Returns a breakdown of expenses (or income) by category.
 * If mapping to category names is needed, pass the categories array.
 */
export const getCategoryBreakdown = (
  transactions: Transaction[],
  categories?: Category[],
  type: 'income' | 'expense' = 'expense'
): CategoryBreakdown[] => {
  const filteredTransactions = transactions.filter((t) => t.type === type);
  const totalAmount = filteredTransactions.reduce((acc, t) => acc + t.amount, 0);

  if (totalAmount === 0) return [];

  const breakdownMap: Record<string, number> = {};

  filteredTransactions.forEach((t) => {
    breakdownMap[t.categoryId] = (breakdownMap[t.categoryId] || 0) + t.amount;
  });

  const breakdown: CategoryBreakdown[] = Object.keys(breakdownMap).map((categoryId) => {
    const total = breakdownMap[categoryId];
    const category = categories?.find((c) => c.id === categoryId);
    
    return {
      categoryId,
      categoryName: category?.name,
      total,
      percentage: (total / totalAmount) * 100,
    };
  });

  return breakdown.sort((a, b) => b.total - a.total);
};
