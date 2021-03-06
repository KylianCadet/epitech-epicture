import React from 'react';
import TouchableImage from '../components/ImageT'
import TouchableVideo from '../components/VideoT'
import PageActionBar from '../components/PageActionBar'
import CommentSection from '../components/CommentSection'
import { getRequest, numberWithCommas } from '../screens/HomeScreen'
import { connect } from 'react-redux'
import Video from 'react-native-video'
import SettingPannel from '../components/SettingPannel'

import {
	ScrollView,
	StyleSheet,
	Text,
	SafeAreaView,
	FlatList,
	Dimensions,
	View,
	Image,
	TouchableOpacity,
	Button,
	Alert
} from 'react-native';

function DisplayGifComment({ gifLink, item, dim, author, date }) {
	var platform = item.platform.charAt(0).toUpperCase() + item.platform.slice(1);
	var id = gifLink.substr(gifLink.length - 11).substr(0, gifLink.length - 4)
	id = id.substr(0, id.length - 4)
	return (
		<View style={[styles.commentItem, { marginHorizontal: dim.box }]}>
			<View style={{ flexDirection: 'row' }}>
				<Text style={[styles.nickname, { flex: 2 }]}>
					<Text style={{ fontWeight: 'bold', color: '#FFF' }}>{author}</Text>
					<Text style={{}}> via </Text>
					<Text style={{ color: '#7789ff' }}>{platform}</Text>
				</Text>
				<Text style={[styles.nickname, { flex: 1 }]}>{item.points} pts</Text>
				<Text style={[styles.nickname, { flex: 1 }]}>{date}</Text>
			</View>
			<Image
				style={[styles.img, {
					width: dim.width - 30,
					height: 300,
					marginTop: 5,
					marginBottom: 15,
					marginHorizontal: 15
				}]}
				source={{ uri: gifLink }}
			/>
		</View>
	);
}

function DisplayTextComment({ item, dim, author, date }) {
	var platform = item.platform.charAt(0).toUpperCase() + item.platform.slice(1);
	return (
		<View style={[styles.commentItem, { marginHorizontal: dim.box }]}>
			<View style={{ flexDirection: 'row' }}>
				<Text style={[styles.nickname, { flex: 2 }]}>
					<Text style={{ fontWeight: 'bold', color: '#FFF' }}>{author}</Text>
					<Text style={{}}> via </Text>
					<Text style={{ color: '#7789ff' }}>{platform}</Text>
				</Text>
				<Text style={[styles.nickname, { flex: 1 }]}>{item.points} pts</Text>
				<Text style={[styles.nickname, { flex: 1 }]}>{date}</Text>
			</View>
			<Text style={styles.text}>{item.comment}</Text>
		</View>
	);
}

export function setDisplayTime(datetime) {
	const time = new Date(datetime * 1000)
	var date = time.toString().split(' ')
	date.pop()
	date.pop()
	date.pop()
	date.shift()
	date = date.join(' ')
	return (date)
}

function urlify(text) {
	var urlRegex = /(http?:\/\/[^\s]+ )/g;
	return text.replace(urlRegex, function (url) {
		return url;
	})
}

export function DisplayComment({ item, dim }) {
	var date = setDisplayTime(item.datetime)
	var author = item.author
	if (author.length > 10)
		author = author.substr(0, 10)
	var gifLink = urlify(item.comment)
	if (gifLink != 'undefined' && gifLink.substr(0, 4) === 'http' && (
		gifLink.substr(gifLink.length - 4) === 'gifv' ||
		gifLink.substr(gifLink.length - 4) === '.gif' ||
		gifLink.substr(gifLink.length - 4) === '.png' ||
		gifLink.substr(gifLink.length - 4) === '.jpg')) {
		if (gifLink.substr(gifLink.length - 4) === 'gifv')
			gifLink = gifLink.substr(0, gifLink.length - 1)
		return (DisplayGifComment({ gifLink, item, dim, author, date }))
	} else {
		return (DisplayTextComment({ item, dim, author, date }))
	}
}

function DisplayVideo({ item, dim }) {
	return (
		<View style={styles.img}>
			<Video
				style={{ width: dim.width, height: dim.height }}
				source={{ uri: item.link }}
				resizeMode={"cover"}
				repeat={true}
			/>
		</View>
	);
}

