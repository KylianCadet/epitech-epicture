import React from 'react'
import { StyleSheet } from 'react-native';
import { createStore } from 'redux'
import allReducers from './redux/reducers/index'
import { Provider } from 'react-redux'
import AppNavigator from './navigation/AppNavigator'


const store = createStore(allReducers)

export default class App extends React.Component {
	render() {
		return (
			<Provider store={store}>
				<AppNavigator />
			</Provider>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
});
