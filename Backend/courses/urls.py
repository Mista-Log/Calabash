from django.urls import path
from .views import *

urlpatterns = [

    path("courses/create/", CourseCreateAPIView.as_view(), name="create-course"),
    path("courses/", CourseListAPIView.as_view(), name="list-courses"),
    path("courses/<int:pk>/", CourseRetrieveAPIView.as_view(), name="retrieve-course"),
    path("courses/<int:pk>/update/", CourseUpdateAPIView.as_view(), name="update-course"),
    path("courses/<int:pk>/delete/", CourseDeleteAPIView.as_view(), name="delete-course"),

    path("materials/create/", MaterialCreateAPIView.as_view(), name="material-create"),
    path("materials/<int:id>/", MaterialRetrieveAPIView.as_view(), name="material-detail"),
    path("materials/<int:id>/update/", MaterialUpdateAPIView.as_view(), name="material-update"),
    path("materials/<int:id>/delete/", MaterialDeleteAPIView.as_view(), name="material-delete"),
    path("materials/", CourseMaterialListAPIView.as_view(), name="material-list"),

    path("notes/", NoteListCreateView.as_view(), name="note-list-create"),
    path("notes/<int:pk>/", NoteRetrieveUpdateDeleteView.as_view(), name="note-detail"),
    
]