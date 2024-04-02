from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
from django.test import TestCase
from .models import School

User = get_user_model()

class SchoolModelTest(TestCase):
    def setUp(self):
        School.objects.create(name="Test Schule", address="Schweizer Straße 87, 60594 Frankfurt am Main", short_id="FVSS")

    def test_school_creation(self):
        school = School.objects.get(short_id="FVSS")
        self.assertTrue(isinstance(school, School))

    def test_short_id_with_special_chars(self):
        """
        Test that creating a School with special characters in `short_id` raises a ValidationError.
        """
        with self.assertRaises(ValidationError):
            school = School(name="Test School", address="123 Main St", short_id="AB!@#")
            school.full_clean()

    def test_short_id_with_lowercase(self):
        """
        Test that creating a School with lowercase letters in `short_id` raises a ValidationError.
        """
        with self.assertRaises(ValidationError):
            school = School(name="Another Test School", address="456 Elm St", short_id="abc123")
            school.full_clean()


class UserModelTest(TestCase):
    def setUp(self):
        # Creating a school for the user to be associated with
        self.school = School.objects.create(name="Test Schule", address="Schweizer Straße 87, 60594 Frankfurt am Main", short_id="FVSS")
        # Creating users with different roles
        User.objects.create_user(username='teacher', password='12345', role=User.TEACHER, school=self.school)
        User.objects.create_user(username='secretary', password='12345', role=User.SECRETARY, school=self.school)


    def test_teacher_role(self):
        user = User.objects.get(username='teacher')
        self.assertEqual(user.role, User.TEACHER)

    def test_secretary_role(self):
        user = User.objects.get(username='secretary')
        self.assertEqual(user.role, User.SECRETARY)

    def test_user_school_association(self):
        # Testing that all users are associated with the correct school
        users = User.objects.filter(school=self.school)
        self.assertEqual(users.count(), 2)  # Since we created 2 users
        for user in users:
            self.assertTrue(user.school.name, "Test Schule")

