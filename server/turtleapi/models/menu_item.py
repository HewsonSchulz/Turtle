from django.db import models


class MenuItem(models.Model):
    item = models.CharField(max_length=255)
    image_path = models.CharField(max_length=255, null=True, blank=True)
    trait = models.ForeignKey('Trait', on_delete=models.CASCADE, null=True, blank=True)
