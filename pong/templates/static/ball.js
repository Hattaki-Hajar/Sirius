import * as THREE from 'three'
// import { scene } from "./game.js"

// create the ball
export class Ball {
	constructor() {
		this.Radius = 0.425
		this.Geometry = new THREE.SphereGeometry(this.Radius)
		this.Material = new THREE.MeshStandardMaterial({color: 0xFFFFFF})
		this.body = new THREE.Mesh(this.Geometry, this.Material)
		this.body.position.y = this.Radius
	}
}
// export const ball = new Ball()
// add ball radius to lift the ball to the arena
// scene.add(ball.body)