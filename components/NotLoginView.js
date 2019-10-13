import React from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import FixButton from './FitButton'

class NotLoginView extends React.Component {
	constructor(props) {
		super(props)
	}
	render() {
		return (
			<View style={styles.container}>
				<View style={{ flex: 2, marginTop: 50 }}>
					<Image source={require('../assets/images/unconnected.png')} style={{ flex: 1, width: null, height: null, resizeMode: 'contain', marginBottom: 'auto' }} />
				</View>
				<View style={{ flex: 2, alignItems: 'center' }}>
					<Text>YOU ARE NOT LOGIN</Text>
				</View>
				<View style={{ flex: 1 }}>
					<FixButton title="Login with your Imgur account" onPress={() => this.props.navigation.navigate('LoginWebView')} />
				</View>
			</View>
		);
	}
}

export default NotLoginView

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
});