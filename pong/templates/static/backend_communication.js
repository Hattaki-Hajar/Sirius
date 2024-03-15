import {ball, paddle1, paddle2} from './game.js'

// prepare data (ball and paddle position) to send to backend
function prepareBackendData(player_nb)
{
	data = {
		"ball": [ball.body.position.x, ball.body.position.z],
		"paddle": [],
		"paddle_height": paddle1.Height,
		"x_factor": ball.xFactor,
		"z_factor": ball.zFactor,
		"speed": ball.speed
	}
	if (player_nb === 1)
		data["paddle"] = [paddle1.body.position.x, paddle1.body.position.z]
	else
		data["paddle"] = [paddle2.body.position.x, paddle2.body.position.z]
	return data
}
// connect to the server parse data and then send it, get back the response
export function sendDataToBackend(player_nb) {
  const data = prepareBackendData(player_nb)
	console.log('data to send:', data)

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
// update ball properties based on the data calculated in the backend
function updateGame(data, player_nb) {
	ball.xFactor = data['xFactor']
	ball.zFactor = data['zFactor']
	ball.speed = data['speed']
	ball.body.position.x = data['ball'][0]
	ball.body.position.z = data['ball'][1]
	if (player_nb === 1)
		paddle1.score += data['score']
	else
		paddle2.score += data['score']
}