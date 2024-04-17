from django.db import models


class Rank(models.Model):
    name = models.CharField(max_length=255)
