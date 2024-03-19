import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {sendDataToBackend, prepareBackendData, updateGame} from "./backend_communication";

// create renderer to display scenes using WebGL
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
window.addEventListener("resize",()=>{
	renderer.setSize(window.innerWidth, window.innerHeight)
})
document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(45, window.innerWidth/ window.innerHeight, 0.1, 1000)
const orbit = new OrbitControls(camera, renderer.domElement)

camera.position.set(0, 40, 0)
orbit.update()

// create axes helper
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

// create the arena
class Arena {
	constructor() {
		this.Height = 22.5
		this.Width = 30
		this.Geometry = new THREE.PlaneGeometry(this.Width, this.Height)
		this.Material = new THREE.MeshBasicMaterial({color: 0xFFFFFF, side: THREE.DoubleSide})
		this.body = new THREE.Mesh(this.Geometry, this.Material)
	}
}

export const arena = new Arena()
// rotating the arena
arena.body.rotation.x = 0.5 * Math.PI
scene.add(arena.body)

// create the ball
class Ball {
	constructor() {
		this.Radius = 0.425
		this.Geometry = new THREE.SphereGeometry(this.Radius)
		this.Material = new THREE.MeshBasicMaterial({color: 0xA94064})
		this.body = new THREE.Mesh(this.Geometry, this.Material)
	}
}
export const ball = new Ball()
// add ball radius to lift the ball to the arena
ball.body.position.y = ball.Radius
scene.add(ball.body)

// create paddles
class Paddle {
	constructor() {
		this.Width = 1
		this.Height = 4.5
		this.Geometry = new THREE.BoxGeometry(this.Width, this.Height)
		this.Material = new THREE.MeshBasicMaterial({color: 0x8B0000})
		this.body = new THREE.Mesh(this.Geometry, this.Material)
		this.score = 0
	}
}
export const paddle1 = new Paddle()
// place paddle in the middle right of the arena and rotate it
paddle1.body.position.x = arena.Width / 2
paddle1.body.rotation.x = 0.5 * Math.PI
scene.add(paddle1.body)

export const paddle2 = new Paddle()
// place paddle in the middle left of the arena and rotate it
paddle2.body.position.x = -(arena.Width / 2)
paddle2.body.rotation.x = 0.5 * Math.PI
scene.add(paddle2.body)
let socket
async function connectToWebSocket() {
	try {
		let url = `ws://127.0.0.1:8000/ws/socket-server/`
		socket = new WebSocket(url)
		await socket.onopen;
		console.log('WebSocket connection established')
		socket.onmessage = function(e) {
			let data = JSON.parse(e.data)
			updateGame(data)
		}
	socket.onerror = function (error) {
		console.error('WebSocket error:', error);
	}
	socket.onclose = function() {
		console.log('Connection was closed');
	}
	} catch (error) {
		console.error('WebSocket connection error:', error);
	}
}
connectToWebSocket()
// listen on keydown
document.addEventListener('keydown', KeyDown)
// move certain paddle in certain position depending on the key pressed
function KeyDown(event) {
	let keycode = event.which
	let data = {'nb': 0, 'direction': ''}
	if (keycode == 39 && paddle1.body.position.z - (paddle1.Height / 2) - 0.9 > -(arena.Height / 2))
	{
		data['nb'] = 1
		data["direction"] = 'down'
	}
	else if (keycode == 37 && paddle1.body.position.z + (paddle1.Height / 2) + 0.9 < arena.Height / 2)
	{
		data['nb'] = 1
		data["direction"] = 'up'
	}
	else if (keycode == 65 && paddle2.body.position.z - (paddle1.Height / 2) - 0.9 > -arena.Height / 2)
	{
		data['nb'] = 2
		data["direction"] = 'down'
	}
	else if (keycode == 68 && paddle2.body.position.z + (paddle1.Height / 2) + 0.9 < arena.Height / 2)
	{
		data['nb'] = 2
		data["direction"] = 'up'
	}
	if (socket.readyState === WebSocket.OPEN)
		socket.send(JSON.stringify(data))
}

// animation loop function
function	animate() {
	requestAnimationFrame( animate )
	renderer.render(scene, camera)
}
animate()