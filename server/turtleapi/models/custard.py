from django.db import models


class Custard(models.Model):
    creator_id = models.IntegerField(default=1)
    flavor = models.CharField(max_length=255)
    base = models.ForeignKey('CustardBase', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='flavors', null=True, blank=True)
    toppings = models.ManyToManyField(
        'Topping', through='CustardTopping', related_name='custards'
    )
