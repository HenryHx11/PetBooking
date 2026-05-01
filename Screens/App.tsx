import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

//To import the screens
import Register from './Register';
import Login from './Login';
import Home from './Home';
import Bookings from './Bookings';
import About from './About';
import Profile from './Profile';
import CreateBookingScreen from './CreateBooking';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Custom Tab Bar with middle button
function CustomTabBar({state, navigation, userId}: any) {
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: '#fff',
        height: 60,
        borderTopWidth: 1,
        borderTopColor: '#eee',
      }}>
      {/* Home */}
      <TouchableOpacity
        style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
        onPress={() => navigation.navigate('Home', {userId})}>
        <Ionicons
          name={state.index === 0 ? 'home' : 'home-outline'}
          size={24}
          color={state.index === 0 ? '#1E90FF' : 'gray'}
        />
        <Text
          style={{color: state.index === 0 ? '#1E90FF' : 'gray', fontSize: 12}}>
          Home
        </Text>
      </TouchableOpacity>

      {/* Bookings */}
      <TouchableOpacity
        style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
        onPress={() => navigation.navigate('Bookings', {userId})}>
        <Ionicons
          name={state.index === 1 ? 'calendar' : 'calendar-outline'}
          size={24}
          color={state.index === 1 ? '#1E90FF' : 'gray'}
        />
        <Text
          style={{color: state.index === 1 ? '#1E90FF' : 'gray', fontSize: 12}}>
          Bookings
        </Text>
      </TouchableOpacity>

      {/* Middle Add Button */}
      <View style={{flex: 1, alignItems: 'center'}}>
        <TouchableOpacity
          onPress={() => navigation.navigate('CreateBooking', {userId: userId})}
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: '#1E90FF',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: -20,
          }}>
          <Ionicons name="add" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* About */}
      <TouchableOpacity
        style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
        onPress={() => navigation.navigate('About')}>
        <Ionicons
          name={
            state.index === 2
              ? 'information-circle'
              : 'information-circle-outline'
          }
          size={24}
          color={state.index === 2 ? '#1E90FF' : 'gray'}
        />
        <Text
          style={{color: state.index === 2 ? '#1E90FF' : 'gray', fontSize: 12}}>
          About
        </Text>
      </TouchableOpacity>

      {/* Profile */}
      <TouchableOpacity
        style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
        onPress={() => navigation.navigate('Profile', {userId})}>
        <Ionicons
          name={state.index === 3 ? 'person' : 'person-outline'}
          size={24}
          color={state.index === 3 ? '#1E90FF' : 'gray'}
        />
        <Text
          style={{color: state.index === 3 ? '#1E90FF' : 'gray', fontSize: 12}}>
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// --- Bottom Tab Navigation Bar ---
function MainTabs({route, navigation}: any) {
  //Grab userId passed from Login.tsx
  const {userId} = route.params;
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false, //Hides the double header
      }}
      tabBar={props => (
        <CustomTabBar {...props} navigation={navigation} userId={userId} />
      )}>
      <Tab.Screen name="Home" component={Home} initialParams={{userId: userId}}/>
      <Tab.Screen
        name="Bookings"
        component={Bookings}
        initialParams={{userId: userId}}
      />
      <Tab.Screen name="About" component={About} />
      <Tab.Screen
        name="Profile"
        component={Profile}
        initialParams={{userId: userId}}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        {/*Tab Navigator*/}
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen
          name="CreateBooking"
          component={CreateBookingScreen}
          options={{ presentation: 'modal', headerShown: false }}
        />
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
    left: '50%',
    marginLeft: -30, // Half of width to center
    bottom: 80, // Adjusted to sit above the bottom tab bar
    backgroundColor: '#1E90FF',
    borderRadius: 30,
    elevation: 8, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOpacity: 0.3,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 2,
  },
});
