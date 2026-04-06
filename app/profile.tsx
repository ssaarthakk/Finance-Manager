import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors } from '../constants/Colors';
import { useAuthStore } from '../store/authStore';
import { useFinanceStore } from '../store/financeStore';

import { SegmentedToggle } from '../components/profile/SegmentedToggle';
import { UserInfoCard } from '../components/profile/UserInfoCard';
import { FinancialSummary } from '../components/profile/FinancialSummary';
import { SettingsAndLogout } from '../components/profile/SettingsAndLogout';

export default function ProfileScreen() {
  const { currentUser, logout } = useAuthStore();
  const { transactions } = useFinanceStore();

  const [isEditMode, setIsEditMode] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  const userInitial = name ? name.charAt(0).toUpperCase() : 'U';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header & Avatar */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.header}>
            <View style={styles.avatar}>
                <Text style={styles.avatarText}>{userInitial}</Text>
            </View>
            <Text style={styles.userName}>{name || 'User'}</Text>
            <Text style={styles.userEmail}>{email}</Text>
        </Animated.View>

        <SegmentedToggle 
            isEditMode={isEditMode} 
            onToggle={setIsEditMode} 
        />

        <UserInfoCard 
            isEditMode={isEditMode}
            name={name}
            email={email}
            onNameChange={setName}
            onEmailChange={setEmail}
        />

        <FinancialSummary 
            income={totalIncome}
            expenses={totalExpenses}
            balance={balance}
        />

        <SettingsAndLogout 
            onLogout={logout} 
        />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0B0B',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarText: {
    color: Colors.black,
    fontSize: 28,
    fontWeight: 'bold',
  },
  userName: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    color: Colors.textMuted,
    fontSize: 15,
  },
});