import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CartesianChart, StackedBar } from 'victory-native';
import { SleepSample } from '../types/sleep';
import { useFont } from '@shopify/react-native-skia';
import { useNavigation } from '@react-navigation/native';
// @ts-ignore
import NotoSansJPRegular from '../assets/fonts/NotoSansJPRegular.ttf';

interface Props {
  data: SleepSample[];
}

const SleepChart: React.FC<Props> = ({ data }) => {
  let chartRawData: { [key: string]: any } = {};
  const [roundedCorner] = useState(10);
  // @ts-ignore
  const navigation = useNavigation();

  data.forEach((entry) => {
    const start = new Date(entry.startDate).getTime();
    const end = new Date(entry.endDate).getTime();
    const hours = end - start;
    const dateLabel = new Date(entry.startDate).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });

    if (!chartRawData[dateLabel]) {
      chartRawData[dateLabel] = {
        AWAKE: 0,
        CORE: 0,
        DEEP: 0,
        REM: 0,
        start: start,
        end: end,
      };
    }

    chartRawData[dateLabel][entry.value] += hours;
    chartRawData[dateLabel].start = Math.min(chartRawData[dateLabel].start, start);
    chartRawData[dateLabel].end = Math.max(chartRawData[dateLabel].end, end);
  });

  const chartData = Object.entries(chartRawData).map(([key, value]) => ({
    x: key,
    AWAKE: value.AWAKE / (60 * 60 * 1000),
    CORE: value.CORE / (60 * 60 * 1000),
    DEEP: value.DEEP / (60 * 60 * 1000),
    REM: value.REM / (60 * 60 * 1000),
  }));

  const lastEntry = Object.entries(chartRawData).sort(
    ([a], [b]) => chartRawData[b].end - chartRawData[a].end,
  )[0];

  const font = useFont(NotoSansJPRegular, 12, (err) => {
    console.error('Font loading error:', err);
  });

  const renderLastSleepCard = () => {
    if (!lastEntry) return null;
    const [_, details] = lastEntry;
    const start = new Date(details.start);
    const end = new Date(details.end);
    const durationHrs = ((details.end - details.start) / (1000 * 60 * 60)).toFixed(2);

    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Last Sleep Recorded</Text>
        <Text style={styles.cardItem}>
          💤 Went to bed: {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
        <Text style={styles.cardItem}>⏱ Slept for: {durationHrs} hours</Text>
        <Text style={styles.cardItem}>
          📅 Day:{' '}
          {start.toLocaleDateString(undefined, {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.navHeader}>
        <TouchableOpacity>
          <Text style={styles.backButton}> </Text>
        </TouchableOpacity>
        <Text
          style={styles.navTitle}
          onPress={() => {
            // @ts-ignore
            navigation.navigate('Onboarding');
          }}
        >
          SleepFine
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Sleep Trend (Last 10 Days)</Text>
        {data.length === 0 ? (
          <Text style={styles.empty}>No sleep data available</Text>
        ) : (
          <View style={styles.chartContainer}>
            <CartesianChart
              data={chartData}
              xKey="x"
              yKeys={['AWAKE', 'CORE', 'DEEP', 'REM']}
              axisOptions={{ font }}
              domainPadding={{ left: 70, right: 70, top: 350 }}
            >
              {({ points, chartBounds }) => (
                <StackedBar
                  barWidth={45}
                  points={[points.AWAKE, points.CORE, points.DEEP, points.REM]}
                  chartBounds={chartBounds}
                  animate={{ type: 'spring', duration: 1000 }}
                  colors={['#718096', '#63B3ED', '#805AD5', '#F687B3']}
                  barOptions={({ isBottom, isTop }) => {
                    return {
                      roundedCorners: isTop
                        ? { topLeft: roundedCorner, topRight: roundedCorner }
                        : isBottom
                        ? { bottomRight: roundedCorner, bottomLeft: roundedCorner }
                        : undefined,
                    };
                  }}
                />
              )}
            </CartesianChart>
          </View>
        )}
      </View>

      {renderLastSleepCard()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F9F9F9',
    flex: 1,
  },
  navHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  navTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#5A67D8',
  },
  backButton: {
    fontSize: 20,
    color: '#4A5568',
  },
  empty: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
  },
  chartContainer: {
    height: 320,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    color: '#333',
  },
  cardItem: {
    fontSize: 15,
    color: '#555',
    marginBottom: 4,
  },
});

export default SleepChart;
