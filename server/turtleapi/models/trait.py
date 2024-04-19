from django.db import models


class Trait(models.Model):
    trait = models.CharField(max_length=255)
