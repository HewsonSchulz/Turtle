from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Employee(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    is_admin = models.BooleanField(default=False)
    is_guest = models.BooleanField(default=False)
    date_employed = models.DateTimeField(null=True)
    date_unemployed = models.DateTimeField(null=True, blank=True)
    fav_position = models.ForeignKey(
        'Position', on_delete=models.SET_NULL, related_name='employees', null=True
    )
    fav_food = models.ForeignKey(
        'MenuItem', on_delete=models.SET_NULL, related_name='employees', null=True
    )
    fav_custard = models.ForeignKey(
        'Custard', on_delete=models.SET_NULL, related_name='employees', null=True
    )
    rank = models.ForeignKey(
        'Rank', on_delete=models.SET_NULL, related_name='employees', null=True
    )