function DisplayImage({ item, dim }) {
	return (
		<View style={styles.img}>
			<Image
				style={{ width: dim.width, height: dim.height }}
				source={{ uri: item.link }}
			/>
		</View>
	);
}

function DisplayMedia({ item, dim }) {
	return (
		<View elevation={7.5} style={[styles.item, { marginHorizontal: dim.box }]}>
			{
				item.type === 'video/mp4'
					?
					(DisplayVideo({ item, dim }))
					:
					(DisplayImage({ item, dim }))
			}
			<Text style={[styles.text, { marginTop: 10 }]}>{item.description}</Text>
		</View>
	);
}

export function setDimensions(item) {
	var newheight = Dimensions.get('window').width * item.height / item.width * 0.9
	var newwidth = Dimensions.get('window').width * 0.9
	var boxwidth = (Dimensions.get('window').width - newwidth) / 2
	return ({ width: newwidth, height: newheight, box: boxwidth })
}

function DisplayTitle(item, title, dim, info, header) {
	if (item.all.points == undefined) {
		item.all.points = '0'
	} // image ou album privé
	return (
		<View style={[styles.item, { marginHorizontal: dim.box, marginTop: 20 }]}>
			{info.username == item.all.account_url ? (
				<SettingPannel info={info} item={item} hidden={item.all.privacy == 'hidden' ? true : false} />
			) : (<View></View>)}
			<Text style={styles.title}>{title}</Text>
			<View style={styles.infoLine}>

				<View style={{ flexDirection: 'row', flex: 8 }}>
					<Text style={styles.whiteS}>by </Text>
					<Text style={[styles.whiteS, { fontWeight: 'bold', color: '#FFF' }]}>{item.all.account_url.substr(0, 12)}</Text>
				</View>
				<View style={{ flexDirection: 'row', flex: 8 }}>
					<Text style={styles.whiteS}>{numberWithCommas(item.all.points)} Points</Text>
				</View>
				<Text style={[styles.whiteS, { flex: 4.5 }]}>{setDisplayTime(item.all.datetime)}</Text>
			</View>
		</View>
	)
}

function DisplayActionBar(item) {
	var newwidth = Dimensions.get('window').width * 0.9
	var boxwidth = (Dimensions.get('window').width - newwidth) / 2
	return (
		<View style={[styles.actionBar, { marginHorizontal: boxwidth }]}>
			{item.isLogged
				?
				(<PageActionBar
					skinUp={require('../assets/images/up.png')}
					skinPressUp={require('../assets/images/up_green.png')}
					countUp={item.all.ups}
					skinDown={require('../assets/images/down.png')}
					skinPressDown={require('../assets/images/down_red.png')}
					countDown={item.all.downs}
					skinLike={require('../assets/images/like.png')}
					skinPressLike={require('../assets/images/like_cyan.png')}
					countLike={item.all.favorite_count}
					skinComment={require('../assets/images/comment.png')}
					countComment={item.all.comment_count}
					skinTrophee={require('../assets/images/trophee.png')}
					skinView={require('../assets/images/view.png')}
					countView={item.all.views}
					vote={item.all.vote}
					fav={item.all.favorite}
					id={item.all.id}
					header={item.header}
				/>) : (<View></View>)}
		</View>
	)
}

function DisplayCommentSection(item) {
	if (item.isLogged)
		return (
			<CommentSection
				id={item.albumId}
				token={item.token}
				navigation={item.navigation}
			/>
		)
	else
		return (<View></View>)
}

function Item({ item, title, info, header }) {
	if (typeof item === 'undefined' || item === null) { return null }
	var dim = setDimensions(item)
	if (item.id === '0') {
		return (DisplayTitle(item, title, dim, info, header))
	}
	if (item.transition) {
		return (DisplayActionBar(item, info, header))
	}
	if (item.commentSection) {
		return (DisplayCommentSection(item, info, header))
	}
	if (item.comment) {
		return (DisplayComment({ item, dim }))
	}
	else if (
		item.type === 'video/mp4' ||
		item.type === 'image/png' ||
		item.type === 'image/gif' ||
		item.type === 'image/jpeg') {
		return (DisplayMedia({ item, dim }))
	}
	else {
		console.log('Unknow item : ')
		console.log(item)
		return (null)
	}
}

