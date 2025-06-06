import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import SelectChallengeScreen from './screens/SelectChallengeScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import 'react-native-reanimated';

export type RootStackParamList = {
  Onboarding: undefined;
  Home: undefined;
  SelectChallengeScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Onboarding" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="SelectChallengeScreen" component={SelectChallengeScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
