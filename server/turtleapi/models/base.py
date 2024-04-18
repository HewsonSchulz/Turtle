from django.db import models


class Base(models.Model):
    base = models.CharField(max_length=255)
