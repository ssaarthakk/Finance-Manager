import Feather from '@expo/vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeInUp, useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import { Colors, useThemeColors } from '../../constants/Colors';

interface BalanceCardProps {
    balance: number;
    income: number;
    expense: number;
}

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

function AnimatedNumber({ value, style }: { value: number; style: any }) {
    const animatedValue = useSharedValue(value);

    useEffect(() => {
        animatedValue.value = withTiming(value, { duration: 700 });
    }, [animatedValue, value]);

    const animatedProps = useAnimatedProps(() => ({
        text: `₹${Math.round(animatedValue.value).toLocaleString('en-IN')}`,
    }));

    return (
        <AnimatedTextInput
            editable={false}
            underlineColorAndroid="transparent"
            defaultValue={`₹${Math.round(value).toLocaleString('en-IN')}`}
            animatedProps={animatedProps as any}
            style={style}
        />
    );
}

export function BalanceCard({ balance, income, expense }: BalanceCardProps) {
    const themeColors = useThemeColors();

    return (
        <Animated.View entering={FadeInUp.springify().mass(0.5).delay(100)} style={styles.container}>
            <LinearGradient
                colors={[themeColors.chartPeach, themeColors.chartMint]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                <View style={styles.topSection}>
                    <Text style={[styles.label, { color: themeColors.background }]}>Total Balance</Text>
                    <AnimatedNumber value={balance} style={[styles.balance, { color: themeColors.background }]} />
                </View>

                <View style={styles.bottomSection}>
                    <View style={styles.rowItem}>
                        <View style={[styles.iconContainer, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                            <Feather name="arrow-down-left" size={16} color={themeColors.background} />
                        </View>
                        <View>
                            <Text style={[styles.subLabel, { color: themeColors.background }]}>Income</Text>
                            <AnimatedNumber value={income} style={[styles.subValue, { color: themeColors.background }]} />
                        </View>
                    </View>

                    <View style={styles.rowItem}>
                        <View style={[styles.iconContainer, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                            <Feather name="arrow-up-right" size={16} color={themeColors.background} />
                        </View>
                        <View>
                            <Text style={[styles.subLabel, { color: themeColors.background }]}>Expense</Text>
                            <AnimatedNumber value={expense} style={[styles.subValue, { color: themeColors.background }]} />
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