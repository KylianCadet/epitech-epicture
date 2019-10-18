import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';

export default class UploadScreen extends React.Component {
	constructor(props) {
		super(props)
		this.info = null
		this.item = null
		this.state = {
			hidden: null
		}
	}
	componentDidMount() {
		this.info = this.props.info
		this.item = this.props.item
		this.hidden = this.props.hidden
	}
	render() {
		return (
			<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
				<TouchableOpacity onPress={() => {
					this.setState({
						hidden: !this.state.hidden
					})

					console.log(this.item)
				}}>
					{this.state.hidden ?
						(<Image style={{ flex: 1, height: 30, width: 30, marginRight: 10, borderWidth: 10 }} source={require('../assets/images/eyeIcon.png')}></Image>)
						:
						(<Image style={{ flex: 1, height: 30, width: 30, marginRight: 10, borderWidth: 10 }} source={require('../assets/images/eyeIconCrossed.png')}></Image>)
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
					<Image style={{ flex: 1, height: 30, width: 30, marginRight: 10, borderWidth: 10 }} source={require('../assets/images/trashIcon.png')} />
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
