import React, { useEffect, useState } from 'react';
import { LayoutRectangle, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Colors } from '../../constants/Colors';

interface SegmentedControlProps {
    options: string[];
    selectedIndex: number;
    onChange: (index: number) => void;
}

export function SegmentedControl({ options, selectedIndex, onChange }: SegmentedControlProps) {
    const [dimensions, setDimensions] = useState<{ [key: number]: LayoutRectangle }>({});
    
    const animatedX = useSharedValue(0);
    const animatedWidth = useSharedValue(0);

    useEffect(() => {
        const layout = dimensions[selectedIndex];
        if (layout) {
            animatedX.value = withSpring(layout.x, { mass: 0.5, damping: 14 });
            animatedWidth.value = withSpring(layout.width, { mass: 0.5, damping: 14 });
        }
    }, [selectedIndex, dimensions]);

    const activePillStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: animatedX.value }],
        width: animatedWidth.value,
        opacity: animatedWidth.value > 0 ? 1 : 0
    }));

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.activePill, activePillStyle]} />

            {options.map((option, index) => {
                const isSelected = index === selectedIndex;
                return (
                    <Pressable
                        key={option}
                        style={styles.tabItem}
                        onPress={() => onChange(index)}
                        onLayout={(e) => {
                            const newLayout = e.nativeEvent.layout;
                            setDimensions(prev => ({ ...prev, [index]: newLayout }));
                        }}
                    >
                        <Text style={[styles.tabLabel, { color: isSelected ? Colors.black : Colors.textMuted }]}>
                            {option}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: Colors.input,
        borderRadius: 16,
        padding: 4,
        marginBottom: 24,
    },
    activePill: {
        position: 'absolute',
        top: 4,
        bottom: 4,
        backgroundColor: Colors.white,
        borderRadius: 12,
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