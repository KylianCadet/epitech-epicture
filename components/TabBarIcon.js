import React from 'react';
import { View, Text } from 'react-native'

export default function TabBarIcon(props) {
	return (
		<View>
			{props.focused ?
				(
					<Text>focused</Text>
				) : (
					<Text>not focused</Text>
				)}
		</View>
	);
}
