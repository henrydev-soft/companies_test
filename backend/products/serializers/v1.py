from rest_framework import serializers
from ..models import Product, Currency, ProductCurrencyPrice

# Serializador para Currency
class CurrencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Currency
        fields = ['iso_code', 'name', 'symbol']  # Campos públicos
        read_only_fields = ['iso_code']  # Ejemplo de campo no editable

# Serializador para ProductCurrencyPrice (incluye Currency anidado)
class ProductCurrencyPriceSerializer(serializers.ModelSerializer):
    currency = CurrencySerializer(read_only=True)  # Anidado para lectura
    currency_iso_code = serializers.CharField(write_only=True)  # Para crear/actualizar

    class Meta:
        model = ProductCurrencyPrice
        fields = ['product', 'currency', 'currency_iso_code', 'price']
        extra_kwargs = {
            'product': {'required': False}  # Puede asignarse automáticamente
        }

    def create(self, validated_data):
        # Manejar creación con currency_iso_code en lugar de objeto Currency
        iso_code = validated_data.pop('currency_iso_code')
        currency = Currency.objects.get(iso_code=iso_code)
        return ProductCurrencyPrice.objects.create(currency=currency, **validated_data)

# Serializador para Product (incluye precios en todas las monedas)
class ProductSerializer(serializers.ModelSerializer):
    prices = ProductCurrencyPriceSerializer(
        many=True, 
        source='productcurrencyprice_set', 
        read_only=True
    )
    company_name = serializers.CharField(source='company.name', read_only=True)

    class Meta:
        model = Product
        fields = [
            'code', 
            'name', 
            'characteristics', 
            'created_at', 
            'company', 
            'company_name',
            'prices'
        ]
        read_only_fields = ['created_at']
        extra_kwargs = {
            'company': {'write_only': True}  # Evita duplicar datos en la respuesta
        }