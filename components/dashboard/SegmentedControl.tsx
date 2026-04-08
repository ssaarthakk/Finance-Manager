import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { LayoutRectangle, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useThemeColors } from '../../constants/Colors';
import { SPACING } from '../../constants/Spacing';
import { useThemeStore } from '../../store/themeStore';
import { triggerHaptic } from '../../utils/haptics';

interface SegmentedControlProps {
    options: string[];
    selectedIndex: number;
    onChange: (index: number) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function SegmentedButton({
    option,
    isSelected,
    onPress,
    onLayout,
    themeColors
}: {
    option: string;
    isSelected: boolean;
    onPress: () => void;
    onLayout: (e: any) => void;
    themeColors: any;
}) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));

    return (
        <AnimatedPressable
            style={[styles.tabItem, animatedStyle]}
            onPress={onPress}
            onPressIn={() => scale.value = withSpring(0.95)}
            onPressOut={() => scale.value = withSpring(1)}
            onLayout={onLayout}
        >
            <Text style={[styles.tabLabel, { color: isSelected ? themeColors.background : themeColors.textMuted }]}>
                {option}
            </Text>
        </AnimatedPressable>
    );
}

export function SegmentedControl({ options, selectedIndex, onChange }: SegmentedControlProps) {
    const { theme } = useThemeStore();
    const themeColors = useThemeColors();
    const [dimensions, setDimensions] = useState<{ [key: number]: LayoutRectangle }>({});
    
    const animatedX = useSharedValue(0);
    const animatedWidth = useSharedValue(0);

    useEffect(() => {
        const layout = dimensions[selectedIndex];
        if (layout) {
            animatedX.value = withSpring(layout.x, { damping: 25, stiffness: 250, mass: 0.8 });
            animatedWidth.value = withSpring(layout.width, { damping: 25, stiffness: 250, mass: 0.8 });
        }
    }, [selectedIndex, dimensions]);

    const activePillStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: animatedX.value }],
        width: animatedWidth.value,
        opacity: animatedWidth.value > 0 ? 1 : 0
    }));

    return (
        <View style={[styles.container, { backgroundColor: themeColors.layer1 }]}>
            <LinearGradient
                colors={theme === 'dark' ? ['rgba(255,255,255,0.15)', 'rgba(0,0,0,0.8)'] : ['rgba(255,255,255,0.8)', 'rgba(0,0,0,0.05)']}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                style={[{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 20, borderWidth: 1, borderColor: theme === 'dark' ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.1)' }]}
            />
            <Animated.View style={[styles.activePill, activePillStyle, { backgroundColor: themeColors.text }]} />

            {options.map((option, index) => {
                const isSelected = index === selectedIndex;
                return (
                    <SegmentedButton
                        key={option}
                        option={option}
                        isSelected={isSelected}
                        onPress={() => {
                            if (!isSelected) {
                                triggerHaptic('selection');
                                onChange(index);
                            }
                        }}
                        onLayout={(e) => {
                            const newLayout = e.nativeEvent.layout;
                            setDimensions(prev => ({ ...prev, [index]: newLayout }));
                        }}
                        themeColors={themeColors}
                    />
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderRadius: 20,
        padding: SPACING.xs,
        marginBottom: SPACING.xl,
        position: 'relative',
    },
    activePill: {
        position: 'absolute',
        top: SPACING.xs,
        bottom: SPACING.xs,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10,
    },
    tabLabel: {
        fontSize: 14,
        fontWeight: '600',
    }
});