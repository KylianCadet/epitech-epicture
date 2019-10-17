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
import { setDisplayTime } from './PostScreen';

const client_id = '38c6850ce6bd17c'
var page = 0

export function getRequest(header, url) {
	return fetch(url, {
		headers: {
			Authorization: header
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

function DisplayImage({ all, item, dim, images, album_id, navigation, info, test }) {
	return (
		<TouchableImage
			style={[styles.image, { width: dim.width, height: dim.height }]}
			source={item.link}
			navigation={navigation}
			album_id={album_id}
			images={images}
			all={all}
			info={info}
			test={test}
		/>
	)
}

function DisplayVideo({ all, item, dim, images, album_id, navigation, info }) {
	return (
		<TouchableVideo
			style={[styles.image, { width: dim.width, height: dim.height }]}
			source={item.link}
			navigation={navigation}
			album_id={album_id}
			images={images}
			all={all}
			info={info}
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
	)
}

function DisplayMedia({ all, item, dim, images, album_id, navigation, title, info }) {
	var author = all.account_url
	if (author.length > 10)
		author = author.substr(0, 10)
	return (
		<View elevation={7.5} style={[styles.item, { marginHorizontal: dim.box }]}>
			<Text style={styles.title}>{title}</Text>
			<View style={styles.topbar}>
				<Text style={[styles.white, { flex: 1.1 }]}>
					<Text style={styles.white}>by </Text>
					<Text style={[styles.white, { fontWeight: 'bold', color: '#FFF' }]}>{author}</Text>
				</Text>
				<Text style={[styles.white, { flex: 1 }]}>{numberWithCommas(all.score)} pts</Text>
				<Text style={[styles.white, { flex: 0.60 }]}>{setDisplayTime(all.datetime)}</Text>
			</View>
			{
				item.type === 'video/mp4'
					?
					(DisplayVideo({ all, item, dim, images, album_id, navigation, info }))
					:
					(DisplayImage({ all, item, dim, images, album_id, navigation, info }))
			}
			{
				info.isLogged
					?
					(DisplayActions({ all, item, dim }))
					:
					(<View></View>)
			}
		</View>
	);
}

function Item({ all, title, images, navigation, album_id, info }) {
	if (typeof images === 'undefined' || images === null) { return null }
	var item = images[0]
	var dim = setDimensions(item)
	if (
		item.type === 'video/mp4' ||
		item.type === 'image/png' ||
		item.type === 'image/gif' ||
		item.type === 'image/jpeg')
		return (DisplayMedia({ all, item, dim, images, album_id, navigation, title, info }))
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
		getRequest(this.props.authorizationHeader, 'https://api.imgur.com/3/gallery/top/viral/all/' + page.toString()).then((data) => {
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
						info={this.props} />}
					keyExtractor={item => item.id}
					onEndReachedThreshold={0.5}
					onEndReached={({ distanceFromEnd }) => {
						page++
						console.log('On affiche la page suivante n°', page.toString())
						getRequest(this.props.authorizationHeader, 'https://api.imgur.com/3/gallery/top/viral/all/' + page.toString()).then((data) => {
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
		username: state.username,
		authorizationHeader: state.authorizationHeader
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
		padding: 15,
		// marginTop: 15,
	},
	topbar: {
		flex: 1,
		flexDirection: 'row',
		marginLeft: 10,
		marginBottom: 10,
		marginTop: -5,
	},
	white: {
		fontSize: 12,
		color: '#BBBBBB',
	},
});