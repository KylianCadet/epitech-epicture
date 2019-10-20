function isLoggedReducer(state = false, action) {
	switch (action.type) {
		case 'LOGIN':
			return true
		case 'LOGIN_CLEAR':
			return false
		default:
			return state
	}
}

export default isLoggedReducer