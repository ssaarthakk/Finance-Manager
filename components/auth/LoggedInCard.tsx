import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../ui/Button';

interface LoggedInCardProps {
  email: string;
  onLogout: () => void;
}

export function LoggedInCard({ email, onLogout }: LoggedInCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>P</Text>
        </View>
        <Text style={styles.title}>
          Welcome to PayU
        </Text>
        <Text style={styles.subtitle}>
          Logged in as: {email}
        </Text>
        
        <Button title="Sign Out" onPress={onLogout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0e0e0e'
  },
  card: {
    backgroundColor: '#1c1c1c',
    padding: 32, // p-8
    borderRadius: 24, // rounded-3xl
    alignItems: 'center',
    width: '90%',
    maxWidth: 400
  },
  logoContainer: {
    width: 64, // w-16
    height: 64, // h-16
    backgroundColor: 'white',
    borderRadius: 20, // rounded-[20px]
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24 // mb-6
  },
  logoText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 30 // text-3xl
  },
  title: {
    fontSize: 24, // text-2xl
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'white',
    textAlign: 'center',
    letterSpacing: -0.5 // tracking-tight
  },
  subtitle: {
    color: '#9ca3af', // text-gray-400
    fontSize: 14, // text-sm
    marginBottom: 24, // mb-6
    textAlign: 'center'
  }
});