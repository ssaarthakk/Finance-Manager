import Feather from '@expo/vector-icons/Feather';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import { useLinkBuilder } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { LayoutRectangle, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { Colors } from '../constants/Colors';

const getIconName = (routeName: string): keyof typeof Feather.glyphMap => {
    switch (routeName) {
        case 'index': return 'home';
        case 'balance': return 'pie-chart';
        case 'profile': return 'user';
        default: return 'circle';
    }
};

function TabItem({ 
    isFocused, 
    options, 
    label, 
    iconName, 
    onPress, 
    onLongPress, 
    route, 
    buildHref,
    onLayout
}: any) {
    const scale = useSharedValue(isFocused ? 1.2 : 1);

    useEffect(() => {
        scale.value = withSpring(isFocused ? 1.2 : 1, { damping: 15, stiffness: 200 });
    }, [isFocused]);

    const iconAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));

    return (
        <PlatformPressable
            href={buildHref(route.name, route.params)}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.pressable}
            onLayout={onLayout}
        >
            <Animated.View
                layout={LinearTransition.duration(250)}
                style={[
                    styles.tabItem,
                    isFocused && styles.tabItemFocused
                ]}
            >
                <Animated.View style={iconAnimatedStyle}>
                    <Feather 
                        name={iconName} 
                        size={20} 
                        color={isFocused ? Colors.black : Colors.textMuted} 
                    />
                </Animated.View>
                {isFocused && (
                    <Animated.Text
                        entering={FadeIn.duration(200)}
                        exiting={FadeOut.duration(200)}
                        style={[
                            styles.tabLabel, 
                            { color: Colors.black }
                        ]}
                    >
                        {label as string}
                    </Animated.Text>
                )}
            </Animated.View>
        </PlatformPressable>
    );
}

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const { buildHref } = useLinkBuilder();
    const [dimensions, setDimensions] = useState<{ [key: number]: LayoutRectangle }>({});

    // Sliding animated absolute pill logic
    const animatedX = useSharedValue(0);
    const animatedWidth = useSharedValue(0);

    useEffect(() => {
        const layout = dimensions[state.index];
        if (layout) {
            animatedX.value = withSpring(layout.x, { damping: 25, stiffness: 250, mass: 0.8 });
            animatedWidth.value = withSpring(layout.width, { damping: 25, stiffness: 250, mass: 0.8 });
        }
    }, [state.index, dimensions]);

    const activePillStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: animatedX.value }],
        width: animatedWidth.value,
        opacity: animatedWidth.value > 0 ? 1 : 0
    }));

    return (
        <View style={styles.tabBar}>
            {/* Sliding Background Pill */}
            <Animated.View style={[styles.activePill, activePillStyle]} />

            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                const iconName = getIconName(route.name);

                return (
                    <TabItem 
                        key={route.key}
                        isFocused={isFocused}
                        options={options}
                        label={label}
                        iconName={iconName}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        route={route}
                        buildHref={buildHref}
                        onLayout={(e: any) => {
                            const newLayout = e.nativeEvent.layout;
                            setDimensions(prev => ({ ...prev, [index]: newLayout }));
                        }}
                    />
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        bottom: 30,
        alignSelf: 'center',
        flexDirection: 'row',
        backgroundColor: Colors.card,
        borderRadius: 40,
        paddingHorizontal: 8,
        paddingVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.4,
        shadowRadius: 15,
        elevation: 10,
    },
    activePill: {
        position: 'absolute',
        left: 0, // removed offset so layout.x translates perfectly
        top: 8,  // paddingVertical
        bottom: 8,
        backgroundColor: Colors.primary,
        borderRadius: 30,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    pressable: {
        marginHorizontal: 4,
    },
    tabItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20, // increased from 16 to extend width a little
        borderRadius: 30,
    },
    tabItemFocused: {
        // We remove the static background here since the sliding absolute pill handles it!
    },
    tabLabel: {
        fontSize: 14,
        fontWeight: '700',
        marginLeft: 8,
    },
});