#!/bin/bash

# Kill all processes on port 8000
fuser -k 8000/tcp
sleep 1

# Start Redis
redis-server &

cd backend
# Start Django
python3 manage.py runserver 0.0.0.0:8000 &

# Start Celery
celery -A backend worker --loglevel=info &

# Start Celery Beat if needed
# echo "Starting Celery Beat..."
celery -A backend beat --loglevel=info &

echo "Django and Celery are running."

# Keep the shell open
wait