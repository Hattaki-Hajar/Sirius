import json
from channels.generic.websocket import WebsocketConsumer
from . import views
from asgiref.sync import async_to_sync

class GameConsumer(WebsocketConsumer):
	def connect(self):
		self.room_group_name = 'test'
		async_to_sync(self.channel_layer.group_add)(
			self.room_group_name,
			self.channel_name
		)
		self.accept()


	def receive(self, text_data):
		data = json.loads(text_data)
		datatoSend = views.frontendPortal(data)
		# self.send(text_data=json.dumps(datatoSend))
		async_to_sync(self.channel_layer.group_send)(
			self.room_group_name,
			{
				'type': 'ballUpdate',
				"data": datatoSend
			}
		)
	
	def ballUpdate(self, event):
		data = event['data']
		self.send(text_data=json.dumps({
			'type': 'test',
			'data': data
		}))

