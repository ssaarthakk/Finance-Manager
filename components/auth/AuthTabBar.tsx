import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useThemeColors } from '../../constants/Colors';
import { useThemeStore } from '../../store/themeStore';

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
  const { theme } = useThemeStore();
  const themeColors = useThemeColors();
  const styles = getStyles(themeColors, theme);

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
      <LinearGradient
        colors={theme === 'dark' ? ['rgba(255,255,255,0.15)', 'rgba(0,0,0,0.8)'] : ['rgba(255,255,255,0.8)', 'rgba(0,0,0,0.05)']}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={[{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 20, borderWidth: 1, borderColor: theme === 'dark' ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.1)' }]}
      />
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

const getStyles = (themeColors: ReturnType<typeof useThemeColors>, theme: string) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: themeColors.layer1,
    borderRadius: 20, // matching SegmentedControl
    padding: 4,
    marginBottom: 24,
    position: 'relative',
  },
  activeBackground: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    left: 4,
    backgroundColor: themeColors.text,
    borderRadius: 16, // match SegmentedControl
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    color: themeColors.background,
  },
  inactiveTabText: {
    color: themeColors.textMuted, // text-gray-400
  }
});