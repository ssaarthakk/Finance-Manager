import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeInDown, interpolateColor, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Colors } from '../../constants/Colors';

interface SegmentedToggleProps {
    isEditMode: boolean;
    onToggle: (mode: boolean) => void;
}

export function SegmentedToggle({ isEditMode, onToggle }: SegmentedToggleProps) {
    const toggleX = useSharedValue(isEditMode ? 1 : 0);

    // Update shared value if prop changes (though standard practice would hook this all inside here,
    // we keep state lifted to parent to control inputs)
    React.useEffect(() => {
        toggleX.value = withSpring(isEditMode ? 1 : 0, { damping: 15, stiffness: 120 });
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
        <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.toggleContainer}>
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
        backgroundColor: '#1A1A1A',
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