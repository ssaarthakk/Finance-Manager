import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/Colors';

export function AuthHeader() {
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
    backgroundColor: Colors.white,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoText: {
    color: Colors.black,
    fontWeight: 'bold',
    fontSize: 30,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 8,
    color: Colors.white,
    textAlign: 'center',
    letterSpacing: -0.5, // tracking-tight
  },
  subtitle: {
    color: Colors.textMuted, // text-gray-400
    fontSize: 15,
    textAlign: 'center',
  }
});