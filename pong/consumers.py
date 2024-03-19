import asyncio
import json
from .game import gameManager
from channels.generic.websocket import AsyncWebsocketConsumer


class GameConsumer(AsyncWebsocketConsumer):
    def __init__(self):
        self.gameManager = gameManager(self)
        self.groups = []

    async def connect(self):
        print('connect')
        await self.accept()
        asyncio.create_task(self.gameManager.gameLoop())

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
        except json.JSONDecodeError:
            print('Invalid JSON data received:', text_data)
            return
        if data['nb'] == 1:
            if data['direction'] == 'up':
                self.gameManager.game.player1.zPos += 0.9
            else:
                self.gameManager.game.player1.zPos -= 0.9
        elif data['nb'] == 2:
            if data['direction'] == 'up':
                self.gameManager.game.player2.zPos += 0.9
            else:
                self.gameManager.game.player2.zPos -= 0.9