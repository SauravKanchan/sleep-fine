import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { CartesianChart, Bar } from 'victory-native';
import { SleepSample } from '../types/sleep';
import { useFont, Canvas, Text as T } from '@shopify/react-native-skia';
import { Platform } from 'react-native';
// @ts-ignore
import NotoSansJPRegular from '../assets/fonts/NotoSansJPRegular.ttf';

interface Props {
  data: SleepSample[];
}

interface ChartDatum {
  x: string;
  y: number;
}

const SleepChart: React.FC<Props> = ({ data }) => {
  let chartRawData: { [key: string]: any } = {};
  data.forEach((entry) => {
    const start = new Date(entry.startDate).getTime();
    const end = new Date(entry.endDate).getTime();
    const hours = end - start;
    const dateLabel = new Date(entry.startDate).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
    const d = { x: dateLabel, y: hours };

    if (!chartRawData[dateLabel]) {
      chartRawData[dateLabel] = {
        AWAKE: 0,
        CORE: 0,
        DEEP: 0,
        REM: 0,
      };
    }
    chartRawData[dateLabel][entry['value']] += d.y;
  });

  const chartData = Object.entries(chartRawData).map(([key, value]) => ({
    x: key,
    AWAKE: value['AWAKE'] / (60 * 60 * 1000),
    CORE: value['CORE'] / (60 * 60 * 1000),
    DEEP: value['DEEP'] / (60 * 60 * 1000),
    REM: value['REM'] / (60 * 60 * 1000),
  }));
  console.log('chartData', chartData);
  const screenWidth = Dimensions.get('window').width;
  const font = useFont(NotoSansJPRegular, 12, (err) => {
    console.error('Font loading error:', err);
  });
  return (
    <View style={{ height: 300, padding: 20, backgroundColor: 'white' }}>
      <Text style={styles.title}>Sleep Trend (Last 10 Days)</Text>
      {data.length === 0 && (
        <Text style={{ textAlign: 'center', fontSize: 16, color: '#888' }}>
          No sleep data available
        </Text>
      )}
      {data.length > 0 && (
        <CartesianChart
          data={chartData}
          xKey="x"
          yKeys={['AWAKE', 'CORE', 'DEEP', 'REM']}
          axisOptions={{
            font,
          }}
          domainPadding={{ left: 70, right: 70, top: 30 }}
        >
          {({ points, chartBounds }) => (
            <>
              <Bar
                barWidth={40}
                points={points.AWAKE}
                chartBounds={chartBounds}
                color="#4CAF50"
                animate={{ type: 'spring' , duration: 1000}}
              />
              <Bar
                barWidth={40}
                points={points.CORE}
                chartBounds={chartBounds}
                color="#2196F3"
                roundedCorners={{ topLeft: 5, topRight: 5 }}
                animate={{ type: 'spring' , duration: 1000}}
              />
              <Bar
                barWidth={40}
                points={points.DEEP}
                chartBounds={chartBounds}
                color="#9C27B0"
                animate={{ type: 'spring' , duration: 1000}}
              />

              <Bar
                barWidth={40}
                points={points.REM}
                chartBounds={chartBounds}
                color="#FF9800"
                animate={{ type: 'spring' , duration: 1000}}
              />
            </>
          )}
        </CartesianChart>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 30, paddingHorizontal: 10 },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
});

export default SleepChart;
