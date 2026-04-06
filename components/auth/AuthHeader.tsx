import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function AuthHeader() {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>P</Text>
      </View>
      <Text style={styles.title}>
        Welcome to PayU
      </Text>
      <Text style={styles.subtitle}>
        Send money globally with the real exchange rate
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  logoContainer: {
    width: 64,
    height: 64,
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 30,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'white',
    textAlign: 'center',
    letterSpacing: -0.5, // tracking-tight
  },
  subtitle: {
    color: '#9ca3af', // text-gray-400
    fontSize: 15,
    textAlign: 'center',
  }
});