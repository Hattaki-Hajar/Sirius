import {arena, ball, paddle1, paddle2} from './game.js'
// prepare paddle position and geometry to send to backend
export function prepareBackendData(player_nb)
{
	let data = {}
	if (player_nb === 1)
		data = {
			"paddleXPos": paddle1.body.position.x,
			"paddleZPos": paddle1.body.position.z,
			"paddleHeight": paddle1.Height,
			"paddleWidth": paddle1.Width,
			"arenaHeight": arena.Height,
		}
	else
		data = {
			"paddleXPos": paddle2.body.position.x,
			"paddleZPos": paddle2.body.position.z,
			"paddleHeight": paddle2.Height,
			"paddleWidth": paddle2.Width,
			"arenaHeight": arena.Height,
		}
	return data
}

export let socket
export async function connectToWebSocket() {
	try {
		let url = `ws://127.0.0.1:8000/ws/socket-server/`
		socket = new WebSocket(url)
		await socket.onopen
		console.log('WebSocket connection established')
		socket.onmessage = function(e) {
			let data = JSON.parse(e.data)
			updateGame(data)
		}
		socket.onerror = function (error) {
			console.error('WebSocket error:', error)
		}
		socket.onclose = function() {
			console.log('Connection was closed')
		}
	} catch (error) {
		console.error('WebSocket connection error:', error)
	}
}
export let playerNb
// update ball position based on the data calculated in the backend
export function updateGame(data) {
	if (data['playerNb'])
	{
		console.log('playerNb', data)
		playerNb = data['playerNb']
	}
	if (data['ballXPos'])
		ball.body.position.x = data['ballXPos']
	if (data['ballZPos'])
		ball.body.position.z = data['ballZPos']
	if (data['player1ZPos'])
		paddle1.body.position.z = data['player1ZPos']
	if (data['player2ZPos'])
		paddle2.body.position.z = data['player2ZPos']
}