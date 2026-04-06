import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
    FadeIn,
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';
import { Colors } from '../../constants/Colors';

interface RingProgressProps {
    balance: number;
    progress: number; // 0 to 1
}

export const RingProgress = ({ balance, progress }: RingProgressProps) => {
    // We will build a multi-layered circle using standard views for a faux-ring effect
    // To do an actual semi-circle we'd use SVG, but standard views clipped via border width/radius looks amazing too.

    const innerScale = useSharedValue(0.5);

    useEffect(() => {
        innerScale.value = withSpring(1, { damping: 12, stiffness: 90 });
    }, []);

    const animatedInnerStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: innerScale.value }]
        };
    });

    return (
        <Animated.View entering={FadeIn.duration(800)} style={styles.container}>
            <View style={styles.outerRing}>
                <View style={styles.progressRingIndicator} />
                <Animated.View style={[styles.innerCircle, animatedInnerStyle]}>
                    <Text style={styles.label}>Current Balance</Text>
                    <Text style={styles.balanceText}>₹{balance.toLocaleString('en-IN')}</Text>
                </Animated.View>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 30,
    },
    outerRing: {
        width: 220,
        height: 220,
        borderRadius: 110,
        borderWidth: 20,
        borderColor: '#222', // track color
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    progressRingIndicator: {
        // A faux progress visualization layering a border
        position: 'absolute',
        width: 220,
        height: 220,
        borderRadius: 110,
        borderWidth: 20,
        borderColor: Colors.chartMint || '#A8E6CF',
        borderTopColor: 'transparent',
        borderRightColor: 'transparent',
        transform: [{ rotate: '-45deg' }], // Makes it look like a semi-circle bottom-left sweep
    },
    innerCircle: {
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: '#1A1A1A',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 8,
    },
    label: {
        color: Colors.textMuted,
        fontSize: 13,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
    },
    balanceText: {
        color: Colors.white,
        fontSize: 28,
        fontWeight: 'bold',
    }
});