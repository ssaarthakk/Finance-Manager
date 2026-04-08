import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useThemeColors } from '../../constants/Colors';
import { SPACING } from '../../constants/Spacing';
import { triggerHaptic } from '../../utils/haptics';

type TypeToggleProps = {
  type: 'expense' | 'income';
  onChange: (type: 'expense' | 'income') => void;
};

const SPRING_CONFIG = {
  damping: 25,
  stiffness: 250,
  mass: 0.8,
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function ToggleButton({ 
  label, 
  isActive, 
  onPress, 
  themeColors 
}: { 
  label: string, 
  isActive: boolean, 
  onPress: () => void,
  themeColors: any
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  return (
    <AnimatedPressable 
      style={[styles.button, animatedStyle]} 
      onPress={onPress}
      onPressIn={() => scale.value = withSpring(0.95)}
      onPressOut={() => scale.value = withSpring(1)}
    >
      <Text style={[styles.text, { color: themeColors.textMuted }, isActive && styles.activeText]}>{label}</Text>
    </AnimatedPressable>
  );
}

export function TransactionTypeToggle({ type, onChange }: TypeToggleProps) {
  const isIncome = type === 'income';
  const themeColors = useThemeColors();

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withSpring(isIncome ? 156 : 0, SPRING_CONFIG),
        },
      ],
      backgroundColor: isIncome ? '#10B981' : '#EF4444',
    };
  }, [isIncome]);

  return (
    <View style={[styles.container, { backgroundColor: themeColors.card }]}>
      <Animated.View style={[styles.indicator, animatedStyle]} />
      
      <ToggleButton 
        label="Expense"
        isActive={!isIncome}
        onPress={() => {
          if (isIncome) {
            triggerHaptic('selection');
            onChange('expense');
          }
        }}
        themeColors={themeColors}
      />
      
      <ToggleButton 
        label="Income"
        isActive={isIncome}
        onPress={() => {
          if (!isIncome) {
            triggerHaptic('selection');
            onChange('income');
          }
        }}
        themeColors={themeColors}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: SPACING.xs,
    width: 320,
    alignSelf: 'center',
    marginBottom: SPACING.xl,
  },
  indicator: {
    position: 'absolute',
    left: SPACING.xs,
    top: SPACING.xs,
    width: 156,
    height: '100%',
    borderRadius: 8,
  },
  button: {
    flex: 1,
    paddingVertical: SPACING.sm + 4,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
  },
  activeText: {
    color: '#FFFFFF',
  },
});
