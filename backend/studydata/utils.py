import boto3
from django.conf import settings
import uuid
import logging
import os
from botocore.exceptions import NoCredentialsError
logger = logging.getLogger(__name__)

s3 = boto3.client(
    's3',
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    region_name=settings.AWS_S3_REGION_NAME
)




def upload_report_to_s3(pdf_name):
    s3_client = boto3.client(
        's3',
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_S3_REGION_NAME
    )

    object_name = f"private-media/student-reports-pdf/{pdf_name}"

    try:
        with open(pdf_name, "rb") as file_data:
            s3_client.upload_fileobj(file_data, settings.AWS_STORAGE_BUCKET_NAME, object_name)

        presigned_url = s3_client.generate_presigned_url(
            'get_object',
            Params={'Bucket': settings.AWS_STORAGE_BUCKET_NAME, 'Key': object_name},
            ExpiresIn=3600*24*7
        )
		
        os.remove(pdf_name)
        return presigned_url

    except NoCredentialsError:
        return "Credentials not available"



def create_user_report_pdf(user_data):

    pdf_name = uuid.uuid4().hex + ".pdf"
    
    pass