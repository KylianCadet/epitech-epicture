import React from 'react'
import { View, StyleSheet, Image, TouchableHighlight, TouchableOpacity } from 'react-native'

export default class ActionButton extends React.Component {
	constructor(props) {
		super(props);
		this.state = { pressStatus: false };
	}
	switch() {
		if (this.state.pressStatus)
			this.setState({ pressStatus: false });
		else
			this.setState({ pressStatus: true });
	}
	render() {
		return (
			<View style={styles.container}>
				<TouchableOpacity
					style={styles.touchzone}
					onPress={() =>
						this.switch()
					}
				>
					<Image
						style={styles.image}
						source={
							this.state.pressStatus
								? this.props.skinPress
								: this.props.skin
						}
					/>
				</TouchableOpacity>
			</View >
		)
	}
}

const styles = StyleSheet.create({
	container: {
		// marginBottom: 15,
	},
	touchzone: {
		padding: 15,
	},
	image: {
		width: 20,
		height: 20,
	}
});
