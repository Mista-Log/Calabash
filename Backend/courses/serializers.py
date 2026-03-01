from rest_framework import serializers
from .models import Course, Lecturer


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