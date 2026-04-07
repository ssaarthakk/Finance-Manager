import { Category } from '../types/category';
import { Transaction } from '../types/transaction';
import { GroupedExpense } from '../components/dashboard/CategoryList';

export const getTotalIncome = (transactions: Transaction[]) => 
    transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  
export const getTotalExpenses = (transactions: Transaction[]) => 
    transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

export const groupTransactionsByCategory = (transactions: Transaction[], categories: Category[]): GroupedExpense[] => {
    const expenseTxs = transactions.filter(t => t.type === 'expense');
    const grouped: Record<string, { category: Category, amount: number }> = {};
    
    expenseTxs.forEach(t => {
      const category = categories.find(c => c.id === t.categoryId);
      if (category) {
          if (!grouped[t.categoryId]) {
            grouped[t.categoryId] = { category, amount: 0 };
          }
          grouped[t.categoryId].amount += t.amount;
      }
    });

    return Object.values(grouped).sort((a, b) => b.amount - a.amount).map(g => ({
        ...g,
        insight: 'More than last week'
    }));
};

export const filterTransactionsByTime = (transactions: Transaction[], filterIndex: number): Transaction[] => {
    const now = new Date();
    const cutoff = new Date();
    if (filterIndex === 0) {
        cutoff.setDate(now.getDate() - 7);
    } else {
        cutoff.setMonth(now.getMonth() - 1);
    }
    return transactions.filter(t => new Date(t.date) >= cutoff);
};