class PostScreen extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			data: [
				{
					id: '0',
					all: this.props.navigation.state.params.all,
					info: this.props,
				},
			],
			transition: [
				{
					id: 'transition',
					transition: true,
					all: this.props.navigation.state.params.all,
					header: this.props.authorizationHeader,
					isLogged: this.props.isLogged,
				},
			],
			commentSection: [
				{
					id: 'commentSection',
					commentSection: true,
					albumId: this.props.navigation.state.params.album_id,
					token: this.props.token,
					isLogged: this.props.isLogged,
					navigation: this.props.navigation,
				},
			],
			title: null,
			finishLoading: false,
			header: this.props.authorizationHeader,
		}
	}
	handleError = (data) => {
		if (data == undefined) { return true }
		if (data.data.error != undefined) {
			console.log('Error : ' + data.data.error)
			return true
		}
		return false
	}
	async componentDidMount() {
		const gallery_uri = 'https://api.imgur.com/3/gallery/album/' + this.props.navigation.state.params.album_id
		const account_gallery_uri = 'https://api.imgur.com/3/account/' + this.props.username + '/album/' + this.props.navigation.state.params.album_id
		var data
		if (this.props.isLogged)
			data = await getRequest(this.state.header, account_gallery_uri)
		else
			data = await getRequest(this.state.header, gallery_uri)
		if (this.handleError(data)) {
			this.props.navigation.goBack()
			this.props.navigation.state.params.refresh(true, this.props.navigation, this.props.navigation.state.params.scrollPosition)
			return
		}
		this.setState({
			finishLoading: true,
			data: [this.state.data[0]]
		}, () => {
			this.setState({
				data: this.state.data.concat(data.data.images),
				title: data.data.title,
			})
		})
		data = await getRequest(this.state.header, 'https://api.imgur.com/3/gallery/' + this.props.navigation.state.params.album_id + '/comments/best')
		if (data.success)
			this.setState({
				data: this.state.data.concat(this.state.transition[0]).concat(this.state.commentSection[0]).concat(data.data),
			})
		for (var i = 0; i < this.state.data.length; i++) {
			this.state.data[i].id = i.toString()
		}
		this.refresh = this.props.navigation.state.params.refresh
		// this.refresh()
	}
	render() {
		return (
			<SafeAreaView style={styles.container} >
				<FlatList
					data={this.state.data}
					renderItem={({ item }) =>
						<Item
							item={item}
							title={this.state.title}
							info={this.props}
							header={this.state.header}
						/>}
					keyExtractor={item => item.id.toString()}
				/>
			</SafeAreaView >
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

export default connect(mapStateToProps)(PostScreen)

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#141518',
		// backgroundColor: '#2E2F34',
	},
	img: {
		borderRadius: 10,
	},
	item: {
		borderRadius: 10,
		paddingBottom: 10,
		// backgroundColor: '#424B54',
		backgroundColor: '#2c2f34',
		marginVertical: -5,
		shadowColor: '#000000',
		shadowOffset: {
			width: 0,
			height: 3
		},
		shadowRadius: 5,
		shadowOpacity: 1,
	},
	commentItem: {
		borderRadius: 10,
		// backgroundColor: '#424B54',
		backgroundColor: '#2c2f34',
		marginVertical: 10,
		shadowColor: '#000000',
		shadowOffset: {
			width: 0,
			height: 3
		},
		shadowRadius: 5,
		shadowOpacity: 1,
	},
	title: {
		fontWeight: 'bold',
		textAlign: 'center',
		fontSize: 25,
		color: '#FFFFFF',
		padding: 15,
	},
	nickname: {
		fontSize: 12,
		color: '#BBBBBB',
		marginTop: 10,
		marginHorizontal: 12,
		marginBottom: 5,
	},
	text: {
		fontSize: 14,
		color: '#FFFFFF',
		marginBottom: 12,
		marginHorizontal: 12,
	},
	infoLine: {
		marginHorizontal: 15,
		// marginBottom: 5,
		paddingBottom: 10,
		flex: 1,
		flexDirection: 'row',
	},
	whiteS: {
		fontSize: 12,
		marginTop: 0,
		color: '#bbb',
	},
	actionBar: {
		borderBottomLeftRadius: 10,
		borderBottomRightRadius: 10,
		paddingBottom: 10,
		marginBottom: 10,
		backgroundColor: '#2c2f34',
		marginVertical: -5,
		shadowColor: '#000000',
		shadowOffset: {
			width: 0,
			height: 3
		},
		shadowRadius: 5,
		shadowOpacity: 1,
	},
});