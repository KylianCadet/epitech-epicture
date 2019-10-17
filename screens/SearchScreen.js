import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function UploadScreen() {
	return (
		<View style={{ flex: 1, flexDirection: 'row' }}>
			<Text style={{flex:1}}>1</Text>
			<Text style={{flex:1}}>2</Text>
			<Text style={{flex:1}}>3</Text>
			<Text style={{flex:1}}>4</Text>
		</View>
	);
}

UploadScreen.navigationOptions = {
	title: 'Search',
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
});
