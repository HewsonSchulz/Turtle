from django.db import models
from .custard import Custard


class CustardBase(models.Model):
    base = models.CharField(max_length=255)
