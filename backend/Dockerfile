# Start from Ubuntu 20.04 LTS as the base image
FROM ubuntu:20.04

# Avoid prompts from apt
ENV DEBIAN_FRONTEND=noninteractive

# Install Python 3.8 and other necessary packages
RUN apt-get update && \
    apt-get install -y python3.8 python3-pip ffmpeg gettext && \
    rm -rf /var/lib/apt/lists/*

# Update Python commands to Python3.8 and Pip3
RUN ln -s /usr/bin/python3.8 /usr/local/bin/python && \
    ln -s /usr/bin/pip3 /usr/local/bin/pip

# Set the working directory in the container
WORKDIR /app/backend

# Install Python dependencies
COPY requirements.txt ./
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy backend files
COPY . .

# db
RUN python manage.py makemigrations && \
    python manage.py migrate


# Collect static files
RUN python manage.py collectstatic --noinput


# Expose port for Gunicorn
EXPOSE 8000

# Start Gunicorn
# CMD ["gunicorn", "--bind", "0.0.0.0:8000", "backend.wsgi:application"]
CMD ["./start_backend.sh"]