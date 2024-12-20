# Generated by Django 4.2.4 on 2024-11-05 15:49

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('hostease', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='OffreEntreprise',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('entreprise', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='offre_entreprise', to='hostease.infoentreprise')),
                ('offre', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='entreprise_offre', to='hostease.offre')),
            ],
        ),
    ]
