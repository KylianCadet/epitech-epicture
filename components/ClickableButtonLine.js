import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Touchable from 'react-native-platform-touchable';

class ClickableButtonLine extends React.Component {
	constructor(props) {
		super(props)
	}
	render() {
		return (
			<View style={{ flex: 1 }}>
				<Touchable style={{ paddingHorizontal: 15, paddingVertical: 15 }}>
					<View style={{ flexDirection: 'row' }}>
						<Text>{this.props.text}</Text>
					</View>
				</Touchable>
			</View >
		);
	}
}

export default ClickableButtonLine