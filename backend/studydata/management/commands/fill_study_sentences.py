from django.core.management.base import BaseCommand
from django.utils import timezone
import datetime
from studydata.models import StudySentences
import csv

class Command(BaseCommand):
    help = 'Populates the database with Study Sentences'


    # retrieve all english sentences from the english.csv file with id, sentence
    def get_english_sentences(self):
        with open('./english.csv', encoding="utf-8-sig") as f:
            reader = csv.reader(f)
            for row in reader:
                sentence = row[0]
                StudySentences.objects.create(
                    defaults={
                        'sentence': sentence,
                        'language': 1,
                        # TODO: handle logic for synth_filename
                    }
                )

    # retrieve all french sentences from the french.csv file with id, sentence
    def get_french_sentences(self):
        with open('./french.csv', encoding="utf-8-sig") as f:
            reader = csv.reader(f)
            for row in reader:
                sentence = row[0]
                StudySentences.objects.create(
                    defaults={
                        'sentence': sentence,
                        'language': 2,
                        # TODO: handle logic for synth_filename
                    }
                )

    def handle(self, *args, **kwargs):
        self.get_english_sentences()
        self.get_french_sentences()
        self.stdout.write(self.style.SUCCESS('Successfully populated Study Sentences with IDs.'))


    
