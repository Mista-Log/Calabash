from django.urls import path
from .views import *

urlpatterns = [

    # Lecturer
    path("lecturer/courses/create/", CreateCourseView.as_view(), name="create-course"),
    path("lecturer/courses/", LecturerCoursesView.as_view(), name="lecturer-courses"),

    # Public
    path("courses/", CourseListView.as_view(), name="course-list"),
    path("courses/<int:pk>/", CourseDetailView.as_view(), name="course-detail"),

    # Student
    path("student/enroll/", EnrollCourseView.as_view(), name="enroll-course"),
    path("student/courses/", StudentCoursesView.as_view(), name="student-courses"),

    # Assignments
    path("lecturer/assignments/create/", CreateAssignmentView.as_view(), name="create-assignment"),
    path("student/submit/", SubmitAssignmentView.as_view(), name="submit-assignment"),
]
