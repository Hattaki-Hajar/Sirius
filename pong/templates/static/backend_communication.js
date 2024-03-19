import {arena, ball, paddle1, paddle2} from './game.js'
// prepare paddle position and geometry to send to backend
export function prepareBackendData(player_nb)
{
	let data = {}
	if (player_nb === 1)
		data = {
			"paddleXPos": paddle1.body.position.x,
			"paddleZPos": paddle1.body.position.z,
			"paddleHeight": paddle1.Height,
			"paddleWidth": paddle1.Width,
			"arenaHeight": arena.Height,
		}
	else
		data = {
			"paddleXPos": paddle2.body.position.x,
			"paddleZPos": paddle2.body.position.z,
			"paddleHeight": paddle2.Height,
			"paddleWidth": paddle2.Width,
			"arenaHeight": arena.Height,
		}
	return data
}

// update ball position based on the data calculated in the backend
export function updateGame(data) {
	// console.log('data from backend:', data)
	ball.body.position.x = data['ballXPos']
	ball.body.position.z = data['ballZPos']
	paddle1.body.position.z = data['player1ZPos']
	paddle2.body.position.z = data['player2ZPos']
}