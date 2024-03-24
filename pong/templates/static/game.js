import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {Arena} from "./arena.js"
import {Paddle} from "./paddle.js"
import {Ball} from "./ball.js"
import {connectToWebSocket, socket} from "./socket.js";
import stars from '../assets/stars0.jpg'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'

// create renderer to display scenes using WebGL
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
window.addEventListener("resize",()=>{
	camera.aspect = window.innerWidth / window.innerHeight
	camera.updateProjectionMatrix()
	renderer.setSize(window.innerWidth, window.innerHeight)
})
document.body.appendChild(renderer.domElement)

export const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(45, window.innerWidth/ window.innerHeight, 0.1, 1000)
const orbit = new OrbitControls(camera, renderer.domElement)

camera.position.set(0, 40, 30)
orbit.update()

// add background to the scene
const cubeTextureLoader = new THREE.CubeTextureLoader()
scene.background = cubeTextureLoader.load([
	stars,
	stars,
	stars,
	stars,
	stars,
	stars
])

// add light from each player side to the scene
const light = new THREE.DirectionalLight(0xFFFFFF)
scene.add(light)
light.position.y += 15
light.position.x += 10
light.intensity = 3
const light2 = new THREE.DirectionalLight(0xFFFFFF)
scene.add(light2)
light2.position.y += 15
light2.position.x -= 10
light2.intensity = 3

// add loader for gltf files
export const loader = new GLTFLoader()

// create game components
export const arena = new Arena(scene)
export const paddle1 = new Paddle(scene, 1)
export const paddle2 = new Paddle(scene, 2)
export const ball = new Ball()
scene.add(ball.body)
scene.add(paddle1.body)
scene.add(paddle2.body)
scene.add(arena.body)

// add earth and ship to the scene
const earthTexture = new URL('../assets/earth.glb', import.meta.url)
loader.load(earthTexture.href, function(gltf) {
	const model = gltf.scene
	model.position.y = 20
	model.position.x = 40
	model.rotation.x = Math.PI / 3
	model.scale.set(50, 50, 50)
	scene.add(model)
}, undefined, function(error) {
	console.error(error)
})

const shipTexture = new URL('../assets/ship2.glb', import.meta.url)
loader.load(shipTexture.href, function(gltf) {
	const model = gltf.scene
	model.position.x = -70
	model.position.z = -30
	model.position.y = -10
	model.rotation.y = Math.PI / 2
	model.rotation.z = -Math.PI / 3
	scene.add(model)
}, undefined, function(error) {
	console.error(error)
})

const ship2Texture = new URL('../assets/ship.glb', import.meta.url)
loader.load(ship2Texture.href, function(gltf) {
	const model = gltf.scene
	model.position.x = -50
	model.position.z = 30
	model.position.y = -10
	model.rotation.y = Math.PI / 2
	model.rotation.z = -Math.PI / 3
	model.rotation.x = Math.PI / 3
	model.scale.set(100, 100, 100)
	scene.add(model)
}, undefined, function(error) {
	console.error(error)
})

// connect to the WebSocket server
connectToWebSocket()

// listen on keydown
document.addEventListener('keydown', KeyDown)

// send data to backend depending on key pressed
function KeyDown(event) {
	let keycode = event.which
	let data = {'direction': ''}
	const playerNb = paddle1.playerNb
	
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