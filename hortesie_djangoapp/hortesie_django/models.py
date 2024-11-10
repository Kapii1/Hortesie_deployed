import os
import uuid
from django.db import models

# Create your models here.


class Project(models.Model):
    id = models.CharField(max_length=100, primary_key=True)
    name = models.CharField(max_length=100)
    description = models.TextField()
    date = models.DateField(max_length=100)
    type = models.CharField(max_length=100)
    vignette = models.ForeignKey("Photo", on_delete=models.CASCADE, null=True)
    category = models.CharField(max_length=100)
    resume = models.CharField(max_length=1000, null=True)
    city = models.CharField(max_length=100, blank=True)


def upload_to(instance, filename):
    extension = filename.split(".")[-1]
    uid = str(uuid.uuid4())
    return "uploads/{0}".format(f"{uid}.{extension}")


class Photo(models.Model):
    id = models.CharField(
        max_length=100, primary_key=True, unique=True, default=uuid.uuid4
    )
    id_projet = models.CharField(max_length=100)
    file = models.FileField(upload_to=upload_to)
    filename = models.CharField(max_length=100)


def upload_to_remove(instance, filename):
    if os.path.exists("hortesie_django/TEMPLATE_WORD_CCTP.docx"):
        os.remove("hortesie_django/TEMPLATE_WORD_CCTP.docx")
    return "hortesie_django/TEMPLATE_WORD_CCTP.docx"


class CCTPTemplate(models.Model):
    id = models.CharField(max_length=100, primary_key=True, default=uuid.uuid4)
    file = models.FileField(upload_to=upload_to_remove)

    date = models.DateTimeField(auto_now=True)
