import random
import string
from django.contrib.auth import get_user_model

User = get_user_model()

def generate_random_username():
    """Generate a unique username that does not exist in the database."""
    while True:
        username = ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))
        if not User.objects.filter(username=f"{username}@studie.aussprachetrainer.org").exists():
            return username
