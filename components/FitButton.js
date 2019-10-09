import React from 'react'
import { View, StyleSheet, Button } from 'react-native'

class FitButton extends React.Component {
	render() {
		return (
			<View style={[styles.fitButton, this.props.style]}>
				<Button title={this.props.title} onPress={this.props.onPress}></Button>
			</View>
		)
	}
}

export default FitButton

const styles = StyleSheet.create({
	fitButton: {
		flexDirection: 'row',
		justifyContent: 'center',
	},
});