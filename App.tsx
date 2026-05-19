import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from './src/store/AuthContext';
import { ActivityIndicator, View } from 'react-native';
import AuthNavigator from './src/navigation/AuthNavigator';
import AppNavigator from './src/navigation/AppNavigator';

function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#E53935" />
      </View>
    );
  }

  return user ? <AppNavigator /> : <AuthNavigator />;
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar style="light" backgroundColor="#E53935" />
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
