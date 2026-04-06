import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  isPassword?: boolean;
  rightElement?: React.ReactNode;
}

export function Input({ label, error, isPassword, rightElement, className = '', ...props }: InputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View className={`mb-4 relative ${className}`}>
      <Text className="text-[13px] font-medium text-white mb-2 ml-1">{label}</Text>
      <View className={`flex-row items-center bg-[#141414] rounded-[14px] overflow-hidden ${isPassword ? 'pr-3' : ''}`}>
        <TextInput
          className="flex-1 text-white px-4 py-3.5 outline-none"
          placeholderTextColor="#71717a"
          secureTextEntry={isPassword && !isPasswordVisible}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} className="p-1">
            <Ionicons name={isPasswordVisible ? "eye-outline" : "eye-off-outline"} size={20} color="#71717a" />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text className="text-red-400 text-xs mt-1 ml-1">{error}</Text>}
      {rightElement}
    </View>
  );
}