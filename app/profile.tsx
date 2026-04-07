import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, useThemeColors } from '../constants/Colors';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';

import { SegmentedToggle } from '../components/profile/SegmentedToggle';
import { SettingsAndLogout } from '../components/profile/SettingsAndLogout';
import { UserInfoCard } from '../components/profile/UserInfoCard';

export default function ProfileScreen() {
  const { currentUser, logout, updateProfile } = useAuthStore();
  const { theme } = useThemeStore();
  const themeColors = useThemeColors();

  const [isEditMode, setIsEditMode] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');

  useEffect(() => {
    if (currentUser && !isEditMode) {
      setName(currentUser.name);
      setEmail(currentUser.email);
    }
  }, [currentUser, isEditMode]);

  const handleToggleMode = (mode: boolean) => {
    if (!mode && isEditMode) {
      setName(currentUser?.name || '');
      setEmail(currentUser?.email || '');
    } else if (mode && !isEditMode) {
      setName(currentUser?.name || '');
      setEmail(currentUser?.email || '');
    }
    setIsEditMode(mode);
  };

  const handleSave = () => {
    updateProfile(name, email);
    setIsEditMode(false);
  };

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={{ height: 20 }} />
      <KeyboardAwareScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={20}
      >

        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.header}>
          <View style={[styles.avatar, { backgroundColor: themeColors.primary, shadowColor: themeColors.primary }]}>
            <Text style={[styles.avatarText, { color: themeColors.background }]}>{currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}</Text>
          </View>
          <Text style={[styles.userName, { color: themeColors.text }]}>{currentUser?.name || 'User'}</Text>
          <Text style={[styles.userEmail, { color: themeColors.textMuted }]}>{currentUser?.email || ''}</Text>
        </Animated.View>

        <SegmentedToggle
          isEditMode={isEditMode}
          onToggle={handleToggleMode}
        />

        <UserInfoCard
          isEditMode={isEditMode}
          name={name}
          email={email}
          onNameChange={setName}
          onEmailChange={setEmail}
          onSave={handleSave}
        />

        <SettingsAndLogout
          onLogout={logout}
        />

      </KeyboardAwareScrollView>
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