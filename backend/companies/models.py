from django.db import models
from django.conf import settings


#Companies models module.
class Company(models.Model):
    nit = models.BigIntegerField(primary_key=True)
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=500)
    phone = models.CharField(max_length=30)
    created_at = models.DateTimeField(auto_now_add=True)
    administrator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.DO_NOTHING)

    def __str__(self):
        return self.name