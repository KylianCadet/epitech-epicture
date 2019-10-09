import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import Touchable from 'react-native-platform-touchable';

class TextButton extends React.Component {
	render() {
		return (
			<View style={[this.props.style, { }]}>
				<Touchable onPress={this.props.onPress} style={{ borderWidth: 10, borderColor: '#fff' }}>
					<Text style={{}}>{this.props.text}</Text>
				</Touchable>
			</View >
		)
	}
}

export default TextButton

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
});