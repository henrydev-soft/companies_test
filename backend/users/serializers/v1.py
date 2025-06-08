# users/serializers.py
from rest_framework import serializers
from django.contrib.auth import authenticate
from django.utils.translation import gettext_lazy as _

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            user = authenticate(request=self.context.get('request'), email=email, password=password)
            if not user:
                msg = _('No se pudo autenticar con las credenciales proporcionadas.')
                raise serializers.ValidationError(msg, code='authorization')
        else:
            msg = _('Debe incluir email y contraseña.')
            raise serializers.ValidationError(msg, code='authorization')

        attrs['user'] = user
        return attrs
