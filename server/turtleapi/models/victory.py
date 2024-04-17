from django.db import models


class Victory(models.Model):
    player = models.ForeignKey(
        'Employee', on_delete=models.CASCADE, related_name='victories'
    )
    game = models.ForeignKey(
        'GameHistory', on_delete=models.CASCADE, related_name='victories'
    )
    moves = models.IntegerField()
