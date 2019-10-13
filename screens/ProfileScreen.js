import React from 'react';
import { View, StyleSheet, Text, Image, Button, ImageBackground, SafeAreaView } from 'react-native'
import { connect } from 'react-redux'
import { dispatch_function } from '../redux/reducers/index'
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import ClickableButtonLine from '../components/ClickableButtonLine'
import FitButton from '../components/FitButton'
import NotLoginView from '../components/NotLoginView.js'


const client_id = '38c6850ce6bd17c'

function Item({ val, data }) {
	if (!val) {
		return (
			<View style={styles.container}>
				{data}
			</View>
		)
	}
	return (
		<View>
			<Text>{val}</Text>
		</View>
	)
}


function getAccountBase(username) {
	return fetch("https://api.imgur.com/3/account/" + username, {
		headers: {
			'Authorization': 'Client-ID ' + client_id
		}
	})
		.then((response) => response.json())
		.catch((error) => console.error(error))
}
function Banner(username, cover, avatar, bio) {
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

function Pannel() {
	return (
		<View style={{ flex: 1, backgroundColor: 'white' }}>
			<Text>PANNEL</Text>
		</View>
	)
}

class ProfileScreen extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			data: [
				{ key: 'banner', data: null, val: null },
				{ key: 'pannel', data: null, val: null },
			],
			stickyHeaderIndices: [1],
		}
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
					{ key: 'banner', data: Banner(this.props.username, cover, avatar, bio), val: null },
					{ key: 'pannel', data: Pannel(), val: null },
					{ key: 'a', data: null, val: '\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nkek' }
				],
			})
		})
	}

	_logged() {
		if (this.props.isLogged) {
			return (
				<SafeAreaView style={styles.container}>
					<FlatList
						data={this.state.data}
						extraData={this.state.data}
						renderItem={({ item }) => <Item val={item.val} data={item.data} />}
						keyExtractor={item => item.key}
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
			<View style={styles.container}>
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
});
