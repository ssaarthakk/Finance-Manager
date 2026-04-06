import Feather from '@expo/vector-icons/Feather';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BalanceCard } from '../components/dashboard/BalanceCard';
import { CategoryList, GroupedExpense } from '../components/dashboard/CategoryList';
import { FloatingActionButton } from '../components/dashboard/FloatingActionButton';
import { SegmentedControl } from '../components/dashboard/SegmentedControl';
import { AddTransactionModal } from '../components/transaction/AddTransactionModal';
import { Colors } from '../constants/Colors';
import { useAuthStore } from '../store/authStore';
import { useFinanceStore } from '../store/financeStore';
import { Category } from '../types/category';
import { Transaction } from '../types/transaction';

// --- DATA HELPERS ---
const getTotalIncome = (transactions: Transaction[]) => 
    transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  
const getTotalExpenses = (transactions: Transaction[]) => 
    transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

const groupTransactionsByCategory = (transactions: Transaction[], categories: Category[]): GroupedExpense[] => {
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
        insight: 'More than last week' // Placeholder insight
    }));
};

export default function Dashboard() {
    const { currentUser } = useAuthStore();
    const { transactions, categories } = useFinanceStore();
    
    // UI states
    const [timeFilter, setTimeFilter] = useState(0);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);

    // Derived states
    const income = getTotalIncome(transactions);
    const expense = getTotalExpenses(transactions);
    const balance = income - expense;
    
    const expensesList = groupTransactionsByCategory(transactions, categories);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={styles.logoCircle}>
                        <Text style={styles.logoText}>F</Text>
                    </View>
                    <Text style={styles.appName}>FlowFi</Text>
                </View>
                <View style={styles.headerRight}>
                    <Feather name="bell" size={24} color={Colors.white} />
                </View>
            </View>

            <ScrollView 
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.greetingSection}>
                    <Text style={styles.greeting}>Hey, {currentUser?.name?.split(' ')[0] || 'there'}</Text>
                    <Text style={styles.subtitle}>Track your expenses today</Text>
                </View>

                <BalanceCard 
                    balance={balance} 
                    income={income} 
                    expense={expense} 
                />

                <SegmentedControl 
                    options={['Weekly', 'Monthly']}
                    selectedIndex={timeFilter}
                    onChange={setTimeFilter}
                />

                <CategoryList expenses={expensesList} />
            </ScrollView>

            <FloatingActionButton onPress={() => setIsAddModalVisible(true)} />
            
            <AddTransactionModal 
                visible={isAddModalVisible} 
                onClose={() => setIsAddModalVisible(false)} 
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 8,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    logoText: {
        color: Colors.black,
        fontSize: 18,
        fontWeight: 'bold',
    },
    appName: {
        color: Colors.white,
        fontSize: 20,
        fontWeight: '600',
        letterSpacing: -0.5,
    },
    headerRight: {
        width: 40,
        height: 40,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100, // accommodate fab
    },
    greetingSection: {
        marginBottom: 24,
    },
    greeting: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.white,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 15,
        color: Colors.textMuted,
    }
});
