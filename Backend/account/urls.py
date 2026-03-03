from django.urls import path
from django.http import HttpResponse
from django.urls import path
from .views import MeView, SignupView, LoginView, StudentProfileUpdateView, LecturerProfileUpdateView

urlpatterns = [
    path("signup/", SignupView.as_view(), name="signup"),
    path("login/", LoginView.as_view(), name="login"),
    path("me/", MeView.as_view(), name="me"),
    path("student/profile/update/", StudentProfileUpdateView.as_view(), name="student-profile-update"),
    path("lecturer/profile/update/", LecturerProfileUpdateView.as_view(), name="lecturer-profile-update",
    ),
]