import * as THREE from 'three'
import {paddle1, paddle2, ball} from './game.js'

export let socket
/**
 * Connects to the WebSocket server.
 * @returns {Promise<void>} A promise that resolves when the WebSocket connection is established.
 */
export async function connectToWebSocket() {
	try
	{
		const url = `ws://10.14.6.3:8000/ws/socket-server/`
		socket = new WebSocket(url)
		socket.onopen = function() {
			console.log('WebSocket connection established')
		}
		socket.onmessage = function(e) {
			const data = JSON.parse(e.data)
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

// set the player number for the paddles and start the audio
function setPlayerNb(playerNb) {
	paddle1.playerNb = playerNb
	paddle2.playerNb = playerNb
}

export let gameover = 0

// update ball position based on the data calculated in the backend
export function updateGame(data) {
	if (data['playerNb'])
		setPlayerNb(data['playerNb'])
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
	if (data['player1Score'] || data['player2Score'])
	{
		if (paddle1.score != data['player1Score'])
			paddle1.ChangeScore(data['player1Score'], 1)
		if (paddle2.score != data['player2Score'])
			paddle2.ChangeScore(data['player2Score'], 2)
		paddle1.score = data['player1Score']
		paddle2.score = data['player2Score']
	}
	if (paddle1.score === 5 || paddle2.score === 5)
	{
		if (paddle1.score === 5 && paddle1.playerNb === 1 || paddle2.score === 5 && paddle1.playerNb === 2)
		{
			console.log('You won!')
			gameover = 1
		}
		else if (paddle2.score === 5 && paddle1.playerNb === 1 || paddle1.score === 5 && paddle1.playerNb === 2)
		{
			console.log('You lost!')
			gameover = 3
		}
	}
	else if (data["won"])
	{
		console.log(data["won"])
		gameover = 2
	}
}