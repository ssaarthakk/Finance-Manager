import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/ui/Button';
import { Colors } from '../constants/Colors';
import { useAuthStore } from '../store/authStore';

export default function Dashboard() {
  const { currentUser, logout } = useAuthStore();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.welcomeText}>
          Welcome back to FlowFi, {currentUser?.name || currentUser?.email}!
        </Text>
        
        <View style={styles.placeholderCard}>
          <Text style={styles.placeholderTitle}>Total Balance</Text>
          <Text style={styles.placeholderValue}>$0.00</Text>
        </View>
        
        <Button title="Sign Out" onPress={logout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
    backgroundColor: Colors.card,
  },
  headerTitle: {
    color: Colors.white,
    fontSize: 28,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeText: {
    color: Colors.textMuted,
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
  },
  placeholderCard: {
    backgroundColor: Colors.card,
    width: '100%',
    padding: 24,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 32,
  },
  placeholderTitle: {
    color: Colors.textMuted,
    fontSize: 16,
    marginBottom: 8,
  },
  placeholderValue: {
    color: Colors.white,
    fontSize: 40,
    fontWeight: 'bold',
  }
});
