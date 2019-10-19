import React from 'react'
import { View, Text, SafeAreaView, StyleSheet, FlatList, Image, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import Color from '../constants/Colors'
import { fetchBearer } from '../components/customFetch'
import SettingPannel from '../components/SettingPannel'
import { getRequest, numberWithCommas } from '../screens/HomeScreen'
import ImageSettingPannel from '../components/ImageSettingPannel'
import { DisplayComment, setDimensions, setDisplayTime } from '../screens/PostScreen'


function MyImage({ image, dim, info }) {
	return (
		<View>
			{info.username == image.account_url ? (
				<ImageSettingPannel info={info} image={image} />
			) : (<View></View>)}
			<View style={[styles.item, { marginHorizontal: dim.box, marginTop: 20 }]}>
				{image.title ? (<Text style={styles.title}>{image.title}</Text>) : (<Text style={styles.notitle}>No title</Text>)}
				<View style={styles.infoLine}>

					<View style={{ flexDirection: 'row', flex: 8 }}>
						<Text style={styles.whiteS}>by </Text>
						<Text style={[styles.whiteS, { fontWeight: 'bold', color: '#FFF' }]}>{image.account_url.substr(0, 12)}</Text>
					</View>
					<View style={{ flexDirection: 'row', flex: 8 }}>
						{image.points ? (<Text style={styles.whiteS}>{numberWithCommas(image.points)} Points</Text>) : (<View></View>)}
					</View>
					<Text style={[styles.whiteS, { flex: 4.5 }]}>{setDisplayTime(image.datetime)}</Text>
				</View>
			</View>
			<View style={{ justifyContent: 'center' }}>
				<Image
					source={{ uri: image.link }}
					style={{ width: dim.width, height: dim.height, borderRadius: 10 }}
				/>
			</View>
		</View>
	)
}

function Item({ image, comment, info, dim }) {
	return (
		<View style={[styles.item, { marginHorizontal: dim.box, marginTop: 20 }]}>
			{image ? (<MyImage image={image} dim={dim} info={info} />) : (<DisplayComment item={comment} dim={dim} />)}
		</View>
	)
}

class ImageScreen extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			data: []
		}
		this.image = null
		this.dim = null
	}
	async componentDidMount() {
		this.image = this.props.navigation.state.params.image
		this.dim = setDimensions(this.image)
		this.setState({
			data: [{ id: 'image', image: this.image }]
		})
		if (!this.image.in_gallery)
			return;
		const uri = 'https://api.imgur.com/3/gallery/' + this.image.id + '/comments/best/'
		const data = await fetchBearer(uri, this.props.token)
		var allData = []
		for (var i = 0; i != data.data.length; i++)
			allData.push({ id: data.data[i].id, comment: data.data[i] })
		this.setState({
			data: this.state.data.concat(allData)
		})
	}
	render() {
		return (
			<SafeAreaView style={styles.container}>
				<FlatList
					data={this.state.data}
					renderItem={({ item }) => <Item image={item.image} comment={item.comment} info={this.props} dim={this.dim} />}
					keyExtractor={item => item.id.toString()}
				/>
			</SafeAreaView >
		)
	}
}


function mapStateToProps(state) {
	return {
		isLogged: state.isLogged,
		token: state.token,
		username: state.username
	}
}

export default connect(mapStateToProps)(ImageScreen)

const styles = StyleSheet.create({
	container: {
		backgroundColor: Color.backgroundColor,
		flex: 1
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
	infoLine: {
		marginHorizontal: 15,
		// marginBottom: 5,
		paddingBottom: 10,
		flex: 1,
		flexDirection: 'row',
	},
	title: {
		fontWeight: 'bold',
		textAlign: 'center',
		fontSize: 25,
		color: '#FFFFFF',
		padding: 15,
	},
	notitle: {
		fontWeight: 'bold',
		textAlign: 'center',
		fontSize: 25,
		color: 'grey',
		padding: 15,
	},
	whiteS: {
		fontSize: 12,
		marginTop: 0,
		color: '#bbb',
	},
})