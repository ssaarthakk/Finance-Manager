import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useThemeColors } from '../../constants/Colors';
import { useThemeStore } from '../../store/themeStore';
import { Category } from '../../types/category';
import { Transaction } from '../../types/transaction';

interface Props {
  transaction: Transaction;
  category: Category | undefined;
  index: number;
  onDelete: (t: Transaction) => void;
}

export function TransactionSwipeItem({ transaction, category, index, onDelete }: Props) {
  const isIncome = transaction.type === 'income';
  const swipeableRef = useRef<any>(null);
  const themeColors = useThemeColors();
  const { theme } = useThemeStore();

  const renderLeftActions = () => {
    return (
      <View style={[styles.deleteAction, { alignItems: 'flex-start', paddingLeft: 32 }]}>
        <Ionicons name="trash-outline" size={24} color="#FFF" />
      </View>
    );
  };

  const renderRightActions = () => {
    return (
      <View style={[styles.deleteAction, { alignItems: 'flex-end', paddingRight: 32 }]}>
        <Ionicons name="trash-outline" size={24} color="#FFF" />
      </View>
    );
  };

  return (
    <Animated.View entering={FadeInUp.delay(200 + index * 50).springify()}>
      <ReanimatedSwipeable 
        ref={swipeableRef}
        friction={2}
        rightThreshold={80}
        leftThreshold={80}
        renderLeftActions={renderLeftActions} 
        renderRightActions={renderRightActions}
        onSwipeableOpen={(direction) => {
          if (direction === 'left' || direction === 'right') {
            onDelete(transaction);
          }
        }}
      >
        <View style={[styles.transactionItem, { backgroundColor: themeColors.card }]}>
          <LinearGradient
            colors={theme === 'dark' ? ['rgba(255,255,255,0.15)', 'rgba(0,0,0,0.8)'] : ['rgba(255,255,255,0.8)', 'rgba(0,0,0,0.05)']}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            style={[StyleSheet.absoluteFill, { borderRadius: 16, borderWidth: 1, borderColor: themeColors.border }]}
          />
          <View style={styles.itemLeft}>
            <View style={[styles.iconContainer, { backgroundColor: (category?.color || themeColors.textMuted) + '20' }]}>
              <Ionicons name={(category?.icon as any) || 'cube'} size={20} color={category?.color || themeColors.textMuted} />
            </View>
            <View>
              <Text style={[styles.transactionName, { color: themeColors.text }]}>{category?.name || 'Unknown'}</Text>
              <Text style={[styles.transactionDate, { color: themeColors.textMuted }]}>{new Date(transaction.date).toLocaleDateString()}</Text>
            </View>
          </View>
          <Text style={[styles.transactionAmount, { color: isIncome ? '#00E880' : themeColors.text }]}>
            {isIncome ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
          </Text>
        </View>
      </ReanimatedSwipeable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 13,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteAction: {
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    width: '100%',
    borderRadius: 16,
    marginBottom: 12,
  },
});