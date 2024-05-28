import random
import string
from django.contrib.auth import get_user_model
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import Color
from reportlab.pdfgen import canvas
import uuid
import boto3
from botocore.exceptions import NoCredentialsError
from backend import settings
import os

User = get_user_model()

def generate_random_username():
    """Generate a unique username that does not exist in the database."""
    while True:
        username = ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))
        if not User.objects.filter(username=f"{username}@studie.aussprachetrainer.org").exists():
            return username


def create_pdf_for_usernames(usernames, course_name, course_id):

	url = "studie.aussprachetrainer.org"
	# generate random pdf name
	course_name = ''.join(e for e in course_name if e.isalnum() or e == ' ')
    
	pdf_name = f"Zugangsdaten Schüler für Kurs ({course_id}) {course_name}.pdf"
	pdf_name = os.path.join(settings.BASE_DIR, 'media', 'generated_pdfs', pdf_name)

	# Create a PDF with ReportLab
	c = canvas.Canvas(pdf_name, pagesize=A4)
	width, height = A4  # Width and height of the page

	# Define cell width and height
	cell_width = width / 2
	cell_height = height / 4

	index = 0
	# Define custom color for username
	rosa_color = Color(170/255, 107/255, 253/255, alpha=1)
	# Define black color for text
	black_color = Color(0, 0, 0, alpha=1)

	# Number of rows and columns
	rows, cols = 4, 2

	# Loop through all usernames and allocate them to pages
	while index < len(usernames):
		for i in range(rows):  # Rows
			for j in range(cols):  # Columns
				if index >= len(usernames):
					break  # Exit if no more usernames to process

				x = j * cell_width
				y = height - (i + 1) * cell_height

				username = usernames[index]
				index += 1

				# Positions for username parts and hyphens
				part1 = username[:3]
				hyphen1 = " - "
				part2 = username[3:7]
				hyphen2 = " - "
				part3 = username[7:]

				# Calculate text positions
				c.setFont("Helvetica-Bold", 18)
				c.setFillColor(rosa_color)
				part1_width = c.stringWidth(part1, "Helvetica-Bold", 18)
				hyphen1_width = c.stringWidth(hyphen1, "Helvetica", 18)
				part2_width = c.stringWidth(part2, "Helvetica-Bold", 18)
				hyphen2_width = c.stringWidth(hyphen2, "Helvetica", 18)
				part3_width = c.stringWidth(part3, "Helvetica-Bold", 18)

				total_width = part1_width + hyphen1_width + part2_width + hyphen2_width + part3_width
				current_x = x + (cell_width - total_width) / 2

				# Draw parts of the username
				c.drawString(current_x, y + cell_height / 2 + 10, part1)
				current_x += part1_width
				c.setFont("Helvetica", 18)
				c.setFillColor(black_color)
				c.drawString(current_x, y + cell_height / 2 + 10, hyphen1)
				current_x += hyphen1_width
				c.setFont("Helvetica-Bold", 18)
				c.setFillColor(rosa_color)
				c.drawString(current_x, y + cell_height / 2 + 10, part2)
				current_x += part2_width
				c.setFont("Helvetica", 18)
				c.setFillColor(black_color)
				c.drawString(current_x, y + cell_height / 2 + 10, hyphen2)
				current_x += hyphen2_width
				c.setFont("Helvetica-Bold", 18)
				c.setFillColor(rosa_color)
				c.drawString(current_x, y + cell_height / 2 + 10, part3)

				# Draw URL directly below the username
				c.setFont("Helvetica", 10)
				c.setFillColor(black_color)
				url_width = c.stringWidth(url, "Helvetica", 10)
				c.drawString(x + (cell_width - url_width) / 2, y + cell_height / 2 - 30, url)

				# Draw a rectangle around the cell for visual separation
				c.rect(x, y, cell_width, cell_height, fill=0)

		if index < len(usernames):  # More usernames left, add a new page
			c.showPage()
	c.setTitle("AusspracheTrainer Studie")
	course_name = ''.join(e for e in course_name if e.isalnum() or e == ' ')
	c.save()
    
	return upload_pdf_to_s3(pdf_name)

def upload_pdf_to_s3(pdf_name):
    s3_client = boto3.client(
        's3',
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_S3_REGION_NAME
    )

    object_name = f"private-media/student-usernames-pdf/{pdf_name}"

    try:
        with open(pdf_name, "rb") as file_data:
            s3_client.upload_fileobj(file_data, settings.AWS_STORAGE_BUCKET_NAME, object_name)

        presigned_url = s3_client.generate_presigned_url(
            'get_object',
            Params={'Bucket': settings.AWS_STORAGE_BUCKET_NAME, 'Key': object_name},
            ExpiresIn=3600
        )
		
        os.remove(pdf_name)
        return presigned_url

    except NoCredentialsError:
        return "Credentials not available"

