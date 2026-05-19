import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FeedScreen from '../screens/Feed';
import MapScreen from '../screens/Map';
import NewReportScreen from '../screens/NewReport';
import ProfileScreen from '../screens/Profile';
import ReportDetailScreen from '../screens/ReportDetail';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: '#E53935' }}>
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="NewReport" component={NewReportScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen name="ReportDetail" component={ReportDetailScreen} />
    </Stack.Navigator>
  );
}
