import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '../../constants/Colors';

export function AuthHeader() {
  const themeColors = useThemeColors();
  const styles = getStyles(themeColors);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>F</Text>
      </View>
      <Text style={styles.title}>
        Welcome to FlowFi
      </Text>
      <Text style={styles.subtitle}>
        Track your money. Master your flow.
      </Text>
    </View>
  );
}

const getStyles = (themeColors: ReturnType<typeof useThemeColors>) => StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  logoContainer: {
    width: 64,
    height: 64,
    backgroundColor: themeColors.primary,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoText: {
    color: themeColors.background,
    fontWeight: 'bold',
    fontSize: 30,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 8,
    color: themeColors.text,
    textAlign: 'center',
    letterSpacing: -0.5, // tracking-tight
  },
  subtitle: {
    color: themeColors.textMuted, // text-gray-400
    fontSize: 15,
    textAlign: 'center',
  }
});