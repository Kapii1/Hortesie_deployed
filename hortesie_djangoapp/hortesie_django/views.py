import csv
import io
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import HttpResponse
from django.http import FileResponse
from docx import Document
from django.core.cache import cache
import os
import time
import uuid
import json
import mimetypes

def generate_uid():
    return str(uuid.uuid1())


def extract_headings_with_content(doc):
    headings = []
    current_heading = None
    current_depth = 0
    heading_stack = []
    headings_uids={}
    for paragraph in doc.paragraphs:
        if 'Heading' in paragraph.style.name :
            # Determine the depth of the current heading based on indentation
        

            # Pop headings from the stack until we find the parent of the current heading
            # Set the parent heading
            heading_uid = generate_uid()
            # If a new heading is found, save the previous heading and its content
            if current_heading is not None:
                headings.append(current_heading)

            heading_level = int(paragraph.style.name[7:])
            current_heading = {
                "uid": heading_uid,
                "title": paragraph.text,
                "content": [],
                "depth" : heading_level,
                'isChecked': True,
                'isChildDisplayed': False,
                'isDisplayed': True,
            }

            # Push the current heading to the stack
            heading_stack.append(current_heading)

        elif current_heading is not None:
            # Append the content of the current heading
            current_heading["content"].append(paragraph.text)

    # Append the last heading
    if current_heading is not None:
        current_heading["parent"] = heading_stack[-2] if len(heading_stack) >= 2 else None
        headings.append(current_heading)
    return headings


def get_modified_date(file_path):
    try:
        # Get the modification timestamp of the file in seconds since the epoch
        modification_timestamp = os.path.getmtime(file_path)

        # Convert the timestamp to a human-readable date format
        modified_date = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(modification_timestamp))

        return modified_date

    except FileNotFoundError:
        return None

def get_structure(doc):
    headings = []
    heading_stack = []
    current_heading = None
    for idx, paragraph in enumerate(doc.paragraphs):

         if "Heading" in paragraph.style.name:
             # Set the parent heading
             parent_heading = heading_stack[-1] if heading_stack else None
            
             # If a new heading is found, save the previous heading  and its content
             if current_heading is not None:
                 current_heading["parent"] = parent_heading
                 headings.append(current_heading)

             # Generate a UID for the current paragraph
             current_heading = {
                 "title": paragraph.text,
                 "content": [],
                 "depth":  int(paragraph.style.name[7:]),
                 "paragraph" : [paragraph]
             }

             # Push the current heading to the stack
             heading_stack.append(current_heading)

         elif current_heading is not None:
             # Append the content of the current heading
             current_heading["content"].append(paragraph.text)
             current_heading["paragraph"].append(paragraph)

        

     # Append the last heading
    if current_heading is not None:
        current_heading["parent"] = heading_stack[-2] if  len(heading_stack) >= 2 else None
        headings.append(current_heading)
    return headings
def delete_all_title(doc,match_dict):


     headings= get_structure(doc)
     index = 0
     print(len(headings))
     while index <len(headings):
        heading = headings[index]
        if any(heading["title"] == item.get('title')  and  heading["content"] == item.get('content') for item in match_dict):
            for parag in heading["paragraph"]:
                p = parag._element
                p.getparent().remove(p)
                p._element = None
            del headings[index]
            index -=1
        index +=1
     return headings

def remove_heading(doc, match_dict):
    delete_all_title(doc,match_dict)

    doc.save(r"hortesie_django/files/TEMPLATE_WORD_CCTP_temp.docx")


class GenerateCSVAPIView(APIView):

    def get(self, request):
        # Generate the CSV content in memory using io.BytesIO
        cached_data = cache.get('CCTP_structure')
        date_modif =get_modified_date("hortesie_django/files/TEMPLATE_WORD_CCTP.docx")
        doc=Document("hortesie_django/files/TEMPLATE_WORD_CCTP.docx")
        
        if not cache.get("CCTP_date") or date_modif> cache.get("CCTP_date"):
            # Data is not in the cache, compute it
            doc=Document("hortesie_django/files/TEMPLATE_WORD_CCTP.docx")
            data = extract_headings_with_content(doc)
            # Store the data in the cache for future use
            cache.set('CCTP_structure', data)
            cache.set("CCTP_date",date_modif)

        cached_data = cache.get('CCTP_structure')
        # Set the appropriate response headers
        response = Response(cached_data)
        return response
    def post(self, request):
        values = json.loads(request.body.decode('utf-8')).get("values")
        doc=Document("hortesie_django/files/TEMPLATE_WORD_CCTP.docx")
        remove_heading(doc,values)
        file_path = "hortesie_django/files/TEMPLATE_WORD_CCTP_temp.docx"
        with open(file_path, 'rb') as file:
            doc_data = file.read()
        # sending response 
        response = HttpResponse(doc_data, content_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document')
        response['Content-Disposition'] = 'attachment; filename="test.docx"'

        return response
