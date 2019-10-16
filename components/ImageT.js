import React from 'react'
import { View, StyleSheet, Image, TouchableHighlight } from 'react-native'

export default class TouchableImage extends React.Component {
	render() {
		return (
			<View style={styles.container}>
				<TouchableHighlight onPress={() => this.props.navigation.navigate('Post', {
					images: this.props.images,
					album_id: this.props.album_id,
				})}>
					<Image
						style={this.props.style}
						source={{ uri: this.props.source }}
					/>
				</TouchableHighlight>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'row',
		alignSelf: 'center',
	},
});
