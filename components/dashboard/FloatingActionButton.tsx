import Feather from '@expo/vector-icons/Feather';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Colors } from '../../constants/Colors';

export function FloatingActionButton({ onPress }: { onPress: () => void }) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));

    return (
        <Animated.View style={[styles.container, animatedStyle]}>
            <Pressable
                onPressIn={() => scale.value = withSpring(0.9)}
                onPressOut={() => scale.value = withSpring(1)}
                onPress={onPress}
                style={styles.button}
            >
                <Feather name="plus" size={24} color={Colors.white} />
            </Pressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 110,
        right: 24,
        zIndex: 10,
    },
    button: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: Colors.chartMint,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.chartMint,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 8,
    }
});