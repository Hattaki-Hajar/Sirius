import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

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

camera.position.set(-10, 30, 30)
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

// update the z position of the ball depending on the position it hit the paddle,
// and always rotating the x position
// function	updateZCoordinates(paddle_pos)
// {
// 	ball.xFactor *= -1
// 	ball.zFactor = 0.03
// 	let pos = paddle_pos - ball.body.position.z
// 	if (ball.zFactor < 0.09)
// 		ball.zFactor += 0.03 * pos
// 	if (speed < 2.4)
// 		ball.speed += 0.1
// }
// // detect collision with which paddle, if no collision is detected reset ball properties
// function	updateBallCoordinates()
// {
// 	if (ball.body.position.x + ball.Radius >= paddle1.body.position.x - paddle1.Width / 2)
// 		if (ball.body.position.z >= paddle1.body.position.z - 2.25 && ball.body.position.z <= paddle1.body.position.z + 2.25)
// 			updateZCoordinates(paddle1.body.position.z)
// 		else
// 		{
// 			ball.body.position.set(0, 0.35, 0)
// 			ball.xFactor = 0.15
// 			ball.zFactor = 0.03
// 			ball.speed = 1.3
// 		}
// 	if (ball.body.position.x - ball.Radius <= paddle2.body.position.x + paddle1.Width / 2)
// 		if (ball.body.position.z >= paddle2.body.position.z - 2.25 && ball.body.position.z <= paddle2.body.position.z + 2.25)
// 			updateZCoordinates(paddle2.body.position.z)
// 		else
// 		{
// 			ball.body.position.set(0, 0.35, 0)
// 			ball.xFactor = 0.15
// 			ball.zFactor = 0.03
// 			ball.speed = 1.3
// 		}
// }
// prepare data (ball and paddles position) to send to backend

function prepareBackendData()
{
console.log(ball.body.position.x, ball.body.position.z)
	return {
		"ball": [ball.body.position.x, ball.body.position.z, ball.Radius],
		"paddle1": [paddle1.body.position.x, paddle1.body.position.z, paddle1.score],
		"paddle2": [paddle2.body.position.x, paddle2.body.position.z, paddle2.score],
		"paddle": [paddle1.Height, paddle1.Width],
		"x_factor": ball.xFactor,
		"z_factor": ball.zFactor,
		"speed": ball.speed
	}
}
// connect to the server parse data and then send it, get back the response
function sendDataToBackend() {
  const data = prepareBackendData()
	// console.log(data)

  fetch('http://localhost:8000/pong_game/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(response => {
      if (response.ok) {
        return response.json()
      } else {
        throw new Error(`Network response was not ok: ${response.status}`)
      }
    })
    .then(data => {
      // console.log(data)
		updateGame(data)
    })
    .catch(error => {
      console.error('Error:', error)
    })
}
// update ball properties based on the data calculated in the backend
function updateGame(data) {
	ball.xFactor = data['xFactor']
	ball.zFactor = data['zFactor']
	ball.speed = data['speed']
}
function	animate() {
	requestAnimationFrame( animate )
	ball.body.position.x += ball.xFactor * ball.speed
	ball.body.position.z += ball.zFactor * ball.speed
	if (ball.body.position.z + (ball.Radius / 2) >= arena.Height / 2 || ball.body.position.z - (ball.Radius / 2) <= -(arena.Height / 2))
		ball.zFactor *= -1
	// updateBallCoordinates()
	sendDataToBackend()
	renderer.render(scene, camera)
}
animate()
