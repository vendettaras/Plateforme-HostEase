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
        token['photo'] = user.photo.url if user.photo else None

        return token

class CustomUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomUser
        fields = ['id', 'nom', 'email', 'photo' ]


class InfoEntrepriseSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer()

    class Meta:
        model = InfoEntreprise
        fields = '__all__'

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', None)  # Retirer les données de l'utilisateur
        # Mettre à jour tous les champs sauf 'logo' s'il n'est pas dans validated_data
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        # Si les données de l'utilisateur sont fournies, mettez-les à jour
        if user_data:
            # Supposons que vous avez une méthode pour mettre à jour l'utilisateur
            user_serializer = CustomUserSerializer(instance.user, data=user_data)
            if user_serializer.is_valid():
                user_serializer.save()  # Sauvegarder les modifications utilisateur

        instance.save()
        return instance



class OffreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offre
        fields = ['id', 'nom_offre', 'prix', 'description']

