from django.shortcuts import render
from rest_framework.views import APIView, PermissionDenied
from rest_framework.response import Response
from rest_framework import status
from .serializers import SignupSerializer, LoginSerializer, StudentProfileUpdateSerializer, LecturerProfileUpdateSerializer
from drf_spectacular.utils import OpenApiResponse, extend_schema
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.generics import RetrieveAPIView, UpdateAPIView
from rest_framework.permissions import IsAuthenticated
from .serializers import UserMeSerializer




@extend_schema(
    summary="Get current authenticated user",
    description="Returns the authenticated user's information and role-based profile.",
    responses=UserMeSerializer,
)
class MeView(RetrieveAPIView):
    serializer_class = UserMeSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user



@extend_schema(
    request=SignupSerializer,
    responses={201: SignupSerializer}
)
class SignupView(APIView):
    def post(self, request):
        serializer = SignupSerializer(data=request.data)


        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)

            return Response({
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "role": user.role
                },
                "access": str(refresh.access_token),
                "refresh": str(refresh)
            }, status=201)


        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@extend_schema(
    request=LoginSerializer,
    responses={200: LoginSerializer}
)
class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            return Response(serializer.validated_data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    tags=["Profile"],
    summary="Update student profile",
    description=(
        "Allows an authenticated student to update their profile information. "
        "Only users with role 'student' can access this endpoint."
    ),
    request=StudentProfileUpdateSerializer,
    responses={
        200: StudentProfileUpdateSerializer,
        400: OpenApiResponse(description="Validation error"),
        401: OpenApiResponse(description="Authentication credentials were not provided."),
        403: OpenApiResponse(description="Only students can update their profile."),
    },
)
class StudentProfileUpdateView(UpdateAPIView):
    serializer_class = StudentProfileUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user = self.request.user

        # Ensure only students can access
        if user.role != "student":
            raise PermissionDenied("Only students can update their profile.")

        return user.student_profile

@extend_schema(
    tags=["Profile"],
    summary="Update lecturer profile",
    description=(
        "Allows an authenticated lecturer to update their profile information. "
        "Only users with role 'lecturer' can access this endpoint."
    ),
    request=LecturerProfileUpdateSerializer,
    responses={
        200: LecturerProfileUpdateSerializer,
        400: OpenApiResponse(description="Validation error"),
        401: OpenApiResponse(description="Authentication credentials were not provided."),
        403: OpenApiResponse(description="Only lecturers can update their profile."),
    },
)
class LecturerProfileUpdateView(UpdateAPIView):
    serializer_class = LecturerProfileUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user = self.request.user

        if user.role != "lecturer":
            raise PermissionDenied("Only lecturers can update their profile.")

        return user.lecturer_profile