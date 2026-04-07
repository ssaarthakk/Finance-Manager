import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useThemeColors } from '../../constants/Colors';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  isPassword?: boolean;
  rightElement?: React.ReactNode;
  containerStyle?: ViewStyle;
}

export function Input({ label, error, isPassword, rightElement, containerStyle, ...props }: InputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const themeColors = useThemeColors();
  const styles = getStyles(themeColors);

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputContainer, isPassword && styles.inputContainerPassword]}>
        <TextInput
          style={styles.input}
          placeholderTextColor={themeColors.textMuted}
          secureTextEntry={isPassword && !isPasswordVisible}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={styles.iconButton}>
            <Ionicons name={isPasswordVisible ? "eye-outline" : "eye-off-outline"} size={20} color={themeColors.textMuted} />
          </TouchableOpacity>
        )}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {rightElement}
    </View>
  );
}

const getStyles = (themeColors: ReturnType<typeof useThemeColors>) => StyleSheet.create({
  container: {
    marginBottom: 16,
    position: 'relative',
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: themeColors.text,
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: themeColors.input,
    borderRadius: 14,
    overflow: 'hidden',
  },
  inputContainerPassword: {
    paddingRight: 12,
  },
  input: {
    flex: 1,
    color: themeColors.text,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  iconButton: {
    padding: 4,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  }
});