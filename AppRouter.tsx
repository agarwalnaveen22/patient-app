import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Login, Register, Home, Settings, AddAppointment} from 'screens';
import {InfoIcon, HamburgerIcon, useTheme} from 'native-base';
import {SafeAreaView} from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const navigatorOptions = {
  screenOptions: {
    headerShown: false,
  },
};

function AppointmentRoute() {
  return (
    <Stack.Navigator {...navigatorOptions} initialRouteName="Home">
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="AddAppointment" component={AddAppointment} />
    </Stack.Navigator>
  );
}

const BottomTab = () => {
  const theme = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.red[500],
        tabBarInactiveTintColor: theme.colors.black,
      }}>
      <Tab.Screen
        options={{
          tabBarIcon: ({color}) => <InfoIcon size={4} color={color} />,
          tabBarLabel: 'Home',
        }}
        name="AppointmentRoute"
        component={AppointmentRoute}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({color}) => <HamburgerIcon size={4} color={color} />,
        }}
        name="Settings"
        component={Settings}
      />
    </Tab.Navigator>
  );
};

function AppRouter() {
  return (
    <NavigationContainer>
      <SafeAreaView style={{flex: 1}}>
        <Stack.Navigator {...navigatorOptions} initialRouteName="Login">
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Tabs" component={BottomTab} />
        </Stack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
}

export default AppRouter;
