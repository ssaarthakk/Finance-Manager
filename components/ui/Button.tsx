import React from 'react';
import { ActivityIndicator, GestureResponderEvent, Pressable, StyleSheet, Text, TouchableOpacityProps } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useThemeColors } from '../../constants/Colors';
import { SPACING } from '../../constants/Spacing';
import { triggerHaptic } from '../../utils/haptics';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  isLoading?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({ title, isLoading, style, onPress, disabled, ...props }: ButtonProps) {
  const themeColors = useThemeColors();
  const styles = getStyles(themeColors);

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handlePress = (e: GestureResponderEvent) => {
    triggerHaptic('light');
    if (onPress) onPress(e);
  };

  return (
    <AnimatedPressable 
      style={[
        styles.button, 
        isLoading && styles.buttonLoading,
        disabled && styles.buttonDisabled,
        animatedStyle,
        style
      ]}
      disabled={isLoading || disabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      {...props as any}
    >
      {isLoading ? (
        <ActivityIndicator color={themeColors.background} style={styles.loader} />
      ) : null}
      <Text style={styles.text}>{title}</Text>
    </AnimatedPressable>
  );
}

const getStyles = (themeColors: ReturnType<typeof useThemeColors>) => StyleSheet.create({
  button: {
    backgroundColor: themeColors.primary,
    borderRadius: 14,
    paddingVertical: SPACING.md,
    width: '100%',
    alignItems: 'center',
    marginTop: SPACING.sm,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonLoading: {
    opacity: 0.8,
  },
  buttonDisabled: {
    opacity: 0.8,
  },
  loader: {
    marginRight: SPACING.sm,
  },
  text: {
    color: themeColors.background,
    fontWeight: '600',
    fontSize: 16,
  }
});