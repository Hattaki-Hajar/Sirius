// Create a WebSocket connection
// import {io} from "socket.io-client"
// const socket = io('ws://localhost:8000/game/'); // Replace with your WS URL
// import {ball, arena, paddle1, paddle2} from './game.js'
// socket.on('connect', () => {
//     console.log('Connected to WebSocket server');
// });
//
// // Send game updates to the backend
// export function sendBallUpdate(ballData) {
//     socket.emit('ball_update', "test");
// }
//
// // Handle game updates received from the backend
// // socket.on('game_update', (data) => {
// //     // Update local game state and rendering based on received data
// //     // updateBallPosition(data.ball_position);
// // });
//
// // Game loop (simplified)
// // function animate() {
// //     requestAnimationFrame(animate);
// //
// //     // ... update ball position in Three.js ...
// //
// //     // Send ball update to the backend at regular intervals
// //     if (shouldSendUpdate) {
// //         sendBallUpdate({ position: ball.position, velocity: ball.velocity });
// //         shouldSendUpdate = false; // Reset update flag
// //     }
// //
// //     renderer.render(scene, camera);
// // }
