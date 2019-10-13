// import * as WebBrowser from 'expo-web-browser';
import HomeImg from '../components/HomeImg'
import React from 'react';
import {
	Image,
	Platform,
	ScrollView,
	StyleSheet,
	SafeAreaView,
	FlatList,
	Text,
	TouchableOpacity,
	View,
	Dimensions,
	Button,
	Video,
} from 'react-native';

const client_id = '38c6850ce6bd17c'
const image_id = 'ycxqRdT'

function getRequest(url) {
	return fetch(url, {
		headers: {
			Authorization: 'Client-ID ' + client_id
		}
	})
		.then((response) => response.json())
		.catch((error) => console.error(error))
}

const DATA = [
	{
		id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
		title: 'First Item',
		url: 'https://pbs.twimg.com/profile_images/753905436143808512/fnLAowzK.jpg',
	},
	{
		id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
		title: 'Second Item',
		url: 'https://pbs.twimg.com/media/EElCb8XX4AI_kK_.jpg',
	},
	{
		id: '58694a0f-3da1-471f-bd96-145571e29d72',
		title: 'Third Item',
		url: 'https://gamepedia.cursecdn.com/lolesports_gamepedia_en/e/e7/GhxC6FRA.jpg',
	},
];

function Item({ title, url }) {
	if (typeof url === 'undefined' || url === null) { return null }
	var img = url[0]
	var newheight = Dimensions.get('window').width * img.height / img.width
	return (
		<View style={styles.item}>
			<HomeImg style={{ width: Dimensions.get('window').width, height: newheight }} source={img.link} />
			<Text style={styles.title}>{title}</Text>
		</View>
	);
}

class HomeScreen extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			data: null,
			finishLoading: false
		}
	}
	render() {
		getRequest('https://api.imgur.com/3/gallery/top/').then((data) => {
			this.setState({ finishLoading: true, data: data.data })
			// var image_array = data.data[0].images
			// console.log(image_array)
		})
		return (
			<SafeAreaView style={styles.container}>
				<FlatList
					data={this.state.data}
					renderItem={({ item }) => <Item title={item.title} url={item.images} />}
					keyExtractor={item => item.id}
				/>
			</SafeAreaView>
		);
	}
}

HomeScreen.navigationOptions = {
	header: null,
};

export default HomeScreen

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	item: {
		backgroundColor: '#414141',
		padding: 20,
		marginVertical: 8,
		marginHorizontal: 16,
	},
	title: {
		fontSize: 32,
		color: '#FFFFFF',
	},
});