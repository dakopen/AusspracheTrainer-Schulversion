from django.contrib.auth import get_user_model
from rest_framework import permissions

User = get_user_model()

class IsAdminOrSecretaryCreatingAllowedRoles(permissions.BasePermission):
    def has_permission(self, request, view):
        # Admins are allowed to create every role
        if request.user.is_authenticated and request.user.role == User.ADMIN:
            return True
        
        # Secretaries can only create teachers or secretaries or students
        if request.user.is_authenticated and request.user.role == User.SECRETARY:
            # Ensures the request is for creating a teacher or a secretary or other non-admin roles
            requested_role = request.data.get('role')
            return requested_role not in [User.ADMIN]  # Admins are not allowed to be created by secretaries
        
        return False


class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == User.ADMIN
    
class IsSecretary(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == User.SECRETARY
    
class IsTeacher(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == User.TEACHER

class IsTeacherOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in [User.TEACHER, User.ADMIN]