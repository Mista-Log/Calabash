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
