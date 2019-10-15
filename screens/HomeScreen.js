// import * as WebBrowser from 'expo-web-browser';
import TouchableImage from '../components/ImageT'
import TouchableVideo from '../components/VideoT'
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
} from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';

const client_id = '38c6850ce6bd17c'
var page = 0

export function getRequest(url) {
	return fetch(url, {
		headers: {
			Authorization: 'Client-ID ' + client_id
		}
	})
		.then((response) => response.json())
		.catch((error) => console.error(error))
}

function Item({ title, images, navigation, album_id }) {
	if (typeof images === 'undefined' || images === null) { return null }
	var img = images[0]
	var newheight = Dimensions.get('window').width * img.height / img.width * 0.825
	var newwidth = Dimensions.get('window').width * 0.825
	var boxwidth = (Dimensions.get('window').width - newwidth) / 2
	if (img.type === 'video/mp4') {
		return (
			<View elevation={7.5} style={[styles.item, { marginHorizontal: boxwidth }]}>
				<TouchableVideo
					style={[styles.image, { width: newwidth, height: newheight }]}
					source={img.link}
					navigation={navigation}
					album_id={album_id}
					images={images}
				/>
				<Text style={styles.title}>{title}</Text>
			</View>
		);
	} else {
		return (
			<View elevation={7.5} style={[styles.item, { marginHorizontal: boxwidth }]}>
				<TouchableImage
					style={[styles.image, { width: newwidth, height: newheight }]}
					source={img.link}
					navigation={navigation}
					album_id={album_id}
					images={images}
				/>
				<Text style={styles.title}>{title}</Text>
			</View>
		);
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
					renderItem={({ item }) => <Item title={item.title} images={item.images} album_id={item.id} navigation={this.props.navigation} />}
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
		backgroundColor: '#2E2F34',
	},
	item: {
		borderRadius: 10,
		textAlign: 'center',
		backgroundColor: '#424B54',
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
	},
	image: {
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
	},
});