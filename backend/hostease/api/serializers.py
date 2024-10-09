from rest_framework import serializers
from hostease.models import Entreprise, Offre

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from django.contrib.auth import get_user_model
from rest_framework.exceptions import ValidationError



User = get_user_model()

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['mail'] = user.mail  # Ajouter le mail au token
        token['is_staff'] = user.is_staff
        return token

    def validate(self, attrs):
        # Récupérer l'utilisateur via l'adresse e-mail
        try:
            user = User.objects.get(mail=attrs['mail'])
        except User.DoesNotExist:
            raise ValidationError("Aucun compte actif trouvé avec ces informations.")

        # Vérifier le mot de passe
        if not user.check_password(attrs['password']):
            raise ValidationError("Aucun compte actif trouvé avec ces informations.")

        # Si les informations sont correctes, générer et retourner le token
        data = super().validate(attrs)
        data['is_staff'] = user.is_staff  # Ajoutez is_staff au data retourné
        data['mail'] = user.mail  # Ajoutez le mail au data retourné
        return data

class EntrepriseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Entreprise
        fields = [
            'nom_entreprise',
            'mot_de_passe',
            'nif',
            'stat',
            'mail',
            'contact',
            'localisation',
            'proprio',
            'logo',
            'nb_avis',
            'nb_client',
            'nb_partenaire',
            'texte_bienvenue',
            'intro_service',
            'intro_a_propos',
            'texte_a_propos',
            'texte_pourquoi',
        ]

class OffreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offre
        fields = ['nom_offre', 'prix', 'description']

