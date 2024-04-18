from django.db import models


class Ingredient(models.Model):
    ingredient = models.CharField(max_length=255)
