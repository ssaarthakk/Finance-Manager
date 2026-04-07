import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware';
import { Category } from '../types/category';
import { Transaction } from '../types/transaction';
import { generateId } from '../utils/id';
import { useAuthStore } from './authStore';

/**
 * Shared storage adapter that reads/writes normally.
 * We will filter transactions by user ID instead of making storage dynamically change keys.
 */
const userNamespacedStorage: StateStorage = {
    getItem: async (name: string): Promise<string | null> => {
        return await AsyncStorage.getItem(name);
    },
    setItem: async (name: string, value: string): Promise<void> => {
        await AsyncStorage.setItem(name, value);
    },
    removeItem: async (name: string): Promise<void> => {
        await AsyncStorage.removeItem(name);
    },
};

const defaultCategories: Category[] = [
    { id: 'cat-1', name: 'Food', icon: 'fast-food-outline', color: '#FF5722', type: 'expense' },
    { id: 'cat-2', name: 'Salary', icon: 'cash-outline', color: '#4CAF50', type: 'income' },
    { id: 'cat-3', name: 'Transport', icon: 'car-outline', color: '#2196F3', type: 'expense' },
    { id: 'cat-4', name: 'Shopping', icon: 'cart-outline', color: '#E91E63', type: 'expense' },
    { id: 'cat-5', name: 'Bills', icon: 'receipt-outline', color: '#9C27B0', type: 'expense' },
    { id: 'cat-6', name: 'Health', icon: 'medkit-outline', color: '#F44336', type: 'expense' },
    { id: 'cat-7', name: 'Freelance', icon: 'laptop-outline', color: '#00BCD4', type: 'income' },
    { id: 'cat-8', name: 'Investments', icon: 'trending-up-outline', color: '#8BC34A', type: 'income' },
    { id: 'cat-9', name: 'Entertainment', icon: 'game-controller-outline', color: '#673AB7', type: 'expense' },
    { id: 'cat-10', name: 'Other', icon: 'ellipsis-horizontal-outline', color: '#757575', type: 'expense' },
    { id: 'cat-11', name: 'Other', icon: 'ellipsis-horizontal-outline', color: '#757575', type: 'income' },
];

interface FinanceState {
    transactions: Transaction[];
    categories: Category[];

    addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
    deleteTransaction: (id: string) => void;
    restoreTransaction: (transaction: Transaction) => void;
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
                const user = useAuthStore.getState().currentUser;
                const newTransaction: Transaction = {
                    ...transaction,
                    id: generateId(),
                    userId: user?.email,
                };
                set((state) => ({ transactions: [...state.transactions, newTransaction] }));
            },

            deleteTransaction: (id) => {
                set((state) => ({
                    transactions: state.transactions.filter((t) => t.id !== id),
                }));
            },

            restoreTransaction: (transaction) => {
                set((state) => ({
                    // insert it back so it's not totally lost or place it to the end.
                    transactions: [...state.transactions, transaction].sort(
                        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
                    ),
                }));
            },

            addCategory: (category) => {
                const user = useAuthStore.getState().currentUser;
                const newCategory: Category = {
                    ...category,
                    id: generateId(),
                    userId: user?.email,
                };
                set((state) => ({ categories: [...state.categories, newCategory] }));
            },

            clearState: () => {
                set({ transactions: [], categories: defaultCategories });
            },

            getTransactionsByMonth: (month, year) => {
                const user = useAuthStore.getState().currentUser;
                const { transactions } = get();
                return transactions.filter((t) => {
                    const date = new Date(t.date);
                    return date.getMonth() === month && date.getFullYear() === year && (!t.userId || t.userId === user?.email);
                });
            },

            getCategories: (type) => {
                const user = useAuthStore.getState().currentUser;
                const { categories } = get();
                
                // Ensure all default categories are always available even if state was persisted before they were added
                const mergedCategories = [...categories];
                defaultCategories.forEach(dc => {
                    if (!mergedCategories.some(c => c.id === dc.id)) {
                        mergedCategories.push(dc);
                    }
                });

                let userCategories = mergedCategories.filter(c => !c.userId || c.userId === user?.email);
                return type ? userCategories.filter((c) => c.type === type) : userCategories;
            },
        }),
        {
            name: 'finance_app_data',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
