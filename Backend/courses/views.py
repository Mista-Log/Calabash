from rest_framework.generics import CreateAPIView, DestroyAPIView
from rest_framework.permissions import IsAuthenticated
from .models import Course
from .serializers import CourseCreateSerializer, CourseListSerializer
from drf_spectacular.utils import extend_schema
from rest_framework.generics import ListAPIView
from rest_framework.generics import RetrieveAPIView
from .serializers import CourseDetailSerializer
from rest_framework.generics import UpdateAPIView
from .serializers import CourseUpdateSerializer


@extend_schema(
    summary="Create a new course",
    description="Creates a new course and assigns it to a lecturer.",
    request=CourseCreateSerializer,
    responses={201: CourseCreateSerializer},
)
class CourseCreateAPIView(CreateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseCreateSerializer
    permission_classes = [IsAuthenticated]



@extend_schema(
    summary="Get all courses",
    description="Returns a list of all available courses.",
    responses={200: CourseListSerializer(many=True)},
)
class CourseListAPIView(ListAPIView):
    queryset = (
        Course.objects.filter(is_active=True)
        .select_related("lecturer")
        .prefetch_related("materials")
    )
    serializer_class = CourseListSerializer
    permission_classes = [IsAuthenticated]



@extend_schema(
    summary="Get a single course",
    description="Retrieve the details of a course by its ID.",
    responses={200: CourseDetailSerializer},
)
class CourseRetrieveAPIView(RetrieveAPIView):
    queryset = Course.objects.filter(is_active=True).select_related("lecturer").prefetch_related("materials")
    serializer_class = CourseDetailSerializer
    permission_classes = [IsAuthenticated]


@extend_schema(
    summary="Update a course",
    description="Update a course by its ID. Supports partial updates.",
    request=CourseUpdateSerializer,
    responses={200: CourseUpdateSerializer},
)
class CourseUpdateAPIView(UpdateAPIView):
    queryset = Course.objects.all().select_related("lecturer")
    serializer_class = CourseUpdateSerializer
    permission_classes = [IsAuthenticated]

@extend_schema(
    summary="Delete a course",
    description="Deletes a course by its ID.",
    responses={204: None},
)
class CourseDeleteAPIView(DestroyAPIView):
    queryset = Course.objects.all()
    permission_classes = [IsAuthenticated]