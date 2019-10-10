// import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
	Image,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	Button,
} from 'react-native';

export default function HomeScreen() {
	return (
		<View style={{ flex: 1, justifyContent: "center" }}>
			<Button title="Press me if you're a naughty boyz" onPress={() => { console.log("oui") }}></Button>
		</View>
	);
}

HomeScreen.navigationOptions = {
	title: 'Home'
};

// function handlePornhub() {
// 	WebBrowser.openBrowserAsync(
// 		'https://www.pornhub.com'
// 	);
// }
const styles = StyleSheet.create({
});
