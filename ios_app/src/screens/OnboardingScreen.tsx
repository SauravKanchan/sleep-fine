import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../AppNavigator';
import { AppKitButton } from '@reown/appkit-ethers-react-native';
import notifee from '@notifee/react-native';

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
    body: 'If you don\'t sleep fast, you will pay sleep fine',
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

let count = 0;
const maxCount = 15;
const intervalId = setInterval(() => {
  if (count < maxCount) {
    onDisplayNotification();
    count++;
  } else {
    clearInterval(intervalId); // Stop the interval after 5 executions
  }
}, 5000);
const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to slpf5</Text>
      <Text style={styles.subtitle}>
        Either you sleep fine or pay sleep fine. We are here to help you sleep fine.
      </Text>
      <Button title="Get Started" onPress={() => navigation.replace('Home')} />
      <AppKitButton />
      <Button title="Display Notification" onPress={() => onDisplayNotification()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 16 },
  subtitle: { fontSize: 16, marginBottom: 32 },
});

export default OnboardingScreen;
