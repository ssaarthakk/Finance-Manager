import React, { useMemo } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView } from 'react-native';
import { Colors } from '../constants/Colors';
import { useFinanceStore } from '../store/financeStore';
import { RingProgress } from '../components/balances/RingProgress';
import { CategoryBreakdown } from '../components/balances/CategoryBreakdown';
import { AnimatedBarChart } from '../components/balances/AnimatedBarChart';

export default function BalanceScreen() {
  const { transactions, categories } = useFinanceStore();

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  // Calculate highest expense category
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
        color: cat?.color || '#888',
        icon: cat?.icon || 'help-circle',
        amount: g.amount,
        percentage: totalExpenses > 0 ? (g.amount / totalExpenses) * 100 : 0
      };
    }).sort((a, b) => b.amount - a.amount);

    return breakdown;
  }, [transactions, categories, totalExpenses]);

  // Mock bar chart data logic based on generic last days vs real
  // Since we don't have complex Date objects indexed, we'll generate 
  // dynamic mock shape from real totals distributed as a demo.
  const chartData = [
    { id: '1', label: 'Mon', value: totalExpenses * 0.15 },
    { id: '2', label: 'Tue', value: totalExpenses * 0.25 },
    { id: '3', label: 'Wed', value: totalExpenses * 0.1 },
    { id: '4', label: 'Thu', value: totalExpenses * 0.3 },
    { id: '5', label: 'Fri', value: totalExpenses * 0.2 },
  ];
  const maxChartVal = Math.max(...chartData.map(d => d.value), 100);

  const highestExpenseName = expenseData[0]?.name || 'Nothing';
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Finances</Text>
        <Text style={styles.subtitle}>Track your financial health</Text>
      </View>
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <RingProgress progress={0.6} balance={balance} />

        <View style={styles.insightBox}>
          <Text style={styles.insightText}>
            <Text style={styles.insightBold}>{highestExpenseName}</Text> is your highest expense
          </Text>
        </View>

        <AnimatedBarChart data={chartData} maxValue={maxChartVal} />
        
        <CategoryBreakdown data={expenseData} />
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