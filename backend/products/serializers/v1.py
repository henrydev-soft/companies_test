from rest_framework import serializers
from ..models import Product, Currency, ProductCurrencyPrice
from django.db import transaction

# Serializador para Currency
class CurrencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Currency
        fields = ['id','iso_code', 'name', 'symbol']
        read_only_fields = ['iso_code', 'name', 'symbol']

# Serializador para ProductCurrencyPrice (incluye Currency anidado)
class ProductCurrencyPriceSerializer(serializers.ModelSerializer):
    # Anidado para lectura
    currency = CurrencySerializer(read_only=True)
    # Para escritura/actualizacion, se usa el ID de la moneda
    currency_id = serializers.PrimaryKeyRelatedField(
        queryset=Currency.objects.all(), 
        source='currency',               # Mapea este campo de entrada al campo 'currency' del modelo ProductCurrencyPrice
        write_only=True,                 # Solo para escritura, no se muestra en la salida JSON
        required=True                    # El ID de la moneda es obligatorio al crear un precio
    )

    class Meta:
        model = ProductCurrencyPrice
        fields = ['id', 'price', 'currency', 'currency_id']
        extra_kwargs = {
             'product': {'required': False, 'write_only': True}   # Puede asignarse automáticamente
        }

# Serializador para Product (incluye precios en todas las monedas)
class ProductSerializer(serializers.ModelSerializer):
    prices = ProductCurrencyPriceSerializer(
        many=True, 
        source='productcurrencyprice_set', 
        required=False,
    )

    company_name = serializers.CharField(source='company.name', read_only=True)
    created_by = serializers.PrimaryKeyRelatedField(read_only=True)
    company_nit = serializers.CharField(source='company.nit', read_only=True)

    class Meta:
        model = Product
        fields = [
            'code', 
            'name', 
            'characteristics', 
            'created_at', 
            'company', 
            'company_name',
            'company_nit',
            'created_by',
            'prices'
        ]
        read_only_fields = ['created_at', 'created_by', 'company_name', 'company_nit']
        extra_kwargs = {
            'company': {'write_only': False, 'required':False} # Sigue siendo write_only para la entrada (ID de empresa)
        }
    
    # Métodos personalizados para manejar la creación de productos y sus precios anidados
    def create(self, validated_data):
        # Extraer los datos de los precios antes de crear el producto
        # `productcurrencyprice_set` es el nombre del source que definimos para `prices`
        prices_data = validated_data.pop('productcurrencyprice_set', [])
        
        # Realizar la creación del producto y sus precios de forma atómica
        with transaction.atomic():
            product = Product.objects.create(**validated_data)
            for price_data in prices_data:
                # `price_data` ya incluye `currency` (el objeto Currency) gracias al `source='currency'`
                ProductCurrencyPrice.objects.create(product=product, **price_data)
        return product

    # Métodos personalizados para manejar la actualización de productos y sus precios anidados
    def update(self, instance, validated_data,  **kwargs):
        # Extraer los datos de los precios para gestionarlos por separado
        prices_data = validated_data.pop('productcurrencyprice_set', [])
        # Perfom_update lo maneja, no necesitamos el campo company aquí
        company_obj = kwargs.get('company')
        if company_obj:
            instance.company = company_obj

        # Actualizar los campos directos del producto
        instance.name = validated_data.get('name', instance.name)
        instance.characteristics = validated_data.get('characteristics', instance.characteristics)
        # Asume que `company` y `created_by` no se actualizan por aquí
        instance.save()

        # Gestionar los precios anidados:
        # 1. Obtener los IDs de los precios enviados en la petición (para identificar existentes)
        sent_price_ids = {price.get('id') for price in prices_data if price.get('id') is not None}
        
        # 2. Eliminar precios existentes del producto que NO fueron enviados en la petición
        # Esto maneja la eliminación de precios
        for existing_price in instance.productcurrencyprice_set.all():
            if existing_price.id not in sent_price_ids:
                existing_price.delete()

        # 3. Crear nuevos precios o actualizar precios existentes
        for price_data in prices_data:
            price_id = price_data.get('id')
            if price_id:
                # Intentar actualizar un precio existente
                try:
                    price_instance = ProductCurrencyPrice.objects.get(id=price_id, product=instance)
                    # Actualizar solo los campos que están en price_data
                    for attr, value in price_data.items():
                        setattr(price_instance, attr, value)
                    price_instance.save()
                except ProductCurrencyPrice.DoesNotExist:
                    # Esto indica un ID de precio inválido o que no pertenece a este producto.
                    # Se podría registrar un error, ignorarlo o lanzar una excepción de validación.
                    # Por simplicidad, lo ignoramos.
                    pass 
            else:
                # Si no tiene ID, es un nuevo precio a crear
                ProductCurrencyPrice.objects.create(product=instance, **price_data)
        
        return instance