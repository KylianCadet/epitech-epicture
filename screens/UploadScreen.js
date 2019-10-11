import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import ClickableButtonLine from '../components/ClickableButtonLine'

export default function UploadScreen() {
	return (
		<ScrollView style={styles.container}>
			<ClickableButtonLine text='allah' />
			<ClickableButtonLine text='lila' />
			<ClickableButtonLine text='louange' />
			<ClickableButtonLine text='à' />
			<ClickableButtonLine text='allah' />
			<ClickableButtonLine text='le' />
			<ClickableButtonLine text='tout' />
			<ClickableButtonLine text='miséricordieu' />
			<ClickableButtonLine text='le' />
			<ClickableButtonLine text='très' />
			<ClickableButtonLine text='miséricordieu' />
			<ClickableButtonLine text='lila' />
			<ClickableButtonLine text='lila' />
			<ClickableButtonLine text='lila' />
			<ClickableButtonLine text='lila' />
			<ClickableButtonLine text='lila' />
			<ClickableButtonLine text='lila' />
			<ClickableButtonLine text='lila' />
			<ClickableButtonLine text='lila' />
			<ClickableButtonLine text='lila' />
			<ClickableButtonLine text='lila' />
			<ClickableButtonLine text='lila' />
			<ClickableButtonLine text='lila' />
			<ClickableButtonLine text='lila' />
		</ScrollView>
	);
}

UploadScreen.navigationOptions = {
	title: 'Upload',
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
});
