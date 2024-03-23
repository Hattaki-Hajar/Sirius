import {ball} from './game.js'
import {paddle1, paddle2} from './game.js'

export let socket
/**
 * Connects to the WebSocket server.
 * @returns {Promise<void>} A promise that resolves when the WebSocket connection is established.
 */
export async function connectToWebSocket() {
	try
	{
		const url = `ws://127.0.0.1:8000/ws/socket-server/`
		socket = new WebSocket(url)
		socket.onopen = function() {
			console.log('WebSocket connection established')
		}
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
	}
	catch (error)
	{
		console.error('WebSocket connection error:', error)
	}
}

// update ball position based on the data calculated in the backend
export function updateGame(data) {
	if (data['playerNb'])
	{
		playerNb = data['playerNb']
		paddle1.playerNb = playerNb
		paddle2.playerNb = playerNb
		// audioLoader.load('/static/eva.mp3', function( buffer ) {
		// 	sound.setBuffer(buffer)
		// 	sound.setLoop(true)
		// 	sound.setVolume(0.5)
		// 	sound.play()
		// })
	}
	if (data['ballXPos'])
		ball.body.position.x = data['ballXPos']
	if (data['ballZPos'])
		ball.body.position.z = data['ballZPos']
	if (data['player1ZPos'])
	{
		paddle1.body.position.z = data['player1ZPos']
		paddle1.moveModel(data['player1ZPos'])
	}
	if (data['player2ZPos'])
	{
		paddle2.body.position.z = data['player2ZPos']
		paddle2.moveModel(data['player2ZPos'])
	}
}