import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { CartesianChart, Bar } from 'victory-native';
import { SleepSample } from '../types/sleep';
import { useFont, Canvas, Text as T } from '@shopify/react-native-skia';
import {Platform} from "react-native";
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
  data.forEach(entry => {
    const start = new Date(entry.startDate).getTime();
    const end = new Date(entry.endDate).getTime();
    const hours = (end - start);
    const dateLabel = new Date(entry.startDate).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
    const d = { x: dateLabel, y: hours};

    if (!chartRawData[dateLabel]) {
      chartRawData[dateLabel] = {
        "AWAKE": 0,
        "CORE": 0,
        "DEEP": 0,
        "REM": 0,
      };
    }
    chartRawData[dateLabel][entry["value"]] += d.y;
  });

  const chartData = (Object.entries(chartRawData).map(([key, value]) => ({
    x: key,
    AWAKE: value["AWAKE"],
    CORE: value["CORE"],
    DEEP: value["DEEP"],
    REM: value["REM"],
  })));
  const screenWidth = Dimensions.get('window').width;
  const font = useFont(undefined, 42, (err) => {
    console.error('Font loading error:', err);
  });
  return (
    <View style={{ height: 300 }}>
      <Text style={styles.title}>Sleep Trend (Last 7 Days)</Text>
      <CartesianChart
        data={chartData}
        xKey="x"
        yKeys={['AWAKE', 'CORE', 'DEEP', 'REM']}
        domainPadding={{ left: 10, right: 10, top: 20, bottom: 40 }}
        padding={{ left: 20, right: 20, top: 20, bottom: 40 }}
        axisOptions={{font,
          formatXLabel: (value) => {
          return value;
        },
        }}

      >
        {({ points, chartBounds }) => (
          <>
            <Bar points={points.AWAKE} chartBounds={chartBounds} color="#4CAF50" />
            <Bar points={points.CORE} chartBounds={chartBounds} color="#2196F3" />
            <Bar points={points.DEEP} chartBounds={chartBounds} color="#9C27B0" />
            <Bar points={points.REM} chartBounds={chartBounds} color="#FF9800" />
          </>
        )}
      </CartesianChart>
      <Canvas style={{ flex: 1 }}>
        <T x={0} y={100} text={'Hello'} font={font} color="black" />
        {/* \uF101 is an example Ionicon codepoint */}
      </Canvas>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 30, paddingHorizontal: 10 },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
});

export default SleepChart;
