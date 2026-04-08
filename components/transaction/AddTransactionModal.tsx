import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
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
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useThemeColors } from '../../constants/Colors';
import { SPACING } from '../../constants/Spacing';
import { useAuthStore } from '../../store/authStore';
import { useFinanceStore } from '../../store/financeStore';
import { useThemeStore } from '../../store/themeStore';
import { triggerHaptic } from '../../utils/haptics';
import { simulateNetwork } from '../../utils/network';
import { TransactionTypeToggle } from './TransactionTypeToggle';

import { AmountInput } from '../ui/AmountInput';
import { EmptyState } from '../ui/EmptyState';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function SubmitButton({ 
  onPress, 
  disabled, 
  title, 
  themeColors, 
  isIncome,
  isSubmitting
}: { 
  onPress: () => void, 
  disabled: boolean, 
  title: string, 
  themeColors: any,
  isIncome: boolean,
  isSubmitting?: boolean
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  return (
    <AnimatedPressable 
      onPress={onPress}
      onPressIn={() => {
        if (!disabled) scale.value = withSpring(0.95);
      }}
      onPressOut={() => scale.value = withSpring(1)}
      disabled={disabled}
      style={[
        styles.submitButton, 
        { backgroundColor: disabled ? themeColors.border : (isIncome ? '#10B981' : '#EF4444') },
        animatedStyle,
        isSubmitting && { opacity: 0.8 }
      ]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {isSubmitting && <ActivityIndicator color="#FFFFFF" style={{ marginRight: 8 }} />}
        <Text style={styles.submitButtonText}>
          {title}
        </Text>
      </View>
    </AnimatedPressable>
  );
}

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

  const { control, handleSubmit, watch, setValue, reset, formState: { errors, isValid } } = useForm<FormData>({
    defaultValues: {
      type: 'expense',
      amount: '',
      categoryId: '',
      date: new Date(),
      note: '',
    },
    mode: 'onChange',
  });

  const transactionType = watch('type');
  const selectedCategoryId = watch('categoryId');
  const availableCategories = getCategories(transactionType);
  const selectedDate = watch('date');

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const onSubmit = async (data: FormData) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await simulateNetwork(600);
      const numericAmount = parseFloat(data.amount);
      
      addTransaction({
        amount: numericAmount,
        categoryId: data.categoryId,
        date: data.date.toISOString(),
        note: data.note,
        type: data.type,
      });

      triggerHaptic('success');
      handleClose();
    } catch (e: any) {
      triggerHaptic('error');
    } finally {
      setIsSubmitting(false);
    }
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
            <Controller
              control={control}
              name="amount"
              rules={{ 
                required: 'Enter a valid amount',
                validate: (value) => {
                  const num = parseFloat(value);
                  if (isNaN(num) || !Number.isFinite(num) || num <= 0) return 'Enter a valid amount';
                  if (num > 10000000) return 'Amount is too large';
                  return true;
                }
              }}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <AmountInput
                  value={value}
                  onChange={onChange}
                  error={error?.message}
                  autoFocus={true}
                />
              )}
            />
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
                      onPress={() => {
                        triggerHaptic('selection');
                        onChange(cat.id);
                      }}
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
              onPress={() => {
                triggerHaptic('light');
                setShowDatePicker(true);
              }}
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
            <SubmitButton 
              onPress={handleSubmit(onSubmit)}
              disabled={!isValid || !watch('amount') || isSubmitting}
              title={isSubmitting ? (transactionType === 'income' ? 'Adding Income...' : 'Adding Expense...') : `Add ${transactionType === 'income' ? 'Income' : 'Expense'}`}
              themeColors={themeColors}
              isIncome={transactionType === 'income'}
              isSubmitting={isSubmitting}
            />
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
    padding: SPACING.xl,
    paddingBottom: SPACING.xxl * 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xxl,
  },
  backButton: {
    padding: SPACING.sm,
    marginLeft: -SPACING.sm,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  inputGroup: {
    marginBottom: SPACING.xl,
  },
  label: {
    fontSize: 14,
    color: '#808080',
    marginBottom: SPACING.sm,
    fontWeight: '500',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: SPACING.md,
    paddingHorizontal: SPACING.md,
    height: 72,
  },
  currencyPrefix: {
    fontSize: 32,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: SPACING.sm,
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
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 4,
    borderRadius: 24,
    marginRight: SPACING.sm + 4,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  categoryPillSelected: {
    borderColor: '#FFFFFF',
  },
  categoryText: {
    marginLeft: SPACING.sm,
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
    paddingHorizontal: SPACING.md,
    height: 56,
    borderRadius: SPACING.md,
  },
  dateText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: SPACING.sm + 4,
  },
  textInput: {
    backgroundColor: '#1A1A1A',
    borderRadius: SPACING.md,
    paddingHorizontal: SPACING.md,
    height: 56,
    color: '#FFFFFF',
    fontSize: 16,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: SPACING.xs,
    marginLeft: SPACING.xs,
  },
  submitContainer: {
    marginTop: SPACING.md,
  },
  submitButton: {
    height: 56,
    borderRadius: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
