from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
# Create your views here.

# increment zfactor depending on ball and paddle collision
# change x direction and add speed
def updateBallProperties(ball, collision):
	ball.xFactor *= -1
	ball.zFactor = ball.zFactor + (0.03 * collision)
	if ball.speed <= 2.4:
		ball.speed = ball.speed + 0.1


def collisionCalculator(ball, paddleZpos, paddleHeight):
	collision = ball.ZPos - paddleZpos
	if (collision <= (paddleHeight / 2)) and (collision >= -(paddleHeight / 2)):
		print('++++++++++++++++++++')
		updateBallProperties(ball, collision)
	else:
		print('---------------------')
		ball.xPos = 0
		ball.zPos = 0
		ball.speed = 1.3
		ball.xFactor = 0.15
		ball.zFactor = 0.03


# determine the presence of collision and update ball properties
# if no collision is present reset ball properties and position
def collisionDetecter(data, ball):
	paddleXPos = data['paddleXPos']
	paddleZPos = data['paddleZPos']
	paddleHeight = data['paddleHeight']
	paddleWidth = data['paddleWidth']
	if paddleXPos > 0:
		if ball.xPos + ball.radius >= paddleXPos - paddleWidth:
			collisionCalculator(ball, paddleZPos, paddleHeight)
	else:
		if ball.xPos - ball.radius <= paddleXPos + paddleWidth:
			collisionCalculator(ball, paddleZPos, paddleHeight)

class Ball:
	xPos = 0
	zPos = 0
	radius = 0.425
	zFactor = 0.03
	xFactor = 0.15
	speed = 1.3

@api_view(['POST'])
def frontendPortal(request):
	ball = Ball()
	collisionDetecter(data=request.data, ball=ball)
	ball.xPos += ball.xFactor * ball.speed
	ball.zPos += ball.zFactor * ball.speed
	data = {'ballXPos': ball.xPos, 'ballZPos': ball.zPos}
	print('data: ', data)
	return Response(data=data, status=status.HTTP_200_OK)

