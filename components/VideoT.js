import React from 'react'
import Video from 'react-native-video';
import { View, StyleSheet, TouchableHighlight } from 'react-native'

export default class TouchableVideo extends React.Component {
	render() {
		return (
			<View style={styles.container}>
				<TouchableHighlight onPress={() => this.props.navigation.navigate('Post', {
					images: this.props.images,
					album_id: this.props.album_id,
					all: this.props.all,
					info: this.props.info,
					refresh: this.props.refresh,
					scrollPosition: this.props.scrollPosition,
				})}>
					<Video
						style={this.props.style}
						source={{ uri: this.props.source }}
						repeat={true}
						muted={true}
						resizeMode={"cover"}
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
