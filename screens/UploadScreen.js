import React from 'react';
import { ScrollView, StyleSheet, Text, Touchable, View, Button, Image } from 'react-native';
import Color from '../constants/Colors'
import { connect } from 'react-redux'
import ImagePicker from 'react-native-image-picker';


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
		};

	}
	uploadImage() {
		const uri = 'https://api.imgur.com/3/upload'
		const data = {
			image: this.state.photo.uri
		}
		fetch(uri, {
			headers: {
				'Authorization': 'Bearer ' + this.props.token
			}
		})
	}

	handleChoosePhoto = () => {
		const options = {
			noData: true,
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
					{photo && (
						<Image
							source={{ uri: photo.uri }}
							style={{ flex: 1, aspectRatio: 1, resizeMode: 'contain', borderRadius:10 }}
						/>
					)}
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
		accountInfo: state.accountInfo,
		isLogged: state.isLogged,
		token: state.token,
		username: state.username
	}
}

export default UploadScreen

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Color.backgroundColor,
	},
});
