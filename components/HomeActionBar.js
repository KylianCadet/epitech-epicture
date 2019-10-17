import React from 'react'
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native'

export function numberWithCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default class HomeActionBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			pressStatusUp: false,
			pressStatusDown: false,
		};
	}
	switchUp() {
		if (this.state.pressStatusUp)
			this.setState({ pressStatusUp: false });
		else if (!this.state.pressStatusUp && this.state.pressStatusDown) {
			this.setState({ pressStatusUp: true });
			this.setState({ pressStatusDown: false });
		} else
			this.setState({ pressStatusUp: true });
	}
	switchDown() {
		if (this.state.pressStatusDown)
			this.setState({ pressStatusDown: false });
		else if (!this.state.pressStatusDown && this.state.pressStatusUp) {
			this.setState({ pressStatusDown: true });
			this.setState({ pressStatusUp: false });
		} else
			this.setState({ pressStatusDown: true });
	}
	render() {
		return (
			<View style={styles.container}>
				<TouchableOpacity
					style={styles.icon}
					onPress={() => this.switchUp()}
				>
					<View style={styles.icon}>
						<Image
							style={styles.image}
							source={
								this.state.pressStatusUp
									? this.props.skinPressUp
									: this.props.skinUp
							}
						/>
						<Text
							style={
								this.state.pressStatusUp
									? styles.green
									: styles.white
							}
						>{numberWithCommas(this.props.countUp)}</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.icon}
					onPress={() => this.switchDown()}
				>
					<View style={styles.icon}>
						<Image
							style={styles.image}
							source={
								this.state.pressStatusDown
									? this.props.skinPressDown
									: this.props.skinDown
							}
						/>
						<Text
							style={
								this.state.pressStatusDown
									? styles.red
									: styles.white
							}
						>{numberWithCommas(this.props.countDown)}</Text>
					</View>
				</TouchableOpacity>
				<View style={styles.icon}>
					<Image style={styles.image} source={this.props.skinComment} />
					<Text style={styles.white}>{numberWithCommas(this.props.countComment)}</Text>
				</View>
				<View style={styles.icon}>
					<Image style={styles.image} source={this.props.skinView} />
					<Text style={styles.white}>{numberWithCommas(this.props.countView)}</Text>
				</View>
			</View >
		)
	}
}

const styles = StyleSheet.create({
	container: {
		// marginBottom: 15,
		// alignSelf: 'center',
		padding: 15,
		flex: 1,
		flexDirection: 'row',
	},
	icon: {
		flex: 1,
		flexDirection: 'row',
	},
	comment: {
		flex: 1,
		flexDirection: 'row',
	},
	view: {
		flex: 1,
		// marginLeft: -10,
		flexDirection: 'row',
	},
	image: {
		width: 20,
		height: 20,
	},
	white: {
		fontSize: 12,
		color: '#ddd',
		marginTop: 2.5,
		marginLeft: 7.5,
		color: '#ddd',
	},
	green: {
		fontSize: 12,
		color: '#ddd',
		marginTop: 2.5,
		marginLeft: 7.5,
		color: '#35CB67',
	},
	red: {
		fontSize: 12,
		color: '#ddd',
		marginTop: 2.5,
		marginLeft: 7.5,
		color: '#CF3232',
	},
});
