import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Image, TextInput, Alert } from 'react-native';

export default class UploadScreen extends React.Component {
	constructor(props) {
		super(props)
		this.info = null
		this.item = null
		this.text = ''
		this.state = {
			hidden: null
		}
	}
	componentDidMount() {
		this.info = this.props.info
		this.item = this.props.item
		this.setState({
			hidden: this.item.all.in_gallery ? false : true
		})
		this.refresh = this.props.info.navigation.state.params.refresh
	}
	async setTitle() {
		const response = await fetch('https://api.imgur.com/3/album/' + this.item.all.id, {
			method: 'put',
			headers: {
				'Authorization': 'Bearer ' + this.props.info.token,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ title: this.text })
		})
		const data = await response.json()
		if (data.success) {
			Alert.alert('Album name modified')
			this.refresh()
			this.info.navigation.goBack()
		} else {
			Alert.alert('An error occured')
			console.log(data)
		}
	}
	modifyHiddenState() {
		this.setState({
			hidden: !this.state.hidden
		})
	}
	async delete() {
		const response = await fetch('https://api.imgur.com/3/account/' + this.info.username + '/album/' + this.item.all.id, {
			method: 'delete',
			headers: this.info.authorizationHeader
		})
		const data = await response.json()
		if (data.success) {
			Alert.alert('Album deleted')
			this.refresh()
			this.info.navigation.goBack()
		} else {
			Alert.alert('An error occured')
		}
	}
	async setVisibilityTrue() {
		console.log("going to share image")
		const response = await fetch('https://imgur.com/ajax/share', {
			method: 'post',
			headers: {
				'Authorization': 'Bearer ' + this.props.info.token,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ hash: this.item.all.id, title: this.item.all.title.replace(/ /g, '+'), is_album: 1, mature: 0 })
		})
		const data = await response.json()
		if (data.success) {
			this.modifyHiddenState()
			this.refresh()
			Alert.alert('Image is now public')
		} else {
			Alert.alert('An error occurred', data.data.error.message)
			console.log(data)
		}
	}
	async setVisibilityFalse() {
		const response = await fetch('https://imgur.com/gallery/action/delete_image/' + this.item.all.id, {
			method: 'post',
			headers: this.info.authorizationHeader,
			body: JSON.stringify({sid: '7e4b4b793439dbb0f5e52a5ce06ac092'})
		})
		console.log(response)
		this.modifyHiddenState()
		Alert.alert('Album is now private')
	}
	async setVisibility() {
		if (this.state.hidden)
			this.setVisibilityTrue()
		else
			this.setVisibilityFalse()
	}
	render() {
		return (
			<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
				<TextInput
					onChangeText={(text) => {
						this.text = text
					}}
					placeholder={'New Title'}
					style={{ flex: 1, height: 40, borderColor: 'black', borderWidth: 1, backgroundColor: '#FFFF', borderRadius: 10, marginRight: 20, textAlign: 'center' }}
					onSubmitEditing={() => { this.setTitle() }}
				>
				</TextInput>
				<TouchableOpacity onPress={() => { this.setVisibility() }}>

					{this.state.hidden ?
						(<Image style={{ flex: 1, height: 30, width: 30, marginRight: 10, borderWidth: 10, resizeMode: 'contain' }} source={require('../assets/images/eyeIcon.png')}></Image>)
						:
						(<Image style={{ flex: 1, height: 30, width: 30, marginRight: 10, borderWidth: 10, resizeMode: 'contain' }} source={require('../assets/images/eyeIconCrossed.png')}></Image>)
					}

				</TouchableOpacity>
				<TouchableOpacity onPress={() => { this.delete() }}>
					<Image style={{ flex: 1, height: 30, width: 30, marginRight: 10, borderWidth: 10, resizeMode: 'contain' }} source={require('../assets/images/trashIcon.png')} />
				</TouchableOpacity>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
});
