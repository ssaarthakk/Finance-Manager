import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  isLoading?: boolean;
}

export function Button({ title, isLoading, className = '', ...props }: ButtonProps) {
  return (
    <TouchableOpacity 
      className={`bg-white rounded-[14px] py-4 w-full items-center mt-2 flex-row justify-center active:opacity-80 ${isLoading ? 'opacity-80' : ''} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color="black" className="mr-2" />
      ) : null}
      <Text className="text-black font-semibold text-[16px]">{title}</Text>
    </TouchableOpacity>
  );
}