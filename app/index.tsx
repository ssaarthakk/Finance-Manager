import Feather from '@expo/vector-icons/Feather';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BalanceCard } from '../components/dashboard/BalanceCard';
import { CategoryList } from '../components/dashboard/CategoryList';
import { FloatingActionButton } from '../components/dashboard/FloatingActionButton';
import { SegmentedControl } from '../components/dashboard/SegmentedControl';
import { AddTransactionModal } from '../components/transaction/AddTransactionModal';
import { Colors } from '../constants/Colors';
import { useAuthStore } from '../store/authStore';
import { useFinanceStore } from '../store/financeStore';
import {
    filterTransactionsByTime,
    getTotalExpenses,
    getTotalIncome,
    groupTransactionsByCategory
} from '../utils/financeHelpers';

export default function Dashboard() {
    const { currentUser } = useAuthStore();
    const { transactions: allTransactions, categories: allCategories } = useFinanceStore();
    
    const [timeFilter, setTimeFilter] = useState(0);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);

    const transactions = allTransactions.filter(t => !t.userId || t.userId === currentUser?.email);
    const categories = allCategories.filter(c => !c.userId || c.userId === currentUser?.email);
    const filteredTransactions = filterTransactionsByTime(transactions, timeFilter);
    const income = getTotalIncome(filteredTransactions);
    const expense = getTotalExpenses(filteredTransactions);
    const balance = income - expense;
    
    const expensesList = groupTransactionsByCategory(filteredTransactions, categories);

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
