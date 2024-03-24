import * as THREE from 'three'
import {paddle1, paddle2, ball, scene} from './game.js'

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
			// startAudio()
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

function startAudio() {
	const loadingManager = new THREE.LoadingManager()
	const audioLoader = new THREE.AudioLoader(loadingManager)
	const listener = new THREE.AudioListener()
	const audio = new THREE.Audio(listener)
	scene.add(listener)
	audioLoader.load('../assets/audio/eva2.mp3', function(buffer) {
		audio.setBuffer(buffer)
		audio.setLoop(true)
		audio.setVolume(0.5)
		audio.play()
	})
}

// update ball position based on the data calculated in the backend
export function updateGame(data) {
	if (data['playerNb'])
	{
		paddle1.playerNb = playerNb
		paddle2.playerNb = playerNb
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
	if (data['player1Score'])
	{
		console.log(data['player1Score'])
		console.log(data['player2Score'])
		paddle1.score = data['player1Score']
		paddle2.score = data['player2Score']
		if (paddle1.playerNb === 1 && paddle1.score === 5 || paddle2.playerNb === 2 && paddle2.score === 5)
			console.log('You won!')
		else
			console.log('You lost!')
	}
	if (data["won"])
		console.log(data["won"])
}