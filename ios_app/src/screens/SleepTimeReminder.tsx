import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import notifee, {
  TimestampTrigger,
  TriggerType,
  RepeatFrequency,
} from '@notifee/react-native';

const SLEEP_TIME_KEY = 'sleep_time';
const WARNING_TIME_KEY = 'warning_time';

const SetSleepTime: React.FC = () => {
  const [sleepTime, setSleepTime] = useState<Date | null>(null);
  const [warningTime, setWarningTime] = useState<Date | null>(null);
  const [tempSleepTime, setTempSleepTime] = useState<Date>(new Date());
  const [tempWarningTime, setTempWarningTime] = useState<Date>(new Date());
  const [showSleepPicker, setShowSleepPicker] = useState(false);
  const [showWarningPicker, setShowWarningPicker] = useState(false);
  // @ts-ignore
  const navigation = useNavigation();

  useEffect(() => {
    const loadTimes = async () => {
      try {
        const sleepStored = await AsyncStorage.getItem(SLEEP_TIME_KEY);
        const warningStored = await AsyncStorage.getItem(WARNING_TIME_KEY);
        if (sleepStored) {
          const date = new Date(sleepStored);
          setSleepTime(date);
          setTempSleepTime(date);
        }
        if (warningStored) {
          const date = new Date(warningStored);
          setWarningTime(date);
          setTempWarningTime(date);
        }
      } catch (e) {
        console.error('Failed to load times:', e);
      }
    };
    loadTimes();
  }, []);

  const scheduleNotification = async (
    date: Date,
    id: string,
    title: string,
    body: string
  ) => {
    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: date.getTime(),
      repeatFrequency: RepeatFrequency.DAILY,
    };

    await notifee.createTriggerNotification(
      {
        id,
        title,
        body,
        android: {
          channelId: 'default',
        },
      },
      trigger
    );
  };

  const saveSleepTime = async () => {
    try {
      setSleepTime(tempSleepTime);
      await AsyncStorage.setItem(SLEEP_TIME_KEY, tempSleepTime.toISOString());
      await scheduleNotification(
        tempSleepTime,
        'sleep-time',
        '😴 Time to Sleep',
        'Your scheduled sleep time has arrived.'
      );
      Alert.alert('Success', 'Sleep time has been updated.');
    } catch (e) {
      console.error('Failed to save sleep time:', e);
    }
    setShowSleepPicker(false);
  };

  const saveWarningTime = async () => {
    try {
      setWarningTime(tempWarningTime);
      await AsyncStorage.setItem(WARNING_TIME_KEY, tempWarningTime.toISOString());
      await scheduleNotification(
        tempWarningTime,
        'warning-time',
        '⏰ Bedtime Reminder',
        'Your warning time before sleep is here.'
      );
      Alert.alert('Success', 'Warning time has been updated.');
    } catch (e) {
      console.error('Failed to save warning time:', e);
    }
    setShowWarningPicker(false);
  };

  const timeString = (date: Date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navHeader}>
        <Text
          style={styles.navTitle}
          onPress={() => {
            // @ts-ignore
            navigation.navigate('Onboarding');
          }}
        >
          SleepFine
        </Text>
      </View>

      <View style={styles.centerContainer}>
        {/* Sleep Time Card */}
        <View style={styles.card}>
          <Text style={styles.title}>🛏️ Sleep Time</Text>
          {sleepTime ? (
            <Text style={styles.timeText}>Your set time: {timeString(sleepTime)}</Text>
          ) : (
            <Text style={styles.timeText}>No time set yet</Text>
          )}
          <TouchableOpacity style={styles.setButton} onPress={() => setShowSleepPicker(true)}>
            <Text style={styles.setButtonText}>
              {sleepTime ? 'Edit Time' : 'Set Time'}
            </Text>
          </TouchableOpacity>
          {showSleepPicker && (
            <View style={styles.pickerContainer}>
              <DateTimePicker
                value={tempSleepTime}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(e, d) => d && setTempSleepTime(d)}
                themeVariant="light"
              />
              <TouchableOpacity style={styles.saveButton} onPress={saveSleepTime}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Warning Time Card */}
        <View style={styles.card}>
          <Text style={styles.title}>⏰ Warning Time</Text>
          {warningTime ? (
            <Text style={styles.timeText}>Reminder set for: {timeString(warningTime)}</Text>
          ) : (
            <Text style={styles.timeText}>No warning time set</Text>
          )}
          <TouchableOpacity style={styles.setButton} onPress={() => setShowWarningPicker(true)}>
            <Text style={styles.setButtonText}>
              {warningTime ? 'Edit Warning' : 'Set Warning'}
            </Text>
          </TouchableOpacity>
          {showWarningPicker && (
            <View style={styles.pickerContainer}>
              <DateTimePicker
                value={tempWarningTime}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(e, d) => d && setTempWarningTime(d)}
                themeVariant="light"
              />
              <TouchableOpacity style={styles.saveButton} onPress={saveWarningTime}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  navHeader: {
    paddingTop: 16,
    paddingBottom: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#ffffff',
  },
  navTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#5A67D8',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    width: '90%',
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    color: '#333',
  },
  timeText: {
    fontSize: 16,
    marginBottom: 16,
    color: '#555',
  },
  setButton: {
    backgroundColor: '#5A67D8',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  setButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  pickerContainer: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  saveButton: {
    marginTop: 10,
    backgroundColor: '#38A169',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});

export default SetSleepTime;
