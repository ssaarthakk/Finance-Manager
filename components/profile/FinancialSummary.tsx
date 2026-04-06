import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Feather from '@expo/vector-icons/Feather';
import { Colors } from '../../constants/Colors';

interface FinancialSummaryProps {
    income: number;
    expenses: number;
    balance: number;
}

export function FinancialSummary({ income, expenses, balance }: FinancialSummaryProps) {
    return (
        <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.summaryContainer}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <View style={styles.summaryGrid}>
                <View style={[styles.summaryCard, { flex: 1, marginRight: 10 }]}>
                    <View style={[styles.iconBox, { backgroundColor: '#4ade8020' }]}>
                        <Feather name="arrow-up" size={18} color="#4ade80" />
                    </View>
                    <Text style={styles.summaryLabel}>Income</Text>
                    <Text style={styles.summaryAmount}>₹{income.toLocaleString('en-IN')}</Text>
                </View>
                <View style={[styles.summaryCard, { flex: 1, marginLeft: 10 }]}>
                    <View style={[styles.iconBox, { backgroundColor: '#f8717120' }]}>
                        <Feather name="arrow-down" size={18} color="#f87171" />
                    </View>
                    <Text style={styles.summaryLabel}>Expenses</Text>
                    <Text style={styles.summaryAmount}>₹{expenses.toLocaleString('en-IN')}</Text>
                </View>
            </View>
            <View style={styles.balanceCard}>
                <Text style={styles.balanceLabel}>Current Balance</Text>
                <Text style={styles.balanceValue}>₹{balance.toLocaleString('en-IN')}</Text>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    summaryContainer: {
        marginBottom: 24,
    },
    sectionTitle: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    summaryGrid: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    summaryCard: {
        backgroundColor: '#1A1A1A',
        borderRadius: 20,
        padding: 16,
    },
    iconBox: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    summaryLabel: {
        color: Colors.textMuted,
        fontSize: 13,
        marginBottom: 4,
    },
    summaryAmount: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    balanceCard: {
        backgroundColor: '#1A1A1A',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
    },
    balanceLabel: {
        color: Colors.textMuted,
        fontSize: 13,
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    balanceValue: {
        color: Colors.primary,
        fontSize: 28,
        fontWeight: 'bold',
    },
});