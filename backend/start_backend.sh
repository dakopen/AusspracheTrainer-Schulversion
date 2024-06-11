#!/bin/bash USE TOGETHER WITH DOCKER

# Kill all processes on port 8000
fuser -k 8000/tcp
sleep 1

# Start Redis (handled by Docker Compose)
# redis-server &

cd /app/backend
# Start Django
python3 manage.py runserver 0.0.0.0:8000 &

# Start Celery
celery -A backend worker --loglevel=info &

# Start Celery Beat if needed
celery -A backend beat --loglevel=info &

echo "Django and Celery are running."

# Keep the shell open
wait
