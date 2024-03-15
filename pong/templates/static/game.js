import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {sendDataToBackend} from "./backend_communication";

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
		this.xFactor = 0.15
		this.zFactor = 0.03
		this.speed = 1.3
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

// listen on keydown
document.addEventListener('keydown', KeyDown)

// move certain paddle in certain position depending on the key pressed
function KeyDown(event) {
	let keycode = event.which
	if (keycode == 39 && paddle1.body.position.z - (paddle1.Height / 2) > -(arena.Height / 2))
		paddle1.body.position.z -= 0.9
	else if (keycode == 37 && paddle1.body.position.z + (paddle1.Height / 2) < arena.Height / 2)
		paddle1.body.position.z += 0.9
	else if (keycode == 65 && paddle2.body.position.z -(paddle1.Height / 2) > -arena.Height / 2)
		paddle2.body.position.z -= 0.9
	else if (keycode == 68 && paddle2.body.position.z + (paddle1.Height / 2) < arena.Height / 2)
		paddle2.body.position.z += 0.9
}

// randomize the first movement of the ball
let randomNumber = Math.floor(Math.random() * 10)
if (randomNumber % 2)
	ball.xFactor *= -1
if (randomNumber % 4)
	ball.zFactor *= -1
let collisionDetected = 0
// detect collision with which paddle and send data to the backend
function	updateBallCoordinates()
{
	if (collisionDetected)
		return
	if (ball.body.position.x + ball.Radius >= paddle1.body.position.x - paddle1.Width) {
		console.log('+++++++++++++++++++++++collision detected')
		collisionDetected = 1
		sendDataToBackend(1)
		setTimeout(() => {collisionDetected = 0}, 500)
	}
	if (ball.body.position.x - ball.Radius <= paddle2.body.position.x + paddle2.Width) {
        console.log('-----------------------collision detected')
		collisionDetected = 1
		sendDataToBackend(2)
		setTimeout(() => {collisionDetected = 0}, 500)
	}
}

// animation loop function
function	animate() {
	requestAnimationFrame( animate )
	ball.body.position.x += ball.xFactor * ball.speed
	ball.body.position.z += ball.zFactor * ball.speed
	if (ball.body.position.z + (ball.Radius) >= arena.Height / 2 || ball.body.position.z - (ball.Radius) <= -(arena.Height / 2))
		ball.zFactor *= -1
	updateBallCoordinates()
	// if (paddle1.score === 5 || paddle2.score === 5)
	// 	console.log('game over ***************')
	renderer.render(scene, camera)
}
animate()