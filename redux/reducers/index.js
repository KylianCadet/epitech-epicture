import accountInfoReducer from './accountInfo'
import isLoggedReducer from './isLogged'
import { combineReducers } from 'redux'

const allReducers = combineReducers({
	accountInfo: accountInfoReducer,
	isLogged: isLoggedReducer,
})

export const dispatch_function = (name, placeName) => {
	return {
		type: name,
		payload: placeName
	}
}

export default allReducers