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

13. `python backend/manage.py runserver 0.0.0.0:8000` (later use gunicorn)

