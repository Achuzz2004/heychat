# Chatter Backend Deployment Guide

1) Local dev
- python -m venv venv && source venv/bin/activate
- pip install -r requirements.txt
- python manage.py migrate
- python manage.py runserver 0.0.0.0:8000
- run a Redis: docker run -p 6379:6379 redis:7

2) Render/Heroku
- Set envs: DJANGO_SECRET_KEY, DEBUG=0, ALLOWED_HOSTS, REDIS_URL, POSTGRES_* vars
- Use gunicorn/daphne for ASGI: web: daphne -b 0.0.0.0 -p $PORT server.asgi:application
- Ensure persistent storage for media or use S3 in production

Security
- Keep DEBUG=0
- Restrict CORS_ALLOWED_ORIGINS to your frontend domain
