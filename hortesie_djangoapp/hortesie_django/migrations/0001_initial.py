# Generated by Django 5.1.3 on 2024-11-09 10:37

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Photo',
            fields=[
                ('id', models.CharField(max_length=100, primary_key=True, serialize=False)),
                ('id_projet', models.CharField(max_length=100)),
                ('file', models.FileField(upload_to='images/projets/%(id_projet)s/%(filename)s')),
                ('filename', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.CharField(max_length=100, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100)),
                ('description', models.CharField(max_length=1000)),
                ('date', models.DateField(max_length=100)),
                ('type', models.CharField(max_length=100)),
                ('vignette', models.CharField(max_length=100)),
                ('category', models.CharField(max_length=100)),
                ('resume', models.CharField(max_length=1000)),
                ('motscle', models.CharField(max_length=1000)),
                ('ville', models.CharField(max_length=100)),
            ],
        ),
    ]