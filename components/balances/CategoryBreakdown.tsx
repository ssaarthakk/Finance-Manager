import Feather from '@expo/vector-icons/Feather';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Colors } from '../../constants/Colors';

interface CategoryData {
    categoryId: string;
    name: string;
    color: string;
    icon: string;
    amount: number;
    percentage: number;
}

interface CategoryBreakdownProps {
    data: CategoryData[];
}

export const CategoryBreakdown = ({ data }: CategoryBreakdownProps) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Spending Breakdown</Text>
            {data.length === 0 ? (
                <Text style={styles.emptyText}>No expenses yet.</Text>
            ) : (
                data.map((item, index) => {
                    return (
                        <Animated.View 
                            key={item.categoryId}
                            entering={FadeInUp.delay(400 + index * 100).springify()}
                            style={styles.itemContainer}
                        >
                            <View style={styles.leftSection}>
                                <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
                                    <Feather name={item.icon as any || 'box'} size={20} color={item.color} />
                                </View>
                                <View style={styles.textContainer}>
                                    <Text style={styles.name}>{item.name}</Text>
                                    <View style={styles.progressTrack}>
                                        <View 
                                            style={[
                                                styles.progressFill, 
                                                { width: `${item.percentage}%`, backgroundColor: item.color }
                                            ]} 
                                        />
                                    </View>
                                </View>
                            </View>

                            <View style={styles.rightSection}>
                                <Text style={styles.amount}>₹{item.amount.toFixed(2)}</Text>
                                <Text style={styles.percentage}>{item.percentage.toFixed(0)}%</Text>
                            </View>
                        </Animated.View>
                    );
                })
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        marginBottom: 20,
    },
    title: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    emptyText: {
        color: Colors.textMuted,
        fontSize: 14,
        textAlign: 'center',
        marginTop: 10,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#1A1A1A',
        padding: 16,
        borderRadius: 20,
        marginBottom: 12,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingRight: 16,
    },
    name: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    progressTrack: {
        height: 4,
        backgroundColor: '#333',
        borderRadius: 2,
        width: '100%',
    },
    progressFill: {
        height: '100%',
        borderRadius: 2,
    },
    rightSection: {
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    amount: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    percentage: {
        color: Colors.textMuted,
        fontSize: 13,
        fontWeight: '500',
    }
});