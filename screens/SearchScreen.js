import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

export default function UploadScreen() {
	return (
		<ScrollView style={styles.container}>
			<Text>Search screen</Text>
		</ScrollView>
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
