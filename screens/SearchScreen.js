import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View, Dimensions, SafeAreaView, Alert } from 'react-native';
import { connect } from 'react-redux'
import { FlatList } from 'react-native-gesture-handler';
import LoadingView from 'react-native-loading-view';
import { DisplayMedia } from './HomeScreen';
import { setDimensions } from './HomeScreen';

function Item({ all, title, images, navigation, album_id, info, header, refresh, scrollPosition }) {
	// if (all.filterSection)
	// 	return (<FilterSection params={all} />)
	if (typeof images === 'undefined' || images === null) { return null }
	var item = images[0]
	var dim = setDimensions(item)
	if (
		item.type === 'video/mp4' ||
		item.type === 'image/png' ||
		item.type === 'image/gif' ||
		item.type === 'image/jpeg')
		return (DisplayMedia({ all, item, dim, images, album_id, navigation, title, info, header, refresh, scrollPosition }))
	else {
		console.log('Unknow item : ' + item.type + ' ' + title)
		return (null)
	}
}

class SearchScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			navigation: this.props.navigation,
			header: this.props.authorizationHeader,
			loading: false,
			refreshing: false,
		}
		this.lastSearch = ''
		this.search = ''
		this.index = 1
	}

	componentDidMount = () => {
		console.log(this.props.authorizationHeader)
	}

	componentDidUpdate = () => {
	}

	async submit(errorLoading, navigation, pos) {
		const uri = 'https://api.imgur.com/3/gallery/search/time/all/0?q=' + this.search
		this.setState({ loading: true })
		const response = await fetch(uri, {
			headers: this.props.authorizationHeader
		})
		const data = await response.json()
		this.setState({ loading: false, data: data.data })
		this.lastSearch = this.search
		if (errorLoading) {
			var freshData
			for (var i = 0; i < data.data.length; i++) {
				if (data.data[i].id == navigation.state.params.album_id) {
					freshData = data.data[i]
					break
				}
			}
			setTimeout(() => {
				this.goIndex(pos)
			}, 500)
			this.props.navigation.navigate('Post', {
				images: navigation.state.params.images,
				album_id: navigation.state.params.album_id,
				all: freshData,
				info: navigation.state.params.info,
				refresh: navigation.state.params.refresh,
			})
		}
	}

	async fetchMore() {
		const uri = 'https://api.imgur.com/3/gallery/search/time/all/' + this.index.toString() + '/?q=' + this.search
		this.index++
		const response = await fetch(uri, {
			headers: this.props.authorizationHeader
		})
		const data = await response.json()
		this.setState({ data: this.state.data.concat(data.data) })
	}

	handleRefresh = (errorLoading, navigation, pos) => {
		this.setState(
			{
				data: [],
				refreshing: true,
			}, () => {
				this.search = this.lastSearch
				this.submit(errorLoading, navigation, pos)
			}
		)
	}

	goIndex = (pos) => {
		this.flatListRef.scrollToOffset({ animated: false, offset: pos });
	}

	handleScroll = (event) => {
		this.setState({ scrollPosition: event.nativeEvent.contentOffset.y })
	}

	DisplaySearchBar = () => {
		return (
			<View style={{}}>
				<TextInput
					ref={input => { this.textInput = input }}
					onChangeText={(text) => {
						this.search = text
					}}
					placeholder={'Search an image or video'}
					placeholderTextColor='#000'
					style={{
						borderRadius: 10,
						marginVertical: 10,
						backgroundColor: '#fff',
						marginHorizontal: 10,
					}}
					onSubmitEditing={() => {
						this.submit()
						this.textInput.clear()
					}}
				>
				</TextInput>
				<LoadingView loading={this.state.loading}>
					<FlatList
						data={this.state.data}
						ref={(ref) => { this.flatListRef = ref; }}
						onScroll={(event) => { this.handleScroll(event) }}
						renderItem={({ item }) => <Item
							title={item.title}
							all={item}
							images={item.images}
							album_id={item.id}
							navigation={this.props.navigation}
							header={this.props.authorizationHeader}
							refresh={this.handleRefresh.bind(this)}
							scrollPosition={this.state.scrollPosition}
							info={this.props} />}
						keyExtractor={item => item.id}
						refreshing={this.state.refreshing}
						onRefresh={this.handleRefresh}
						onEndReached={() => this.fetchMore()}
					/>
				</LoadingView>
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
	item: {
		borderRadius: 10,
		textAlign: 'center',
		// backgroundColor: '#424B54',
		backgroundColor: '#2c2f34',
		marginVertical: 20,
		shadowColor: '#000000',
		shadowOffset: {
			width: 0,
			height: 3
		},
		shadowRadius: 5,
		shadowOpacity: 1,
		// marginHorizontal: 20,
	},
	title: {
		// marginVertical: 15,
		fontWeight: 'bold',
		textAlign: 'center',
		fontSize: 20,
		color: '#FFFFFF',
		padding: 15,
		// marginTop: 15,
	},
	topbar: {
		flex: 1,
		flexDirection: 'row',
		marginLeft: 10,
		marginBottom: 10,
		marginTop: -5,
	},
	white: {
		fontSize: 12,
		color: '#BBBBBB',
	},
});
