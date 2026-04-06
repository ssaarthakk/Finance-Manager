import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Colors } from '../../constants/Colors';
import { Category } from '../../types/category';

export interface GroupedExpense {
    category: Category;
    amount: number;
    insight: string;
}

interface CategoryListProps {
    expenses: GroupedExpense[];
}

export function CategoryList({ expenses }: CategoryListProps) {
    if (expenses.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No expenses yet. Tap + to add!</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Your expenses</Text>

            {expenses.map((expense, index) => (
                <Animated.View
                    key={expense.category.id}
                    entering={FadeInUp.delay(200 + index * 100).springify().mass(0.5)}
                    style={styles.card}
                >
                    <View style={styles.leftContent}>
                        <View style={[styles.iconContainer, { backgroundColor: expense.category.color + '20' }]}>
                            <Ionicons name={(expense.category.icon as any) || 'cube'} size={20} color={expense.category.color} />
                        </View>
                        <View>
                            <Text style={styles.categoryName}>{expense.category.name}</Text>
                            <Text style={styles.insight}>{expense.insight}</Text>
                        </View>
                    </View>

                    <View style={styles.rightContent}>
                        <Text style={styles.amount}>₹{expense.amount.toLocaleString('en-IN')}</Text>
                    </View>
                </Animated.View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingBottom: 40,
    },
    sectionTitle: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.card,
        padding: 16,
        borderRadius: 20,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    leftContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    categoryName: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    insight: {
        color: Colors.textMuted,
        fontSize: 12,
    },
    rightContent: {
        alignItems: 'flex-end',
    },
    amount: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    emptyContainer: {
        padding: 24,
        alignItems: 'center',
    },
    emptyText: {
        color: Colors.textMuted,
        fontSize: 14,
    }
});