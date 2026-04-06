import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  isLoading?: boolean;
}

export function Button({ title, isLoading, style, ...props }: ButtonProps) {
  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        isLoading && styles.buttonLoading,
        props.disabled && styles.buttonDisabled,
        style
      ]}
      disabled={isLoading || props.disabled}
      activeOpacity={0.8}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color="black" style={styles.loader} />
      ) : null}
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'white',
    borderRadius: 14,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonLoading: {
    opacity: 0.8,
  },
  buttonDisabled: {
    opacity: 0.8,
  },
  loader: {
    marginRight: 8,
  },
  text: {
    color: 'black',
    fontWeight: '600',
    fontSize: 16,
  }
});