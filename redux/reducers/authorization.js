import ClientID from '../../constants/ClientID'

function authorizationReducer(state = { 'Authorization': 'Client-ID ' + ClientID.client_id }, action) {
	switch (action.type) {
		case 'AUTHORIZATION':
			return { 'Authorization': 'Bearer ' + action.payload }
		case 'AUTHORIZATION_CLEAR':
			return { 'Authorization': 'Client-ID ' + ClientID.client_id }
		default:
			return state
	}
}

export default authorizationReducer