from django.db import models
from .custard import Custard


class CustardBase(models.Model):
    flavor = models.ForeignKey(Custard, on_delete=models.CASCADE)
    base = models.CharField(max_length=255)
