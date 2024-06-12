from datetime import timedelta
from pathlib import Path
from .keyvault_manager import get_secret
from corsheaders.defaults import default_headers
import os
import sentry_sdk
from django.core.management.utils import get_random_secret_key  


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

DJANGO_DEV = os.getenv("DJANGO_DEV") == "True"

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

# SECURITY WARNING: keep the secret key used in production secret!
if DEBUG or DJANGO_DEV:
    SECRET_KEY = 'django-insecure-_oyf1=b^b(p*&o@pdq4uv)hxayo#cfl#c6+!sq5#c(5nz$w*-f'
else:
    SECRET_KEY = get_random_secret_key()


if DJANGO_DEV or DEBUG:
    ALLOWED_HOSTS = ["tapir-perfect-thankfully.ngrok-free.app", "localhost"]

else:
    ALLOWED_HOSTS = ["*.aussprachetrainer.org", "https://aws-amplify.d1ucddks599o2p.amplifyapp.com", "3.71.19.16"]

MS_SPEECH_SERVICES_API_KEY = get_secret("AzureSpeechKey1")
MS_SPEECH_SERVICES_REGION = "germanywestcentral"

DELETE_AUDIO_FILE_AFTER_ANALYSIS = True
# Application definition


sentry_sdk.init(
    dsn="https://cdfa3ecf76bbadfe421f351711f126cf@o4505771582750720.ingest.us.sentry.io/4507391552913408",
    # Set traces_sample_rate to 1.0 to capture 100%
    # of transactions for performance monitoring.
    traces_sample_rate=1.0,
    # Set profiles_sample_rate to 1.0 to profile 100%
    # of sampled transactions.
    # We recommend adjusting this value in production.
    profiles_sample_rate=1.0,
)


INSTALLED_APPS = [
    'accounts.apps.AccountsConfig',
    'studydata.apps.StudydataConfig',
    'todo.apps.TodoConfig',
    'storages',
    'corsheaders',
    'rest_framework',
    'rest_framework_simplejwt.token_blacklist',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.common.CommonMiddleware'
]

CORS_ORIGIN_ALLOW_ALL = True

CORS_ALLOW_HEADERS = list(default_headers) + [
    'ngrok-skip-browser-warning'
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

if DEBUG or DJANGO_DEV and not os.getenv("USE_AWS_DATABASE") == "True":
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

else:
    DATABASES = {
            'default': {
                'ENGINE': 'django.db.backends.postgresql',
                'NAME': 'postgres',
                'USER': 'awsadmin',
                'PASSWORD': get_secret("STUDIENVERSION-DATABASE-PASSWORD"),
                'HOST': 'ls-cfd9c8c29bf334d0356cfa2189433299f6df6852.cfmiweyqykva.eu-central-1.rds.amazonaws.com',  # This should match the service name in docker-compose
                'PORT': '5432',
            }
        }


# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

AUTH_USER_MODEL = 'accounts.User'

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

# STATIC_URL = 'static/'
# MEDIA_ROOT = BASE_DIR / 'media'


# AWS Settings
AWS_ACCESS_KEY_ID = get_secret("lightsail-storage-key-id")
AWS_SECRET_ACCESS_KEY = get_secret("lightsail-storage-access-key")
AWS_STORAGE_BUCKET_NAME = 'aussprachetrainer-schulversion-bucket'
AWS_S3_REGION_NAME = 'eu-central-1'  # e.g., 'us-west-2'
AWS_S3_CUSTOM_DOMAIN = f'{AWS_STORAGE_BUCKET_NAME}.s3.{AWS_S3_REGION_NAME}.amazonaws.com'

# Static files (CSS, JavaScript, Images)
STATIC_LOCATION = 'static'
STATIC_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/{STATIC_LOCATION}/'
STATICFILES_STORAGE = 'backend.custom_storages.StaticStorage'  # or custom_storages.StaticStorage

MEDIA_ROOT = BASE_DIR / 'media'

SYNTH_LOCATION = 'synthed_speech'
SYNTH_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/{SYNTH_LOCATION}/'
SYNTHFILES_STORAGE = 'custom_storages.SynthStorage'


#Media files
MEDIA_LOCATION = 'media'
MEDIA_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/{MEDIA_LOCATION}/'
DEFAULT_FILE_STORAGE = 'custom_storages.MediaStorage'



# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=15),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=90),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "UPDATE_LAST_LOGIN": False,

    "ALGORITHM": "HS256",
    "VERIFYING_KEY": "",
    "AUDIENCE": None,
    "ISSUER": None,
    "JSON_ENCODER": None,
    "JWK_URL": None,
    "LEEWAY": 0,

    "AUTH_HEADER_TYPES": ("Bearer",),
    "AUTH_HEADER_NAME": "HTTP_AUTHORIZATION",
    "USER_ID_FIELD": "id",
    "USER_ID_CLAIM": "user_id",
    "USER_AUTHENTICATION_RULE": "rest_framework_simplejwt.authentication.default_user_authentication_rule",

    "AUTH_TOKEN_CLASSES": ("rest_framework_simplejwt.tokens.AccessToken",),
    "TOKEN_TYPE_CLAIM": "token_type",
    "TOKEN_USER_CLASS": "rest_framework_simplejwt.models.TokenUser",

    "JTI_CLAIM": "jti",

    "SLIDING_TOKEN_REFRESH_EXP_CLAIM": "refresh_exp",
    "SLIDING_TOKEN_LIFETIME": timedelta(minutes=15),
    "SLIDING_TOKEN_REFRESH_LIFETIME": timedelta(days=1),

    "TOKEN_OBTAIN_SERIALIZER": "rest_framework_simplejwt.serializers.TokenObtainPairSerializer",
    "TOKEN_REFRESH_SERIALIZER": "rest_framework_simplejwt.serializers.TokenRefreshSerializer",
    "TOKEN_VERIFY_SERIALIZER": "rest_framework_simplejwt.serializers.TokenVerifySerializer",
    "TOKEN_BLACKLIST_SERIALIZER": "rest_framework_simplejwt.serializers.TokenBlacklistSerializer",
    "SLIDING_TOKEN_OBTAIN_SERIALIZER": "rest_framework_simplejwt.serializers.TokenObtainSlidingSerializer",
    "SLIDING_TOKEN_REFRESH_SERIALIZER": "rest_framework_simplejwt.serializers.TokenRefreshSlidingSerializer",
}


REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
}

# REACT FRONTEND
if DEBUG:
    FRONTEND_URL = 'http://localhost:3000'
    BACKEND_URL = 'http://localhost:8000'

else:
    FRONTEND_URL = 'https://studie.aussprachetrainer.org'
    # FRONTEND_URL = "https://263b-2a02-8070-8e83-2e20-6dd4-dfc5-1e1e-e626.ngrok-free.app"
    BACKEND_URL = 'https://backend.aussprachetrainer.org'


# EMAIL SETTINGS:
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.strato.de'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'kontakt@aussprachetrainer.org'
EMAIL_HOST_PASSWORD = get_secret("django-backend-email-host-password")
DEFAULT_FROM_EMAIL = 'AusspracheTrainer <kontakt@aussprachetrainer.org>'


# LOGGING
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        '': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': True,
        },
    },
}

# CELERY
CELERY_BROKER_URL = 'redis://localhost:6379/0'
CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'

CELERY_BEAT_SCHEDULE = {
    'send-reminder-emails-every-minute': {
        'task': 'accounts.tasks.send_reminder_emails',
        'schedule': 900.0,  # Run every 15min
    },
}
