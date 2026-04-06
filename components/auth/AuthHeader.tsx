import React from 'react';
import { View, Text } from 'react-native';

export function AuthHeader() {
  return (
    <View className="items-center mb-10 px-6 pt-10">
      <View className="w-16 h-16 bg-white rounded-[20px] items-center justify-center mb-4">
        <Text className="text-black font-bold text-3xl">P</Text>
      </View>
      <Text className="text-3xl font-bold mb-2 text-white text-center tracking-tight">
        Welcome to PayU
      </Text>
      <Text className="text-gray-400 text-[15px] text-center">
        Send money globally with the real exchange rate
      </Text>
    </View>
  );
}