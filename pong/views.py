from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
# Create your views here.

# increment zfactor depending on ball and paddle collision
# change x direction and add speed
def updateBallProperties(xFactor, zFactor, speed, collision):
	xFactor *= -1
	zFactor = zFactor + (0.03 * collision)
	if speed <= 2.4:
		speed = speed + 0.1
	return xFactor, zFactor, speed

# determine the presence of collision and update ball properties
# if no collision is present reset ball properties and position
def collisionCalculator(data):
	Z = 1
	score = 0
	ballPos = data['ball']
	paddle = data['paddle']
	paddleHeight = data.get('paddle_height')
	xFactor = data.get("x_factor")
	zFactor = data.get('z_factor')
	speed = data.get('speed')
	collision = paddle[Z] - ballPos[Z]
	if (ballPos[Z] >= paddle[Z] - (paddleHeight / 2)) and (ballPos[Z] <= paddle[Z] + (paddleHeight / 2)):
		print('++++++++++++++++++++')
		xFactor, zFactor, speed = updateBallProperties(xFactor, zFactor, speed, collision)
	else:
		print('---------------------')
		ballPos = [0, 0]
		xFactor = 0.15
		zFactor = 0.03
		speed = 1.3
		score = 1
	return {'ball': ballPos, 'xFactor': xFactor, 'zFactor': zFactor, 'speed': speed, 'score': score}


@api_view(['POST'])
def frontendPortal(request):
	data = collisionCalculator(data=request.data)
	return Response(data=data, status=status.HTTP_200_OK)

