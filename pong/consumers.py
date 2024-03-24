import asyncio
import json
import uuid
from .game import gameManager
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer

games = {}
lobby = []

class GameConsumer(AsyncWebsocketConsumer):
	def __init__(self):
		self.groups = []

	# Connects the consumer to the WebSocket.
	async def connect(self):
		self.channel_layer = get_channel_layer()
		await self.accept()
		lobby.append(self)
		await self.startGame()

	# This method iterates through the channel layer's groups and checks if the current channel name
	# is present in any of the channel names associated with a group. If a match is found, the group
	# name is returned. If no match is found, None is returned.
	async def getGroup(self):
		for group, channel_names in self.channel_layer.groups.items():
			if self.channel_name in channel_names:
				return group
		return None

	# generate a new group name create a new game and add the players to the game group,
	#  and start the game loop
	async def startGame(self):
		if len(lobby) >= 2:
			player1 = lobby.pop(0)
			player2 = lobby.pop(0)
			group_name = str(uuid.uuid4())
			games[group_name] = gameManager(self, group_name)
			await self.channel_layer.group_add(group_name, player1.channel_name)
			await self.channel_layer.group_add(group_name, player2.channel_name)
			await player1.sendPlayerNumber({'playerNb': 1}, player1.channel_name)
			await player2.sendPlayerNumber({'playerNb': 2}, player2.channel_name)
			asyncio.create_task(games[group_name].gameLoop())

	# send the player numbers to the clients
	async def sendPlayerNumber(self, data, channel_name):
		await self.channel_layer.send(
			channel_name,
			{"type": "playerUpdate", "data": data}
		)
	# send player number to each client
	async def	playerUpdate(self, event):
		data = event["data"]
		await self.send(text_data=json.dumps(data))

	# move player up or down depending on the direction received from the client
	async def receive(self, text_data):
		try:
			data = json.loads(text_data)
		except json.JSONDecodeError:
			print("Invalid JSON data received:", text_data)
			return
		group = await self.getGroup()
		if group in games:
			arenaHeight = games[group].game.arenaHeight
			is_player_one = self.channel_name == list(self.channel_layer.groups[group])[0]
			if is_player_one:
				if data["direction"] == "up" and games[group].game.player1.zPos - 1 >= -(arenaHeight / 2):
					games[group].game.player1.zPos -= 1
				elif data["direction"] == "down" and games[group].game.player1.zPos + 1 <= (arenaHeight / 2):
					games[group].game.player1.zPos += 1
			else:
				if data["direction"] == "up" and games[group].game.player2.zPos - 1 >= -(arenaHeight / 2):
					games[group].game.player2.zPos -= 1
				elif data["direction"] == "down" and games[group].game.player2.zPos + 1 <= (arenaHeight / 2):
					games[group].game.player2.zPos += 1

	# send the game update to all the clients
	async def	sendUpdate(self, data, gameID):
		await self.channel_layer.group_send(
			gameID,
			{"type": "gameUpdate", "data": data}
		)

	# send the game update to the client
	async def	gameUpdate(self, event):
		data = event["data"]
		await self.send(text_data=json.dumps(data))

	# send the scores to the clients
	async def gameOver(self, scores, gameID):
		await self.channel_layer.group_send(
			gameID,
			{"type": "sendScores", "data": scores}
		)

	async def sendScores(self, event):
		data = event["data"]
		await self.send(text_data=json.dumps(data))
		await self.close()

	# disconnect the client and send the game over message to the clients
	async def disconnect(self, code):
		group = await self.getGroup()
		await self.channel_layer.group_send(
			group,
			{"type": "forfeit", "data": {"won": "You won by forfeit"}}
		)
		return await super().disconnect(code)
	
	async def forfeit(self, event):
		data = event["data"]
		await self.send(text_data=json.dumps(data))
		await self.close()
