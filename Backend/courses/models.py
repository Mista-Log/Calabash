from django.db import models
from django.conf import settings
from account.models import Lecturer, Student


class Course(models.Model):
    code = models.CharField(max_length=20, unique=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    lecturer = models.ForeignKey(
        Lecturer,
        on_delete=models.CASCADE,
        related_name="courses"
    )

    semester = models.PositiveSmallIntegerField(null=True, blank=True)
    department = models.CharField(max_length=100)
    level = models.CharField(max_length=50)

    enrollment = models.PositiveIntegerField(default=0)
    material_count = models.PositiveIntegerField(default=0)
    color = models.CharField(max_length=100, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.code} - {self.title}"



class CourseMaterial(models.Model):

    material_type = models.CharField(max_length=50)

    VISIBILITY_CHOICES = (
        ("public", "Public"),
        ("private", "Private"),
    )

    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="materials"
    )

    title = models.CharField(max_length=255)
    semester = models.PositiveSmallIntegerField(null=True, blank=True)

    
    file = models.FileField(upload_to="course_materials/", blank=True, null=True)
    external_url = models.URLField(blank=True, null=True)

    size = models.CharField(max_length=20, blank=True)
    upload_at = models.DateTimeField(auto_now_add=True)

    uploader = models.ForeignKey(
        Lecturer,
        on_delete=models.SET_NULL,
        null=True,
        related_name="uploaded_materials"
    )

    downloads = models.PositiveIntegerField(default=0)
    likes = models.PositiveIntegerField(default=0)

    visibility = models.CharField(
        max_length=10,
        choices=VISIBILITY_CHOICES,
        default="public"
    )

    class Meta:
        ordering = ["-upload_at"]

    def __str__(self):
        return f"{self.title} ({self.course.code})"


class Note(models.Model):

    STATUS_CHOICES = (
        ("draft", "Draft"),
        ("saved", "Saved"),
        ("archived", "Archived"),
    )

    SCOPE_CHOICES = (
        ("course", "Course"),
        ("personal", "Personal"),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notes"
    )

    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="notes",
        null=True,
        blank=True
    )

    title = models.CharField(max_length=255)
    content = models.TextField()  # store HTML safely
    excerpt = models.CharField(max_length=300, blank=True)

    scope = models.CharField(
        max_length=20,
        choices=SCOPE_CHOICES,
        default="course"
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="saved"
    )

    pinned = models.BooleanField(default=False)

    tags = models.ManyToManyField(
        "Tag",
        related_name="notes",
        blank=True
    )

    attachments = models.ManyToManyField(
        CourseMaterial,
        related_name="attached_notes",
        blank=True
    )

    last_opened_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-pinned", "-updated_at"]

    def __str__(self):
        return self.title
    
class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name