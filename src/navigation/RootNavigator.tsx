import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SplashScreen } from '../screens/SplashScreen';
import { SignUpScreen } from '../screens/SignUpScreen';
import { WelcomePinScreen } from '../screens/WelcomePinScreen';
import { BiometricLoginScreen } from '../screens/BiometricLoginScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { PinEntryScreen } from '../screens/PinEntryScreen';
import { NewsFeedScreen } from '../screens/NewsFeedScreen';
import { BiometricOptInScreen } from '../screens/BiometricOptInScreen';

export type RootStackParamList = {
  Splash: undefined;
  SignUp: undefined;
  WelcomePin: undefined;
  BiometricLogin: undefined;
  Login: undefined;
  PinEntry: undefined;
  BiometricOptIn: undefined;
  NewsFeed: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="WelcomePin" component={WelcomePinScreen} />
      <Stack.Screen name="BiometricLogin" component={BiometricLoginScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="PinEntry" component={PinEntryScreen} />
      <Stack.Screen name="BiometricOptIn" component={BiometricOptInScreen} />
      <Stack.Screen name="NewsFeed" component={NewsFeedScreen} />
    </Stack.Navigator>
  );
};

