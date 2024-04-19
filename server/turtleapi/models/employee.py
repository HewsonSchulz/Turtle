from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Employee(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date_employed = models.DateTimeField()
    date_unemployed = models.DateTimeField(null=True, blank=True)
    fav_position = models.ForeignKey(
        'Position', on_delete=models.CASCADE, related_name='employees'
    )
    fav_food = models.ForeignKey(
        'MenuItem', on_delete=models.CASCADE, related_name='employees'
    )
    fav_custard = models.ForeignKey(
        'Custard', on_delete=models.CASCADE, related_name='employees'
    )
    rank = models.ForeignKey('Rank', on_delete=models.CASCADE, related_name='employees')
