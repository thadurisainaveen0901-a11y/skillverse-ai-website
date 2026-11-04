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
SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", SECRET_KEY)

ALLOWED_HOSTS = ["*"]

# Security headers
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
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

# Logging - log to console so output appears in Cloud/Render logs
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
        },
    },
    "root": {
        "handlers": ["console"],
        "level": "INFO",
    },
}
