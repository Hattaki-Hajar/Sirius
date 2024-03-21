import asyncio
import json
import uuid
from .game import gameManager
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer

games_lock = asyncio.Lock()
games = {}
lobby = []

class GameConsumer(AsyncWebsocketConsumer):
	# group_name = str(uuid.uuid4())
	# print('group name:', group_name)
	def __init__(self):
		self.groups = []

	async def connect(self):
		self.channel_layer = get_channel_layer()
		await self.accept()
		lobby.append(self)
		await self.check_game()

	async def getGroupName(self):
		for group, channel_names in self.channel_layer.groups.items():
			if self.channel_name in channel_names:
				return group
		return None

	async def check_game(self):
		if len(lobby) >= 2:
			await self.start_game()

	async def start_game(self):
		player1 = lobby.pop(0)
		player2 = lobby.pop(0)
		group_name = str(uuid.uuid4())
		group = group_name
		games[group] = gameManager(self, group)
		await self.channel_layer.group_add(group, player1.channel_name)
		await self.channel_layer.group_add(group, player2.channel_name)
		await player1.sendPlayerNumber({'playerNb': 1}, player1.channel_name)
		await player2.sendPlayerNumber({'playerNb': 2}, player2.channel_name)
		asyncio.create_task(games[group].gameLoop())

	async def sendPlayerNumber(self, data, channel_name):
		await self.channel_layer.send(
			channel_name,
			{"type": "playerUpdate", "data": data}
		)
	async def receive(self, text_data):
		try:
			data = json.loads(text_data)
		except json.JSONDecodeError:
			print("Invalid JSON data received:", text_data)
			return
		group = await self.getGroupName()
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

	async def	playerUpdate(self, event):
		data = event["data"]
		await self.send(text_data=json.dumps(data))

	async def disconnect(self, code):
		print('disconnected')
		return await super().disconnect(code)
