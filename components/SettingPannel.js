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
		this.hidden = this.props.hidden
	}
	async setTitle() {
		const response = await fetch('https://api.imgur.com/3/album/' + this.item.all.id, {
			method: 'put',
			headers: this.info.authorizationHeader,
			body: JSON.stringify({ title: this.text })
		})
		const data = await response.json()
		if (data.success) {
			console.log(data)
		} else {
			Alert.alert('An error occured')
			console.log(data)
		}
	}
	render() {
		return (
			<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
				<TextInput
					onChangeText={(text) => {
						this.text = text
					}}
					placeholder={'New Title'}
					style={{ flex: 1, height: 40, borderColor: 'black', borderWidth: 1, backgroundColor: 'gray', borderRadius: 10, marginRight: 20 }}
					onSubmitEditing={() => { this.setTitle() }}
				>
				</TextInput>
				<TouchableOpacity onPress={() => {
					console.log(this.item.all.id)
					fetch('https://imgur.com/gallery/action/delete_image/' + this.item.all.id, {
						method: 'post',
						headers: this.info.authorizationHeader

					})
						.then((response) => response.json())
						.then((data) => {
							console.log(data)
							this.setState({
								hidden: !this.state.hidden
							})
						})
				}}>
					{this.state.hidden ?
						(<Image style={{ flex: 1, height: 30, width: 30, marginRight: 10, borderWidth: 10, resizeMode: 'contain' }} source={require('../assets/images/eyeIcon.png')}></Image>)
						:
						(<Image style={{ flex: 1, height: 30, width: 30, marginRight: 10, borderWidth: 10, resizeMode: 'contain' }} source={require('../assets/images/eyeIconCrossed.png')}></Image>)
					}

				</TouchableOpacity>
				<TouchableOpacity onPress={() => {
					fetch('https://api.imgur.com/3/account/' + this.info.username + '/album/' + this.item.all.id, {
						method: 'delete',
						headers: this.info.authorizationHeader
					})
						.then((response) => response.json())
						.then((data) => {
							if (data.success) {
								Alert.alert('Album deleted')
								this.info.navigation.goBack()
							} else {
								Alert.alert('An error occured')
							}
						})
				}}>
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
