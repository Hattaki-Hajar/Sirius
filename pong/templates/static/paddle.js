import * as THREE from 'three'
import { loader, arena, scene } from "./game.js"

// create paddles
export class Paddle {
	constructor(scene, playerNb) {
		this.Width = 1
		this.Height = 4
		this.Geometry = new THREE.BoxGeometry(this.Width, this.Height)
		this.Material = new THREE.MeshStandardMaterial({ color: 0x5E0707 })
		this.body = new THREE.Mesh(this.Geometry, this.Material)
		this.score = 0
		this.model = null
		this.scoreModel = null
		const paddleTexture = new URL('../assets/container.glb', import.meta.url)
		const zero = new URL('../assets/zero.glb', import.meta.url)
		const one = new URL('../assets/one.glb', import.meta.url)
		const two = new URL('../assets/two.glb', import.meta.url)
		const three = new URL('../assets/three.glb', import.meta.url)
		const four = new URL('../assets/four.glb', import.meta.url)
		this.scores = [zero, one, two, three, four]
		this.playerNb = 0

		if (playerNb === 1) {
			// place paddle in the middle right of the arena and rotate it
			this.body.position.x = arena.Width / 2
			this.body.rotation.x = 0.5 * Math.PI
			// add textures to the paddles
			loader.load(paddleTexture.href, (gltf) => {
				this.model = gltf.scene
				this.model.position.x = 14.6
				this.model.position.z = 0
				this.model.position.y = -0.7
				this.model.scale.set(0.2, 0.3, 0.275)
				scene.add(this.model)
			}, undefined, function (error) {
				console.error(error)
			})
			loader.load(this.scores[0].href, (gltf) => {
				this.scoreModel = gltf.scene
				this.scoreModel.position.x = 15
				this.scoreModel.position.z = 0
				this.scoreModel.position.y = 3
				this.scoreModel.scale.set(2, 2, 2)
				this.scoreModel.rotation.y = Math.PI / 2
				scene.add(this.scoreModel)
			}, undefined, function (error) {
				console.error(error)
			})
		} else {
			// place paddle in the middle left of the arena and rotate it
			this.body.position.x = -(arena.Width / 2)
			this.body.rotation.x = 0.5 * Math.PI
			// add textures to the paddles
			loader.load(paddleTexture.href, (gltf) => {
				this.model = gltf.scene
				this.model.position.x = -15.4
				this.model.position.z = 0
				this.model.position.y = -0.7
				this.model.scale.set(0.2, 0.3, 0.275)
				scene.add(this.model)
			}, undefined, function (error) {
				console.error(error)
			})
			loader.load(this.scores[0].href, (gltf) => {
				this.scoreModel = gltf.scene
				this.scoreModel.position.x = -15
				this.scoreModel.position.z = 0
				this.scoreModel.position.y = 3
				this.scoreModel.scale.set(2, 2, 2)
				this.scoreModel.rotation.y = Math.PI / 2
				scene.add(this.scoreModel)
			}, undefined, function (error) {
				console.error(error)
			})
		}
	}

	// Method to move the paddle model
	moveModel(z) {
		if (this.model) {
			this.model.position.z = z
		}
	}
	ChangeScore(score, nb) {
		if (this.scoreModel) {
			scene.remove(this.scoreModel)
			if (score < 5)
			loader.load(this.scores[score].href, (gltf) => {
				this.scoreModel = gltf.scene
				this.scoreModel.position.x = 15
				this.scoreModel.position.z = 0
				this.scoreModel.position.y = 3
				this.scoreModel.scale.set(2, 2, 2)
				this.scoreModel.rotation.y = Math.PI / 2
				if (nb === 2)
				{
					this.scoreModel.position.x = -15
					this.scoreModel.rotation.y = -Math.PI / 2
				
				}
				scene.add(this.scoreModel)
			}, undefined, function (error) {
				console.error(error)
			})
		}
	}
}
