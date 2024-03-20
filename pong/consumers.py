import asyncio
import json
import uuid
from .game import gameManager
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer

games_lock = asyncio.Lock()
games = {}

class GameConsumer(AsyncWebsocketConsumer):
	group_name = str(uuid.uuid4())
	print('group name:', group_name)
	def __init__(self):
		self.groups = []
		self.connectedPlayers = 0

	async def connect(self):
		print("connect")
		self.channel_layer = get_channel_layer()
		await self.accept()
		await self.channel_layer.group_add(self.group_name, self.channel_name)
		await self.channel_layer.group_send(
			self.group_name,
			{"type": "playerCountUpdate", "count": 1}
		)

	async def getGroupName(self):
		for group, channel_names in self.channel_layer.groups.items():
			if self.channel_name in channel_names:
				return group
		return None

	async def receive(self, text_data):
		try:
			data = json.loads(text_data)
		except json.JSONDecodeError:
			print("Invalid JSON data received:", text_data)
			return
		group = await self.getGroupName()
		print(group, ':*****')
		print('games', games)
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


	async def	sendUpdate(self, data, gameID):
		await self.channel_layer.group_send(
			gameID,
			{"type": "gameUpdate", "data": data}
		)

	async def	gameUpdate(self, event):
		data = event["data"]
		await self.send(text_data=json.dumps(data))


	async def playerCountUpdate(self, event):
		self.connectedPlayers += event["count"]
		if self.connectedPlayers == 2:
			print('in connected players')
			games[self.group_name] = gameManager(self, self.group_name)
			player1_channel_name = list(self.channel_layer.groups[self.group_name])[0]
			player2_channel_name = list(self.channel_layer.groups[self.group_name])[1]
			if self.channel_name == player1_channel_name:
				games[self.group_name].player1 = self
				asyncio.create_task(self.sendPlayerNumber({'playerNb': 1}, player1_channel_name))
				asyncio.create_task(self.sendPlayerNumber({'playerNb': 2}, player2_channel_name))
			else:
				games[self.group_name].player2 = self
				asyncio.create_task(self.sendPlayerNumber({'playerNb': 1}, player1_channel_name))
				asyncio.create_task(self.sendPlayerNumber({'playerNb': 2}, player2_channel_name))
			asyncio.create_task(games[self.group_name].gameLoop())
			self.connectedPlayers = 0
			self.group_name = str(uuid.uuid4())

	async def sendPlayerNumber(self, data, channel_name):
		await self.channel_layer.send(
			channel_name,
			{"type": "playerUpdate", "data": data}
		)

	async def	playerUpdate(self, event):
		data = event["data"]
		await self.send(text_data=json.dumps(data))

	async def disconnect(self, code):
		print('disconnected')

		return await super().disconnect(code)
	
