import copy

from requests import Response

from hortesie_django.models import CCTPTemplate, Photo, Project
from rest_framework import serializers


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = "__all__"

    def to_representation(self, instance):
        if instance.vignette:
            return {
            **super().to_representation(instance),
            "vignette": "/api" + instance.vignette.file.url if instance.vignette else "",
        }
        return {
            **super().to_representation(instance),
            "vignette": None,
        }
    def create(self, validated_data):
        Projects = Project.objects.all()
        validated_data["position"] = len(Projects)
        return super().create(validated_data)

class CCTPTemplateSerializer(serializers.ModelSerializer):

    class Meta:
        model = CCTPTemplate
        fields = "__all__"

    def create(self, validated_data):
        # Get the uploaded file
        uploaded_file = validated_data["file"]
        # Create a new instance of CCTPTemplate, filling both 'file' and 'file_versions'
        cctp_template = CCTPTemplate.objects.create(
            file=uploaded_file,
        )

        return cctp_template


class PhotoSerializer(serializers.Serializer):

    def create(self, validated_data):
        # Get the uploaded file
        print("eeza", validated_data)
        uploaded_file = validated_data["file"]

        # Create a new instance of Photo, filling both 'file' and 'file_versions'
        photo = Photo.objects.create(
            id_projet=validated_data["id_projet"],
            file=uploaded_file,
            filename=uploaded_file.name,
        )
        print(photo.__dict__)
        return photo

    def run_validation(self, data):
        print("validation")
        data["id_projet"] = self.instance.id
        data["filename"] = data.get("file").name
        return data


class PhotoModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Photo
        fields = "__all__"
