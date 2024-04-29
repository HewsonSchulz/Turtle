from django.db import models


class CustardBase(models.Model):
    base = models.CharField(max_length=255)
