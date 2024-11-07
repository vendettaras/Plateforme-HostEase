from django.contrib.auth import get_user_model
from rest_framework import serializers

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from hostease.models import InfoEntreprise, Offre, CustomUser, OffreEntreprise

from django.utils import timezone
from backend import settings


from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        # Obtenez le token de base
        token = super().get_token(user)

        # Ajoutez des informations supplémentaires au token
        token['role'] = user.role  # Ajoute le rôle de l'utilisateur au token
        token['email'] = user.email  # Ajoute l'email de l'utilisateur au token
        token['nom'] = user.nom  # Ajoute le nom de l'utilisateur au token
        token['is_staff'] = user.is_staff  # Ajoute l'état "is_staff" au token
        token['id'] = user.id  # Ajoute l'ID de l'utilisateur au token
        token['photo'] = user.photo.url if user.photo else None  # Ajoute l'URL de la photo (si elle existe)

        try:
            # Trouver l'entreprise associée à l'utilisateur
            entreprise = InfoEntreprise.objects.get(user=user)
            token['entreprise_id'] = entreprise.id  # Ajoute l'ID de l'entreprise au token
        except InfoEntreprise.DoesNotExist:
            token['entreprise_id'] = None  # Si l'entreprise n'existe pas, mettre à None

        return token


class CustomUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomUser  # Remplacez par votre modèle d’utilisateur
        fields = '__all__'  # Champs que vous voulez permettre de modifier
        extra_kwargs = {
            'id': {'read_only': True},
        }

    def create(self, validated_data):
        # Récupérer le mot de passe pour le hacher
        password = validated_data.pop('password')

        # Créez un utilisateur en utilisant les données validées (sans le mot de passe pour l'instant)
        user = get_user_model().objects.create(**validated_data)

        # Hachez le mot de passe
        user.set_password(password)

        # Enregistrez l'utilisateur après avoir haché le mot de passe
        user.save()

        return user
    
class InfoEntrepriseInscriptionSerializer(serializers.ModelSerializer):

    class Meta:
        model = InfoEntreprise
        fields = '__all__'


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

class OffreEntreprisePaiementSerializer(serializers.ModelSerializer):
    class Meta:
        model = OffreEntreprise
        fields = '__all__'
        extra_kwargs = {
            'date_begin': {'read_only': True},
            'date_exp' : {'read_only': True}
        }

class OffreEntrepriseSerializer(serializers.ModelSerializer):
    entreprise = InfoEntrepriseSerializer(read_only=False)  # Changez en False si vous voulez mettre à jour aussi
    offre = OffreSerializer(read_only=False)  # Changez en False si vous voulez mettre à jour aussi
    class Meta:
        model = OffreEntreprise
        fields = '__all__'
        extra_kwargs = {
            'date_begin': {'read_only': True},
            'date_exp' : {'read_only': True},
        }

