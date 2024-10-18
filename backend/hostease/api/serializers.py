from rest_framework import serializers

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from hostease.models import InfoEntreprise, Offre, CustomUser

from django.utils import timezone
from backend import settings


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Ajoutez des informations supplémentaires au token
        token['role'] = user.role  # Ajoute le rôle de l'utilisateur au token
        token['email'] = user.email  # Ajoute l'email de l'utilisateur au token
        token['nom'] = user.nom  # Ajoute le nom de l'utilisateur au token
        token['is_staff'] = user.is_staff
        token['id'] = user.id

        return token

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['email', 'nom', 'password']  # Champs nécessaires à l'inscription
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user

class InfoEntrepriseSerializer(serializers.ModelSerializer):
    class Meta:
        model = InfoEntreprise
        fields = '__all__'

    def update(self, instance, validated_data):
        # Mettre à jour tous les champs sauf 'logo' s'il n'est pas dans validated_data
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class OffreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offre
        fields = ['id', 'nom_offre', 'prix', 'description']

