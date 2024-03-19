# from django.db import models
# from django.core.validators import MinLengthValidator

# Create your models here.


# class Player(models.Model):
#     name = models.CharField(max_length=100, validators=[MinLengthValidator(2)], unique=True)
#     score = models.IntegerField(default=0)

#     def create(cls, name):
#         player = cls(name=name)
#         return player

# class Game(models.Model):
#     player1 = models.ForeignKey(Player, on_delete=models.CASCADE)
#     player2 = models.ForeignKey(Player, on_delete=models.CASCADE)
#     state = models.JSONField()
#
#     def create(cls, player1, player2):
#         p1 = Player.create(player1)
#         p2 = Player.create(player2)
#         player1 = p1
#         player2 = p2
#         state = {}
