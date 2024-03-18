import json
from channels.generic.websocket import WebsocketConsumer
from . import views

class GameConsumer(WebsocketConsumer):
    def connect(self):
        print('got in connect')
        self.accept()
        self.send(text_data=json.dumps(
            {'test': 'teeeest'}
        ))

    def receive(self, text_data):
        print('git in receive')
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        print('Message: ', message)
        self.send(text_data=views.frontendPortal(message))

