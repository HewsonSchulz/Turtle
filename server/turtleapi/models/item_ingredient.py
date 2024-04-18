from django.db import models


class ItemIngredient(models.Model):
    item = models.ForeignKey('MenuItem', on_delete=models.CASCADE)
    ingredient = models.ForeignKey('Ingredient', on_delete=models.CASCADE)
