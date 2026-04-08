import Feather from '@expo/vector-icons/Feather';
import { useIsFocused } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeInUp, useAnimatedProps, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { Colors, useThemeColors } from '../../constants/Colors';

interface BalanceCardProps {
    balance: number;
    income: number;
    expense: number;
}

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function AnimatedNumber({ value, style, isFocused }: { value: number; style: any; isFocused: boolean }) {
    const animatedValue = useSharedValue(value);

    useEffect(() => {
        if (isFocused) {
            animatedValue.value = 0;
            animatedValue.value = withTiming(value, { duration: 700 });
        } else {
            animatedValue.value = value;
        }
    }, [animatedValue, value, isFocused]);

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
    const scale = useSharedValue(1);
    const isFocused = useIsFocused();

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));

    return (
        <Animated.View
            key={isFocused ? 'focused' : 'unfocused'}
            entering={isFocused ? FadeInUp.springify().mass(0.5).delay(100) : undefined}
            style={styles.wrapper}
        >
            <AnimatedPressable 
                style={[styles.container, animatedStyle]}
                onPressIn={() => scale.value = withSpring(0.96)}
                onPressOut={() => scale.value = withSpring(1)}
            >
                <LinearGradient
                colors={[themeColors.chartPeach, themeColors.chartMint]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                <View style={styles.topSection}>
                    <Text style={[styles.label, { color: themeColors.background }]}>Total Balance</Text>
                    <AnimatedNumber value={balance} style={[styles.balance, { color: themeColors.background }]} isFocused={isFocused} />
                </View>

                <View style={styles.bottomSection}>
                    <View style={styles.rowItem}>
                        <View style={[styles.iconContainer, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                            <Feather name="arrow-down-left" size={16} color={themeColors.background} />
                        </View>
                        <View>
                            <Text style={[styles.subLabel, { color: themeColors.background }]}>Income</Text>
                            <AnimatedNumber value={income} style={[styles.subValue, { color: themeColors.background }]} isFocused={isFocused} />
                        </View>
                    </View>

                    <View style={styles.rowItem}>
                        <View style={[styles.iconContainer, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                            <Feather name="arrow-up-right" size={16} color={themeColors.background} />
                        </View>
                        <View>
                            <Text style={[styles.subLabel, { color: themeColors.background }]}>Expense</Text>
                            <AnimatedNumber value={expense} style={[styles.subValue, { color: themeColors.background }]} isFocused={isFocused} />
                        </View>
                    </View>
                </View>
            </LinearGradient>
            </AnimatedPressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        marginBottom: 24,
    },
    container: {
        width: '100%',
        borderRadius: 24,
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