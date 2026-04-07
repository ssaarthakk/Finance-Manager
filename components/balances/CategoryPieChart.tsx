import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { EmptyState } from '../ui/EmptyState';

const screenWidth = Dimensions.get('window').width;

interface CategoryData {
  categoryId: string;
  name: string;
  amount: number;
  color: string;
}

interface CategoryPieChartProps {
  title: string;
  data: CategoryData[];
  emptyText: string;
}

export const CategoryPieChart = ({ title, data, emptyText }: CategoryPieChartProps) => {
  const chartData = data.map((item) => ({
    name: item.name,
    amount: item.amount,
    color: item.color,
    legendFontColor: '#7F7F7F',
    legendFontSize: 13,
  }));

  return (
    <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.container}>
      <LinearGradient
        colors={['rgba(255,255,255,0.15)', 'rgba(0,0,0,0.8)']}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={[StyleSheet.absoluteFill, { borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)' }]}
      />
      <Text style={styles.title}>{title}</Text>
      {data.length === 0 ? (
        <EmptyState
          title="No spending data"
          subtitle="Your category breakdown will appear here"
          icon="pie-chart-outline"
        />
      ) : (
        <View style={styles.chartContainer}>
          <PieChart
            data={chartData}
            width={screenWidth - 40}
            height={180}
            chartConfig={{
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            }}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="0"
            absolute
          />
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  chartContainer: {
    alignItems: 'center',
    marginLeft: -10,
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
});