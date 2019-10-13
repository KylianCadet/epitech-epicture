import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { connect } from 'react-redux'

import TextButton from '../components/TextButton'
import FitButton from '../components/FitButton'

class MainScreen extends React.Component {
	constructor(props) {
		super(props)
	}
	componentDidMount() {
		if (this.props.isLogged)
			this._navigateToMain()
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
					<TextButton style={{ marginLeft: 'auto', marginTop: 'auto' }} text='Continue as a guest' onPress={() => {
						this._navigateToMain()
					}} />
				</View>
			</View>
		);
	}
}

function mapStateToProps(state) {
	return {
		isLogged: state.isLogged
	}
}

function mapDispatchToProps(dispatch) {
	return {
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen)

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
});
