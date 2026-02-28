from django.urls import path
from django.http import HttpResponse
from django.urls import path
from .views import MeView, SignupView, LoginView

urlpatterns = [
    path("signup/", SignupView.as_view(), name="signup"),
    path("login/", LoginView.as_view(), name="login"),
    path("me/", MeView.as_view(), name="me"),
]