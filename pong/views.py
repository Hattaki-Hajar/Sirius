from rest_framework import views
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
import json
# Create your views here.


def updateBallProperties(xFactor, zFactor, speed, collision):
	xFactor *= -1
	# zFactor = 0.03
	if zFactor < 0.09:
		zFactor = zFactor + (0.03 * collision)
	if speed < 2.4:
		speed = speed + 0.1


def	collisionCalculator(data):
	X = 0
	Z = 1
	ballPos = data['ball']
	print('ballpos: ', ballPos)
	paddle1 = data['paddle1']
	paddle2 = data['paddle2']
	paddleGeo = data['paddle']
	xFactor = data.get("x_factor")
	zFactor = data.get('zFactor')
	speed = data.get('speed')
	if ballPos[X] + ballPos[2] >= paddle1[X] - (paddleGeo[1] / 2):
		if (ballPos[Z] >= paddle1[Z] - (paddleGeo[0] / 2)
				and ballPos[Z] <= paddle1[Z] + (paddleGeo[1] / 2)):
			updateBallProperties(xFactor, zFactor, speed, (paddle1[Z] - ballPos[Z]))
		else:
			ballPos = [0, 0, ballPos[2]]
			zFactor = 0.03
			xFactor = 0.15
			speed = 1.3
	if ballPos[X] - ballPos[2] <= paddle2[X] + (paddleGeo[1] / 2):
		if (ballPos[Z] >= paddle1[Z] - (paddleGeo[0] / 2)
				and ballPos[Z] <= paddle2[Z] + (paddleGeo[1] / 2)):
			updateBallProperties(xFactor, zFactor, speed, (paddle1[Z] - ballPos[Z]))
		else:
			ballPos = [0, 0, ballPos[2]]
			zFactor = 0.03
			xFactor = 0.15
			speed = 1.3

@api_view(['POST'])
def frontendPortal(request):
	collisionCalculator(data=request.data)
	return Response(data={'ball': [5, 2]}, status=status.HTTP_200_OK)

