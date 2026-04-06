import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

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
    backgroundColor: 'rgba(127, 29, 29, 0.4)', // bg-red-900/40 approx
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  text: {
    color: '#fca5a5', // text-red-200
    fontSize: 14,
    textAlign: 'center',
  }
});