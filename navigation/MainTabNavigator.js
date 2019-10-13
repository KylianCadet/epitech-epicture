import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack'
import { createBottomTabNavigator } from 'react-navigation-tabs'

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import UploadScreen from '../screens/UploadScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginWebView from '../screens/LoginWebView'


const HomeStack = createStackNavigator({
	Home: {
		screen: HomeScreen,
	},
});

HomeStack.navigationOptions = {
	tabBarLabel: 'Home',
	tabBarIcon: ({ focused }) => (
		<TabBarIcon
			focused={focused}
			name={Platform.OS === 'ios' ? `ios-information-circle${focused ? '' : '-outline'}` : 'md-information-circle'}
		/>
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
		<TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'} />
	),
};

const ProfileStack = createStackNavigator({
	Profile: {
		screen: ProfileScreen,
	},
	// LoginWebView: {
	// 	screen: LoginWebView,
	// },
});

ProfileStack.navigationOptions = {
	tabBarLabel: 'Profile',
	tabBarIcon: ({ focused }) => (
		<TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'} />
	),
};

const tabNavigator = createBottomTabNavigator(
	{
		HomeStack,
		UploadStack,
		ProfileStack,
	},
	{
		initialRouteName: 'HomeStack',
	}
);

export default tabNavigator;
