import React from 'react'
import { View, Text, SafeAreaView, StyleSheet, FlatList, Image, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import Color from '../constants/Colors'
import { fetchBearer } from '../components/customFetch'
import { DisplayComment, DisplayGifComment, DisplayTextComment, setDisplayTime, urlify } from '../screens/PostScreen'


function setDimensions(item) {
	var newheight = Dimensions.get('window').width * item.height / item.width * 0.9
	var newwidth = Dimensions.get('window').width * 0.9
	var boxwidth = (Dimensions.get('window').width - newwidth) / 2
	return ({ width: newwidth, height: newheight, box: boxwidth })
}

function MyImage({ image }) {
	const dim = setDimensions(image)
	return (
		<View style={{ justifyContent: 'center' }}>
			<Image
				source={{ uri: image.link }}
				style={{ width: dim.width, height: dim.height, borderRadius: 10 }}
			/>
		</View>
	)
}
function Item({ image, comment }) {
	var newwidth = Dimensions.get('window').width * 0.9
	var boxwidth = (Dimensions.get('window').width - newwidth) / 2
	return (
		<View elevation={7.5} style={[styles.item, { marginHorizontal: boxwidth }]}>
			{image ? (<MyImage image={image} />) : (<DisplayComment item={comment} dim={boxwidth} />)}
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
	}
	async componentDidMount() {
		this.image = this.props.navigation.state.params.image
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
			<View style={styles.constainer}>
				<SafeAreaView>
					<FlatList
						data={this.state.data}
						renderItem={({ item }) => <Item image={item.image} comment={item.comment} />}
						keyExtractor={item => item.id.toString()}
					/>
				</SafeAreaView >
			</View>
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
	constainer: {
		backgroundColor: Color.backgroundColor,
		flex: 1
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
})