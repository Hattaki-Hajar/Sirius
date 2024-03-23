import * as THREE from 'three'
import { loader, arena } from "./game.js"

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
		const paddleTexture = new URL('../assets/container.glb', import.meta.url)
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
			});
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
			});
		}
	}

	// Method to move the paddle model
	moveModel(z) {
		if (this.model) {
			this.model.position.z = z
		}
	}
}
