function tokenReducer(state = '', action) {
	switch (action.type) {
		case 'TOKEN':
			return action.payload
		case 'TOKEN_CLEAR':
			return ''
		default:
			return state
	}
}

export default tokenReducer