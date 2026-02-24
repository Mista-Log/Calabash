from django.contrib import admin
from .models import Student, Lecturer, Admin, User

# Register your models here.
admin.site.register(Admin)
admin.site.register(Lecturer)
admin.site.register(Student)
admin.site.register(User)
