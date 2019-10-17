import React from 'react'
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native'

export function numberWithCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default class PageActionBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			pressStatusUp: false,
			pressStatusDown: false,
			pressStatusLike: false,
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
	switchLike() {
		if (this.state.pressStatusLike)
			this.setState({ pressStatusLike: false });
		else
			this.setState({ pressStatusLike: true });
	}
	render() {
		return (
			<View>
				<View style={styles.container}>
					<TouchableOpacity
						style={{ flex: 8 }}
						onPress={() => this.switchUp()}
					>
						<View style={styles.case}>
							<Image
								style={styles.icon}
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
						style={{ flex: 7 }}
						onPress={() => this.switchDown()}
					>
						<View style={styles.case}>
							<Image
								style={styles.icon}
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
					<TouchableOpacity
						style={{ flex: 5 }}
						onPress={() => this.switchLike()}
					>
						<View style={styles.case}>
							<Image
								style={styles.icon}
								source={
									this.state.pressStatusLike
										? this.props.skinPressLike
										: this.props.skinLike
								}
							/>
							<Text
								style={
									this.state.pressStatusLike
										? styles.cyan
										: styles.white
								}
							>{numberWithCommas(this.props.countLike)}</Text>
						</View>
					</TouchableOpacity>
				</View >
				<View style={styles.secondLine}>
					{/* <View style={{ flexDirection: 'row', flex: 8 }}>
						<Image style={styles.iconS} source={this.props.skinComment} />
						<Text style={styles.whiteS}>{numberWithCommas(this.props.countComment)}</Text>
					</View> */}
					<View style={{ flexDirection: 'row', flex: 1 }}>
						{/* <Image style={styles.iconS} source={this.props.skinTrophee} /> */}
						<Text style={styles.whiteS}>{numberWithCommas(this.props.countTrophee)} Points</Text>
					</View>
					<View style={{ flexDirection: 'row', flex: 1 }}>
						{/* <Image style={styles.iconS} source={this.props.skinView} /> */}
						<Text style={styles.whiteS}>{numberWithCommas(this.props.countView)} Views</Text>
					</View>
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		marginHorizontal: 15,
		marginBottom: 15,
		flex: 1,
		flexDirection: 'row',
	},
	secondLine: {
		marginHorizontal: 15,
		marginLeft: 50,
		marginBottom: 15,
		flex: 1,
		flexDirection: 'row',
	},
	case: {
		flex: 1,
		flexDirection: 'row',
	},
	icon: {
		width: 25,
		height: 25,
	},
	iconS: {
		width: 17.5,
		height: 17.5,
	},
	whiteS: {
		fontSize: 12,
		marginTop: 0,
		marginLeft: 10,
		color: '#bbb',
	},
	white: {
		fontSize: 15,
		marginTop: 5,
		marginLeft: 10,
		color: '#ddd',
	},
	green: {
		fontSize: 15,
		marginTop: 5,
		marginLeft: 10,
		color: '#35CB67',
	},
	red: {
		fontSize: 15,
		marginTop: 5,
		marginLeft: 10,
		color: '#CF3232',
	},
	cyan: {
		fontSize: 15,
		marginTop: 5,
		marginLeft: 10,
		color: '#33CBCC',
	},
});
