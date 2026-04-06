import React from 'react';
import { View, Text } from 'react-native';
import { Button } from '../ui/Button';

interface LoggedInCardProps {
  email: string;
  onLogout: () => void;
}

export function LoggedInCard({ email, onLogout }: LoggedInCardProps) {
  return (
    <View className="flex-1 items-center justify-center bg-[#0e0e0e]">
      <View className="bg-[#1c1c1c] p-8 rounded-3xl items-center w-[90%] max-w-[400px]">
        <View className="w-16 h-16 bg-white rounded-[20px] items-center justify-center mb-6">
          <Text className="text-black font-bold text-3xl">P</Text>
        </View>
        <Text className="text-2xl font-bold mb-2 text-white text-center tracking-tight">
          Welcome to PayU
        </Text>
        <Text className="text-gray-400 text-sm mb-6 text-center">
          Logged in as: {email}
        </Text>
        
        <Button title="Sign Out" onPress={onLogout} />
      </View>
    </View>
  );
}