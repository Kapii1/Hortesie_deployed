# Generated by Django 5.1.3 on 2024-11-09 10:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hortesie_django', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='description',
            field=models.TextField(),
        ),
    ]
