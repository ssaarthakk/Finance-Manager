import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '../../constants/Colors';

interface ErrorBannerProps {
  error: string;
}

export function ErrorBanner({ error }: ErrorBannerProps) {
  const themeColors = useThemeColors();
  const styles = getStyles(themeColors);

  if (!error) return null;
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{error}</Text>
    </View>
  );
}

const getStyles = (themeColors: ReturnType<typeof useThemeColors>) => StyleSheet.create({
  container: {
    backgroundColor: themeColors.errorBg,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  text: {
    color: themeColors.errorText,
    fontSize: 14,
    textAlign: 'center',
  }
});