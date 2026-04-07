import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AnimatedBarChart } from '../components/balances/AnimatedBarChart';
import { CategoryPieChart } from '../components/balances/CategoryPieChart';
import { TransactionSwipeItem } from '../components/balances/TransactionSwipeItem';
import { EmptyState } from '../components/ui/EmptyState';
import { Colors, useThemeColors } from '../constants/Colors';
import { useAuthStore } from '../store/authStore';
import { useFinanceStore } from '../store/financeStore';

export default function BalanceScreen() {
  const { currentUser } = useAuthStore();
  const themeColors = useThemeColors();
  const { transactions: allTransactions, categories: allCategories, deleteTransaction, restoreTransaction } = useFinanceStore();

  const [deletedTx, setDeletedTx] = useState<any>(null);

  const handleDelete = (tx: any) => {
    deleteTransaction(tx.id);
    setDeletedTx(tx);
  };

  const handleUndo = () => {
    if (deletedTx) {
      restoreTransaction(deletedTx);
      setDeletedTx(null);
    }
  };

  useEffect(() => {
    let timer: any;
    if (deletedTx) {
      timer = setTimeout(() => {
        setDeletedTx(null);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [deletedTx]);

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

  const chartData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return { date: d, dayLabel: days[d.getDay()] };
    });

    return last7Days.map(({ date, dayLabel }, i) => {
      const dayStr = date.toISOString().split('T')[0];
      const val = transactions
        .filter(t => t.type === 'expense' && t.date.startsWith(dayStr))
        .reduce((sum, t) => sum + t.amount, 0);
      return { id: dayStr, label: dayLabel, value: val };
    });
  }, [transactions]);

  const maxChartVal = Math.max(...chartData.map(d => d.value), 100);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: themeColors.text }]}>Your Finances</Text>
        <Text style={[styles.subtitle, { color: themeColors.textMuted }]}>Monthly summary & insights</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {transactions.length === 0 ? (
          <EmptyState 
            title="No data available"
            subtitle="Add transactions to see your financial insights"
            icon="bar-chart-outline"
          />
        ) : (
          <>
            <CategoryPieChart title="Expenses by Category" data={expenseData} emptyText="No expenses tracked yet" />
            <CategoryPieChart title="Income by Category" data={incomeData} emptyText="No income tracked yet" />

            <AnimatedBarChart data={chartData} maxValue={maxChartVal} />

            <View style={styles.transactionsHeader}>
              <Text style={[styles.transactionsTitle, { color: themeColors.text }]}>Recent Transactions</Text>
            </View>

            {transactions.slice().reverse().map((t, i) => {
              const cat = categories.find(c => c.id === t.categoryId);
              return (
                <TransactionSwipeItem
                  key={t.id}
                  transaction={t}
                  category={cat}
                  index={i}
                  onDelete={handleDelete}
                />
              );
            })}
          </>
        )}
      </ScrollView>

      {/* Undo Toast */}
      {deletedTx && (
        <Animated.View 
          entering={SlideInDown.springify()} 
          exiting={SlideOutDown} 
          style={styles.toastContainer}
        >
          <Text style={styles.toastText}>Transaction deleted</Text>
          <Pressable onPress={handleUndo} style={styles.undoBtn}>
            <Text style={styles.undoText}>Undo</Text>
          </Pressable>
        </Animated.View>
      )}
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
    paddingBottom: 160,
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
  toastContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: '#333',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  toastText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
  undoBtn: {
    padding: 8,
  },
  undoText: {
    color: Colors.chartMint,
    fontWeight: 'bold',
    fontSize: 15,
  }
});