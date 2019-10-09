// import { AppLoading } from 'expo';
// import { Asset } from 'expo-asset';
// import * as Font from 'expo-font';
import React from 'react';
import { StyleSheet, View, Text, Button, Image, Linking } from 'react-native';
// import * as WebBrowser from 'expo-web-browser';
import { WebView } from 'react-native-webview'

import AppNavigator from './navigation/AppNavigator';

const client_id = '38c6850ce6bd17c'
const client_secret = 'b4db65e6d74818d232d777d09988bc419e8519d1'


// fetch('https://api.imgur.com/3/gallery/hot/viral/', {
// 	headers: {
// 		Authorization: 'Client-ID ' + client_id
// 	}
// })
// 	.then((response) => response.json())
// 	.then((data) => console.log(data))
// 	.catch((error) => console.error(error))

import TextButton from './components/TextButton'
import FitButton from './components/FitButton'
// import FadeIn from './animation/FadeIn'
// import LoadImage from './components/LoadImage'

function openAuthorize() {
	Linking.openURL('https://api.imgur.com/oauth2/authorize?client_id=' + client_id + '&response_type=token')
}

export default class App extends React.Component {
	constructor(props) {
		super(props)
		this._id = null
		this.state = {
			login: false,
			webview: false
		}
	}

	_login() {
		const uri = 'https://api.imgur.com/oauth2/authorize?client_id=' + client_id + '&response_type=token'
		if (!this.state.login && !this.state.webview) {
			return (
				<View style={[styles.container]}>
					<Image source={require('./assets/images/Epicture.png')} style={{ flex: 1, width: null, height: null, resizeMode: 'contain', marginBottom: 'auto' }} />
					<View style={{ flex: 1 }}>
						<FitButton style={{}} title='Login with your Imgur account' onPress={() => this.setState({ webview: true })}
						/>
						<TextButton style={{ marginLeft: 'auto', marginTop: 'auto' }} text='Continue as a guest' onPress={() => {
							this.setState({ login: true })
						}} />
					</View>
				</View>
			)
		} else if (this.state.webview) {
			return (
				<WebView
					source={{ uri }}
				/>
			)
		}
	}

	_nav() {
		if (this.state.login && !this.state.webview) {
			return (
				<AppNavigator />
			)
		}
	}
	render() {
		return (
			<View style={styles.container}>
				{this._login()}
				{this._nav()}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
});
