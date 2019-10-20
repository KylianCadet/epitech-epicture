import React from 'react'
import { View, TextInput, TouchableOpacity, Image, Alert } from 'react-native'
import Colors from '../constants/Colors'

class ImageSettingPannel extends React.Component {
	constructor(props) {
		super(props)
		this.info = null
		this.image = null
		this.text = ''
	}
	componentDidMount() {
		this.info = this.props.info
		this.image = this.props.image
		this.refresh = this.props.info.navigation.state.params.refresh
	}

	async setTitle() {
		const response = await fetch('https://api.imgur.com/3/image/' + this.image.id, {
			method: 'post',
			headers: {
				'Authorization': 'Bearer ' + this.props.info.token,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ title: this.text })
		})
		const data = await response.json()
		if (data.success) {
			Alert.alert('Image name modified')
			this.refresh()
			this.info.navigation.goBack()
		} else {
			Alert.alert('An error occured')
			console.log(data)
		}
	}
	async deleteImage() {
		const response = await fetch('https://api.imgur.com/3/image/' + this.image.id, {
			method: 'delete',
			headers: {
				'Authorization': 'Bearer ' + this.props.info.token,
			}
		})
		const data = await response.json()
		if (data.success) {
			console.log(data)
			Alert.alert('Image deleted')
			this.refresh()
			this.info.navigation.goBack()
		} else {
			Alert.alert('An error occured')
			console.log(data)
		}
	}
	render() {
		return (
			<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end',}}>
				<TextInput
					onChangeText={(text) => {
						this.text = text
					}}
					placeholder={'New Title'}
					style={{ flex: 1, height: 40, borderColor: 'black', borderWidth: 1, backgroundColor: '#FFFF', borderRadius: 10, marginRight: 20, textAlign: 'center' }}
					onSubmitEditing={() => { this.setTitle() }}
				>
				</TextInput>
				<TouchableOpacity onPress={() => { this.deleteImage() }}>
					<Image style={{ flex: 1, height: 30, width: 30, marginRight: 10, borderWidth: 10, resizeMode: 'contain' }} source={require('../assets/images/trashIcon.png')} />
				</TouchableOpacity>
			</View>
		)
	}
}

export default ImageSettingPannel