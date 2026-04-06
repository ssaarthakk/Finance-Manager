import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/Colors';
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
          <Text style={styles.logoText}>F</Text>
        </View>
        <Text style={styles.title}>
          Welcome to FlowFi
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
    backgroundColor: Colors.background
  },
  card: {
    backgroundColor: Colors.card,
    padding: 32, // p-8
    borderRadius: 24, // rounded-3xl
    alignItems: 'center',
    width: '90%',
    maxWidth: 400
  },
  logoContainer: {
    width: 64, // w-16
    height: 64, // h-16
    backgroundColor: Colors.white,
    borderRadius: 20, // rounded-[20px]
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24 // mb-6
  },
  logoText: {
    color: Colors.black,
    fontWeight: 'bold',
    fontSize: 30 // text-3xl
  },
  title: {
    fontSize: 24, // text-2xl
    fontWeight: 'bold',
    marginBottom: 8,
    color: Colors.white,
    textAlign: 'center',
    letterSpacing: -0.5 // tracking-tight
  },
  subtitle: {
    color: Colors.textMuted, // text-gray-400
    fontSize: 14, // text-sm
    marginBottom: 24, // mb-6
    textAlign: 'center'
  }
});