1. split terminal

2. Terminal 1

-   activate venv: `source venv/bin/activate`
-   change directory to project: `cd backend`
-   start server: `python manage.py runserver`

3. Terminal 2:

-   `cd frontend`
-   `npm start`

4. `python manage.py populate_standard_todos`

### Putting on the server:

1. `sudo apt update`
2. `sudo apt upgrade`
3. `sudo apt install ffmpeg`
4. `sudo apt install python3-pip python3-dev virtualenv -y`
5. `git clone <repo>`
6. `cd AusspracheTrainer-Schulversion`
7. `virtualenv venv`
8. `source venv/bin/activate`
9. `pip install -r requirements.txt` (may need to install some packages manually)
10. `python backend/manage.py migrate`
11. `python backend/manage.py createsuperuser` (if not before)
12. `python backend/manage.py populate_standard_todos` (if not before)
13. `sudo apt-get install redis-server`
14. `sudo systemctl enable redis-server`
15. `sudo systemctl start redis-server`
16. create gunicorn files:

-   vim setup_gunicorn_service.sh
-   add the following script:

```bash
#!/bin/bash

# Automatically obtain the username
USER=$(whoami)

# Automatically obtain the current working directory (project path)
PROJECT_PATH=$(pwd)

# Automatically obtain the virtual environment path (assuming it's in the project directory)
VENV_PATH=$(find $PROJECT_PATH -type d -name "bin" | grep -m1 'bin' | sed 's/\/bin//')

# Create the Gunicorn systemd service file
SERVICE_FILE="/etc/systemd/system/gunicorn.service"

echo "[Unit]
Description=gunicorn daemon
After=network.target

[Service]
User=$USER
Group=www-data
WorkingDirectory=$PROJECT_PATH
ExecStart=$VENV_PATH/bin/gunicorn --config $PROJECT_PATH/gunicorn_config.py myproject.wsgi

[Install]
WantedBy=multi-user.target" | sudo tee $SERVICE_FILE

# Reload systemd to apply the new service file
sudo systemctl daemon-reload

# Start and enable the Gunicorn service
sudo systemctl start gunicorn
sudo systemctl enable gunicorn

echo "Gunicorn service setup complete."
```

`chmod +x setup_gunicorn_service.sh`
`./setup_gunicorn_service.sh`

add gunicorn_config.py to the project directory:

```python
# gunicorn_config.py

bind = '0.0.0.0:8000'
workers = 3
```

13. `python backend/manage.py runserver 0.0.0.0:8000` (later use gunicorn)

14. add nginx (see nginx.conf)

15. `celery -A backend worker --detach` (go to the backend directory and activate venv first)

16. `celery -A backend beat --detach` (go to the backend directory and activate venv first)


