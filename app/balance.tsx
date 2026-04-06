import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AnimatedBarChart } from '../components/balances/AnimatedBarChart';
import { CategoryPieChart } from '../components/balances/CategoryPieChart';
import { Colors } from '../constants/Colors';
import { useAuthStore } from '../store/authStore';
import { useFinanceStore } from '../store/financeStore';

export default function BalanceScreen() {
  const { currentUser } = useAuthStore();
  const { transactions: allTransactions, categories: allCategories } = useFinanceStore();
  
  // Automatically filter to current month's transactions
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const transactions = allTransactions.filter(t => {
    const d = new Date(t.date);
    return (!t.userId || t.userId === currentUser?.email) &&
           d.getMonth() === currentMonth &&
           d.getFullYear() === currentYear;
  });
  
  const categories = allCategories.filter(c => !c.userId || c.userId === currentUser?.email);

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;
  
  // Real ring progress: How much of your income is spent?
  const spendingProgress = totalIncome > 0 ? Math.min(totalExpenses / totalIncome, 1) : 0;

  // Calculate highest expense category for insight
  const expenseData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const grouped: Record<string, { amount: number, id: string }> = {};

    expenses.forEach(t => {
      if (!grouped[t.categoryId]) {
        grouped[t.categoryId] = { amount: 0, id: t.categoryId };
      }
      grouped[t.categoryId].amount += t.amount;
    });

    const breakdown = Object.values(grouped).map(g => {
      const cat = categories.find(c => c.id === g.id);
      return {
        categoryId: g.id,
        name: cat?.name || 'Unknown',
        amount: g.amount,
        color: cat?.color || '#888',
      };
    }).sort((a, b) => b.amount - a.amount);

    return breakdown;
  }, [transactions, categories]);

  // Calculate highest income category
  const incomeData = useMemo(() => {
    const incomes = transactions.filter(t => t.type === 'income');
    const grouped: Record<string, { amount: number, id: string }> = {};

    incomes.forEach(t => {
      if (!grouped[t.categoryId]) {
        grouped[t.categoryId] = { amount: 0, id: t.categoryId };
      }
      grouped[t.categoryId].amount += t.amount;
    });

    return Object.values(grouped).map(g => {
      const cat = categories.find(c => c.id === g.id);
      return {
        categoryId: g.id,
        name: cat?.name || 'Unknown',
        amount: g.amount,
        color: cat?.color || '#888',
      };
    }).sort((a, b) => b.amount - a.amount);
  }, [transactions, categories]);

  // Make bar chart data exactly align to the last 7 days of total expenses
  const chartData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const last7Days = Array.from({length: 7}).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return { date: d, dayLabel: days[d.getDay()] };
    });

    return last7Days.map(({ date, dayLabel }, i) => {
        const dayStr = date.toISOString().split('T')[0];
        // match transactions starting with this dayStr (e.g. '2026-04-06')
        const val = transactions
            .filter(t => t.type === 'expense' && t.date.startsWith(dayStr))
            .reduce((sum, t) => sum + t.amount, 0);
        return { id: dayStr, label: dayLabel, value: val };
    });
  }, [transactions]);

  const maxChartVal = Math.max(...chartData.map(d => d.value), 100);

  const highestExpenseName = expenseData[0]?.name || 'Nothing yet';
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Finances</Text>
        <Text style={styles.subtitle}>Monthly summary & insights</Text>
      </View>
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.insightBox}>
          <Text style={styles.insightText}>
            <Text style={styles.insightBold}>{highestExpenseName}</Text> is your highest expense
          </Text>
        </View>

        <CategoryPieChart title="Expenses by Category" data={expenseData} emptyText="No expenses tracked yet" />
        <CategoryPieChart title="Income by Category" data={incomeData} emptyText="No income tracked yet" />

        <AnimatedBarChart data={chartData} maxValue={maxChartVal} />
        
        {/* Render individual transactions */}
        <View style={styles.transactionsHeader}>
            <Text style={styles.transactionsTitle}>Recent Transactions</Text>
        </View>
        
        {transactions.length === 0 ? (
            <Text style={styles.emptyText}>No recent transactions.</Text>
        ) : (
            transactions.slice().reverse().map((t, i) => {
                const cat = categories.find(c => c.id === t.categoryId);
                const isIncome = t.type === 'income';
                return (
                    <Animated.View
                        key={t.id}
                        entering={FadeInUp.delay(200 + i * 50).springify()}
                        style={styles.transactionItem}
                    >
                        <View style={styles.itemLeft}>
                            <View style={[styles.iconContainer, { backgroundColor: (cat?.color || '#888') + '20' }]}>
                                <Ionicons name={(cat?.icon as any) || 'cube'} size={20} color={cat?.color || '#888'} />
                            </View>
                            <View>
                                <Text style={styles.transactionName}>{cat?.name || 'Unknown'}</Text>
                                <Text style={styles.transactionDate}>{new Date(t.date).toLocaleDateString()}</Text>
                            </View>
                        </View>
                        <Text style={[styles.transactionAmount, { color: isIncome ? '#10B981' : Colors.white }]}>
                            {isIncome ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                        </Text>
                    </Animated.View>
                );
            })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0B0B',
  },
  header: {
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    color: Colors.white,
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 15,
    marginTop: 4,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  transactionsHeader: {
    marginTop: 32,
    marginBottom: 16,
  },
  transactionsTitle: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionName: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  transactionDate: {
    color: '#888',
    fontSize: 13,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  insightBox: {
    backgroundColor: '#1A1A1A',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: Colors.chartMint || '#A8E6CF',
  },
  insightText: {
    color: Colors.textMuted,
    fontSize: 15,
  },
  insightBold: {
    color: Colors.white,
    fontWeight: 'bold',
  }
});