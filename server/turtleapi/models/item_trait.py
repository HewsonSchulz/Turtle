from django.db import models


class ItemTrait(models.Model):
    item = models.ForeignKey('MenuItem', on_delete=models.CASCADE)
    trait = models.ForeignKey('Trait', on_delete=models.CASCADE)
