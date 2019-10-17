import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux'
import { dispatch_function } from '../redux/reducers/index'
import Color from '../constants/Colors'
import ClienID from '../constants/ClientID'

import TextButton from '../components/TextButton'
import FitButton from '../components/FitButton'

class MainScreen extends React.Component {
	constructor(props) {
		super(props)
	}

	componentDidMount() {
		AsyncStorage.getItem('isLogged').then((data) => {
			if (data == 'true') {
				this.props.onBack()
				this._navigateToMain()
			}
		})
	}
	componentDidUpdate() {
		if (this.props.isLogged)
			this._navigateToMain()
	}
	_navigateToMain() {
		this.props.navigation.navigate('Main')
	}
	render() {
		const { navigate } = this.props.navigation
		return (
			<View style={styles.container}>
				<Image source={require('../assets/images/Epicture.png')} style={{ flex: 1, width: null, height: null, resizeMode: 'contain', marginBottom: 'auto' }} />
				<View style={{ flex: 1 }}>
					<FitButton style={{}} title='Login with your Imgur account' onPress={() => {
						navigate('LoginWebView')
						if (this.props.isLogged)
							this._navigateToMain()
					}} />
					<TextButton style={{ marginLeft: 'auto', marginTop: 'auto', backgroundColor: Color.backgroundColor }} textStyle={{ color: 'white' }} text='Continue as a guest' onPress={() => {
						this._navigateToMain()
					}} />
				</View>
			</View>
		);
	}
}

function mapStateToProps(state) {
	return {
		isLogged: state.isLogged,
		authorizationHeader: state.authorizationHeader
	}
}

function mapDispatchToProps(dispatch) {
	return {
		onBack: (name) => {
			AsyncStorage.getItem('refresh_token').then((refresh_token) => {
				fetch('https://api.imgur.com/oauth2/token', {
					method: 'post',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						refresh_token: refresh_token,
						client_id: ClienID.client_id,
						client_secret: ClienID.client_secret,
						grant_type: 'refresh_token'
					})
				})
					.then((response) => response.json())
					.then((data) => {
						dispatch(dispatch_function('TOKEN', data['access_token']))
						dispatch(dispatch_function('AUTHORIZATION', data['access_token']))
						AsyncStorage.setItem('refresh_token', data['refresh_token'])
					})
					.catch((error) => console.error(error))
			})
			AsyncStorage.getItem('username').then((username) => {
				dispatch(dispatch_function('USERNAME', username))
			})
			dispatch(dispatch_function('LOGIN'))
		},
	}

}

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen)

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Color.backgroundColor,
	},
});
