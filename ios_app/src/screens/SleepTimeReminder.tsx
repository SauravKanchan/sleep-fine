import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';

const SLEEP_TIME_KEY = 'sleep_time';

const SetSleepTime: React.FC = () => {
  const [sleepTime, setSleepTime] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const loadTime = async () => {
      try {
        const stored = await AsyncStorage.getItem(SLEEP_TIME_KEY);
        if (stored) {
          setSleepTime(new Date(stored));
        }
      } catch (e) {
        console.error('Failed to load sleep time:', e);
      }
    };
    loadTime();
  }, []);

  const handleChange = async (event: any, selectedDate?: Date) => {
    if (event.type === 'set' && selectedDate) {
      setSleepTime(selectedDate);
      try {
        await AsyncStorage.setItem(SLEEP_TIME_KEY, selectedDate.toISOString());
      } catch (e) {
        console.error('Failed to save sleep time:', e);
      }
    }
    setShowPicker(false); // hide picker after processing
  };

  const timeString = (date: Date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navHeader}>
        <Text style={styles.navTitle} onPress={()=> {
          // @ts-ignore
          navigation.navigate('Onboarding');
        }}>SleepFine</Text>
      </View>

      <View style={styles.centerContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>🛏️ Sleep Time</Text>

          {sleepTime ? (
            <Text style={styles.timeText}>Your set time: {timeString(sleepTime)}</Text>
          ) : (
            <Text style={styles.timeText}>No time set yet</Text>
          )}

          <TouchableOpacity style={styles.setButton} onPress={() => setShowPicker(true)}>
            <Text style={styles.setButtonText}>
              {sleepTime ? 'Edit Time' : 'Set Time'}
            </Text>
          </TouchableOpacity>

          {showPicker && (
            <View style={styles.pickerContainer}>
              <DateTimePicker
                value={sleepTime || new Date()}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleChange}
                themeVariant="light" // 👈 fixes gray-on-gray in dark mode
              />
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
    overflow: 'hidden',
  },
});

export default SetSleepTime;
