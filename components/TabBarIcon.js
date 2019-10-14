import React from 'react';
import { View, Text, Image } from 'react-native'

export default function TabBarIcon(props) {

	return (
		<View style={{ justifyContent: 'center' }}>
			{props.focused ?
				(
					<Image source={props.focusedImage} style={{ width: 40, resizeMode: 'contain', height: 20 }}></Image>
				) : (
					<Image source={props.idleImage} style={{ width: 40, resizeMode: 'contain', height: 20 }}></Image>
				)}
		</View>
	);
}
