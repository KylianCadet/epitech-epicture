import React from 'react';
import { View, StyleSheet, Text, Image, Button, ImageBackground, SafeAreaView, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import { dispatch_function } from '../redux/reducers/index'
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import ClickableButtonLine from '../components/ClickableButtonLine'
import FitButton from '../components/FitButton'
import NotLoginView from '../components/NotLoginView.js'


const client_id = '38c6850ce6bd17c'

function Item({ link, data }) {
	if (!link) {
		return (
			<View style={styles.itemContainer}>
				{data}
			</View>
		)
	}
	return (
		<View style={styles.itemContainer}>
			<Image source={{ uri: link }} style={{ flex: 1, borderColor: '#595457', aspectRatio: 1, resizeMode: 'contain' }}></Image>
		</View>
	)
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
		data: <Text style={{ color: 'white', alignSelf:'center' }}>Nothing to display here</Text>
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
	getFollowing() {
		// const uri = 'https://api.imgur.com/3/tags'
		// fetchBearer(uri , this.props.token).then((data) => {
		// 	for (var i = 0; i != data.data.galleries.length; i++) {
		// 		console.log(data.data.galleries[i])
		// 	}
		// 	const allData = data.data
		// 	this.setData(allData)
		// })
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
				<ClickableButtonLine text='Following' style={{ backgroundColor: '#262525' }} textStyle={{ color: 'white' }} onPress={this.getFollowing.bind(this)}></ClickableButtonLine>
				<ClickableButtonLine text='Comments' style={{ backgroundColor: '#262525' }} textStyle={{ color: 'white' }}></ClickableButtonLine>
			</View>
		)
	}
	componentDidMount() {
		if (!this.props.isLogged)
			return
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

	_logged() {
		if (this.props.isLogged) {
			return (
				<SafeAreaView style={[styles.container]}>
					<FlatList
						style={{ flex: 1, backgroundColor: '#3a3739' }}
						data={this.state.data}
						extraData={this.state.data}
						renderItem={({ item }) => <Item link={item.link} data={item.data} />}
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
