function accountInfoReducer(state = {}, action) {
	switch (action.type) {
		case 'ACCOUNT_INFO':
			return action.payload
		default:
			return state
	}
}

export default accountInfoReducer