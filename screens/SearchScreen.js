import React from 'react';
import { ScrollView, StyleSheet, Text, View, TextInput } from 'react-native';
import Colors from '../constants/Colors';
import { FlatList } from 'react-native-gesture-handler';
import LoadingView from 'react-native-loading-view';
import { connect } from 'react-redux'

class SearchScreen extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			data: [],
			loading: false,
		}
		this.search = ''
		this.index = 1
	}
	async submit() {
		const uri = 'https://api.imgur.com/3/gallery/search/time/all/0?q=' + this.search
		this.setState({ loading: true })
		const response = await fetch(uri, {
			headers: this.props.authorizationHeader
		})
		const data = await response.json()
		this.setState({ loading: false, data: data.data })
	}
	async fetchMore() {
		const uri = 'https://api.imgur.com/3/gallery/search/time/all/' + this.index.toString() + '/?q=' + this.search
		this.index++
		const response = await fetch(uri, {
			headers: this.props.authorizationHeader
		})
		const data = await response.json()
		this.setState({data : this.state.data.concat(data.data)})
	}
	render() {
		return (
			<View style={styles.container}>
				<Text style={[styles.textTitle]}>Search</Text>
				<View style={{ flexDirection: 'row' }}>
					<View style={{ flex: 1 }}></View>
					<TextInput placeholder={'...'} placeholderTextColor={'grey'} style={[styles.textInput]} onChangeText={text => this.search = text} onSubmitEditing={() => this.submit()}></TextInput>
					<View style={{ flex: 1 }}></View>
				</View>
				<LoadingView loading={this.state.loading}>
					<FlatList
						data={this.state.data}
						renderItem={({ item }) => <View><Text style={{color:'white'}}>{item.id}</Text></View>}
						keyExtractor={item => item.id}
						onEndReached={() => this.fetchMore()}
					/>
				</LoadingView>
			</View>
		);
	}
}

SearchScreen.navigationOptions = {
	header: null,
};

function mapStateToProps(state) {
	return {
		authorizationHeader: state.authorizationHeader,
	}
}

export default connect(mapStateToProps)(SearchScreen)

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.backgroundColor,
	},
	text: {
		color: 'white'
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
