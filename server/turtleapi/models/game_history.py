from django.db import models


class GameHistory(models.Model):
    day = models.DateTimeField()
    employee = models.ForeignKey(
        'Employee', on_delete=models.CASCADE, related_name='games'
    )
