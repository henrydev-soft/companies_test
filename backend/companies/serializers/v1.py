from rest_framework import serializers
from ..models import Company

class CompanySerializer(serializers.ModelSerializer):

    class Meta:
        model = Company
        exclude = ['administrator']
    
    def create(self, validated_data):
         # Asigna el usuario logueado como administrator automáticamente
        user = self.context['request'].user
        validated_data['administrator'] = user
        return super().create(validated_data)