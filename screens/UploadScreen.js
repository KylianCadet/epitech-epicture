import React from 'react';
import { ScrollView, StyleSheet, Text, Touchable, View, Button, Image, TextInput } from 'react-native';
import Color from '../constants/Colors'
import ClientID from '../constants/ClientID'
import { connect } from 'react-redux'
import ImagePicker from 'react-native-image-picker';
import LoadingView from 'react-native-loading-view'

function fetchBearer(uri, token) {
	return fetch(uri, {
		headers: {
			'Authorization': 'Bearer ' + token
		}
	})
		.then((response) => response.json())
		.catch((error) => console.error(error))
}

class UploadScreen extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			photo: null,
			uploadButton: true,
			isLoading: false,
		};
		this.title = ''
		this.description = ''

	}
	uploadImage() {
		this.setState({ isLoading: true, uploadButton: true })
		const uri = 'https://api.imgur.com/3/upload/'
		var form = new FormData()
		form.append('image', this.state.photo.data)
		form.append('type', 'base64')
		form.append('title', this.title)
		form.append('description', this.description)
		fetch(uri, {
			method: 'post',
			headers: {
				'Authorization': 'Bearer ' + this.props.token,
				'Content-Type' : 'multipart/form-data',
			},
			body: form
		})
			.then((response) => response.json())
			.then((data) => {
				this.setState({ isLoading: false, photo: null })
			})
			.catch((error) => console.error(error))
	}

	handleChoosePhoto = () => {
		const options = {
			noData: false,
			mediaType: 'mixed'
		};
		ImagePicker.showImagePicker(options, response => {
			if (response.uri) {
				this.setState({ photo: response, uploadButton: false });
			}
		});
	};

	render() {
		const { photo } = this.state;
		return (
			<View style={[styles.container]}>
				<View style={{ flex: 1, flexDirection: 'row' }}>
					<View style={{ flex: 1, marginRight: 'auto', paddingTop: 10, paddingLeft: 10, alignItems: 'flex-start' }}>
						<Button title='Select Photo' onPress={this.handleChoosePhoto} color='grey' />
					</View>
					<View style={{ flex: 1, marginLeft: 'auto', paddingTop: 10, paddingRight: 10, alignItems: 'flex-end' }}>
						<Button title='Upload Photo' onPress={() => this.uploadImage()} color='grey' disabled={this.state.uploadButton}></Button>
					</View>
				</View>
				<View style={{ flex: 1 }}></View>
				<View style={{ flex: 10, alignItems: 'center', justifyContent: 'center', paddingBottom: 10 }}>
					<LoadingView loading={this.state.isLoading}>
						{photo ? (
							<Image
								source={{ uri: photo.uri }}
								style={{ flex: 1, aspectRatio: 1, resizeMode: 'contain', borderRadius: 10 }}
							/>
						) : (
								<Image
									source={require('../assets/images/noImage.png')}
									style={{ flex: 1, aspectRatio: 0.8, resizeMode: 'contain', borderRadius: 10 }}
								/>
							)}
					</LoadingView>
				</View>
				<View style={{ flex: 1 }}></View>

				<View style={{ flex: 1, flexDirection: 'row' }}>
					<TextInput
						onChangeText={(text) => this.title = text}
						placeholder={'Title'}
						style={{ flex: 1, height: 40, borderColor: 'black', borderWidth: 1, backgroundColor: 'gray', borderRadius: 10 }}
					/>
					<View style={{ flex: 1 }}></View>
				</View>
				<TextInput
					onChangeText={(text) => {
						this.description = text
					}}
					placeholder={'Description'}
					style={{ height: 40, borderColor: 'black', borderWidth: 1, backgroundColor: 'gray', borderRadius: 10 }}
				/>
			</View >
		);
	}
}

UploadScreen.navigationOptions = {
	header: null,
};


function mapStateToProps(state) {
	return {
		accountInfo: state.accountInfo,
		isLogged: state.isLogged,
		token: state.token,
		username: state.username
	}
}

export default connect(mapStateToProps)(UploadScreen)

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Color.backgroundColor,
	},
});
