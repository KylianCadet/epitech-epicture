import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack'
import { createBottomTabNavigator } from 'react-navigation-tabs'

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import UploadScreen from '../screens/UploadScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginWebView from '../screens/LoginWebView'
import SearchView from '../screens/SearchScreen'


const SearchStack = createStackNavigator({
	Search: {
		screen: SearchView,
	},
});

SearchStack.navigationOptions = {
	tabBarLabel: 'Search',
	tabBarIcon: ({ focused }) => (
		<TabBarIcon focused={focused}
		focusedImage={require('../assets/images/glassIconFocused.png')}
		idleImage={require('../assets/images/glassIcon.png')} />
	),
};

const HomeStack = createStackNavigator({
	Home: {
		screen: HomeScreen,
	},
});

HomeStack.navigationOptions = {
	tabBarLabel: 'Home',
	tabBarIcon: ({ focused }) => (
		<TabBarIcon focused={focused}
		focusedImage={require('../assets/images/homeIconFocused.png')}
		idleImage={require('../assets/images/homeIcon.png')} />
	),
};

const UploadStack = createStackNavigator(
	{
		Upload: UploadScreen,
	},
);

UploadStack.navigationOptions = {
	tabBarLabel: 'Upload',
	tabBarIcon: ({ focused }) => (
		<TabBarIcon focused={focused}
		focusedImage={require('../assets/images/cameraIconFocused.png')}
		idleImage={require('../assets/images/cameraIcon.png')} />
	),
};

const ProfileStack = createStackNavigator({
	Profile: {
		screen: ProfileScreen,
	},
	LoginWebView: {
		screen: LoginWebView,
	},
});

ProfileStack.navigationOptions = {
	tabBarLabel: 'Profile',
	tabBarIcon: ({ focused }) => (
		<TabBarIcon focused={focused}
			focusedImage={require('../assets/images/profileIconFocused.png')}
			idleImage={require('../assets/images/profileIcon.png')} />
	),
};

const tabNavigator = createBottomTabNavigator(
	{
		HomeStack,
		SearchStack,
		UploadStack,
		ProfileStack,
	},
	{
		initialRouteName: 'HomeStack',
		tabBarOptions: {
			showLabel: false,
			style: {
				backgroundColor: '#262525'
			}
		}
	}
);


export default tabNavigator;
