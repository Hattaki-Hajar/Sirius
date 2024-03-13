# import json
# from channels.generic.websocket import AsyncWebsocketConsumer
#
# class GameConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         print('++++++++++++++++++++++++connected')
#         # Add the client to a group (optional, for broadcasting)
#         await self.channel_layer.group_add('pong_game', self.channel_name)
#         await self.accept()
#
#     async def disconnect(self, close_code):
#         # Remove the client from the group (optional)
#         await self.channel_layer.group_discard('pong_game', self.channel_name)
#
#     async def receive(self, text_data):
#         data = json.loads(text_data)
#         print('***********************from backend: ', data)
#         # Handle different message types (e.g., ball updates, score changes)
#         # if data['type'] == 'ball_update':
#             # Process ball update logic (optional, could call views)
#             # updated_ball_data = process_ball_update(data['ball_data'])
#             # await self.channel_layer.group_send(
#             #     'pong_game',
#             #     {'type': 'game_update', 'data': updated_ball_data}
#             # )
#         # ... other message handlers ...
#
#     async def game_update(self, event):
#         # Broadcast game update to all connected clients
#         await self.send(text_data=json.dumps(event['data']))
