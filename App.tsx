import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SessionProvider } from '@contexts/SessionContext';
import HomeScreen from '@screens/HomeScreen';
import CaptureScreen from '@screens/CaptureScreen';
import SessionHistoryScreen from '@screens/SessionHistoryScreen';
import SessionReviewScreen from '@screens/SessionReviewScreen';
import { RootStackParamList } from '@navigation/types';
import './src/i18n';

const Stack = createNativeStackNavigator<RootStackParamList>();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#0f172a'
  }
};

export default function App() {
  return (
    <SessionProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer theme={theme}>
          <StatusBar style="light" />
          <Stack.Navigator
            screenOptions={{
              headerStyle: { backgroundColor: '#0f172a' },
              headerTitleStyle: { color: '#f8fafc' },
              headerTintColor: '#f8fafc'
            }}
          >
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Capture" component={CaptureScreen} options={{ title: 'Capture' }} />
            <Stack.Screen name="SessionHistory" component={SessionHistoryScreen} options={{ title: 'History' }} />
            <Stack.Screen name="SessionReview" component={SessionReviewScreen} options={{ title: 'Review' }} />
          </Stack.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    </SessionProvider>
  );
}
