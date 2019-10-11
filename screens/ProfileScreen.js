import React from 'react';
import { View, StyleSheet, Text } from 'react-native'
import { connect } from 'react-redux'
import { dispatch_function } from '../redux/reducers/index'

class ProfileScreen extends React.Component {
	constructor(props) {
		super(props)
	}
	_logged() {
		if (this.props.isLogged) {
			console.log(this.props.accountInfo)
			return (
				<Text>{this.props.accountInfo['account_username']}</Text>
			)
		}
	}
	_guest() {
		if (!this.props.isLogged) {
			return (
				<Text>Guest</Text>
			)
		}
	}
	render() {
		return (
			<View style={styles.container}>
				{this._logged()}
				{this._guest()}
			</View>
		)
	}
}


function mapStateToProps(state) {
	console.log(state)
	return {
		accountInfo: state.accountInfo,
		isLogged: state.isLogged
	}
}

function mapDispatchToProps(dispatch) {
	return {
	}
}

ProfileScreen.navigationOptions = {
	title: 'Profile',
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen)


const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
});
