import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useThemeColors } from '../../constants/Colors';

export interface EmptyStateProps {
  title: string;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  emoji?: string;
  buttonText?: string;
  onPress?: () => void;
}

export function EmptyState({ title, subtitle, icon, emoji, buttonText, onPress }: EmptyStateProps) {
  const themeColors = useThemeColors();
  
  return (
    <Animated.View entering={FadeInUp.duration(300).springify().damping(15)} style={styles.container}>
      <View style={styles.iconContainer}>
        {emoji ? (
          <Text style={styles.emoji}>{emoji}</Text>
        ) : (
          <Ionicons name={icon || 'document-text-outline'} size={48} color={themeColors.textMuted} />
        )}
      </View>
      <Text style={[styles.title, { color: themeColors.text }]}>{title}</Text>
      {subtitle && <Text style={[styles.subtitle, { color: themeColors.textMuted }]}>{subtitle}</Text>}
      {buttonText && onPress && (
        <Pressable style={[styles.button, { backgroundColor: themeColors.text }]} onPress={onPress}>
          <Text style={[styles.buttonText, { color: themeColors.background }]}>{buttonText}</Text>
        </Pressable>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: 'transparent',
    marginTop: 20,
    marginBottom: 20,
  },
  iconContainer: {
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(150,150,150,0.1)',
  },
  emoji: {
    fontSize: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
  },
});