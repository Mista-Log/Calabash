from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import SignupSerializer, LoginSerializer
from drf_spectacular.utils import extend_schema
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from .serializers import UserMeSerializer


@require_http_methods(["GET"])
def health_check(request):
    """Simple health check for the account app."""
    return JsonResponse({"status": "ok", "app": "account"})


@require_http_methods(["GET"])
def info(request):
    return JsonResponse({"message": "Account endpoints are available."})


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
