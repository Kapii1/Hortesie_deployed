# Generated by Django 5.1.3 on 2024-11-10 10:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hortesie_django', '0009_project_city'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='city',
            field=models.CharField(blank=True, max_length=100),
        ),
    ]
