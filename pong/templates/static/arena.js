import * as THREE from 'three'
import { loader } from "./game.js"

// create the arena
export class Arena {
	constructor(scene) {
		this.Height = 22
		this.Width = 30
		this.Geometry = new THREE.PlaneGeometry(this.Width, this.Height)
		this.Material = new THREE.MeshStandardMaterial({color: 0x0F0F0F, side: THREE.DoubleSide})
		this.body = new THREE.Mesh(this.Geometry, this.Material)
		// rotating the arena
		this.body.rotation.x = 0.5 * Math.PI
	
		// add textures to the arena
		const arenaTexture = new URL('../assets/arena.glb', import.meta.url)
		loader.load(arenaTexture.href, function(gltf) {
			const model = gltf.scene
			model.position.z = 11
			model.position.x = -15
			model.rotation.x = -Math.PI / 2
			model.scale.set(0.15, 0.11, 0.01)
			scene.add(model)
		}, undefined, function(error) {
			console.error(error)})
		}
}
// export const arena = new Arena()
// scene.add(arena.body)


