from django.db import models
from .custard import Custard


class CustardBase(models.Model):
    flavor = models.ForeignKey(Custard, on_delete=models.CASCADE)
    base = models.ForeignKey('Base', on_delete=models.CASCADE)
