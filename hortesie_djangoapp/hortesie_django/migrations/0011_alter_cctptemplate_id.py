# Generated by Django 5.1.3 on 2024-11-10 13:04

import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hortesie_django', '0010_alter_project_city'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cctptemplate',
            name='id',
            field=models.CharField(default=uuid.uuid4, max_length=100, primary_key=True, serialize=False),
        ),
    ]
