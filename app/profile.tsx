import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/ui/Button';
import { Colors } from '../constants/Colors';
import { useAuthStore } from '../store/authStore';

export default function ProfileScreen() {
  const { currentUser, logout } = useAuthStore();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{currentUser?.name || 'Not provided'}</Text>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{currentUser?.email}</Text>
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
  card: {
    backgroundColor: Colors.card,
    width: '100%',
    padding: 24,
    borderRadius: 24,
    marginBottom: 32,
  },
  label: {
    color: Colors.textMuted,
    fontSize: 14,
    marginBottom: 4,
  },
  value: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 16,
  }
});