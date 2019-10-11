import React from 'react';
import { StyleSheet, View, Text, Button, Image, Linking } from 'react-native';
import { WebView } from 'react-native-webview'
import { connect } from 'react-redux'
import { dispatch_function } from '../redux/reducers/index'

const client_id = '38c6850ce6bd17c'
const client_secret = 'b4db65e6d74818d232d777d09988bc419e8519d1'

import TextButton from '../components/TextButton'
import FitButton from '../components/FitButton'

function parse_query(queryString) {
	var error = queryString.split('?')[1]
	if (error) {
		if (error.split('=')[0] == 'error') {
			return {
				'error': error.split('=')[1]
			}
		}
	}
	var tokens = queryString.split('#')
	if (tokens.length != 2)
		return;
	var queries = tokens[1].split('&')
	var params = {}
	for (var i = 0; i < queries.length; i++) {
		params[queries[i].split('=')[0]] = queries[i].split('=')[1]
	}
	return (params)
}

class MainScreen extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			login: true,
			webview: false,
		}
	}

	_navigateToMain() {
		this.props.navigation.navigate('Main')
	}

	_login() {
		if (this.state.login) {
			return (
				<View style={[styles.container]}>
					<Image source={require('../assets/images/Epicture.png')} style={{ flex: 1, width: null, height: null, resizeMode: 'contain', marginBottom: 'auto' }} />
					<View style={{ flex: 1 }}>
						<FitButton style={{}} title='Login with your Imgur account' onPress={() => this.setState({ webview: true, login: false })}
						/>
						<TextButton style={{ marginLeft: 'auto', marginTop: 'auto' }} text='Continue as a guest' onPress={() => {
							this.setState({ login: false })
							this._navigateToMain()
						}} />
					</View>
				</View>
			)
		}
	}

	_webview() {
		const uri = 'https://api.imgur.com/oauth2/authorize?client_id=' + client_id + '&response_type=token'
		if (this.state.webview) {
			return (
				<WebView
					source={{ uri }}
					onNavigationStateChange={(webview) => {
						var token = parse_query(webview.url)
						if (!token)
							return;
						if (token['error']) {
							this.setState({ login: true, webview: false })
							return;
						}
						console.log(token)
						if (token['access_token']) {
							this.props.onLogin(token)
							this.setState({ webview: false })
							this._navigateToMain()
						}
					}}
				/>
			)
		}
	}
	render() {
		return (
			<View style={styles.container}>
				{this._webview()}
				{this._login()}
			</View>
		);
	}
}

function mapStateToProps(state) {
	return {
	}
}

function mapDispatchToProps(dispatch) {
	return {
		onLogin: (name) => {
			dispatch(dispatch_function('ACCOUNT_INFO', name))
			dispatch(dispatch_function('LOGIN'))
		},
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen)

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
});
