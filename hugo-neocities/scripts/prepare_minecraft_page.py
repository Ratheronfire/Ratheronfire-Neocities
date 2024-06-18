import os
from sys import argv
from hugo_page_helpers import read_hugo_page, write_hugo_page

def prepare_file(minecraft_dir: str):
    image_dir = os.path.join(minecraft_dir, 'img')
    
    for root, dirs, files in os.walk(image_dir):
        image_count = len(files)
        # for file in files:
        #     print(os.path.join(root, file))
    
    index_path = os.path.join(minecraft_dir, '_index.md')
    index_data, index_body = read_hugo_page(index_path)
    
    index_data['minecraft_slides'] = []    
    for i in range(image_count):
        index_data['minecraft_slides'].append({'id': i, 'title': '', 'text': '', 'links': []})
    
    write_hugo_page(index_path, index_data, index_body)

prepare_file(argv[1])