import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Colors } from '../../constants/Colors';
import { Category } from '../../types/category';
import { Transaction } from '../../types/transaction';

interface Props {
  transaction: Transaction;
  category: Category | undefined;
  index: number;
  onDelete: (t: Transaction) => void;
  onEdit?: (t: Transaction) => void;
}

export function TransactionSwipeItem({ transaction, category, index, onDelete, onEdit }: Props) {
  const isIncome = transaction.type === 'income';
  const swipeableRef = useRef<any>(null);

  const renderLeftActions = () => {
    return (
      <View style={[styles.deleteAction, { alignItems: 'center' }]}>
        <Ionicons name="trash-outline" size={24} color="#FFF" />
      </View>
    );
  };

  const renderRightActions = () => {
    return (
      <Pressable 
        style={[styles.editAction, { alignItems: 'center' }]}
        onPress={() => {
          swipeableRef.current?.close();
          onEdit?.(transaction);
        }}
      >
        <Ionicons name="pencil-outline" size={24} color="#FFF" />
      </Pressable>
    );
  };

  return (
    <Animated.View entering={FadeInUp.delay(200 + index * 50).springify()}>
      <ReanimatedSwipeable 
        ref={swipeableRef}
        renderLeftActions={renderLeftActions} 
        renderRightActions={renderRightActions}
        onSwipeableOpen={(direction) => {
          if (direction === 'left') {
            onDelete(transaction);
          }
        }}
      >
        <View style={styles.transactionItem}>
          <LinearGradient
            colors={['rgba(255,255,255,0.15)', 'rgba(0,0,0,0.8)']}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            style={[StyleSheet.absoluteFill, { borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)' }]}
          />
          <View style={styles.itemLeft}>
            <View style={[styles.iconContainer, { backgroundColor: (category?.color || '#888') + '20' }]}>
              <Ionicons name={(category?.icon as any) || 'cube'} size={20} color={category?.color || '#888'} />
            </View>
            <View>
              <Text style={styles.transactionName}>{category?.name || 'Unknown'}</Text>
              <Text style={styles.transactionDate}>{new Date(transaction.date).toLocaleDateString()}</Text>
            </View>
          </View>
          <Text style={[styles.transactionAmount, { color: isIncome ? '#00E880' : Colors.white }]}>
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
    backgroundColor: '#0B0B0B',
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
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  transactionDate: {
    color: '#888',
    fontSize: 13,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteAction: {
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    width: 100,
    borderRadius: 16,
    marginBottom: 12,
  },
  editAction: {
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    width: 100,
    borderRadius: 16,
    marginBottom: 12,
  },
});