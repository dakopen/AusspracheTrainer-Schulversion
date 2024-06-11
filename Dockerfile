# Stage 1: Build React app
FROM node:18 as frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
COPY .env .env
RUN npm run build

# Stage 2: Build Django app
FROM ubuntu:20.04 as backend-build

# Set environment variables
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
COPY backend/requirements.txt ./
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy backend files
COPY backend/ ./

# Copy .env file
COPY .env /app/backend/.env

# Run database migrations and create superuser if not exists
RUN python manage.py makemigrations && \
    python manage.py migrate
# Collect static files
RUN python manage.py collectstatic --noinput

RUN chmod +x /app/backend/start_backend.sh

CMD ["/app/backend/start_backend.sh"]


# Stage 3: Run the combined app with Nginx
FROM nginx:alpine

# Copy Nginx configuration
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Copy built React app to Nginx
COPY --from=frontend-build /app/frontend/build /usr/share/nginx/html


# Copy Django app to the final image
COPY --from=backend-build /app/backend /app/backend

# Copy .env file
COPY .env /app/backend/.env

# Expose ports
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
