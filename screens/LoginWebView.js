import React from 'react'
import { WebView } from 'react-native-webview'
import { connect } from 'react-redux'
import { dispatch_function } from '../redux/reducers/index'


const client_id = '38c6850ce6bd17c'
const client_secret = 'b4db65e6d74818d232d777d09988bc419e8519d1'
const uri = 'https://api.imgur.com/oauth2/authorize?client_id=' + client_id + '&response_type=token'


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

class LoginWebView extends React.Component {
	constructor(props) {
		super(props)
	}
	render() {
		return (
			<WebView
				source={{ uri }}
				onNavigationStateChange={(webview) => {
					var token = parse_query(webview.url)
					if (!token)
						return;
					if (token['error']) {
						this.props.navigation.goBack()
						return;
					}
					if (token['access_token']) {
						this.props.onLogin(token)
						this.props.navigation.goBack()
						return;
					}
				}}
			/>
		)
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
			dispatch(dispatch_function('TOKEN', name['access_token']))
			dispatch(dispatch_function('USERNAME', name['account_username']))
		},
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginWebView)
