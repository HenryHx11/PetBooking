import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

//To import the screens
import Login from './Login';
import Home from './Home';
import Bookings from './Bookings';
import About from './About';
import Profile from './Profile';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// --- Bottom Tab Navigation Bar ---
function MainTabs({ route, navigation } : any){
  //Grab userId passed from Login.tsx
  const { userId } = route.params;
  return(
    //Use flex 1 to hold the Tabs and the Floating Action Button (FAB)
    <View style={{flex: 1}}>
      <Tab.Navigator 
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let iconName = '';
            if(route.name === 'Home'){
              iconName = focused ? 'home' : 'home-outline';
            } else if(route.name === 'Bookings'){
              iconName = focused ? 'calendar' : 'calendar-outline';
            } else if(route.name === 'About'){
              iconName = focused ? 'information-circle' : 'information-circle-outline';
            }
          return <Ionicons name={iconName} size={size} color={color}/>;
        },
        tabBarActiveTintColor: '#1E90FF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false, //Hides the double header
        })}
      >
        <Tab.Screen name="Home" component={Home}/>
        <Tab.Screen name="Bookings" component={Bookings}/>
        <Tab.Screen name="About" component={About}/>
      </Tab.Navigator>

      {/* Floating Action Button 
      Put this block into Home.tsx for the button only in Home Screen, make sure <View> is flex: 1
      if any issue*/}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('Profile', {userId: userId})}
      >
        <Ionicons name="person" size={30} color="#fff"/>
      </TouchableOpacity>

    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={Login} />
        {/*Tab Navigator*/}
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="Profile" component={Profile}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 80, // Adjusted to sit above the bottom tab bar
    backgroundColor: '#1E90FF',
    borderRadius: 30,
    elevation: 8, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
  },
});