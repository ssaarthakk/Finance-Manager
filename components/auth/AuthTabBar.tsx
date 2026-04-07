import React, { useEffect, useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useThemeColors } from '../../constants/Colors';

interface AuthTabBarProps {
  activeTab: 'signin' | 'signup';
  onTabChange: (tab: 'signin' | 'signup') => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function AuthTabButton({ 
  label, 
  isActive, 
  onPress, 
  styles 
}: { 
  label: string, 
  isActive: boolean, 
  onPress: () => void,
  styles: any
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  return (
    <AnimatedPressable
      style={[styles.tab, animatedStyle]}
      onPress={onPress}
      onPressIn={() => scale.value = withSpring(0.95)}
      onPressOut={() => scale.value = withSpring(1)}
    >
      <Text style={[styles.tabText, isActive ? styles.activeTabText : styles.inactiveTabText]}>{label}</Text>
    </AnimatedPressable>
  );
}

export function AuthTabBar({ activeTab, onTabChange }: AuthTabBarProps) {
  const [tabWidth, setTabWidth] = useState(0);
  const translateX = useSharedValue(0);
  const themeColors = useThemeColors();
  const styles = getStyles(themeColors);

  useEffect(() => {
    translateX.value = withSpring(activeTab === 'signin' ? 0 : tabWidth, {
      damping: 20,
      stiffness: 200,
      mass: 0.8
    });
  }, [activeTab, tabWidth]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }]
  }));

  const onLayout = (e: LayoutChangeEvent) => {
    setTabWidth((e.nativeEvent.layout.width - 8) / 2);
  };

  return (
    <View style={styles.container} onLayout={onLayout}>
      <Animated.View
        style={[
          styles.activeBackground,
          indicatorStyle,
          { width: tabWidth }
        ]}
      />
      <AuthTabButton
        label="Sign In"
        isActive={activeTab === 'signin'}
        onPress={() => onTabChange('signin')}
        styles={styles}
      />
      <AuthTabButton
        label="Sign Up"
        isActive={activeTab === 'signup'}
        onPress={() => onTabChange('signup')}
        styles={styles}
      />
    </View>
  );
}

const getStyles = (themeColors: ReturnType<typeof useThemeColors>) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: themeColors.tabBar,
    borderRadius: 9999, // rounded-full
    padding: 4,
    marginBottom: 24,
    position: 'relative',
  },
  activeBackground: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    left: 4,
    backgroundColor: themeColors.background,
    borderRadius: 9999,
    shadowColor: themeColors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    zIndex: 1,
  },
  tabText: {
    fontWeight: '600',
  },
  activeTabText: {
    color: themeColors.text,
  },
  inactiveTabText: {
    color: themeColors.textMuted, // text-gray-400
  }
});