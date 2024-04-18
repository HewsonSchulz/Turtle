from django.db import models


class Custard(models.Model):
    flavor = models.CharField(max_length=255)
    image_path = models.CharField(max_length=255, null=True, blank=True)
    bases = models.ManyToManyField(
        'Base', through='CustardBase', related_name='custards'
    )
    toppings = models.ManyToManyField(
        'Topping', through='CustardTopping', related_name='custards'
    )
