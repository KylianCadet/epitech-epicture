import React from 'react';
import TouchableImage from '../components/ImageT'
import TouchableVideo from '../components/VideoT'
import { getRequest, numberWithCommas } from '../screens/HomeScreen'
import Video from 'react-native-video';
import {
	ScrollView,
	StyleSheet,
	Text,
	SafeAreaView,
	FlatList,
	Dimensions,
	View,
	Image,
} from 'react-native';

function DisplayGifComment({ gifLink, item, dim, author, date }) {
	var platform = item.platform.charAt(0).toUpperCase() + item.platform.slice(1);
	var id = gifLink.substr(gifLink.length - 11).substr(0, gifLink.length - 4)
	id = id.substr(0, id.length - 4)
	return (
		<View style={[styles.comment, { marginHorizontal: dim.box }]}>
			<View style={{ flexDirection: 'row' }}>
				<Text style={styles.nickname}>
					<Text style={{ fontWeight: 'bold', color: '#FFF' }}>{author}</Text>
					<Text style={{}}> via </Text>
					<Text style={{ color: '#7789ff' }}>{platform}</Text>
				</Text>
				<Text style={styles.nickname}>{numberWithCommas(item.points)} pts</Text>
				<Text style={styles.nickname}>{date}</Text>
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
		<View style={[styles.comment, { marginHorizontal: dim.box }]}>
			<View style={{ flexDirection: 'row' }}>
				<Text style={styles.nickname}>
					<Text style={{ fontWeight: 'bold', color: '#FFF' }}>{author}</Text>
					<Text style={{}}> via </Text>
					<Text style={{ color: '#7789ff' }}>{platform}</Text>
				</Text>
				<Text style={styles.nickname}>{item.points} pts</Text>
				<Text style={styles.nickname}>{date}</Text>
			</View>
			<Text style={styles.text}>{item.comment}</Text>
		</View>
	);
}

function setDisplayTime(datetime) {
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

function DisplayComment({ item, dim }) {
	var date = setDisplayTime(item.datetime)
	var author = item.author
	if (author.length > 15)
		author = author.substr(0, 15)
	var gifLink = urlify(item.comment)
	if (gifLink != 'undefined' && gifLink.substr(0, 4) === 'http' && (
		gifLink.substr(gifLink.length - 4) === 'gifv' ||
		gifLink.substr(gifLink.length - 4) === '.gif' ||
		gifLink.substr(gifLink.length - 4) === '.png' ||
		gifLink.substr(gifLink.length - 4) === '.jpg')) {
		if (gifLink.substr(gifLink.length - 4) === 'gifv')
			gifLink = gifLink.substr(0, gifLink.length - 1)
		// console.log(author + ' : ' + gifLink)
		return (DisplayGifComment({ gifLink, item, dim, author, date }))
	} else {
		return (DisplayTextComment({ item, dim, author, date }))
	}
}

function DisplayTitle(title) {
	return (
		<View>
			<Text style={styles.title}>{title}</Text>
		</View>
	);
}

function DisplayVideo({ item, dim }) {
	return (
		<Video
			style={[styles.img, { width: dim.width, height: dim.height }]}
			source={{ uri: item.link }}
			resizeMode={"cover"}
			repeat={true}
		/>
	);
}

function DisplayImage({ item, dim }) {
	return (
		<Image
			style={[styles.img, { width: dim.width, height: dim.height }]}
			source={{ uri: item.link }}
		/>
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
		</View>
	);
}

function setDimensions(item) {
	var newheight = Dimensions.get('window').width * item.height / item.width * 0.9
	var newwidth = Dimensions.get('window').width * 0.9
	var boxwidth = (Dimensions.get('window').width - newwidth) / 2
	return ({ width: newwidth, height: newheight, box: boxwidth })
}

function Item({ item, title }) {
	if (item.id === '0')
		return (DisplayTitle(title))
	if (typeof item === 'undefined' || item === null) { return null }
	var dim = setDimensions(item)
	if (item.comment)
		return (DisplayComment({ item, dim }))
	else if (
		item.type === 'video/mp4' ||
		item.type === 'image/png' ||
		item.type === 'image/gif' ||
		item.type === 'image/jpeg')
		return (DisplayMedia({ item, dim }))
	else {
		console.log('Unknow item : ' + item)
		return (null)
	}
}

export default class PostScreen extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			data: [
				{ id: '0' },
			],
			title: null,
			finishLoading: false
		}
	}
	componentDidMount() {
		getRequest('https://api.imgur.com/3/gallery/album/' + this.props.navigation.state.params.album_id).then((newData) => {
			this.setState({
				finishLoading: true,
				data: [this.state.data[0]]
			}, () => {
				this.setState({
					data: this.state.data.concat(newData.data.images),
					title: newData.data.title,
				})
			})
		}).then(() =>
			getRequest('https://api.imgur.com/3/gallery/' + this.props.navigation.state.params.album_id + '/comments/best').then((newData) => {
				this.setState({
					data: this.state.data.concat(newData.data),
				})
			})
		)
		for (var i = 0; i < this.state.data.length; i++) {
			this.state.data[i].id = i.toString()
		}
	}
	render() {
		return (
			<SafeAreaView style={styles.container} >
				<FlatList
					data={this.state.data}
					renderItem={({ item }) => <Item item={item} title={this.state.title} />}
					keyExtractor={item => item.id.toString()}
				/>
			</SafeAreaView >
		);
	}
}

PostScreen.navigationOptions = {
	title: 'Home',
};

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
		backgroundColor: '#424B54',
		marginVertical: 20,
		shadowColor: '#000000',
		shadowOffset: {
			width: 0,
			height: 3
		},
		shadowRadius: 5,
		shadowOpacity: 1,
	},
	comment: {
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
		marginTop: 10,
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
});