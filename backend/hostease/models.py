from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.utils import timezone

class AdminManager(BaseUserManager):
    def create_user(self, mail, password=None):
        if not mail:
            raise ValueError("Les utilisateurs doivent avoir une adresse e-mail.")
        user = self.model(mail=mail)
        user.set_password(password)  # Utilise la méthode pour hacher le mot de passe
        user.save(using=self._db)
        return user

    def create_superuser(self, mail, password):
        user = self.create_user(mail, password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user

class Admin(AbstractBaseUser):
    mail = models.EmailField(max_length=255, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    last_login = models.DateTimeField(null=True, blank=True)

    objects = AdminManager()  # Utilisation du gestionnaire personnalisé

    USERNAME_FIELD = 'mail'  # Champ utilisé pour l'authentification
    REQUIRED_FIELDS = []  # Champs requis lors de la création d'un super utilisateur

    def __str__(self):
        return self.mail


    
class Offre(models.Model):
    nom_offre = models.CharField(max_length=30, null=True)
    prix = models.FloatField(null=True)
    description = models.TextField(max_length=400, null=True)
    

    def __str__(self):
        return self.nom_offre    
    
class Entreprise(models.Model):  # Renommer Entreprise en Client
    nom_entreprise = models.CharField(max_length=30, null=True)
    mot_de_passe = models.CharField(max_length=30, null=True)
    nif = models.CharField(max_length=30, null=True)
    stat = models.CharField(max_length=30, null=True)
    mail = models.EmailField(max_length=254, null=True)  # Utilisation de EmailField pour les adresses email
    contact = models.CharField(max_length=30, null=True)
    localisation = models.CharField(max_length=50, null=True)
    proprio = models.CharField(max_length=50, null=True)
    logo = models.ImageField(blank=True, upload_to='media/logo/')
    nb_avis = models.IntegerField(null=True)
    nb_client = models.IntegerField(null=True)
    nb_partenaire = models.IntegerField(null=True)
    texte_bienvenue = models.TextField(null=True)
    intro_service = models.TextField(null=True)
    intro_a_propos = models.TextField(null=True)
    texte_a_propos = models.TextField(null=True)
    texte_pourquoi = models.TextField(null=True)

    completed = models.BooleanField(default=False)

    def __str__(self):
        return self.nom_entreprise

class Bdd(models.Model):
    lien = models.CharField(max_length=50, null=True)
    client = models.ForeignKey(Entreprise, on_delete=models.SET_NULL, null=True, related_name='bdd_client')

    def __str__(self):
        return self.lien

