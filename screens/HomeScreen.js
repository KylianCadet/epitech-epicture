// import * as WebBrowser from 'expo-web-browser';
import TouchableImage from '../components/ImageT'
import TouchableVideo from '../components/VideoT'
import ActionButton from '../components/ButtonA'
import HomeActionBar from '../components/HomeActionBar'
import FilterSection from '../components/FilterSection'
import React from 'react';
import { connect } from 'react-redux'
import {
	RefreshControl,
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
		headers: header

	})
		.then((response) => response.json())
		.catch((error) => console.error(error))
}

export function postRequest(header, url) {
	return fetch(url, {
		method: 'post',
		headers: {
			Authorization: header,
			// 'Content-Type' : 'application/json',
		},
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

function DisplayImage({ all, item, dim, images, album_id, navigation, info, refresh, scrollPosition }) {
	return (
		<TouchableImage
			style={[styles.image, { width: dim.width, height: dim.height }]}
			source={item.link}
			navigation={navigation}
			album_id={album_id}
			images={images}
			all={all}
			info={info}
			refresh={refresh}
			scrollPosition={scrollPosition}
		/>
	)
}

function DisplayVideo({ all, item, dim, images, album_id, navigation, info, refresh, scrollPosition }) {
	return (
		<TouchableVideo
			style={[styles.image, { width: dim.width, height: dim.height }]}
			source={item.link}
			navigation={navigation}
			album_id={album_id}
			images={images}
			all={all}
			info={info}
			refresh={refresh}
			scrollPosition={scrollPosition}
		/>
	)
}

export function numberWithCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function DisplayActions({ all, item, dim, header }) {
	// console.log(all.title + ' : ' + all.vote)
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
			vote={all.vote}
			id={all.id}
			header={header}
		/>
	)
}

function DisplayMedia({ all, item, dim, images, album_id, navigation, title, info, header, refresh, scrollPosition }) {
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
				<Text style={[styles.white, { flex: 1 }]}>{numberWithCommas(all.points)} pts</Text>
				<Text style={[styles.white, { flex: 0.60 }]}>{setDisplayTime(all.datetime)}</Text>
			</View>
			{
				item.type === 'video/mp4'
					?
					(DisplayVideo({ all, item, dim, images, album_id, navigation, info, refresh, scrollPosition }))
					:
					(DisplayImage({ all, item, dim, images, album_id, navigation, info, refresh, scrollPosition }))
			}
			{
				info.isLogged
					?
					(DisplayActions({ all, item, dim, header }))
					:
					(<View></View>)
			}
		</View>
	);
}

function Item({ all, title, images, navigation, album_id, info, header, refresh, scrollPosition }) {
	if (all.filterSection)
		return (<FilterSection params={all} />)
	if (typeof images === 'undefined' || images === null) { return null }
	var item = images[0]
	var dim = setDimensions(item)
	if (
		item.type === 'video/mp4' ||
		item.type === 'image/png' ||
		item.type === 'image/gif' ||
		item.type === 'image/jpeg')
		return (DisplayMedia({ all, item, dim, images, album_id, navigation, title, info, header, refresh, scrollPosition }))
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
			loading: false,
			refreshing: false,
			scrollPosition: 0,
		}

		this.filterSectionStatus = true
		this.filters = {
			section: 'top',
			sort: 'viral',
			date: 'all',
		}

		this.filterSection = [
			{
				id: '0',
				filterSection: true,
				filters: this.filters,
				update: this.updateFilters,
				refresh: this.handleRefresh,
				getFilters: this.getFilters,
				setHidden: this.setHidden,
				getHidden: this.getHidden,
			},
		]
	}

	componentDidMount() {
		this.makeRemoteRequest()
	}

	makeRemoteRequest = (errorLoading, navigation, pos) => {
		var uri = 'https://api.imgur.com/3/gallery/'
			+ this.filters.section + '/'
			+ this.filters.sort + '/'
			+ this.filters.date + '/'
			+ page.toString()
		console.log(uri)
		getRequest(this.props.authorizationHeader, uri)
			.then((data) => {
				this.setState({
					data: this.filterSection.concat(data.data),
					loading: false,
					refreshing: false,
				})
				if (errorLoading) {
					var freshData
					for (var i = 0; i < data.data.length; i++) {
						if (data.data[i].id == navigation.state.params.album_id) {
							freshData = data.data[i]
							break
						}
					}
					setTimeout(() => {
						this.goIndex(pos)
					}, 500)
					this.props.navigation.navigate('Post', {
						images: navigation.state.params.images,
						album_id: navigation.state.params.album_id,
						all: freshData,
						info: navigation.state.params.info,
						refresh: navigation.state.params.refresh,
					})
				}
			})
	}

	updateFilters = (_filters) => {
		this.filters = _filters
	}

	getFilters = () => {
		return this.filters
	}

	setHidden = (_hidden) => {
		this.filterSectionStatus = _hidden
	}

	getHidden = () => {
		return this.filterSectionStatus
	}

	handleRefresh = (errorLoading, navigation, pos) => {
		this.setState(
			{
				data: [],
				refreshing: true,
			}, () => {
				this.makeRemoteRequest(errorLoading, navigation, pos)
			}
		)
	}

	goIndex = (pos) => {
		this.flatListRef.scrollToOffset({ animated: false, offset: pos });
	}

	handleScroll = (event) => {
		this.setState({ scrollPosition: event.nativeEvent.contentOffset.y })
	}

	render() {
		return (
			<SafeAreaView style={styles.container} >
				<FlatList
					ref={(ref) => { this.flatListRef = ref; }}
					onScroll={(event) => { this.handleScroll(event) }}
					data={this.state.data}
					renderItem={({ item }) => <Item
						title={item.title}
						all={item}
						images={item.images}
						album_id={item.id}
						navigation={this.props.navigation}
						header={this.props.authorizationHeader}
						refresh={this.handleRefresh.bind(this)}
						scrollPosition={this.state.scrollPosition}
						info={this.props} />}
					keyExtractor={item => item.id}
					refreshing={this.state.refreshing}
					onRefresh={this.handleRefresh}
					onEndReachedThreshold={0.5}
					onEndReached={({ distanceFromEnd }) => {
						page++
						console.log('On affiche la page suivante n°', page.toString())
						getRequest(this.props.authorizationHeader, 'https://api.imgur.com/3/gallery/top/viral/all/' + page.toString()).then((data) => {
							this.setState({
								loading: true, data: this.state.data.concat(data.data)
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