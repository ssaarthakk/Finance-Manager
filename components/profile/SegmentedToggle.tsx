import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { FadeInDown, interpolateColor, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Colors, useThemeColors } from '../../constants/Colors';
import { useThemeStore } from '../../store/themeStore';

interface SegmentedToggleProps {
    isEditMode: boolean;
    onToggle: (mode: boolean) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function SegmentedToggleButton({
    label,
    onPress,
    textStyle,
    isEditMode,
    themeColors
}: {
    label: string,
    onPress: () => void,
    textStyle: any,
    isEditMode: boolean,
    themeColors: any
}) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));

    return (
        <AnimatedPressable 
            style={[styles.toggleButton, animatedStyle]} 
            onPress={onPress}
            onPressIn={() => scale.value = withSpring(0.95)}
            onPressOut={() => scale.value = withSpring(1)}
        >
            <Animated.Text style={[styles.toggleText, textStyle]}>
                {label}
            </Animated.Text>
        </AnimatedPressable>
    );
}

export function SegmentedToggle({ isEditMode, onToggle }: SegmentedToggleProps) {
    const toggleX = useSharedValue(isEditMode ? 1 : 0);
    const { theme } = useThemeStore();
    const themeColors = useThemeColors();

    React.useEffect(() => {
        toggleX.value = withSpring(isEditMode ? 1 : 0, { damping: 25, stiffness: 250, mass: 0.8 });
    }, [isEditMode]);

    const togglePillStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: toggleX.value * 116 }]
        };
    });

    const previewTextStyle = useAnimatedStyle(() => ({
        color: interpolateColor(Math.max(0, Math.min(1, toggleX.value)), [0, 1], [themeColors.background as any, themeColors.textMuted as any])
    }));

    const editTextStyle = useAnimatedStyle(() => ({
        color: interpolateColor(Math.max(0, Math.min(1, toggleX.value)), [0, 1], [themeColors.textMuted as any, themeColors.background as any])
    }));

    return (
        <Animated.View entering={FadeInDown.delay(200).springify()} style={[styles.toggleContainer, { backgroundColor: themeColors.layer1 }]}>
            <LinearGradient
                colors={theme === 'dark' ? ['rgba(255,255,255,0.15)', 'rgba(0,0,0,0.8)'] : ['rgba(255,255,255,0.8)', 'rgba(0,0,0,0.05)']}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                style={[{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 30, borderWidth: 1, borderColor: theme === 'dark' ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.1)' }]}
            />
            <Animated.View style={[styles.togglePill, togglePillStyle, { backgroundColor: themeColors.text }]} />
            <SegmentedToggleButton
                label="Preview"
                onPress={() => onToggle(false)}
                textStyle={previewTextStyle}
                isEditMode={isEditMode}
                themeColors={themeColors}
            />
            <SegmentedToggleButton
                label="Edit"
                onPress={() => onToggle(true)}
                textStyle={editTextStyle}
                isEditMode={isEditMode}
                themeColors={themeColors}
            />
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