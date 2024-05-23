import os

AWS_ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY')

AWS_STORAGE_BUCKET_NAME = 'hewson-space'
AWS_S3_ENDPOINT_URL = 'https://nyc3.digitaloceanspaces.com'
AWS_LOCATION = 'https://hewson-space.nyc3.digitaloceanspaces.com'

STATICFILES_STORAGE = 'turtleproject.cdn.backends.StaticRootS3Boto3Storage'
DEFAULT_FILE_STORAGE = 'turtleproject.cdn.backends.MediaRootS3Boto3Storage'
