function usernameReducer(state = '', action) {
	switch (action.type) {
		case 'USERNAME':
			return action.payload
		case 'USERNAME_CLEAR':
			return ''
		default:
			return state
	}
}

export default usernameReducer