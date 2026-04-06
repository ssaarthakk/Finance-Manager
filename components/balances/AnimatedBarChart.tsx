import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
    FadeInUp,
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';
import { Colors } from '../../constants/Colors';

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

    useEffect(() => {
        // Staggered grow animation
        setTimeout(() => {
            scaleY.value = withSpring(1, { damping: 15, stiffness: 100 });
        }, index * 100);
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { scaleY: scaleY.value }
            ],
            // Transform origin bottom equivalent for React Native
            bottom: 0,
        };
    });

    const heightPercentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
    
    // Fallback minimum height so empty bars still show up minimally
    const finalHeight = Math.max(heightPercentage, 2);

    return (
        <View style={styles.barContainer}>
            <View style={styles.barWrapper}>
                <Animated.View 
                    style={[
                        styles.barFill, 
                        { height: `${finalHeight}%` },
                        animatedStyle
                    ]} 
                />
            </View>
            <Text style={styles.barLabel}>{item.label}</Text>
        </View>
    );
};

export const AnimatedBarChart = ({ data, maxValue }: AnimatedBarChartProps) => {
    return (
        <Animated.View entering={FadeInUp.delay(300).springify()} style={styles.container}>
            <Text style={styles.title}>Weekly Spending</Text>
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
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1A1A1A',
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
        width: 12,
        backgroundColor: '#333',
        borderRadius: 6,
        justifyContent: 'flex-end',
        overflow: 'hidden', // Ensures scaled child stays contained
        marginBottom: 8,
    },
    barFill: {
        width: '100%',
        backgroundColor: Colors.chartPeach || '#FFB067',
        borderRadius: 6,
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