from django.db import models


class MenuItem(models.Model):
    item = models.CharField(max_length=255)
    image_path = models.CharField(max_length=255)
    ingredients = models.ManyToManyField(
        'Ingredient', through='ItemIngredient', related_name='menu_items'
    )
