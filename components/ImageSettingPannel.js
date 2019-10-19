import React from 'react'
import { View, TextInput, TouchableOpacity, Image, Alert } from 'react-native'
import Colors from '../constants/Colors'

class ImageSettingPannel extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			hidden: null,
		}
		this.info = null
		this.image = null
		this.text = ''
	}
	componentDidMount() {
		this.info = this.props.info
		this.image = this.props.image
		this.setState({
			hidden: this.image.in_gallery ? false : true
		})
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
	async setVisibilityTrue() {
		console.log(this.image.id)
		const response = await fetch('https://imgur.com/ajax/share', {
			method: 'post',
			headers: {
				'Authorization': 'Bearer ' + this.props.info.token,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ hash: this.image.id, title: this.image.title.replace(/ /g, '+'), is_album: 0, mature: 0 })
		})
		const data = await response.json()
		if (data.success) {
			this.modifyHiddenState()
			Alert.alert('Image is now public')
		} else {
			Alert.alert('An error occurred', data.data.error.message)
			console.log(data)
		}
	}
	async setVisibilityFalse() {
		fetch('https://imgur.com/gallery/action/delete_image/' + this.image.id, {
			method: 'post',
			headers: {
				'Authorization': 'Bearer ' + this.props.info.token,
			},
			body: JSON.stringify({ sid: '7e4b4b793439dbb0f5e52a5ce06ac092' })
		})
		this.modifyHiddenState()
		Alert.alert('Image is now private')
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
				<TouchableOpacity onPress={() => { this.deleteImage() }}>
					<Image style={{ flex: 1, height: 30, width: 30, marginRight: 10, borderWidth: 10, resizeMode: 'contain' }} source={require('../assets/images/trashIcon.png')} />
				</TouchableOpacity>
			</View>
		)
	}
}

export default ImageSettingPannel