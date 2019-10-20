import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack'
import { createBottomTabNavigator } from 'react-navigation-tabs'

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import PostScreen from '../screens/PostScreen';
import UploadScreen from '../screens/UploadScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginWebView from '../screens/LoginWebView'
import SearchScreen from '../screens/SearchScreen'
import ImageScreen from '../screens/ImageScreen';
import SettingsScreen from '../screens/SettingsScreen'
import Colors from '../constants/Colors';


const navigationOpt = () => ({
	headerStyle: {
		backgroundColor: Colors.navigationColor
	}
})

const SearchStack = createStackNavigator({
	Search: {
		screen: SearchScreen,
	},
	Post: {
		screen: PostScreen,
		navigationOptions: navigationOpt,
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
		navigationOptions: navigationOpt,
	},
	Post: {
		screen: PostScreen,
		navigationOptions: navigationOpt,
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
		navigationOptions: navigationOpt,
	},
	LoginWebView: {
		screen: LoginWebView,
		navigationOptions: navigationOpt,
	},
	Post: {
		screen: PostScreen,
		navigationOptions: navigationOpt,
	},
	Post: {
		screen: SearchScreen,
		navigationOptions: navigationOpt,
	},
	Image: {
		screen: ImageScreen,
		navigationOptions: navigationOpt,
	},
	Settings: {
		screen: SettingsScreen,
		navigationOptions: navigationOpt,
	}
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
