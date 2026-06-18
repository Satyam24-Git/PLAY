import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import EmailScreen from '../screens/EmailScreen';
import OTPScreen from '../screens/OTPScreen';
import InterestsScreen from '../screens/InterestsScreen';
import AllSetScreen from '../screens/AllSetScreen';
import MainTabNavigator from './MainTabNavigator';
import TermsScreen from '../screens/TermsScreen';
import PrivacyScreen from '../screens/PrivacyScreen';
import WebLayoutWrapper from '../components/WebLayoutWrapper';
import { useResponsive } from '../hooks/useResponsive';
import { ThemeProvider, useTheme } from '../theme/ThemeContext';
import { DefaultTheme, DarkTheme } from '@react-navigation/native';

export type RootStackParamList = {
  Email: undefined;
  OTP: { email: string };
  Interests: { email: string };
  AllSet: undefined;
  Main: undefined;
  Profile: undefined;
  Terms: undefined;
  Privacy: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const InnerStack = createStackNavigator();

const InnerNavigator = () => (
  <InnerStack.Navigator
    screenOptions={{
      headerShown: false,
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
        },
      }),
    }}
  >
    <InnerStack.Screen name="MainTabs" component={MainTabNavigator} />
  </InnerStack.Navigator>
);

const MainLayout = () => {
  const { isMobile } = useResponsive();
  
  if (isMobile) {
    return <InnerNavigator />;
  }
  
  return (
    <WebLayoutWrapper>
      <InnerNavigator />
    </WebLayoutWrapper>
  );
};

const NavigationWrapper = () => {
  const { theme, isDarkMode } = useTheme();

  const navTheme = {
    ...(isDarkMode ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDarkMode ? DarkTheme.colors : DefaultTheme.colors),
      background: theme.background,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
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
        <Stack.Screen name="AllSet" component={AllSetScreen} />
        <Stack.Screen name="Terms" component={TermsScreen} />
        <Stack.Screen name="Privacy" component={PrivacyScreen} />
        <Stack.Screen name="Main" component={MainLayout} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function AppNavigator() {
  return (
    <ThemeProvider>
      <NavigationWrapper />
    </ThemeProvider>
  );
}
