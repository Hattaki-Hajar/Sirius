import asyncio
import json
from .game import gameManager
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer


class GameConsumer(AsyncWebsocketConsumer):
	def __init__(self):
		self.gameManager = gameManager(self)
		self.groups = []
		self.connectedPlayers = 0

	async def connect(self):
		print("connect")
		self.channel_layer = get_channel_layer()
		await self.accept()
		await self.channel_layer.group_add("test", self.channel_name)
		# self.connectedPlayers += 1
		await self.channel_layer.group_send(
			"test",
			{"type": "playerCountUpdate", "count": 1}
		)
		if self.connectedPlayers == 2:
			asyncio.create_task(self.gameManager.gameLoop())

	async def receive(self, text_data):
		try:
			data = json.loads(text_data)
		except json.JSONDecodeError:
			print("Invalid JSON data received:", text_data)
			return
		if data["nb"] == 1:
			if data["direction"] == "up":
				self.gameManager.game.player1.zPos += 0.9
			else:
				self.gameManager.game.player1.zPos -= 0.9
		elif data["nb"] == 2:
			if data["direction"] == "up":
				self.gameManager.game.player2.zPos += 0.9
			else:
				self.gameManager.game.player2.zPos -= 0.9
	
	async def	sendUpdate(self, data):
		await self.channel_layer.group_send(
			"test",
			{"type": "gameUpdate", "data": data}
		)

	async def	gameUpdate(self, event):
		data = event["data"]
		await self.send(text_data=json.dumps(data))


	async def playerCountUpdate(self, event):
		self.connectedPlayers += event["count"]
		if self.connectedPlayers % 2 == 0:
			asyncio.create_task(self.gameManager.gameLoop())
