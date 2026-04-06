import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import Animated, { FadeInUp } from 'react-native-reanimated';

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
  // Format data for react-native-chart-kit
  const chartData = data.map((item) => ({
    name: item.name,
    amount: item.amount,
    color: item.color,
    legendFontColor: '#7F7F7F',
    legendFontSize: 13,
  }));

  return (
    <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {data.length === 0 ? (
        <Text style={styles.emptyText}>{emptyText}</Text>
      ) : (
        <View style={styles.chartContainer}>
          <PieChart
            data={chartData}
            width={screenWidth - 40} // matching the padding from screen
            height={180}
            chartConfig={{
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            }}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="0"
            absolute // Use absolute values instead of percentages in legend
          />
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1A1A1A',
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
    marginLeft: -10, // Adjust default padding from chart kit 
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
});