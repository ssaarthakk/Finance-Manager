import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/Colors';

interface ErrorBannerProps {
  error: string;
}

export function ErrorBanner({ error }: ErrorBannerProps) {
  if (!error) return null;
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{error}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.errorBg,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  text: {
    color: Colors.errorText,
    fontSize: 14,
    textAlign: 'center',
  }
});