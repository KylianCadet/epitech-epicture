// import * as WebBrowser from 'expo-web-browser';
import TouchableImage from '../components/ImageT'
import TouchableVideo from '../components/VideoT'
import ActionButton from '../components/ButtonA'
import HomeActionBar from '../components/HomeActionBar'
import React from 'react';
import { connect } from 'react-redux'
import {
	Platform,
	StyleSheet,
	SafeAreaView,
	FlatList,
	Text,
	View,
	Dimensions,
	Button,
	Image,
} from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';

const client_id = '38c6850ce6bd17c'
var page = 0

export function getRequest(url) {
	return fetch(url, {
		headers: {
			Authorization: 'Client-ID ' + client_id
			// Authorization: '' + client_id
		}
	})
		.then((response) => response.json())
		.catch((error) => console.error(error))
}

function setDimensions(item) {
	var newheight = Dimensions.get('window').width * item.height / item.width * 0.9
	var newwidth = Dimensions.get('window').width * 0.9
	var boxwidth = (Dimensions.get('window').width - newwidth) / 2
	return ({ width: newwidth, height: newheight, box: boxwidth })
}

function DisplayImage({ item, dim, images, album_id, navigation }) {
	return (
		<TouchableImage
			style={[styles.image, { width: dim.width, height: dim.height }]}
			source={item.link}
			navigation={navigation}
			album_id={album_id}
			images={images}
		/>
	)
}

function DisplayVideo({ item, dim, images, album_id, navigation }) {
	return (
		<TouchableVideo
			style={[styles.image, { width: dim.width, height: dim.height }]}
			source={item.link}
			navigation={navigation}
			album_id={album_id}
			images={images}
		/>
	)
}

export function numberWithCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function DisplayActions({ all, item, dim }) {
	return (
		<HomeActionBar
			skinUp={require('../assets/images/up.png')}
			skinPressUp={require('../assets/images/up_green.png')}
			countUp={all.ups}
			skinDown={require('../assets/images/down.png')}
			skinPressDown={require('../assets/images/down_red.png')}
			countDown={all.downs}
			skinComment={require('../assets/images/comment.png')}
			countComment={all.comment_count}
			skinView={require('../assets/images/view.png')}
			countView={all.views}
		/>
		// <View style={{ flex: 1, flexDirection: 'row' }}>
		// 	<ActionButton
		// 		style={{}}
		// 	/>
			// <Text style={styles.vote}>{numberWithCommas(all.ups)}</Text>
		// 	<ActionButton
		// 		style={{}}
		// 	/>
		// 	<Text style={styles.vote}>{numberWithCommas(all.downs)}</Text>
		// 	<ActionButton
		// 		style={{}}
		// 		skin={require('../assets/images/comment2.png')}
		// 		skinPress={require('../assets/images/comment2.png')}
		// 	/>
		// 	<Text style={styles.vote}>{numberWithCommas(all.comment_count)}</Text>
		// 	<ActionButton
		// 		style={{}}
		// 		skin={require('../assets/images/view_white.png')}
		// 		skinPress={require('../assets/images/view_white.png')}
		// 	/>
		// 	<Text style={styles.vote}>{numberWithCommas(all.views)}</Text>
		// </View>
	)
}

function DisplayMedia({ all, item, dim, images, album_id, navigation, title, props }) {
	return (
		<View elevation={7.5} style={[styles.item, { marginHorizontal: dim.box }]}>
			{
				item.type === 'video/mp4'
					?
					(DisplayVideo({ item, dim, images, album_id, navigation }))
					:
					(DisplayImage({ item, dim, images, album_id, navigation }))
			}
			<Text style={styles.title}>{title}</Text>
			{
				props.isLogged
					?
					(DisplayActions({ all, item, dim }))
					:
					(<View></View>)
			}
		</View>
	);
}

function Item({ all, title, images, navigation, album_id, props }) {
	if (typeof images === 'undefined' || images === null) { return null }
	var item = images[0]
	var dim = setDimensions(item)
	if (
		item.type === 'video/mp4' ||
		item.type === 'image/png' ||
		item.type === 'image/gif' ||
		item.type === 'image/jpeg')
		return (DisplayMedia({ all, item, dim, images, album_id, navigation, title, props }))
	else {
		console.log('Unknow item : ' + item.type + ' ' + title)
		return (null)
	}
}

class HomeScreen extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			data: null,
			finishLoading: false
		}
	}
	componentDidMount() {
		getRequest('https://api.imgur.com/3/gallery/top/viral/all/' + page.toString()).then((data) => {
			this.setState({ finishLoading: true, data: data.data })
		})
	}
	render() {
		return (
			<SafeAreaView style={styles.container}>
				<FlatList
					data={this.state.data}
					renderItem={({ item }) => <Item
						title={item.title}
						all={item}
						images={item.images}
						album_id={item.id}
						navigation={this.props.navigation}
						props={this.props} />}
					keyExtractor={item => item.id}
					onEndReachedThreshold={0.5}
					onEndReached={({ distanceFromEnd }) => {
						page++
						console.log('On affiche la page suivante n°', page.toString())
						getRequest('https://api.imgur.com/3/gallery/top/viral/all/' + page.toString()).then((data) => {
							this.setState({
								finishLoading: true, data: this.state.data.concat(data.data)
							})
						})
					}}
				/>
			</SafeAreaView>
		);
	}
}

function mapStateToProps(state) {
	return {
		accountInfo: state.accountInfo,
		isLogged: state.isLogged,
		token: state.token,
		username: state.username
	}
}

HomeScreen.navigationOptions = {
	header: null,
};

export default connect(mapStateToProps)(HomeScreen)

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#141518',
		// backgroundColor: '#2E2F34',
	},
	item: {
		borderRadius: 10,
		textAlign: 'center',
		// backgroundColor: '#424B54',
		backgroundColor: '#2c2f34',
		marginVertical: 20,
		shadowColor: '#000000',
		shadowOffset: {
			width: 0,
			height: 3
		},
		shadowRadius: 5,
		shadowOpacity: 1,
		// marginHorizontal: 20,
	},
	title: {
		// marginVertical: 15,
		fontWeight: 'bold',
		textAlign: 'center',
		fontSize: 20,
		color: '#FFFFFF',
		marginHorizontal: 15,
		marginTop: 15,
	},
	image: {
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
	},
});