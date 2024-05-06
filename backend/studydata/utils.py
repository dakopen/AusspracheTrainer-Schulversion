import boto3
from django.conf import settings
import uuid
import logging

logger = logging.getLogger(__name__)

s3 = boto3.client(
    's3',
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    region_name=settings.AWS_S3_REGION_NAME
)

def download_file_from_s3(file_key):
    global s3
    
    random_name = str(uuid.uuid4())
    # Define the file path to save locally
    local_file_path = str(settings.MEDIA_ROOT) + '/audio_files_downloaded/' + random_name + '.wav'
    logger.warn(local_file_path)
    logger.warn(file_key, "FILE KEY")
    try:
        s3.download_file(settings.AWS_STORAGE_BUCKET_NAME, file_key, local_file_path)
        logger.warn("Download successful")
        print("Download successful")
        return local_file_path
    except Exception as e:
        logger.warn(f"An error occurred: {str(e)}")
        print(f"An error occurred: {str(e)}")
        return None
