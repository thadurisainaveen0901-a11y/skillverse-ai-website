"""
Production settings for SkillVerse AI.
Use: python manage.py runserver --settings=config.settings_prod
Or set DJANGO_SETTINGS_MODULE=config.settings_prod
"""
import os
from pathlib import Path
from .settings import *  # noqa

# Override security settings
DEBUG = False
SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY")
ALLOWED_HOSTS = os.environ.get("DJANGO_ALLOWED_HOSTS", "localhost,127.0.0.1").split(",")

# Security headers
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = "DENY"
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# Static files
STATIC_ROOT = BASE_DIR / "staticfiles"

# Logging
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "file": {
            "level": "ERROR",
            "class": "logging.FileHandler",
            "filename": BASE_DIR / "logs" / "django.log",
        },
    },
    "loggers": {
        "django": {
            "handlers": ["file"],
            "level": "ERROR",
            "propagate": True,
        },
    },
}
