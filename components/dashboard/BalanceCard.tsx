import Feather from '@expo/vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Colors } from '../../constants/Colors';

interface BalanceCardProps {
    balance: number;
    income: number;
    expense: number;
}

export function BalanceCard({ balance, income, expense }: BalanceCardProps) {
    // Optional: Animated number implementation
    // For simplicity, just rendering normally with FadeInUp animation
    
    return (
        <Animated.View entering={FadeInUp.springify().mass(0.5).delay(100)} style={styles.container}>
            <LinearGradient
                colors={[Colors.chartPeach, Colors.chartMint]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                <View style={styles.topSection}>
                    <Text style={styles.label}>Total Balance</Text>
                    <Text style={styles.balance}>₹{balance.toLocaleString('en-IN')}</Text>
                </View>

                <View style={styles.bottomSection}>
                    <View style={styles.rowItem}>
                        <View style={styles.iconContainer}>
                            <Feather name="arrow-down-left" size={16} color={Colors.white} />
                        </View>
                        <View>
                            <Text style={styles.subLabel}>Income</Text>
                            <Text style={styles.subValue}>₹{income.toLocaleString('en-IN')}</Text>
                        </View>
                    </View>

                    <View style={styles.rowItem}>
                        <View style={styles.iconContainer}>
                            <Feather name="arrow-up-right" size={16} color={Colors.white} />
                        </View>
                        <View>
                            <Text style={styles.subLabel}>Expense</Text>
                            <Text style={styles.subValue}>₹{expense.toLocaleString('en-IN')}</Text>
                        </View>
                    </View>
                </View>
            </LinearGradient>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        borderRadius: 24,
        marginBottom: 24,
        shadowColor: Colors.chartMint,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    gradient: {
        borderRadius: 24,
        padding: 24,
    },
    topSection: {
        marginBottom: 32,
    },
    label: {
        color: 'rgba(0,0,0,0.7)',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    balance: {
        fontSize: 40,
        fontWeight: 'bold',
        color: Colors.black,
        letterSpacing: -1,
    },
    bottomSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rowItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        padding: 8,
        borderRadius: 12,
        marginRight: 12,
    },
    subLabel: {
        color: 'rgba(0,0,0,0.6)',
        fontSize: 12,
        fontWeight: '500',
        marginBottom: 4,
    },
    subValue: {
        color: Colors.black,
        fontSize: 16,
        fontWeight: '700',
    }
});