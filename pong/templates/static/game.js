import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {connectToWebSocket, socket, playerNb} from "./backend_communication";

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

camera.position.set(0, 40, 30)
orbit.update()

// create axes helper
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

// create the arena
class Arena {
	constructor() {
		this.Height = 22
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
		this.Height = 4
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

connectToWebSocket()

// listen on keydown
document.addEventListener('keydown', KeyDown)

// send data to backend depending on key pressed
function KeyDown(event) {
	let keycode = event.which
	let data = {'direction': ''}
	
	if (playerNb)
	{
		const paddle = playerNb === 1 ? paddle1 : paddle2
		const arenaHeightHalf = arena.Height / 2
		const paddleHeightHalf = paddle.Height / 2

		if ((playerNb === 2 && keycode === 39) || (playerNb === 1 && keycode === 37))
		{
			if (data["direction"] === '')
				if (paddle.body.position.z + paddleHeightHalf < arenaHeightHalf)
				{
					data["direction"] = 'down'
					socket.send(JSON.stringify(data))
				}
		} 
		else if ((playerNb === 2 && keycode === 37) || (playerNb === 1 && keycode === 39))
		{
			if (data["direction"] === '')
				if (paddle.body.position.z - paddleHeightHalf > -arenaHeightHalf)
				{
					data["direction"] = 'up'
					socket.send(JSON.stringify(data))
				}
		}
	}
}

// animation loop function
function	animate() {
	requestAnimationFrame( animate )
	renderer.render(scene, camera)
}
animate()