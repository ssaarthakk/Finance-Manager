import React from 'react';
import { Text, View } from 'react-native';

interface ErrorBannerProps {
  error: string;
}

export function ErrorBanner({ error }: ErrorBannerProps) {
  if (!error) return null;
  
  return (
    <View className="bg-red-900/40 p-3 rounded-xl mb-4 items-center">
      <Text className="text-red-200 text-sm text-center">{error}</Text>
    </View>
  );
}