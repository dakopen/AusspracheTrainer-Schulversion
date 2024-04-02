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

class UserModelTest(TestCase):
    def setUp(self):
        # Creating a school for the user to be associated with
        self.school = School.objects.create(name="Test Schule", address="Schweizer Straße 87, 60594 Frankfurt am Main", short_id="FVSS")
        # Creating users with different roles
        User.objects.create_user(username='student', password='12345', role=User.STUDENT, school=self.school)
        User.objects.create_user(username='teacher', password='12345', role=User.TEACHER, school=self.school)
        User.objects.create_user(username='secretary', password='12345', role=User.SECRETARY, school=self.school)
        User.objects.create_user(username='study_student', password='12345', role=User.STUDYSTUDENT, school=self.school)

    def test_student_role(self):
        user = User.objects.get(username='student')
        self.assertEqual(user.role, User.STUDENT)

    def test_teacher_role(self):
        user = User.objects.get(username='teacher')
        self.assertEqual(user.role, User.TEACHER)

    def test_secretary_role(self):
        user = User.objects.get(username='secretary')
        self.assertEqual(user.role, User.SECRETARY)

    def test_study_student_role(self):
        user = User.objects.get(username='study_student')
        self.assertEqual(user.role, User.STUDYSTUDENT)

    def test_user_school_association(self):
        # Testing that all users are associated with the correct school
        users = User.objects.filter(school=self.school)
        self.assertEqual(users.count(), 4)  # Since we created 4 users
        for user in users:
            self.assertTrue(user.school.name, "Test Schule")

