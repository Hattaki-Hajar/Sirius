import asyncio
import json
import random
# Create your views here.

# increment zfactor depending on ball and paddle collision
# change x direction and add speed
def updateBallProperties(game, collision):
	game.ball.xFactor *= -1
	game.ball.zFactor += (0.03 * collision)
	if game.ball.speed <= 2.4:
		game.ball.speed += 0.1


def collisionCalculator(game, player):
	collision = game.ball.zPos - player.zPos
	if (collision <= (player.Height / 2)) and (collision >= -(player.Height / 2)):
		updateBallProperties(game, collision)
	else:
		game.ball.xPos = 0
		game.ball.zPos = 0
		game.ball.speed = 1.3
		game.ball.xFactor = 0.1
		game.ball.zFactor = 0.03
		player.score += 1


# determine the presence of collision and update ball properties
# if no collision is present reset ball properties and position
def collisionDetecter(game, nb):
	paddleWidth = game.player1.Width
	if nb == 1:
		if game.ball.xPos + game.ball.radius >= game.player1.xPos - paddleWidth:
			collisionCalculator(game, game.player1)
	else:
		if game.ball.xPos - game.ball.radius <= game.player2.xPos + paddleWidth:
			collisionCalculator(game, game.player2)


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

class Player:
	def __init__(self, nb):
		self.zPos = 0
		self.xPos = 15
		if nb == 2:
			self.xPos *= -1
		self.score = 0
		self.Height = 4.5
		self.Width = 1

class Game:
	ball = Ball()
	player1 = Player(1)
	player2 = Player(2)
	arenaHeight = 22.5
	arenaWidth = 30


class gameManager:
	def __init__(self, Gameconsumer):
		self.game = Game()
		self.consumer = Gameconsumer

	async def gameLoop(self):
		while True:
			collisionDetecter(self.game, 1)
			collisionDetecter(self.game, 2)
			self.game.ball.xPos += self.game.ball.xFactor * self.game.ball.speed
			self.game.ball.zPos += self.game.ball.zFactor * self.game.ball.speed
			if (self.game.ball.zPos + self.game.ball.radius) >= (self.game.arenaHeight / 2) or (
					self.game.ball.zPos - self.game.ball.radius) <= -(self.game.arenaHeight / 2):
				self.game.ball.zFactor *= -1
			data = {'ballXPos': self.game.ball.xPos, 'ballZPos': self.game.ball.zPos,
 					'player1ZPos': self.game.player1.zPos, 'player2ZPos': self.game.player2.zPos}
			await self.send_game_update(data)
			await asyncio.sleep(0.01)

	async def send_game_update(self, data):
		await self.consumer.send(text_data=json.dumps(data))