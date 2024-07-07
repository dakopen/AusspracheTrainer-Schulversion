import boto3
from django.conf import settings
import uuid
import logging
import os
from botocore.exceptions import NoCredentialsError
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.units import inch
import pandas as pd
import matplotlib.pyplot as plt
from matplotlib.backends.backend_pdf import PdfPages
import numpy as np

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





def create_front_page(c, data, graph_image):
    width, height = letter
    
    # Top Image
    study_img = os.path.join(settings.BASE_DIR, 'media', "AusspracheTrainerStudy-Uni-Tuebingen-Logo.png")
    image_width = 315
    image_height = 126
    image_x = (width - image_width) / 2.0  # Calculate x position to center the image
    c.drawImage(study_img, image_x, height - image_height, width=image_width, height=image_height)


    # Title
    c.setFont("Helvetica", 24)  # Thinner font size
    c.drawCentredString(width / 2.0, height - 150, "AusspracheTrainer Studie")
    
    # Thank you message
    c.setFont("Helvetica", 20)
    c.drawCentredString(width / 2.0, height - 200, "Vielen Dank für Deine Teilnahme!")

    # National Flag
    flag_img = os.path.join(settings.BASE_DIR, 'media', "english_flag.png") if data["language"] == 1 else os.path.join(settings.BASE_DIR, 'media', "french_flag.png")
    c.drawImage(flag_img, width / 2.0 - 25, height - 300, width=50, height=30)
    
    # Graph
    c.drawImage(graph_image, inch, height / 2.0 - 200, width - 2 * inch, 300)

    # Footer
    c.setFont("Helvetica", 10)
    c.drawCentredString(width / 2.0, 80, "Dieser Report enthält Deine persönlichen Ergebnisse der Studie und ist nur für Dich bestimmt.")
    c.drawCentredString(width / 2.0, 60, "Bitte teile ihn nicht mit deiner/deinem Lehrer:in.")

def create_mean_scores_graph(data, graph_image):
    # Convert data to DataFrame
    
    df = pd.DataFrame(data["sentences"])
    stages = ['Initialier Test'] + [f'Training {i}' for i in range(1, 7)] + ['Finaler Test']

    # Calculate the means for each stage
    mean_scores = [
        df['accuracy'][:20].mean()  # Test 1
    ] + [
        df['accuracy'][20 + 10*(i-1):20 + 10*i].mean() for i in range(1, 7)  # Training 1 to Training 6
    ] + [
        df['accuracy'][80:100].mean()  # Test 2
    ] 
    # Plotting
    plt.figure(figsize=(10, 6))
    plt.plot(stages, mean_scores, marker='o', linestyle='-', color='purple')
    plt.title('Durchschnittliche Genauigkeit-Scores über die Studie hinweg')
    plt.ylabel('Score')
    plt.xlabel('Wiederholung nur beim Training möglich')
    plt.ylim(0, 100)
    plt.grid(True)
    
    # Save graph
    plt.savefig(graph_image)
    plt.close()

def create_user_report_pdf(data):
    # Create a canvas
    output_filename = uuid.uuid4().hex + ".pdf"
    output_filename = os.path.join(settings.BASE_DIR, 'media', 'generated_pdfs', output_filename)
    c = canvas.Canvas(output_filename, pagesize=letter)
    
    # Create graph image
    graph_image = uuid.uuid4().hex + ".png"
    create_mean_scores_graph(data, graph_image)
    
    # Create front page
    create_front_page(c, data, graph_image)

    # Add a new page for the "Initialer Test" section
    c.showPage()
    create_initial_test_section(c, data)
    
    # Add sections for Training 1-6
    create_training_sections(c, data)
    
    c.showPage()
    create_final_test_section(c, data)
    # Save the PDF
    c.save()

    # delete graph image
    os.remove(graph_image)

    return upload_report_to_s3(output_filename)


def create_initial_test_section(c, data):
    width, height = letter
    margin = inch
    
    c.setFont("Helvetica-Bold", 24)
    c.drawString(margin, height - margin, "Initialer Test")
    
    c.setFont("Helvetica", 12)
    y_position = height - margin - 40  # Initial y position for the content
    
    for sentence_data in data['sentences'][0:20]:
        sentence_counter = sentence_data['sentence_counter']
        sentence_text = sentence_data['sentence_text']
        accuracy = sentence_data['accuracy']
        
        if accuracy is not None:
            words = sentence_data['words'][0]
            
            # Check if there is enough space for the next sentence, if not, create a new page
            if y_position < margin:
                c.showPage()
                c.setFont("Helvetica-Bold", 24)
                c.drawString(margin, height - margin, "Initialer Test")
                c.setFont("Helvetica", 12)
                y_position = height - margin - 40
            
            # Draw sentence number, text, and accuracy
            c.drawString(margin, y_position, f"{sentence_counter}.")
            c.drawString(margin + 20, y_position, sentence_text)
            c.drawString(width - margin - 50, y_position, f"{accuracy:.2f}%")
            
            y_position -= 20  # Move to next line for word scores
            
            # Draw word scores with colors
            x_position = margin + 20
            for word, score, error_type in words:
                color = calculate_color(score)
                c.setFillColor(color)
                text = f"{word}"
                text_width = c.stringWidth(text, "Helvetica", 12)
                
                if x_position + text_width > width - margin:
                    y_position -= 15  # Move to next line if the text exceeds the page width
                    x_position = margin + 20
                
                c.drawString(x_position, y_position, text)
                x_position += text_width + 5  # Add a small space between words
            
            y_position -= 40  # Space between sentences
            
            # Reset fill color to black for the next sentence
            c.setFillColor(colors.black)
        else:
            # Check if there is enough space for the next sentence, if not, create a new page
            if y_position < margin:
                c.showPage()
                c.setFont("Helvetica-Bold", 24)
                c.drawString(margin, height - margin, "Initialer Test")
                c.setFont("Helvetica", 12)
                y_position = height - margin - 40

            # Draw sentence number and text
            c.drawString(margin, y_position, f"{sentence_counter}.")
            c.drawString(margin + 20, y_position, sentence_text)
            y_position -= 20



