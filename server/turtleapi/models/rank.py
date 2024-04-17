from django.db import models


class Rank(models.Model):
    rank = models.CharField(max_length=255)
