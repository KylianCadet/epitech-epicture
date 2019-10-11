import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import AuthLoadingScreen from '../screens/AuthScreen'

// You could add another route here for authentication.
// Read more at https://reactnavigation.org/docs/en/auth-flow.html

export default createAppContainer(
	createSwitchNavigator({
		AuthLoading: AuthLoadingScreen,
		Main: MainTabNavigator,
	},
	{
		initialRouteName: 'AuthLoading',
	})
);
