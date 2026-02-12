from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import SignupSerializer, LoginSerializer
from drf_spectacular.utils import extend_schema
from rest_framework_simplejwt.tokens import RefreshToken




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
