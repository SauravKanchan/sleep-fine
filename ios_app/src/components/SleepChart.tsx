import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { CartesianChart, StackedBar } from 'victory-native';
import { SleepSample } from '../types/sleep';
import { useFont } from '@shopify/react-native-skia';
import { useNavigation } from '@react-navigation/native';
// @ts-ignore
import NotoSansJPRegular from '../assets/fonts/NotoSansJPRegular.ttf';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Props {
  data: SleepSample[];
}

const SleepChart: React.FC<Props> = ({ data }) => {
  const chartRawData: { [key: string]: any } = {};
  const [roundedCorner] = useState(10);
  const [goalSleepTime, setGoalSleepTime] = useState<Date | null>(null);
  const [todayStatus, setTodayStatus] = useState<'✅ On Track' | '❌ Missed' | null>(null);
  // @ts-ignore
  const navigation = useNavigation();

  useEffect(() => {
    const loadSleepGoal = async () => {
      const stored = await AsyncStorage.getItem('sleep_time');
      if (stored) {
        const goal = new Date(stored);
        setGoalSleepTime(goal);

        // Determine today’s goal status
        const now = new Date();
        const todayGoal = new Date(now);
        todayGoal.setHours(goal.getHours());
        todayGoal.setMinutes(goal.getMinutes());
        todayGoal.setSeconds(0);

        setTodayStatus(now <= todayGoal ? '✅ On Track' : '❌ Missed');
      }
    };
    loadSleepGoal();
  }, []);

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

  const sortedEntries = Object.entries(chartRawData).sort(
    ([, a], [, b]) => b.end - a.end
  );

  const font = useFont(NotoSansJPRegular, 12, (err) => {
    console.error('Font loading error:', err);
  });

  const renderSleepCards = () =>
    sortedEntries.map(([dateLabel, details], idx) => {
      const start = new Date(details.start);
      const end = new Date(details.end);
      const durationHrs = ((details.end - details.start) / (1000 * 60 * 60)).toFixed(1);

      const goalStatus =
        goalSleepTime &&
        (start.getHours() < goalSleepTime.getHours() ||
          (start.getHours() === goalSleepTime.getHours() &&
            start.getMinutes() <= goalSleepTime.getMinutes()))
          ? '✅ Achieved'
          : '⚠️ Missed';

      return (
        <View style={styles.recordCard} key={`${dateLabel}-${idx}`}>
          <View style={styles.recordRow}>
            <Text style={styles.recordLabel}>{dateLabel}</Text>
            <Text style={[styles.statusText, goalStatus.includes('Achieved') ? styles.statusAchieved : styles.statusMissed]}>
              {goalStatus}
            </Text>
          </View>
          <Text style={styles.recordItem}>🛏 {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
          <Text style={styles.recordItem}>⏱ {durationHrs} hrs</Text>
        </View>
      );
    });

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
        <Text style={styles.cardTitle}>📊 Sleep Trend (Last 10 Days)</Text>

        {goalSleepTime && (
          <View style={{ marginBottom: 12 }}>
            <Text style={styles.goalText}>
              Scheduled Sleep Time: {goalSleepTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
            <Text style={[styles.goalStatus, todayStatus === '✅ On Track' ? styles.statusAchieved : styles.statusMissed]}>
              Today's Goal: {todayStatus}
            </Text>
          </View>
        )}

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
                  barWidth={35}
                  points={[points.AWAKE, points.CORE, points.DEEP, points.REM]}
                  chartBounds={chartBounds}
                  animate={{ type: 'spring', duration: 1000 }}
                  colors={['#718096', '#63B3ED', '#805AD5', '#F687B3']}
                  barOptions={({ isBottom, isTop }) => ({
                    roundedCorners: isTop
                      ? { topLeft: roundedCorner, topRight: roundedCorner }
                      : isBottom
                      ? { bottomRight: roundedCorner, bottomLeft: roundedCorner }
                      : undefined,
                  })}
                />
              )}
            </CartesianChart>
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {renderSleepCards()}
      </ScrollView>
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
  goalText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#555',
  },
  goalStatus: {
    fontSize: 15,
    marginTop: 4,
    fontWeight: '600',
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  recordCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
  },
  recordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  recordLabel: {
    fontWeight: '600',
    fontSize: 15,
    color: '#444',
  },
  recordItem: {
    fontSize: 14,
    color: '#555',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusAchieved: {
    color: '#38A169',
  },
  statusMissed: {
    color: '#E53E3E',
  },
});

export default SleepChart;
