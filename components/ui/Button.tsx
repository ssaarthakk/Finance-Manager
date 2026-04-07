import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { useThemeColors } from '../../constants/Colors';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  isLoading?: boolean;
}

export function Button({ title, isLoading, style, ...props }: ButtonProps) {
  const themeColors = useThemeColors();
  const styles = getStyles(themeColors);

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
        <ActivityIndicator color={themeColors.background} style={styles.loader} />
      ) : null}
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const getStyles = (themeColors: ReturnType<typeof useThemeColors>) => StyleSheet.create({
  button: {
    backgroundColor: themeColors.primary,
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
    color: themeColors.background,
    fontWeight: '600',
    fontSize: 16,
  }
});