import React from 'react'
import { View, StyleSheet, Image } from 'react-native'

class HomeImg extends React.Component {
	render() {
		return (
			<View style={{flex: 1, flexDirection: 'row'}}>
				<Image
				style={this.props.style}
				source={{uri: this.props.source}}
				/>
			</View>
		)
	}
}

export default HomeImg