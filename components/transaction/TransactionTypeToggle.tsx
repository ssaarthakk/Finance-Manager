import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

type TypeToggleProps = {
  type: 'expense' | 'income';
  onChange: (type: 'expense' | 'income') => void;
};

const SPRING_CONFIG = {
  damping: 25,
  stiffness: 250,
  mass: 0.8,
};

export function TransactionTypeToggle({ type, onChange }: TypeToggleProps) {
  const isIncome = type === 'income';
  const progress = isIncome ? 1 : 0;

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
    <View style={styles.container}>
      <Animated.View style={[styles.indicator, animatedStyle]} />
      
      <Pressable 
        style={styles.button} 
        onPress={() => onChange('expense')}
      >
        <Text style={[styles.text, !isIncome && styles.activeText]}>Expense</Text>
      </Pressable>
      
      <Pressable 
        style={styles.button} 
        onPress={() => onChange('income')}
      >
        <Text style={[styles.text, isIncome && styles.activeText]}>Income</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 4,
    width: 320,
    alignSelf: 'center',
    marginBottom: 24,
  },
  indicator: {
    position: 'absolute',
    left: 4,
    top: 4,
    width: 156,
    height: '100%',
    borderRadius: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  text: {
    color: '#808080',
    fontSize: 14,
    fontWeight: '600',
  },
  activeText: {
    color: '#FFFFFF',
  },
});
