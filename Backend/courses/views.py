from rest_framework.generics import CreateAPIView, DestroyAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from .models import Course, CourseMaterial
from .serializers import CourseCreateSerializer, CourseListSerializer, MaterialCreateSerializer, MaterialDetailSerializer
from drf_spectacular.utils import extend_schema
from rest_framework.generics import ListAPIView, UpdateAPIView, RetrieveAPIView
from .serializers import CourseDetailSerializer, CourseUpdateSerializer
from .serializers import MaterialUpdateSerializer, CourseMaterialListSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework import generics, permissions
from .models import Note
from .serializers import NoteSerializer



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




@extend_schema(
    summary="Create a course material",
    description="Creates a material and links it to a course.",
    request=MaterialCreateSerializer,
    responses={201: MaterialDetailSerializer},
)

class MaterialCreateAPIView(CreateAPIView):
    queryset = CourseMaterial.objects.all()
    serializer_class = MaterialCreateSerializer
    permission_classes = [IsAuthenticated]


@extend_schema(
    summary="Retrieve a course material",
    description="Get the details of a single course material by its ID.",
    responses={200: MaterialDetailSerializer},
)
class MaterialRetrieveAPIView(RetrieveAPIView):
    queryset = CourseMaterial.objects.all()
    serializer_class = MaterialDetailSerializer
    permission_classes = [IsAuthenticated]  # optional
    lookup_field = "id"


@extend_schema(
    summary="Update a course material",
    description="Update the fields of a course material by its ID. You can update the title, file, URL, or visibility.",
    request=MaterialUpdateSerializer,
    responses={200: MaterialUpdateSerializer},
)
class MaterialUpdateAPIView(UpdateAPIView):
    queryset = CourseMaterial.objects.all()
    serializer_class = MaterialUpdateSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "id"

@extend_schema(
    summary="Delete a course material",
    description="Delete a course material by its ID. Only authenticated users with permission can delete."
)
class MaterialDeleteAPIView(DestroyAPIView):
    queryset = CourseMaterial.objects.all()
    permission_classes = [IsAuthenticated]
    lookup_field = "id"

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(
            {"detail": "Course material deleted successfully."},
            status=status.HTTP_200_OK
        )

@extend_schema(
    summary="List all course materials",
    description="Retrieve a list of all course materials in the system."
)
class CourseMaterialListAPIView(ListAPIView):
    queryset = CourseMaterial.objects.all()
    serializer_class = CourseMaterialListSerializer
    permission_classes = [IsAuthenticated]



class NoteListCreateView(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Users only see their own notes
        return Note.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @extend_schema(
        summary="List all notes",
        description="Retrieve all notes belonging to the authenticated user.",
        responses=NoteSerializer(many=True)
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @extend_schema(
        summary="Create a new note",
        description="Create a new note. User field is automatically set to the authenticated user.",
        request=NoteSerializer,
        responses=NoteSerializer
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


# Retrieve, Update, Delete Notes
class NoteRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Users can only access their own notes
        return Note.objects.filter(user=self.request.user)

    @extend_schema(
        summary="Retrieve a note",
        description="Get a single note by ID. Only accessible by the note owner.",
        responses=NoteSerializer
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @extend_schema(
        summary="Update a note",
        description="Update a note. User field cannot be changed.",
        request=NoteSerializer,
        responses=NoteSerializer
    )
    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs)

    @extend_schema(
        summary="Partially update a note",
        description="Update some fields of a note. User field cannot be changed.",
        request=NoteSerializer,
        responses=NoteSerializer
    )
    def patch(self, request, *args, **kwargs):
        return super().patch(request, *args, **kwargs)

    @extend_schema(
        summary="Delete a note",
        description="Delete a note. Only accessible by the note owner.",
        responses=None
    )
    def delete(self, request, *args, **kwargs):
        return super().delete(request, *args, **kwargs)