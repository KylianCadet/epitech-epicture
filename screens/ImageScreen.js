import React from 'react'
import { View, Text, SafeAreaView, StyleSheet, FlatList } from 'react-native'
import { connect } from 'react-redux'
import Color from '../constants/Colors'
import { fetchBearer } from '../components/customFetch'

function Comment({ comment }) {
	console.log(comment.comment)
	return (<View><Text>{comment.comment}</Text></View>)
}

function Image({ image }) {
	console.log(image.link)
	return (<View><Text>IMAGE</Text></View>)
}
function Item({ image, comment }) {
	if (image) return <View><Text>IMAGE</Text></View>
	if (comment) return <View><Text>COMMENT</Text></View>
	return <View><Text>undefined</Text></View>
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
		console.log(this.state.data)
	}
	render() {
		return (
			<SafeAreaView style={styles.container} >
				<FlatList
					data={this.state.data}
					renderItem={({ item }) => <Item image={item.image} comment={item.comment} />}
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
	constainer: {
		backgroundColor: Color.backgroundColor,
		flex: 1
	}
})