import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../AppNavigator';
import { AppKitButton } from '@reown/appkit-ethers-react-native';
import { initHealthKit } from '../services/healthkit';
import notifee from '@notifee/react-native';
import { AuthorizationStatus } from '@notifee/react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;
async function onDisplayNotification() {
  // Request permissions (required for iOS)
  await notifee.requestPermission();

  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });

  // Display a notification
  await notifee.displayNotification({
    title: 'Sleep fast',
    body: "If you don't sleep fast, you will pay sleep fine",
    android: {
      channelId,
      smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
      // pressAction is needed if you want the notification to open the app when pressed
      pressAction: {
        id: 'default',
      },
    },
  });
}

const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  useEffect(() => {
    const checkPermissions = async () => {
      const settings = await notifee.getNotificationSettings();
      if (settings.authorizationStatus == AuthorizationStatus.AUTHORIZED) {
        setPermissionsGranted(true);
      }
    };

    checkPermissions();
  });

  async function grantPermissions() {
    // Request permissions (required for iOS)
    const { authorizationStatus } = await notifee.requestPermission();
    await initHealthKit();
    if (authorizationStatus === AuthorizationStatus.AUTHORIZED) {
      setPermissionsGranted(true);
    } else {
      console.log('Permission denied');
    }
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to SleepFine</Text>
      <Text style={styles.subtitle}>
        Either you sleep fine or pay sleep fine. We are here to help you sleep fine.
      </Text>
      {/* {!permissionsGranted && ( */}
      <Button title="1. Grant Permissions" onPress={() => grantPermissions()} />
      <Button
        title="2. Start Challenge"
        onPress={() => navigation.replace('SelectChallengeScreen')}
      />
      <Button title="3. Past Sleep" onPress={() => navigation.replace('Home')} />
      <Button
        title="4. Sleep Time Reminder"
        onPress={() => navigation.replace('SleepTimeReminder')}
      />
      {/* <Button title="Get Started" onPress={() => navigation.replace('Home')} /> */}
      {/* <AppKitButton />
      <Button title="Display Notification" onPress={() => onDisplayNotification()} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 30, fontWeight: 'bold', marginBottom: 16 },
  subtitle: { fontSize: 18, marginBottom: 32 },
});

export default OnboardingScreen;
