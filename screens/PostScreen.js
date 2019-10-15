import React from 'react';
import TouchableImage from '../components/ImageT'
import SimpleImage from '../components/ImageT'
import TouchableVideo from '../components/VideoT'
import SimpleVideo from '../components/VideoT'
import { getRequest } from '../screens/HomeScreen'
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

var titleStatus = false

function urlify(text) {
	var urlRegex = /(http?:\/\/[^\s]+ )/g;
	return text.replace(urlRegex, function (url) {
		return url;
	})
}

function Item({ item, title }) {
	if (item.id === '0')
		return (
			<View>
				<Text style={styles.title}>{title}</Text>
			</View>
		);
	if (typeof item === 'undefined' || item === null) { return null }
	var newheight = Dimensions.get('window').width * item.height / item.width * 0.9
	var newwidth = Dimensions.get('window').width * 0.9
	var boxwidth = (Dimensions.get('window').width - newwidth) / 2
	if (item.comment) {
		var author = item.author
		var platform = item.platform.charAt(0).toUpperCase() + item.platform.slice(1);
		const comment_time = new Date(item.datetime * 1000)
		var display_time = comment_time.toString().split(' ')
		display_time.pop()
		display_time.pop()
		display_time.pop()
		display_time.shift()
		display_time = display_time.join(' ')
		if (author.length > 15)
			author = author.substr(0, 15)
		var mygif = urlify(item.comment)
		if (mygif != 'undefined' && mygif.substr(0, 4) === 'http' && (
			mygif.substr(mygif.length - 4) === 'gifv' ||
			mygif.substr(mygif.length - 4) === '.gif' ||
			mygif.substr(mygif.length - 4) === '.png' ||
			mygif.substr(mygif.length - 4) === '.jpg'
		)) {
			if (mygif.substr(mygif.length - 4) === 'gifv') {
				mygif = mygif.substr(0, mygif.length - 1)
			}
			// console.log(author + ' : ' + mygif)
			return (
				<View style={[styles.comment, { marginHorizontal: boxwidth }]}>
					<View style={{ flexDirection: 'row' }}>
						<Text style={styles.nickname}>
							<Text style={{ fontWeight: 'bold', color: '#FFF' }}>{author}</Text>
							<Text style={{}}> via </Text>
							<Text style={{ color: '#7789ff' }}>{platform}</Text>
						</Text>
						<Text style={styles.nickname}>{item.points} pts</Text>
						<Text style={styles.nickname}>{display_time}</Text>
					</View>
					<Image
						style={[styles.img, {
							width: newwidth - 30,
							height: 300,
							marginTop: 5,
							marginBottom: 15,
							marginHorizontal: 15
						}]}
						source={{ uri: mygif }}
					/>
				</View>
			);
		} else {
			return (
				<View style={[styles.comment, { marginHorizontal: boxwidth }]}>
					<View style={{ flexDirection: 'row' }}>
						<Text style={styles.nickname}>
							<Text style={{ fontWeight: 'bold', color: '#FFF' }}>{author}</Text>
							<Text style={{}}> via </Text>
							<Text style={{ color: '#7789ff' }}>{platform}</Text>
						</Text>
						<Text style={styles.nickname}>{item.points} pts</Text>
						<Text style={styles.nickname}>{display_time}</Text>
					</View>
					<Text style={styles.text}>{item.comment}</Text>
				</View>
			);
		}
	}
	if (item.type === 'video/mp4') {
		return (
			<View elevation={7.5} style={[styles.item, { marginHorizontal: boxwidth }]}>
				<Video
					style={[styles.img, { width: newwidth, height: newheight }]}
					source={{ uri: item.link }}
					resizeMode={"cover"}
					repeat={true}
				/>
			</View>
		);
	} else {
		return (
			<View elevation={7.5} style={[styles.item, { marginHorizontal: boxwidth }]}>
				<Image
					style={[styles.img, { width: newwidth, height: newheight }]}
					source={{ uri: item.link }}
				/>
			</View>
		);
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
		backgroundColor: '#2E2F34',
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
		backgroundColor: '#424B54',
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