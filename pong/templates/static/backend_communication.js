import {ball, paddle1, paddle2} from './game.js'

// prepare paddle position and geometry to send to backend
function prepareBackendData(player_nb)
{
	let data = {}
	if (player_nb === 1)
		data = {
			"paddleXPos": paddle1.body.position.x,
			"paddleZPos": paddle1.body.position.z,
			"paddleHeight": paddle1.Height,
			"paddleWidth": paddle1.Width
		}
	else
		data = {
			"paddleXPos": paddle2.body.position.x,
			"paddleZPos": paddle2.body.position.z,
			"paddleHeight": paddle2.Height,
			"paddleWidth": paddle2.Width
		}
	return data
}
// connect to the server parse data and then send it, get back the response
export function sendDataToBackend(player_nb) {
  const data = prepareBackendData(player_nb)

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
		updateGame(data, player_nb)
    })
    .catch(error => {
      console.error('Error:', error)
    })
}
// update ball position based on the data calculated in the backend
function updateGame(data, player_nb) {
	ball.body.position.x = data['ballXPos']
	ball.body.position.z = data['ballZPos']
	console.log('ballX: ', ball.body.position.x)
	console.log('ballZ: ', ball.body.position.z)
}