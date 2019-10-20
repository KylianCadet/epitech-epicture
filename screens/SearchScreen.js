import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View, Dimensions, SafeAreaView, Alert } from 'react-native';
import { connect } from 'react-redux'

function setBoxMargin() {
	return (Dimensions.get('window').width - (Dimensions.get('window').width * 0.9)) / 2
}

class SearchScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			navigation: this.props.navigation,
			header: this.props.authorizationHeader
		};

		this.text = null
	}

	componentDidMount = () => {
		console.log(this.props.authorizationHeader)
	}

	componentDidUpdate = () => {
	}

	handleSubmit = () => {
		fetch('https://api.imgur.com/3/gallery/search/?q=cats', {
			headers: this.state.header,
		})
			.then((data) => {
				console.log(data)
				if (data.status === 200) {
					this.state.navigation.goBack()
				} else {
					Alert.alert('An error occured')
				}
			})
	}

	DisplaySearchBar = () => {
		return (
			<View style={{ marginHorizontal: setBoxMargin(), marginTop: 10, }}>
				<TextInput
					ref={input => { this.textInput = input }}
					onChangeText={(text) => {
						this.text = text
					}}
					placeholder={'Search an image or video'}
					placeholderTextColor='#000'
					style={{ borderRadius: 10, marginVertical: 10, backgroundColor: '#fff' }}
					onSubmitEditing={() => {
						this.handleSubmit()
					}}
				>
				</TextInput>
			</View>
		)
	}

	render() {
		return (
			<SafeAreaView style={styles.container} >
				{this.DisplaySearchBar()}
			</SafeAreaView>
		);
	}
}

function mapStateToProps(state) {
	return {
		accountInfo: state.accountInfo,
		isLogged: state.isLogged,
		token: state.token,
		username: state.username,
		authorizationHeader: state.authorizationHeader
	}
}

SearchScreen.navigationOptions = {
	header: null,
};

export default connect(mapStateToProps)(SearchScreen)

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#141518',
	},
	searchBox: {
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
