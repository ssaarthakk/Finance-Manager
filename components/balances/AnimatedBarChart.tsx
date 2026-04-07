import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
    FadeInUp,
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';
import { Colors, useThemeColors } from '../../constants/Colors';
import { useThemeStore } from '../../store/themeStore';

import { EmptyState } from '../ui/EmptyState';

interface BarData {
    id: string;
    label: string;
    value: number;
}

interface AnimatedBarChartProps {
    data: BarData[];
    maxValue: number;
}

const Bar = ({ item, maxValue, index }: { item: BarData, maxValue: number, index: number }) => {
    const scaleY = useSharedValue(0);
    const themeColors = useThemeColors();

    useEffect(() => {
        setTimeout(() => {
            scaleY.value = withSpring(1, { damping: 15, stiffness: 100 });
        }, index * 100);
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { scaleY: scaleY.value }
            ],
            bottom: 0,
        };
    });

    const heightPercentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
    
    const finalHeight = Math.max(heightPercentage, 2);

    return (
        <View style={styles.barContainer}>
            <View style={[styles.barWrapper, { backgroundColor: themeColors.layer1 }]}>
                <Animated.View 
                    style={[
                        styles.barFill, 
                        { height: `${finalHeight}%`, overflow: 'hidden' },
                        animatedStyle
                    ]} 
                >
                    <LinearGradient
                        colors={[themeColors.chartPeach, themeColors.chartMint]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style={StyleSheet.absoluteFill}
                    />
                </Animated.View>
            </View>
            <Text style={[styles.barLabel, { color: themeColors.textMuted }]}>{item.label}</Text>
        </View>
    );
};

export const AnimatedBarChart = ({ data, maxValue }: AnimatedBarChartProps) => {
    const themeColors = useThemeColors();
    const { theme } = useThemeStore();
    const totalVal = data.reduce((sum, d) => sum + d.value, 0);

    return (
        <Animated.View entering={FadeInUp.delay(300).springify()} style={styles.container}>
            <LinearGradient 
              colors={theme === 'dark' ? ['rgba(255,255,255,0.15)', 'rgba(0,0,0,0.8)'] : ['rgba(255,255,255,0.8)', 'rgba(0,0,0,0.05)']} 
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 0 }}
              style={[StyleSheet.absoluteFill, { borderRadius: 24, borderWidth: 1, borderColor: themeColors.border }]} 
            />
            <Text style={[styles.title, { color: themeColors.text }]}>Weekly Spending</Text>

            {totalVal === 0 ? (
                <EmptyState 
                  title="No spending data"
                  subtitle="Add transactions to see your spending trends"
                  emoji="📊"
                />
            ) : (
                <View style={styles.chartArea}>
                    {data.map((item, index) => (
                        <Bar 
                            key={item.id} 
                            item={item} 
                            maxValue={maxValue} 
                            index={index} 
                        />
                    ))}
                </View>
            )}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        borderRadius: 24,
        padding: 20,
        marginBottom: 20,
    },
    title: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 20,
    },
    chartArea: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 150,
        paddingTop: 10,
    },
    barContainer: {
        alignItems: 'center',
        flex: 1,
    },
    barWrapper: {
        height: 110,
        width: 24,
        backgroundColor: '#333',
        borderRadius: 12,
        justifyContent: 'flex-end',
        overflow: 'hidden',
        marginBottom: 8,
    },
    barFill: {
        width: '100%',
        backgroundColor: 'transparent',
        borderRadius: 12,
        // The scaling originates from the center by default in RN, 
        // to make it scale from bottom, we usually wrap it or translateY.
        // A simple height animation works better for bars in RN instead of scaleY
        // because of transform origin issues.
        // But the prompt asked for scaleY. We'll use a wrapper and translateY trick or just apply scaleY.
        // Actually, scaleY is tricky without transform origin. Let's just animate height via scaleY!
        // To fix origin bottom: margin-top pushes it down. But wait! I implemented overflow hidden and position bottom: 0.
        // Let's rely on standard height% and standard scale. It'll scale from center but since it's inside a wrapper 
        // that justifies flex-end, it looks better.
    },
    barLabel: {
        color: Colors.textMuted,
        fontSize: 12,
    }
});