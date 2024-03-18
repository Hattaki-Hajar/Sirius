from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
import threading
import random
# Create your views here.

# increment zfactor depending on ball and paddle collision
# change x direction and add speed
def updateBallProperties(collision):
	ball.xFactor *= -1
	ball.zFactor += (0.03 * collision)
	if ball.speed <= 2.4:
		ball.speed += 0.1


def collisionCalculator(paddleZpos, paddleHeight):
	collision = ball.zPos - paddleZpos
	if (collision <= (paddleHeight / 2)) and (collision >= -(paddleHeight / 2)):
		updateBallProperties(collision)
	else:
		ball.xPos = 0
		ball.zPos = 0
		ball.speed = 1.3
		ball.xFactor = 0.15
		ball.zFactor = 0.03


# determine the presence of collision and update ball properties
# if no collision is present reset ball properties and position
def collisionDetecter(data):
	paddleXPos = data['paddleXPos']
	paddleZPos = data['paddleZPos']
	paddleHeight = data['paddleHeight']
	paddleWidth = data['paddleWidth']
	if paddleXPos > 0:
		if ball.xPos + ball.radius >= paddleXPos - paddleWidth:
			collisionCalculator(paddleZPos, paddleHeight)
	else:
		if ball.xPos - ball.radius <= paddleXPos + paddleWidth:
			collisionCalculator(paddleZPos, paddleHeight)


class Ball:
	xPos = 0
	zPos = 0
	radius = 0.425
	zFactor = 0.03
	xFactor = 0.1
	if random.randint(0, 10) % 4:
		zFactor *= -1
	if random.randint(0, 10) % 2:
		xFactor *= -1
	speed = 1.3


ball_lock = threading.Lock()
ball = Ball()


def frontendPortal(request):
	collisionDetecter(data=request.data)
	arenaHeight = request.data.get('arenaHeight')
	ball.xPos += ball.xFactor * ball.speed
	ball.zPos += ball.zFactor * ball.speed
	if (ball.zPos + ball.radius) >= (arenaHeight / 2) or (ball.zPos - ball.radius) <= -(arenaHeight / 2):
		ball.zFactor *= -1
	data = {'ballXPos': ball.xPos, 'ballZPos': ball.zPos}
	return data

