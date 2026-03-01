from django.urls import path
from .views import *

urlpatterns = [

    path("courses/create/", CourseCreateAPIView.as_view(), name="create-course"),
    path("courses/", CourseListAPIView.as_view(), name="list-courses"),
    path("courses/<int:pk>/", CourseRetrieveAPIView.as_view(), name="retrieve-course"),
    path("courses/<int:pk>/update/", CourseUpdateAPIView.as_view(), name="update-course"),
    path("courses/<int:pk>/delete/", CourseDeleteAPIView.as_view(), name="delete-course"),

]