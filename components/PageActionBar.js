import React from 'react'
import { setDisplayTime } from '../screens/PostScreen';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native'
import { postRequest } from '../screens/HomeScreen';

export function numberWithCommas(x) {
	if (typeof x === 'undefined' || x === null) { return '0' }
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
	componentDidMount() {
		if (this.props.vote === 'up')
			this.setState({ pressStatusUp: true });
		else if (this.props.vote === 'down')
			this.setState({ pressStatusDown: true });
		if (this.props.fav)
			this.setState({ pressStatusLike: true });
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
	ItemCase = (status, stylePress, text, skin, skinPress) => {
		return (
			<View style={styles.case}>
				<Image style={styles.icon} source={status ? skinPress : skin} />
				<Text style={status ? stylePress : styles.white}>{text}</Text>
			</View>
		)
	}
	render() {
		return (
			<View style={styles.container}>
				<TouchableOpacity
					style={{ flex: 8 }}
					onPress={() => {
						this.switchUp()
						postRequest(this.props.header, 'https://api.imgur.com/3/gallery/' + this.props.id.toString() + '/vote/up')
							.then((data) => { console.log(data) })
					}}
				>
					{
						this.ItemCase(
							this.state.pressStatusUp,
							styles.green,
							numberWithCommas(this.props.countUp),
							this.props.skinUp,
							this.props.skinPressUp
						)
					}
				</TouchableOpacity>
				<TouchableOpacity
					style={{ flex: 7 }}
					onPress={() => {
						this.switchDown()
						postRequest(this.props.header, 'https://api.imgur.com/3/gallery/' + this.props.id.toString() + '/vote/down')
							.then((data) => { console.log(data) })
					}}
				>
					{
						this.ItemCase(
							this.state.pressStatusDown,
							styles.red,
							numberWithCommas(this.props.countDown),
							this.props.skinDown,
							this.props.skinPressDown
						)
					}
				</TouchableOpacity>
				<TouchableOpacity
					style={{ flex: 5 }}
					onPress={() => {
						this.switchLike()
						console.log(this.props.id)
						postRequest(this.props.header, 'https://api.imgur.com/3/album/' + this.props.id.toString() + '/favorite')
							.then((data) => { console.log(data) })
					}}
				>
					{
						this.ItemCase(
							this.state.pressStatusLike,
							styles.cyan,
							numberWithCommas(this.props.countLike),
							this.props.skinLike,
							this.props.skinPressLike
						)
					}
				</TouchableOpacity>
			</View >
		)
	}
}

const styles = StyleSheet.create({
	container: {
		marginVertical: 5,
		marginHorizontal: 20,
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
	white: {
		fontSize: 15,
		marginTop: 2,
		marginLeft: 10,
		color: '#ddd',
	},
	green: {
		fontSize: 15,
		marginTop: 2,
		marginLeft: 10,
		color: '#35CB67',
	},
	red: {
		fontSize: 15,
		marginTop: 2,
		marginLeft: 10,
		color: '#CF3232',
	},
	cyan: {
		fontSize: 15,
		marginTop: 2,
		marginLeft: 10,
		color: '#33CBCC',
	},
});
