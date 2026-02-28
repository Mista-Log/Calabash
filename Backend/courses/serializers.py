from rest_framework import serializers
from .models import Course, Enrollment, Assignment, Submission
from account.models import Lecturer, Student


class CourseSerializer(serializers.ModelSerializer):
    lecturer_name = serializers.CharField(source="lecturer.user.full_name", read_only=True)

    class Meta:
        model = Course
        fields = [
            "id",
            "code",
            "title",
            "description",
            "department",
            "level",
            "lecturer",
            "lecturer_name",
            "is_active",
            "created_at",
        ]
        read_only_fields = ["lecturer"]


class EnrollmentSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source="student.user.full_name", read_only=True)
    course_title = serializers.CharField(source="course.title", read_only=True)

    class Meta:
        model = Enrollment
        fields = [
            "id",
            "student",
            "student_name",
            "course",
            "course_title",
            "enrolled_at",
            "grade",
        ]
        read_only_fields = ["student", "enrolled_at"]


class AssignmentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Assignment
        fields = "__all__"


class SubmissionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Submission
        fields = "__all__"
        read_only_fields = ["student", "submitted_at"]

