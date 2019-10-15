import React from 'react';
import { View, StyleSheet, Text, Image, ImageBackground, SafeAreaView, TouchableHighlight } from 'react-native'
import { connect } from 'react-redux'
import { FlatList } from 'react-native-gesture-handler';
import ClickableButtonLine from '../components/ClickableButtonLine'
import FitButton from '../components/FitButton'
import NotLoginView from '../components/NotLoginView.js'


const client_id = '38c6850ce6bd17c'

function Item({ link, data, comment }) {
	if (data) {
		return (
			<View style={styles.itemContainer}>
				{data}
			</View>
		)
	}
	if (link) {
		return (
			<View style={styles.itemContainer}>
				<Image source={{ uri: link }} style={{ flex: 1, aspectRatio: 1, resizeMode: 'contain' }}></Image>
			</View>
		)
	}
	if (comment) {
		const comment_time = new Date(comment.datetime * 1000)
		var display_time = comment_time.toString().split(' ')
		display_time.pop()
		display_time.pop()
		display_time = display_time.join(' ')
		const upvote = comment.ups - comment.downs < 0 ? 0 : comment.ups - comment.downs
		return (
			<View>
				<TouchableHighlight onPress={() => console.log(comment.image_id)}>
					<View style={{ flexDirection: 'row' }}>
						<Image source={{ uri: comment.image_link }} style={{ marginBottom: 10, marginTop: 10, marginLeft: 10, width: 60, height: 60, resizeMode: 'contain' }}></Image>
						<View>
							<Text style={{ color: 'white', marginLeft: 10, marginTop: 20 }}>{comment.comment}</Text>
							<Text style={{ fontSize: 10, color: 'grey', marginLeft: 10 }}>{display_time}</Text>
							<View style={{ flexDirection: 'row' }}>
								<Image source={require('../assets/images/arrowIcon.png')} style={{ height: 7, width: 7, marginLeft: 10, marginTop: 5 }}></Image>
								<Text style={{ fontSize: 10, color: 'grey', marginLeft: 5 }}>{upvote}</Text>
							</View>
						</View>
					</View>
				</TouchableHighlight>
			</View>
		)
	}
	return (<View></View>)
}

function fetchBearer(uri, token) {
	return fetch(uri, {
		headers: {
			'Authorization': 'Bearer ' + token
		}
	})
		.then((response) => response.json())
		.catch((error) => console.error(error))
}

function fetchAuthorization(uri) {
	return fetch(uri, {
		headers: {
			'Authorization': 'Client-ID ' + client_id
		}
	})
		.then((response) => response.json())
		.catch((error) => console.error(error))
}

function getAccountBase(username) {
	const uri = "https://api.imgur.com/3/account/" + username
	return fetchAuthorization(uri)
}

function getEmptyDataBlock() {
	return ({
		id: 'empty',
		data: <Text style={{ color: 'white', alignSelf: 'center' }}>Nothing to display here</Text>
	})
}

class ProfileScreen extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			data: [{ id: '0' }, { id: '1' }],
			stickyHeaderIndices: [1],
		}
	}
	setData(newData) {
		if (newData.length == 0) {
			newData[0] = getEmptyDataBlock()
		}
		this.setState({
			data: [this.state.data[0], this.state.data[1]]
		}, () => {
			this.setState({
				data: this.state.data.concat(newData)
			})
		})
	}
	getPosts() {
		const uri = 'https://api.imgur.com/3/account/' + this.props.username + '/images'
		fetchBearer(uri, this.props.token).then((data) => {
			const allData = data.data
			this.setData(allData)
		})
	}
	getFavorites() {
		const uri = 'https://api.imgur.com/3/account/' + this.props.username + '/favorites/'
		fetchBearer(uri, this.props.token).then((data) => {
			const allData = data.data
			this.setData(allData)
		})
	}
	async getComments() {
		const uri = 'https://api.imgur.com/3/account/' + this.props.username + '/comments/'
		const comment = await fetchBearer(uri, this.props.token)
		const comment_data = comment.data
		var allData = []
		for (var i = 0; i != comment_data.length; i++) {
			const album = await fetchAuthorization('https://api.imgur.com/3/album/' + comment_data[i]['image_id'] + '/images/')
			const image_link = album.data[0]['link']
			comment_data[i]['image_link'] = image_link
			allData.push({
				id: comment_data[i]['id'].toString(),
				comment: comment_data[i],
			})
		}
		this.setData(allData)
	}
	Banner(username, cover, avatar, bio) {
		return (
			<View style={{ flex: 1, backgroundColor: 'white' }}>
				<ImageBackground source={{ uri: cover }} style={{ flex: 1, width: null, height: 200 }}>
					<View style={{ flexDirection: 'row', flex: 1 }}>
						<Text style={{ flex: 1, marginBottom: 'auto', marginRight: 'auto', paddingTop: 20, paddingLeft: 20, fontSize: 20, color: 'white' }}>{username}</Text>
						<Image source={{ uri: avatar }} style={{ height: 100, width: 100, marginBottom: 'auto', paddingTop: 10 }} />
						<FitButton title='...' style={{ marginBottom: 'auto' }}></FitButton>
					</View>
					<Text style={{ flex: 1, paddingTop: 20, paddingLeft: 20, color: 'white' }}>{bio}</Text>
				</ImageBackground>
			</View >
		)
	}

	Pannel() {
		return (
			<View style={{ flex: 1, backgroundColor: 'white', flexDirection: 'row' }}>
				<ClickableButtonLine text='Posts' style={{ backgroundColor: '#262525' }} textStyle={{ color: 'white' }} onPress={this.getPosts.bind(this)}></ClickableButtonLine>
				<ClickableButtonLine text='Favorites' style={{ backgroundColor: '#262525' }} textStyle={{ color: 'white' }} onPress={this.getFavorites.bind(this)}></ClickableButtonLine>
				<ClickableButtonLine text='Comments' style={{ backgroundColor: '#262525' }} textStyle={{ color: 'white' }} onPress={this.getComments.bind(this)}></ClickableButtonLine>
			</View>
		)
	}
	_init() {
		getAccountBase(this.props.username).then((data) => {
			const cover = data.data.cover
			const avatar = data.data.avatar
			const bio = data.data.bio
			this.setState({
				data: [
					{ id: 'banner', data: this.Banner(this.props.username, cover, avatar, bio), val: null },
					{ id: 'pannel', data: this.Pannel(), val: null },
				],
			})
			this.getPosts()
		})
	}
	componentDidMount() {
		if (!this.props.isLogged)
			return
		this._init()
	}

	_logged() {
		if (this.props.isLogged) {
			if (this.state.data.length == 0)
				this._init()
			return (
				<SafeAreaView style={[styles.container]}>
					<FlatList
						style={{ flex: 1, backgroundColor: '#3a3739' }}
						data={this.state.data}
						extraData={this.state.data}
						renderItem={({ item }) => <Item link={item.link} data={item.data} comment={item.comment} />}
						keyExtractor={item => item.id}
						stickyHeaderIndices={this.state.stickyHeaderIndices}>
					</FlatList >
				</SafeAreaView>
			)
		}
	}
	_guest() {
		if (!this.props.isLogged) {
			return (
				<NotLoginView navigation={this.props.navigation} />
			)
		}
	}
	render() {
		return (
			<View style={[styles.container]}>
				{this._logged()}
				{this._guest()}
			</View>
		)
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

ProfileScreen.navigationOptions = {
	header: null,
};


export default connect(mapStateToProps)(ProfileScreen)


const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	itemContainer: {
		flex: 1,
		backgroundColor: '#3a3739'
	}
});
