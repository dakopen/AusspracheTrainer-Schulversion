from storages.backends.s3boto3 import S3Boto3Storage

class StaticStorage(S3Boto3Storage):
    location = 'static'
    default_acl = 'public-read'

class MediaStorage(S3Boto3Storage):
    location = 'media'
    default_acl = 'public-read'
    file_overwrite = True

class PrivateMediaStorage(S3Boto3Storage):
    location = 'private-media'
    default_acl = 'private'
    file_overwrite = False
    custom_domain = False

class SynthStorage(S3Boto3Storage):
    location = 'synthed_speech'
    default_acl = 'public-read'