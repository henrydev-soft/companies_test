from django.db import models
from companies.models import Company

# Products models module.
class Product(models.Model):
    code = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=256)
    characteristics = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.name} (Code: {self.code})"

class Currency(models.Model):
    iso_code = models.CharField(max_length=8, unique=True) #ISO 4217
    name = models.CharField(max_length=64)
    symbol = models.CharField(max_length=5)

    def __str__(self):
        return f"{self.iso_code} - {self.name}"

class ProductCurrencyPrice(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    currency = models.ForeignKey(Currency, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=18, decimal_places=2)

    class Meta:
        # Composite key
        unique_together = (('product', 'currency'),)
    
    def __str__(self):
        return f"{self.product.name} - {self.currency.iso_code}: {self.price}"