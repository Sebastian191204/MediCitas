import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '@medical-app/shared/hooks/useAuth';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import DashboardScreen from './screens/DashboardScreen';
import AppointmentsScreen from './screens/AppointmentsScreen';
import ExamsScreen from './screens/ExamsScreen';
import ProfileScreen from './screens/ProfileScreen';
import BookAppointmentScreen from './screens/BookAppointmentScreen';
import MedicationsScreen from './screens/MedicationsScreen';
import ExamDetailScreen from './screens/ExamDetailScreen';

const Stack = createNativeStackNavigator();
const Tab   = createBottomTabNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login"    component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor:   '#2563eb',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#f1f5f9',
          paddingBottom: 8,
          paddingTop: 6,
          height: 64,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ focused, color }) => {
          const icons: Record<string, any> = {
            Inicio:     focused ? 'home'          : 'home-outline',
            Citas:      focused ? 'calendar'      : 'calendar-outline',
            'Exámenes': focused ? 'document-text' : 'document-text-outline',
            Perfil:     focused ? 'person'        : 'person-outline',
          };
          return <Ionicons name={icons[route.name]} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Inicio"   component={DashboardScreen} />
      <Tab.Screen name="Citas"    component={AppointmentsScreen} />
      <Tab.Screen name="Exámenes" component={ExamsScreen} />
      <Tab.Screen name="Perfil"   component={ProfileScreen} />
    </Tab.Navigator>
  );
}

/* Wraps tabs + booking flow as a stack */
function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main"          component={AppTabs} />
      <Stack.Screen
        name="BookAppointment"
        component={BookAppointmentScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="Medications"
        component={MedicationsScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="ExamDetail"
        component={ExamDetailScreen}
        options={{ animation: 'slide_from_right' }}
      />
    </Stack.Navigator>
  );
}

export default function RootNavigator() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#eff6ff' }}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {session ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
