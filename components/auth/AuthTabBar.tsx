import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface AuthTabBarProps {
  activeTab: 'signin' | 'signup';
  onTabChange: (tab: 'signin' | 'signup') => void;
}

export function AuthTabBar({ activeTab, onTabChange }: AuthTabBarProps) {
  return (
    <View className="flex-row bg-[#2c2c2c] rounded-full p-1 mb-6">
      <TouchableOpacity
        className={`flex-1 items-center justify-center py-2.5 rounded-full ${activeTab === 'signin' ? 'bg-white shadow-sm' : ''}`}
        onPress={() => onTabChange('signin')}
      >
        <Text className={`font-semibold ${activeTab === 'signin' ? 'text-black' : 'text-gray-400'}`}>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className={`flex-1 items-center justify-center py-2.5 rounded-full ${activeTab === 'signup' ? 'bg-white shadow-sm' : ''}`}
        onPress={() => onTabChange('signup')}
      >
        <Text className={`font-semibold ${activeTab === 'signup' ? 'text-black' : 'text-gray-400'}`}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}