from django.db import models
from .custard import Custard


class CustardTopping(models.Model):
    flavor = models.ForeignKey(Custard, on_delete=models.CASCADE)
    topping = models.ForeignKey('Topping', on_delete=models.CASCADE)
