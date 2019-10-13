function usernameReducer(state = '', action) {
	switch (action.type) {
		case 'USERNAME':
			return action.payload
		default:
			return state
	}
}

export default usernameReducer