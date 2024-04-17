from django.db import models


class Custard(models.Model):
    name = models.CharField(max_length=255)
    image_path = models.CharField(max_length=255)
