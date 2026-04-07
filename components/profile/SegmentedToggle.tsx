import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { FadeInDown, interpolateColor, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Colors } from '../../constants/Colors';

interface SegmentedToggleProps {
    isEditMode: boolean;
    onToggle: (mode: boolean) => void;
}

export function SegmentedToggle({ isEditMode, onToggle }: SegmentedToggleProps) {
    const toggleX = useSharedValue(isEditMode ? 1 : 0);

    React.useEffect(() => {
        toggleX.value = withSpring(isEditMode ? 1 : 0, { damping: 25, stiffness: 250, mass: 0.8 });
    }, [isEditMode]);

    const togglePillStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: toggleX.value * 116 }]
        };
    });

    const previewTextStyle = useAnimatedStyle(() => ({
        color: interpolateColor(toggleX.value, [0, 1], [Colors.black, Colors.textMuted])
    }));

    const editTextStyle = useAnimatedStyle(() => ({
        color: interpolateColor(toggleX.value, [0, 1], [Colors.textMuted, Colors.black])
    }));

    return (
        <Animated.View entering={FadeInDown.delay(200).springify()} style={[styles.toggleContainer, { backgroundColor: 'transparent' }]}>
            <LinearGradient
                colors={['rgba(255,255,255,0.15)', 'rgba(0,0,0,0.8)']}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                style={[{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 30, borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)' }]}
            />
            <Animated.View style={[styles.togglePill, togglePillStyle]} />
            <Pressable style={styles.toggleButton} onPress={() => onToggle(false)}>
                <Animated.Text style={[styles.toggleText, previewTextStyle]}>Preview</Animated.Text>
            </Pressable>
            <Pressable style={styles.toggleButton} onPress={() => onToggle(true)}>
                <Animated.Text style={[styles.toggleText, editTextStyle]}>Edit</Animated.Text>
            </Pressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    toggleContainer: {
        flexDirection: 'row',
        borderRadius: 30,
        padding: 4,
        width: 240,
        alignSelf: 'center',
        marginBottom: 30,
        position: 'relative',
    },
    togglePill: {
        position: 'absolute',
        top: 4,
        bottom: 4,
        left: 4,
        width: 116,
        backgroundColor: Colors.primary,
        borderRadius: 26,
    },
    toggleButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    toggleText: {
        fontWeight: '600',
        fontSize: 14,
    },
});