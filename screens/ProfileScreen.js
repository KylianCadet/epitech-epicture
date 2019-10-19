import React from 'react';
import { View, StyleSheet, Text, Image, ImageBackground, SafeAreaView, Button, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { FlatList } from 'react-native-gesture-handler';
import ClickableButtonLine from '../components/ClickableButtonLine'
import FitButton from '../components/FitButton'
import NotLoginView from '../components/NotLoginView.js'
import { fetchAuthorization, fetchBearer, getAccountBase } from '../components/customFetch'
import { Item } from '../components/ProfileItem'
import Colors from '../constants/Colors';


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
			isLoadding: true,
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
	async getPosts() {
		const uri = 'https://api.imgur.com/3/account/me/items/newest'
		const data = await fetchBearer(uri, this.props.token)
		var allData = []
		for (var i = 0; i != data.data.length; i++)
			allData.push({
				'id': data.data[i].id,
				'image': data.data[i],
			})
		this.setData(allData)
	}
	getFavorites() {
		const uri = 'https://api.imgur.com/3/account/' + this.props.username + '/favorites/'
		fetchBearer(uri, this.props.token).then((data) => {
			var allData = []
			for (var i = 0; i != data.data.length; i++)
				allData.push({
					'id': data.data[i].id.toString(),
					'image': data.data[i],
				})
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
	Banner(username, cover, avatar, bio, navigate) {
		return (
			<View style={{ flex: 1, backgroundColor: 'white' }}>
				<ImageBackground source={{ uri: cover }} style={{ flex: 1, width: null, height: 200 }}>
					<View style={{ flexDirection: 'row', flex: 1 }}>
						<Text style={{ flex: 1, marginBottom: 'auto', marginRight: 'auto', paddingTop: 20, paddingLeft: 20, fontSize: 20, color: 'white' }}>{username}</Text>
						<Image source={{ uri: avatar }} style={{ height: 100, width: 100, marginBottom: 'auto', paddingTop: 10 }} />
						<TouchableOpacity onPress={() => navigate('Settings', {
							username: username,
							cover: cover,
							avatar: avatar,
							bio: bio,
							refresh: this.refresh.bind(this)
						})}>
							<Image source={require('../assets/images/dotIcon.png')} style={{width:40, height:40, resizeMode:'contain'}}></Image>
						</TouchableOpacity>
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
	_init(username) {
		const account_username = username ? username : this.props.username
		getAccountBase(account_username).then((data) => {
			const cover = data.data.cover
			const avatar = data.data.avatar
			const bio = data.data.bio
			this.setState({
				data: [
					{ id: 'banner', data: this.Banner(account_username, cover, avatar, bio, this.props.navigation.navigate) },
					{ id: 'pannel', data: this.Pannel() },
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

	refresh(username = this.props.username) {
		this._init(username)
	}
	_logged() {
		const { navigate } = this.props.navigation
		if (this.props.isLogged) {
			if (this.state.data[0].id == '0')
				this._init()
			return (
				<SafeAreaView>
					<FlatList
						data={this.state.data}
						extraData={this.state.data}
						renderItem={({ item }) =><Item image={item.image} data={item.data} comment={item.comment} navigate={navigate} refresh={this.refresh.bind(this)}/>}
						keyExtractor={item => item.id}
						stickyHeaderIndices={this.state.stickyHeaderIndices}>
					</FlatList>
				</SafeAreaView>
			)
		}
	}
	_guest() {
		if (!this.props.isLogged) {
			return (
				<NotLoginView navigation={this.props.navigation} refresh={this.refresh.bind(this)} />
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
		isLogged: state.isLogged,
		token: state.token,
		username: state.username,
		authorizationHeader: state.authorizationHeader
	}
}

ProfileScreen.navigationOptions = {
	header: null,
};


export default connect(mapStateToProps)(ProfileScreen)


const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.backgroundColor,
	},
	itemContainer: {
		flex: 1,
		backgroundColor: Colors.backgroundColor
	}
});
