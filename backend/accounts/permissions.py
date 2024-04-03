from rest_framework import permissions

class IsAdminOrSecretaryCreatingAllowedRoles(permissions.BasePermission):
    def has_permission(self, request, view):
        # Admins are allowed to create every role
        if request.user.is_authenticated and request.user.role == request.user.ADMIN:
            return True
        
        # Secretaries can only create teachers or secretaries or students
        if request.user.is_authenticated and request.user.role == request.user.SECRETARY:
            # Ensures the request is for creating a teacher or a secretary or other non-admin roles
            requested_role = request.data.get('role')
            return requested_role not in [request.user.ADMIN]  # Admins are not allowed to be created by secretaries
        
        return False


class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == request.user.ADMIN
    
class IsSecretary(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == request.user.SECRETARY
    
class IsTeacher(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == request.user.TEACHER
