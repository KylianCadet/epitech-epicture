import React from 'react';
import { ScrollView, StyleSheet, Text, Touchable, View, Button, Image, TextInput, Alert } from 'react-native';
import Color from '../constants/Colors'
import ClientID from '../constants/ClientID'
import { connect } from 'react-redux'
import ImagePicker from 'react-native-image-picker';
import LoadingView from 'react-native-loading-view'
import Colors from '../constants/Colors';

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
			selectButton: false,
			isLoading: false,
		};
		this.title = ''
		this.description = ''

	}
	uploadImage() {
		this.setState({ isLoading: true, uploadButton: true, selectButton: true })
		const uri = 'https://api.imgur.com/3/upload/'
		const data = {
			image: this.state.photo.data,
			type: 'base64',
			title: this.title,
			description: this.description,
		}
		fetch(uri, {
			method: 'post',
			headers: {
				'Authorization': 'Bearer ' + this.props.token,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data)
		})
			.then((response) => response.json())
			.then((data) => {
				this.setState({ isLoading: false, photo: null, selectButton: false })
				if (data.success) {
					Alert.alert('Image successfuly uploaded')
				} else {
					Alert.alert('An error occured', data.data.error)
				}
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
						<Button title='Select Photo' onPress={this.handleChoosePhoto} color={Colors.itemColor} disabled={this.state.selectButton} />
					</View>
					<View style={{ flex: 1, marginLeft: 'auto', paddingTop: 10, paddingRight: 10, alignItems: 'flex-end' }}>
						<Button title='Upload Photo' onPress={() => this.uploadImage()} color={Colors.itemColor} disabled={this.state.uploadButton}></Button>
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

				<Text style={[styles.textTitle]}>Title</Text>
				<View style={{ flexDirection: 'row' }}>
					<View style={{ flex: 1 }}></View>
					<TextInput placeholder={'Title'} placeholderTextColor={'grey'} style={[styles.textInput]} onChangeText={text => this.title = text}></TextInput>
					<View style={{ flex: 1 }}></View>
				</View>

				<Text style={[styles.textTitle]}>Description</Text>
				<View style={{ flexDirection: 'row' }}>
					<View style={{ flex: 1 }}></View>
					<TextInput placeholder={'Description'} placeholderTextColor={'grey'} style={[styles.textInput]} onChangeText={text => this.description = text}></TextInput>
					<View style={{ flex: 1 }}></View>
				</View>
				<View style={{ flex: 1 }}></View>
			</View >
		);
	}
}

UploadScreen.navigationOptions = {
	header: null,
};


function mapStateToProps(state) {
	return {
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
	textTitle: {
		color: 'grey',
		fontSize: 10,
		paddingLeft: 20,
		paddingTop: 10,
	},
	textInput: {
		flex: 10,
		color: 'white',
		paddingLeft: 30,
		borderBottomColor: 'grey',
		borderBottomWidth: 0.5,
		paddingTop: 5,
		textAlign: 'left',
	},
});
