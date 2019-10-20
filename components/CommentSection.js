import React from 'react'
import { View, StyleSheet, Text, TouchableOpacity, Dimensions, TextInput, Alert } from 'react-native'
import { postRequest } from '../screens/HomeScreen';

function setBoxMargin() {
	return (Dimensions.get('window').width - (Dimensions.get('window').width * 0.9)) / 2
}

export default class CommentSection extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			id: this.props.id,
			token: this.props.token,
			navigation: this.props.navigation,
		};

		this.text = null
	}

	componentDidMount = () => {
	}

	componentDidUpdate = () => {
	}

	handleSubmit = () => {
		fetch('https://api.imgur.com/3/comment/', {
			method: 'post',
			headers: {
				'Authorization': 'Bearer ' + this.state.token,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				image_id: this.state.id,
				comment: this.text,
			})
		})
			.then((data) => {
				if (data.status === 200) {
					Alert.alert('Comment sent')
					this.state.navigation.goBack()
				} else {
					Alert.alert('An error occured')
				}
			})
	}

	render() {
		return (
			<View style={[styles.commentBox, { marginHorizontal: setBoxMargin() }]}>
				<TextInput
					ref={input => { this.textInput = input }}
					onChangeText={(text) => {
						this.text = text
					}}
					placeholder={'Write a comment'}
					placeholderTextColor='#000'
					style={{ flex: 1, height: 40, borderRadius: 5, margin: 10, backgroundColor: '#fff' }}
					onSubmitEditing={() => {
						this.handleSubmit()
					}}
				>
				</TextInput>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 20,
	},
	commentBox: {
		marginVertical: 7.5,
		backgroundColor: '#2c2f34',
		borderRadius: 10,
		shadowRadius: 5,
		shadowOpacity: 1,
		shadowColor: '#000000',
		shadowOffset: {
			width: 0,
			height: 3
		},
	},
});
