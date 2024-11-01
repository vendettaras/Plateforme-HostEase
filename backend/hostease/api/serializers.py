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
        model = CustomUser  # Remplacez par votre modèle d’utilisateur
        fields = ['id', 'nom', 'email', 'photo']  # Champs que vous voulez permettre de modifier
        extra_kwargs = {
            'id': {'read_only': True}
        }


class InfoEntrepriseSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(read_only=False)  # Changez en False si vous voulez mettre à jour aussi

    class Meta:
        model = InfoEntreprise
        fields = '__all__'


    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', None)

        # Mise à jour des champs de InfoEntreprise
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Mise à jour des données de l'utilisateur
        if user_data:
            user = instance.user

            # Vérifier l'unicité de l'email avant de le mettre à jour
            email = user_data.get('email')
            # if email and CustomUser.objects.exclude(id=user.id).filter(email=email).exists():
            #     raise serializers.ValidationError({'user': {'email': 'Un utilisateur avec cet e-mail existe déjà.'}})
            
            # email = user_data.get('email')
            if email and email != user.email:  # Vérifiez si l'email a changé
                # Si l'email a changé, vérifiez son unicité
                if CustomUser.objects.exclude(id=user.id).filter(email=email).exists():
                    raise serializers.ValidationError({'user': {'email': 'Un utilisateur avec cet e-mail existe déjà.'}})

            for attr, value in user_data.items():
                setattr(user, attr, value)
            user.save()

        return instance



class OffreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offre
        fields = ['id', 'nom_offre', 'prix', 'description']

