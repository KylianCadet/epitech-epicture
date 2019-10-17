import React from 'react'
import Color from '../constants/Colors'
import Video from 'react-native-video';
import { View, Image, StyleSheet, TouchableOpacity, Text, Dimensions, TouchableHighlight, ImageBackground } from 'react-native'

import HomeActionBar from '../components/HomeActionBar'


function setDimensions(item) {
	var newheight = Dimensions.get('window').width * item.height / item.width * 0.9
	var newwidth = Dimensions.get('window').width * 0.9
	var boxwidth = (Dimensions.get('window').width - newwidth) / 2
	return ({ width: newwidth, height: newheight, box: boxwidth })
}

function generateComment(comment) {
	const comment_time = new Date(comment.datetime * 1000)
	var display_time = comment_time.toString().split(' ')
	display_time.pop()
	display_time.pop()
	display_time = display_time.join(' ')
	const upvote = comment.ups - comment.downs < 0 ? 0 : comment.ups - comment.downs
	return (
		<View>
			<TouchableOpacity onPress={() => console.log(comment.image_id)}>
				<View style={{ flexDirection: 'row' }}>
					<Image source={{ uri: comment.image_link }} style={{ marginBottom: 10, marginTop: 10, marginLeft: 10, width: 60, height: 60, resizeMode: 'contain' }}></Image>
					<View>
						<Text style={{ color: 'white', marginLeft: 10, marginTop: 20 }}>{comment.comment}</Text>
						<Text style={{ fontSize: 10, color: 'grey', marginLeft: 10 }}>{display_time}</Text>
						<View style={{ flexDirection: 'row' }}>
							<Image source={require('../assets/images/up.png')} style={{ height: 7, width: 7, marginLeft: 10, marginTop: 5 }}></Image>
							<Text style={{ fontSize: 10, color: 'grey', marginLeft: 5 }}>{upvote}</Text>
						</View>
					</View>
				</View>
			</TouchableOpacity>
		</View>
	)
}

function CustomVideo({ video, dim }) {
	return (
		<View>
			<Video
				style={{ width: dim.width, height: dim.height, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
				source={{ uri: video.link ? video.link : video.mp4 }}
				repeat={true}
				resizeMode={"cover"}
			/>
		</View>
	)
}

function CustomImage({ image, dim }) {
	return (
		<View style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
			<Image
				source={{ uri: image.link }}
				style={[styles.image, { width: dim.width, height: dim.height, borderTopLeftRadius: 10, borderTopRightRadius: 10 }]}
			/>
		</View>
	)
}

function AlbumFooter({ images_count }) {
	return (
		<View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-start' }}>
			<Image source={require('../assets/images/albumIcon.png')} style={{ width: 20, height: 20, resizeMode: 'contain', marginLeft: 'auto' }}></Image>
			<Text style={{ color: 'white', alignSelf: 'flex-end', paddingRight: 20 }}>{images_count}</Text>
		</View>
	)
}
function ScoreFooter({ score, images_count }) {
	if (!score)
		return (
			<View style={{ flex: 1, paddingTop: 20 }}>
				<Text style={{ alignSelf: 'center', color: 'grey' }}>Hidden</Text>
				{images_count ?
					(<AlbumFooter images_count={images_count} />)
					:
					(<View></View>)}
			</View>
		)

	return (
		<View style={{ flex: 1, paddingTop: 10 }}>
			<Image source={require('../assets/images/up.png')} style={{ width: 20, height: 20, resizeMode: 'contain', alignSelf: 'center', paddingLeft: 10 }}></Image>
			<Text style={{ alignSelf: 'center', color: 'grey' }}>{score} Points</Text>
			{images_count ?
				(<AlbumFooter images_count={images_count} />)
				:
				(<View></View>)}
		</View>
	)
}

function ImageFooter({ image, album }) {
	var images_count = 0
	if (album) {
		images_count = album.images.length
		if (album.points) {
			return <ScoreFooter score={album.points} images_count={images_count}></ScoreFooter>
		}
	}
	if (image.score)
		return <ScoreFooter score={image.score} images_count={images_count}></ScoreFooter>
	return <ScoreFooter images_count={images_count}></ScoreFooter>
}

function ImageComponent({ image, navigate, album }) {
	var dim = setDimensions(image)
	return (
		<View elevation={7.5} style={[styles.item, { marginHorizontal: dim.box }]}>
			<TouchableOpacity style={{ marginBottom: 20 }} onPress={() => {
				if (album) {
					navigate('Post', {
						images: album.images,
						album_id: album.id,
						all: album,
					})
				} else {
					navigate('Image', {
						image: image
					})
				}
			}} >
				<View>
					{image.type === 'video/mp4' ?
						(<CustomVideo video={image} dim={dim} />)
						:
						(<CustomImage image={image} dim={dim} />)
					}
					{album ?
						(<Text style={styles.title}>{album.title}</Text>)
						:
						(<Text style={styles.title}>{image.title}</Text>)
					}
					<ImageFooter image={image} album={album} />
				</View>
			</TouchableOpacity>
		</View >
	)
}

function generateImage(elem, navigate) {
	var image
	var album = null
	if (elem.images) {
		image = elem.images[0]
		album = elem
	}
	else
		image = elem
	if (
		image.type === 'video/mp4' ||
		image.type === 'image/png' ||
		image.type === 'image/gif' ||
		image.type === 'image/jpeg')
		return (<ImageComponent image={image} navigate={navigate} album={album}></ImageComponent>)
	else {
		console.log('Unknow image : ' + image.type + ' ' + image.title)
		return (null)
	}
}

export function Item({ image, data, comment, navigate }) {
	if (data) {
		return (
			<View style={styles.itemContainer}>
				{data}
			</View>
		)
	}
	if (image) {
		return generateImage(image, navigate)
	}
	if (comment)
		return generateComment(comment)
	return (<View></View>)
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	itemContainer: {
		flex: 1,
		backgroundColor: Color.backgroundColor
	},
	title: {
		// marginVertical: 15,
		fontWeight: 'bold',
		textAlign: 'center',
		fontSize: 20,
		color: '#FFFFFF',
		marginHorizontal: 15,
		marginTop: 15,
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
	footer: {
		color: 'grey'
	}
});