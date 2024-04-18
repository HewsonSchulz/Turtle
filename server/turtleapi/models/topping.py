from django.db import models


class Topping(models.Model):
    topping = models.CharField(max_length=255)
