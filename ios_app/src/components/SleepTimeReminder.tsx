import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  Alert,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import notifee, { TimestampTrigger, TriggerType, RepeatFrequency } from '@notifee/react-native';

const SLEEP_TIME_KEY = 'sleep_time';
const WARNING_TIME_KEY = 'warning_time';

const SetSleepTime: React.FC = () => {
  const [sleepTime, setSleepTime] = useState<Date | null>(null);
  const [warningTime, setWarningTime] = useState<Date | null>(null);
  const [tempSleepTime, setTempSleepTime] = useState<Date>(new Date());
  const [tempWarningTime, setTempWarningTime] = useState<Date>(new Date());
  const [activePicker, setActivePicker] = useState<'sleep' | 'warning' | null>(null);

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

  const scheduleNotification = async (date: Date, id: string, title: string, body: string) => {
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
      trigger,
    );
  };

  const saveSleepTime = async () => {
    try {
      setSleepTime(tempSleepTime);
      await AsyncStorage.setItem(SLEEP_TIME_KEY, tempSleepTime.toISOString());

      const now = new Date();
      const nowMinutes = now.getHours() * 60 + now.getMinutes();
      const selectedMinutes = tempSleepTime.getHours() * 60 + tempSleepTime.getMinutes();

      if (selectedMinutes > nowMinutes) {
        await scheduleNotification(
          tempSleepTime,
          'sleep-time',
          '😴 Time to Sleep',
          'Your fined 0.01 WND. Try sleeping tomorrow!',
        );
      }

      Alert.alert('Success', 'Sleep time has been updated.');
    } catch (e) {
      console.error('Failed to save sleep time:', e);
    }
    setActivePicker(null);
  };

  const saveWarningTime = async () => {
    try {
      setWarningTime(tempWarningTime);
      await AsyncStorage.setItem(WARNING_TIME_KEY, tempWarningTime.toISOString());

      const now = new Date();
      const nowMinutes = now.getHours() * 60 + now.getMinutes();
      const selectedMinutes = tempWarningTime.getHours() * 60 + tempWarningTime.getMinutes();

      if (selectedMinutes > nowMinutes) {
        await scheduleNotification(
          tempWarningTime,
          'warning-time',
          '⏰ Bedtime Reminder',
          'Sleep now to avoid a fine!',
        );
      }

      Alert.alert('Success', 'Warning time has been updated.');
    } catch (e) {
      console.error('Failed to save warning time:', e);
    }
    setActivePicker(null);
  };

  const timeString = (date: Date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cardsWrapper}>
        {/* Sleep Time Card */}
        <View style={styles.card}>
          <Text style={styles.title}>🛏️ Sleep Time</Text>
          {sleepTime ? (
            <Text style={styles.timeText}>Your set time: {timeString(sleepTime)}</Text>
          ) : (
            <Text style={styles.timeText}>No time set yet</Text>
          )}
          <TouchableOpacity style={styles.setButton} onPress={() => setActivePicker('sleep')}>
            <Text style={styles.setButtonText}>{sleepTime ? 'Edit Time' : 'Set Time'}</Text>
          </TouchableOpacity>
        </View>

        {/* Warning Time Card */}
        <View style={styles.card}>
          <Text style={styles.title}>⏰ Warning Time</Text>
          {warningTime ? (
            <Text style={styles.timeText}>Reminder set for: {timeString(warningTime)}</Text>
          ) : (
            <Text style={styles.timeText}>No warning time set</Text>
          )}
          <TouchableOpacity style={styles.setButton} onPress={() => setActivePicker('warning')}>
            <Text style={styles.setButtonText}>{warningTime ? 'Edit Warning' : 'Set Warning'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Floating Modal Picker */}
      <Modal
        visible={!!activePicker}
        transparent
        animationType="fade"
        onRequestClose={() => setActivePicker(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.pickerOverlay}>
            <DateTimePicker
              value={activePicker === 'sleep' ? tempSleepTime : tempWarningTime}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(e, d) => {
                if (d) {
                  activePicker === 'sleep' ? setTempSleepTime(d) : setTempWarningTime(d);
                }
              }}
              themeVariant="light"
            />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={activePicker === 'sleep' ? saveSleepTime : saveWarningTime}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    padding: 16,
  },
  cardsWrapper: {
    alignItems: 'center',
    gap: 20,
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
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: '#333',
    textAlign: 'center',
  },
  timeText: {
    fontSize: 15,
    marginBottom: 16,
    color: '#555',
    textAlign: 'center',
  },
  setButton: {
    backgroundColor: '#5A67D8',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  setButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerOverlay: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    width: '80%',
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
    fontSize: 14,
  },
});

export default SetSleepTime;
