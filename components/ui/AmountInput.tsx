import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { useThemeColors } from '../../constants/Colors';

type AmountInputProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  autoFocus?: boolean;
};

export const AmountInput = ({ value, onChange, error, autoFocus = true }: AmountInputProps) => {
  const themeColors = useThemeColors();
  const [displayValue, setDisplayValue] = useState('');

  useEffect(() => {
    if (!value) {
      setDisplayValue('');
      return;
    }
    const currentNumeric = displayValue.replace(/[^0-9.]/g, '');
    if (value !== currentNumeric) {
      setDisplayValue(formatNumberString(value));
    }
  }, [value]);

  const formatNumberString = (val: string) => {
    const numericStr = val.replace(/[^0-9.]/g, '');
    
    const parts = numericStr.split('.');
    let integerPart = parts[0];
    const decimalPart = parts.length > 1 ? '.' + parts[1].substring(0, 2) : '';

    if (integerPart) {
      const num = parseInt(integerPart, 10);
      if (Number.isFinite(num)) {
        integerPart = num.toLocaleString('en-IN');
      }
    }

    return integerPart + decimalPart;
  };

  const handleChangeText = (text: string) => {
    let numericStr = text.replace(/[^0-9.]/g, '');
    
    const parts = numericStr.split('.');
    
    if (parts.length > 2) return;
    
    if (parts[0].length > 10) {
      numericStr = parts[0].substring(0, 10) + (parts.length > 1 ? '.' + parts[1] : '');
    }

    const formatted = formatNumberString(numericStr);
    setDisplayValue(formatted);
    onChange(numericStr);
  };

  return (
    <View style={styles.container}>
      <View style={[
        styles.inputContainer, 
        { backgroundColor: themeColors.card },
        error ? { borderColor: '#EF4444', borderWidth: 1 } : { borderColor: 'transparent', borderWidth: 1 }
      ]}>
        <Text style={[styles.currencyPrefix, { color: themeColors.text }]}>₹</Text>
        <TextInput
          style={[styles.input, { color: themeColors.text }]}
          placeholder="0.00"
          placeholderTextColor={themeColors.textMuted}
          keyboardType="numeric"
          value={displayValue}
          onChangeText={handleChangeText}
          autoFocus={autoFocus}
          maxLength={18}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 72,
  },
  currencyPrefix: {
    fontSize: 32,
    fontWeight: '600',
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 32,
    fontWeight: '600',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
