import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useThemeColors } from '../../constants/Colors';
import { useAuthStore } from '../../store/authStore';
import { useFinanceStore } from '../../store/financeStore';
import { useThemeStore } from '../../store/themeStore';
import { TransactionTypeToggle } from './TransactionTypeToggle';

import { EmptyState } from '../ui/EmptyState';

type FormData = {
  type: 'expense' | 'income';
  amount: string;
  categoryId: string;
  date: Date;
  note: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function AddTransactionModal({ visible, onClose }: Props) {
  const { addTransaction, getCategories, transactions } = useFinanceStore();
  const { currentUser } = useAuthStore();
  const themeColors = useThemeColors();
  const { theme } = useThemeStore();

  const { control, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      type: 'expense',
      amount: '',
      categoryId: '',
      date: new Date(),
      note: '',
    },
  });

  const transactionType = watch('type');
  const selectedCategoryId = watch('categoryId');
  const availableCategories = getCategories(transactionType);
  const selectedDate = watch('date');

  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (visible) {
      const userTransactions = transactions.filter(
        t => t.type === transactionType && (!t.userId || t.userId === currentUser?.email)
      );

      if (userTransactions.length > 0) {
        // Last item added is at the end of the array, so it's the last used
        const lastTx = userTransactions[userTransactions.length - 1];
        // Ensure that category actually still exists
        if (availableCategories.some(c => c.id === lastTx.categoryId)) {
          setValue('categoryId', lastTx.categoryId);
          return;
        }
      }
      
      // Fallback to the first available category if no previous or deleted
      if (availableCategories.length > 0) {
        setValue('categoryId', availableCategories[0].id);
      }
    }
  }, [visible, transactionType, transactions.length]); // Don't include availableCategories directly to prevent looping

  const onSubmit = (data: FormData) => {
    const numericAmount = parseFloat(data.amount);
    
    addTransaction({
      amount: numericAmount,
      categoryId: data.categoryId,
      date: data.date.toISOString(),
      note: data.note,
      type: data.type,
    });

    handleClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]}>
      <KeyboardAwareScrollView 
        contentContainerStyle={styles.scrollContent} 
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={20}
        enableOnAndroid={true}
      >
        <View style={styles.container}>
          
          <View style={styles.header}>
            <Pressable onPress={handleClose} style={styles.backButton}>
              <Ionicons name="close" size={28} color={themeColors.text} />
            </Pressable>
            <Text style={[styles.headerTitle, { color: themeColors.text }]}>New Transaction</Text>
            <View style={{ width: 36 }} />
          </View>

          <Controller
            control={control}
            name="type"
            render={({ field: { onChange, value } }) => (
              <TransactionTypeToggle 
                type={value} 
                onChange={(type) => {
                  onChange(type);
                  setValue('categoryId', '');
                }} 
              />
            )}
          />

          <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.inputGroup}>
            <Text style={[styles.label, { color: themeColors.textMuted }]}>Amount</Text>
            <View style={[styles.amountContainer, { backgroundColor: themeColors.card }]}>
              <Text style={[styles.currencyPrefix, { color: themeColors.text }]}>₹</Text>
              <Controller
                control={control}
                name="amount"
                rules={{ 
                  required: 'Amount is required',
                  validate: (value) => {
                    const num = parseFloat(value);
                    if (isNaN(num) || num <= 0) return 'Amount must be greater than 0';
                    return true;
                  }
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.amountInput, { color: themeColors.text }]}
                    placeholder="0.00"
                    placeholderTextColor={themeColors.textMuted}
                    keyboardType="numeric"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoFocus
                  />
                )}
              />
            </View>
            {errors.amount && <Text style={styles.errorText}>{errors.amount.message}</Text>}
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.inputGroup}>
            <Text style={[styles.label, { color: themeColors.textMuted }]}>Category</Text>
            <Controller
              control={control}
              name="categoryId"
              rules={{ required: 'Please select a category' }}
              render={({ field: { onChange, value } }) => (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                  {availableCategories.map((cat) => (
                    <Pressable
                      key={cat.id}
                      style={[
                        styles.categoryPill,
                        { backgroundColor: themeColors.card },
                        value === cat.id && { backgroundColor: cat.color + '40' },
                        value === cat.id && { borderColor: themeColors.text }
                      ]}
                      onPress={() => onChange(cat.id)}
                    >
                      <Ionicons name={cat.icon as any} size={20} color={cat.color} />
                      <Text style={[styles.categoryText, { color: cat.color }]}>{cat.name}</Text>
                    </Pressable>
                  ))}
                  {availableCategories.length === 0 && (
                    <EmptyState 
                      title="No categories available"
                      icon="albums-outline"
                    />
                  )}
                </ScrollView>
              )}
            />
            {errors.categoryId && <Text style={styles.errorText}>{errors.categoryId.message}</Text>}
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.inputGroup}>
            <Text style={[styles.label, { color: themeColors.textMuted }]}>Date</Text>
            <Pressable 
              style={[styles.dateSelector, { backgroundColor: themeColors.card }]}
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons name="calendar-outline" size={20} color={themeColors.textMuted} />
              <Text style={[styles.dateText, { color: themeColors.text }]}>{selectedDate.toDateString()}</Text>
            </Pressable>
            
            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="default"
                themeVariant={theme}
                onChange={(event, date) => {
                  setShowDatePicker(Platform.OS === 'ios');
                  if (date) {
                    setValue('date', date);
                  }
                }}
              />
            )}
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.inputGroup}>
            <Text style={[styles.label, { color: themeColors.textMuted }]}>Note (Optional)</Text>
            <Controller
              control={control}
              name="note"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.textInput, { backgroundColor: themeColors.card, color: themeColors.text }]}
                  placeholder="What was this for?"
                  placeholderTextColor={themeColors.textMuted}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(500).springify()} style={styles.submitContainer}>
            <Pressable 
              style={[
                styles.submitButton, 
                { backgroundColor: transactionType === 'income' ? '#10B981' : '#EF4444' }
              ]} 
              onPress={handleSubmit(onSubmit)}
            >
              <Text style={styles.submitButtonText}>
                Add {transactionType === 'income' ? 'Income' : 'Expense'}
              </Text>
            </Pressable>
          </Animated.View>

        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0B0B0B',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 48,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: '#808080',
    marginBottom: 8,
    fontWeight: '500',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 72,
  },
  currencyPrefix: {
    fontSize: 32,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  categoryScroll: {
    flexDirection: 'row',
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  categoryPillSelected: {
    borderColor: '#FFFFFF',
  },
  categoryText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  noCategoryText: {
    color: '#666',
    fontSize: 14,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 16,
    height: 56,
    borderRadius: 16,
  },
  dateText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 12,
  },
  textInput: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    color: '#FFFFFF',
    fontSize: 16,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  submitContainer: {
    marginTop: 16,
  },
  submitButton: {
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
