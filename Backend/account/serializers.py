from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Student, Lecturer, Admin
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import serializers
from .models import User, Student, Lecturer, Admin


class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["email", "full_name", "password", "role"]

    def create(self, validated_data):
        password = validated_data.pop("password")
        role = validated_data.get("role")

        user = User.objects.create_user(
            password=password,
            **validated_data
        )

        # Automatically create empty profile
        if role == User.Role.STUDENT:
            Student.objects.create(user=user)

        elif role == User.Role.LECTURER:
            Lecturer.objects.create(user=user)

        elif role == User.Role.ADMIN:
            Admin.objects.create(user=user)

        return user



class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(
            email=data["email"],
            password=data["password"]
        )

        if not user:
            raise serializers.ValidationError("Invalid credentials")

        refresh = RefreshToken.for_user(user)

        return {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }



class StudentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ["matric_number", "department", "level"]


class LecturerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lecturer
        fields = ["lecturer_id", "department", "office"]


class AdminProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admin
        fields = ["position"]


class UserMeSerializer(serializers.ModelSerializer):
    profile = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "full_name",
            "role",
            "is_active",
            "date_joined",
            "profile",
        ]

    def get_profile(self, obj):
        if obj.role == User.Role.STUDENT and hasattr(obj, "student_profile"):
            return StudentProfileSerializer(obj.student_profile).data

        if obj.role == User.Role.LECTURER and hasattr(obj, "lecturer_profile"):
            return LecturerProfileSerializer(obj.lecturer_profile).data

        if obj.role == User.Role.ADMIN and hasattr(obj, "admin_profile"):
            return AdminProfileSerializer(obj.admin_profile).data

        return None

class StudentProfileUpdateSerializer(serializers.ModelSerializer):
    # Fields from User model
    full_name = serializers.CharField(source="user.full_name", required=False)
    semester = serializers.IntegerField(source="user.semester", required=False)

    class Meta:
        model = Student
        fields = [
            "full_name",
            "semester",
            "username",
            "matric_number",
            "department",
            "level",
        ]

    def update(self, instance, validated_data):
        # Extract user data
        user_data = validated_data.pop("user", {})

        # Update User fields
        user = instance.user
        for attr, value in user_data.items():
            setattr(user, attr, value)
        user.save()

        # Update Student fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance

class LecturerProfileUpdateSerializer(serializers.ModelSerializer):
    # Fields from User model
    full_name = serializers.CharField(source="user.full_name", required=False)
    bio = serializers.CharField(source="user.bio", required=False)

    class Meta:
        model = Lecturer
        fields = [
            "full_name",
            "bio",
            "username",
            "department",
            "office",
        ]

    def update(self, instance, validated_data):
        # Extract nested user data
        user_data = validated_data.pop("user", {})

        # Update User fields
        user = instance.user
        for attr, value in user_data.items():
            setattr(user, attr, value)
        user.save()

        # Update Lecturer fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance