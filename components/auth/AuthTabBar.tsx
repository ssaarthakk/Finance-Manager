import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';

interface AuthTabBarProps {
  activeTab: 'signin' | 'signup';
  onTabChange: (tab: 'signin' | 'signup') => void;
}

export function AuthTabBar({ activeTab, onTabChange }: AuthTabBarProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === 'signin' && styles.activeTab
        ]}
        onPress={() => onTabChange('signin')}
      >
        <Text style={[styles.tabText, activeTab === 'signin' ? styles.activeTabText : styles.inactiveTabText]}>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === 'signup' && styles.activeTab
        ]}
        onPress={() => onTabChange('signup')}
      >
        <Text style={[styles.tabText, activeTab === 'signup' ? styles.activeTabText : styles.inactiveTabText]}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.tabBar,
    borderRadius: 9999, // rounded-full
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 9999, // rounded-full
  },
  activeTab: {
    backgroundColor: Colors.white,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  tabText: {
    fontWeight: '600',
  },
  activeTabText: {
    color: Colors.black,
  },
  inactiveTabText: {
    color: Colors.textMuted, // text-gray-400
  }
});