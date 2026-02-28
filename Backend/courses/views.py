from django.shortcuts import render

# Create your views here.
from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied
from .models import Course, Enrollment, Assignment, Submission
from .serializers import (
    CourseSerializer,
    EnrollmentSerializer,
    AssignmentSerializer,
    SubmissionSerializer,
)
from .permissions import IsLecturer, IsStudent


class CreateCourseView(generics.CreateAPIView):
    serializer_class = CourseSerializer
    permission_classes = [IsLecturer]

    def perform_create(self, serializer):
        serializer.save(lecturer=self.request.user.lecturer_profile)


class LecturerCoursesView(generics.ListAPIView):
    serializer_class = CourseSerializer
    permission_classes = [IsLecturer]

    def get_queryset(self):
        return Course.objects.filter(lecturer=self.request.user.lecturer_profile)


class CourseListView(generics.ListAPIView):
    queryset = Course.objects.filter(is_active=True)
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated]


class CourseDetailView(generics.RetrieveAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated]


class EnrollCourseView(generics.CreateAPIView):
    serializer_class = EnrollmentSerializer
    permission_classes = [IsStudent]

    def perform_create(self, serializer):
        serializer.save(student=self.request.user.student_profile)


class StudentCoursesView(generics.ListAPIView):
    serializer_class = EnrollmentSerializer
    permission_classes = [IsStudent]

    def get_queryset(self):
        return Enrollment.objects.filter(student=self.request.user.student_profile)


class CreateAssignmentView(generics.CreateAPIView):
    serializer_class = AssignmentSerializer
    permission_classes = [IsLecturer]


class SubmitAssignmentView(generics.CreateAPIView):
    serializer_class = SubmissionSerializer
    permission_classes = [IsStudent]

    def perform_create(self, serializer):
        serializer.save(student=self.request.user.student_profile)