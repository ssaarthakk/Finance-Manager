import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware';
import { Category } from '../types/category';
import { Transaction } from '../types/transaction';
import { generateId } from '../utils/id';
import { useAuthStore } from './authStore';

/**
 * Isolated storage adapter.
 * Uses the currentUser email to namespace the data.
 * E.g. 'finance_app_user_johndoe@email.com'
 */
const userNamespacedStorage: StateStorage = {
    getItem: async (name: string): Promise<string | null> => {
        const user = useAuthStore.getState().currentUser;
        const key = user ? `${name}_user_${user.email}` : name;
        return await AsyncStorage.getItem(key);
    },
    setItem: async (name: string, value: string): Promise<void> => {
        const user = useAuthStore.getState().currentUser;
        const key = user ? `${name}_user_${user.email}` : name;
        await AsyncStorage.setItem(key, value);
    },
    removeItem: async (name: string): Promise<void> => {
        const user = useAuthStore.getState().currentUser;
        const key = user ? `${name}_user_${user.email}` : name;
        await AsyncStorage.removeItem(key);
    },
};

const defaultCategories: Category[] = [
    { id: 'cat-1', name: 'Food', icon: 'fast-food-outline', color: '#ff5722', type: 'expense' },
    { id: 'cat-2', name: 'Salary', icon: 'cash-outline', color: '#4caf50', type: 'income' },
];

interface FinanceState {
    transactions: Transaction[];
    categories: Category[];

    addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
    deleteTransaction: (id: string) => void;
    addCategory: (category: Omit<Category, 'id'>) => void;

    clearState: () => void;

    getTransactionsByMonth: (month: number, year: number) => Transaction[];
    getCategories: (type?: 'income' | 'expense') => Category[];
}

export const useFinanceStore = create<FinanceState>()(
    persist(
        (set, get) => ({
            transactions: [],
            categories: defaultCategories,

            addTransaction: (transaction) => {
                const newTransaction: Transaction = {
                    ...transaction,
                    id: generateId(),
                };
                set((state) => ({ transactions: [...state.transactions, newTransaction] }));
            },

            deleteTransaction: (id) => {
                set((state) => ({
                    transactions: state.transactions.filter((t) => t.id !== id),
                }));
            },

            addCategory: (category) => {
                const newCategory: Category = {
                    ...category,
                    id: generateId(),
                };
                set((state) => ({ categories: [...state.categories, newCategory] }));
            },

            clearState: () => {
                set({ transactions: [], categories: defaultCategories });
            },

            getTransactionsByMonth: (month, year) => {
                const { transactions } = get();
                return transactions.filter((t) => {
                    const date = new Date(t.date);
                    return date.getMonth() === month && date.getFullYear() === year;
                });
            },

            getCategories: (type) => {
                const { categories } = get();
                return type ? categories.filter((c) => c.type === type) : categories;
            },
        }),
        {
            name: 'finance_app',
            storage: createJSONStorage(() => userNamespacedStorage),
        }
    )
);
