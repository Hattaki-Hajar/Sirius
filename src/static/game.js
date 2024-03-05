import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

// create renderer to display scenes using WebGL
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
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
const arenaGeo = new THREE.PlaneGeometry(30, 20)
const arenaMat = new THREE.MeshBasicMaterial({color: 0xFFFFFF, side: THREE.DoubleSide})
const arena = new THREE.Mesh(arenaGeo, arenaMat)
arena.rotation.x = -0.5 * Math.PI
// console.log(arena.position.x, arena.position.y, arena.position.z)
scene.add(arena)

// create the ball
const ballGeo = new THREE.SphereGeometry(0.35)
const ballMat = new THREE.MeshBasicMaterial({color: 0xA94064})
const ball = new THREE.Mesh(ballGeo, ballMat)
ball.position.y = 0.35
scene.add(ball)

// create paddles
const paddleGeo = new THREE.BoxGeometry(1, 4)
const paddleMat = new THREE.MeshBasicMaterial({color: 0x8B0000})

const paddle1 = new THREE.Mesh(paddleGeo, paddleMat)
paddle1.position.x = 15
paddle1.rotation.x = 0.5 * Math.PI
scene.add(paddle1)

const paddle2 = new THREE.Mesh(paddleGeo, paddleMat)
paddle2.position.x = -15
paddle2.rotation.x = 0.5 * Math.PI
scene.add(paddle2)

document.addEventListener('keydown', KeyDown)
function KeyDown(event) {
	let keycode = event.which
	if (keycode == 39 && paddle1.position.z - 2 > -10)
		paddle1.position.z -= 0.5
	else if (keycode == 37 && paddle1.position.z + 2 < 10)
		paddle1.position.z += 0.5
	else if (keycode == 65 && paddle2.position.z - 2 > -10)
		paddle2.position.z -= 0.5
	else if (keycode == 68 && paddle2.position.z + 2 < 10)
		paddle2.position.z += 0.5
}
let factor = 0.15
function	updateZCoordinates(paddle_pos)
{
	let pos = paddle_pos - ball.position.z
	// console.log(pos)
	// if (pos > 0)
	// 	ball.rotation.z = Math.PI / 2
	// else if (pos < 0)
	// 	ball.rotation.z = - Math.PI / 2
}
function	updateBallCoordinates()
{
	if (ball.position.x >= paddle1.position.x - 0.75)
		if (ball.position.z >= paddle1.position.z - 2 && ball.position.z <= paddle1.position.z + 2)
			factor *= -1
			// updateZCoordinates(paddle1.position.z)
	if (ball.position.x <= paddle2.position.x + 0.75)
		if (ball.position.z >= paddle2.position.z - 2 && ball.position.z <= paddle2.position.z + 2)
			// updateZCoordinates(paddle2.position.z)
			factor *= -1
}
function	animate() {
	ball.position.x += factor
	updateBallCoordinates()
	renderer.render(scene, camera)
}
renderer.setAnimationLoop(animate)

