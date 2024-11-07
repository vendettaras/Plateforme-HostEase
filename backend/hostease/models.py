from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.utils import timezone
from datetime import timedelta

class CustomUserManager(BaseUserManager):
    def create_user(self, email, nom, password=None, is_active=True, role='entreprise', photo=None):
        if not email:
            raise ValueError("Les utilisateurs doivent avoir une adresse e-mail.")
        user = self.model(email=email, nom=nom, is_active=is_active, role=role, photo=photo)
        user.set_password(password)  # Utilise la méthode pour hacher le mot de passe
        user.is_active = True
        print("is_active avant sauvegarde:", user.is_active)  # Débogage
        user.save(using=self._db)
        print("is_active après sauvegarde:", user.is_active)  # Débogage
        return user

    def create_superuser(self, email, nom, password, photo=None):
        user = self.create_user(email=email, nom=nom, password=password, role='admin', photo=photo)
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
    photo = models.ImageField(blank=True, upload_to='userPhoto/', null=True)
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
    logo = models.ImageField(blank=True, upload_to='logo/', null=True)
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

def one_year_from_now():
    return timezone.now() + timedelta(days=365)

class OffreEntreprise(models.Model) :
    entreprise = models.OneToOneField(InfoEntreprise, on_delete=models.CASCADE, related_name='offre_entreprise')
    offre = models.ForeignKey(Offre, on_delete=models.CASCADE, related_name='entreprise_offre')
    date_begin = models.DateTimeField(default=timezone.now)
    date_exp = models.DateTimeField(default=one_year_from_now)
    ref_payement = models.CharField(max_length=30, null=True)
    motif_payement = models.CharField(max_length=30, null=True)

    def __str__(self):
        return self.entreprise
