import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import EmailScreen from '../screens/EmailScreen';
import OTPScreen from '../screens/OTPScreen';
import InterestsScreen from '../screens/InterestsScreen';
import HomeScreen from '../screens/HomeScreen';

export type RootStackParamList = {
  Email: undefined;
  OTP: { email: string };
  Interests: { email: string };
  Home: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Email"
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          cardStyleInterpolator: ({ current, layouts }) => ({
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
              opacity: current.progress.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0, 0.7, 1],
              }),
            },
          }),
        }}
      >
        <Stack.Screen name="Email" component={EmailScreen} />
        <Stack.Screen name="OTP" component={OTPScreen} />
        <Stack.Screen name="Interests" component={InterestsScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
