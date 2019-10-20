import React from 'react'
import { View, StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native'

function setBoxMargin() {
	return (Dimensions.get('window').width - (Dimensions.get('window').width * 0.9)) / 2
}

export default class FilterSection extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			getStatus: false,
			hidden: true,
			filters: this.props.params.filters
		};

		this.update = this.props.params.update
		this.refresh = this.props.params.refresh
		this.getFilters = this.props.params.getFilters
		this.setHidden = this.props.params.setHidden
		this.getHidden = this.props.params.getHidden
	}

	componentDidMount = () => {
	}

	componentDidUpdate = () => {
		if (!this.state.getStatus) {
			this.setState({
				filters: this.getFilters(),
				hidden: this.getHidden(),
				getStatus: true,
			})
		}
	}

	displayMainButton = (status, text, custom) => {
		return (
			<TouchableOpacity
				style={custom}
				onPress={() => {
					this.setState({ hidden: status, })
					this.setHidden(status)
				}}
			>
				<Text style={styles.titleButton}>{text}</Text>
			</TouchableOpacity>
		)
	}

	handleUpdate = (key, value) => {
		let copy = JSON.parse(JSON.stringify(this.state.filters))
		if (key === 'section')
			copy.section = value
		else if (key === 'sort')
			copy.sort = value
		else if (key === 'date')
			copy.date = value
		this.setState({ filters: copy })
		return copy
	}

	handlePress = (status, value, key) => {
		if (status)
			return
		var filters = this.handleUpdate(key, value)
		this.update(filters)
		this.refresh(false)
	}

	simpleButton = (text, ref, key) => {
		var status = ref === text.toLowerCase()
		if (status)
			var myStyle = [styles.simpleButton, { backgroundColor: '#1bb76e' }]
		else
			var myStyle = [styles.simpleButton, { backgroundColor: '#2c2f34' }]
		return (
			<TouchableOpacity
				style={myStyle}
				onPress={() => this.handlePress(status, text.toLowerCase(), key)}
			>
				<Text style={styles.titleButton}>{text}</Text>
			</TouchableOpacity>
		)
	}

	sectionFilter = () => {
		return (
			<View style={styles.filterLine}>
				{this.simpleButton('Hot', this.state.filters.section, 'section')}
				{this.simpleButton('Top', this.state.filters.section, 'section')}
				{this.simpleButton('User', this.state.filters.section, 'section')}
			</View>
		)
	}

	sortFilter = () => {
		return (
			<View style={styles.filterLine}>
				{this.simpleButton('Viral', this.state.filters.sort, 'sort')}
				{this.simpleButton('Top', this.state.filters.sort, 'sort')}
				{this.simpleButton('Time', this.state.filters.sort, 'sort')}
				{this.simpleButton('Rising', this.state.filters.sort, 'sort')}
			</View>
		)
	}

	dateFilter = () => {
		return (
			<View style={styles.filterLine}>
				{this.simpleButton('Day', this.state.filters.date, 'date')}
				{this.simpleButton('Week', this.state.filters.date, 'date')}
				{this.simpleButton('Month', this.state.filters.date, 'date')}
				{this.simpleButton('Year', this.state.filters.date, 'date')}
				{this.simpleButton('All', this.state.filters.date, 'date')}
			</View>
		)
	}

	showFilters = () => {
		return (
			<View style={styles.filtersBox}>
				{this.displayMainButton(true, 'Hide filters', styles.hideButton)}
				{this.sectionFilter()}
				{this.sortFilter()}
				{this.dateFilter()}
			</View>
		)
	}

	hideFilters = () => {
		return this.displayMainButton(false, 'Show filters', styles.showButton)
	}

	render() {
		return (
			<View style={[styles.container, { marginHorizontal: setBoxMargin() }]}>
				{
					this.state.hidden
						?
						(this.hideFilters())
						:
						(this.showFilters())
				}
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 20,
	},
	showButton: {
		borderRadius: 10,
		backgroundColor: '#1bb76e',
	},
	hideButton: {
		borderRadius: 10,
		backgroundColor: '#1bb76e',
		marginBottom: 2.5,
	},
	simpleButton: {
		flex: 1,
		borderRadius: 10,
		// marginHorizontal: 10,
	},
	filterLine: {
		flex: 1,
		flexDirection: 'row',
		marginVertical: 2.5,
	},
	titleButton: {
		fontSize: 16,
		marginVertical: 5,
		color: '#fff',
		fontWeight: 'bold',
		textAlign: 'center',
	},
	filtersBox: {
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
