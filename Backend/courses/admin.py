from django.contrib import admin
from .models import Course, CourseMaterial, Note
# Register your models here.
admin.site.register(Course)
admin.site.register(CourseMaterial)
admin.site.register(Note)
