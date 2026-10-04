# SkillVerse AI - Production Deployment Guide

## Quick Start (Development)

```bash
# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run development server
python manage.py runserver 8000
```

## Production Deployment

### Option 1: Docker

```bash
# Build and run
docker build -t skillverse-ai .
docker run -p 8000:8000 --env-file .env skillverse-ai
```

### Option 2: Gunicorn + Nginx

```bash
# Install dependencies
pip install -r requirements.txt

# Collect static files
python manage.py collectstatic --nput

# Run with Gunicorn
gunicorn config.wsgi:application --config gunicorn.conf.py
```

### Environment Variables

Create a `.env` file (see `.env.example`):

```env
DJANGO_SECRET_KEY=your-super-secret-key
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
DATABASE_URL=postgres://user:pass@host:5432/skillverse
```

### Production Settings

```bash
# Use production settings
export DJANGO_SETTINGS_MODULE=config.settings_prod
python manage.py runserver
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location /static/ {
        alias /path/to/staticfiles/;
    }

    location /media/ {
        alias /path/to/media/;
    }

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Admin Panel

- URL: `/admin-panel/`
- Create superuser: `python manage.py createsuperuser`

## Running Tests

```bash
python manage.py test
```
