import accountInfoReducer from './accountInfo'
import isLoggedReducer from './isLogged'
import tokenReducer from './token'
import usernameReducer from './username'
import { combineReducers } from 'redux'

const allReducers = combineReducers({
	accountInfo: accountInfoReducer,
	isLogged: isLoggedReducer,
	token: tokenReducer,
	username: usernameReducer,
})

export const dispatch_function = (name, placeName) => {
	return {
		type: name,
		payload: placeName
	}
}

export default allReducers