from rest_framework.permissions import BasePermission, IsAuthenticated


class IsLecturer(BasePermission):
    
    def has_permission(self, request, view):
        return hasattr(request.user, "lecturer")

permission_classes = [IsAuthenticated, IsLecturer]