def create_final_test_section(c, data):
    width, height = letter
    margin = inch
    
    c.setFont("Helvetica-Bold", 24)
    c.drawString(margin, height - margin, "Finaler Test")
    
    c.setFont("Helvetica", 12)
    y_position = height - margin - 40  # Initial y position for the content
    
    for sentence_data in data['sentences'][80:100]:
        sentence_counter = sentence_data['sentence_counter']
        sentence_text = sentence_data['sentence_text']
        accuracy = sentence_data['accuracy']
        
        if accuracy is not None:
            words = sentence_data['words'][0]
            
            # Check if there is enough space for the next sentence, if not, create a new page
            if y_position < margin:
                c.showPage()
                c.setFont("Helvetica-Bold", 24)
                c.drawString(margin, height - margin, "Finaler Test")
                c.setFont("Helvetica", 12)
                y_position = height - margin - 40
            
            # Draw sentence number, text, and accuracy
            c.drawString(margin, y_position, f"{sentence_counter}.")
            c.drawString(margin + 20, y_position, sentence_text)
            c.drawString(width - margin - 50, y_position, f"{accuracy:.2f}%")
            
            y_position -= 20  # Move to next line for word scores
            
            # Draw word scores with colors
            x_position = margin + 20
            for word, score, error_type in words:
                color = calculate_color(score)
                c.setFillColor(color)
                text = f"{word}"
                text_width = c.stringWidth(text, "Helvetica", 12)
                
                if x_position + text_width > width - margin:
                    y_position -= 15  # Move to next line if the text exceeds the page width
                    x_position = margin + 20
                
                c.drawString(x_position, y_position, text)
                x_position += text_width + 5  # Add a small space between words
            
            y_position -= 40  # Space between sentences
            
            # Reset fill color to black for the next sentence
            c.setFillColor(colors.black)
        else:
            # Check if there is enough space for the next sentence, if not, create a new page
            if y_position < margin:
                c.showPage()
                c.setFont("Helvetica-Bold", 24)
                c.drawString(margin, height - margin, "Initialer Test")
                c.setFont("Helvetica", 12)
                y_position = height - margin - 40

            # Draw sentence number and text
            c.drawString(margin, y_position, f"{sentence_counter}.")
            c.drawString(margin + 20, y_position, sentence_text)
            y_position -= 20

def create_training_sections(c, data):
    width, height = letter
    margin = inch
    training_stages = ['Training 1', 'Training 2', 'Training 3', 'Training 4', 'Training 5', 'Training 6']
    
    for i, stage in enumerate(training_stages):
        c.showPage()
        c.setFont("Helvetica-Bold", 24)
        c.drawString(margin, height - margin, stage)
        
        c.setFont("Helvetica", 12)
        y_position = height - margin - 40  # Initial y position for the content
        
        for sentence_data in data['sentences'][20 + 10 * i: 20 + 10 * (i + 1)]:
            sentence_counter = sentence_data['sentence_counter']
            sentence_text = sentence_data['sentence_text']
            accuracy = sentence_data['accuracy']
            
            if accuracy is not None:
                words_list = sentence_data['words']
                
                # Check if there is enough space for the next sentence, if not, create a new page
                if y_position < margin:
                    c.showPage()
                    c.setFont("Helvetica-Bold", 24)
                    c.drawString(margin, height - margin, stage)
                    c.setFont("Helvetica", 12)
                    y_position = height - margin - 40
                
                # Draw sentence number, text, and accuracy
                c.drawString(margin, y_position, f"{sentence_counter}.")
                c.drawString(margin + 20, y_position, sentence_text)
                c.drawString(width - margin - 50, y_position, f"{accuracy:.2f}%")
                
                y_position -= 20  # Move to next line for word scores
                
                # Draw word scores with colors
                for words in words_list:
                    x_position = margin + 20
                    for word, score, error_type in words:
                        color = calculate_color(score)
                        c.setFillColor(color)
                        text = f"{word}"
                        text_width = c.stringWidth(text, "Helvetica", 12)
                        
                        if x_position + text_width > width - margin:
                            y_position -= 15  # Move to next line if the text exceeds the page width
                            x_position = margin + 20
                        
                        c.drawString(x_position, y_position, text)
                        x_position += text_width + 5  # Add a small space between words
                    
                    y_position -= 15  # Add space between multiple word scores
                
                y_position -= 25  # Space between sentences
                
                # Reset fill color to black for the next sentence
                c.setFillColor(colors.black)
            else:
                # Check if there is enough space for the next sentence, if not, create a new page
                if y_position < margin:
                    c.showPage()
                    c.setFont("Helvetica-Bold", 24)
                    c.drawString(margin, height - margin, stage)
                    c.setFont("Helvetica", 12)
                    y_position = height - margin - 40

                # Draw sentence number and text
                c.drawString(margin, y_position, f"{sentence_counter}.")
                c.drawString(margin + 20, y_position, sentence_text)
                y_position -= 20

def calculate_color(score):
    # Function to calculate color based on score
    if score >= 87:
        return colors.green
    elif score >= 60:
        return colors.gold
    else:
        return colors.red


