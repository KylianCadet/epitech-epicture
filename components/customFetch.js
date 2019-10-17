

const client_id = '38c6850ce6bd17c'

export function fetchBearer(uri, token) {
	return fetch(uri, {
		headers: {
			'Authorization': 'Bearer ' + token
		}
	})
		.then((response) => response.json())
		.catch((error) => console.error(error))
}

export function fetchAuthorization(uri) {
	return fetch(uri, {
		headers: {
			'Authorization': 'Client-ID ' + client_id
		}
	})
		.then((response) => response.json())
		.catch((error) => console.error(error))
}

export function getAccountBase(username) {
	const uri = "https://api.imgur.com/3/account/" + username
	return fetchAuthorization(uri)
}
