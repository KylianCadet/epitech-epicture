import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack'

import MainTabNavigator from './MainTabNavigator';
import AuthLoadingScreen from '../screens/AuthScreen'
import LoginWebView from '../screens/LoginWebView'

// You could add another route here for authentication.
// Read more at https://reactnavigation.org/docs/en/auth-flow.html


const AuthLoading = createStackNavigator({
	AuthLoading: {
		screen: AuthLoadingScreen,
		navigationOptions: {
			header: null
		},
	},
	LoginWebView: {
		screen: LoginWebView
	},
})

export default createAppContainer(
	createSwitchNavigator(
		{
			AuthLoading: AuthLoading,
			Main: MainTabNavigator,
		},
		{
			initialRouteName: 'AuthLoading',
		})
);
