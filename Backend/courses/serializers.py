from rest_framework import serializers
from .models import Course, Lecturer, CourseMaterial, Note, Tag

class CourseCreateSerializer(serializers.ModelSerializer):
    lecturer_id = serializers.PrimaryKeyRelatedField(
        queryset=Lecturer.objects.all(),
        source="lecturer",
        write_only=True
    )

    class Meta:
        model = Course
        fields = [
            "id",
            "code",
            "title",
            "description",
            "semester",
            "department",
            "level",
            "enrollment",
            "color",
            "lecturer_id",
        ]

    def validate_code(self, value):
        if Course.objects.filter(code=value).exists():
            raise serializers.ValidationError("Course code already exists.")
        return value


class CourseListSerializer(serializers.ModelSerializer):
    lecturer_name = serializers.CharField(source="lecturer.name", read_only=True)
    material_count = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            "id",
            "code",
            "title",
            "description",
            "semester",
            "department",
            "level",
            "enrollment",
            "color",
            "lecturer_name",
            "material_count",
            "created_at",
        ]

    def get_material_count(self, obj):
        return obj.materials.count()



class CourseDetailSerializer(serializers.ModelSerializer):
    lecturer_name = serializers.CharField(source="lecturer.name", read_only=True)
    material_count = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            "id",
            "code",
            "title",
            "description",
            "semester",
            "department",
            "level",
            "enrollment",
            "color",
            "lecturer_name",
            "material_count",
            "created_at",
        ]

    def get_material_count(self, obj):
        return obj.materials.count()


class CourseUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = [
            "code",
            "title",
            "description",
            "semester",
            "department",
            "level",
            "enrollment",
            "color",
            "lecturer",  # FK
            "is_active"
        ]
        extra_kwargs = {
            "code": {"required": False},
            "title": {"required": False},
            "description": {"required": False},
            "semester": {"required": False},
            "department": {"required": False},
            "level": {"required": False},
            "enrollment": {"required": False},
            "color": {"required": False},
            "lecturer": {"required": False},
            "is_active": {"required": False},
        }

    def validate_code(self, value):
        if Course.objects.filter(code=value).exclude(id=self.instance.id).exists():
            raise serializers.ValidationError("Course code already exists.")
        return value


class MaterialCreateSerializer(serializers.ModelSerializer):
    course = serializers.PrimaryKeyRelatedField(queryset=Course.objects.all())

    class Meta:
        model = CourseMaterial
        fields = [
            "id",
            "title",
            "material_type",
            "semester",
            "file",
            "external_url",
            "size",
            "upload_at",
            "course",
            "uploader",
            "downloads",
            "likes",
            "visibility",
        ]
        read_only_fields = ["id", "upload_at", "downloads", "likes", "uploader"]

    def create(self, validated_data):
        # Automatically assign uploader from request.user. Assuming user is a Lecturer instance
        validated_data["uploader"] = self.context["request"].user.lecturer_profile
        return super().create(validated_data)
    
# courses/serializers.py
from rest_framework import serializers
from .models import CourseMaterial

class MaterialDetailSerializer(serializers.ModelSerializer):
    course = serializers.PrimaryKeyRelatedField(read_only=True)
    uploader = serializers.StringRelatedField(read_only=True)  # Shows lecturer name

    class Meta:
        model = CourseMaterial
        fields = [
            "id",
            "title",
            "material_type",
            "semester",
            "file",
            "external_url",
            "size",
            "upload_at",
            "course",
            "uploader",
            "downloads",
            "likes",
            "visibility",
        ]

class MaterialUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseMaterial
        fields = [
            "title",
            "material_type",
            "semester",
            "file",
            "external_url",
            "size",
            "visibility",
        ]
        # allow partial updates
        extra_kwargs = {
            "file": {"required": False},
            "external_url": {"required": False},
        }

class CourseMaterialListSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseMaterial
        fields = [
            "id",
            "title",
            "material_type",
            "semester",
            "file",
            "external_url",
            "size",
            "upload_at",
            "uploader",
            "downloads",
            "likes",
            "visibility",
            "course"
        ]



class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["id", "name"]

class NoteSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)
    attachments = serializers.PrimaryKeyRelatedField(
        queryset=CourseMaterial.objects.all(), many=True
    )

    class Meta:
        model = Note
        fields = [
            "id",
            "user",
            "course",
            "title",
            "content",
            "excerpt",
            "scope",
            "status",
            "pinned",
            "tags",
            "attachments",
            "last_opened_at",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["user", "created_at", "updated_at"]

    def create(self, validated_data):
        attachments = validated_data.pop("attachments", [])
        note = Note.objects.create(**validated_data)
        note.attachments.set(attachments)
        return note

    def update(self, instance, validated_data):
        attachments = validated_data.pop("attachments", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if attachments is not None:
            instance.attachments.set(attachments)
        instance.save()
        return instance