from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.utils import timezone

class CustomUserManager(BaseUserManager):
    def create_user(self, email, nom, password=None, role='entreprise'):
        if not email:
            raise ValueError("Les utilisateurs doivent avoir une adresse e-mail.")
        user = self.model(email=email, nom=nom, role=role)
        user.set_password(password)  # Utilise la méthode pour hacher le mot de passe
        user.save(using=self._db)
        return user

    def create_superuser(self, email, nom, password):
        user = self.create_user(email=email, nom=nom, password=password, role='admin')
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user

class CustomUser(AbstractBaseUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('entreprise', 'Entreprise'),
    )
    
    email = models.EmailField(unique=True)
    nom = models.CharField(max_length=255)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='entreprise')
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    last_login = models.DateTimeField(default=timezone.now)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nom']  # Autres champs requis lors de la création d'un super utilisateur

    def __str__(self):
        return self.email

    def is_admin(self):
        return self.role == 'admin'

    def is_entreprise(self):
        return self.role == 'entreprise'


class Offre(models.Model):
    nom_offre = models.CharField(max_length=30, null=True)
    prix = models.FloatField(null=True)
    description = models.TextField(max_length=400, null=True)

    def __str__(self):
        return self.nom_offre    

    
class InfoEntreprise(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='info_entreprise')
    nom_entreprise = models.CharField(max_length=30, null=True)
    contact = models.CharField(max_length=30, null=True)
    nif = models.CharField(max_length=30, null=True)
    stat = models.CharField(max_length=30, null=True)
    localisation = models.CharField(max_length=50, null=True)
    proprio = models.CharField(max_length=50, null=True)
    logo = models.ImageField(blank=True, upload_to='media/logo/')
    nb_avis = models.IntegerField(default=0)
    nb_client = models.IntegerField(default=0)
    nb_partenaire = models.IntegerField(default=0)
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
    client = models.ForeignKey(InfoEntreprise, on_delete=models.SET_NULL, null=True, related_name='bdd_client')

    def __str__(self):
        return self.lien
